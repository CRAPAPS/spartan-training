import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { QuizClient } from '@/components/quiz/QuizClient';
import { CooldownScreen } from '@/components/quiz/CooldownScreen';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { shuffle } from '@/lib/shuffle';
import type { ShuffledQuestion, ShuffledOption } from '@/types/quiz';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function ModuleQuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Use admin client — publishable key breaks PostgREST queries
  const { data: module } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, passing_score, sequence_order, is_active, track')
    .eq('id', id)
    .single();

  if (!module || !module.is_active) redirect('/dashboard?gate=blocked');

  // Application-level gates — mirrors module page
  const { data: operatorRow } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const role = (operatorRow as { role?: string } | null)?.role ?? 'agent';
  const isPrivileged = role === 'admin' || role === 'coordinator' || role === 'super_admin';

  // Enrollment gate — agent must be enrolled in this track to access any quiz
  if (!isPrivileged) {
    const { data: enrollment } = await supabaseAdmin
      .from('operator_enrollments')
      .select('id')
      .eq('operator_id', user.id)
      .eq('track', module.track)
      .single();
    if (!enrollment) redirect('/dashboard?gate=not-enrolled');
  }

  // Track-aware sequential gate — fetch prev module by track + sequence_order
  if (!isPrivileged && module.sequence_order > 1) {
    const { data: prevModule } = await supabaseAdmin
      .from('mjm_modules')
      .select('id')
      .eq('track', module.track)
      .eq('sequence_order', module.sequence_order - 1)
      .single();
    if (prevModule) {
      const { data: prevProgress } = await supabaseAdmin
        .from('operator_progress')
        .select('is_competent')
        .eq('operator_id', user.id)
        .eq('module_id', prevModule.id)
        .single();
      if (!prevProgress?.is_competent) redirect('/dashboard?gate=blocked');
    }
  }

  // 24-hour cooldown: check for a recent critical fail on this module
  const { data: lastCritFail } = await supabaseAdmin
    .from('quiz_sessions')
    .select('submitted_at')
    .eq('operator_id', user.id)
    .eq('module_id', id)
    .eq('critical_fail', true)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastCritFail?.submitted_at) {
    const cooldownUntil = new Date(lastCritFail.submitted_at).getTime() + 24 * 60 * 60 * 1000;
    if (Date.now() < cooldownUntil) {
      return (
        <div style={{ padding: '40px 48px' }}>
          <CooldownScreen
            moduleId={id}
            moduleTitle={module.title}
            cooldownUntil={new Date(cooldownUntil).toISOString()}
          />
        </div>
      );
    }
  }

  // Fetch raw questions (correct answers excluded — graded server-side)
  const { data: rawQuestions } = await supabaseAdmin
    .from('quiz_questions')
    .select('id, sequence, question, option_a, option_b, option_c, option_d, is_critical, topic')
    .eq('module_id', id)
    .order('sequence');

  if (!rawQuestions?.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '12px' }}>
        <MonoLabel>No questions available for {id}</MonoLabel>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)' }}>
          This module&apos;s assessment is pending content upload.
        </span>
      </div>
    );
  }

  // Attempt number (for display)
  const { data: progress } = await supabaseAdmin
    .from('operator_progress')
    .select('attempts')
    .eq('operator_id', user.id)
    .eq('module_id', id)
    .maybeSingle();
  const attemptNumber = ((progress as { attempts?: number } | null)?.attempts ?? 0) + 1;

  // Server-side Fisher-Yates shuffle of question order AND option order within each question
  const shuffledQuestions: ShuffledQuestion[] = shuffle(
    (rawQuestions as Array<{
      id: string; sequence: number; question: string;
      option_a: string; option_b: string; option_c: string; option_d: string;
      is_critical: boolean; topic: string;
    }>)
  ).map(q => {
    const shuffledOpts = shuffle<{ originalKey: string; text: string }>([
      { originalKey: 'A', text: q.option_a },
      { originalKey: 'B', text: q.option_b },
      { originalKey: 'C', text: q.option_c },
      { originalKey: 'D', text: q.option_d },
    ]);
    const LABELS = ['A', 'B', 'C', 'D'];
    return {
      id: q.id,
      question: q.question,
      is_critical: q.is_critical,
      topic: q.topic,
      options: shuffledOpts.map((o, i): ShuffledOption => ({
        label: LABELS[i],
        text: o.text,
        originalKey: o.originalKey,
      })),
    };
  });

  return (
    <div style={{ padding: '40px 48px' }}>
      <QuizClient
        moduleId={id}
        moduleTitle={module.title}
        passingScore={module.passing_score ?? 80}
        questions={shuffledQuestions}
        attemptNumber={attemptNumber}
      />
    </div>
  );
}
