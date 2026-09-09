# Corrective Action Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 24-hour critical-fail lockout with a learner-released corrective-action gate that requires re-reading the source slide and writing a corrective action for each missed critical question.

**Architecture:** The lockout is one block in `src/app/dashboard/module/[id]/quiz/page.tsx`. It is replaced by a check against a new `remediation_records` table. All gate logic lives in one new module, `src/lib/remediation.ts`, which both the page gate and the API route gate call — mirroring the existing `isPracticalModule` arrangement so the two gates cannot drift. Slides gain stable ids so a question can point at the slide that teaches it without breaking when slides are edited.

**Tech Stack:** Next.js ^16.2.4 (App Router, RSC), React 19, TypeScript, Supabase (Postgres + RLS, `supabaseAdmin` service role), Vitest 4.

**Spec:** `docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md`

## Global Constraints

- **Never remove the compliance record.** `quiz_sessions.critical_fail = true`, `operator_progress.status = 'reset'`, `reset_at`, and the commander email all continue to fire on every critical fail. Only the *consequence* changes. (Spec §6)
- **`operator_progress.status = 'reset'` fires the `TACTICAL_RESET` audit event** — one of only five events the `001_initial_schema.sql` trigger emits. `dashboard/records`, `dashboard/admin` and `AuditLogViewer.tsx` read it. Do not stop writing it.
- **No timer, no cooldown, no wall-clock delay** anywhere in the new flow. The gate is released by the learner's own action only. (Spec §2)
- **A missing or unresolvable slide anchor must never trap a learner.** It degrades to a module-overview link with fields enabled immediately. (Spec §3.4)
- **Privileged bypass:** roles `admin`, `coordinator`, `super_admin` skip the gate, matching every other gate in the codebase.
- **Migration `027` must be applied BEFORE the code deploys.** (Spec §10)
- Service role (`supabaseAdmin`) performs all writes. New tables get `SELECT` policies only — no `INSERT`/`UPDATE` policies — matching `report_submissions`.
- Test runner is Vitest: `npm test` runs `vitest run`. Path alias `@/` → `src/`.
- Migration files are numbered sequentially; `026` is the highest applied in production, so this work uses `027`.

---

### Task 1: Anchor mapping applied from the reviewed list

