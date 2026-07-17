import Link from 'next/link';
import { PublicNav } from '@/components/layout/PublicNav';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const EFFECTIVE_DATE = 'May 18, 2026';

export const metadata = {
  title: 'Privacy Policy — Spartan Training LLC',
  description: 'Privacy Policy for spartantraining.live. How Spartan Training LLC collects, uses, and protects your personal information.',
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <MonoLabel size="xs" style={{ marginBottom: '8px', display: 'block' }}>§ {id.replace('s', '')}</MonoLabel>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingLeft: '16px', borderLeft: '2px solid var(--border-strong)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--brass)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function UList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.7 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <main style={{ flex: 1, maxWidth: '820px', margin: '0 auto', width: '100%', padding: '64px 32px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <MonoLabel style={{ marginBottom: '12px' }}>Spartan Training LLC · Legal</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <MonoLabel size="xs">Effective: {EFFECTIVE_DATE}</MonoLabel>
            <MonoLabel size="xs">Jurisdiction: Georgia, USA</MonoLabel>
            <MonoLabel size="xs">CMMC Level 2 · CCPA · O.C.G.A. § 10-1-910</MonoLabel>
          </div>
        </div>

        {/* Intro callout */}
        <div style={{
          padding: '20px 24px',
          border: '1px solid var(--border-strong)',
          background: 'var(--bg-elev-1)',
          marginBottom: '48px',
        }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, margin: 0 }}>
            Spartan Training LLC operates <strong>spartantraining.live</strong> and its associated training platform (the &quot;Platform&quot;). This Policy describes what personal information we collect, how we use and protect it, and your rights as an operator or visitor. We do not sell your personal data — ever.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Table of Contents */}
          <section>
            <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Contents</MonoLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px 24px' }}>
              {[
                ['1', 'Who We Are'],
                ['2', 'Information We Collect'],
                ['3', 'How We Use Your Information'],
                ['4', 'Legal Basis for Processing'],
                ['5', 'Data Retention'],
                ['6', 'Data Sharing and Third Parties'],
                ['7', 'Cybersecurity and Data Protection'],
                ['8', 'Your Rights'],
                ['9', 'Cookies and Tracking'],
                ['10', 'Children\'s Privacy'],
                ['11', 'Changes to This Policy'],
                ['12', 'Contact Us'],
              ].map(([num, title]) => (
                <a
                  key={num}
                  href={`#s${num}`}
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'baseline' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--brass)', letterSpacing: '0.1em', flexShrink: 0 }}>
                    {num.padStart(2, '0')}
                  </span>
                  {title}
                </a>
              ))}
            </div>
          </section>

          <Rule />

          <Section id="s1" title="Who We Are">
            <p>
              Spartan Training LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is a Georgia private security training organization operating under and accredited by the Georgia Board of Private Detectives and Security Agencies (GBPDSA). We deliver professional training for the MJM 2026 Armed Security Officer (16hr), Private Detective (70hr), and Unarmed Security Officer (24hr) accreditation programs under Georgia law and GA Admin Code 509-3-.01.
            </p>
            <Sub title="Data Controller">
              <span>Spartan Training LLC is the data controller for all personal information processed through the Platform.</span><br /><br />
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Sheldon L. Kuhn — CISO / Director of Cyber Intelligence</span><br />
              <a href="mailto:privacy@spartantraining.live" style={{ color: 'var(--brass)' }}>privacy@spartantraining.live</a>
            </Sub>
          </Section>

          <Rule />

          <Section id="s2" title="Information We Collect">
            <p>We collect only the information necessary to deliver training, enforce academic integrity, and meet regulatory obligations.</p>

            <Sub title="Account and Identity Data">
              <UList items={[
                'Full legal name and email address',
                'Platform operator ID (auto-generated: ST-YY-NNNN)',
                'Assigned role (agent / admin / coordinator / super_admin)',
                'Enrolled training track(s) and enrollment date',
                'Account creation date and authentication state',
              ]} />
            </Sub>

            <Sub title="Training and Progress Data">
              <UList items={[
                'Module completion status and competency flags per module',
                'Current slide position (to enable resume-from-last-position)',
                'Assessment scores and number of attempts per module',
                'Critical Fail events — retained as an immutable regulatory record required by GBPDSA',
                'Course completion dates and total training hours credited',
              ]} />
            </Sub>

            <Sub title="Behavioral Integrity Data — Exam Sessions">
              <p style={{ marginBottom: '8px' }}>
                To maintain the integrity of accreditation assessments, the following events are recorded server-side during every knowledge assessment. This data is never exposed to the client browser:
              </p>
              <UList items={[
                'Answer selections per question, referenced by question ID and original answer key',
                'Time remaining on each question at the moment of answer confirmation',
                'Question timeout events (auto-advance when the 90-second timer expires)',
                'Tab and focus change events — timestamp, question index, and time remaining',
                'Auto-submit events triggered by focus violations (3-strike rule)',
                'Fullscreen exit events',
              ]} />
              <p style={{ marginTop: '8px' }}>
                Behavioral data forms an immutable timeline per session. It cannot be altered after submission and may be reviewed by coordinators or super admins for integrity auditing.
              </p>
            </Sub>

            <Sub title="Audio and Narration Data">
              Narration files are served from Supabase Storage as public MP3 files. Playback events are not transmitted, tracked, or stored by the Platform. No student data is transmitted to ElevenLabs during narration playback.
            </Sub>

            <Sub title="Technical and Authentication Data">
              <UList items={[
                'Session tokens (managed by Supabase Auth via httpOnly cookies — not accessible to client-side JavaScript)',
                'Device type and browser metadata (stored by Supabase Auth)',
                'IP address — planned feature, not currently collected or stored',
              ]} />
            </Sub>

            <Sub title="Payment Data">
              Payment method category (cash, EFT, Stripe, manual, complimentary) is recorded for enrollment records. Raw payment credentials are never stored on our servers. All card and payment transactions are processed by Stripe, Inc. (PCI DSS Level 1 compliant).
            </Sub>
          </Section>

          <Rule />

          <Section id="s3" title="How We Use Your Information">
            <UList items={[
              'To create and manage your operator account and authenticate your identity securely',
              'To deliver accreditation training modules, knowledge assessments, and credentials',
              'To enforce sequential course progression gates and final exam eligibility',
              'To maintain exam integrity through behavioral monitoring and the anti-cheat system',
              'To issue completion credentials and certificates of accreditation upon course completion',
              'To communicate with you about your enrollment, training progress, and account',
              'To comply with GBPDSA regulatory requirements for training record maintenance and audit readiness',
              'To detect, investigate, and prevent fraudulent or unauthorized use of the Platform',
              'To improve course content, Platform performance, and instructional effectiveness',
              'To respond to support requests, inquiries, and privacy rights exercise requests',
            ]} />
          </Section>

          <Rule />

          <Section id="s4" title="Legal Basis for Processing">
            <Sub title="Contract Performance">
              Processing your data to deliver training and accreditation services you have enrolled in — including progress tracking, assessments, and credentials — is necessary to perform the contract between you and Spartan Training LLC.
            </Sub>
            <Sub title="Legitimate Interests">
              Exam integrity monitoring, fraud prevention, behavioral analytics, and Platform security are processed under our legitimate interest in maintaining the validity and trustworthiness of the accreditation credentials we issue.
            </Sub>
            <Sub title="Legal Obligation">
              Training record retention, Critical Fail documentation, and competency records are maintained to satisfy obligations under Georgia Administrative Code § 509-3-.01, GBPDSA licensing requirements, and the Georgia Personal Identity Protection Act (O.C.G.A. § 10-1-910 et seq.).
            </Sub>
          </Section>

          <Rule />

          <Section id="s5" title="Data Retention">
            <p>We retain your data only as long as necessary for the purposes it was collected and to satisfy regulatory obligations.</p>
            <UList items={[
              'Training records (progress, scores, competency flags): 7 years from course completion — required by GBPDSA best practices and litigation hold obligations',
              'Assessment behavioral data (exam session timelines): 7 years from the date of assessment — retained as an immutable integrity record',
              'Account and identity data: duration of active enrollment plus 7 years',
              'Inactive accounts (no activity for 36 months): subject to secure deletion or anonymization upon written request, unless a regulatory hold applies',
              'Payment records: 7 years from transaction date for financial compliance',
            ]} />
            <p>
              After retention periods expire, personal data is permanently deleted or anonymized so it can no longer be linked to an individual.
            </p>
          </Section>

          <Rule />

          <Section id="s6" title="Data Sharing and Third Parties">
            <p>
              <strong style={{ color: 'var(--ink)' }}>We do not sell, rent, or trade your personal information to any third party.</strong> We share data only with the following recipients, only to the extent necessary:
            </p>

            <Sub title="Supabase, Inc. — Infrastructure">
              Database hosting, authentication, and file storage provider. Data is stored in US-East (AWS us-east-1) regions. Supabase is SOC 2 Type II certified and processes data under a Data Processing Agreement.
            </Sub>

            <Sub title="Stripe, Inc. — Payments">
              Payment processing for enrollment transactions. Only minimum data necessary for transactions is shared. Stripe is PCI DSS Level 1 Service Provider certified.
            </Sub>

            <Sub title="ElevenLabs, Inc. — Narration">
              Text-to-speech narration generation for course content only. Your personal information is not transmitted to ElevenLabs.
            </Sub>

            <Sub title="Hostinger, UAB — Hosting">
              Cloud hosting infrastructure (KVM VPS). Your data resides on servers managed by Hostinger under their Data Processing Agreement.
            </Sub>

            <Sub title="Law Enforcement and Regulatory Authorities">
              Disclosure when required by applicable law, valid legal process, or GBPDSA regulatory audit. We notify you of such disclosures to the extent permitted by law.
            </Sub>

            <Sub title="Employer or Sponsoring Organization">
              If your enrollment was arranged through a corporate or agency sponsorship, your training progress and competency records may be shared with the sponsoring organization to the extent specified at enrollment.
            </Sub>

            <Sub title="Business Transfers">
              In a merger or acquisition, personal data may transfer to the successor entity. We will provide 30 days notice before your data is subject to a materially different privacy policy.
            </Sub>
          </Section>

          <Rule />

          <Section id="s7" title="Cybersecurity and Data Protection">
            <p>
              Spartan Training LLC implements security controls aligned with <strong style={{ color: 'var(--ink)' }}>NIST SP 800-171</strong> and <strong style={{ color: 'var(--ink)' }}>CMMC Level 2</strong> practices:
            </p>

            <Sub title="Access Control — AC.L1 / AC.L2">
              Role-based access control with four tiers (super_admin, coordinator, admin, agent). Application-level gates enforce enrollment checks and sequential progression independently of database-level Row Level Security. No single credential grants unrestricted access.
            </Sub>

            <Sub title="Audit and Accountability — AU.L2">
              All assessment sessions are logged with full timestamps, answer records, scores, behavioral event timelines, and Critical Fail flags. Logs are immutable at the application layer — no API route or user action can overwrite a submitted session. Administrative actions are captured in an operator audit log.
            </Sub>

            <Sub title="Identification and Authentication — IA.L1 / IA.L2">
              Each operator is assigned a unique ID (ST-YY-NNNN). Authentication uses Supabase Auth with JWT tokens stored in httpOnly, Secure, SameSite=Strict cookies. Passwords are hashed with bcrypt. Magic-link authentication is available for onboarding.
            </Sub>

            <Sub title="Data Encryption in Transit and at Rest — SC.L1 / SC.L2">
              All data in transit is encrypted via TLS 1.2+ enforced at the Nginx reverse proxy with Let&apos;s Encrypt certificates. Data at rest is encrypted by Supabase&apos;s PostgreSQL infrastructure (AES-256). Quiz grading is performed exclusively server-side — correct answers are never transmitted to the client browser.
            </Sub>

            <Sub title="Incident Response — IR.L2">
              Security incidents affecting personal data are assessed and, where required, reported to affected individuals within 72 hours of discovery — consistent with NIST SP 800-61 and GDPR Article 33 standards. Contact: <a href="mailto:privacy@spartantraining.live" style={{ color: 'var(--brass)' }}>privacy@spartantraining.live</a>
            </Sub>

            <Sub title="Configuration Management — CM">
              The Platform runs in a Docker container on a dedicated KVM VPS. Infrastructure access is restricted to authorized personnel via SSH key authentication only. Default credentials are disabled on all services.
            </Sub>
          </Section>

          <Rule />

          <Section id="s8" title="Your Rights">
            <p>Subject to applicable law and our regulatory retention obligations, you have the following rights:</p>

            <Sub title="Access">Request a copy of personal data we hold about you — training records, assessment history, and account information.</Sub>
            <Sub title="Correction">Request correction of inaccurate account or identity data. Assessment behavioral records are immutable by design — a regulatory integrity requirement.</Sub>
            <Sub title="Deletion">Request deletion of your account and personal data, subject to the 7-year regulatory retention obligation on training and assessment records. Anonymization may be used where deletion conflicts with retention obligations.</Sub>
            <Sub title="Portability">Request your training records in a portable format (PDF transcript or CSV export): completion status, scores, attempt counts, and competency dates.</Sub>
            <Sub title="California Residents — CCPA">
              You have the right to: (1) know what personal information is collected and how it is used; (2) request deletion (subject to exceptions); (3) opt-out of the sale of personal information — we do not sell personal information; (4) non-discrimination for exercising CCPA rights.
            </Sub>

            <p>
              To exercise any right, submit a written request to <a href="mailto:privacy@spartantraining.live" style={{ color: 'var(--brass)' }}>privacy@spartantraining.live</a>. We respond within 30 days and may verify your identity before processing.
            </p>
          </Section>

          <Rule />

          <Section id="s9" title="Cookies and Tracking Technologies">
            <Sub title="Session Cookies — Essential Only">
              Supabase Auth sets one httpOnly session cookie per authenticated user. It is strictly necessary for authentication — it cannot be disabled without disabling sign-in. It stores only a signed session token, not personal data.
            </Sub>
            <Sub title="No Tracking Cookies">
              <strong style={{ color: 'var(--ink)' }}>We do not use advertising cookies, tracking pixels, or behavioral analytics tools.</strong> No Google Analytics, Meta Pixel, Hotjar, or similar third-party tracking technology is present on this Platform. We do not track your behavior across other websites.
            </Sub>
            <Sub title="Browser Storage">
              The Platform does not use localStorage or sessionStorage to store personal data. Temporary state stored in browser memory is cleared when your session ends.
            </Sub>
          </Section>

          <Rule />

          <Section id="s10" title="Children's Privacy">
            <p>
              This Platform is intended exclusively for adults 18 years of age or older pursuing professional security officer licensing under Georgia law. We do not knowingly collect personal information from persons under 18.
            </p>
            <p>
              If you believe we have inadvertently collected information from a minor, contact <a href="mailto:privacy@spartantraining.live" style={{ color: 'var(--brass)' }}>privacy@spartantraining.live</a> immediately. We will promptly delete such information upon verification.
            </p>
          </Section>

          <Rule />

          <Section id="s11" title="Changes to This Policy">
            <p>
              We may update this Policy to reflect changes in our practices, the Platform, or applicable law. Material changes will be communicated to enrolled operators via email at least 14 days before taking effect.
            </p>
            <p>
              The effective date at the top indicates when this Policy was last updated. The current version is always available at <strong style={{ color: 'var(--ink)' }}>spartantraining.live/privacy</strong>. Continued use of the Platform after an update constitutes acceptance.
            </p>
          </Section>

          <Rule />

          <Section id="s12" title="Contact Us">
            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Organization', 'Spartan Training LLC'],
                ['Privacy Contact', 'Sheldon L. Kuhn — CISO / Director of Cyber Intelligence'],
                ['Email', 'privacy@spartantraining.live'],
                ['Platform', 'spartantraining.live'],
              ].map(([label, value]) => (
                <div key={label}>
                  <MonoLabel size="xs" style={{ marginBottom: '3px', display: 'block' }}>{label}</MonoLabel>
                  {label === 'Email' ? (
                    <a href={`mailto:${value}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.04em' }}>{value}</a>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)' }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
            <p>
              For data protection inquiries, rights requests, or to report a potential security incident, contact us at the email above. We respond to all privacy inquiries within 5 business days and rights exercise requests within 30 calendar days.
            </p>
          </Section>

        </div>

        {/* Legal strip */}
        <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <MonoLabel size="xs">© 2026 Spartan Training LLC. All rights reserved.</MonoLabel>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['/', 'Home'], ['/curriculum', 'Curriculum'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textDecoration: 'none', textTransform: 'uppercase' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
