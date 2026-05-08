'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';
import { Rule } from '@/components/primitives/Rule';

interface CooldownScreenProps {
  moduleId: string;
  moduleTitle: string;
  cooldownUntil: string;
}

export function CooldownScreen({ moduleId, moduleTitle, cooldownUntil }: CooldownScreenProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const target = new Date(cooldownUntil).getTime();
    const update = () => setRemaining(Math.max(0, target - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{ maxWidth: '600px' }}>
      <MonoLabel style={{ marginBottom: '8px' }}>Assessment Locked · {moduleId}</MonoLabel>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--ink)',
        marginBottom: '8px',
        lineHeight: 1.15,
      }}>
        {moduleTitle}
      </h1>

      <Rule style={{ margin: '24px 0' }} />

      <div style={{
        padding: '24px',
        border: '1px solid rgba(232,64,64,.4)',
        background: 'rgba(232,64,64,.04)',
        marginBottom: '28px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#E84040',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          ⚠ Tactical Reset — 24-Hour Lockout Active
        </div>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '13px',
          color: 'var(--ink-dim)',
          lineHeight: 1.7,
          margin: '0 0 24px',
        }}>
          A Critical Fail was recorded on your last attempt. This indicates a potential safety risk under operational conditions. A 24-hour mandatory review period is enforced before you may re-attempt this assessment. Use this time to thoroughly review the module content.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[fmt(h), fmt(m), fmt(s)].map((val, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#E84040',
                letterSpacing: '-0.02em',
                minWidth: '52px',
                textAlign: 'center',
              }}>
                {val}
              </span>
              {i < 2 && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'rgba(232,64,64,.5)', marginBottom: '2px' }}>:</span>
              )}
            </span>
          ))}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'var(--ink-mute)',
            textTransform: 'uppercase',
            marginLeft: '12px',
            alignSelf: 'flex-end',
            paddingBottom: '6px',
          }}>
            remaining
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href={`/dashboard/module/${moduleId}`}>
          <BrassButton variant="primary" size="md">Review Module Content ⤳</BrassButton>
        </Link>
        <Link href="/dashboard/curriculum">
          <BrassButton variant="ghost" size="md">Back to Curriculum</BrassButton>
        </Link>
      </div>
    </div>
  );
}
