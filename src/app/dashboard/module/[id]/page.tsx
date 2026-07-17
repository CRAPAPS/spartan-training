import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { scormCloud } from '@/lib/scormCloud';
import { SCORMPlayerClient } from '@/components/course/SCORMPlayerClient';
import { SlidePlayerClient } from '@/components/course/SlidePlayerClient';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';
import { Rule } from '@/components/primitives/Rule';
import type { Slide, PracticalSubmissionState } from '@/types/lesson';
import { isPracticalModule } from '@/lib/practicals';

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Fetch module via admin client (RLS publishable-key issue bypassed).
  // Gate is enforced in application code below.
  const { data: module } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, description, scorm_course_id, passing_score, sequence_order, is_active, track')
    .eq('id', id)
    .single();

  if (!module || !module.is_active) redirect('/dashboard?gate=blocked');

  // Application-level sequential gate — track-aware, works for any course prefix
  const { data: operatorRow } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const userRole = (operatorRow as { role?: string } | null)?.role ?? 'agent';
  const isPrivileged = userRole === 'admin' || userRole === 'coordinator' || userRole === 'super_admin';

  // Enrollment gate — agent must be enrolled in this track to access any module
  if (!isPrivileged) {
    const { data: enrollment } = await supabaseAdmin
      .from('operator_enrollments')
      .select('id')
      .eq('operator_id', user.id)
      .eq('track', module.track)
      .single();
    if (!enrollment) redirect('/dashboard?gate=not-enrolled');
  }

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

  // Check operator's existing progress for this module
  const { data: progress } = await supabaseAdmin
    .from('operator_progress')
    .select('status, score, attempts, is_competent, completed_at, scorm_data')
    .eq('operator_id', user!.id)
    .eq('module_id', id)
    .single();

  // Fetch lesson slides if available
  const { data: lesson } = await supabaseAdmin
    .from('module_lessons')
    .select('slides, slide_count')
    .eq('module_id', id)
    .single();

  // Practical report submission state (PI-13/14/19) — powers the upload widget
  let practicalSubmission: PracticalSubmissionState | null = null;
  if (isPracticalModule(id)) {
    const { data: sub } = await supabaseAdmin
      .from('report_submissions')
      .select('status, file_name, submitted_at, grade, feedback')
      .eq('operator_id', user.id)
      .eq('module_id', id)
      .maybeSingle();
    if (sub) {
      practicalSubmission = {
        status: sub.status as 'submitted' | 'graded',
        fileName: sub.file_name as string,
        submittedAt: sub.submitted_at as string,
        grade: (sub.grade ?? null) as 'pass' | 'fail' | null,
        feedback: (sub.feedback ?? null) as string | null,
      };
    }
  }

  const initialSlide = (progress?.scorm_data as Record<string, unknown> | null)
    ?.lesson
    ? ((progress!.scorm_data as Record<string, unknown>).lesson as Record<string, unknown>).currentSlide as number ?? 0
    : 0;

  const TRACK_LABEL: Record<string, string> = {
    'armed-security':   'MJM 2026 Armed Security',
    'private-detective': 'MJM 2026 Private Detective',
    'unarmed-security': 'MJM 2026 Unarmed Security',
  };
  const trackLabel = TRACK_LABEL[module.track as string] ?? 'MJM 2026';

  if (module.scorm_course_id === 'TBD') {
    return (
      <div className="module-page">

        {/* Module header */}
        <div className="module-header">
          <MonoLabel style={{ marginBottom: '10px' }}>{module.id} · {trackLabel}</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, marginBottom: '12px' }}>
            {module.title}
          </h1>
          {module.description && (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
              {module.description}
            </p>
          )}
        </div>

        <Rule style={{ marginBottom: '28px' }} />

        {/* Progress strip */}
        {progress && (
          <div style={{ display: 'flex', gap: '28px', padding: '16px 20px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', marginBottom: '28px', flexWrap: 'wrap' }}>
            <ProgressStat label="Status" value={progress.status?.replace('_', ' ').toUpperCase()} />
            {progress.score != null && <ProgressStat label="Last Score" value={`${progress.score}%`} highlight={progress.is_competent ?? false} />}
            {progress.attempts != null && <ProgressStat label="Attempts" value={String(progress.attempts)} />}
            {progress.completed_at && <ProgressStat label="Completed" value={new Date(progress.completed_at).toLocaleDateString()} />}
          </div>
        )}

        {/* Lesson player or video placeholder */}
        {lesson && Array.isArray(lesson.slides) && lesson.slides.length > 0 ? (
          <SlidePlayerClient
            moduleId={id}
            slides={lesson.slides as Slide[]}
            initialSlide={initialSlide}
            passingScore={module.passing_score ?? 80}
            practicalSubmission={practicalSubmission}
          />
        ) : (
          <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', marginBottom: '28px', display: 'flex', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-mute)', textTransform: 'uppercase', paddingTop: '2px', flexShrink: 0 }}>
              VIDEO
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
              Video content for this module is being produced via Colossyan AI and will be embedded here once the SCORM package is uploaded. The knowledge assessment is available now — review the module objectives above before proceeding.
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="module-cta">
          <Link href={`/dashboard/module/${id}/quiz`}>
            <BrassButton variant="primary" size="md">
              {progress?.is_competent ? 'Retake Assessment' : 'Begin Knowledge Assessment'} ⤳
            </BrassButton>
          </Link>
          <Link href="/dashboard/curriculum">
            <BrassButton variant="ghost" size="md">Back to Curriculum</BrassButton>
          </Link>
        </div>

        <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          Passing threshold: {module.passing_score ?? 80}% · Critical Fail active
        </div>
      </div>
    );
  }

  // Create SCORM Cloud registration and get launch URL
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:7473';
  const returnUrl = `${baseUrl}/dashboard`;

  try {
    await scormCloud.createRegistration(user.id, module.id, module.scorm_course_id);
  } catch {
    // Registration may already exist — continue to launch URL
  }

  const launchUrl = await scormCloud.getLaunchUrl(user.id, module.id, returnUrl);

  return (
    <div style={{ height: 'calc(100vh - 36px - 64px)' }}>
      <SCORMPlayerClient
        launchUrl={launchUrl}
        moduleId={module.id}
        moduleTitle={module.title}
      />
    </div>
  );
}

function ProgressStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', marginBottom: '3px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: highlight ? 'var(--success, #22c55e)' : 'var(--ink)' }}>{value}</div>
    </div>
  );
}
