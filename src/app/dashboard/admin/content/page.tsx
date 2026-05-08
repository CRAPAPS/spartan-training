import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

export default async function CourseContentPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const role = (self as { role?: string } | null)?.role ?? 'agent';
  if (role !== 'admin' && role !== 'coordinator' && role !== 'super_admin') redirect('/dashboard');

  const { data: modules } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, sequence_order, passing_score, duration_hours')
    .order('sequence_order');

  const { data: lessons } = await supabaseAdmin
    .from('module_lessons')
    .select('module_id, slide_count, slides');

  const { data: quizRows } = await supabaseAdmin
    .from('quiz_questions')
    .select('module_id');

  const lessonMap: Record<string, { slideCount: number; narrationCount: number }> = {};
  (lessons ?? []).forEach((l: { module_id: string; slide_count: number; slides: unknown[] }) => {
    const slides = (l.slides ?? []) as Record<string, unknown>[];
    const narrated = slides.filter(s => !!s.narrationUrl).length;
    lessonMap[l.module_id] = { slideCount: l.slide_count, narrationCount: narrated };
  });

  const quizMap: Record<string, number> = {};
  (quizRows ?? []).forEach((q: { module_id: string }) => {
    quizMap[q.module_id] = (quizMap[q.module_id] ?? 0) + 1;
  });

  const totalSlides     = Object.values(lessonMap).reduce((s, l) => s + l.slideCount, 0);
  const totalNarrated   = Object.values(lessonMap).reduce((s, l) => s + l.narrationCount, 0);
  const totalQuestions  = Object.values(quizMap).reduce((s, n) => s + n, 0);
  const modulesWithSlides = Object.keys(lessonMap).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div className="dash-page-header">
        <div>
          <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>
            MJM 2026 · ADMIN
          </MonoLabel>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
            Course Content
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            { value: `${modulesWithSlides}/16`, label: 'Modules w/ Slides' },
            { value: String(totalSlides),       label: 'Total Slides' },
            { value: `${totalNarrated}/${totalSlides}`, label: 'Narrated' },
            { value: String(totalQuestions),    label: 'Quiz Questions' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>{m.value}</div>
              <MonoLabel size="xs">{m.label}</MonoLabel>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 80px 80px 80px 80px 160px',
        gap: '0',
        padding: '8px 16px',
        background: 'var(--bg-elev-2)',
        border: '1px solid var(--border)',
        borderBottom: 'none',
      }}>
        {['Seq', 'Module', 'Slides', 'Narrated', 'Quiz Qs', 'Pass%', 'Access'].map(h => (
          <MonoLabel key={h} size="xs">{h}</MonoLabel>
        ))}
      </div>

      <div style={{ border: '1px solid var(--border)' }}>
        {(modules ?? []).map((m, i) => {
          const lesson  = lessonMap[m.id];
          const quizQs  = quizMap[m.id] ?? 0;
          const hasSlides = !!lesson;
          const narPct  = lesson ? Math.round((lesson.narrationCount / lesson.slideCount) * 100) : 0;

          return (
            <div
              key={m.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 80px 80px 80px 80px 160px',
                gap: '0',
                padding: '14px 16px',
                borderBottom: i < (modules ?? []).length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)',
                alignItems: 'center',
              }}
            >
              {/* Seq */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--brass)' }}>
                {String(m.sequence_order).padStart(2, '0')}
              </span>

              {/* Title */}
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.title}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>
                  {m.id}
                </span>
              </div>

              {/* Slides */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: hasSlides ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {hasSlides ? lesson.slideCount : '—'}
              </span>

              {/* Narrated */}
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: !hasSlides ? 'var(--ink-mute)' : narPct === 100 ? 'var(--success, #22c55e)' : narPct > 0 ? 'var(--brass)' : 'var(--ink-mute)',
              }}>
                {hasSlides ? `${lesson.narrationCount}/${lesson.slideCount}` : '—'}
              </span>

              {/* Quiz Qs */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: quizQs > 0 ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {quizQs || '—'}
              </span>

              {/* Pass % */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                {m.passing_score}%
              </span>

              {/* Access links */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link
                  href={`/dashboard/module/${m.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em',
                    color: hasSlides ? 'var(--brass)' : 'var(--ink-mute)',
                    textDecoration: 'none', textTransform: 'uppercase',
                    border: `1px solid ${hasSlides ? 'var(--brass)' : 'var(--border)'}`,
                    padding: '4px 8px', whiteSpace: 'nowrap',
                  }}
                >
                  Lesson →
                </Link>
                <Link
                  href={`/dashboard/module/${m.id}/quiz`}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em',
                    color: quizQs > 0 ? 'var(--ink-dim)' : 'var(--ink-mute)',
                    textDecoration: 'none', textTransform: 'uppercase',
                    border: `1px solid ${quizQs > 0 ? 'var(--border-strong)' : 'var(--border)'}`,
                    padding: '4px 8px', whiteSpace: 'nowrap',
                  }}
                >
                  Quiz →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { color: 'var(--success, #22c55e)', label: 'Fully narrated' },
          { color: 'var(--brass)',            label: 'Partially narrated' },
          { color: 'var(--ink-mute)',         label: 'No content yet' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <MonoLabel size="xs">{item.label}</MonoLabel>
          </div>
        ))}
      </div>
    </div>
  );
}
