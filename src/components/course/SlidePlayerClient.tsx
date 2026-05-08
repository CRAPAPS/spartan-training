'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { SlideContent } from './SlideContent';
import type { Slide } from '@/types/lesson';

interface SlidePlayerClientProps {
  moduleId: string;
  slides: Slide[];
  initialSlide: number;
  passingScore: number;
}

export function SlidePlayerClient({ moduleId, slides, initialSlide, passingScore }: SlidePlayerClientProps) {
  const [current, setCurrent] = useState(
    Math.max(0, Math.min(initialSlide, slides.length - 1))
  );
  const [saving, setSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFirst = current === 0;
  const isLast  = current === slides.length - 1;
  const pct     = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;

  // Debounced auto-save — fires 1500ms after last slide change
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/lesson/${moduleId}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentSlide: current, totalSlides: slides.length }),
        });
      } catch {
        // Non-blocking — slide position is best-effort
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [current, moduleId, slides.length]);

  const handlePrev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const handleNext = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), [slides.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', minHeight: '560px', marginBottom: '28px' }}>

      {/* ── Status bar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '36px',
        background: 'var(--bg-elev-1)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brass)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
            {moduleId}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saving && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
              saving…
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
            Slide {current + 1} of {slides.length}
          </span>
        </div>
      </div>

      {/* ── Slide content ───────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        <SlideContent slide={slides[current]} />
      </div>

      {/* ── Navigation footer ───────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-elev-1)',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flexShrink: 0,
      }}>
        {/* Progress bar */}
        <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--brass)',
            transition: 'width 300ms ease',
          }} />
        </div>

        {/* Navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: isFirst ? 'var(--ink-mute)' : 'var(--ink-dim)',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              padding: '6px 0',
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={`/dashboard/module/${moduleId}/quiz`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '0.14em',
                color: 'var(--ink-mute)',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Skip to Assessment ↗
            </Link>

            {isLast ? (
              <Link href={`/dashboard/module/${moduleId}/quiz`} style={{ textDecoration: 'none' }}>
                <BrassButton variant="primary" size="sm">
                  Begin Knowledge Assessment ⤳
                </BrassButton>
              </Link>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: 'var(--brass)',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: '1px solid var(--brass)',
                  cursor: 'pointer',
                  padding: '6px 16px',
                }}
              >
                Next ⤳
              </button>
            )}
          </div>
        </div>

        {/* Passing threshold note */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          Assessment passing threshold: {passingScore}% · Critical Fail active
        </span>
      </div>
    </div>
  );
}
