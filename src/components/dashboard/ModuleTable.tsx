import Link from 'next/link';
import { MonoLabel } from '@/components/primitives/MonoLabel';

interface ModuleRow {
  id: string;
  title: string;
  track: string;
  progress: number;
  status: string;
  updatedAt?: string;
  isLocked?: boolean;
}

interface ModuleTableProps {
  modules: ModuleRow[];
}

const TRACK_LABEL: Record<string, string> = {
  'armed-security':    'ARMED SEC',
  'private-detective': 'PRIV DET',
  'unarmed-security':  'UNARMED',
};

const statusColor: Record<string, string> = {
  completed:   'var(--success)',
  in_progress: 'var(--brass)',
  failed:      'var(--danger)',
  reset:       'var(--danger)',
  not_started: 'var(--ink-mute)',
};

export function ModuleTable({ modules }: ModuleTableProps) {
  return (
    <div style={{ background: 'var(--bg-elev-1)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="mod-row" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elev-2)' }}>
        <MonoLabel>MOD</MonoLabel>
        <MonoLabel>TITLE</MonoLabel>
        <span className="mod-col-track"><MonoLabel>TRACK</MonoLabel></span>
        <span className="mod-col-prog"><MonoLabel>PROG</MonoLabel></span>
        <MonoLabel>STATUS</MonoLabel>
        <span className="mod-col-updated"><MonoLabel>UPDATED</MonoLabel></span>
      </div>

      {/* Rows */}
      {modules.map(m => (
        <div
          key={m.id}
          className="mod-row"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            opacity: m.isLocked ? 0.4 : 1,
          }}
        >
          <MonoLabel>{m.id.replace(/^[A-Z]+-/, '')}</MonoLabel>

          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {m.isLocked ? (
              <span style={{ color: 'var(--ink-mute)' }}>{m.title}</span>
            ) : (
              <Link href={`/dashboard/module/${m.id}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                {m.title}
              </Link>
            )}
          </span>

          <span className="mod-col-track">
            <MonoLabel size="xs">{TRACK_LABEL[m.track] ?? m.track.toUpperCase()}</MonoLabel>
          </span>

          {/* Progress bar */}
          <div className="mod-col-prog" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '3px', background: 'var(--bg-elev-3)', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${m.progress}%`,
                  background: statusColor[m.status] ?? 'var(--brass)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            <MonoLabel size="xs">{m.progress}%</MonoLabel>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor[m.status] ?? 'var(--ink-mute)', flexShrink: 0 }} />
            <MonoLabel size="xs">{m.status.replace('_', ' ').toUpperCase()}</MonoLabel>
          </div>

          <span className="mod-col-updated">
            <MonoLabel size="xs">{m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : '—'}</MonoLabel>
          </span>
        </div>
      ))}
    </div>
  );
}
