import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

export default async function CredentialsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: operator } = await supabase
    .from('operators')
    .select('operator_id, full_name, email, track, enrolled_at')
    .eq('id', user.id)
    .single();

  const { data: progress } = await supabase
    .from('operator_progress')
    .select('module_id, is_competent, score, completed_at')
    .eq('operator_id', user.id);

  const { data: modules } = await supabase
    .from('mjm_modules')
    .select('id, title, sequence_order, passing_score, duration_hours')
    .order('sequence_order');

  const competentIds = new Set((progress ?? []).filter(p => p.is_competent).map(p => p.module_id));
  const competentCount = competentIds.size;
  const isAccredited = competentCount === 16;

  const totalHours = (modules ?? []).reduce((sum, m) => {
    if (competentIds.has(m.id)) return sum + (m.duration_hours ?? 0);
    return sum;
  }, 0);

  const lastCompleted = (progress ?? [])
    .filter(p => p.is_competent && p.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0];

  const progressMap = Object.fromEntries(
    (progress ?? []).map(p => [p.module_id, p])
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor={isAccredited ? 'var(--success)' : 'var(--brass)'} style={{ marginBottom: '8px' }}>
            {isAccredited ? 'ACCREDITATION COMPLETE' : 'Accreditation'}
          </MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Credentials & Certification
          </h1>
        </div>
      </div>

      <Rule />

      {/* Accreditation status card */}
      <section style={{
        border: `1px solid ${isAccredited ? 'rgba(34,197,94,.35)' : 'var(--border)'}`,
        background: isAccredited ? 'rgba(34,197,94,.04)' : 'var(--bg-elev-1)',
        padding: '28px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MonoLabel size="xs">MJM 2026 Armed Security Accreditation</MonoLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '42px',
                fontWeight: 700,
                color: isAccredited ? 'var(--success)' : 'var(--brass)',
                lineHeight: 1,
              }}>
                {competentCount}
                <span style={{ fontSize: '24px', color: 'var(--ink-mute)', fontWeight: 400 }}>/16</span>
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: isAccredited ? 'var(--success)' : 'var(--ink-mute)',
                  textTransform: 'uppercase',
                }}>
                  {isAccredited ? '● ACCREDITED' : '○ IN PROGRESS'}
                </span>
                <MonoLabel size="xs">{Math.round((competentCount / 16) * 100)}% Complete</MonoLabel>
              </div>
            </div>

            {operator && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', fontWeight: 500 }}>
                  {operator.full_name}
                </span>
                <MonoLabel size="xs">{operator.operator_id} · GBPDSA Armed Security Officer</MonoLabel>
                {operator.enrolled_at && (
                  <MonoLabel size="xs">Enrolled {new Date(operator.enrolled_at).toLocaleDateString()}</MonoLabel>
                )}
              </div>
            )}
          </div>

          {/* Progress ring / hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                {totalHours.toFixed(1)}h
              </span>
              <MonoLabel size="xs" style={{ display: 'block', marginTop: '4px' }}>Hours Credited</MonoLabel>
            </div>
            {lastCompleted?.completed_at && (
              <MonoLabel size="xs" style={{ textAlign: 'right' }}>
                Last: {new Date(lastCompleted.completed_at).toLocaleDateString()}
              </MonoLabel>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ height: '4px', background: 'var(--bg-elev-3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${Math.round((competentCount / 16) * 100)}%`,
              background: isAccredited ? 'var(--success)' : 'var(--brass)',
              transition: 'width 400ms ease',
            }} />
          </div>
        </div>
      </section>

      {/* Certificate section */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Certificate of Completion</MonoLabel>

        {isAccredited ? (
          <div style={{
            border: '1px solid rgba(34,197,94,.3)',
            background: 'rgba(34,197,94,.03)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
          }}>
            {/* Certificate preview */}
            <div style={{
              width: '100%',
              maxWidth: '480px',
              border: '2px solid rgba(197,160,89,.4)',
              padding: '32px',
              background: 'var(--bg-elev-1)',
              position: 'relative',
            }}>
              <div style={{ borderBottom: '1px solid rgba(197,160,89,.2)', paddingBottom: '16px', marginBottom: '16px' }}>
                <MonoLabel size="xs" style={{ letterSpacing: '0.24em' }}>CERTIFICATE OF COMPLETION</MonoLabel>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--ink-mute)', marginTop: '4px', letterSpacing: '0.12em' }}>
                  MJM 2026 ARMED SECURITY ACCREDITATION
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                {operator?.full_name ?? '—'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', marginBottom: '16px', letterSpacing: '0.08em' }}>
                {operator?.operator_id} · {(operator?.track ?? '').replace(/-/g, ' ').toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: '16px' }}>
                Has successfully completed all 16 modules of the GBPDSA-compliant MJM 2026 Armed Security
                Officer curriculum, satisfying the minimum 16-hour annual training requirement under
                GA Code § 509-3-.01.
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(197,160,89,.2)', paddingTop: '16px' }}>
                <div>
                  <MonoLabel size="xs">Completion Date</MonoLabel>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', marginTop: '4px' }}>
                    {lastCompleted?.completed_at ? new Date(lastCompleted.completed_at).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <MonoLabel size="xs">Hours Credited</MonoLabel>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', marginTop: '4px' }}>
                    {totalHours.toFixed(1)} Hours
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{
                padding: '10px 20px',
                border: '1px solid var(--brass)',
                background: 'rgba(197,160,89,.08)',
                color: 'var(--brass)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'default',
              }}>
                ⬇ Download PDF — Coming Soon
              </div>
              <div style={{
                padding: '10px 20px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--ink-mute)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'default',
              }}>
                ⎙ Print — Coming Soon
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-1)',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '56px', height: '56px',
              border: '2px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--border-strong)', fontWeight: 700 }}>
                {16 - competentCount}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
                {16 - competentCount} module{16 - competentCount !== 1 ? 's' : ''} remaining
              </span>
              <MonoLabel size="xs" style={{ maxWidth: '340px' }}>
                Your certificate of completion will be issued once all 16 modules are passed.
                Complete your curriculum to unlock accreditation.
              </MonoLabel>
            </div>
          </div>
        )}
      </section>

      <Rule />

      {/* Module competency checklist */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Competency Record — 16 Modules</MonoLabel>

        <div style={{ border: '1px solid var(--border)' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 80px 80px 130px',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--bg-elev-2)',
            borderBottom: '1px solid var(--border)',
            minWidth: '460px',
          }}>
            {['Module', 'Title', 'Status', 'Score', 'Completed'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
                {h}
              </span>
            ))}
          </div>

          {(modules ?? []).map((m, i) => {
            const prog = progressMap[m.id];
            const isComp = prog?.is_competent ?? false;
            const isLocked = !prog && !competentIds.has(m.id) && i > 0 && !competentIds.has(`MOD-${String(i).padStart(2, '0')}`);

            return (
              <div
                key={m.id}
                className="table-scroll"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 80px 80px 130px',
                  gap: '8px',
                  padding: '11px 16px',
                  borderBottom: i < (modules ?? []).length - 1 ? '1px solid var(--border)' : 'none',
                  background: isComp ? 'rgba(34,197,94,.03)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                  alignItems: 'center',
                  minWidth: '460px',
                  opacity: !prog && !isComp ? 0.5 : 1,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>
                  {m.id}
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.title}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: isComp ? 'var(--success)' :
                         prog?.status === 'failed' || prog?.status === 'reset' ? 'var(--danger)' :
                         prog ? 'var(--brass)' : 'var(--ink-mute)',
                  textTransform: 'uppercase',
                }}>
                  {isComp ? '● COMPETENT' :
                   prog?.status === 'failed' ? '○ FAILED' :
                   prog?.status === 'reset' ? '○ RESET' :
                   prog?.status === 'in_progress' ? '○ IN PROG' :
                   '— LOCKED'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                  {prog?.score != null ? `${prog.score}%` : '—'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
                  {prog?.completed_at ? new Date(prog.completed_at).toLocaleDateString() : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <MonoLabel size="xs">
        {competentCount}/16 modules competent · {totalHours.toFixed(1)} of 16.0 hours credited ·
        GBPDSA GA Code § 509-3-.01
      </MonoLabel>
    </div>
  );
}
