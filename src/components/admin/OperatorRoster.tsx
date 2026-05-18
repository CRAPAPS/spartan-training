'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { EnrollOperatorForm } from './EnrollOperatorForm';

export interface OperatorData {
  id: string;
  operator_id: string;
  full_name: string;
  email: string;
  track: string;
  enrolled_at: string | null;
  role: string;
  competentCount: number;
  enrolledTracks: string[];
  progressDetails: { module_id: string; status: string; is_competent: boolean; score: number | null }[];
}

const ROLE_COLOR: Record<string, string> = {
  agent:       'var(--ink-dim)',
  admin:       'var(--brass)',
  coordinator: 'var(--success)',
  super_admin: 'var(--danger)',
};

const ROLES = ['agent', 'admin', 'coordinator', 'super_admin'] as const;

const TRACK_LABEL: Record<string, string> = {
  'armed-security':    'ARMED SEC',
  'private-detective': 'PRIV DET',
  'unarmed-security':  'UNARMED',
};

const TRACK_COLOR: Record<string, string> = {
  'armed-security':    'var(--brass)',
  'private-detective': 'var(--success)',
  'unarmed-security':  '#6BA3BE',
};

const TRACK_MODULE_COUNT: Record<string, number> = {
  'armed-security':    16,
  'private-detective': 24,
  'unarmed-security':  24,
};

const AVAILABLE_TRACKS = [
  { id: 'armed-security',    label: 'Armed Security (16hr)',    active: true  },
  { id: 'private-detective', label: 'Private Detective (72hr)', active: true  },
  { id: 'unarmed-security',  label: 'Unarmed Security (24hr)', active: true  },
];

const statusColor: Record<string, string> = {
  completed:   'var(--success)',
  in_progress: 'var(--brass)',
  failed:      'var(--danger)',
  reset:       'var(--danger)',
  not_started: 'var(--bg-elev-3)',
};

