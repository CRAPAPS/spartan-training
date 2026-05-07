import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const EVENT_STYLES: Record<string, { color: string }> = {
  ENROLLMENT_COMPLETE: { color: 'var(--brass)'   },
  MODULE_START:        { color: 'var(--ink-dim)'  },
  SCORM_COMPLETE:      { color: 'var(--success)'  },
  SCORE_RECORDED:      { color: 'var(--ink)'      },
  CRITICAL_FAIL:       { color: 'var(--danger)'   },
  TACTICAL_RESET:      { color: 'var(--danger)'   },
  LOGIN:               { color: 'var(--ink-mute)' },
};

export default async function RecordsPage() {
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
    .select('module_id, status, is_competent, score, attempts, completed_at, updated_at')
    .eq('operator_id', user.id)
    .order('updated_at', { ascending: false });

  const competentCount  = (progress ?? []).filter(p => p.is_competent).length;
  const totalAttempts   = (progress ?? []).reduce((sum, p) => sum + (p.attempts ?? 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div>
        <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Training Records</MonoLabel>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
          Operator File
        </h1>
      </div>

      <Rule />

      {/* Operator card */}
      <section style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '24px' }}>
        <div className="operator-card-grid">
          {[
            { label: 'Operator ID', value: operator?.operator_id ?? '—' },
            { label: 'Full Name',   value: operator?.full_name ?? '—' },
            { label: 'Track',       value: (operator?.track ?? '—').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) },
            { label: 'Enrolled',    value: operator?.enrolled_at ? new Date(operator.enrolled_at).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>{label}</MonoLabel>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid-4" style={{ gap: '1px' }}>
        {[
          { value: `${competentCount}/16`,                                       label: 'Modules Completed' },
          { value: `${Math.round((competentCount / 16) * 100)}%`,                label: 'Track Progress'    },
          { value: `${totalAttempts}`,                                            label: 'Total Attempts'    },
          { value: (progress ?? []).filter(p => p.status === 'in_progress').length.toString(), label: 'In Progress' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>{s.value}</span>
            <MonoLabel size="xs">{s.label}</MonoLabel>
          </div>
        ))}
      </section>

      <Rule />

      {/* Progress table */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Module Progress</MonoLabel>

        {(progress ?? []).length === 0 ? (
          <div style={{ padding: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <MonoLabel size="xs">No module activity recorded yet. Begin Module 01 from the Curriculum tab.</MonoLabel>
          </div>
        ) : (
          <div className="table-scroll" style={{ border: '1px solid var(--border)' }}>
            <div className="rec-row" style={{ background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '480px' }}>
              {['Module', 'Title', 'Status', 'Score', 'Attempts', 'Completed'].map(col => (
                <span
                  key={col}
                  className={
                    col === 'Score'     ? 'rec-col-score'     :
                    col === 'Attempts'  ? 'rec-col-attempts'  :
                    col === 'Completed' ? 'rec-col-completed' : ''
                  }
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}
                >
                  {col}
                </span>
              ))}
            </div>
            {(progress ?? []).map((p, i) => {
              const isDone   = p.is_competent;
              const isFailed = p.status === 'failed' || p.status === 'reset';
              const statusColor = isDone ? 'var(--success)' : isFailed ? 'var(--danger)' : 'var(--brass)';
              return (
                <div
                  key={p.module_id}
                  className="rec-row"
                  style={{
                    borderBottom: i < (progress ?? []).length - 1 ? '1px solid var(--border)' : 'none',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                    minWidth: '480px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>{p.module_id}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.module_id}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: statusColor, textTransform: 'uppercase' }}>{p.status?.replace(/_/g, ' ')}</span>
                  <span className="rec-col-score" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{p.score != null ? `${p.score}%` : '—'}</span>
                  <span className="rec-col-attempts" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{p.attempts ?? 0}</span>
                  <span className="rec-col-completed" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-mute)' }}>{p.completed_at ? new Date(p.completed_at).toLocaleDateString() : '—'}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