**Files:**
- Create: `scripts/apply-remediation-anchors.mjs`
- Create: `src/lib/remediation.ts`
- Test: `src/__tests__/remediationAnchors.test.ts`
- Read: `docs/superpowers/specs/2026-09-08-remediation-anchors-review.md` (Sheldon's reviewed verdicts)

**Interfaces:**
- Consumes: nothing.
- Produces: `resolveVerdict(verdict: string, proposedSlideId: string | null, confidence: AnchorConfidence): string | null` from `@/lib/remediation`; and a block of `UPDATE quiz_questions SET remediation_slide_id = '<slide-id>' WHERE id = '<question-id>';` statements written into `supabase/migrations/027_corrective_action.sql` between the markers `-- >>> ANCHORS BEGIN` and `-- >>> ANCHORS END`.

**Context:** `scripts/generate-remediation-anchors.mjs` already exists and produced the review list (65 critical questions: 41 HIGH, 15 MEDIUM, 9 LOW). The review table has a **Verdict** column the reviewer fills with `OK`, a replacement slide id such as `PI-14-s07`, or `NONE`. This task turns those verdicts into SQL. A blank verdict on a HIGH row means "accept the proposal"; a blank verdict on a MEDIUM or LOW row means "not yet reviewed" and must ship as `NONE` rather than guessing.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/remediationAnchors.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { resolveVerdict } from '@/lib/remediation';

describe('resolveVerdict', () => {
  it('accepts the proposal when the verdict is OK', () => {
    expect(resolveVerdict('OK', 'MOD-02-s01', 'HIGH')).toBe('MOD-02-s01');
  });

  it('uses the override slide id when one is given', () => {
    expect(resolveVerdict('PI-14-s07', 'PI-14-s02', 'MEDIUM')).toBe('PI-14-s07');
  });

  it('returns null for an explicit NONE verdict', () => {
    expect(resolveVerdict('NONE', 'MOD-09-s05', 'LOW')).toBeNull();
  });

  it('accepts a blank verdict on a HIGH row', () => {
    expect(resolveVerdict('', 'MOD-03-s01', 'HIGH')).toBe('MOD-03-s01');
  });

  it('refuses a blank verdict on a MEDIUM or LOW row — unreviewed ships unanchored', () => {
    expect(resolveVerdict('', 'MOD-09-s05', 'LOW')).toBeNull();
    expect(resolveVerdict('', 'PI-24-s01', 'MEDIUM')).toBeNull();
  });

  it('is whitespace and case tolerant', () => {
    expect(resolveVerdict('  ok  ', 'MOD-02-s01', 'HIGH')).toBe('MOD-02-s01');
    expect(resolveVerdict(' none ', 'MOD-02-s01', 'HIGH')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- remediationAnchors`
Expected: FAIL — `resolveVerdict` is not exported from `@/lib/remediation` (the module does not exist yet).

- [ ] **Step 3: Create `src/lib/remediation.ts` with the minimal implementation**

```typescript
// Corrective Action Gate — shared logic for the quiz page gate and the API routes.
// See docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md

export type AnchorConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

/**
 * Turns one reviewed row of the anchor review list into a slide id or null.
 *
 * A blank verdict is only an acceptance on HIGH rows. On MEDIUM/LOW rows a blank
 * means nobody looked at it, and an unreviewed guess is worse than no anchor —
 * it would send a learner to unrelated material while the platform records that
 * they reviewed the source.
 */
export function resolveVerdict(
  verdict: string,
  proposedSlideId: string | null,
  confidence: AnchorConfidence,
): string | null {
  const v = verdict.trim().toLowerCase();
  if (v === 'none') return null;
  if (v === 'ok') return proposedSlideId;
  if (v === '') return confidence === 'HIGH' ? proposedSlideId : null;
  return verdict.trim();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- remediationAnchors`
Expected: PASS (6 tests).

- [ ] **Step 5: Write the apply script**

Create `scripts/apply-remediation-anchors.mjs`:

```javascript
/**
 * apply-remediation-anchors.mjs
 *
 * Reads the reviewed anchor list and writes the UPDATE statements into
 * supabase/migrations/027_corrective_action.sql, between the ANCHORS markers.
 *
 * Run AFTER the review list has been filled in, and AFTER Task 2 has created the
 * migration file with its markers. Re-runnable: it replaces whatever currently
 * sits between the markers.
 *
 * Usage: node scripts/apply-remediation-anchors.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REVIEW = resolve(ROOT, 'docs/superpowers/specs/2026-09-08-remediation-anchors-review.md');
const MIGRATION = resolve(ROOT, 'supabase/migrations/027_corrective_action.sql');

const BEGIN = '-- >>> ANCHORS BEGIN';
const END = '-- >>> ANCHORS END';

// Mirrors resolveVerdict in src/lib/remediation.ts.
function resolveVerdict(verdict, proposedSlideId, confidence) {
  const v = verdict.trim().toLowerCase();
  if (v === 'none') return null;
  if (v === 'ok') return proposedSlideId;
  if (v === '') return confidence === 'HIGH' ? proposedSlideId : null;
  return verdict.trim();
}

const sqlEscape = (s) => String(s).replace(/'/g, "''");

const rows = [];
for (const line of readFileSync(REVIEW, 'utf8').split('\n')) {
  if (!line.startsWith('|') || line.includes('---') || line.includes('| Verdict |')) continue;
  const cells = line.split('|').map((c) => c.trim());
  // | verdict | `qid` | module | topic | `slide-id` heading (score) | **CONF** | runner-up |
  const [, verdict, qidCell, , , proposedCell, confCell] = cells;
  const qid = (qidCell.match(/`([^`]+)`/) ?? [])[1];
  if (!qid) continue;
  const proposed = (proposedCell.match(/`([^`]+)`/) ?? [])[1] ?? null;
  const confidence = (confCell.match(/([A-Z]+)/) ?? [])[1] ?? 'LOW';
  rows.push({ qid, slideId: resolveVerdict(verdict, proposed, confidence), confidence });
}

const anchored = rows.filter((r) => r.slideId);
const lines = [
  BEGIN,
  '-- Generated by scripts/apply-remediation-anchors.mjs from the reviewed list.',
  `-- ${anchored.length} of ${rows.length} critical questions anchored; the rest degrade to module overview.`,
  ...anchored.map(
    (r) => `UPDATE quiz_questions SET remediation_slide_id = '${sqlEscape(r.slideId)}' WHERE id = '${sqlEscape(r.qid)}';`,
  ),
  END,
];

const migration = readFileSync(MIGRATION, 'utf8');
const start = migration.indexOf(BEGIN);
const stop = migration.indexOf(END);
if (start === -1 || stop === -1) {
  console.error(`Markers not found in ${MIGRATION}. Add:\n${BEGIN}\n${END}`);
  process.exit(1);
}
writeFileSync(MIGRATION, migration.slice(0, start) + lines.join('\n') + migration.slice(stop + END.length));

console.log(`Anchored ${anchored.length} / ${rows.length} critical questions.`);
console.log(`Unanchored (degrade to module overview): ${rows.length - anchored.length}`);
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/remediation.ts src/__tests__/remediationAnchors.test.ts scripts/apply-remediation-anchors.mjs
git commit -m "feat(remediation): anchor verdict resolution + apply script"
```

---

### Task 2: Migration 027 — schema, slide ids, copy

**Files:**
- Create: `supabase/migrations/027_corrective_action.sql`

**Interfaces:**
- Consumes: the apply script from Task 1 (run after this file exists, to fill the `ANCHORS` markers).
- Produces: table `remediation_records`; column `quiz_questions.remediation_slide_id TEXT`; a `slideId` field on every object in `module_lessons.slides`.

**Context:** `module_lessons.slides` is a JSONB array of slide objects. Slides currently have no id — only an array index, which shifts when slides are edited. This migration stamps `slideId` derived from the current index, so the anchors from Task 1 (which use the same `<MODULE>-s<NN>` form) resolve. The PI-24 and UAS-24 capstone descriptions contain "24-hour cooldown" text that lives **in the live database** — editing migrations `009`/`017` would change nothing because they have already run.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/027_corrective_action.sql`:

```sql
-- Migration: 027_corrective_action
-- Replaces the 24-hour critical-fail lockout with a learner-released
-- corrective-action gate. See docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md
--
-- NOTE: this migration must be applied BEFORE the application code deploys.

-- ── 1. Stable slide ids ─────────────────────────────────────────────────────
-- Slides live as a JSONB array addressed only by index, which shifts when
-- content is edited. Stamp a stable id derived from the current position so a
-- question can point at the slide that teaches it. Idempotent: slides that
-- already carry a slideId are left untouched.
UPDATE module_lessons ml
SET slides = sub.rebuilt
FROM (
  SELECT
    m.module_id,
    jsonb_agg(
      CASE
        WHEN s.value ? 'slideId' THEN s.value
        ELSE s.value || jsonb_build_object(
          'slideId', m.module_id || '-s' || lpad((s.ordinality - 1)::text, 2, '0')
        )
      END
      ORDER BY s.ordinality
    ) AS rebuilt
  FROM module_lessons m,
       LATERAL jsonb_array_elements(m.slides) WITH ORDINALITY AS s(value, ordinality)
  GROUP BY m.module_id
) sub
WHERE ml.module_id = sub.module_id;

-- ── 2. Question -> slide anchor ─────────────────────────────────────────────
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS remediation_slide_id TEXT;

-- >>> ANCHORS BEGIN
-- >>> ANCHORS END

-- ── 3. Corrective action records ────────────────────────────────────────────
-- question_id uses ON DELETE RESTRICT, not CASCADE: migrations 003/015/022 all
-- re-seed with `DELETE FROM quiz_questions WHERE module_id IN (...)`, and Admin ->
-- Modules can regenerate questions. Under CASCADE any of those would silently
-- destroy evidentiary records on a GA 509 licensing platform. question_text and
-- explanation_text are denormalized so the record stays legible if the question
-- is later reworded.
CREATE TABLE IF NOT EXISTS remediation_records (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id       UUID        NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  module_id         TEXT        NOT NULL REFERENCES mjm_modules(id),
  quiz_session_id   UUID        NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id       TEXT        NOT NULL REFERENCES quiz_questions(id) ON DELETE RESTRICT,
  question_text     TEXT        NOT NULL,
  explanation_text  TEXT,
  given_answer      TEXT,
  correct_answer    TEXT        NOT NULL,
  slide_id          TEXT,
  slide_viewed_at   TIMESTAMPTZ,
  note_error        TEXT        NOT NULL,
  note_standard     TEXT        NOT NULL,
  note_field_action TEXT        NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (quiz_session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_remediation_operator_module
  ON remediation_records (operator_id, module_id);

-- RLS mirrors report_submissions: operators read their own, privileged roles read
-- all, no INSERT/UPDATE policies — every write goes through the service role.
ALTER TABLE remediation_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "remediation_records_select" ON remediation_records;
CREATE POLICY "remediation_records_select" ON remediation_records
  FOR SELECT
  USING (
    auth.uid() = operator_id
    OR EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = auth.uid()
        AND operators.role IN ('super_admin', 'admin', 'coordinator')
    )
  );

GRANT SELECT ON remediation_records TO authenticated;

-- ── 4. Copy that lives in the database ──────────────────────────────────────
-- The capstone descriptions promise a 24-hour cooldown that no longer exists.
UPDATE mjm_modules
SET description = replace(
  description,
  'Three critical questions — any wrong answer triggers 24-hour cooldown.',
  'Three critical questions — any wrong answer requires a written corrective action before re-attempting.'
)
WHERE description LIKE '%24-hour cooldown%';
```

- [ ] **Step 2: Fill in the anchors**

Run: `node scripts/apply-remediation-anchors.mjs`
Expected: prints how many of 65 critical questions were anchored, and rewrites the block between the `ANCHORS` markers.

- [ ] **Step 3: Apply the migration, then verify the slide-id stamping**

Apply `027` to the database, then run:

```sql
-- Every slide must have a slideId
SELECT module_id, jsonb_array_length(slides) AS total,
       (SELECT count(*) FROM jsonb_array_elements(slides) s WHERE s.value ? 'slideId') AS with_id
FROM module_lessons
ORDER BY module_id;
```

Expected: `total = with_id` for every row.

Re-run the whole migration. Expected: no change to `slides` — the `s.value ? 'slideId'` guard makes it a no-op.

- [ ] **Step 4: Verify no cooldown copy survives in the database**

```sql
SELECT id FROM mjm_modules WHERE description ILIKE '%cooldown%';
```

Expected: 0 rows.

- [ ] **Step 5: Verify every anchor resolves to a real slide**

```sql
SELECT q.id, q.remediation_slide_id
FROM quiz_questions q
WHERE q.is_critical
  AND q.remediation_slide_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM module_lessons ml, jsonb_array_elements(ml.slides) s
    WHERE ml.module_id = q.module_id
      AND s.value->>'slideId' = q.remediation_slide_id
  );
```

Expected: 0 rows. Any row here is an anchor pointing at a slide that does not exist — correct the verdict in the review file and re-run Step 2.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/027_corrective_action.sql
git commit -m "feat(db): 027 corrective action gate — slide ids, anchors, records table"
```

---

### Task 3: Gate logic — pure functions

**Files:**
- Modify: `src/lib/remediation.ts`
- Test: `src/__tests__/remediation.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks at runtime.
- Produces:
  - `NOTE_MIN_CHARS: number` (value `40`)
  - `interface CriticalQuestionRow { id: string; question: string; correct: string; explanation: string | null; remediation_slide_id: string | null }`
  - `interface MissedItem { questionId: string; question: string; explanation: string | null; givenAnswer: string | null; correctAnswer: string; slideId: string | null; remediated: boolean }`
  - `computeMissedItems(answers: Record<string, string | null>, criticalQuestions: CriticalQuestionRow[], remediatedQuestionIds: string[]): MissedItem[]`
  - `validateNotes(notes: { noteError: string; noteStandard: string; noteFieldAction: string }): string | null`
  - `resolveSlideIndex(slides: unknown[], slideId: string | null): number | null`

**Context:** `quiz_sessions.answers` is JSONB shaped `{ "<questionId>": "A" | "B" | "C" | "D" | null }` — the original option key the learner chose, written by `src/app/api/quiz/[moduleId]/route.ts`. A critical question is "missed" when its recorded answer is not equal to `quiz_questions.correct`. Keeping this layer pure makes the gate testable without a database.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/remediation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  computeMissedItems,
  validateNotes,
  resolveSlideIndex,
  NOTE_MIN_CHARS,
  type CriticalQuestionRow,
} from '@/lib/remediation';

const QUESTIONS: CriticalQuestionRow[] = [
  { id: 'q1', question: 'Deadly force?', correct: 'B', explanation: 'OCGA 16-3-21', remediation_slide_id: 'MOD-02-s01' },
  { id: 'q2', question: 'Trigger discipline?', correct: 'C', explanation: null, remediation_slide_id: null },
];

describe('computeMissedItems', () => {
  it('returns only critical questions answered incorrectly', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('treats an unanswered critical question as missed', () => {
    const items = computeMissedItems({ q1: null, q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('treats a question absent from the answers object as missed', () => {
    const items = computeMissedItems({ q2: 'C' }, QUESTIONS, []);
    expect(items.map(i => i.questionId)).toEqual(['q1']);
  });

  it('returns an empty array when every critical question is correct', () => {
    expect(computeMissedItems({ q1: 'B', q2: 'C' }, QUESTIONS, [])).toEqual([]);
  });

  it('marks items that already have a remediation record', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'D' }, QUESTIONS, ['q1']);
    expect(items.find(i => i.questionId === 'q1')?.remediated).toBe(true);
    expect(items.find(i => i.questionId === 'q2')?.remediated).toBe(false);
  });

  it('carries the slide anchor through, null included', () => {
    const items = computeMissedItems({ q1: 'A', q2: 'D' }, QUESTIONS, []);
    expect(items.find(i => i.questionId === 'q1')?.slideId).toBe('MOD-02-s01');
    expect(items.find(i => i.questionId === 'q2')?.slideId).toBeNull();
  });

  it('records the answer the learner actually gave', () => {
    const items = computeMissedItems({ q1: 'A' }, QUESTIONS, []);
    expect(items.find(i => i.questionId === 'q1')?.givenAnswer).toBe('A');
    expect(items.find(i => i.questionId === 'q1')?.correctAnswer).toBe('B');
  });
});

describe('validateNotes', () => {
  const long = 'x'.repeat(NOTE_MIN_CHARS);

  it('accepts three sufficiently long notes', () => {
    expect(validateNotes({ noteError: long, noteStandard: long, noteFieldAction: long })).toBeNull();
  });

  it('names the field that is too short', () => {
    expect(validateNotes({ noteError: 'too short', noteStandard: long, noteFieldAction: long }))
      .toContain('noteError');
  });

  it('rejects whitespace padding', () => {
    expect(validateNotes({ noteError: ' '.repeat(200), noteStandard: long, noteFieldAction: long }))
      .toContain('noteError');
  });

  it('checks every field, not just the first', () => {
    expect(validateNotes({ noteError: long, noteStandard: long, noteFieldAction: 'nope' }))
      .toContain('noteFieldAction');
  });
});

describe('resolveSlideIndex', () => {
  const slides = [
    { slideId: 'MOD-02-s00', heading: 'A' },
    { slideId: 'MOD-02-s01', heading: 'B' },
  ];

  it('finds the index of a matching slide id', () => {
    expect(resolveSlideIndex(slides, 'MOD-02-s01')).toBe(1);
  });

  it('returns null for a null anchor', () => {
    expect(resolveSlideIndex(slides, null)).toBeNull();
  });

  it('returns null when the anchor no longer resolves — degrades, never traps', () => {
    expect(resolveSlideIndex(slides, 'MOD-02-s99')).toBeNull();
  });

  it('tolerates slides with no slideId at all', () => {
    expect(resolveSlideIndex([{ heading: 'no id' }], 'MOD-02-s00')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- remediation.test`
Expected: FAIL — `computeMissedItems`, `validateNotes`, `resolveSlideIndex`, `NOTE_MIN_CHARS` are not exported.

- [ ] **Step 3: Implement**

Append to `src/lib/remediation.ts`:

```typescript
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
 * `answers` is the quiz_sessions.answers JSONB: questionId -> original option key.
 * A question that is absent or null counts as missed — an unanswered critical
 * question is not a pass.
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
 * Index of the slide carrying this id, or null.
 *
 * Null means "we cannot show the source slide" and the caller must degrade to a
 * module-overview link with the fields enabled. It must never block the learner.
 */
export function resolveSlideIndex(slides: unknown[], slideId: string | null): number | null {
  if (!slideId) return null;
  const i = slides.findIndex(
    (s) => typeof s === 'object' && s !== null && (s as { slideId?: string }).slideId === slideId,
  );
  return i === -1 ? null : i;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- remediation.test`
Expected: PASS (15 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/remediation.ts src/__tests__/remediation.test.ts
git commit -m "feat(remediation): pure gate logic — missed items, note validation, slide resolution"
```

---

### Task 4: Server-side gate resolver

**Files:**
- Modify: `src/lib/remediation.ts`
- Test: `src/__tests__/remediationGate.test.ts`

**Interfaces:**
- Consumes: `computeMissedItems`, `MissedItem`, `CriticalQuestionRow` (Task 3).
- Produces:
  - `interface OutstandingRemediation { sessionId: string; moduleId: string; moduleTitle: string; items: MissedItem[]; outstandingCount: number }`
  - `getOutstandingRemediation(operatorId: string, moduleId: string): Promise<OutstandingRemediation | null>` — returns `null` when the learner is clear to attempt.

**Context:** Spec §3.2.1 — the learner must be able to close the tab and come back, so the gate resolves the session **server-side**. The client never has to have remembered a `sessionId`. This function is the single source of truth called by both the quiz page and the quiz API route.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/remediationGate.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
vi.mock('@/lib/supabaseServer', () => ({
  supabaseAdmin: { from: (...a: unknown[]) => mockFrom(...a) },
}));

import { getOutstandingRemediation } from '@/lib/remediation';

// Minimal PostgREST-style chain stub. Each table returns a canned result.
function stubTables(tables: Record<string, { data: unknown }>) {
  mockFrom.mockImplementation((table: string) => {
    const result = tables[table] ?? { data: null };
    const chain: Record<string, unknown> = {};
    for (const m of ['select', 'eq', 'in', 'order', 'limit']) {
      chain[m] = () => chain;
    }
    chain.maybeSingle = () => Promise.resolve(result);
    chain.single = () => Promise.resolve(result);
    chain.then = (res: (v: unknown) => unknown) => Promise.resolve(result).then(res);
    return chain;
  });
}

beforeEach(() => mockFrom.mockReset());

describe('getOutstandingRemediation', () => {
  it('returns null when there is no critical-fail session', async () => {
    stubTables({ quiz_sessions: { data: null } });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('returns the outstanding items when a critical fail has no records', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: 'MOD-02-s01' }] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'Justification & Deadly Force' } },
    });
    const out = await getOutstandingRemediation('op-1', 'MOD-02');
    expect(out?.sessionId).toBe('sess-1');
    expect(out?.outstandingCount).toBe(1);
    expect(out?.items[0].questionId).toBe('q1');
  });

  it('returns null once every missed item has a record — the gate opens', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [{ id: 'q1', question: 'Q', correct: 'B', explanation: null, remediation_slide_id: null }] },
      remediation_records: { data: [{ question_id: 'q1' }] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });

  it('returns null when the module has no critical questions at all', async () => {
    stubTables({
      quiz_sessions: { data: { id: 'sess-1', answers: { q1: 'A' } } },
      quiz_questions: { data: [] },
      remediation_records: { data: [] },
      mjm_modules: { data: { title: 'T' } },
    });
    expect(await getOutstandingRemediation('op-1', 'MOD-02')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- remediationGate`
Expected: FAIL — `getOutstandingRemediation` is not exported.

- [ ] **Step 3: Implement**

Add the import at the top of `src/lib/remediation.ts`:

```typescript
import { supabaseAdmin } from './supabaseServer';
```

and append:

```typescript
export interface OutstandingRemediation {
  sessionId: string;
  moduleId: string;
  moduleTitle: string;
  items: MissedItem[];
  outstandingCount: number;
}

/**
 * Resolves whether this operator owes corrective action on this module.
 *
 * Returns null when they are clear to attempt. Resolved entirely server-side so
 * the flow survives the learner closing the tab and coming back — they never have
 * to have kept hold of a session id.
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

  const s = session as { id: string; answers: Record<string, string | null> | null };

  const { data: criticals } = await supabaseAdmin
    .from('quiz_questions')
    .select('id, question, correct, explanation, remediation_slide_id')
    .eq('module_id', moduleId)
    .eq('is_critical', true);

  const criticalRows = (criticals ?? []) as CriticalQuestionRow[];
  if (criticalRows.length === 0) return null;

  const { data: records } = await supabaseAdmin
    .from('remediation_records')
    .select('question_id')
    .eq('quiz_session_id', s.id);

  const done = ((records ?? []) as Array<{ question_id: string }>).map((r) => r.question_id);
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
    moduleTitle: (module as { title?: string } | null)?.title ?? moduleId,
    items,
    outstandingCount,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- remediationGate`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/remediation.ts src/__tests__/remediationGate.test.ts
git commit -m "feat(remediation): server-side outstanding-remediation resolver"
```

---

### Task 5: Quiz route returns the session id

**Files:**
- Modify: `src/app/api/quiz/[moduleId]/route.ts` (the `quiz_sessions` insert, and the final `NextResponse.json`)
- Modify: `src/components/quiz/QuizClient.tsx` (the `QuizResult` interface)

**Interfaces:**
- Consumes: nothing.
- Produces: `sessionId: string | null` on the `POST /api/quiz/[moduleId]` JSON response and on the client-side `QuizResult` type.

**Context:** Spec §3.2.2. The insert currently discards the generated row id, so the results screen has nothing to key a remediation record to.

- [ ] **Step 1: Capture the inserted session id**

In `src/app/api/quiz/[moduleId]/route.ts`, replace the `quiz_sessions` insert with:

```typescript
  // ── Record quiz session (with behavioral data) ────────────────────────────────
  const { data: sessionRow } = await admin.from('quiz_sessions').insert({
    operator_id:    user.id,
    module_id:      moduleId,
    submitted_at:   new Date().toISOString(),
    score,
    passed,
    critical_fail:  criticalFail,
    answers,
    behavioral_data: behavioralData,
  }).select('id').single();

  const sessionId = (sessionRow as { id?: string } | null)?.id ?? null;
```

- [ ] **Step 2: Return it**

In the same file, add `sessionId` to the response object:

```typescript
  return NextResponse.json({
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score,
    passed,
    criticalFail,
    criticalFailId,
    sessionId,
    status,
    attempts,
    feedback,
  });
```

- [ ] **Step 3: Add `sessionId` to the client result type**

In `src/components/quiz/QuizClient.tsx`, find the `QuizResult` interface and add:

```typescript
  sessionId: string | null;
```

- [ ] **Step 4: Verify the build type-checks**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "src/app/api/quiz/[moduleId]/route.ts" src/components/quiz/QuizClient.tsx
git commit -m "feat(quiz): return quiz_sessions id so remediation can key to it"
```

---

### Task 6: Corrective action API route

**Files:**
- Create: `src/app/api/remediation/[moduleId]/route.ts`

**Interfaces:**
- Consumes: `getOutstandingRemediation` (Task 4), `validateNotes` (Task 3).
- Produces:
  - `GET /api/remediation/[moduleId]` → `OutstandingRemediation | null`
  - `POST /api/remediation/[moduleId]` with body `{ sessionId: string, questionId: string, slideViewedAt: string | null, noteError: string, noteStandard: string, noteFieldAction: string }` → `{ outstandingCount: number, cleared: boolean }`

**Context:** Follows `src/app/api/practical/[moduleId]/route.ts` exactly: auth via `createServerSupabaseClient`, all writes via `supabaseAdmin`. The route must refuse records for questions the learner did not actually miss, or it becomes a way to fabricate an evidentiary record.

- [ ] **Step 1: Write the route**

Create `src/app/api/remediation/[moduleId]/route.ts`:

```typescript
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { getOutstandingRemediation, validateNotes } from '@/lib/remediation';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(await getOutstandingRemediation(user.id, moduleId));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    sessionId, questionId, slideViewedAt,
    noteError = '', noteStandard = '', noteFieldAction = '',
  } = body ?? {};

  if (typeof sessionId !== 'string' || typeof questionId !== 'string') {
    return NextResponse.json({ error: 'sessionId and questionId are required' }, { status: 400 });
  }

  const invalid = validateNotes({ noteError, noteStandard, noteFieldAction });
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  // The record may only be written for a question this operator genuinely missed
  // in this session. Without this check the endpoint fabricates evidence.
  const outstanding = await getOutstandingRemediation(user.id, moduleId);
  if (!outstanding || outstanding.sessionId !== sessionId) {
    return NextResponse.json({ error: 'No outstanding corrective action for this session' }, { status: 403 });
  }
  const item = outstanding.items.find(i => i.questionId === questionId);
  if (!item) {
    return NextResponse.json({ error: 'That question was not missed in this session' }, { status: 403 });
  }

  const { error } = await supabaseAdmin
    .from('remediation_records')
    .upsert({
      operator_id:       user.id,
      module_id:         moduleId,
      quiz_session_id:   sessionId,
      question_id:       questionId,
      question_text:     item.question,
      explanation_text:  item.explanation,
      given_answer:      item.givenAnswer,
      correct_answer:    item.correctAnswer,
      slide_id:          item.slideId,
      slide_viewed_at:   typeof slideViewedAt === 'string' ? slideViewedAt : null,
      note_error:        String(noteError).trim(),
      note_standard:     String(noteStandard).trim(),
      note_field_action: String(noteFieldAction).trim(),
    }, { onConflict: 'quiz_session_id,question_id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const after = await getOutstandingRemediation(user.id, moduleId);
  return NextResponse.json({
    outstandingCount: after?.outstandingCount ?? 0,
    cleared: after === null,
  });
}
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Manual verification against a dev server**

Run `npm run dev`, sign in as a test operator, and confirm:
- `GET /api/remediation/MOD-02` returns `null` for an operator with no critical fail.
- `POST` with a note under 40 characters returns `400` naming the field.
- `POST` with a `questionId` the learner answered correctly returns `403`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/api/remediation/[moduleId]/route.ts"
git commit -m "feat(api): corrective action submission route"
```

---

### Task 7: Corrective action UI

**Files:**
- Create: `src/components/quiz/CorrectiveActionScreen.tsx`

**Interfaces:**
- Consumes: `OutstandingRemediation`, `MissedItem`, `NOTE_MIN_CHARS` (Tasks 3–4); `POST /api/remediation/[moduleId]` (Task 6).
- Produces: `CorrectiveActionScreen({ outstanding }: { outstanding: OutstandingRemediation })`

**Context:** Follows the visual language of `CooldownScreen` (deleted in Task 8) — `MonoLabel`, `BrassButton`, `Rule` from `@/components/primitives/`, inline styles, CSS custom properties (`var(--ink)`, `var(--font-mono)`). The three fields stay disabled until the learner opens the source slide, **unless** the anchor is null or unresolvable, in which case they are enabled immediately (Global Constraints).

- [ ] **Step 1: Confirm the primitives accept the props this component uses**

Run: `grep -n "interface\|disabled\|onClick\|size\|variant" src/components/primitives/BrassButton.tsx`
Expected: `BrassButton` accepts `variant`, `size`, `disabled`, `onClick`. If `disabled` or `onClick` are absent, add them to its props interface and forward them to the underlying `<button>` before continuing.

- [ ] **Step 2: Write the component**

Create `src/components/quiz/CorrectiveActionScreen.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';
import { Rule } from '@/components/primitives/Rule';
import { NOTE_MIN_CHARS, type MissedItem, type OutstandingRemediation } from '@/lib/remediation';

const FIELDS = [
  { key: 'noteError',       label: 'What I answered, and why it was wrong' },
  { key: 'noteStandard',    label: 'The correct standard or procedure' },
  { key: 'noteFieldAction', label: 'What I will do differently in the field' },
] as const;

type FieldKey = (typeof FIELDS)[number]['key'];

export function CorrectiveActionScreen({ outstanding }: { outstanding: OutstandingRemediation }) {
  const router = useRouter();
  const pending = outstanding.items.filter(i => !i.remediated);

  return (
    <div style={{ maxWidth: '760px' }}>
      <MonoLabel style={{ marginBottom: '8px' }}>Corrective Action Required · {outstanding.moduleId}</MonoLabel>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.15 }}>
        {outstanding.moduleTitle}
      </h1>

      <Rule style={{ margin: '24px 0' }} />

      <div style={{ padding: '20px 24px', border: '1px solid rgba(232,64,64,.4)', background: 'rgba(232,64,64,.04)', marginBottom: '28px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: '#E84040', textTransform: 'uppercase', marginBottom: '12px' }}>
          ⚠ {pending.length} critical {pending.length === 1 ? 'item' : 'items'} outstanding
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: 0 }}>
          A critical question was answered incorrectly. These cover the points where being wrong in the
          field carries real consequence. Review the source material and record your corrective action
          below. <strong>There is no waiting period</strong> — the assessment reopens the moment you finish.
        </p>
      </div>

      {pending.map(item => (
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
  // No anchor -> nothing to force. Enable immediately; never trap the learner.
  const [viewedAt, setViewedAt] = useState<string | null>(item.slideId ? null : new Date().toISOString());
  const [notes, setNotes] = useState<Record<FieldKey, string>>({
    noteError: '', noteStandard: '', noteFieldAction: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled = viewedAt !== null;
  const complete = FIELDS.every(f => notes[f.key].trim().length >= NOTE_MIN_CHARS);

  const reviewHref = item.slideId
    ? `/dashboard/module/${moduleId}?slide=${encodeURIComponent(item.slideId)}`
    : `/dashboard/module/${moduleId}`;

  async function submit() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/remediation/${moduleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId: item.questionId, slideViewedAt: viewedAt, ...notes }),
    });
    setSaving(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload.error ?? 'Could not save. Try again.');
      return;
    }
    onDone();
  }

  return (
    <div style={{ border: '1px solid rgba(232,64,64,.3)', padding: '20px 24px', marginBottom: '24px' }}>
      <MonoLabel style={{ marginBottom: '10px' }}>Critical item · {item.questionId}</MonoLabel>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px' }}>
        {item.question}
      </p>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)', marginBottom: '12px', lineHeight: 1.8 }}>
        <div>Your answer: <span style={{ color: '#E84040' }}>{item.givenAnswer ?? 'no answer'}</span></div>
        <div>Correct: <span style={{ color: 'var(--ink)' }}>{item.correctAnswer}</span></div>
      </div>

      {item.explanation && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink-dim)', lineHeight: 1.7, margin: '0 0 16px', paddingLeft: '12px', borderLeft: '2px solid rgba(197,160,89,.4)' }}>
          {item.explanation}
        </p>
      )}

      <div style={{ marginBottom: '18px' }}>
        <Link href={reviewHref} onClick={() => setViewedAt(new Date().toISOString())} target="_blank">
          <BrassButton variant={enabled ? 'ghost' : 'primary'} size="sm">
            {item.slideId ? 'Review source material ⤳' : 'Review module ⤳'}
          </BrassButton>
        </Link>
        {!enabled && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginLeft: '12px' }}>
            open the source material to continue
          </span>
        )}
      </div>

      {FIELDS.map((f, i) => (
        <label key={f.key} style={{ display: 'block', marginBottom: '14px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: '6px' }}>
            {i + 1}. {f.label}
          </span>
          <textarea
            value={notes[f.key]}
            disabled={!enabled}
            onChange={e => setNotes({ ...notes, [f.key]: e.target.value })}
            rows={3}
            style={{
              width: '100%', padding: '10px 12px',
              fontFamily: 'var(--font-ui)', fontSize: '13px', lineHeight: 1.6,
              color: 'var(--ink)', background: enabled ? 'transparent' : 'rgba(0,0,0,.04)',
              border: '1px solid rgba(255,255,255,.12)', resize: 'vertical',
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
            {notes[f.key].trim().length} / {NOTE_MIN_CHARS} min
          </span>
        </label>
      ))}

      {error && (
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#E84040', marginBottom: '12px' }}>{error}</div>
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
```

- [ ] **Step 3: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/quiz/CorrectiveActionScreen.tsx
git commit -m "feat(ui): corrective action screen"
```

---

### Task 8: Replace the lockout in the quiz page gate

**Files:**
- Modify: `src/app/dashboard/module/[id]/quiz/page.tsx:77-99`
- Delete: `src/components/quiz/CooldownScreen.tsx`

**Interfaces:**
- Consumes: `getOutstandingRemediation` (Task 4), `CorrectiveActionScreen` (Task 7).
- Produces: nothing.

**Context:** This is the change the whole plan exists for. The 24-hour block at lines 77–99 goes; the remediation check replaces it. The gate must sit **after** the privileged-role check so admins and coordinators bypass it, consistent with every other gate on this page.

- [ ] **Step 1: Replace the cooldown block**

In `src/app/dashboard/module/[id]/quiz/page.tsx`, delete the block that begins with the comment `// 24-hour cooldown: check for a recent critical fail on this module` and ends with the closing brace of `if (Date.now() < cooldownUntil) { ... }`. Replace it with:

```tsx
  // Corrective action gate — a critical fail must be remediated in writing before
  // re-attempting. No timer: the learner releases this themselves.
  if (!isPrivileged) {
    const outstanding = await getOutstandingRemediation(user.id, id);
    if (outstanding) {
      return (
        <div style={{ padding: '40px 48px' }}>
          <CorrectiveActionScreen outstanding={outstanding} />
        </div>
      );
    }
  }
```

- [ ] **Step 2: Update the imports**

Remove the `CooldownScreen` import. Add:

```tsx
import { getOutstandingRemediation } from '@/lib/remediation';
import { CorrectiveActionScreen } from '@/components/quiz/CorrectiveActionScreen';
```

- [ ] **Step 3: Delete the cooldown screen**

```bash
git rm src/components/quiz/CooldownScreen.tsx
```

- [ ] **Step 4: Verify nothing else references it**

Run: `grep -rn "CooldownScreen" src/`
Expected: no output.

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "src/app/dashboard/module/[id]/quiz/page.tsx"
git commit -m "feat(gate): replace 24-hour lockout with corrective action gate"
```

---

### Task 9: Slide deep-link on the module page

**Files:**
- Modify: `src/app/dashboard/module/[id]/page.tsx` (props interface at line 13, the `SlidePlayerClient` render at line 147)

**Interfaces:**
- Consumes: `resolveSlideIndex` (Task 3).
- Produces: `/dashboard/module/<id>?slide=<slideId>` opens the player on that slide.

**Context:** `SlidePlayerClient` already accepts `initialSlide: number` (line 12 of `src/components/course/SlidePlayerClient.tsx`) and clamps it internally, so this task is purely about resolving the query parameter to an index. An unresolvable id must fall back to the existing behaviour rather than erroring.

- [ ] **Step 1: Accept `searchParams`**

In `src/app/dashboard/module/[id]/page.tsx`, extend the props interface:

```typescript
interface ModulePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slide?: string }>;
}
```

and the function signature:

```typescript
export default async function ModulePage({ params, searchParams }: ModulePageProps) {
  const { id } = await params;
  const { slide: slideAnchor } = await searchParams;
```

- [ ] **Step 2: Resolve the anchor to an index**

The slides live on `lesson.slides` and the current resume position is the local `initialSlide`. Add this before the `return (` of the component body:

```typescript
  // ?slide=<slideId> deep-link from the corrective action screen.
  // An unresolvable anchor falls through to the normal resume position.
  const anchorIndex = resolveSlideIndex(
    Array.isArray(lesson?.slides) ? lesson.slides : [],
    slideAnchor ?? null,
  );
```

and change the prop on the `SlidePlayerClient` render (line ~149) from `initialSlide={initialSlide}` to:

```tsx
            initialSlide={anchorIndex ?? initialSlide}
```

Add the import:

```typescript
import { resolveSlideIndex } from '@/lib/remediation';
```

- [ ] **Step 3: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run `npm run dev`. Visit `/dashboard/module/MOD-02?slide=MOD-02-s01` — the player opens on that slide. Visit `/dashboard/module/MOD-02?slide=NONSENSE` — the player opens at the normal resume position with no error.

- [ ] **Step 5: Commit**

```bash
git add "src/app/dashboard/module/[id]/page.tsx"
git commit -m "feat(module): ?slide= deep-link for corrective action review"
```

---

### Task 10: Server-side mirror gate on the quiz API

**Files:**
- Modify: `src/app/api/quiz/[moduleId]/route.ts` (top of `POST`, after the `isPracticalModule` block)

**Interfaces:**
- Consumes: `getOutstandingRemediation` (Task 4).
- Produces: `403` on quiz submission while corrective action is outstanding.

**Context:** The page gate is a rendering decision and can be bypassed by posting directly. Every other gate in this codebase is mirrored here — the practical-report gate sits immediately above this one and is the pattern to follow.

- [ ] **Step 1: Add the gate**

In `src/app/api/quiz/[moduleId]/route.ts`, directly after the closing brace of the `if (isPracticalModule(moduleId)) { ... }` block:

```typescript
  // Corrective action gate — server-side mirror of the quiz page gate.
  {
    const { data: self } = await admin
      .from('operators').select('role').eq('id', user.id).single();
    const role = (self as { role?: string } | null)?.role ?? 'agent';
    if (!['admin', 'coordinator', 'super_admin'].includes(role)) {
      const outstanding = await getOutstandingRemediation(user.id, moduleId);
      if (outstanding) {
        return NextResponse.json(
          { error: 'Corrective action must be completed before re-attempting this assessment' },
          { status: 403 },
        );
      }
    }
  }
```

Add the import:

```typescript
import { getOutstandingRemediation } from '@/lib/remediation';
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Verify both gates agree**

Run `npm run dev`. As a non-privileged operator with an outstanding corrective action, `POST /api/quiz/<moduleId>` directly (bypassing the page) and confirm a `403`. Complete the corrective action and confirm the same POST now succeeds.

- [ ] **Step 4: Commit**

```bash
git add "src/app/api/quiz/[moduleId]/route.ts"
git commit -m "feat(quiz): mirror corrective action gate server-side"
```

---

### Task 11: Copy that still promises a lockout

**Files:**
- Modify: `src/components/quiz/QuizClient.tsx:321, 510, 608`
- Modify: `src/lib/email.ts:221`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

**Context:** Three strings in the quiz UI and one in the commander email still describe a 24-hour lockout that no longer exists. Leaving them would make the platform promise a punishment it does not deliver.

- [ ] **Step 1: Update the in-quiz critical warning (line ~321)**

Replace the string `Critical Assessment — Wrong Answer = Tactical Reset` with:

```
Critical Assessment — Wrong Answer Requires Corrective Action
```

- [ ] **Step 2: Update the intro brief (line ~510)**

Replace the `detail` string `'Any critical question answered incorrectly triggers an immediate Tactical Reset and a 24-hour lockout.'` with:

```
'Any critical question answered incorrectly requires you to review the source material and record a written corrective action before you can re-attempt. There is no waiting period.'
```

- [ ] **Step 3: Update the results banner (line ~608)**

Replace the heading `⚠ Tactical Reset Triggered — 24-Hour Lockout Now Active` with:

```
⚠ Tactical Reset Triggered — Corrective Action Required
```

and the body copy beneath it with:

```
A Critical Fail question was answered incorrectly. Module progress has been reset and this event is recorded in the immutable audit trail. Review the source material and record your corrective action to reopen the assessment — there is no waiting period.
```

- [ ] **Step 4: Update the commander email (`src/lib/email.ts:221`)**

Replace `This operator has been placed in Tactical Reset status. A 24-hour cooldown is in effect. Module ${moduleId} must be reviewed in full before re-examination.` with:

```
This operator has been placed in Tactical Reset status. Module ${moduleId} is closed to re-examination until they review the source material and record a written corrective action for each critical item missed. No time penalty applies.
```

- [ ] **Step 5: Verify no lockout copy survives**

Run: `grep -rniE "24.hour|cooldown|lockout" src/`
Expected: no output.

- [ ] **Step 6: Type-check and run the full suite**

Run: `npm run type-check && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/quiz/QuizClient.tsx src/lib/email.ts
git commit -m "docs(copy): replace 24-hour lockout wording with corrective action"
```

---

### Task 12: Results screen routes into remediation

**Files:**
- Modify: `src/components/quiz/QuizClient.tsx` (the `ResultsView` actions block, ~line 640)

**Interfaces:**
- Consumes: nothing (navigates to the quiz URL, where the Task 8 gate renders the corrective-action screen).
- Produces: nothing.

**Context:** On a critical fail the results screen currently offers "Review Module". The learner needs a direct route into the corrective-action screen, which lives at the quiz URL — the gate renders it in place of the quiz.

- [ ] **Step 1: Change the critical-fail action**

In `ResultsView`, replace the `isCriticalFail` action block with:

```tsx
        {isCriticalFail && (
          <Link href={`/dashboard/module/${moduleId}/quiz`}>
            <BrassButton variant="primary" size="md">Begin Corrective Action ⤳</BrassButton>
          </Link>
        )}
```

- [ ] **Step 2: Verify the flow end to end**

Run `npm run dev`. As a non-privileged enrolled operator:
1. Fail a critical question. Confirm the results screen shows "Begin Corrective Action" and no lockout wording.
2. Click it — the corrective-action screen renders with one panel per missed critical item.
3. Confirm the three fields are disabled until "Review source material" is clicked.
4. Confirm the linked slide is the right one for that question.
5. Fill all three fields and submit. Confirm the panel clears.
6. Once all items are done, confirm the quiz loads immediately — **no timer anywhere**.
7. Close the tab before finishing, reopen `/dashboard/module/<id>/quiz`, and confirm the corrective-action screen still renders with progress intact.
8. Fail the same module critically a second time and confirm a new record is created rather than a constraint error — this exercises the `(quiz_session_id, question_id)` key rather than `(operator, module)`.
9. As an `admin` or `coordinator`, confirm the gate is bypassed entirely.

- [ ] **Step 3: Commit**

```bash
git add src/components/quiz/QuizClient.tsx
git commit -m "feat(quiz): route critical fail into corrective action"
```

---

## Deployment

Order matters — see Global Constraints.

- [ ] Reviewed anchor list is filled in and `node scripts/apply-remediation-anchors.mjs` has been run
- [ ] `npm test` passes
- [ ] `npm run type-check` passes
- [ ] Migration `027` applied to production **first**
- [ ] Post-migration checks from Task 2 Steps 3–5 all return the expected results
- [ ] Code deployed
- [ ] Confirm `SELECT id FROM mjm_modules WHERE description ILIKE '%cooldown%'` returns 0 rows
- [ ] Confirm a critical fail still writes `quiz_sessions.critical_fail = true`, `operator_progress.status = 'reset'`, and a `TACTICAL_RESET` audit row
