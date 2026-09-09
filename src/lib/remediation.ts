// Corrective Action Gate — shared logic for the quiz page gate and the API routes.
//
// Replaces the 24-hour critical-fail lockout. A learner who answers a critical
// question wrong must re-read the slide that teaches the point and record a written
// corrective action; the assessment then reopens immediately. There is no timer
// anywhere in this flow.
//
// This module is the SINGLE SOURCE OF TRUTH for whether a learner owes corrective
// action. Both the page gate and the quiz API route call it — the two gates in this
// codebase are otherwise independent implementations of the same rules, which is
// exactly how they drift apart.
//
// Spec: docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md

import { supabaseAdmin } from './supabaseServer';

/** Minimum characters per corrective-action field, after trimming. */
export const NOTE_MIN_CHARS = 40;

export interface CriticalQuestionRow {
  id: string;
  question: string;
  correct: string;
  explanation: string | null;
  remediation_slide_id: string | null;
}

export interface MissedItem {
  questionId: string;
  question: string;
  explanation: string | null;
  givenAnswer: string | null;
  correctAnswer: string;
  slideId: string | null;
  remediated: boolean;
}

/**
 * The critical questions the learner got wrong in one session.
 *
 * `answers` is the quiz_sessions.answers JSONB: questionId -> the original option
 * key the learner chose. A question that is absent or null counts as missed — an
 * unanswered critical question is not a pass.
 */
export function computeMissedItems(
  answers: Record<string, string | null>,
  criticalQuestions: CriticalQuestionRow[],
  remediatedQuestionIds: string[],
): MissedItem[] {
  const done = new Set(remediatedQuestionIds);
  return criticalQuestions
    .filter((q) => (answers[q.id] ?? null) !== q.correct)
    .map((q) => ({
      questionId: q.id,
      question: q.question,
      explanation: q.explanation,
      givenAnswer: answers[q.id] ?? null,
      correctAnswer: q.correct,
      slideId: q.remediation_slide_id,
      remediated: done.has(q.id),
    }));
}

/** Returns null when valid, else the name of the first field that is too short. */
export function validateNotes(notes: {
  noteError: string;
  noteStandard: string;
  noteFieldAction: string;
}): string | null {
  for (const field of ['noteError', 'noteStandard', 'noteFieldAction'] as const) {
    if ((notes[field] ?? '').trim().length < NOTE_MIN_CHARS) {
      return `${field} must be at least ${NOTE_MIN_CHARS} characters`;
    }
  }
  return null;
}

/**
 * Index of the slide carrying this id within the given slide array, or null.
 *
 * Null means "we cannot show the source slide" and the caller must degrade to a
 * module-overview link with the fields enabled. It must never block the learner:
 * an anchor that stops resolving — because a slide was rewritten or renumbered —
 * is a content problem, not a reason to trap someone out of an assessment.
 */
export function resolveSlideIndex(slides: unknown[], slideId: string | null): number | null {
  if (!slideId) return null;
  const i = slides.findIndex(
    (s) => typeof s === 'object' && s !== null && (s as { slideId?: string }).slideId === slideId,
  );
  return i === -1 ? null : i;
}

/**
 * The module a slide id belongs to: 'PI-06-s02' -> 'PI-06'.
 *
 * Anchors cross modules — a capstone question is taught in an earlier module — so
 * the review link must target the ANCHOR's module, not the question's. The slide id
 * already carries that, so no extra column is needed.
 *
 * Returns null for a malformed id, which degrades per resolveSlideIndex above.
 */
export function moduleIdFromSlideId(slideId: string | null): string | null {
  if (!slideId) return null;
  const m = slideId.match(/^(.+)-s\d+$/);
  return m ? m[1] : null;
}

export interface OutstandingRemediation {
  sessionId: string;
  moduleId: string;
  moduleTitle: string;
  items: MissedItem[];
  outstandingCount: number;
}

/**
 * Whether this operator owes corrective action on this module.
 *
 * Returns null when they are clear to attempt.
 *
 * Resolved entirely SERVER-SIDE. The learner must be able to submit a quiz, close
 * the tab, and come back tomorrow — at which point they no longer hold the session
 * id from the results screen. Any design that depends on the client carrying it
 * forward strands the first learner who closes the tab.
 *
 * "Most recent session" is unambiguous: while the gate is closed the learner cannot
 * start another session, so no newer quiz_sessions row can exist until remediation
 * completes. The latest row is always the one that closed the gate.
 */
export async function getOutstandingRemediation(
  operatorId: string,
  moduleId: string,
): Promise<OutstandingRemediation | null> {
  const { data: session } = await supabaseAdmin
    .from('quiz_sessions')
    .select('id, answers')
    .eq('operator_id', operatorId)
    .eq('module_id', moduleId)
    .eq('critical_fail', true)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) return null;

  const s = session as unknown as { id: string; answers: Record<string, string | null> | null };

  const { data: criticals } = await supabaseAdmin
    .from('quiz_questions')
    .select('id, question, correct, explanation, remediation_slide_id')
    .eq('module_id', moduleId)
    .eq('is_critical', true);

  const criticalRows = (criticals ?? []) as unknown as CriticalQuestionRow[];
  if (criticalRows.length === 0) return null;

  const { data: records } = await supabaseAdmin
    .from('remediation_records')
    .select('question_id')
    .eq('quiz_session_id', s.id);

  const done = ((records ?? []) as unknown as Array<{ question_id: string }>).map((r) => r.question_id);
  const items = computeMissedItems(s.answers ?? {}, criticalRows, done);
  const outstandingCount = items.filter((i) => !i.remediated).length;

  if (outstandingCount === 0) return null;

  const { data: module } = await supabaseAdmin
    .from('mjm_modules')
    .select('title')
    .eq('id', moduleId)
    .single();

  return {
    sessionId: s.id,
    moduleId,
    moduleTitle: (module as unknown as { title?: string } | null)?.title ?? moduleId,
    items,
    outstandingCount,
  };
}
