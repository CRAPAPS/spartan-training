export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { sendCriticalFailAlert } from '@/lib/email';
import { isPracticalModule } from '@/lib/practicals';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-build-only',
  { auth: { persistSession: false } }
);

interface RouteContext {
  params: Promise<{ moduleId: string }>;
}

// POST — submit answers, evaluate, write operator_progress + quiz_sessions
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Practical report gate — server-side mirror of the quiz page gate (PI-13/14/19)
  if (isPracticalModule(moduleId)) {
    const { data: self } = await admin
      .from('operators').select('role').eq('id', user.id).single();
    const role = (self as { role?: string } | null)?.role ?? 'agent';
    if (!['admin', 'coordinator', 'super_admin'].includes(role)) {
      const { data: sub } = await admin
        .from('report_submissions')
        .select('id')
        .eq('operator_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();
      if (!sub) {
        return NextResponse.json({ error: 'Practical report must be submitted before assessment' }, { status: 403 });
      }
    }
  }

  const body = await req.json();
  // answers: Record<questionId, originalKey | null>  (originalKey = A|B|C|D from DB)
  const answers: Record<string, string | null> = body.answers ?? {};
  const behavioralData: unknown = body.behavioralData ?? null;

  function isValidBehavioralData(data: unknown): boolean {
    if (data == null || !Array.isArray(data)) return true;
    return data.every(e =>
      e && typeof e === 'object' &&
      typeof (e as Record<string, unknown>).type === 'string' &&
      typeof (e as Record<string, unknown>).timestamp === 'string'
    );
  }
  if (!isValidBehavioralData(behavioralData)) {
    return NextResponse.json({ error: 'Invalid behavioral data' }, { status: 400 });
  }

  // Fetch questions WITH correct answers (service role — never returned to browser)
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

  // ── Evaluate ─────────────────────────────────────────────────────────────────
  let correctCount   = 0;
  let criticalFail   = false;
  let criticalFailId: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedback = (questions as any[]).map((q: any) => {
    // answers[q.id] is the originalKey submitted by the client (A/B/C/D or null)
    const given   = answers[q.id] ?? null;
    const isRight = given !== null && given === q.correct;
    if (isRight) correctCount++;

    if (!isRight && q.is_critical && !criticalFail) {
      criticalFail   = true;
      criticalFailId = q.id as string;
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

  const score   = Math.round((correctCount / questions.length) * 100);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passing = (module as any).passing_score ?? 80;
  const passed  = score >= passing && !criticalFail;
  const status  = criticalFail ? 'reset' : (passed ? 'completed' : 'failed');

  // ── Fetch current attempt count ───────────────────────────────────────────────
  const { data: existing } = await admin
    .from('operator_progress')
    .select('attempts, scorm_data')
    .eq('operator_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attempts      = ((existing as any)?.attempts ?? 0) + 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingScorm = (existing as any)?.scorm_data ?? {};

  // ── Write progress ────────────────────────────────────────────────────────────
  await admin.from('operator_progress').upsert({
    operator_id:  user.id,
    module_id:    moduleId,
    status,
    is_competent: passed,
    score,
    attempts,
    scorm_data:   { ...existingScorm, quiz: true },
    completed_at: passed ? new Date().toISOString() : null,
    reset_at:     criticalFail ? new Date().toISOString() : null,
    updated_at:   new Date().toISOString(),
  }, { onConflict: 'operator_id,module_id' });

  // ── Record quiz session (with behavioral data) ────────────────────────────────
  await admin.from('quiz_sessions').insert({
    operator_id:    user.id,
    module_id:      moduleId,
    submitted_at:   new Date().toISOString(),
    score,
    passed,
    critical_fail:  criticalFail,
    answers,
    behavioral_data: behavioralData,
  });

  // ── Critical fail email alert ─────────────────────────────────────────────────
  if (criticalFail) {
    const { data: op } = await admin
      .from('operators')
      .select('full_name, email, operator_id, commander_email')
      .eq('id', user.id)
      .single();
    const { data: mod } = await admin
      .from('mjm_modules')
      .select('title')
      .eq('id', moduleId)
      .single();
    if (op && mod) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const o = op as any; const m = mod as any;
      sendCriticalFailAlert(
        o.email, o.full_name, o.operator_id,
        moduleId, m.title, o.commander_email ?? null,
      ).catch(err => console.error('[quiz] critical fail email failed:', err));
    }
  }

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
