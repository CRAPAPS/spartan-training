// Corrective Action Gate — pure logic and types.
//
// Replaces the 24-hour critical-fail lockout. A learner who answers a critical
// question wrong must re-read the slide that teaches the point and record a written
// corrective action; the assessment then reopens immediately. There is no timer
// anywhere in this flow.
//
// CLIENT-SAFE BY DESIGN. CorrectiveActionScreen is a client component and imports
// from here, so this module must never import supabaseServer — doing so pulls the
// service-role client into the browser bundle and breaks `next build`. The
// database-backed resolver lives in ./remediationServer.
//
// Spec: docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md

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

export interface OutstandingRemediation {
  sessionId: string;
  moduleId: string;
  moduleTitle: string;
  items: MissedItem[];
  outstandingCount: number;
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
