'use client';

import { useEffect, useRef, useState } from 'react';
import { HardGateOverlay } from './HardGateOverlay';
import { MonoLabel } from '@/components/primitives/MonoLabel';

interface SCORMPlayerClientProps {
  launchUrl: string;
  moduleId: string;
  moduleTitle: string;
}

type GateState = 'idle' | 'pass' | 'fail' | 'critical_fail';

export function SCORMPlayerClient({ launchUrl, moduleId, moduleTitle }: SCORMPlayerClientProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [gateState, setGateState] = useState<GateState>('idle');
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    function handleModuleComplete(e: Event) {
      const detail = (e as CustomEvent<{ hardGateResult: string; score?: number }>).detail;
      setScore(detail.score ?? null);

      if (detail.hardGateResult === 'PASS')           setGateState('pass');
      else if (detail.hardGateResult === 'FAIL')       setGateState('fail');
      else if (detail.hardGateResult === 'CRITICAL_FAIL') setGateState('critical_fail');
    }

    window.addEventListener('spartan:module-complete', handleModuleComplete);
    return () => window.removeEventListener('spartan:module-complete', handleModuleComplete);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '600px' }}>
      {/* Status bar */}
      <div
        style={{
          height: '32px',
          background: 'var(--bg-elev-2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <MonoLabel dot dotColor="var(--brass)">{moduleId}</MonoLabel>
        <MonoLabel>{moduleTitle.toUpperCase()}</MonoLabel>
        <MonoLabel dot dotColor={gateState === 'pass' ? 'var(--success)' : 'var(--ink-mute)'}>
          {gateState === 'idle' ? 'IN PROGRESS' : gateState.replace('_', ' ').toUpperCase()}
        </MonoLabel>
      </div>

      {/* SCORM Cloud iframe */}
      <iframe
        ref={iframeRef}
        src={launchUrl}
        title={moduleTitle}
        style={{
          width: '100%',
          height: 'calc(100% - 32px)',
          border: 'none',
          display: 'block',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="fullscreen"
      />

      {/* Hard Gate overlay — shown on completion events */}
      {gateState !== 'idle' && (
        <HardGateOverlay
          state={gateState}
          score={score}
          moduleId={moduleId}
          onRetry={() => setGateState('idle')}
        />
      )}
    </div>
  );
}