export function OperatorRoster({ operators, selfRole }: { operators: OperatorData[]; selfRole: string }) {
  const router = useRouter();
  const [expandedId,     setExpandedId]    = useState<string | null>(null);
  const [updatingId,     setUpdatingId]    = useState<string | null>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [managingId,     setManagingId]    = useState<string | null>(null);
  const [manageTracks,   setManageTracks]  = useState<string[]>([]);
  const [saveLoading,    setSaveLoading]   = useState(false);
  const [magicLinks,     setMagicLinks]    = useState<Record<string, string>>({});
  const [linkLoading,    setLinkLoading]   = useState<string | null>(null);

  const isPrivileged = ['super_admin', 'coordinator', 'admin'].includes(selfRole);

  async function changeRole(operatorId: string, newRole: string) {
    setUpdatingId(operatorId);
    try {
      const res = await fetch(`/api/admin/operators/${operatorId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error ?? 'Failed'); return; }
      router.refresh();
    } finally { setUpdatingId(null); }
  }

  function openManage(op: OperatorData) {
    setManagingId(op.id);
    setManageTracks([...op.enrolledTracks]);
  }

  function toggleManageTrack(trackId: string) {
    setManageTracks(prev =>
      prev.includes(trackId) ? prev.filter(t => t !== trackId) : [...prev, trackId]
    );
  }

  async function saveEnrollment(operatorId: string) {
    if (manageTracks.length === 0) { alert('Select at least one track'); return; }
    setSaveLoading(true);
    try {
      const res = await fetch(`/api/admin/operators/${operatorId}/enrollment`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: manageTracks, payment_method: 'manual' }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error ?? 'Failed'); return; }
      setManagingId(null);
      router.refresh();
    } finally { setSaveLoading(false); }
  }

  async function getLoginLink(operatorId: string) {
    setLinkLoading(operatorId);
    try {
      const res = await fetch(`/api/admin/operators/${operatorId}/magic-link`, { method: 'POST' });
      const data = await res.json();
      if (data.magicLink) setMagicLinks(prev => ({ ...prev, [operatorId]: data.magicLink }));
      else alert(data.error ?? 'Failed to generate link');
    } finally { setLinkLoading(null); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <MonoLabel dot dotColor="var(--brass)">Operator Roster — {operators.length} enrolled</MonoLabel>
        {isPrivileged && (
          <button
            onClick={() => setShowEnrollForm(v => !v)}
            style={{
              padding: '6px 14px',
              background: showEnrollForm ? 'rgba(197,160,89,.12)' : 'transparent',
              border: '1px solid rgba(197,160,89,.4)', color: 'var(--brass)',
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {showEnrollForm ? '✕ Close' : '+ Enroll New Operator'}
          </button>
        )}
      </div>

      {showEnrollForm && (
        <div style={{ marginBottom: '16px' }}>
          <EnrollOperatorForm onSuccess={() => router.refresh()} />
        </div>
      )}

      <div style={{ border: '1px solid var(--border)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 200px 120px 110px 120px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)' }}>
          {['ID', 'Name', 'Email', 'Enrolled', 'Tracks', 'Role'].map(h => (
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
          const isManaging = managingId === op.id;
          const shownLink  = magicLinks[op.id];
          const totalMods  = op.enrolledTracks.reduce((s, t) => s + (TRACK_MODULE_COUNT[t] ?? 0), 0) || 16;
          const pct        = Math.round((op.competentCount / totalMods) * 100);

          return (
            <div key={op.id} style={{ borderBottom: i < operators.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {/* Row */}
              <div
                style={{
                  display: 'grid', gridTemplateColumns: '110px 1fr 200px 120px 110px 120px',
                  gap: '8px', padding: '12px 16px', alignItems: 'center', cursor: 'pointer',
                  background: isExpanded ? 'rgba(197,160,89,.03)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                }}
                onClick={() => setExpandedId(isExpanded ? null : op.id)}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', letterSpacing: '0.06em' }}>{op.operator_id}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.full_name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.email}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)' }}>{op.enrolled_at ? new Date(op.enrolled_at).toLocaleDateString() : '—'}</span>

                {/* Track badges */}
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {op.enrolledTracks.length === 0
                    ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--danger)' }}>NONE</span>
                    : op.enrolledTracks.map(t => (
                        <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.08em', color: TRACK_COLOR[t] ?? 'var(--brass)', border: `1px solid ${TRACK_COLOR[t] ?? 'var(--brass)'}`, padding: '1px 4px', textTransform: 'uppercase' }}>
                          {TRACK_LABEL[t] ?? t}
                        </span>
                      ))
                  }
                </div>

                {/* Role */}
                <div onClick={e => e.stopPropagation()}>
                  {selfRole === 'super_admin' ? (
                    <select value={op.role} disabled={updatingId === op.id} onChange={e => changeRole(op.id, e.target.value)}
                      style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', color: ROLE_COLOR[op.role] ?? 'var(--ink-dim)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', padding: '4px 6px', cursor: 'pointer', textTransform: 'uppercase', width: '100%' }}>
                      {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ').toUpperCase()}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: ROLE_COLOR[op.role] ?? 'var(--ink-dim)', textTransform: 'uppercase' }}>
                      {op.role.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ padding: '16px 16px 20px', background: 'rgba(197,160,89,.02)', borderTop: '1px solid rgba(197,160,89,.1)' }}>

                  {/* Enrollment management */}
                  <div style={{ marginBottom: '14px', padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <MonoLabel size="xs">Enrolled Tracks</MonoLabel>
                      {isPrivileged && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {isManaging ? (
                            <>
                              <button onClick={() => saveEnrollment(op.id)} disabled={saveLoading}
                                style={{ padding: '4px 10px', background: 'var(--brass)', border: 'none', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                {saveLoading ? 'Saving…' : 'Save'}
                              </button>
                              <button onClick={() => setManagingId(null)}
                                style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button onClick={() => openManage(op)}
                              style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                              Manage
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {isManaging ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {AVAILABLE_TRACKS.map(t => (
                          <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: t.active ? 'pointer' : 'not-allowed', opacity: t.active ? 1 : 0.4 }}>
                            <input type="checkbox" checked={manageTracks.includes(t.id)} disabled={!t.active}
                              onChange={() => t.active && toggleManageTrack(t.id)}
                              style={{ accentColor: 'var(--brass)', width: '13px', height: '13px' }} />
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: t.active ? 'var(--ink)' : 'var(--ink-mute)' }}>{t.label}</span>
                            {!t.active && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--ink-mute)' }}>NOT READY</span>}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {op.enrolledTracks.length === 0
                          ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>No tracks enrolled — use Manage</span>
                          : op.enrolledTracks.map(t => (
                              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: TRACK_COLOR[t] ?? 'var(--brass)', border: `1px solid ${TRACK_COLOR[t] ?? 'var(--brass)'}`, padding: '3px 8px', textTransform: 'uppercase' }}>
                                {TRACK_LABEL[t] ?? t}
                              </span>
                            ))
                        }
                      </div>
                    )}
                  </div>

                  {/* Progress header + login link */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <MonoLabel size="xs">Module Progress — {op.competentCount}/{totalMods} competent · {pct}%</MonoLabel>
                    {isPrivileged && (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {shownLink ? (
                          <>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-dim)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shownLink}</span>
                            <button onClick={() => navigator.clipboard.writeText(shownLink)}
                              style={{ padding: '3px 8px', background: 'var(--bg-elev-2)', border: '1px solid var(--border)', color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                              Copy
                            </button>
                          </>
                        ) : (
                          <button onClick={() => getLoginLink(op.id)} disabled={linkLoading === op.id}
                            style={{ padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                            {linkLoading === op.id ? 'Generating…' : 'Get Login Link'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Armed Security grid */}
                  {(op.enrolledTracks.includes('armed-security') || op.enrolledTracks.length === 0) && (
                    <div style={{ marginBottom: '10px' }}>
                      <MonoLabel size="xs" style={{ marginBottom: '5px', display: 'block', color: 'var(--brass)' }}>Armed Security — MOD-01–16</MonoLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px' }}>
                        {Array.from({ length: 16 }, (_, idx) => {
                          const modId = `MOD-${String(idx + 1).padStart(2, '0')}`;
                          const prog  = op.progressDetails.find(p => p.module_id === modId);
                          const bg    = prog?.is_competent ? 'var(--success)' : (statusColor[prog?.status ?? 'not_started'] ?? 'var(--bg-elev-3)');
                          return (
                            <div key={modId} title={`${modId} — ${prog?.status ?? 'not_started'}${prog?.score != null ? ` (${prog.score}%)` : ''}`}
                              style={{ height: '26px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Private Detective grid */}
                  {op.enrolledTracks.includes('private-detective') && (
                    <div style={{ marginBottom: '10px' }}>
                      <MonoLabel size="xs" style={{ marginBottom: '5px', display: 'block', color: 'var(--success)' }}>Private Detective — PI-01–24</MonoLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px' }}>
                        {Array.from({ length: 24 }, (_, idx) => {
                          const modId = `PI-${String(idx + 1).padStart(2, '0')}`;
                          const prog  = op.progressDetails.find(p => p.module_id === modId);
                          const bg    = prog?.is_competent ? 'var(--success)' : (statusColor[prog?.status ?? 'not_started'] ?? 'var(--bg-elev-3)');
                          return (
                            <div key={modId} title={`${modId} — ${prog?.status ?? 'not_started'}${prog?.score != null ? ` (${prog.score}%)` : ''}`}
                              style={{ height: '26px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Unarmed Security grid */}
                  {op.enrolledTracks.includes('unarmed-security') && (
                    <div style={{ marginBottom: '10px' }}>
                      <MonoLabel size="xs" style={{ marginBottom: '5px', display: 'block', color: '#6BA3BE' }}>Unarmed Security — UAS-01–24</MonoLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px' }}>
                        {Array.from({ length: 24 }, (_, idx) => {
                          const modId = `UAS-${String(idx + 1).padStart(2, '0')}`;
                          const prog  = op.progressDetails.find(p => p.module_id === modId);
                          const bg    = prog?.is_competent ? 'var(--success)' : (statusColor[prog?.status ?? 'not_started'] ?? 'var(--bg-elev-3)');
                          return (
                            <div key={modId} title={`${modId} — ${prog?.status ?? 'not_started'}${prog?.score != null ? ` (${prog.score}%)` : ''}`}
                              style={{ height: '26px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,255,255,.7)', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {[{ label: 'Competent', color: 'var(--success)' }, { label: 'In Progress', color: 'var(--brass)' }, { label: 'Failed', color: 'var(--danger)' }, { label: 'Not Started', color: 'var(--bg-elev-3)' }].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
    </div>
  );
}
