'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import type { ShuffledQuestion, TimelineEvent, QuizResult } from '@/types/quiz';

const QUESTION_SECONDS = 90;
const MAX_TAB_STRIKES  = 3;

interface QuizClientProps {
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
  questions: ShuffledQuestion[];
  attemptNumber: number;
}

type Phase = 'intro' | 'active' | 'results';

export function QuizClient({ moduleId, moduleTitle, passingScore, questions, attemptNumber }: QuizClientProps) {
  const [phase, setPhase]           = useState<Phase>('intro');
  const [current, setCurrent]       = useState(0);
  const [timeLeft, setTimeLeft]     = useState(QUESTION_SECONDS);
  const [tabStrikes, setTabStrikes] = useState(0);
  const [pendingKey, setPendingKey] = useState<string | null>(null); // originalKey of selected option
  const [result, setResult]         = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs — stable references for timer/event-handler callbacks
  const phaseRef      = useRef<Phase>('intro');
  const currentRef    = useRef(0);
  const answersRef    = useRef<Record<string, string | null>>({});
  const timeLeftRef   = useRef(QUESTION_SECONDS);
  const tabStrikesRef = useRef(0);
  const timelineRef   = useRef<TimelineEvent[]>([]);
  const advanceRef    = useRef<(() => void) | null>(null);
  const submitRef     = useRef<(() => Promise<void>) | null>(null);

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { tabStrikesRef.current = tabStrikes; }, [tabStrikes]);

  // ── Submit ────────────────────────────────────────────────────────────────────
  const submitQuiz = useCallback(async () => {
    if (phaseRef.current === 'results') return;
    setSubmitting(true);
    setSubmitError(null);
    phaseRef.current = 'results'; // prevent double-submit via refs

    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      const res = await fetch(`/api/quiz/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersRef.current,
          behavioralData: timelineRef.current,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data: QuizResult = await res.json();
      setResult(data);
      setPhase('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Submission failed. Check your connection and try again.');
      phaseRef.current = 'active'; // allow retry
    } finally {
      setSubmitting(false);
    }
  }, [moduleId]);

  // ── Advance (next question or submit on last) ─────────────────────────────────
  const advance = useCallback(() => {
    const idx = currentRef.current;
    if (idx >= questions.length - 1) {
      submitRef.current?.();
      return;
    }
    const next = idx + 1;
    currentRef.current = next;
    setCurrent(next);
    setPendingKey(null);
    // Timer reset is handled by the effect watching [current]
  }, [questions.length]);

  // Keep advance/submit refs fresh
  useEffect(() => { advanceRef.current = advance; }, [advance]);
  useEffect(() => { submitRef.current = submitQuiz; }, [submitQuiz]);

  // ── Lock current answer and advance ──────────────────────────────────────────
  const lockAndAdvance = useCallback(() => {
    const idx   = currentRef.current;
    const q     = questions[idx];
    const key   = pendingKey; // may be null if timer forced advance
    answersRef.current[q.id] = key;
    timelineRef.current.push({
      type: 'answer',
      questionIdx: idx,
      timeRemainingMs: timeLeftRef.current * 1000,
      timestamp: new Date().toISOString(),
      originalKey: key ?? undefined,
    });
    advanceRef.current?.();
  }, [questions, pendingKey]);

  // ── Per-question timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;
    timeLeftRef.current = QUESTION_SECONDS;
    setTimeLeft(QUESTION_SECONDS);

    const id = setInterval(() => {
      const next = timeLeftRef.current - 1;
      timeLeftRef.current = next;
      setTimeLeft(next);
      if (next <= 0) {
        clearInterval(id);
        // Auto-advance without recording an answer (null)
        const idx = currentRef.current;
        const q   = questions[idx];
        answersRef.current[q.id] = null;
        timelineRef.current.push({
          type: 'timeout',
          questionIdx: idx,
          timeRemainingMs: 0,
          timestamp: new Date().toISOString(),
        });
        advanceRef.current?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [phase, current, questions]); // reset timer whenever question changes

  // ── Tab / focus detection ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;

    const onVisibility = () => {
      if (document.hidden) {
        timelineRef.current.push({
          type: 'tab_exit',
          questionIdx: currentRef.current,
          timeRemainingMs: timeLeftRef.current * 1000,
          timestamp: new Date().toISOString(),
        });
        const strikes = tabStrikesRef.current + 1;
        tabStrikesRef.current = strikes;
        setTabStrikes(strikes);
        if (strikes >= MAX_TAB_STRIKES) {
          timelineRef.current.push({
            type: 'strike_submit',
            questionIdx: currentRef.current,
            timeRemainingMs: timeLeftRef.current * 1000,
            timestamp: new Date().toISOString(),
          });
          submitRef.current?.();
        }
      } else {
        timelineRef.current.push({
          type: 'tab_return',
          questionIdx: currentRef.current,
          timeRemainingMs: timeLeftRef.current * 1000,
          timestamp: new Date().toISOString(),
        });
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase]);

  // ── Begin assessment ─────────────────────────────────────────────────────────
  const beginAssessment = useCallback(() => {
    // Request fullscreen (gracefully ignore denial)
    document.documentElement.requestFullscreen?.().catch(() => {});
    timelineRef.current = [];
    answersRef.current  = {};
    phaseRef.current    = 'active';
    setPhase('active');
    setCurrent(0);
    currentRef.current = 0;
    setPendingKey(null);
    setTabStrikes(0);
    tabStrikesRef.current = 0;
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return <IntroView
      moduleId={moduleId}
      moduleTitle={moduleTitle}
      passingScore={passingScore}
      questionCount={questions.length}
      attemptNumber={attemptNumber}
      onBegin={beginAssessment}
    />;
  }

  if (phase === 'results' && result) {
    return <ResultsView result={result} moduleId={moduleId} moduleTitle={moduleTitle} passingScore={passingScore} />;
  }

  if (phase === 'results' && submitting) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--brass)', textTransform: 'uppercase' }}>
          Submitting Assessment...
        </div>
        {submitError && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#E84040', letterSpacing: '0.12em' }}>
            {submitError}
          </span>
        )}
      </div>
    );
  }

  // Active phase
  const q             = questions[current];
  const isLast        = current === questions.length - 1;
  const timerPct      = timeLeft / QUESTION_SECONDS;
  const timerColor    = timeLeft > 30 ? 'var(--brass)' : timeLeft > 10 ? '#E88A40' : '#E84040';
  const strikesLeft   = MAX_TAB_STRIKES - tabStrikes;

  return (
    <div style={{ maxWidth: '820px' }}>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0 16px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <MonoLabel>{moduleId} · Question {current + 1} of {questions.length} · Attempt #{attemptNumber}</MonoLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {tabStrikes > 0 && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: tabStrikes >= 2 ? '#E84040' : '#E88A40',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              ⚠ {strikesLeft} focus {strikesLeft === 1 ? 'warning' : 'warnings'} remaining
            </span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '20px',
            fontWeight: 700,
            color: timerColor,
            letterSpacing: '-0.01em',
            minWidth: '36px',
            textAlign: 'right',
          }}>
            {String(timeLeft).padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: '3px', background: 'var(--border)', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${timerPct * 100}%`,
          background: timerColor,
          transition: 'width 1s linear, background 0.3s ease',
        }} />
      </div>

      {/* Overall progress bar */}
      <div style={{ height: '2px', background: 'var(--border)', marginBottom: '28px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(current / (questions.length - 1)) * 100}%`,
          background: 'var(--brass)',
          transition: 'width 300ms ease',
        }} />
      </div>

      {/* Question card */}
      <div style={{
        border: `1px solid ${q.is_critical ? 'rgba(232,64,64,.4)' : 'var(--border)'}`,
        background: q.is_critical ? 'rgba(232,64,64,.02)' : 'var(--bg-elev-1)',
        padding: '28px 32px',
        marginBottom: '24px',
      }}>
        {q.is_critical && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            background: 'rgba(232,64,64,.12)',
            border: '1px solid rgba(232,64,64,.3)',
            marginBottom: '16px',
          }}>
            <div style={{ width: '5px', height: '5px', background: '#E84040', borderRadius: '50%' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#E84040',
              textTransform: 'uppercase',
            }}>
              Critical Assessment — Wrong Answer = Tactical Reset
            </span>
          </div>
        )}

        {q.topic && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'var(--brass)',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {q.topic}
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          fontWeight: 500,
          color: 'var(--ink)',
          lineHeight: 1.65,
          margin: '0 0 28px',
        }}>
          {q.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map(opt => {
            const selected = pendingKey === opt.originalKey;
            return (
              <button
                key={opt.originalKey}
                onClick={() => setPendingKey(opt.originalKey)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 18px',
                  border: `1px solid ${selected ? 'var(--brass)' : 'var(--border)'}`,
                  background: selected ? 'rgba(197,160,89,.08)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 100ms ease',
                  width: '100%',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: selected ? 'var(--brass)' : 'var(--ink-mute)',
                  flexShrink: 0,
                  paddingTop: '1px',
                  minWidth: '16px',
                }}>
                  {opt.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  color: selected ? 'var(--ink)' : 'var(--ink-dim)',
                  lineHeight: 1.55,
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          color: pendingKey ? 'var(--brass)' : 'var(--ink-mute)',
          textTransform: 'uppercase',
        }}>
          {pendingKey ? 'Answer selected — confirm to proceed' : 'Select an answer above'}
        </span>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span
            onClick={() => {
              // Skip without answering
              const q = questions[currentRef.current];
              answersRef.current[q.id] = null;
              timelineRef.current.push({
                type: 'answer',
                questionIdx: currentRef.current,
                timeRemainingMs: timeLeftRef.current * 1000,
                timestamp: new Date().toISOString(),
                originalKey: undefined,
              });
              advanceRef.current?.();
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: 'var(--ink-mute)',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Skip →
          </span>

          {isLast ? (
            <BrassButton
              variant="primary"
              size="md"
              disabled={!pendingKey || submitting}
              onClick={lockAndAdvance}
              style={{ opacity: (!pendingKey || submitting) ? 0.45 : 1, cursor: (!pendingKey || submitting) ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment ⤳'}
            </BrassButton>
          ) : (
            <BrassButton
              variant="primary"
              size="md"
              disabled={!pendingKey}
              onClick={lockAndAdvance}
              style={{ opacity: !pendingKey ? 0.45 : 1, cursor: !pendingKey ? 'not-allowed' : 'pointer' }}
            >
              Next Question →
            </BrassButton>
          )}
        </div>
      </div>

      {submitError && (
        <div style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#E84040', letterSpacing: '0.12em' }}>
          {submitError}
        </div>
      )}
    </div>
  );
}

// ── Intro View ────────────────────────────────────────────────────────────────

interface IntroViewProps {
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
  questionCount: number;
  attemptNumber: number;
  onBegin: () => void;
}

function IntroView({ moduleId, moduleTitle, passingScore, questionCount, attemptNumber, onBegin }: IntroViewProps) {
  return (
    <div style={{ maxWidth: '680px' }}>
      <MonoLabel style={{ marginBottom: '8px' }}>Knowledge Assessment · {moduleId}</MonoLabel>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--ink)',
        lineHeight: 1.15,
        marginBottom: '6px',
      }}>
        {moduleTitle}
      </h1>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.16em',
        color: 'var(--ink-mute)',
        textTransform: 'uppercase',
        marginBottom: '32px',
      }}>
        {questionCount} Questions · {passingScore}% to Pass · Attempt #{attemptNumber}
      </p>

      <Rule style={{ marginBottom: '28px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
        {[
          { icon: '⏱', label: '90-second timer per question', detail: 'Unanswered questions are recorded as null on timeout.' },
          { icon: '→', label: 'One question at a time — no going back', detail: 'Once you confirm an answer and advance, it is locked.' },
          { icon: '⚠', label: 'Critical Fail questions', detail: 'Any critical question answered incorrectly triggers an immediate Tactical Reset and a 24-hour lockout.' },
          { icon: '⛶', label: 'Fullscreen mode enforced', detail: 'The browser will enter fullscreen when you begin.' },
          { icon: '◉', label: `Focus monitoring — ${MAX_TAB_STRIKES} strikes before auto-submit`, detail: 'Leaving this tab or switching windows is recorded. Three exits trigger automatic submission.' },
          { icon: '✦', label: 'Questions and options are randomised each attempt', detail: 'Answer order is shuffled server-side — not stored in your browser.' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            gap: '14px',
            padding: '14px 16px',
            border: '1px solid var(--border)',
            background: 'var(--bg-elev-1)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--brass)',
              flexShrink: 0,
              width: '16px',
              textAlign: 'center',
            }}>
              {item.icon}
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.5 }}>
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <BrassButton variant="primary" size="md" onClick={onBegin}>
          Begin Assessment ⤳
        </BrassButton>
        <Link href={`/dashboard/module/${moduleId}`}>
          <BrassButton variant="ghost" size="md">Review Module First</BrassButton>
        </Link>
      </div>
    </div>
  );
}

