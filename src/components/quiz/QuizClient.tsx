'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { BrassButton } from '@/components/primitives/BrassButton';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

interface Question {
  id: string;
  sequence: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  is_critical: boolean;
  topic: string;
}

interface FeedbackItem {
  questionId: string;
  sequence: number;
  question: string;
  given: string | null;
  answer: string;
  correct: boolean;
  isCritical: boolean;
  explanation: string;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  criticalFail: boolean;
  criticalFailId: string | null;
  status: string;
  attempts: number;
  feedback: FeedbackItem[];
}

interface QuizClientProps {
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
  questions: Question[];
}

const OPTIONS = ['A', 'B', 'C', 'D'] as const;

function getOptionText(q: Question, opt: string): string {
  if (opt === 'A') return q.option_a;
  if (opt === 'B') return q.option_b;
  if (opt === 'C') return q.option_c;
  return q.option_d;
}

export function QuizClient({ moduleId, moduleTitle, passingScore, questions }: QuizClientProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSelect = useCallback((questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  }, []);

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/quiz/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data: QuizResult = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('Submission failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Results view ────────────────────────────────────────────────────────────
  if (result) {
    return <ResultsView result={result} moduleId={moduleId} moduleTitle={moduleTitle} passingScore={passingScore} />;
  }

  // ── Quiz view ───────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <MonoLabel style={{ marginBottom: '8px' }}>Knowledge Assessment · {moduleId}</MonoLabel>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          {moduleTitle}
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'var(--ink-mute)', marginTop: '8px', textTransform: 'uppercase' }}>
          {questions.length} Questions · Passing Threshold {passingScore}% · Critical Fail Active
        </p>
      </div>

      <Rule style={{ marginBottom: '32px' }} />

      {/* Warning banner */}
      <div style={{
        padding: '12px 16px',
        border: '1px solid rgba(197,160,89,.3)',
        background: 'rgba(197,160,89,.04)',
        marginBottom: '32px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--brass)', fontWeight: 700, paddingTop: '2px', flexShrink: 0 }}>NOTICE</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
          Questions marked <span style={{ color: 'var(--critical, #E84040)', fontWeight: 600 }}>CRITICAL</span> are non-negotiable. A wrong answer on any critical question triggers an immediate Tactical Reset regardless of your overall score. All answers are recorded in the immutable audit log.
        </span>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            selected={answers[q.id]}
            onSelect={(opt) => handleSelect(q.id, opt)}
          />
        ))}
      </div>

      <Rule style={{ margin: '40px 0 28px' }} />

      {/* Submit footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', color: answeredCount < questions.length ? 'var(--ink-mute)' : 'var(--success, #22c55e)', textTransform: 'uppercase' }}>
          {answeredCount} / {questions.length} Answered{allAnswered ? ' · Ready to Submit' : ''}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {submitError && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--critical, #E84040)', letterSpacing: '0.12em' }}>
              {submitError}
            </span>
          )}
          <BrassButton
            variant="primary"
            size="md"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
            style={{ opacity: (!allAnswered || submitting) ? 0.45 : 1, cursor: (!allAnswered || submitting) ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Submit Assessment ⤳'}
          </BrassButton>
        </div>
      </div>
    </div>
  );
}

// ── Individual question card ─────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  index: number;
  selected?: string;
  onSelect: (opt: string) => void;
}

function QuestionCard({ question, index, selected, onSelect }: QuestionCardProps) {
  return (
    <div style={{
      border: `1px solid ${question.is_critical ? 'rgba(232,64,64,.4)' : 'var(--border)'}`,
      background: question.is_critical ? 'rgba(232,64,64,.02)' : 'var(--bg-elev-1)',
      padding: '20px 24px',
    }}>
      {/* Question header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: 'var(--ink-mute)',
          paddingTop: '3px',
          flexShrink: 0,
        }}>
          Q{String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ flex: 1 }}>
          {question.is_critical && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              background: 'rgba(232,64,64,.12)',
              border: '1px solid rgba(232,64,64,.3)',
              marginBottom: '8px',
            }}>
              <div style={{ width: '5px', height: '5px', background: '#E84040', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#E84040', textTransform: 'uppercase' }}>
                Critical Assessment
              </span>
            </div>
          )}
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--ink)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {question.question}
          </p>
          {question.topic && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--brass)', textTransform: 'uppercase', marginTop: '6px', display: 'block' }}>
              {question.topic}
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '36px' }}>
        {OPTIONS.map(opt => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 14px',
                border: `1px solid ${isSelected ? 'var(--brass)' : 'var(--border)'}`,
                background: isSelected ? 'rgba(197,160,89,.08)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: isSelected ? 'var(--brass)' : 'var(--ink-mute)',
                flexShrink: 0,
                paddingTop: '1px',
              }}>
                {opt}
              </span>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '13px',
                color: isSelected ? 'var(--ink)' : 'var(--ink-dim)',
                lineHeight: 1.5,
              }}>
                {getOptionText(question, opt)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Results view ─────────────────────────────────────────────────────────────

interface ResultsViewProps {
  result: QuizResult;
  moduleId: string;
  moduleTitle: string;
  passingScore: number;
}

function ResultsView({ result, moduleId, moduleTitle, passingScore }: ResultsViewProps) {
  const isCriticalFail = result.criticalFail;
  const isPassed = result.passed;
  const statusColor = isPassed ? 'var(--success, #22c55e)' : '#E84040';
  const statusLabel = isCriticalFail ? 'TACTICAL RESET' : isPassed ? 'COMPETENT' : 'FAILED';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 0 80px' }}>

      {/* Result banner */}
      <div style={{
        padding: '28px 28px',
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
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            border: '1px solid rgba(232,64,64,.4)',
            background: 'rgba(232,64,64,.08)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#E84040', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              ⚠ Tactical Reset Triggered
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.6 }}>
              A Critical Fail question was answered incorrectly. This indicates a potential safety risk under operational conditions. Module progress has been reset. This event has been logged in the immutable audit trail. Review the explanations below, then re-take the assessment from the beginning.
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
        {!isPassed && (
          <Link href={`/dashboard/module/${moduleId}/quiz`}>
            <BrassButton variant="ghost" size="md">Retry Assessment</BrassButton>
          </Link>
        )}
      </div>

      <Rule style={{ marginBottom: '32px' }} />

      {/* Per-question feedback */}
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
