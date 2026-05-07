import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

const REFERENCE_CATEGORIES = [
  {
    id: 'legal',
    label: 'Legal Authority',
    dotColor: 'var(--brass)',
    items: [
      {
        title: 'GA Code § 509-3-.01',
        subtitle: 'GBPDSA Armed Security Officer — Minimum Training Standards',
        type: 'REGULATION',
        status: 'ACTIVE',
        note: 'Governing authority for MJM 2026 Armed Security Accreditation',
      },
      {
        title: 'OCGA § 16-3-21',
        subtitle: 'Use of Force in Defense of Self or Others',
        type: 'STATUTE',
        status: 'ACTIVE',
        note: 'Georgia justification statute — covered in Module 02',
      },
      {
        title: 'OCGA § 43-38',
        subtitle: 'Private Detective and Security Agencies',
        type: 'STATUTE',
        status: 'ACTIVE',
        note: 'Full licensing authority and requirements for Georgia operators',
      },
      {
        title: 'Graham v. Connor (1989)',
        subtitle: '490 U.S. 386 — Objective Reasonableness Standard',
        type: 'CASE LAW',
        status: 'BINDING',
        note: 'Foundation of the Reasonable Man Doctrine — Module 03',
      },
    ],
  },
  {
    id: 'standards',
    label: 'Training Standards',
    dotColor: 'var(--success)',
    items: [
      {
        title: 'MJM 2026 Armed Security Training Class',
        subtitle: 'GBPDSA 16hr Armed Security Officer Training Standard',
        type: 'CURRICULUM',
        status: 'CURRENT',
        note: 'Primary curriculum document — all 16 modules grounded in this standard',
      },
      {
        title: 'MJM 2026 Private Detective Training Class',
        subtitle: 'GBPDSA Private Detective Training 72hr Standard',
        type: 'CURRICULUM',
        status: 'CURRENT',
        note: 'PI track curriculum — future platform expansion',
      },
    ],
  },
  {
    id: 'fieldops',
    label: 'Field Operations',
    dotColor: 'var(--ink-dim)',
    items: [
      {
        title: 'Incident Report Template',
        subtitle: 'Standard format for field incident documentation',
        type: 'TEMPLATE',
        status: 'COMING SOON',
        note: 'Required for Module 07: Report Writing & Documentation',
      },
      {
        title: 'Post Orders Reference',
        subtitle: 'Site security post order format and checklist',
        type: 'REFERENCE',
        status: 'COMING SOON',
        note: 'Required for Module 04: Post Orders & Site Security',
      },
      {
        title: 'Chain of Custody Form',
        subtitle: 'Evidence handling and documentation standard',
        type: 'FORM',
        status: 'COMING SOON',
        note: 'Required for Module 13: Evidence Handling & Chain of Custody',
      },
    ],
  },
];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:       'var(--success)',
  BINDING:      'var(--brass)',
  CURRENT:      'var(--success)',
  'COMING SOON': 'var(--ink-mute)',
};

const TYPE_COLOR: Record<string, string> = {
  REGULATION:  'var(--brass)',
  STATUTE:     'var(--brass)',
  'CASE LAW':  'var(--ink)',
  CURRICULUM:  'var(--success)',
  TEMPLATE:    'var(--ink-dim)',
  REFERENCE:   'var(--ink-dim)',
  FORM:        'var(--ink-dim)',
};

export default async function LibraryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const totalItems = REFERENCE_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
  const liveItems  = REFERENCE_CATEGORIES.reduce((sum, cat) =>
    sum + cat.items.filter(i => i.status !== 'COMING SOON').length, 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Reference Library</MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Field Reference & Legal Authority
          </h1>
        </div>
        <MonoLabel size="xs">{liveItems} OF {totalItems} DOCUMENTS ACTIVE</MonoLabel>
      </div>

      <Rule />

      {/* Notice banner */}
      <div style={{ padding: '12px 16px', border: '1px solid rgba(197,160,89,.25)', background: 'rgba(197,160,89,.04)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--brass)', textTransform: 'uppercase', whiteSpace: 'nowrap', marginTop: '2px' }}>
          ◈ NOTICE
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
          This library is your reference repository during training. Legal statutes and case law are
          provided for study and context — they do not substitute for qualified legal counsel.
          Field documents and templates are being added as curriculum modules are activated.
        </span>
      </div>

      {/* Categories */}
      {REFERENCE_CATEGORIES.map(category => (
        <section key={category.id}>
          <MonoLabel dot dotColor={category.dotColor} style={{ marginBottom: '16px', display: 'block' }}>
            {category.label}
          </MonoLabel>

          <div style={{ border: '1px solid var(--border)' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 90px',
              gap: '12px',
              padding: '8px 16px',
              background: 'var(--bg-elev-2)',
              borderBottom: '1px solid var(--border)',
            }}>
              {['Type', 'Document', 'Status', 'Module'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
                  {h}
                </span>
              ))}
            </div>

            {category.items.map((item, i) => (
              <div
                key={item.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 100px 90px',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: i < category.items.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                  alignItems: 'start',
                  opacity: item.status === 'COMING SOON' ? 0.55 : 1,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.1em',
                  color: TYPE_COLOR[item.type] ?? 'var(--ink-dim)',
                  textTransform: 'uppercase',
                  paddingTop: '2px',
                }}>
                  {item.type}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.02em' }}>
                    {item.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.4 }}>
                    {item.subtitle}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', letterSpacing: '0.08em', marginTop: '2px' }}>
                    {item.note}
                  </span>
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: STATUS_COLOR[item.status] ?? 'var(--ink-mute)',
                  textTransform: 'uppercase',
                  paddingTop: '2px',
                }}>
                  {item.status === 'COMING SOON' ? '○ Coming Soon' : `● ${item.status}`}
                </span>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', paddingTop: '2px' }}>
                  {item.note.match(/Module\s+\d+/i)?.[0] ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Rule />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <MonoLabel size="xs">
          Additional reference materials are added as modules are activated.
          Contact your instructor to request a specific document.
        </MonoLabel>
      </div>
    </div>
  );
}
