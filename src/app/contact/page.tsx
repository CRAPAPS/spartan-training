import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const INQUIRY_TYPES = [
  'Enrollment & Admissions',
  'Curriculum & Scheduling',
  'Corporate / Group Training',
  'Compliance & Regulatory',
  'Technical Support',
  'General Inquiry',
] as const;

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 56px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/"><Lockup logoSize={40} textSize="sm" /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { label: 'Curriculum', href: '/curriculum' },
            { label: 'Faculty',    href: '/faculty' },
            { label: 'About',      href: '/about' },
            { label: 'Contact',    href: '/contact' },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', color: item.href === '/contact' ? 'var(--brass)' : 'var(--ink-dim)', textDecoration: 'none', textTransform: 'uppercase' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/sign-in"><BrassButton variant="ghost" size="sm">Sign In</BrassButton></Link>
          <Link href="/apply"><BrassButton variant="primary" size="sm">Apply ⤳</BrassButton></Link>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '64px 56px' }}>

        <div style={{ marginBottom: '48px' }}>
          <MonoLabel style={{ marginBottom: '16px' }}>SHEL INFOSEC · Spartan Training</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.0 }}>
            Contact
          </h1>
        </div>

        <Rule style={{ marginBottom: '48px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '64px', alignItems: 'start' }}>

          {/* Left — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Contact Information</MonoLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Email',      value: 'ciso@shelinfosec.com' },
                  { label: 'Authority',  value: 'Georgia PDSC001719' },
                  { label: 'Instructor', value: 'CFTR001295' },
                  { label: 'Program',    value: 'MJM 2026 · GBPDSA Accreditation' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                    <MonoLabel size="xs" style={{ minWidth: '80px' }}>{row.label}</MonoLabel>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Rule />

            <div>
              <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Response Policy</MonoLabel>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.8 }}>
                All inquiries regarding enrollment, scheduling, and curriculum are responded to within one business day. Corporate and group training requests may require additional coordination time.
              </p>
            </div>

            <div style={{ padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)' }}>
              <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '12px', display: 'block' }}>Ready to Enroll?</MonoLabel>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, marginBottom: '16px' }}>
                If you are ready to begin your accreditation file, go directly to the application — no prior contact is required.
              </p>
              <Link href="/apply">
                <BrassButton variant="primary" size="sm">Begin Your File ⤳</BrassButton>
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-elev-1)', padding: '32px', position: 'relative' }}>
              {[
                { top: 0, left: 0,  borderTop: '2px solid var(--brass)', borderLeft: '2px solid var(--brass)' },
                { top: 0, right: 0, borderTop: '2px solid var(--brass)', borderRight: '2px solid var(--brass)' },
                { bottom: 0, left: 0,  borderBottom: '2px solid var(--brass)', borderLeft: '2px solid var(--brass)' },
                { bottom: 0, right: 0, borderBottom: '2px solid var(--brass)', borderRight: '2px solid var(--brass)' },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '20px', height: '20px', ...s }} />)}

              <MonoLabel style={{ marginBottom: '24px', display: 'block' }}>Send a Message</MonoLabel>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Full Name</MonoLabel>
                  <input type="text" name="name" required style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Email Address</MonoLabel>
                  <input type="email" name="email" required style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Inquiry Type</MonoLabel>
                  <select name="inquiry_type" style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', appearance: 'none' }}>
                    {INQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#16171b' }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Message</MonoLabel>
                  <textarea name="message" required rows={5} style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <BrassButton type="submit" variant="primary" size="md" style={{ alignSelf: 'flex-start' }}>
                  Send Message ⤳
                </BrassButton>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoLabel size="xs">SHEL INFOSEC · SPARTAN TRAINING · MJM 2026</MonoLabel>
        <MonoLabel size="xs">Georgia PDSC001719 · CFTR001295</MonoLabel>
      </footer>
    </div>
  );
}
