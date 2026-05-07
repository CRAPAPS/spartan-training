'use client';

import { useRouter } from 'next/navigation';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

type GateState = 'pass' | 'fail' | 'critical_fail';

interface HardGateOverlayProps {
  state: GateState;
  score: number | null;
  moduleId: string;
  onRetry: () => void;
}

const config = {
  pass: {
    label:       'COMPETENCY VERIFIED',
    labelColor:  'var(--success)',
    headline:    'Module Complete.',
    sub:         'Competency confirmed. The next module is now unlocked.',
    cta:         'Proceed to Next Module ⤳',
    showRetry:   false,
  },
  fail: {
    label:       'SCORE INSUFFICIENT',
    labelColor:  'var(--brass)',
    headline:    'Score Below Standard.',
    sub:         'You did not meet the required score. Review the material and attempt again.',
    cta:         'Retry Module',
    showRetry:   true,
  },
  critical_fail: {
    label:       'TACTICAL RESET INITIATED',
    labelColor:  'var(--danger)',
    headline:    'Critical Failure.',
    sub:         'A legally designated question was answered incorrectly. Your progress for this module has been reset. Your commander has been notified. You must restart from the beginning.',
    cta:         'Restart Module',
    showRetry:   true,
  },
} as const;

export function HardGateOverlay({ state, score, moduleId, onRetry }: HardGateOverlayProps) {
  const router = useRouter();
  const c = config[state];

  function handleCTA() {
    if (state === 'pass') {
      router.push('/dashboard');
      router.refresh();
    } else {
      onRetry();
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(22,23,27,.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '40px',
          background: 'var(--bg-elev-2)',
          border: `1px solid ${state === 'critical_fail' ? 'var(--danger)' : 'var(--border-strong)'}`,
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <MonoLabel dot dotColor={c.labelColor}>{c.label}</MonoLabel>

        <Rule />

        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.05,
              marginBottom: '12px',
            }}
          >
            {c.headline}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              color: 'var(--ink-dim)',
              lineHeight: 1.6,
            }}
          >
            {c.sub}
          </p>
        </div>

        {score !== null && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-elev-3)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MonoLabel>Score Recorded</MonoLabel>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: state === 'pass' ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {score}%
            </span>
          </div>
        )}

        <Rule />

        <div style={{ display: 'flex', gap: '12px' }}>
          <BrassButton
            variant={state === 'pass' ? 'primary' : state === 'critical_fail' ? 'silver' : 'primary'}
            size="md"
            onClick={handleCTA}
          >
            {c.cta}
          </BrassButton>
          <BrassButton variant="ghost" size="md" onClick={() => router.push('/dashboard')}>
            Dashboard
          </BrassButton>
        </div>
      </div>
    </div>
  );
}
