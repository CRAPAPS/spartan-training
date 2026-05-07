import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { QuizClient } from '@/components/quiz/QuizClient';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function ModuleQuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // RLS hard gate — operator can only access module if prior module is complete
  const { data: module } = await supabase
    .from('mjm_modules')
    .select('id, title, passing_score, description')
    .eq('id', id)
    .single();

  if (!module) redirect('/dashboard?gate=blocked');

  // Fetch questions (no correct answers — service role but answers stripped server-side)
  const { data: questions } = await supabaseAdmin
    .from('quiz_questions')
    .select('id, sequence, question, option_a, option_b, option_c, option_d, is_critical, topic')
    .eq('module_id', id)
    .order('sequence');

  if (!questions?.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          No questions available for {id}
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)' }}>
          This module&apos;s assessment is pending content upload.
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 48px' }}>
      <QuizClient
        moduleId={id}
        moduleTitle={module.title}
        passingScore={module.passing_score ?? 80}
        questions={questions}
      />
    </div>
  );
}
