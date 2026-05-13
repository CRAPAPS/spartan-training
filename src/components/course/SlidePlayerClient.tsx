'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BrassButton } from '@/components/primitives/BrassButton';
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
  const [saving, setSaving]           = useState(false);
  const [narrating, setNarrating]     = useState(false);
  const [narrationPaused, setPaused]  = useState(false);
  const [dwellReady, setDwellReady]   = useState(false);

  const saveTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef      = useRef<HTMLAudioElement | null>(null);

  const isFirst = current === 0;
  const isLast  = current === slides.length - 1;
  const pct     = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;

  const currentSlide    = slides[current];
  const narrationUrl    = currentSlide.narrationUrl;
  // Video slides handle their own audio — suppress narration unless no video src
  const suppressNarration =
    currentSlide.type === 'video' && !!(currentSlide as { src?: string }).src;

  // ── Dwell timer — 20s minimum per slide ─────────────────────────────────
  useEffect(() => {
    setDwellReady(false);
    if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    dwellTimerRef.current = setTimeout(() => setDwellReady(true), 20_000);
    return () => {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    };
  }, [current]);

  // ── Narration — auto-play on slide change ────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    // Stop any previous narration
    audio.pause();
    audio.src = '';
    setNarrating(false);
    setPaused(false);

    if (!narrationUrl || suppressNarration) return;

    audio.src = narrationUrl;
    audio.load();

    const onPlay  = () => { setNarrating(true); setPaused(false); };
    const onPause = () => { setPaused(true); };
    const onEnded = () => { setNarrating(false); setPaused(false); setDwellReady(true); };
    const onError = () => { setNarrating(false); };

    audio.addEventListener('play',  onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    // Browsers require user gesture before autoplay — attempt it, fail silently
    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener('play',  onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [current, narrationUrl, suppressNarration]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // ── Debounced auto-save — 1500ms after last slide change ─────────────────
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
        // Non-blocking
      } finally {
        setSaving(false);
      }
    }, 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [current, moduleId, slides.length]);

  const handlePrev = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    setCurrent(c => Math.max(0, c - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    setCurrent(c => Math.min(slides.length - 1, c + 1));
  }, [slides.length]);

  const toggleNarration = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const hasNarration   = !!narrationUrl && !suppressNarration;
  const nextBlocked    = !dwellReady;
  const nextBlockLabel = narrating ? 'listening…' : 'absorbing…';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', minHeight: '560px', marginBottom: '28px' }}>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
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
          {/* Narration controls */}
          {hasNarration && (
            <button
              onClick={toggleNarration}
              title={narrating && !narrationPaused ? 'Pause narration' : 'Play narration'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: narrating && !narrationPaused ? 'var(--brass)' : 'var(--ink-dim)',
                textTransform: 'uppercase',
                background: 'none',
                border: `1px solid ${narrating && !narrationPaused ? 'var(--brass)' : 'var(--border)'}`,
                cursor: 'pointer',
                padding: '5px 12px',
                borderRadius: '2px',
                transition: 'color 200ms, border-color 200ms',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '13px', lineHeight: 1 }}>
                {narrating && !narrationPaused ? '⏸' : '▶'}
              </span>
              {narrating && !narrationPaused ? 'Pause' : narrationPaused ? 'Resume' : 'Play Narration'}
            </button>
          )}

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

      {/* ── Slide content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        <SlideContent slide={slides[current]} />
      </div>

      {/* ── Navigation footer ─────────────────────────────────────────────── */}
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                {nextBlocked && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
                    {nextBlockLabel}
                  </span>
                )}
                <button
                  onClick={nextBlocked ? undefined : handleNext}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    color: nextBlocked ? 'var(--ink-mute)' : 'var(--brass)',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: `1px solid ${nextBlocked ? 'var(--border)' : 'var(--brass)'}`,
                    cursor: nextBlocked ? 'default' : 'pointer',
                    padding: '6px 16px',
                    transition: 'color 200ms, border-color 200ms',
                  }}
                >
                  Next ⤳
                </button>
              </div>
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
