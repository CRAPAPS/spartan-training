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

export default async function CurriculumDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Use admin client so the modules query always succeeds regardless of RLS/key format
  const { data: allModules } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, sequence_order, passing_score, duration_hours')
    .order('sequence_order');

  // Get operator role for gate bypass
  const { data: operator } = await supabaseAdmin
    .from('operators')
    .select('role')
    .eq('id', user.id)
    .single();
  const role = (operator as { role?: string } | null)?.role ?? 'agent';
  const isPrivileged = role === 'admin' || role === 'coordinator' || role === 'super_admin';

  // Progress is always scoped to the current user
  const { data: progressRows } = await supabaseAdmin
    .from('operator_progress')
    .select('module_id, status, is_competent, score, attempts, completed_at')
    .eq('operator_id', user.id);

  const progressMap = Object.fromEntries(
    (progressRows ?? []).map(p => [p.module_id, p])
  );

  // Compute which modules are accessible (application-level sequential gate)
  const modules = allModules ?? [];
  const visibleIds = new Set<string>();
  for (const m of modules) {
    if (isPrivileged || m.sequence_order === 1) {
      visibleIds.add(m.id);
      continue;
    }
    const prev = modules.find(p => p.sequence_order === m.sequence_order - 1);
    if (prev && progressMap[prev.id]?.is_competent) visibleIds.add(m.id);
  }

  const completedCount = (progressRows ?? []).filter(p => p.is_competent).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>MJM 2026 Armed Security</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Curriculum
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>{completedCount}</div>
            <MonoLabel size="xs">of 16 complete</MonoLabel>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{visibleIds.size}</div>
            <MonoLabel size="xs">accessible</MonoLabel>
          </div>
        </div>
      </div>

      <Rule />

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

        {Array.from({ length: 16 }, (_, i) => {
          const seq = String(i + 1).padStart(2, '0');
          const moduleId = `MOD-${seq}`;
          const mod = modules.find(m => m.id === moduleId);
          const prog = progressMap[moduleId];
          const isLocked = !visibleIds.has(moduleId);
          const status = prog?.status ?? 'not_started';
          const style = STATUS_STYLES[status] ?? STATUS_STYLES.not_started;

          return (
            <div
              key={moduleId}
              className="cur-row"
              style={{
                borderBottom: i < 15 ? '1px solid var(--border)' : 'none',
                background: isLocked ? 'rgba(0,0,0,.15)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                opacity: isLocked ? 0.45 : 1,
                minWidth: '480px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--brass)' }}>{seq}</span>

              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {isLocked && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', border: '1px solid var(--border)', padding: '1px 5px', flexShrink: 0 }}>LOCKED</span>}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod?.title ?? `Module ${seq}`}</span>
              </span>

              <span className="cur-col-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                {mod?.duration_hours ?? '—'}h
              </span>
              <span className="cur-col-pass" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                {mod?.passing_score ?? '—'}%
              </span>
              <span className="cur-col-score" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: prog?.score != null ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {prog?.score != null ? `${prog.score}%` : '—'}
              </span>
              <span className="cur-col-attempts" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                {prog?.attempts ?? 0}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', color: style.color, textTransform: 'uppercase' }}>
                  {style.label}
                </span>
                {!isLocked && (() => {
                  const isCompetent = prog?.is_competent;
                  const actionLabel =
                    isCompetent               ? 'RECAP ↺'    :
                    status === 'in_progress'  ? 'CONTINUE →' :
                    status === 'failed' || status === 'reset' ? 'RETRY →' :
                    'START →';
                  const actionColor = isCompetent ? 'var(--ink-dim)' : 'var(--brass)';
                  return (
                    <Link href={`/dashboard/module/${moduleId}`}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: actionColor, cursor: 'pointer', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                        {actionLabel}
                      </span>
                    </Link>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === 16 && (
        <>
          <Rule />
          <div className="completion-banner" style={{ padding: '24px', border: '1px solid rgba(80,160,80,.3)', background: 'rgba(80,160,80,.06)' }}>
            <div>
              <MonoLabel dot dotColor="var(--success)" style={{ marginBottom: '8px' }}>All Modules Complete</MonoLabel>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)' }}>
                You have completed all 16 modules. Your MJM 2026 accreditation file is ready for review.
              </p>
            </div>
            <Link href="/dashboard/credentials">
              <BrassButton variant="primary" size="md">View Certificate ⤳</BrassButton>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
