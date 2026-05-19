import Link from 'next/link';
import Script from 'next/script';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { signInAction } from '@/app/actions/auth';

interface SignInPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        className="signin-card"
        style={{
          background: 'linear-gradient(145deg, var(--bg-elev-2) 0%, var(--bg-elev-1) 100%)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
        }}
      >
        {/* Brass corner brackets */}
        {[
          { top: 0,    left: 0,  borderTop:    '2px solid var(--brass)', borderLeft:   '2px solid var(--brass)' },
          { top: 0,    right: 0, borderTop:    '2px solid var(--brass)', borderRight:  '2px solid var(--brass)' },
          { bottom: 0, left: 0,  borderBottom: '2px solid var(--brass)', borderLeft:   '2px solid var(--brass)' },
          { bottom: 0, right: 0, borderBottom: '2px solid var(--brass)', borderRight:  '2px solid var(--brass)' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />
        ))}

        {/* Left — brand (hidden on mobile) */}
        <div className="signin-brand" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Lockup logoSize={96} textSize="lg" direction="column" glow />
          <Rule color="var(--brass)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <MonoLabel dot dotColor="var(--success)">Authority Verified</MonoLabel>
            <MonoLabel>Georgia PDSC001719</MonoLabel>
            <MonoLabel>CFTR001295 · Instructor</MonoLabel>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 500, color: 'var(--ink-dim)', lineHeight: 1.7, fontStyle: 'italic' }}>
            &ldquo;Authority is earned.&rdquo;
          </p>
        </div>

        {/* Right — form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Mobile-only logo */}
          <div className="show-mobile" style={{ marginBottom: '8px' }}>
            <Lockup logoSize={48} textSize="md" direction="row" />
          </div>

          <div>
            <MonoLabel style={{ marginBottom: '16px' }}>Issue Credential</MonoLabel>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
              Operator Authentication
            </h2>
          </div>

          <Rule />

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(192,64,48,.12)', border: '1px solid var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--danger)', textTransform: 'uppercase' }}>
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signInAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Email Address</MonoLabel>
              <input
                type="email" name="email" required autoComplete="email"
                style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Passphrase</MonoLabel>
              <input
                type="password" name="password" required autoComplete="current-password"
                style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-theme="dark"
              style={{ margin: '4px 0' }}
            />

            <BrassButton variant="primary" size="md" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              Issue Credential ⤳
            </BrassButton>
          </form>

          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />

          <div style={{ textAlign: 'center' }}>
            <Link href="/apply" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-mute)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              No file? Apply for accreditation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
