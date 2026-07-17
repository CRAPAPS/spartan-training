import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const TRACK_LABEL: Record<string, string> = {
  'armed-security': 'Armed Security',
  'private-detective': 'Private Detective',
  'unarmed-security': 'Unarmed Security',
};

const TRACK_ACCREDITATION: Record<string, string> = {
  'armed-security': 'MJM 2026 Armed Security Officer — GBPDSA GA Code § 509-3-.01',
  'private-detective': 'MJM 2026 Private Detective — GBPDSA OCGA Title 43-38',
  'unarmed-security': 'MJM 2026 Unarmed Security Officer — GBPDSA GA Admin Code § 509-3-.01',
};

const TRACK_HOURS: Record<string, number> = {
  'armed-security': 16,
  'private-detective': 70,
  'unarmed-security': 24,
};

export default async function CredentialsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // All data via admin client — publishable key breaks PostgREST
  const [{ data: operator }, { data: enrollments }, { data: allProgress }] = await Promise.all([
    supabaseAdmin
      .from('operators')
      .select('operator_id, full_name, email, enrolled_at')
      .eq('id', user.id)
      .single(),
    supabaseAdmin
      .from('operator_enrollments')
      .select('track, enrolled_at, payment_method')
      .eq('operator_id', user.id),
    supabaseAdmin
      .from('operator_progress')
      .select('module_id, is_competent, score, completed_at')
      .eq('operator_id', user.id),
  ]);

  const enrolledTracks = (enrollments ?? []).map(e => e.track as string);

  // Fetch modules per enrolled track
  const trackModulesMap: Record<string, Array<{ id: string; title: string; sequence_order: number; passing_score: number | null; duration_hours: number | null }>> = {};
  await Promise.all(
    enrolledTracks.map(async track => {
      const { data } = await supabaseAdmin
        .from('mjm_modules')
        .select('id, title, sequence_order, passing_score, duration_hours')
        .eq('track', track)
        .eq('is_active', true)
        .order('sequence_order');
      trackModulesMap[track] = data ?? [];
    })
  );

  const progressMap = Object.fromEntries(
    (allProgress ?? []).map(p => [p.module_id as string, p])
  );

  // Per-track credential data
  const trackCredentials = enrolledTracks.map(track => {
    const modules = trackModulesMap[track] ?? [];
    const totalModules = modules.length;
    const enrollment = (enrollments ?? []).find(e => e.track === track);
    const competentModules = modules.filter(m => progressMap[m.id]?.is_competent);
    const competentCount = competentModules.length;
    const isAccredited = competentCount === totalModules && totalModules > 0;
    const totalHours = competentModules.reduce((sum, m) => sum + (m.duration_hours ?? 1), 0);
    const requiredHours = TRACK_HOURS[track] ?? totalModules;
    const lastCompleted = competentModules
      .map(m => progressMap[m.id])
      .filter(p => p?.completed_at)
      .sort((a, b) => new Date(b!.completed_at!).getTime() - new Date(a!.completed_at!).getTime())[0];

    return { track, label: TRACK_LABEL[track] ?? track, accreditation: TRACK_ACCREDITATION[track] ?? track, requiredHours, enrollment, modules, totalModules, competentCount, isAccredited, totalHours, lastCompleted };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Accreditation</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Credentials & Certification
          </h1>
        </div>
      </div>

      <Rule />

      {enrolledTracks.length === 0 ? (
        <div style={{ padding: '48px 24px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <MonoLabel>No courses enrolled</MonoLabel>
          <MonoLabel size="xs" style={{ maxWidth: '360px' }}>Contact your coordinator to be enrolled in a course track.</MonoLabel>
        </div>
      ) : (
        <>
          {/* Operator identity strip */}
          {operator && (
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', padding: '16px 20px', background: 'var(--bg-elev-1)', border: '1px solid var(--border)' }}>
              <div>
                <MonoLabel size="xs" style={{ marginBottom: '4px' }}>Full Name</MonoLabel>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{operator.full_name}</span>
              </div>
              <div>
                <MonoLabel size="xs" style={{ marginBottom: '4px' }}>Operator ID</MonoLabel>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--brass)', fontWeight: 700 }}>{operator.operator_id}</span>
              </div>
              <div>
                <MonoLabel size="xs" style={{ marginBottom: '4px' }}>Tracks Enrolled</MonoLabel>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-dim)' }}>{enrolledTracks.length}</span>
              </div>
            </div>
          )}

          {/* Per-track sections */}
          {trackCredentials.map(cred => {
            const pct = cred.totalModules > 0 ? Math.round((cred.competentCount / cred.totalModules) * 100) : 0;

            return (
              <section key={cred.track}>
                {/* Status card */}
                <div style={{
                  border: `1px solid ${cred.isAccredited ? 'rgba(34,197,94,.35)' : 'var(--border)'}`,
                  background: cred.isAccredited ? 'rgba(34,197,94,.04)' : 'var(--bg-elev-1)',
                  padding: '28px 24px',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <MonoLabel size="xs">{cred.accreditation}</MonoLabel>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 700, color: cred.isAccredited ? 'var(--success)' : 'var(--brass)', lineHeight: 1 }}>
                          {cred.competentCount}
                          <span style={{ fontSize: '24px', color: 'var(--ink-mute)', fontWeight: 400 }}>/{cred.totalModules}</span>
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', color: cred.isAccredited ? 'var(--success)' : 'var(--ink-mute)', textTransform: 'uppercase' }}>
                            {cred.isAccredited ? '● ACCREDITED' : '○ IN PROGRESS'}
                          </span>
                          <MonoLabel size="xs">{pct}% Complete</MonoLabel>
                        </div>
                      </div>
                      {cred.enrollment?.enrolled_at && (
                        <MonoLabel size="xs">
                          Enrolled {new Date(cred.enrollment.enrolled_at).toLocaleDateString()}
                          {cred.enrollment.payment_method ? ` · ${cred.enrollment.payment_method}` : ''}
                        </MonoLabel>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                          {cred.totalHours.toFixed(1)}h
                        </span>
                        <MonoLabel size="xs" style={{ display: 'block', marginTop: '4px' }}>of {cred.requiredHours}h Required</MonoLabel>
                      </div>
                      {cred.lastCompleted?.completed_at && (
                        <MonoLabel size="xs" style={{ textAlign: 'right' }}>
                          Last: {new Date(cred.lastCompleted.completed_at).toLocaleDateString()}
                        </MonoLabel>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', height: '4px', background: 'var(--bg-elev-3)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: cred.isAccredited ? 'var(--success)' : 'var(--brass)' }} />
                  </div>
                </div>

                {/* Certificate preview / locked */}
                <MonoLabel style={{ marginBottom: '12px', display: 'block' }}>Certificate — {cred.label}</MonoLabel>

                {cred.isAccredited ? (
                  <div style={{ border: '1px solid rgba(34,197,94,.3)', background: 'rgba(34,197,94,.03)', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '100%', maxWidth: '480px', border: '2px solid rgba(197,160,89,.4)', padding: '32px', background: 'var(--bg-elev-1)' }}>
                      <div style={{ borderBottom: '1px solid rgba(197,160,89,.2)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <MonoLabel size="xs" style={{ letterSpacing: '0.24em' }}>CERTIFICATE OF COMPLETION</MonoLabel>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--ink-mute)', marginTop: '4px', letterSpacing: '0.12em' }}>
                          {cred.label.toUpperCase()} ACCREDITATION
                        </div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                        {operator?.full_name ?? '—'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', marginBottom: '16px', letterSpacing: '0.08em' }}>
                        {operator?.operator_id} · {cred.label.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6, marginBottom: '16px' }}>
                        Has successfully completed all {cred.totalModules} modules of the GBPDSA-compliant {cred.label} curriculum,
                        satisfying the minimum {cred.requiredHours}-hour training requirement.
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(197,160,89,.2)', paddingTop: '16px' }}>
                        <div>
                          <MonoLabel size="xs">Completion Date</MonoLabel>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', marginTop: '4px' }}>
                            {cred.lastCompleted?.completed_at ? new Date(cred.lastCompleted.completed_at).toLocaleDateString() : '—'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <MonoLabel size="xs">Hours Credited</MonoLabel>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', marginTop: '4px' }}>
                            {cred.totalHours.toFixed(1)} Hours
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['⬇ Download PDF — Coming Soon', '⎙ Print — Coming Soon'].map(label => (
                        <div key={label} style={{ padding: '10px 20px', border: '1px solid var(--border)', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'default' }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', border: '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--border-strong)', fontWeight: 700 }}>{cred.totalModules - cred.competentCount}</span>
                    </div>
                    <MonoLabel size="xs" style={{ color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                      {cred.totalModules - cred.competentCount} module{cred.totalModules - cred.competentCount !== 1 ? 's' : ''} remaining
                    </MonoLabel>
                    <MonoLabel size="xs" style={{ maxWidth: '340px' }}>
                      Your {cred.label} certificate will be issued once all {cred.totalModules} modules are passed.
                    </MonoLabel>
                  </div>
                )}

                {/* Module competency table */}
                <MonoLabel style={{ marginBottom: '12px', display: 'block' }}>Competency Record — {cred.label}</MonoLabel>
                <div style={{ border: '1px solid var(--border)', marginBottom: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 90px 80px 130px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '460px' }}>
                    {['Module', 'Title', 'Status', 'Score', 'Completed'].map(h => (
                      <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {cred.modules.map((m, i) => {
                    const prog = progressMap[m.id];
                    const isComp = prog?.is_competent ?? false;
                    return (
                      <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 90px 80px 130px', gap: '8px', padding: '11px 16px', borderBottom: i < cred.modules.length - 1 ? '1px solid var(--border)' : 'none', background: isComp ? 'rgba(34,197,94,.03)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)', alignItems: 'center', minWidth: '460px', opacity: !prog ? 0.55 : 1 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>{m.id}</span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: isComp ? 'var(--success)' : prog ? 'var(--brass)' : 'var(--ink-mute)' }}>
                          {isComp ? '● COMPETENT' : prog ? '○ IN PROG' : '— LOCKED'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{prog?.score != null ? `${prog.score}%` : '—'}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>{prog?.completed_at ? new Date(prog.completed_at).toLocaleDateString() : '—'}</span>
                      </div>
                    );
                  })}
                </div>
                <MonoLabel size="xs">
                  {cred.competentCount}/{cred.totalModules} modules competent · {cred.totalHours.toFixed(1)} of {cred.requiredHours}h credited
                </MonoLabel>

                <Rule style={{ marginTop: '24px' }} />
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
