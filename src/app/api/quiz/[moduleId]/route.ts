export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// Raw untyped admin client — used here because new quiz tables aren't in
// the generated Database type yet (run npm run db:generate-types after migrating).
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-build-only',
  { auth: { persistSession: false } }
);

interface RouteContext {
  params: Promise<{ moduleId: string }>;
}

// GET — fetch questions for a module (correct answers NOT exposed)
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // RLS hard gate: operator can only access this module if previous is complete
  const { data: module } = await supabase
    .from('mjm_modules')
    .select('id, title, passing_score')
    .eq('id', moduleId)
    .single();

  if (!module) return NextResponse.json({ error: 'Module not found or access denied' }, { status: 404 });

  const { data: questions, error } = await admin
    .from('quiz_questions')
    .select('id, sequence, question, option_a, option_b, option_c, option_d, is_critical, topic')
    .eq('module_id', moduleId)
    .order('sequence');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    moduleId,
    moduleTitle: module.title,
    passingScore: module.passing_score,
    questions: questions ?? [],
  });
}

// POST — submit answers, evaluate, write operator_progress
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const answers: Record<string, string> = body.answers ?? {};

  // Fetch questions WITH correct answers (service role — never sent to browser)
  const { data: questions, error: qError } = await admin
    .from('quiz_questions')
    .select('id, sequence, question, correct, is_critical, explanation')
    .eq('module_id', moduleId)
    .order('sequence');

  if (qError || !questions?.length) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }

  const { data: module } = await admin
    .from('mjm_modules')
    .select('passing_score')
    .eq('id', moduleId)
    .single();

  if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  // ── Evaluate ────────────────────────────────────────────────────────────────
  let correctCount = 0;
  let criticalFail = false;
  let criticalFailId: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedback = (questions as any[]).map((q: any) => {
    const given  = answers[q.id] ?? null;
    const isRight = given === q.correct;
    if (isRight) correctCount++;

    if (!isRight && q.is_critical && !criticalFail) {
      criticalFail = true;
      criticalFailId = q.id;
    }

    return {
      questionId:  q.id as string,
      sequence:    q.sequence as number,
      question:    q.question as string,
      given,
      answer:      q.correct as string,
      correct:     isRight,
      isCritical:  q.is_critical as boolean,
      explanation: (q.explanation ?? '') as string,
    };
  });

  const score  = Math.round((correctCount / questions.length) * 100);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passing = (module as any).passing_score ?? 80;
  const passed  = score >= passing && !criticalFail;
  const status  = criticalFail ? 'reset' : (passed ? 'completed' : 'failed');

  // ── Fetch current attempt count ─────────────────────────────────────────────
  const { data: existing } = await admin
    .from('operator_progress')
    .select('attempts')
    .eq('operator_id', user.id)
    .eq('module_id', moduleId)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attempts = ((existing as any)?.attempts ?? 0) + 1;

  // ── Write progress (service role only — no client path to this data) ─────────
  await admin.from('operator_progress').upsert({
    operator_id:  user.id,
    module_id:    moduleId,
    status,
    is_competent: passed,
    score,
    attempts,
    scorm_data:   { quiz: true, answers },
    completed_at: passed ? new Date().toISOString() : null,
    reset_at:     criticalFail ? new Date().toISOString() : null,
    updated_at:   new Date().toISOString(),
  }, { onConflict: 'operator_id,module_id' });

  // ── Record quiz session ─────────────────────────────────────────────────────
  await admin.from('quiz_sessions').insert({
    operator_id:   user.id,
    module_id:     moduleId,
    submitted_at:  new Date().toISOString(),
    score,
    passed,
    critical_fail: criticalFail,
    answers,
  });

  return NextResponse.json({
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score,
    passed,
    criticalFail,
    criticalFailId,
    status,
    attempts,
    feedback,
  });
}
