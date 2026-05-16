import Link from 'next/link';
import { PublicNav } from '@/components/layout/PublicNav';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const TRACKS = [
  {
    num: 'I', id: 'armed-security', title: 'Armed Security Officer',
    hours: '16 hrs', hoursDetail: '8 hrs online · 8 hrs range', modules: 16, price: '$249', active: true,
    desc: 'GBPDSA-compliant armed security officer training covering legal authority, use of force, firearms safety, and Georgia licensing requirements. Includes 8 hours of online classroom instruction and 8 hours of live-fire range qualification with a GA-licensed Firearms Instructor.',
    rangeNote: 'Range qualification required with a GBPDSA-licensed Firearms Instructor — minimum 80% to qualify.',
    topics: ['Legal Foundations & Use of Force', 'Firearms Safety & Handling', 'Threat Assessment', 'Emergency Response', 'Georgia GBPDSA Compliance', 'Final Accreditation Exam'],
  },
  {
    num: 'II', id: 'unarmed-security', title: 'Unarmed Security Officer',
    hours: '24 hrs', hoursDetail: '24 hrs online', modules: 0, price: '$199', active: false,
    desc: 'Georgia GBPDSA-compliant unarmed security officer training covering professional conduct, conflict de-escalation, access control, incident documentation, and legal authority for unarmed personnel.',
    rangeNote: '',
    topics: ['Legal Authority & Limitations', 'Conflict De-escalation', 'Access Control', 'Incident Documentation', 'Georgia GBPDSA Compliance'],
  },
  {
    num: 'III', id: 'private-detective', title: 'Private Detective',
    hours: '72 hrs', hoursDetail: '72 hrs online', modules: 24, price: '$849', active: true,
    desc: 'Comprehensive private investigation curriculum covering surveillance, evidence handling, legal authority, and investigative methodology under Georgia GBPDSA Title 43, Chapter 38.',
    rangeNote: '',
    topics: ['Surveillance Techniques', 'Evidence Documentation', 'Legal Authority & Boundaries', 'Report Writing', 'Digital Investigation Basics'],
  },
  {
    num: 'IV', id: 'ethics-ceu', title: 'Professional Ethics (CEU)',
    hours: 'CEU', hoursDetail: 'Required every 2 years', modules: 0, price: 'Coming Soon', active: false,
    desc: 'Georgia-required continuing education unit covering professional ethics, conduct standards, and legal obligations for licensed security and investigation professionals. Satisfies the GBPDSA 2-year Ethics CEU mandate.',
    rangeNote: '',
    topics: ['Professional Conduct Standards', 'Ethical Decision-Making', 'Legal Obligations', 'Disciplinary Procedures', 'GBPDSA Code of Ethics'],
  },
  {
    num: 'V', id: 'anti-terrorism', title: 'Anti-Terrorism (CEU)',
    hours: 'CEU', hoursDetail: 'Required every 2 years', modules: 0, price: 'Coming Soon', active: false,
    desc: 'Georgia-required continuing education unit covering terrorism awareness, threat recognition, protective response protocols, and coordination with law enforcement. Satisfies the GBPDSA 2-year Anti-Terrorism CEU mandate.',
    rangeNote: '',
    topics: ['Terrorism Awareness', 'Threat Indicator Recognition', 'Protective Response', 'Law Enforcement Coordination', 'Reporting Protocols'],
  },
  {
    num: 'VI', id: 'executive-protection', title: 'Executive Protection',
    hours: '24 hrs', hoursDetail: '24 hrs online', modules: 0, price: '$249', active: false,
    desc: 'Executive protection specialist training covering advance work, protective intelligence, motorcade operations, and dignitary security.',
    rangeNote: '',
    topics: ['Advance Work & Reconnaissance', 'Threat & Risk Assessment', 'Protective Intelligence', 'Motorcade Operations', 'Crisis Response'],
  },
] as const;

