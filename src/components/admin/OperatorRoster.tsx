'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';

export interface OperatorData {
  id: string;
  operator_id: string;
  full_name: string;
  email: string;
  track: string;
  enrolled_at: string | null;
  role: string;
  competentCount: number;
  progressDetails: { module_id: string; status: string; is_competent: boolean; score: number | null }[];
}

const ROLE_COLOR: Record<string, string> = {
  agent:       'var(--ink-dim)',
  admin:       'var(--brass)',
  coordinator: 'var(--success)',
  super_admin: 'var(--danger)',
};

const ROLES = ['agent', 'admin', 'coordinator', 'super_admin'] as const;

export function OperatorRoster({ operators, selfRole }: { operators: OperatorData[]; selfRole: string }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const isSuperAdmin = selfRole === 'super_admin';

  async function changeRole(operatorId: string, newRole: string) {
    setUpdatingId(operatorId);
    try {
      const res = await fetch(`/api/admin/operators/${operatorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? 'Failed to update role');
        return;
      }
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  const statusColor: Record<string, string> = {
    completed:   'var(--success)',
    in_progress: 'var(--brass)',
    failed:      'var(--danger)',
    reset:       'var(--danger)',
    not_started: 'var(--bg-elev-3)',
  };

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 200px 120px 80px 120px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)' }}>
        {['ID', 'Name', 'Email', 'Enrolled', 'Progress', 'Role'].map(h => (
          <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>

      {operators.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <MonoLabel size="xs">No operators enrolled yet</MonoLabel>
        </div>
      )}

      {operators.map((op, i) => {
        const isExpanded = expandedId === op.id;
        const pct = Math.round((op.competentCount / 16) * 100);

        return (
          <div key={op.id} style={{ borderBottom: i < operators.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 200px 120px 80px 120px',
                gap: '8px',
                padding: '12px 16px',
                background: isExpanded ? 'rgba(197,160,89,.03)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedId(isExpanded ? null : op.id)}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', letterSpacing: '0.06em' }}>
                {op.operator_id}
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {op.full_name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {op.email}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)' }}>
                {op.enrolled_at ? new Date(op.enrolled_at).toLocaleDateString() : '—'}
              </span>

              {/* Progress bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '3px', background: 'var(--bg-elev-3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'var(--brass)', transition: 'width 300ms' }} />
                </div>
                <MonoLabel size="xs">{op.competentCount}/16</MonoLabel>
              </div>

              {/* Role — dropdown for super_admin */}
              <div onClick={e => e.stopPropagation()}>
                {isSuperAdmin ? (
                  <select
                    value={op.role}
                    disabled={updatingId === op.id}
                    onChange={e => changeRole(op.id, e.target.value)}
                    style={{
                      background: 'var(--bg-elev-2)', border: '1px solid var(--border)',
                      color: ROLE_COLOR[op.role] ?? 'var(--ink-dim)',
                      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em',
                      padding: '4px 6px', cursor: 'pointer', textTransform: 'uppercase', width: '100%',
                    }}
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                ) : (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: ROLE_COLOR[op.role] ?? 'var(--ink-dim)', textTransform: 'uppercase' }}>
                    {op.role.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>

            {/* Expanded module progress */}
            {isExpanded && (
              <div style={{ padding: '16px 16px 20px', background: 'rgba(197,160,89,.02)', borderTop: '1px solid rgba(197,160,89,.1)' }}>
                <MonoLabel size="xs" style={{ marginBottom: '12px', display: 'block' }}>Module Progress — {op.full_name}</MonoLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
                  {Array.from({ length: 16 }, (_, idx) => {
                    const modId = `MOD-${String(idx + 1).padStart(2, '0')}`;
                    const prog  = op.progressDetails.find(p => p.module_id === modId);
                    const status = prog?.status ?? 'not_started';
                    const bg = prog?.is_competent ? 'var(--success)' : statusColor[status] ?? 'var(--bg-elev-3)';
                    return (
                      <div
                        key={modId}
                        title={`${modId} — ${status}${prog?.score != null ? ` (${prog.score}%)` : ''}`}
                        style={{ height: '32px', background: bg, opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Complete', color: 'var(--success)' },
                    { label: 'In Progress', color: 'var(--brass)' },
                    { label: 'Failed', color: 'var(--danger)' },
                    { label: 'Not Started', color: 'var(--bg-elev-3)' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', background: s.color }} />
                      <MonoLabel size="xs">{s.label}</MonoLabel>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
