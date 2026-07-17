import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { BrassButton } from '@/components/primitives/BrassButton';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  not_started: { color: 'var(--ink-mute)',  label: 'Not Started' },
  in_progress: { color: 'var(--brass)',     label: 'In Progress' },
  completed:   { color: 'var(--success)',   label: 'Complete'    },
  failed:      { color: 'var(--danger)',    label: 'Failed'      },
  reset:       { color: 'var(--danger)',    label: 'Reset'       },
};

const TRACK_INFO: Record<string, { label: string; accentColor: string; badge: string }> = {
  'armed-security':    { label: 'Armed Security Officer',   accentColor: 'var(--brass)',   badge: 'MJM 2026 · 16 HRS · GBPDSA' },
  'private-detective': { label: 'Private Detective',        accentColor: 'var(--success)', badge: 'MJM 2026 · 70 HRS · GBPDSA' },
  'unarmed-security':  { label: 'Unarmed Security Officer', accentColor: 'var(--ink-dim)', badge: 'MJM 2026 · 24 HRS · GBPDSA' },
};

const TRACK_ORDER = ['armed-security', 'private-detective', 'unarmed-security'];

export default async function CurriculumDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const [modulesResult, operatorResult, progressResult, enrollmentsResult] = await Promise.all([
    supabaseAdmin
      .from('mjm_modules')
      .select('id, title, track, sequence_order, passing_score, duration_hours')
      .order('track')
      .order('sequence_order'),
    supabaseAdmin
      .from('operators')
      .select('role')
      .eq('id', user.id)
      .single(),
    supabaseAdmin
      .from('operator_progress')
      .select('module_id, status, is_competent, score, attempts, completed_at')
      .eq('operator_id', user.id),
    supabaseAdmin
      .from('operator_enrollments')
      .select('track')
      .eq('operator_id', user.id),
  ]);

  const role = (operatorResult.data as { role?: string } | null)?.role ?? 'agent';
  const isPrivileged = role === 'admin' || role === 'coordinator' || role === 'super_admin';
  const enrolledTracks = new Set((enrollmentsResult.data ?? []).map((e: { track: string }) => e.track));

  const progressMap = Object.fromEntries(
    (progressResult.data ?? []).map(p => [p.module_id, p])
  );

  // Group modules by track (preserves insertion order from .order('track').order('sequence_order'))
  const modules = modulesResult.data ?? [];
  const trackMap = new Map<string, typeof modules>();
  for (const m of modules) {
    if (!trackMap.has(m.track)) trackMap.set(m.track, []);
    trackMap.get(m.track)!.push(m);
  }

  // Per-track sequential gate — only compare within the same track
  const visibleIds = new Set<string>();
  for (const [, trackMods] of trackMap) {
    for (const m of trackMods) {
      if (isPrivileged || m.sequence_order === 1) {
        visibleIds.add(m.id);
        continue;
      }
      const prev = trackMods.find(p => p.sequence_order === m.sequence_order - 1);
      if (prev && progressMap[prev.id]?.is_competent) visibleIds.add(m.id);
    }
  }

  const tracksToRender = TRACK_ORDER.filter(t =>
    trackMap.has(t) && (isPrivileged || enrolledTracks.has(t))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {tracksToRender.map((trackKey, trackIdx) => {
        const trackMods = trackMap.get(trackKey)!;
        const info = TRACK_INFO[trackKey] ?? { label: trackKey, accentColor: 'var(--brass)', badge: '' };
        const trackComplete = trackMods.filter(m => progressMap[m.id]?.is_competent).length;
        const trackTotal = trackMods.length;
        const pct = trackTotal > 0 ? Math.round((trackComplete / trackTotal) * 100) : 0;

        return (
          <div key={trackKey} style={{ marginBottom: '48px' }}>

            {/* Separator between courses */}
            {trackIdx > 0 && <Rule style={{ marginBottom: '48px' }} />}

            {/* Track header */}
            <div className="dash-page-header" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '3px', height: '36px', background: info.accentColor, flexShrink: 0, borderRadius: '2px' }} />
                <div>
                  <MonoLabel dot dotColor={info.accentColor} style={{ marginBottom: '4px' }}>{info.badge}</MonoLabel>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                    {info.label}
                  </h2>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: info.accentColor, lineHeight: 1 }}>{trackComplete}</div>
                  <MonoLabel size="xs">of {trackTotal} complete</MonoLabel>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{pct}%</div>
                  <MonoLabel size="xs">progress</MonoLabel>
                </div>
              </div>
            </div>

            {/* Track progress bar */}
            <div style={{ height: '3px', background: 'var(--bg-elev-3)', marginBottom: '20px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: info.accentColor, transition: 'width 600ms ease' }} />
            </div>

            {/* Module table */}
            <div className="table-scroll" style={{ border: '1px solid var(--border)' }}>
              {/* Header */}
              <div className="cur-row" style={{ background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '480px' }}>
                <MonoLabel>Seq</MonoLabel>
                <MonoLabel>Module</MonoLabel>
                <span className="cur-col-hours"><MonoLabel>Hours</MonoLabel></span>
                <span className="cur-col-pass"><MonoLabel>Pass %</MonoLabel></span>
                <span className="cur-col-score"><MonoLabel>Score</MonoLabel></span>
                <span className="cur-col-attempts"><MonoLabel>Attempts</MonoLabel></span>
                <MonoLabel>Status</MonoLabel>
              </div>

              {trackMods.map((mod, i) => {
                const prog = progressMap[mod.id];
                const isLocked = !visibleIds.has(mod.id);
                const status = prog?.status ?? 'not_started';
                const styleEntry = STATUS_STYLES[status] ?? STATUS_STYLES.not_started;
                const seq = String(mod.sequence_order).padStart(2, '0');
                const isCompetent = !!prog?.is_competent;
                const actionLabel =
                  isCompetent              ? 'RECAP ↺'    :
                  status === 'in_progress' ? 'CONTINUE →' :
                  status === 'failed' || status === 'reset' ? 'RETRY →' :
                  'START →';
                const actionColor = isCompetent ? 'var(--ink-dim)' : info.accentColor;

                return (
                  <div
                    key={mod.id}
                    className="cur-row"
                    style={{
                      borderBottom: i < trackMods.length - 1 ? '1px solid var(--border)' : 'none',
                      background: isLocked ? 'rgba(0,0,0,.15)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                      opacity: isLocked ? 0.45 : 1,
                      minWidth: '480px',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: info.accentColor }}>{seq}</span>

                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      {isLocked && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', border: '1px solid var(--border)', padding: '1px 5px', flexShrink: 0 }}>
                          LOCKED
                        </span>
                      )}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.title}</span>
                    </span>

                    <span className="cur-col-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                      {mod.duration_hours ?? '—'}h
                    </span>
                    <span className="cur-col-pass" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                      {mod.passing_score ?? '—'}%
                    </span>
                    <span className="cur-col-score" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: prog?.score != null ? 'var(--ink)' : 'var(--ink-mute)' }}>
                      {prog?.score != null ? `${prog.score}%` : '—'}
                    </span>
                    <span className="cur-col-attempts" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                      {prog?.attempts ?? 0}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: styleEntry.color, textTransform: 'uppercase' }}>
                        {styleEntry.label}
                      </span>
                      {!isLocked && (
                        <Link href={`/dashboard/module/${mod.id}`}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: actionColor, cursor: 'pointer', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                            {actionLabel}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion banner */}
            {trackComplete === trackTotal && trackTotal > 0 && (
              <div style={{ marginTop: '16px', padding: '24px', border: `1px solid color-mix(in srgb, ${info.accentColor} 30%, transparent)`, background: `color-mix(in srgb, ${info.accentColor} 6%, transparent)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <MonoLabel dot dotColor={info.accentColor} style={{ marginBottom: '8px' }}>Course Complete</MonoLabel>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', margin: 0 }}>
                    You have completed all {trackTotal} modules in {info.label}. Your accreditation file is ready for review.
                  </p>
                </div>
                <Link href="/dashboard/credentials">
                  <BrassButton variant="primary" size="md">View Certificate ⤳</BrassButton>
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
