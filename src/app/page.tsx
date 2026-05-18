import Link from 'next/link';
import { PublicNav } from '@/components/layout/PublicNav';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { PhotoPlaceholder } from '@/components/primitives/PhotoPlaceholder';
import { Lockup } from '@/components/primitives/Lockup';

const STATS = [
  { value: '07', label: 'Disciplines' },
  { value: '16', label: 'Modules' },
  { value: '38', label: 'States' },
  { value: 'MMXXVI', label: 'Founded' },
] as const;

const DISCIPLINES = [
  { num: 'I',   title: 'Armed Security',       modules: '16 MOD' },
  { num: 'II',  title: 'Private Investigation', modules: '12 MOD' },
  { num: 'III', title: 'Executive Protection',  modules: '10 MOD' },
  { num: 'IV',  title: 'Advance Work',          modules: '8 MOD'  },
  { num: 'V',   title: 'Firearms Instructor',   modules: '14 MOD' },
  { num: 'VI',  title: 'Use of Force',          modules: '6 MOD'  },
  { num: 'VII', title: 'Field Surveillance',    modules: '9 MOD'  },
] as const;

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <main className="hero-grid">
        {/* Left */}
        <div
          className="hero-left"
          style={{
            padding: '80px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--border)',
          }}
        >
          <div>
            <MonoLabel style={{ marginBottom: '24px' }}>
              MJM 2026 · GBPDSA Accreditation · Georgia
            </MonoLabel>

            <h1
              className="hero-h1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.0,
                color: 'var(--ink)',
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              The standard for those who{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(90deg, var(--brass-light), var(--brass))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                protect.
              </em>
            </h1>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/apply">
                <BrassButton variant="primary" size="lg">Begin Your File ⤳</BrassButton>
              </Link>
              <Link href="/curriculum">
                <BrassButton variant="ghost" size="lg">View Curriculum</BrassButton>
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid-4" style={{ marginTop: '56px' }}>
            {STATS.map(s => (
              <div
                key={s.value}
                style={{ background: 'var(--bg)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>
                  {s.value}
                </span>
                <MonoLabel>{s.label}</MonoLabel>
              </div>
            ))}
          </div>
        </div>

        {/* Right — photo placeholder */}
        <div className="hero-right" style={{ position: 'relative' }}>
          <PhotoPlaceholder
            width="100%"
            height="100%"
            caption="OPERATOR PHOTOGRAPHY — PENDING PRODUCTION SHOOT"
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '32px',
              padding: '20px 24px',
              background: 'rgba(22,23,27,.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Lockup logoSize={32} textSize="sm" />
            <Rule orientation="vertical" />
            <MonoLabel>Verified · Portable · Stateful</MonoLabel>
          </div>
        </div>
      </main>

      {/* ── Discipline footer grid ────────────────────────── */}
      <footer className="pub-footer">
        <div className="grid-7">
          {DISCIPLINES.map(d => (
            <div
              key={d.num}
              style={{
                background: 'var(--bg)',
                padding: '20px 16px',
                minHeight: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.12em' }}>
                {d.num}
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
                {d.title}
              </span>
              <MonoLabel size="xs">{d.modules}</MonoLabel>
            </div>
          ))}
        </div>

        {/* Legal strip */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <MonoLabel size="xs">© {new Date().getFullYear()} Spartan Training LLC · All rights reserved · Georgia, USA</MonoLabel>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
