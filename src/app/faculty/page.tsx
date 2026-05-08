import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { PhotoPlaceholder } from '@/components/primitives/PhotoPlaceholder';

const MAK_CREDENTIALS = [
  { code: 'PDSC001719', label: 'Georgia Licensed Private Detective & Security Agency' },
  { code: 'CFTR001295', label: 'GA Licensed State Instructor — Security / PI / Firearms' },
  { code: 'PDSG044581', label: 'Armed Guard & State Instructor — Georgia Licensed' },
  { code: 'NRA/USCCA',  label: 'Certified Firearms Instructor — NRA & USCCA' },
  { code: 'GA-DOD',     label: 'Officer, Georgia Department of Defense' },
  { code: 'GAPPI',      label: 'Board Member — Georgia Association of Professional Private Investigators' },
] as const;

const MAK_SPECIALIZATIONS = [
  'Armed Security Officer Training',
  'Executive & Close Protection Operations',
  'Use of Force & Legal Authority',
  'Firearms Qualification & Instruction',
  'Threat Assessment & Geopolitical Risk',
  'Active Shooter Response',
  'Private Investigation Methodology',
  'Home Invasion Prevention',
  'International Market Security Entry',
  'Military Weapons Instruction',
] as const;


const KUHN_CREDENTIALS = [
  { code: 'CySA+',    label: 'CompTIA Cybersecurity Analyst — Complete' },
  { code: 'SOC-24/7', label: 'Security Operations Centre Director' },
  { code: 'SIEM',     label: 'SIEM Systems, Endpoint Security & Cloud Infrastructure' },
  { code: 'SILENT',   label: 'SILENT EDGE — Military-Grade RMM Platform (Founder)' },
  { code: 'GDPR',     label: 'POPI Act, GDPR, PCI DSS Compliance Operations' },
] as const;

const KUHN_SPECIALIZATIONS = [
  'Cybersecurity Operations & SOC Management',
  'Endpoint Security & Threat Detection',
  'SIEM Systems & Cyber Intelligence',
  'Cloud & Premise-Based Security',
  'Incident Response & Automation',
  'Cyber Awareness & Training',
  'Compliance — GDPR / POPI / PCI DSS',
  'Managed Cybersecurity Services',
] as const;

const NAV_LINKS = [
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Faculty',    href: '/faculty' },
  { label: 'About',      href: '/about' },
  { label: 'Contact',    href: '/contact' },
] as const;

export default function FacultyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 56px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/"><Lockup logoSize={40} textSize="sm" /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {NAV_LINKS.map(item => (
            <Link key={item.label} href={item.href} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', color: item.href === '/faculty' ? 'var(--brass)' : 'var(--ink-dim)', textDecoration: 'none', textTransform: 'uppercase' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/sign-in"><BrassButton variant="ghost" size="sm">Sign In</BrassButton></Link>
          <Link href="/apply"><BrassButton variant="primary" size="sm">Apply</BrassButton></Link>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '64px 56px' }}>

        <div style={{ marginBottom: '48px' }}>
          <MonoLabel style={{ marginBottom: '16px' }}>Instructional Authority · MJM 2026</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.0 }}>
            Faculty
          </h1>
        </div>

        <Rule style={{ marginBottom: '48px' }} />

        {/* Lead instructor */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '48px', marginBottom: '64px' }}>

          {/* Photo + credentials */}
          <div>
            <PhotoPlaceholder width="100%" height="420px" caption="MAJ. MAKROPOULOS — PHOTOGRAPHY PENDING" />
            <div style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MAK_CREDENTIALS.map(c => (
                <div key={c.code} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--brass)', fontWeight: 600, minWidth: '80px', paddingTop: '2px' }}>{c.code}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', lineHeight: 1.5 }}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Contact info block */}
            <div style={{ marginTop: '12px', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: '4px' }}>Contact</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)' }}>mak@palisadeintl.com</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)' }}>770-639-3939</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', lineHeight: 1.5 }}>457 Nathan Dean Blvd, Suite 105-332<br />Dallas, GA 30132</span>
            </div>
          </div>

          {/* Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <MonoLabel dot dotColor="var(--success)" style={{ marginBottom: '12px' }}>Lead Instructor · Head of Organization</MonoLabel>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                MAJ. Michael &ldquo;Mak&rdquo; Makropoulos
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', letterSpacing: '0.12em', margin: 0 }}>
                DIRECTOR OF GEOPOLITICAL RISK · MANAGING DIRECTOR, PALISADE INTERNATIONAL
              </p>
            </div>

            <Rule />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                With over 40 years of experience in security, operations, and technology management, MAJ. Makropoulos is a Georgia Licensed Private Investigator and Armed Guard, a State Instructor, and an NRA/USCCA Certified Firearms Instructor. He holds a B.A. from the University of Redlands and serves as an Officer in the Georgia Department of Defense.
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                As Managing Director at Palisade International and Director of Geopolitical Risk, he provides critical analysis on global political and economic trends, advising on strategic entry into international markets with full-spectrum security intelligence. A practicing martial artist for over four decades and military weapons instructor, his understanding of tactical security spans the strategic and operational continuum.
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                MAJ. Makropoulos designed the Spartan Training curriculum to ensure Georgia operators exceed GBPDSA minimum standards — combining statutory authority, field-verified technique, and operational judgment in a format built for professional accountability, not administrative compliance.
              </p>
            </div>

            <Rule />

            <div>
              <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Areas of Instruction</MonoLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {MAK_SPECIALIZATIONS.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: 'var(--brass)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/apply">
                <BrassButton variant="primary" size="md">Begin Your File</BrassButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Rule style={{ marginBottom: '64px' }} />

        {/* Sheldon Kuhn */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '48px', marginBottom: '64px' }}>

          <div>
            <PhotoPlaceholder width="100%" height="380px" caption="S. KUHN — PHOTOGRAPHY PENDING" />
            <div style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {KUHN_CREDENTIALS.map(c => (
                <div key={c.code} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--brass)', fontWeight: 600, minWidth: '72px', paddingTop: '2px' }}>{c.code}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', lineHeight: 1.5 }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <MonoLabel dot dotColor="var(--success)" style={{ marginBottom: '12px' }}>Cyber Intelligence · Technical Contributor</MonoLabel>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                Sheldon L. Kuhn
              </h2>
            </div>

            <Rule />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                Sheldon Kuhn is a seasoned cybersecurity expert and CompTIA CySA+ certified professional. He leads mission-critical cyber intelligence and defence operations for enterprise and government clients across SMB, nonprofit, and regulated industries.
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                He is the architect of <strong style={{ color: 'var(--ink)' }}>SILENT EDGE</strong> — a Military-Grade remote monitoring and management (RMM) platform featuring AI-driven threat detection, automated incident response, compliance reporting, and endpoint protection. His expertise spans SIEM systems, cloud and premise-based security architecture, and cyber threat intelligence programs aligned to GDPR, POPI Act, and PCI DSS compliance frameworks.
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, margin: 0 }}>
                His technical background spans the intersection of cybersecurity operations and physical security environments — an increasingly critical discipline as modern armed security and investigation work moves into digital terrain.
              </p>
            </div>

            <Rule />

            <div>
              <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Areas of Instruction</MonoLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {KUHN_SPECIALIZATIONS.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: 'var(--brass)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoLabel size="xs">SPARTAN TRAINING LLC · MJM 2026</MonoLabel>
        <MonoLabel size="xs">Georgia PDSC001719 · CFTR001295 · PDSG044581</MonoLabel>
      </footer>
    </div>
  );
}
