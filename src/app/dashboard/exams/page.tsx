import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const TRACK_LABEL: Record<string, string> = {
  'armed-security': 'Armed Security',
  'private-detective': 'Private Detective',
  'unarmed-security': 'Unarmed Security',
};

export default async function ExamsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // All data via admin client — publishable key breaks PostgREST
  const [{ data: enrollments }, { data: allProgress }, { data: allSessions }] = await Promise.all([
    supabaseAdmin.from('operator_enrollments').select('track').eq('operator_id', user.id),
    supabaseAdmin.from('operator_progress').select('module_id, is_competent, score, attempts').eq('operator_id', user.id),
    supabaseAdmin
      .from('quiz_sessions')
      .select('id, module_id, submitted_at, score, passed, critical_fail')
      .eq('operator_id', user.id)
      .order('submitted_at', { ascending: false }),
  ]);

  const enrolledTracks = (enrollments ?? []).map(e => e.track as string);

  // Fetch modules for each enrolled track
  const trackModulesMap: Record<string, Array<{ id: string; title: string; sequence_order: number; passing_score: number | null }>> = {};
  await Promise.all(
    enrolledTracks.map(async track => {
      const { data } = await supabaseAdmin
        .from('mjm_modules')
        .select('id, title, sequence_order, passing_score')
        .eq('track', track)
        .eq('is_active', true)
        .order('sequence_order');
      trackModulesMap[track] = data ?? [];
    })
  );

  const progressMap = Object.fromEntries(
    (allProgress ?? []).map(p => [p.module_id as string, p])
  );

  // Per-track exam eligibility
  const trackExams = enrolledTracks.map(track => {
    const modules = trackModulesMap[track] ?? [];
    const finalModule = modules[modules.length - 1] ?? null;
    const prereqModules = modules.slice(0, -1);
    const totalPrereqs = prereqModules.length;
    const competentPrereqs = prereqModules.filter(m => progressMap[m.id]?.is_competent).length;
    const allPrereqsDone = totalPrereqs > 0 && competentPrereqs === totalPrereqs;
    const finalExamPassed = finalModule ? (progressMap[finalModule.id]?.is_competent ?? false) : false;
    return { track, label: TRACK_LABEL[track] ?? track, finalModule, totalPrereqs, competentPrereqs, allPrereqsDone, finalExamPassed };
  });

  // Module map for session log
  const moduleMap = Object.fromEntries(
    Object.values(trackModulesMap).flat().map(m => [m.id, m])
  );

  const sessions = allSessions ?? [];
  const totalSessions = sessions.length;
  const passedSessions = sessions.filter(s => s.passed).length;
  const criticalSessions = sessions.filter(s => s.critical_fail).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Assessments</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Final Examinations
          </h1>
        </div>
      </div>

      <Rule />

      {/* ── Per-track final exam eligibility cards ──────── */}
      <section>
        <MonoLabel style={{ display: 'block', marginBottom: '16px' }}>Accreditation Examinations</MonoLabel>

        {enrolledTracks.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <MonoLabel>No courses enrolled</MonoLabel>
            <MonoLabel size="xs" style={{ maxWidth: '360px' }}>
              Contact your coordinator to be enrolled in a course track.
            </MonoLabel>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trackExams.map(exam => {
              if (!exam.finalModule) return null;
              const pct = exam.totalPrereqs > 0 ? Math.round((exam.competentPrereqs / exam.totalPrereqs) * 100) : 0;
              const borderColor = exam.finalExamPassed
                ? 'var(--success)'
                : exam.allPrereqsDone
                ? 'var(--brass)'
                : 'var(--border)';

              return (
                <div
                  key={exam.track}
                  style={{
                    border: `1px solid ${borderColor}`,
                    background: 'var(--bg-elev-1)',
                    padding: '28px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Track + exam title */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <MonoLabel
                      dot
                      dotColor={exam.finalExamPassed ? 'var(--success)' : exam.allPrereqsDone ? 'var(--brass)' : 'var(--ink-mute)'}
                      style={{ marginBottom: '8px' }}
                    >
                      {exam.label}
                    </MonoLabel>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                      {exam.finalModule.title}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>
                      {exam.finalModule.id} · Required: {exam.finalModule.passing_score ?? 80}%
                    </span>
                  </div>

                  {/* Prerequisite progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 700,
                      color: exam.allPrereqsDone ? 'var(--success)' : 'var(--brass)',
                      lineHeight: 1,
                    }}>
                      {exam.competentPrereqs}/{exam.totalPrereqs}
                    </span>
                    <MonoLabel size="xs">Prerequisites Complete</MonoLabel>
                    <div style={{ width: '120px', height: '4px', background: 'var(--bg-elev-3)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: exam.allPrereqsDone ? 'var(--success)' : 'var(--brass)' }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {exam.finalExamPassed ? (
                      <>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          ✓ Examination Passed
                        </span>
                        <Link href={`/dashboard/module/${exam.finalModule.id}/quiz`}>
                          <BrassButton variant="ghost" size="sm">View Record</BrassButton>
                        </Link>
                      </>
                    ) : exam.allPrereqsDone ? (
                      <Link href={`/dashboard/module/${exam.finalModule.id}/quiz`}>
                        <BrassButton variant="primary" size="md">Attempt Final Examination →</BrassButton>
                      </Link>
                    ) : (
                      <>
                        <div style={{
                          padding: '12px 22px',
                          border: '1px solid var(--border)',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'var(--ink-mute)',
                          cursor: 'not-allowed',
                        }}>
                          Examination Locked
                        </div>
                        <MonoLabel size="xs" style={{ color: 'var(--ink-mute)', textAlign: 'center' }}>
                          Complete all {exam.totalPrereqs} prerequisite modules first
                        </MonoLabel>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Rule />

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="metric-strip">
        <div className="metric-strip-item">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>
            {totalSessions}
          </span>
          <MonoLabel>Total Attempts</MonoLabel>
        </div>
        <div className="metric-strip-item">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--success)', lineHeight: 1 }}>
            {passedSessions}
          </span>
          <MonoLabel>Passed</MonoLabel>
        </div>
        <div className="metric-strip-item">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: criticalSessions > 0 ? 'var(--danger)' : 'var(--ink)', lineHeight: 1 }}>
            {criticalSessions}
          </span>
          <MonoLabel>Critical Fails</MonoLabel>
        </div>
      </div>

      <Rule />

      {/* ── Full assessment log ─────────────────────────── */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Assessment Log</MonoLabel>

        {totalSessions === 0 ? (
          <div style={{
            padding: '48px 24px',
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--border-strong)', letterSpacing: '0.08em' }}>
              00
            </span>
            <MonoLabel>No assessments on record</MonoLabel>
            <MonoLabel size="xs" style={{ maxWidth: '360px' }}>
              Complete your first knowledge assessment to populate this record.
              Navigate to Curriculum and select Module 01 to begin.
            </MonoLabel>
          </div>
        ) : (
          <div className="table-scroll" style={{ border: '1px solid var(--border)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 110px 90px 80px 140px',
              gap: '8px',
              padding: '8px 16px',
              background: 'var(--bg-elev-2)',
              borderBottom: '1px solid var(--border)',
              minWidth: '560px',
            }}>
              {['Module', 'Title', 'Result', 'Score', 'Pass%', 'Date'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
                  {h}
                </span>
              ))}
            </div>

            {sessions.map((s, i) => {
              const mod = moduleMap[s.module_id ?? ''];
              const isCrit = s.critical_fail;
              const isPassed = s.passed;
              const resultColor = isCrit ? 'var(--danger)' : isPassed ? 'var(--success)' : 'var(--danger)';
              const resultLabel = isCrit ? 'CRITICAL FAIL' : isPassed ? 'PASSED' : 'FAILED';
              const ts = s.submitted_at ? new Date(s.submitted_at) : null;

              return (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 110px 90px 80px 140px',
                    gap: '8px',
                    padding: '12px 16px',
                    borderBottom: i < sessions.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isCrit ? 'rgba(232,64,64,.04)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                    alignItems: 'center',
                    minWidth: '560px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>
                    {s.module_id ?? '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mod?.title ?? s.module_id ?? '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: resultColor, textTransform: 'uppercase' }}>
                    {resultLabel}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                    {s.score != null ? `${s.score}%` : '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-mute)' }}>
                    {mod?.passing_score != null ? `${mod.passing_score}%` : '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
                    {ts ? `${ts.toLocaleDateString()} ${ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <MonoLabel size="xs">
        {totalSessions} assessment{totalSessions !== 1 ? 's' : ''} on record
        {passedSessions > 0 ? ` · ${passedSessions} passed` : ''}
        {criticalSessions > 0 ? ` · ${criticalSessions} critical fail${criticalSessions !== 1 ? 's' : ''}` : ''}
      </MonoLabel>
    </div>
  );
}