// ── Results View ──────────────────────────────────────────────────────────────

interface ResultsViewProps {
  result: QuizResult;
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
}

function ResultsView({ result, moduleId, moduleTitle, passingScore }: ResultsViewProps) {
  const isCriticalFail = result.criticalFail;
  const isPassed       = result.passed;
  const statusColor    = isPassed ? 'var(--success, #22c55e)' : '#E84040';
  const statusLabel    = isCriticalFail ? 'TACTICAL RESET' : isPassed ? 'COMPETENT' : 'FAILED';

  return (
    <div style={{ maxWidth: '800px', padding: '0 0 80px' }}>

      {/* Result banner */}
      <div style={{
        padding: '28px',
        border: `1px solid ${isPassed ? 'rgba(34,197,94,.3)' : 'rgba(232,64,64,.4)'}`,
        background: isPassed ? 'rgba(34,197,94,.04)' : 'rgba(232,64,64,.04)',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <MonoLabel style={{ marginBottom: '8px' }}>Assessment Result · {moduleId}</MonoLabel>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              {moduleTitle}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Status
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: statusColor, letterSpacing: '0.06em' }}>
              {statusLabel}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginTop: '24px', flexWrap: 'wrap' }}>
          <ScoreStat label="Score" value={`${result.score}%`} highlight={isPassed} />
          <ScoreStat label="Correct" value={`${result.correctAnswers} / ${result.totalQuestions}`} />
          <ScoreStat label="Threshold" value={`${passingScore}%`} />
          <ScoreStat label="Attempt" value={`#${result.attempts}`} />
        </div>

        {isCriticalFail && (
          <div style={{ marginTop: '20px', padding: '12px 16px', border: '1px solid rgba(232,64,64,.4)', background: 'rgba(232,64,64,.08)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#E84040', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              ⚠ Tactical Reset Triggered — 24-Hour Lockout Now Active
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
              A Critical Fail question was answered incorrectly. Module progress has been reset and a 24-hour mandatory review period is now enforced. This event is recorded in the immutable audit trail. Review all explanations below before attempting again.
            </span>
          </div>
        )}
        {!isPassed && !isCriticalFail && (
          <div style={{ marginTop: '16px', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
            Your score did not meet the {passingScore}% passing threshold. Review the question feedback below and re-take the assessment.
          </div>
        )}
        {isPassed && (
          <div style={{ marginTop: '16px', fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
            You have demonstrated competency for this module. Your progress has been recorded. Return to the curriculum to continue.
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/curriculum">
          <BrassButton variant="primary" size="md">Return to Curriculum ⤳</BrassButton>
        </Link>
        {!isPassed && !isCriticalFail && (
          <Link href={`/dashboard/module/${moduleId}/quiz`}>
            <BrassButton variant="ghost" size="md">Retry Assessment</BrassButton>
          </Link>
        )}
        {isCriticalFail && (
          <Link href={`/dashboard/module/${moduleId}`}>
            <BrassButton variant="ghost" size="md">Review Module</BrassButton>
          </Link>
        )}
      </div>

      <Rule style={{ marginBottom: '32px' }} />

      <div style={{ marginBottom: '16px' }}>
        <MonoLabel>Question Review</MonoLabel>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {result.feedback.map((item, idx) => (
          <div
            key={item.questionId}
            style={{
              border: `1px solid ${item.correct ? 'rgba(34,197,94,.25)' : item.isCritical ? 'rgba(232,64,64,.4)' : 'rgba(232,64,64,.25)'}`,
              background: item.correct ? 'rgba(34,197,94,.02)' : 'rgba(232,64,64,.02)',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: item.correct ? 'var(--success, #22c55e)' : '#E84040',
                flexShrink: 0,
                paddingTop: '3px',
              }}>
                {item.correct ? '✓' : '✗'} Q{String(idx + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                {item.isCritical && !item.correct && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: '#E84040', fontWeight: 700, display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Critical Fail
                  </span>
                )}
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 8px' }}>
                  {item.question}
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {item.given && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: item.correct ? 'var(--success, #22c55e)' : '#E84040', textTransform: 'uppercase' }}>
                      Your Answer: {item.given}
                    </span>
                  )}
                  {!item.correct && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--brass)', textTransform: 'uppercase' }}>
                      Correct: {item.answer}
                    </span>
                  )}
                </div>
                {item.explanation && (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6, margin: 0, borderLeft: '2px solid var(--border)', paddingLeft: '12px' }}>
                    {item.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-mute)', marginBottom: '4px', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: highlight ? 'var(--success, #22c55e)' : 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
