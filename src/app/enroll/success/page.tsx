import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

export default function EnrollmentSuccessPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'linear-gradient(145deg, var(--bg-elev-2) 0%, var(--bg-elev-1) 100%)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          padding: '48px',
        }}
      >
        {/* Brass corner brackets */}
        {[
          { top: 0,    left: 0,  borderTop:    '2px solid var(--brass)', borderLeft:   '2px solid var(--brass)' },
          { top: 0,    right: 0, borderTop:    '2px solid var(--brass)', borderRight:  '2px solid var(--brass)' },
          { bottom: 0, left: 0,  borderBottom: '2px solid var(--brass)', borderLeft:   '2px solid var(--brass)' },
          { bottom: 0, right: 0, borderBottom: '2px solid var(--brass)', borderRight:  '2px solid var(--brass)' },
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />)}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Lockup logoSize={48} textSize="md" />
          <MonoLabel dot dotColor="var(--success)">Payment Confirmed</MonoLabel>
        </div>

        <Rule style={{ marginBottom: '32px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.1,
                marginBottom: '12px',
              }}
            >
              Enrollment Confirmed
            </h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.7 }}>
              Your payment has been processed and your operator file has been created.
            </p>
          </div>

          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(80,160,80,.06)',
              border: '1px solid rgba(80,160,80,.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <MonoLabel dot dotColor="var(--success)">Action Required</MonoLabel>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
              A secure sign-in link has been dispatched to your email address. Click the link to access your operator account and complete account setup.
            </p>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--bg-elev-3)', border: '1px solid var(--border)' }}>
            <MonoLabel size="xs" style={{ display: 'block', marginBottom: '8px' }}>What Happens Next</MonoLabel>
            {[
              '1. Check your email for the sign-in link',
              '2. Click the link to access your operator dashboard',
              '3. Set a permanent passphrase in Account Settings',
              '4. Complete MFA enrollment before beginning Module 01',
            ].map(step => (
              <p key={step} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.8 }}>
                {step}
              </p>
            ))}
          </div>
        </div>

        <Rule style={{ marginBottom: '24px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/sign-in">
            <BrassButton variant="primary" size="md">
              Sign In to Dashboard ⤳
            </BrassButton>
          </Link>
          <MonoLabel size="xs">MJM 2026 · GBPDSA</MonoLabel>
        </div>
      </div>
    </div>
  );
}
