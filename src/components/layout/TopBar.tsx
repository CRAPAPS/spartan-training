'use client';

import { MonoLabel } from '@/components/primitives/MonoLabel';
import { signOutAction } from '@/app/actions/auth';

interface TopBarProps {
  operatorId?: string;
  role?: string;
  onMenuToggle?: () => void;
}

export function TopBar({ operatorId = '—', role, onMenuToggle }: TopBarProps) {
  const now = new Date();
  const utc = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const build = `BUILD ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Hamburger — mobile only */}
        <button className="hamburger" onClick={onMenuToggle} aria-label="Open navigation">
          ☰
        </button>

        <div className="topbar-meta">
          <MonoLabel dot dotColor="var(--success)">ONLINE</MonoLabel>
          <MonoLabel>{utc}</MonoLabel>
          <MonoLabel>{build}</MonoLabel>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {role && role !== 'agent' && (
          <MonoLabel
            dot
            dotColor={role === 'super_admin' ? 'var(--danger)' : role === 'coordinator' ? 'var(--success)' : 'var(--brass)'}
            size="xs"
            style={{ whiteSpace: 'nowrap' }}
          >
            {role === 'super_admin' ? 'SUPER ADMIN' : role === 'coordinator' ? 'COORDINATOR' : 'ADMIN'}
          </MonoLabel>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-1)',
          }}
        >
          <span
            style={{
              width: '22px',
              height: '22px',
              background: 'var(--bg-elev-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--brass)',
              flexShrink: 0,
            }}
          >
            OP
          </span>
          <MonoLabel style={{ whiteSpace: 'nowrap' }}>{operatorId}</MonoLabel>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--ink-mute)',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              cursor: 'pointer',
              height: '26px',
              whiteSpace: 'nowrap',
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
