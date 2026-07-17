import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { PracticalUploadWidget } from './PracticalUploadWidget';
import type { Slide, SlideSlide, VideoSlide, ScenarioSlide, ChecklistSlide, PracticalSlide, PracticalSubmissionState } from '@/types/lesson';

const CALLOUT_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  warning: { bg: 'rgba(232,64,64,.07)',    border: '#E84040', label: 'CAUTION' },
  info:    { bg: 'rgba(197,160,89,.06)',   border: 'var(--brass)', label: 'NOTE' },
  tip:     { bg: 'rgba(107,142,90,.06)',   border: 'var(--success, #22c55e)', label: 'TIP' },
};

function SlideSlideRenderer({ slide }: { slide: SlideSlide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {slide.legalRef && (
        <MonoLabel size="xs" style={{ color: 'var(--brass)', letterSpacing: '0.16em' }}>
          LEGAL REFERENCE · {slide.legalRef}
        </MonoLabel>
      )}

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, margin: 0 }}>
        {slide.heading}
      </h2>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink-dim)', lineHeight: 1.85, margin: 0 }}>
        {slide.body}
      </p>

      {slide.keyPoints && slide.keyPoints.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {slide.keyPoints.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', flexShrink: 0, paddingTop: '2px', fontWeight: 700 }}>▸</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{point}</span>
            </div>
          ))}
        </div>
      )}

      {slide.callout && (() => {
        const s = CALLOUT_STYLES[slide.callout!.type] ?? CALLOUT_STYLES.info;
        return (
          <div style={{ background: s.bg, borderLeft: `3px solid ${s.border}`, padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', color: s.border, fontWeight: 700, flexShrink: 0, paddingTop: '3px' }}>
              {s.label}
            </span>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
              {slide.callout!.text}
            </p>
          </div>
        );
      })()}
    </div>
  );
}

function VideoSlideRenderer({ slide }: { slide: VideoSlide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {slide.src ? (
        <video
          controls
          style={{ width: '100%', background: '#000', maxHeight: '400px' }}
          preload="metadata"
        >
          <source src={slide.src} />
          Your browser does not support video playback.
        </video>
      ) : (
        <div style={{ height: '240px', background: 'var(--bg-elev-1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MonoLabel dot dotColor="var(--ink-mute)">VIDEO CONTENT PENDING</MonoLabel>
        </div>
      )}
      <MonoLabel size="xs">{slide.caption}</MonoLabel>
      {slide.description && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
          {slide.description}
        </p>
      )}
    </div>
  );
}

function ScenarioSlideRenderer({ slide }: { slide: ScenarioSlide }) {
  return (
    <div style={{ border: '1px solid var(--brass)', background: 'rgba(197,160,89,.04)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <MonoLabel dot dotColor="var(--brass)">TACTICAL SCENARIO</MonoLabel>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.85, margin: 0 }}>
        {slide.scenario}
      </p>

      <Rule />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <MonoLabel size="xs">REFLECTION</MonoLabel>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
          {slide.reflection}
        </p>
      </div>

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
        Not graded — for situational awareness and discussion
      </span>
    </div>
  );
}

function ChecklistSlideRenderer({ slide }: { slide: ChecklistSlide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
        {slide.title}
      </h2>
      <div style={{ border: '1px solid var(--border)' }}>
        {slide.items.map((item, i) => (
          <div
            key={i}
            className="checklist-item"
            style={{
              borderBottom: i < slide.items.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'var(--bg-elev-1)',
            }}
          >
            <div className="checklist-label">
              <span style={{ width: '6px', height: '6px', background: 'var(--brass)', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.65 }}>
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticalSlideRenderer({ slide, moduleId, practicalSubmission }: {
  slide: PracticalSlide;
  moduleId: string;
  practicalSubmission: PracticalSubmissionState | null;
}) {
  return (
    <div style={{ border: '1px solid var(--brass)', background: 'rgba(197,160,89,.04)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <MonoLabel dot dotColor="var(--brass)">
        PRACTICAL ASSIGNMENT · {slide.practicalId} · {slide.hourCredit.toFixed(1)}H CREDIT
      </MonoLabel>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, margin: 0 }}>
        {slide.title}
      </h2>

      {slide.brief.map((para, i) => (
        <p key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.85, margin: 0 }}>
          {para}
        </p>
      ))}

      <Rule />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <MonoLabel size="xs">REQUIRED REPORT SECTIONS</MonoLabel>
        <div style={{ border: '1px solid var(--border)' }}>
          {slide.requiredSections.map((section, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 14px',
                borderBottom: i < slide.requiredSections.length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'var(--bg-elev-1)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', fontWeight: 700, flexShrink: 0, paddingTop: '2px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>
                {section}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <MonoLabel size="xs">PROFESSIONAL STANDARDS</MonoLabel>
        {slide.formattingStandards.map((std, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brass)', flexShrink: 0, paddingTop: '2px', fontWeight: 700 }}>▸</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{std}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(232,64,64,.07)', borderLeft: '3px solid #E84040', padding: '14px 18px' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
          {slide.submissionInstructions}
        </p>
      </div>

      <PracticalUploadWidget moduleId={moduleId} initialSubmission={practicalSubmission} />
    </div>
  );
}

export function SlideContent({ slide, moduleId, practicalSubmission }: {
  slide: Slide;
  moduleId?: string;
  practicalSubmission?: PracticalSubmissionState | null;
}) {
  switch (slide.type) {
    case 'slide':     return <SlideSlideRenderer slide={slide} />;
    case 'video':     return <VideoSlideRenderer slide={slide} />;
    case 'scenario':  return <ScenarioSlideRenderer slide={slide} />;
    case 'checklist': return <ChecklistSlideRenderer slide={slide} />;
    case 'practical': return <PracticalSlideRenderer slide={slide} moduleId={moduleId ?? ''} practicalSubmission={practicalSubmission ?? null} />;
  }
}
