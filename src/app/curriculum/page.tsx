import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const TRACKS = [
  {
    num: 'I', id: 'armed-security', title: 'Armed Security Officer',
    hours: '16 hrs', modules: 16, price: '$199', active: true,
    desc: 'GBPDSA-compliant armed security officer training covering legal authority, use of force, firearms safety, and Georgia licensing requirements.',
    topics: ['Legal Foundations & Use of Force', 'Firearms Safety & Handling', 'Threat Assessment', 'Emergency Response', 'Georgia GBPDSA Compliance', 'Final Accreditation Exam'],
  },
  {
    num: 'II', id: 'private-investigation', title: 'Private Investigation',
    hours: '72 hrs', modules: 12, price: '$349', active: false,
    desc: 'Comprehensive private investigation curriculum covering surveillance, evidence handling, legal authority, and investigative methodology.',
    topics: ['Surveillance Techniques', 'Evidence Documentation', 'Legal Authority & Boundaries', 'Report Writing', 'Digital Investigation Basics'],
  },
  {
    num: 'III', id: 'executive-protection', title: 'Executive Protection',
    hours: '24 hrs', modules: 10, price: '$249', active: false,
    desc: 'Executive protection specialist training covering advance work, protective intelligence, motorcade operations, and dignitary security.',
    topics: ['Advance Work & Reconnaissance', 'Threat & Risk Assessment', 'Protective Intelligence', 'Motorcade Operations', 'Crisis Response'],
  },
  {
    num: 'IV', id: 'advance-work', title: 'Advance Work',
    hours: '16 hrs', modules: 8, price: 'Coming Soon', active: false,
    desc: 'Specialized advance work curriculum for security professionals managing pre-event site surveys, route planning, and logistics coordination.',
    topics: ['Site Survey Methodology', 'Route Analysis', 'Logistics Coordination', 'Threat Assessment'],
  },
  {
    num: 'V', id: 'firearms-instructor', title: 'Firearms Instructor',
    hours: '40 hrs', modules: 14, price: 'Coming Soon', active: false,
    desc: 'Certified firearms instructor program covering range safety, teaching methodology, legal liability, and qualification standards.',
    topics: ['Range Safety Management', 'Teaching Methodology', 'Qualification Standards', 'Legal Liability'],
  },
  {
    num: 'VI', id: 'use-of-force', title: 'Use of Force',
    hours: '8 hrs', modules: 6, price: 'Coming Soon', active: false,
    desc: 'Use of force continuum, legal authority, documentation, and post-incident procedures for security professionals.',
    topics: ['Force Continuum', 'Legal Thresholds', 'Documentation', 'Post-Incident Protocol'],
  },
  {
    num: 'VII', id: 'field-surveillance', title: 'Field Surveillance',
    hours: '24 hrs', modules: 9, price: 'Coming Soon', active: false,
    desc: 'Field surveillance operations including mobile and static surveillance, counter-surveillance, and technical observation methods.',
    topics: ['Mobile Surveillance', 'Static Operations', 'Counter-Surveillance', 'Technical Methods'],
  },
] as const;

const MJM_MODULES = [
  { seq: '01', title: 'Legal Foundations & Use of Force',      hours: '2.0' },
  { seq: '02', title: 'Firearms Safety & Handling',             hours: '1.5' },
  { seq: '03', title: 'Threat Assessment & De-escalation',      hours: '1.5' },
  { seq: '04', title: 'Post Orders & Site Security',            hours: '1.0' },
  { seq: '05', title: 'Emergency Response Procedures',          hours: '1.5' },
  { seq: '06', title: 'Patrol Techniques & Surveillance',       hours: '1.0' },
  { seq: '07', title: 'Report Writing & Documentation',         hours: '1.0' },
  { seq: '08', title: 'Access Control & Crowd Management',      hours: '1.0' },
  { seq: '09', title: 'First Aid & Crisis Response',            hours: '1.0' },
  { seq: '10', title: 'Georgia Law: GBPDSA Compliance',         hours: '1.0' },
  { seq: '11', title: 'Workplace Violence Prevention',          hours: '1.0' },
  { seq: '12', title: 'Cyber Awareness for Field Operators',    hours: '0.5' },
  { seq: '13', title: 'Evidence Handling & Chain of Custody',   hours: '0.5' },
  { seq: '14', title: 'Executive Protection Fundamentals',      hours: '0.5' },
  { seq: '15', title: 'Scenario Practicum: Field Judgment',     hours: '0.5' },
  { seq: '16', title: 'Final Accreditation Examination',        hours: '1.0' },
] as const;

export default function CurriculumPage() {
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
            <Link key={item.label} href={item.href} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', color: item.href === '/curriculum' ? 'var(--brass)' : 'var(--ink-dim)', textDecoration: 'none', textTransform: 'uppercase' }}>
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

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <MonoLabel style={{ marginBottom: '16px' }}>MJM 2026 · GBPDSA Accreditation</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.0, marginBottom: '20px' }}>
            Accreditation Curriculum
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--ink-dim)', maxWidth: '640px', lineHeight: 1.7 }}>
            Seven professional tracks covering the full spectrum of private security disciplines. Each track is designed to meet Georgia GBPDSA standards and delivers field-ready competency.
          </p>
        </div>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Track cards */}
        <section style={{ marginBottom: '64px' }}>
          <MonoLabel style={{ marginBottom: '24px', display: 'block' }}>Accreditation Tracks</MonoLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
            {TRACKS.map(t => (
              <div key={t.id} style={{ background: 'var(--bg)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: t.active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.12em' }}>{t.num}</span>
                  <MonoLabel size="xs" dot dotColor={t.active ? 'var(--success)' : 'var(--ink-mute)'}>
                    {t.active ? 'Enrolling' : 'Coming Soon'}
                  </MonoLabel>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>{t.title}</h3>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <MonoLabel size="xs">{t.hours}</MonoLabel>
                  <MonoLabel size="xs">{t.modules} modules</MonoLabel>
                  <MonoLabel size="xs" style={{ color: t.active ? 'var(--brass)' : 'var(--ink-mute)' }}>{t.price}</MonoLabel>
                </div>
                {t.active && (
                  <Link href={`/apply?track=${t.id}`}>
                    <BrassButton variant="silver" size="sm">Enroll in This Track ⤳</BrassButton>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Module breakdown — Armed Security */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <MonoLabel dot dotColor="var(--success)">Track I — Armed Security Officer · 16 Modules</MonoLabel>
            <MonoLabel size="xs">16.0 CREDIT HOURS</MonoLabel>
          </div>

          <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', padding: '8px 20px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)' }}>
              {['Seq', 'Module Title', 'Hours'].map(col => (
                <span key={col} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{col}</span>
              ))}
            </div>
            {MJM_MODULES.map((m, i) => (
              <div key={m.seq} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', padding: '12px 20px', borderBottom: i < MJM_MODULES.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>{m.seq}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', fontWeight: parseInt(m.seq) === 16 ? 600 : 400 }}>{m.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{m.hours}h</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoLabel size="xs">SPARTAN TRAINING LLC · MJM 2026</MonoLabel>
        <MonoLabel size="xs">Georgia PDSC001719 · CFTR001295</MonoLabel>
      </footer>
    </div>
  );
}
