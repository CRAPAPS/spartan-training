/**
 * anchors.mjs — pure helpers for turning reviewed anchor decisions into migration SQL.
 *
 * Kept out of src/ deliberately: this parses review artefacts and emits SQL, which is
 * build-time work and has no business in the application bundle. Kept out of the CLI
 * itself so it can be unit tested — see src/__tests__/anchors.test.ts.
 *
 * No side effects: no database, no filesystem, no environment.
 */

/**
 * Reads `ANSWER for <question-id>: <slide-id | NONE>` lines out of the reviewed
 * answers file, ignoring comments and prose.
 *
 * NONE is a real decision, not a missing one — it means no single slide teaches the
 * point, so the question ships unanchored and the gate degrades to a module-overview
 * link. It is therefore recorded as an explicit null rather than an absent key.
 */
export function parseAnswers(text) {
  const out = new Map();
  for (const line of String(text ?? '').split('\n')) {
    const m = line.match(/^\s*ANSWER\s+for\s+([A-Za-z0-9_-]+)\s*:\s*(\S+)\s*$/);
    if (!m) continue;
    out.set(m[1], m[2].toUpperCase() === 'NONE' ? null : m[2]);
  }
  return out;
}

/**
 * Combines the matcher's proposals with the reviewed answers.
 *
 * Only HIGH proposals are trusted unreviewed. A MEDIUM or LOW proposal was flagged
 * for human judgement precisely because the matcher could not tell, and shipping an
 * unreviewed guess is worse than shipping no anchor: the learner is sent to material
 * that does not teach the point, while the platform records that they reviewed the
 * source. Reviewed answers always win, including an explicit NONE.
 */
export function mergeAnchors(proposals, answers) {
  const out = new Map();
  for (const p of proposals ?? []) {
    if (p?.confidence === 'HIGH' && p.proposed_slide_id) {
      out.set(p.question_id, p.proposed_slide_id);
    }
  }
  for (const [questionId, slideId] of answers ?? new Map()) {
    out.set(questionId, slideId);
  }
  return out;
}

const sqlEscape = (s) => String(s).replace(/'/g, "''");

/**
 * One UPDATE per anchored question, sorted by question id so the generated block is
 * stable across runs and diffs cleanly. NONE entries emit nothing — the column stays
 * null, which is the degradation path.
 */
export function toSqlLines(anchors) {
  return [...(anchors ?? new Map())]
    .filter(([, slideId]) => !!slideId)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([questionId, slideId]) =>
      `UPDATE quiz_questions SET remediation_slide_id = '${sqlEscape(slideId)}' WHERE id = '${sqlEscape(questionId)}';`,
    );
}
