import Script from 'next/script';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const TRACKS = [
  { id: 'armed-security',       label: 'ALPHA',   name: 'Armed Security',       hours: '16 hrs', price: '$199' },
  { id: 'private-detective',    label: 'BRAVO',   name: 'Private Detective',    hours: '72 hrs', price: '$349' },
  { id: 'executive-protection', label: 'CHARLIE', name: 'Executive Protection', hours: '24 hrs', price: '$249' },
] as const;

interface ApplyPageProps {
  searchParams: Promise<{ error?: string; track?: string }>;
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const { error, track: selectedTrack } = await searchParams;

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
        padding: '24px 16px',
      }}
    >
      <div
        className="apply-card"
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
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />)}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <Lockup logoSize={48} textSize="md" />
          <MonoLabel>Open Enrollment · MJM 2026</MonoLabel>
        </div>

        <Rule style={{ marginBottom: '32px' }} />

        {error && (
          <div style={{ marginBottom: '20px', padding: '10px 14px', background: 'rgba(192,64,48,.12)', border: '1px solid var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--danger)', textTransform: 'uppercase' }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action="/api/apply" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Personal info */}
          <div>
            <MonoLabel style={{ marginBottom: '16px' }}>Operator Identity</MonoLabel>
            <div className="grid-2">
              {[
                { label: 'Full Legal Name', name: 'full_name',      type: 'text',  required: true  },
                { label: 'Email Address',   name: 'email',          type: 'email', required: true  },
                { label: 'State',           name: 'state',          type: 'text',  required: false },
                { label: 'License Number',  name: 'license_number', type: 'text',  required: false },
              ].map(f => (
                <div key={f.name}>
                  <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>{f.label}</MonoLabel>
                  <input
                    type={f.type} name={f.name} required={f.required}
                    style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <Rule />

          {/* Track selection */}
          <div>
            <MonoLabel style={{ marginBottom: '16px' }}>Select Accreditation Track</MonoLabel>
            <div className="grid-3">
              {TRACKS.map(t => (
                <label key={t.id} style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="radio" name="track" value={t.id} defaultChecked={selectedTrack === t.id || t.id === 'armed-security'} style={{ display: 'none' }} />
                  <div style={{ padding: '16px', border: '1px solid var(--border-strong)', background: 'var(--bg-elev-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: 'var(--brass)', letterSpacing: '0.1em' }}>{t.label}</span>
                      <MonoLabel size="xs">{t.price}</MonoLabel>
                    </div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{t.name}</span>
                    <MonoLabel size="xs">{t.hours}</MonoLabel>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Rule />

          {/* Billing notice */}
          <div style={{ padding: '14px 18px', background: 'var(--bg-elev-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <MonoLabel dot dotColor="var(--brass)" style={{ marginTop: '2px', whiteSpace: 'nowrap' }}>Secure Checkout</MonoLabel>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6, margin: 0 }}>
              After submitting, you will be directed to a secure Stripe payment page. Your accreditation account is created automatically upon confirmed payment.
            </p>
          </div>

          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-theme="dark"
            style={{ margin: '4px 0' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <BrassButton type="submit" variant="primary" size="lg">
              Proceed to Secure Payment ⤳
            </BrassButton>
            <a href="/sign-in" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-mute)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              Already enrolled? Sign in →
            </a>
          </div>

        </form>

        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      </div>
    </div>
  );
}