const PI_MODULES = [
  { seq: '01', title: 'Introduction to Private Investigation in Georgia',          hours: '3.0' },
  { seq: '02', title: 'Legal Authority & Limitations of Private Detectives',       hours: '3.0' },
  { seq: '03', title: 'Ethics, Conduct & Professional Standards',                  hours: '3.0' },
  { seq: '04', title: 'Surveillance Techniques & Operational Security',            hours: '3.0' },
  { seq: '05', title: 'Stationary & Mobile Surveillance Operations',               hours: '3.0' },
  { seq: '06', title: 'Evidence Collection, Handling & Chain of Custody',          hours: '3.0' },
  { seq: '07', title: 'Photography, Video & Digital Documentation',                hours: '3.0' },
  { seq: '08', title: 'Interviewing Techniques & Statement Analysis',              hours: '3.0' },
  { seq: '09', title: 'Record Research & Open-Source Intelligence',                hours: '3.0' },
  { seq: '10', title: 'Skip Tracing & Asset Location Fundamentals',                hours: '3.0' },
  { seq: '11', title: 'Background Investigation Methodology',                      hours: '3.0' },
  { seq: '12', title: 'Domestic & Civil Investigations',                           hours: '3.0' },
  { seq: '13', title: 'Workers\' Compensation & Insurance Fraud Investigations',   hours: '3.0' },
  { seq: '14', title: 'Corporate & Internal Investigations',                       hours: '3.0' },
  { seq: '15', title: 'Cyber Investigation Basics & Digital Evidence',             hours: '3.0' },
  { seq: '16', title: 'Undercover Operations & Confidential Informants',           hours: '3.0' },
  { seq: '17', title: 'Testifying as an Expert Witness',                           hours: '3.0' },
  { seq: '18', title: 'Report Writing & Professional Documentation',               hours: '3.0' },
  { seq: '19', title: 'Missing Persons & Fugitive Recovery (Boundaries)',          hours: '3.0' },
  { seq: '20', title: 'Coordinating with Law Enforcement & Legal Counsel',         hours: '3.0' },
  { seq: '21', title: 'Georgia Licensing: GBPDSA Title 43, Chapter 38',           hours: '3.0' },
  { seq: '22', title: 'Case Management & Client Relations',                        hours: '3.0' },
  { seq: '23', title: 'Scenario Practicum: Field Case Study',                      hours: '3.0' },
  { seq: '24', title: 'Final Accreditation Examination',                           hours: '3.0' },
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

      <PublicNav />

      <main className="curriculum-main">

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <MonoLabel style={{ marginBottom: '16px' }}>MJM 2026 · GBPDSA Accreditation</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.05, marginBottom: '20px' }}>
            Accreditation Curriculum
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--ink-dim)', maxWidth: '640px', lineHeight: 1.7 }}>
            Six professional tracks covering the full spectrum of private security disciplines. Each track meets Georgia GBPDSA standards and delivers field-ready, licensure-compliant competency.
          </p>
        </div>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Track cards */}
        <section style={{ marginBottom: '64px' }}>
          <MonoLabel style={{ marginBottom: '24px', display: 'block' }}>Accreditation Tracks</MonoLabel>
          <div className="curriculum-tracks">
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
                {'rangeNote' in t && t.rangeNote && (
                  <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--brass)', padding: '8px 12px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', letterSpacing: '0.05em', lineHeight: 1.5 }}>{t.rangeNote}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <MonoLabel size="xs">{t.hoursDetail}</MonoLabel>
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
          <div className="curriculum-module-header">
            <MonoLabel dot dotColor="var(--success)">Track I — Armed Security Officer · 16 Modules</MonoLabel>
            <MonoLabel size="xs">8 HRS ONLINE · 8 HRS RANGE · $249</MonoLabel>
          </div>
          <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--brass)', padding: '10px 16px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', letterSpacing: '0.05em', lineHeight: 1.6, margin: 0 }}>
              RANGE REQUIREMENT — 8 hours of live-fire qualification must be completed with a GBPDSA-licensed Firearms Instructor at an approved range. Minimum passing score: 80%. Range session is separate from and in addition to this online curriculum.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
            {/* Header row */}
            <div className="curriculum-mod-row" style={{ background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Seq</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Module Title</span>
              <span className="curriculum-mod-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Hours</span>
            </div>
            {MJM_MODULES.map((m, i) => (
              <div
                key={m.seq}
                className="curriculum-mod-row"
                style={{
                  borderBottom: i < MJM_MODULES.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', fontWeight: 600 }}>{m.seq}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', fontWeight: parseInt(m.seq) === 16 ? 600 : 400 }}>{m.title}</span>
                <span className="curriculum-mod-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{m.hours}h</span>
              </div>
            ))}
          </div>
        </section>

        <Rule style={{ marginBottom: '48px', marginTop: '48px' }} />

        {/* Module breakdown — Private Detective */}
        <section>
          <div className="curriculum-module-header">
            <MonoLabel dot dotColor="var(--success)">Track III — Private Detective · 24 Modules</MonoLabel>
            <MonoLabel size="xs">72 HRS ONLINE · $849</MonoLabel>
          </div>
          <div style={{ background: 'var(--bg-elev-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--success)', padding: '10px 16px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)', letterSpacing: '0.05em', lineHeight: 1.6, margin: 0 }}>
              GEORGIA GBPDSA — All 72 hours completed online. Curriculum grounded in OCGA Title 43 Ch. 38, Title 16, Title 17, and applicable federal statutes. Minimum passing score: 70% per module.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div className="curriculum-mod-row" style={{ background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Seq</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Module Title</span>
              <span className="curriculum-mod-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>Hours</span>
            </div>
            {PI_MODULES.map((m, i) => (
              <div
                key={m.seq}
                className="curriculum-mod-row"
                style={{
                  borderBottom: i < PI_MODULES.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>{m.seq}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', fontWeight: m.seq === '24' ? 600 : 400 }}>{m.title}</span>
                <span className="curriculum-mod-hours" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{m.hours}h</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="curriculum-footer">
        <MonoLabel size="xs">SPARTAN TRAINING LLC · MJM 2026</MonoLabel>
        <MonoLabel size="xs">Georgia PDSC001719 · CFTR001295</MonoLabel>
      </footer>
    </div>
  );
}
