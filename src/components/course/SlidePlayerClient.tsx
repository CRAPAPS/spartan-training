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
  const [saving, setSaving]               = useState(false);
  const [narrating, setNarrating]         = useState(false);
  const [narrationPaused, setPaused]      = useState(false);
  const [narrationError, setNarrationError] = useState(false);
  const [dwellReady, setDwellReady]       = useState(false);

  const saveTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef      = useRef<HTMLAudioElement>(null);

  const isFirst = current === 0;
  const isLast  = current === slides.length - 1;
  const pct     = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;

  const currentSlide      = slides[current];
  const narrationUrl      = currentSlide.narrationUrl ?? null;
  const suppressNarration = currentSlide.type === 'video' && !!(currentSlide as { src?: string }).src;
  const hasNarration      = !!narrationUrl && !suppressNarration;

  // ── Dwell timer — 20s minimum per slide ──────────────────────────────────
  useEffect(() => {
    setDwellReady(false);
    if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    dwellTimerRef.current = setTimeout(() => setDwellReady(true), 20_000);
    return () => { if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current); };
  }, [current]);

  // ── Load audio when slide changes ─────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setNarrating(false);
    setPaused(false);
    setNarrationError(false);

    if (!hasNarration || !narrationUrl) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    audio.src = narrationUrl;
    audio.load();
    // Attempt autoplay — browsers block this without a prior user gesture; user clicks Play
    audio.play().catch(() => {});
  }, [current, hasNarration, narrationUrl]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
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
      } catch { /* non-blocking */ } finally { setSaving(false); }
    }, 1500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [current, moduleId, slides.length]);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
  }, []);

  const handlePrev = useCallback(() => {
    stopAudio();
    setCurrent(c => Math.max(0, c - 1));
  }, [stopAudio]);

  const handleNext = useCallback(() => {
    stopAudio();
    setCurrent(c => Math.min(slides.length - 1, c + 1));
  }, [stopAudio, slides.length]);

  const toggleNarration = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasNarration) return;
    if (audio.paused) {
      audio.play().catch(err => {
        console.error('[SlidePlayer] play failed:', err, narrationUrl);
        setNarrationError(true);
      });
    } else {
      audio.pause();
    }
  }, [hasNarration, narrationUrl]);

  const nextBlocked    = !dwellReady;
  const nextBlockLabel = narrating ? 'listening…' : 'absorbing…';

  return (
    <div className="slide-player">

      {/* DOM-attached audio element — browser media lifecycle */}
      <audio
        ref={audioRef}
        onPlay={() => { setNarrating(true); setPaused(false); setNarrationError(false); }}
        onPause={() => { setPaused(true); }}
        onEnded={() => { setNarrating(false); setPaused(false); setDwellReady(true); }}
        onError={() => {
          console.error('[SlidePlayer] audio load error:', narrationUrl);
          setNarrating(false);
          setNarrationError(true);
        }}
        style={{ display: 'none' }}
      />

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div className="slide-statusbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brass)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
            {moduleId}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {hasNarration && (
            <button
              onClick={toggleNarration}
              title={narrationError ? 'Audio failed to load' : narrating ? 'Pause narration' : 'Play narration'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: narrationError ? 'var(--danger)' : narrating && !narrationPaused ? 'var(--brass)' : 'var(--ink-dim)',
                textTransform: 'uppercase',
                background: 'none',
                border: `1px solid ${narrationError ? 'var(--danger)' : narrating && !narrationPaused ? 'var(--brass)' : 'var(--border)'}`,
                cursor: narrationError ? 'default' : 'pointer',
                padding: '5px 12px',
                transition: 'color 200ms, border-color 200ms',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '13px', lineHeight: 1 }}>
                {narrationError ? '⚠' : narrating && !narrationPaused ? '⏸' : '▶'}
              </span>
              {narrationError ? 'Audio Error' : narrating && !narrationPaused ? 'Pause' : narrationPaused ? 'Resume' : 'Play Narration'}
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
      <div className="slide-content">
        <SlideContent slide={slides[current]} />
      </div>

      {/* ── Navigation footer ─────────────────────────────────────────────── */}
      <div className="slide-footer">
        <div style={{ height: '3px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--brass)', transition: 'width 300ms ease' }} />
        </div>

        <div className="slide-nav-row">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em',
              color: isFirst ? 'var(--ink-mute)' : 'var(--ink-dim)',
              textTransform: 'uppercase', background: 'none', border: 'none',
              cursor: isFirst ? 'not-allowed' : 'pointer', padding: '6px 0',
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={`/dashboard/module/${moduleId}/quiz`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              Skip to Assessment ↗
            </Link>

            {isLast ? (
              <Link href={`/dashboard/module/${moduleId}/quiz`} style={{ textDecoration: 'none' }}>
                <BrassButton variant="primary" size="sm">Begin Knowledge Assessment ⤳</BrassButton>
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
                    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em',
                    color: nextBlocked ? 'var(--ink-mute)' : 'var(--brass)',
                    textTransform: 'uppercase', background: 'none',
                    border: `1px solid ${nextBlocked ? 'var(--border)' : 'var(--brass)'}`,
                    cursor: nextBlocked ? 'default' : 'pointer', padding: '6px 16px',
                    transition: 'color 200ms, border-color 200ms',
                  }}
                >
                  Next ⤳
                </button>
              </div>
            )}
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
          Assessment passing threshold: {passingScore}% · Critical Fail active
        </span>
      </div>
    </div>
  );
}
