import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { generateModuleQuiz } from '@/lib/claudeQuizmaster';

export const maxDuration = 120; // Claude can take up to 60s for quiz generation

interface RouteContext { params: Promise<{ moduleId: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const role = (self as any)?.role ?? 'agent';
  if (role !== 'admin' && role !== 'coordinator' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: module } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, passing_score')
    .eq('id', moduleId)
    .single();

  if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const questionCount = Math.min(Math.max(Number(body.questionCount ?? 10), 5), 20);

  const quiz = await generateModuleQuiz(
    (module as any).id,
    (module as any).title,
    (module as any).passing_score ?? 80,
    questionCount
  );

  // Remove any previous AI-generated questions for this module
  await supabaseAdmin
    .from('quiz_questions')
    .delete()
    .eq('module_id', moduleId)
    .like('id', `${moduleId.toLowerCase()}-q%`);

  const rows = quiz.questions.map((q, idx) => ({
    id:          `${moduleId.toLowerCase()}-q${String(idx + 1).padStart(2, '0')}`,
    module_id:   moduleId,
    sequence:    idx + 1,
    question:    q.question,
    option_a:    q.options.A,
    option_b:    q.options.B,
    option_c:    q.options.C,
    option_d:    q.options.D,
    correct:     q.correct,
    explanation: q.explanation,
    is_critical: q.isCritical,
    topic:       q.topic,
  }));

  const { error } = await supabaseAdmin.from('quiz_questions').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ count: rows.length, moduleId });
}
