'use client';

import { useState, useEffect, useRef } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { signOutAction } from '@/app/actions/auth';
import type { TrackProgress } from './DashboardShell';

const CIRC = 2 * Math.PI * 20; // r=20 → circumference ≈ 125.66

function TrackRing({ label, completed, total, pct, open }: TrackProgress & { open: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setCount(0);
      return;
    }
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setCount(Math.round(eased * pct));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [open, pct]);

  const offset = open ? CIRC * (1 - pct / 100) : CIRC;
  const done   = pct === 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 16px' }}>
      <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
        <svg width="48" height="48" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={done ? 'var(--success)' : 'var(--brass)'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: open ? 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
          />
        </svg>
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          letterSpacing: '0.02em',
          color: done ? 'var(--success)' : 'var(--ink)',
        }}>
          {count}%
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: done ? 'var(--success)' : 'var(--ink)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          letterSpacing: '0.08em',
          color: 'var(--ink-dim)',
          whiteSpace: 'nowrap',
        }}>
          {completed} / {total} modules
        </span>
      </div>
    </div>
  );
}

interface TopBarProps {
  operatorId?: string;
  role?: string;
  onMenuToggle?: () => void;
  trackProgress?: TrackProgress[];
}

export function TopBar({ operatorId = '—', role, onMenuToggle, trackProgress = [] }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const now   = new Date();
  const utc   = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const build = `BUILD ${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

  const roleLabel =
    role === 'super_admin'  ? 'SUPER ADMIN'  :
    role === 'coordinator'  ? 'COORDINATOR'  :
    role === 'admin'        ? 'ADMIN'        : 'AGENT';

  const roleDot =
    role === 'super_admin'  ? 'var(--danger)'  :
    role === 'coordinator'  ? 'var(--success)'  :
    role === 'admin'        ? 'var(--brass)'    : undefined;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="hamburger" onClick={onMenuToggle} aria-label="Open navigation">☰</button>
        <div className="topbar-meta">
          <MonoLabel dot dotColor="var(--success)">ONLINE</MonoLabel>
          <MonoLabel>{utc}</MonoLabel>
          <MonoLabel>{build}</MonoLabel>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {role && role !== 'agent' && (
          <MonoLabel dot dotColor={roleDot} size="xs" style={{ whiteSpace: 'nowrap' }}>
            {roleLabel}
          </MonoLabel>
        )}

        {/* Profile avatar + dropdown */}
        <div ref={containerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-haspopup="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 4px',
              border: `1px solid ${open ? 'var(--brass)' : 'var(--border)'}`,
              background: 'var(--bg-elev-1)',
              cursor: 'pointer',
              transition: 'border-color 150ms',
            }}
          >
            <span style={{
              width: '22px', height: '22px',
              background: open ? 'var(--brass)' : 'var(--bg-elev-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: open ? 'var(--bg)' : 'var(--brass)',
              flexShrink: 0,
              transition: 'background 150ms, color 150ms',
            }}>
              OP
            </span>
            <MonoLabel className="topbar-op-id">{operatorId}</MonoLabel>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '8px',
              color: 'var(--ink-mute)', lineHeight: 1,
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms',
            }}>▾</span>
          </button>

          {open && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '240px',
                background: 'var(--bg-elev-1)',
                border: '1px solid var(--border)',
                zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {/* Identity */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{
                  width: '32px', height: '32px',
                  background: 'var(--brass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--bg)', flexShrink: 0,
                }}>OP</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.12em', color: 'var(--ink)',
                    textTransform: 'uppercase',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {operatorId}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px',
                    letterSpacing: '0.1em', color: 'var(--ink-dim)',
                    textTransform: 'uppercase',
                  }}>
                    {roleLabel}
                  </div>
                </div>
              </div>

              {/* Course progress rings */}
              {trackProgress.length > 0 && (
                <div>
                  <div style={{
                    padding: '8px 16px 2px',
                    fontFamily: 'var(--font-mono)', fontSize: '8px',
                    letterSpacing: '0.16em', color: 'var(--ink-mute)',
                    textTransform: 'uppercase',
                  }}>
                    Course Progress
                  </div>
                  {trackProgress.map(tp => (
                    <TrackRing key={tp.track} {...tp} open={open} />
                  ))}
                </div>
              )}

              {/* Sign out */}
              <div style={{ borderTop: '1px solid var(--border)', padding: '8px' }}>
                <form action={signOutAction} style={{ margin: 0 }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--ink-mute)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
