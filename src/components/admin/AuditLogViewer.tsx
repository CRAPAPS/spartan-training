'use client';

import { useState } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';

export interface AuditEntry {
  id: number;
  operator_id: string | null;
  event: string;
  module_id: string | null;
  score: number | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

const EVENT_COLOR: Record<string, string> = {
  ENROLLMENT_COMPLETE: 'var(--success)',
  MODULE_START:        'var(--ink-dim)',
  SCORM_COMPLETE:      'var(--success)',
  SCORE_RECORDED:      'var(--ink)',
  CRITICAL_FAIL:       'var(--danger)',
  TACTICAL_RESET:      'var(--danger)',
  AUTH_FAILED:         'var(--danger)',
  LOGIN:               'var(--ink-mute)',
  MODULE_UNLOCK:       'var(--brass)',
  MFA_ENABLED:         'var(--brass)',
};

const ALL_EVENTS = ['ALL', 'ENROLLMENT_COMPLETE', 'MODULE_START', 'SCORM_COMPLETE', 'SCORE_RECORDED', 'CRITICAL_FAIL', 'TACTICAL_RESET', 'LOGIN', 'AUTH_FAILED'];

export function AuditLogViewer({ entries, operatorMap }: { entries: AuditEntry[]; operatorMap: Record<string, string> }) {
  const [filter, setFilter] = useState('ALL');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.event === filter);
  const criticalCount = entries.filter(e => e.event === 'CRITICAL_FAIL').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <MonoLabel size="xs">Filter:</MonoLabel>
        {ALL_EVENTS.map(ev => (
          <button
            key={ev}
            onClick={() => setFilter(ev)}
            style={{
              padding: '3px 8px',
              border: `1px solid ${filter === ev ? 'var(--brass)' : 'var(--border)'}`,
              background: filter === ev ? 'rgba(197,160,89,.1)' : 'transparent',
              color: filter === ev ? 'var(--brass)' : EVENT_COLOR[ev] ?? 'var(--ink-mute)',
              fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em',
              cursor: 'pointer', textTransform: 'uppercase',
            }}
          >
            {ev === 'ALL' ? `ALL (${entries.length})` : ev.replace('_', ' ')}
          </button>
        ))}
      </div>

      {criticalCount > 0 && (
        <div style={{ padding: '8px 12px', border: '1px solid rgba(192,64,48,.4)', background: 'rgba(192,64,48,.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--danger)', textTransform: 'uppercase' }}>
            ⚠ {criticalCount} Critical Fail{criticalCount !== 1 ? 's' : ''} on record
          </span>
        </div>
      )}

      {/* Log table */}
      <div className="table-scroll" style={{ border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 180px 110px 70px 140px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '580px' }}>
          {['Operator', 'Event', 'Module', 'Score', 'Timestamp'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <MonoLabel size="xs">No events match this filter</MonoLabel>
          </div>
        )}

        {filtered.map((entry, i) => {
          const ts      = new Date(entry.created_at);
          const isDanger  = entry.event === 'CRITICAL_FAIL' || entry.event === 'AUTH_FAILED' || entry.event === 'TACTICAL_RESET';
          const isExpanded = expanded === entry.id;
          const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0;

          return (
            <div key={entry.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 180px 110px 70px 140px',
                  gap: '8px',
                  padding: '9px 16px',
                  background: isDanger ? 'rgba(192,64,48,.04)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                  alignItems: 'center',
                  cursor: hasMetadata ? 'pointer' : 'default',
                  minWidth: '580px',
                }}
                onClick={() => hasMetadata && setExpanded(isExpanded ? null : entry.id)}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)' }}>
                  {operatorMap[entry.operator_id ?? ''] ?? '—'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', color: EVENT_COLOR[entry.event] ?? 'var(--ink-dim)', textTransform: 'uppercase' }}>
                  {entry.event.replace(/_/g, ' ')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)' }}>
                  {entry.module_id ?? '—'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)' }}>
                  {entry.score != null ? `${entry.score}%` : '—'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
                  {ts.toLocaleDateString()} {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isExpanded && hasMetadata && (
                <div style={{ padding: '10px 16px 12px', background: 'rgba(0,0,0,.2)', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>
                    METADATA: {JSON.stringify(entry.metadata)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MonoLabel size="xs">{filtered.length} events shown · Log is append-only and immutable</MonoLabel>
    </div>
  );
}
