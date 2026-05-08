import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

interface LeaderboardRow {
  id: string;
  full_name: string;
  operator_code: string;
  role: string;
  modules_completed: number;
  avg_score: number;
  total_attempts: number;
  enrolled_at: string | null;
  last_completion_at: string | null;
  days_to_latest_completion: number | null;
}

const MEDAL: Record<number, { symbol: string; color: string }> = {
  1: { symbol: '01', color: '#C5A059' },
  2: { symbol: '02', color: '#A0A8B0' },
  3: { symbol: '03', color: '#C07848' },
};

function efficiencyScore(row: LeaderboardRow): number {
  if (row.modules_completed === 0) return 0;
  // Higher = better: score scaled up, attempts scaled down
  return Math.round((row.avg_score * row.modules_completed) / Math.max(row.total_attempts, 1));
}

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: rows } = await supabaseAdmin
    .from('operator_leaderboard')
    .select('id, full_name, operator_code, role, modules_completed, avg_score, total_attempts, enrolled_at, last_completion_at, days_to_latest_completion')
    .neq('role', 'super_admin')
    .neq('role', 'admin')
    .order('modules_completed', { ascending: false })
    .order('avg_score', { ascending: false })
    .order('total_attempts', { ascending: true });

  const board = (rows ?? []) as LeaderboardRow[];
  const activeRows = board.filter(r => r.modules_completed > 0);
  const completedAll = board.filter(r => r.modules_completed >= 16);

  // Top performer by efficiency among those who completed ≥ 3 modules
  const qualifiedForEfficiency = board.filter(r => r.modules_completed >= 3);
  qualifiedForEfficiency.sort((a, b) => efficiencyScore(b) - efficiencyScore(a));
  const topEfficiency = qualifiedForEfficiency[0] ?? null;

  // Fastest completion (days_to_latest_completion is lowest, must have ≥ 8 modules done)
  const qualifiedForSpeed = board.filter(r => r.modules_completed >= 8 && r.days_to_latest_completion !== null);
  qualifiedForSpeed.sort((a, b) => (a.days_to_latest_completion ?? 9999) - (b.days_to_latest_completion ?? 9999));
  const fastestCompletion = qualifiedForSpeed[0] ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>MJM 2026 Armed Security</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Operator Leaderboard
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { value: String(board.length),       label: 'Enrolled' },
            { value: String(activeRows.length),  label: 'Active' },
            { value: String(completedAll.length), label: 'Course Complete' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>{m.value}</div>
              <MonoLabel size="xs">{m.label}</MonoLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Spotlight cards */}
      {(topEfficiency || fastestCompletion) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {topEfficiency && (
            <SpotlightCard
              label="Top Performer"
              name={topEfficiency.full_name}
              code={topEfficiency.operator_code}
              stat={`${efficiencyScore(topEfficiency)} efficiency`}
              detail={`${topEfficiency.modules_completed} modules · ${topEfficiency.avg_score}% avg · ${topEfficiency.total_attempts} attempts`}
              color="var(--brass)"
            />
          )}
          {fastestCompletion && (
            <SpotlightCard
              label="Fastest Progression"
              name={fastestCompletion.full_name}
              code={fastestCompletion.operator_code}
              stat={`${fastestCompletion.days_to_latest_completion}d to ${fastestCompletion.modules_completed} modules`}
              detail={`${fastestCompletion.avg_score}% avg score · ${fastestCompletion.total_attempts} attempts total`}
              color="var(--success, #22c55e)"
            />
          )}
          {completedAll.length > 0 && (
            <SpotlightCard
              label="Course Complete"
              name={completedAll[0].full_name}
              code={completedAll[0].operator_code}
              stat={`16/16 modules`}
              detail={`${completedAll[0].avg_score}% avg · ${completedAll[0].total_attempts} total attempts`}
              color="var(--brass)"
            />
          )}
        </div>
      )}

      <Rule />

      {/* Rankings table */}
      <div>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 100px 80px 80px 80px 100px',
          gap: '0',
          padding: '8px 16px',
          background: 'var(--bg-elev-2)',
          border: '1px solid var(--border)',
          borderBottom: 'none',
          minWidth: '540px',
        }}>
          {['Rank', 'Operator', 'Modules', 'Avg Score', 'Attempts', 'Days', 'Status'].map(h => (
            <MonoLabel key={h} size="xs">{h}</MonoLabel>
          ))}
        </div>

        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          {board.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <MonoLabel size="xs">No operators enrolled yet</MonoLabel>
            </div>
          ) : (
            board.map((row, idx) => {
              const rank     = idx + 1;
              const medal    = MEDAL[rank];
              const isUser   = row.id === user.id;
              const pct      = Math.round((row.modules_completed / 16) * 100);
              const statusLabel =
                row.modules_completed >= 16 ? 'COMPLETE' :
                row.modules_completed > 0   ? 'IN PROGRESS' :
                'ENROLLED';
              const statusColor =
                row.modules_completed >= 16 ? 'var(--success, #22c55e)' :
                row.modules_completed > 0   ? 'var(--brass)' :
                'var(--ink-mute)';

              return (
                <div
                  key={row.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr 100px 80px 80px 80px 100px',
                    gap: '0',
                    padding: '14px 16px',
                    borderBottom: idx < board.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isUser
                      ? 'rgba(197,160,89,.05)'
                      : idx % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                    alignItems: 'center',
                    borderLeft: isUser ? '2px solid var(--brass)' : '2px solid transparent',
                    minWidth: '540px',
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: medal ? medal.color : 'var(--ink-mute)',
                    letterSpacing: '0.06em',
                  }}>
                    {String(rank).padStart(2, '0')}
                  </span>

                  {/* Operator */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '13px',
                        fontWeight: isUser ? 600 : 400,
                        color: 'var(--ink)',
                      }}>
                        {row.full_name || 'Unknown'}
                      </span>
                      {isUser && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '8px',
                          letterSpacing: '0.14em',
                          color: 'var(--brass)',
                          border: '1px solid rgba(197,160,89,.4)',
                          padding: '1px 5px',
                          textTransform: 'uppercase',
                        }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--ink-mute)',
                      letterSpacing: '0.1em',
                    }}>
                      {row.operator_code ?? '—'}
                    </span>
                  </div>

                  {/* Modules + mini progress bar */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: row.modules_completed > 0 ? 'var(--brass)' : 'var(--ink-mute)',
                      marginBottom: '4px',
                    }}>
                      {row.modules_completed}/16
                    </div>
                    <div style={{ height: '3px', background: 'var(--border)', width: '64px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--brass)' }} />
                    </div>
                  </div>

                  {/* Avg Score */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: row.avg_score >= 90 ? 'var(--success, #22c55e)' :
                           row.avg_score >= 80 ? 'var(--brass)' :
                           row.avg_score > 0   ? 'var(--ink-dim)' : 'var(--ink-mute)',
                    fontWeight: row.avg_score >= 90 ? 700 : 400,
                  }}>
                    {row.avg_score > 0 ? `${row.avg_score}%` : '—'}
                  </span>

                  {/* Attempts */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--ink-dim)',
                  }}>
                    {row.total_attempts || '—'}
                  </span>

                  {/* Days active */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--ink-dim)',
                  }}>
                    {row.days_to_latest_completion !== null ? `${row.days_to_latest_completion}d` : '—'}
                  </span>

                  {/* Status */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    color: statusColor,
                    textTransform: 'uppercase',
                  }}>
                    {statusLabel}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--success, #22c55e)', label: 'Avg score ≥ 90%' },
          { color: 'var(--brass)',            label: 'Avg score ≥ 80%' },
          { color: 'var(--ink-dim)',          label: 'Below threshold' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <MonoLabel size="xs">{item.label}</MonoLabel>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
        Efficiency = (avg score × modules completed) ÷ total attempts · Updates live
      </div>
    </div>
  );
}

// ── Spotlight card ────────────────────────────────────────────────────────────

interface SpotlightCardProps {
  label: string;
  name: string;
  code: string;
  stat: string;
  detail: string;
  color: string;
}

function SpotlightCard({ label, name, code, stat, detail, color }: SpotlightCardProps) {
  return (
    <div style={{
      padding: '18px 20px',
      border: `1px solid ${color === 'var(--brass)' ? 'rgba(197,160,89,.3)' : 'rgba(34,197,94,.3)'}`,
      background: color === 'var(--brass)' ? 'rgba(197,160,89,.03)' : 'rgba(34,197,94,.03)',
    }}>
      <MonoLabel size="xs" style={{ marginBottom: '10px', color }}>{label}</MonoLabel>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
        {name}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color, marginBottom: '8px' }}>
        {code}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color, fontWeight: 700, letterSpacing: '0.06em', marginBottom: '4px' }}>
        {stat}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
        {detail}
      </div>
    </div>
  );
}
