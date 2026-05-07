'use client';

import { useState, useRef, useEffect } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';

interface CSOConfirmDialogProps {
  isOpen: boolean;
  action: string;
  description: string;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

export function CSOConfirmDialog({
  isOpen,
  action,
  description,
  onConfirm,
  onCancel,
}: CSOConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleConfirm() {
    if (!password) {
      setError('Passphrase required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onConfirm(password);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          width: '420px', maxWidth: '92vw',
          background: 'var(--bg-elev-1)',
          border: '1px solid var(--danger)',
          padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}
      >
        {/* Header */}
        <div>
          <MonoLabel dot dotColor="var(--danger)" style={{ marginBottom: '8px' }}>
            CSO CONFIRMATION REQUIRED
          </MonoLabel>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '16px',
            fontWeight: 700, color: 'var(--ink)', margin: 0,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {action}
          </h2>
        </div>

        {/* Warning */}
        <div style={{
          background: 'rgba(192,64,48,.08)',
          border: '1px solid rgba(192,64,48,.3)',
          padding: '12px 14px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--ink-dim)', margin: 0, lineHeight: 1.6,
            letterSpacing: '0.06em',
          }}>
            {description}
          </p>
        </div>

        {/* Passphrase input */}
        <div>
          <MonoLabel size="xs" style={{ marginBottom: '8px', display: 'block' }}>
            Enter CISO Passphrase to Authorize
          </MonoLabel>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') onCancel(); }}
            placeholder="Passphrase"
            style={{
              width: '100%', padding: '10px 0',
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${error ? 'var(--danger)' : 'var(--border-strong)'}`,
              color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: 'var(--danger)', margin: '6px 0 0',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)',
              fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            Abort
          </button>
          <BrassButton
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Authorize ⤳'}
          </BrassButton>
        </div>
      </div>
    </div>
  );
}
