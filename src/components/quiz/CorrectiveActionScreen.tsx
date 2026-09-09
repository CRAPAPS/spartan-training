'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';
import { Rule } from '@/components/primitives/Rule';
import {
  NOTE_MIN_CHARS,
  moduleIdFromSlideId,
  type MissedItem,
  type OutstandingRemediation,
} from '@/lib/remediation';

/**
 * Corrective Action screen — what a learner sees instead of the 24-hour lockout.
 *
 * There is no timer here and there must never be one. The learner reviews the slide
 * that teaches the point they missed, writes down what they got wrong and what they
 * will do differently, and the assessment reopens immediately.
 */

const FIELDS = [
  { key: 'noteError',       label: 'What I answered, and why it was wrong' },
  { key: 'noteStandard',    label: 'The correct standard or procedure' },
  { key: 'noteFieldAction', label: 'What I will do differently in the field' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

export function CorrectiveActionScreen({ outstanding }: { outstanding: OutstandingRemediation }) {
  const router = useRouter();
  const pending = outstanding.items.filter((i) => !i.remediated);
  const done = outstanding.items.length - pending.length;

  return (
    <div style={{ maxWidth: '760px' }}>
      <MonoLabel style={{ marginBottom: '8px' }}>
        Corrective Action Required · {outstanding.moduleId}
      </MonoLabel>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700,
        color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.15,
      }}>
        {outstanding.moduleTitle}
      </h1>

      <Rule style={{ margin: '24px 0' }} />

      <div style={{
        padding: '20px 24px', border: '1px solid rgba(232,64,64,.4)',
        background: 'rgba(232,64,64,.04)', marginBottom: '28px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.18em', color: '#E84040', textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          ⚠ {pending.length} critical {pending.length === 1 ? 'item' : 'items'} outstanding
          {done > 0 && ` · ${done} completed`}
        </div>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)',
          lineHeight: 1.7, margin: 0,
        }}>
          A critical question was answered incorrectly. These cover the points where being wrong in
          the field carries real consequence. Review the source material and record your corrective
          action below. <strong>There is no waiting period</strong> — the assessment reopens the
          moment you finish.
        </p>
      </div>

      {pending.map((item) => (
        <ItemPanel
          key={item.questionId}
          item={item}
          moduleId={outstanding.moduleId}
          sessionId={outstanding.sessionId}
          onDone={() => router.refresh()}
        />
      ))}

      <Link href="/dashboard/curriculum">
        <BrassButton variant="ghost" size="md">Back to Curriculum</BrassButton>
      </Link>
    </div>
  );
}

function ItemPanel({
  item, moduleId, sessionId, onDone,
}: {
  item: MissedItem;
  moduleId: string;
  sessionId: string;
  onDone: () => void;
}) {
  // No anchor means there is nothing specific to send them to, so there is nothing
  // to gate on. Enable immediately — a missing anchor must never trap a learner.
  const [viewedAt, setViewedAt] = useState<string | null>(
    item.slideId ? null : new Date().toISOString(),
  );
  const [notes, setNotes] = useState<Record<FieldKey, string>>({
    noteError: '', noteStandard: '', noteFieldAction: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled  = viewedAt !== null;
  const complete = FIELDS.every((f) => notes[f.key].trim().length >= NOTE_MIN_CHARS);

  // The anchor may live in an EARLIER module than the question — a capstone question
  // is taught upstream. Target the anchor's own module, falling back to the
  // question's if the id is malformed.
  const anchorModule = moduleIdFromSlideId(item.slideId) ?? moduleId;
  const reviewHref = item.slideId
    ? `/dashboard/module/${anchorModule}?slide=${encodeURIComponent(item.slideId)}`
    : `/dashboard/module/${moduleId}`;

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/remediation/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId, questionId: item.questionId, slideViewedAt: viewedAt, ...notes,
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.error ?? 'Could not save. Try again.');
        return;
      }
      onDone();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      border: '1px solid rgba(232,64,64,.3)', padding: '20px 24px', marginBottom: '24px',
    }}>
      <MonoLabel style={{ marginBottom: '10px' }}>Critical item · {item.questionId}</MonoLabel>

      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)',
        lineHeight: 1.6, margin: '0 0 12px',
      }}>
        {item.question}
      </p>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)',
        marginBottom: '12px', lineHeight: 1.8,
      }}>
        <div>Your answer: <span style={{ color: '#E84040' }}>{item.givenAnswer ?? 'no answer'}</span></div>
        <div>Correct: <span style={{ color: 'var(--ink)' }}>{item.correctAnswer}</span></div>
      </div>

      {item.explanation && (
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)',
          lineHeight: 1.7, margin: '0 0 16px', paddingLeft: '12px',
          borderLeft: '2px solid rgba(197,160,89,.4)',
        }}>
          {item.explanation}
        </p>
      )}

      <div style={{ marginBottom: '18px' }}>
        <Link
          href={reviewHref}
          target="_blank"
          onClick={() => setViewedAt(new Date().toISOString())}
        >
          <BrassButton variant={enabled ? 'ghost' : 'primary'} size="sm">
            {item.slideId ? 'Review source material ⤳' : 'Review module ⤳'}
          </BrassButton>
        </Link>
        {!enabled && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em',
            color: 'var(--ink-mute)', textTransform: 'uppercase', marginLeft: '12px',
          }}>
            open the source material to continue
          </span>
        )}
      </div>

      {FIELDS.map((f, i) => {
        const len = notes[f.key].trim().length;
        return (
          <label key={f.key} style={{ display: 'block', marginBottom: '14px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.14em', color: 'var(--ink-mute)',
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              {i + 1}. {f.label}
            </span>
            <textarea
              value={notes[f.key]}
              disabled={!enabled}
              onChange={(e) => setNotes({ ...notes, [f.key]: e.target.value })}
              rows={3}
              style={{
                width: '100%', padding: '10px 12px',
                fontFamily: 'var(--font-ui)', fontSize: '13px', lineHeight: 1.6,
                color: 'var(--ink)',
                background: enabled ? 'transparent' : 'rgba(0,0,0,.04)',
                border: '1px solid rgba(255,255,255,.12)', resize: 'vertical',
              }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: len >= NOTE_MIN_CHARS ? 'var(--brass)' : 'var(--ink-mute)',
            }}>
              {len} / {NOTE_MIN_CHARS} min
            </span>
          </label>
        );
      })}

      {error && (
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#E84040',
          marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      <BrassButton
        variant="primary"
        size="md"
        disabled={!enabled || !complete || saving}
        onClick={submit}
      >
        {saving ? 'Saving…' : 'Submit corrective action'}
      </BrassButton>
    </div>
  );
}
