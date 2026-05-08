import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const PILLARS = [
  {
    num: '01',
    title: 'Competency Over Compliance',
    body: 'Minimum state requirements set the floor, not the ceiling. Every Spartan module is built to produce operators who can perform in the field — not just operators who passed a test.',
  },
  {
    num: '02',
    title: 'Verified Authority',
    body: 'All curriculum is developed and delivered by Georgia-licensed professionals. PDSC001719 and CFTR001295 credentials are not decorative — they are the legal foundation for everything we teach.',
  },
  {
    num: '03',
    title: 'Hard Gate Integrity',
    body: 'Operators cannot advance to the next module without demonstrating mastery of the current one. There is no shortcut through the curriculum. The gate is enforced at the database level.',
  },
  {
    num: '04',
    title: 'Forensic Accountability',
    body: 'Every assessment, every score, every completion event is logged in an immutable audit trail. Certifications issued by Spartan Training are verifiable and traceable.',
  },
] as const;

export default function AboutPage() {
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
            <Link key={item.label} href={item.href} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', color: item.href === '/about' ? 'var(--brass)' : 'var(--ink-dim)', textDecoration: 'none', textTransform: 'uppercase' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/sign-in"><BrassButton variant="ghost" size="sm">Sign In</BrassButton></Link>
          <Link href="/apply"><BrassButton variant="primary" size="sm">Apply ⤳</BrassButton></Link>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '64px 56px', maxWidth: '960px' }}>

        <div style={{ marginBottom: '48px' }}>
          <MonoLabel style={{ marginBottom: '16px' }}>SPARTAN TRAINING LLC · MJM 2026</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.0, marginBottom: '24px' }}>
            The Standard for<br />
            <em style={{ fontStyle: 'normal', background: 'linear-gradient(90deg, var(--brass-light), var(--brass))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Those Who Protect.
            </em>
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--ink-dim)', maxWidth: '600px', lineHeight: 1.8 }}>
            Spartan Training LLC is an independent Georgia-licensed security training company operating under PDSC001719 — built to set a new standard for armed security accreditation in the state.
          </p>
        </div>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Mission */}
        <section style={{ marginBottom: '56px' }}>
          <MonoLabel style={{ marginBottom: '20px', display: 'block' }}>Mission</MonoLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8 }}>
              The private security industry in Georgia has a training problem. State-minimum requirements produce operators who are legally authorized but operationally unprepared. Spartan Training exists to close that gap.
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8 }}>
              Every module in the MJM 2026 curriculum was designed around one question: what does an operator actually need to know and do to protect people and property effectively, legally, and with accountability?
            </p>
          </div>
        </section>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Pillars */}
        <section style={{ marginBottom: '56px' }}>
          <MonoLabel style={{ marginBottom: '24px', display: 'block' }}>Core Principles</MonoLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
            {PILLARS.map(p => (
              <div key={p.num} style={{ background: 'var(--bg)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.14em' }}>{p.num}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Accreditation */}
        <section style={{ marginBottom: '48px' }}>
          <MonoLabel style={{ marginBottom: '20px', display: 'block' }}>Regulatory Authority</MonoLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { code: 'PDSC001719', body: 'Georgia Board of Private Detective & Security Agencies — Licensed Private Detective & Security Agency. The legal foundation for all instruction delivered under the Spartan Training brand.' },
              { code: 'CFTR001295', body: 'Certified Firearms Trainer — Range-certified instructor authorization covering live fire qualification, range safety officer duties, and firearm handling instruction for armed security candidates.' },
              { code: 'GBPDSA',     body: 'Georgia Board of Private Detective & Security Agencies — All curriculum, instructional hours, and certification outcomes are designed to satisfy and exceed GBPDSA minimum training requirements for armed security officers.' },
            ].map(a => (
              <div key={a.code} style={{ padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.14em', minWidth: '100px', paddingTop: '2px' }}>{a.code}</span>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Link href="/apply">
          <BrassButton variant="primary" size="lg">Begin Your File ⤳</BrassButton>
        </Link>

      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoLabel size="xs">SPARTAN TRAINING LLC · MJM 2026</MonoLabel>
        <MonoLabel size="xs">Georgia PDSC001719 · CFTR001295</MonoLabel>
      </footer>
    </div>
  );
}
