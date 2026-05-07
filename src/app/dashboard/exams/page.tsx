import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

export default async function ExamsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('id, module_id, started_at, submitted_at, score, passed, critical_fail')
    .eq('operator_id', user.id)
    .order('submitted_at', { ascending: false });

  const { data: progress } = await supabase
    .from('operator_progress')
    .select('module_id, status, is_competent, score, attempts')
    .eq('operator_id', user.id);

  const { data: modules } = await supabase
    .from('mjm_modules')
    .select('id, title, sequence_order, passing_score')
    .order('sequence_order');

  const moduleMap = Object.fromEntries(
    (modules ?? []).map(m => [m.id, m])
  );

  const totalSessions   = (sessions ?? []).length;
  const passedSessions  = (sessions ?? []).filter(s => s.passed).length;
  const failedSessions  = (sessions ?? []).filter(s => !s.passed && !s.critical_fail).length;
  const criticalSessions = (sessions ?? []).filter(s => s.critical_fail).length;
  const competentModules = (progress ?? []).filter(p => p.is_competent).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Assessments</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Exam Record
          </h1>
        </div>
      </div>

      <Rule />

      {/* Stats strip */}
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
        <div className="metric-strip-item">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            {competentModules}/16
          </span>
          <MonoLabel>Modules Competent</MonoLabel>
        </div>
      </div>

      <Rule />

      {/* Module status overview */}
      {(progress ?? []).length > 0 && (
        <section>
          <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Module Status Overview</MonoLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
            {Array.from({ length: 16 }, (_, idx) => {
              const modId = `MOD-${String(idx + 1).padStart(2, '0')}`;
              const prog  = (progress ?? []).find(p => p.module_id === modId);
              const bg =
                prog?.is_competent ? 'var(--success)' :
                prog?.status === 'failed' || prog?.status === 'reset' ? 'var(--danger)' :
                prog?.status === 'in_progress' ? 'var(--brass)' :
                'var(--bg-elev-3)';
              const mod = moduleMap[modId];
              return (
                <div
                  key={modId}
                  title={`${modId}${mod ? ` — ${mod.title}` : ''}${prog?.score != null ? ` (${prog.score}%)` : ''}`}
                  style={{ height: '40px', background: bg, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,.75)', fontWeight: 700 }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Competent',   color: 'var(--success)' },
              { label: 'In Progress', color: 'var(--brass)'   },
              { label: 'Failed',      color: 'var(--danger)'  },
              { label: 'Not Started', color: 'var(--bg-elev-3)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: s.color }} />
                <MonoLabel size="xs">{s.label}</MonoLabel>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exam session log */}
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
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 80px 90px 80px 140px',
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

            {(sessions ?? []).map((s, i) => {
              const mod     = moduleMap[s.module_id ?? ''];
              const isCrit  = s.critical_fail;
              const isPassed = s.passed;
              const resultColor = isCrit ? 'var(--danger)' : isPassed ? 'var(--success)' : 'var(--danger)';
              const resultLabel = isCrit ? 'CRITICAL FAIL' : isPassed ? 'PASSED' : 'FAILED';
              const ts = s.submitted_at ? new Date(s.submitted_at) : null;

              return (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 80px 90px 80px 140px',
                    gap: '8px',
                    padding: '12px 16px',
                    borderBottom: i < (sessions ?? []).length - 1 ? '1px solid var(--border)' : 'none',
                    background: isCrit
                      ? 'rgba(232,64,64,.04)'
                      : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
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
