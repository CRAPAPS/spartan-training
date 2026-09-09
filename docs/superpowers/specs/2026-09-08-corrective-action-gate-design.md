# Corrective Action Gate — replacing the Tactical Reset lockout

**Date:** 2026-09-08
**Status:** Approved for implementation planning
**Author:** Sheldon Kuhn / Claude
**Supersedes:** the 24-hour critical-fail lockout ("Tactical Reset") shipped in the original quiz gate

---

## 1. Context

Spartan Training enforces a **Tactical Reset** when a learner answers a *critical* quiz question
incorrectly. Today that means a hard **24-hour wall-clock lockout** before the assessment can be
re-attempted. Nothing is asked of the learner during that period; the clock simply runs.

MAJ Makropoulos, who heads the platform, has asked for the lockout to be removed. Learners are
being stalled for a day at a time and the delay is read as punitive.

The pedagogical intent behind the lockout is still sound and should not be discarded. Critical
questions cover the points where being wrong in the field carries real consequence — deadly force
thresholds, arrest authority, curtilage entry. The lockout was a crude way of saying *stop, this one
matters, go and learn it properly.*

This design keeps that message and drops the punishment. The learner is required to demonstrate they
have engaged with the material they got wrong, and the moment they do, they may re-attempt. There is
no clock at any point.

### Current implementation

The lockout is a single block: `src/app/dashboard/module/[id]/quiz/page.tsx:77–99`. It reads the most
recent `quiz_sessions` row for the operator/module with `critical_fail = true`, and if that row is
less than 24 hours old, renders `CooldownScreen` instead of the quiz. That is the entire enforcement.

Two related paths exist and are explicitly **out of scope**:

- `src/lib/hardGate.ts` — the SCORM webhook's `evaluateCompletion()` writes
  `operator_progress.status = 'reset'` on a critical fail, but never writes `quiz_sessions`. Because
  the lockout reads `quiz_sessions`, **this path has never caused a lockout.** Only its user-facing
  copy may warrant a later pass.
- `mjm_modules.critical_question_ids` — used by the SCORM path only. The quiz route derives criticality
  from `quiz_questions.is_critical`.

---

## 2. Goals and non-goals

### Goals

1. Remove the time-based lockout entirely. No timer, no cooldown, no wall-clock delay anywhere in the flow.
2. On a critical fail, require the learner to re-read the specific source material and record a written
   corrective action for **each** missed critical item before re-attempting.
3. Persist those corrective actions as a durable, auditable record surfaced to coordinators and admins.
4. Preserve every existing compliance artefact — the critical-fail record, the `TACTICAL_RESET` audit
   event, and the commander notification.

### Non-goals

- No human review or approval step. The gate is **learner-released**; no staff action is required to
  unlock a retry. Introducing coordinator sign-off would replace a 24-hour wait with an indefinite one.
- No change to scoring, passing thresholds, question shuffling, or which questions are critical.
- No change to the sequential module gate, the enrollment gate, or the practical-report gate.
- No change to the SCORM path (`hardGate.ts`).

---

## 3. Behaviour

### 3.1 Learner flow

1. Learner submits a quiz containing one or more incorrectly-answered critical questions.
2. The quiz route grades as it does today: `critical_fail = true` is written to `quiz_sessions`,
   `operator_progress.status` is set to `'reset'`, `reset_at` is stamped, and the commander alert fires.
3. The results screen renders a **Corrective Action Required** panel for each missed critical item.
   Each panel shows the question, the learner's answer, the correct answer, and the existing
   `explanation` string. All of this is already returned by
   `POST /api/quiz/[moduleId]` in `feedback[]` — no new data is required on the client.
4. Each panel carries a **Review source material →** action which opens the module slide player
   deep-linked to the slide that teaches the point. The three input fields on that panel are
   **disabled** until the learner has opened that slide and acknowledged the review.
5. Once enabled, the learner completes three required fields per item:
   - *What I answered, and why it was wrong*
   - *The correct standard or procedure*
   - *What I will do differently in the field*
6. Submitting all outstanding items unlocks the retry **immediately**.

### 3.2 The gate

The retry gate condition becomes:

> Block the assessment if the operator's most recent `quiz_sessions` row for this module has
> `critical_fail = true` **and** any critical question missed in that session lacks a completed
> `remediation_records` row.

Once every missed critical item for the latest failed session has a record, the gate opens. The gate
is evaluated per session, so a subsequent critical fail re-closes it against the new session's items.

"Most recent" is unambiguous here: while the gate is closed the learner cannot start another session,
so no newer `quiz_sessions` row can exist until remediation completes. The latest row is therefore
always the one that closed the gate.

### 3.2.1 The gate resolves the session server-side — the client must not carry it

**The learner must be able to leave and come back.** If they submit a quiz, close the tab, and return
tomorrow, they no longer hold the `quiz_session_id` from the results screen. The remediation flow must
therefore be reachable from a cold start.

When the quiz page gate (§3.2) blocks, it **resolves the outstanding session and its missed critical
items server-side** and renders the corrective-action panels from that. The results screen is a
convenience path, not the only path. Any design in which remediation is only completable inside the
original page session is wrong and will strand the first learner who closes the tab.

The client is passed the resolved `sessionId`; it never has to have remembered it.

### 3.2.2 Session id must also be returned from the quiz submission

`remediation_records.quiz_session_id` requires the client to know which session it is remediating.
`POST /api/quiz/[moduleId]` currently inserts into `quiz_sessions` without returning the generated id.
That insert must be changed to `.select('id').single()` and the id added to the JSON response as
`sessionId`, alongside the existing `criticalFail` / `criticalFailId` / `feedback` fields. Without this
the results screen cannot write a correctly-keyed record.

### 3.3 Deliberate non-enforcement

The learner must **open** the source slide and acknowledge it. There is no minimum dwell time and no
scroll or audio-completion requirement. Time spent on the slide is recorded for reporting, but is not
enforced. A dwell timer would reintroduce exactly the delay Mak objects to.

### 3.4 Degradation

If a critical question has no slide anchor, or the anchor cannot be resolved against the module's
current slides, the panel links to the **module overview** and its input fields are **enabled
immediately**. A missing or stale anchor must never trap a learner. The written corrective action is
still required.

### 3.5 Privileged bypass

Operators with role `admin`, `coordinator`, or `super_admin` bypass the gate, consistent with the
enrollment, sequential, and practical-report gates.

---

## 4. Slide anchoring

### 4.1 The problem

`module_lessons.slides` is a **JSONB array**. A slide is addressable only by its array index. Index
positions shift whenever a slide is inserted, removed, or reordered — and the platform has an active
narration-drift workstream expected to rewrite UAS and PI slide content. An index-based anchor would
break silently, sending a learner to the wrong slide while the platform asserts they reviewed the
right one. That is an audit defect, not merely a bug.

### 4.2 The approach

1. Migration `028` stamps a **stable `slideId`** into every slide object in `module_lessons.slides`,
   derived once from its current position: `<MODULE_ID>-s<NN>`, e.g. `PI-14-s03`.
2. `quiz_questions` gains a nullable `remediation_slide_id TEXT` column.
3. At runtime the anchor's **module is derived from the slide id itself** — `PI-06-s02` means module
   `PI-06` — and the slide is then located within that module's slides. Resolution failure degrades
   per §3.4.
4. Any future slide edit that preserves the `slideId` field preserves the anchor. A rewrite that drops
   or renumbers it degrades safely rather than mispointing.

### 4.2.1 Anchors may cross modules — and must, for capstones

**An anchor is not restricted to the question's own module.** A capstone question tests material
taught earlier in the track; that is what a capstone *is*. Restricting anchors to the same module
forces `NONE` on precisely the questions where the gate matters most — the last gate before
certification.

This was not theoretical. Reviewing PI-24 (the PI final examination) produced:

| Question | Tests | Own-module result |
|---|---|---|
| `pi24-q7` | Perjury, OCGA 16-10-70 | `NONE` — not taught on any PI-24 slide |
| `pi24-q9` | Citizen arrest, OCGA 17-4-60 | `NONE` — not taught on any PI-24 slide |
| `pi24-q3` | CFAA / computer trespass | anchored, but only to a syllabus overview |

All three are taught properly elsewhere in the track — e.g. *"Citizen's Arrest Under OCGA 17-4-60:
What It Is and Is Not"*. Cross-module anchoring takes PI-24's selectable pool from **5 slides to 164**,
and UAS-24's from **3 to 133**.

**Two constraints, both enforced (`scripts/validate-anchor-answers.mjs`):**

1. **Same track.** A `unarmed-security` question may not anchor to a `private-detective` slide — the
   learner is not enrolled in that track and the module gate would block them.
2. **At or before in sequence.** The anchor's module must have `sequence_order <=` the question's
   module. Sequential gating guarantees the learner has already passed it, so the link always
   resolves. A later module would send them into content they have not unlocked.

**No schema change is required.** `remediation_slide_id` and `remediation_records.slide_id` are `TEXT`
and already hold a fully-qualified slide id. The only code consequence is that the corrective-action
screen builds its review link against the *anchor's* module rather than the question's:
`/dashboard/module/<module-from-slide-id>?slide=<slideId>`.

### 4.3 Producing the mappings

65 critical questions require anchors (Armed 21 / PI 20 / UAS 24).

A one-off generation script compares each critical question's `topic` and question stem against the
`heading`, `keyPoints`, and `body` of every slide **within its own module**, and emits a review file:

```
question_id | module | topic | proposed slideId | proposed heading | confidence
```

Sheldon reviews this file and corrects the ambiguous rows. Topics such as "Deadly Force Threshold" map
unambiguously; vague labels such as "Ethics" or "Licensing", and questions that deliberately combine
two slides, will not. **Rows that remain low-confidence after review ship as `NULL`** and degrade per
§3.4 — a wrong anchor is worse than no anchor.

The reviewed mapping is committed as seed data inside migration `028`.

The generation script is a build-time tool, not runtime code, and lives in `scripts/`.

---

## 5. Data model

### 5.1 New table: `remediation_records`

```sql
CREATE TABLE remediation_records (
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
```

**The uniqueness key is `(quiz_session_id, question_id)`, not `(operator_id, module_id)`.**
`report_submissions` uses the latter because a practical is submitted once. A learner can critically
fail the same module more than once, and each failure must produce its own record. Keying on
operator+module would cause the second critical fail on a module to fail insertion.

`slide_id` and `slide_viewed_at` are nullable to accommodate the degradation path in §3.4.

**`question_id` uses `ON DELETE RESTRICT`, not `CASCADE`, and the question text is denormalized into
the record.** Migrations `003`, `015` and `022` all re-seed questions with the idempotent pattern
`DELETE FROM quiz_questions WHERE module_id IN (…)`, and Admin → Modules can regenerate questions.
Under `CASCADE`, any of those would **silently destroy corrective-action records** — evidentiary data
on a GA §509 licensing platform. `RESTRICT` makes the collision loud, and `question_text` /
`explanation_text` keep the record legible even if the question is later reworded.

Note this makes existing re-seed migrations fail against modules that have remediation records. That
is the intended behaviour: a re-seed that would orphan evidence should require a deliberate decision.

RLS follows the `report_submissions` pattern exactly: operators `SELECT` their own rows; `admin`,
`coordinator`, and `super_admin` `SELECT` all rows; **no INSERT or UPDATE policies** — all writes go
through the service role in the API route.

### 5.2 Column addition

```sql
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS remediation_slide_id TEXT;
```

### 5.3 Slide ID stamping

Migration `028` rewrites `module_lessons.slides`, adding `"slideId": "<MODULE_ID>-s<NN>"` to each
slide object at its current index. Idempotent: slides already carrying a `slideId` are left untouched.

---

## 6. Preserved compliance artefacts

These are **not** changed. Only the consequence of a critical fail changes; the record of it never does.

| Artefact | Why it stays |
|---|---|
| `quiz_sessions.critical_fail = true` | The evidentiary record for a GA §509 licensing platform. |
| `operator_progress.status = 'reset'` + `reset_at` | Fires the `TACTICAL_RESET` audit event — one of only five events the `001_initial_schema.sql` trigger actually emits. `dashboard/records`, `dashboard/admin`, and `AuditLogViewer.tsx` all read it. Removing it would silently empty those views. |
| Commander email alert | Still fires on every critical fail. Wording updated only. |

---

## 7. Components and interfaces

| File | Change | Purpose |
|---|---|---|
| `supabase/migrations/028_corrective_action.sql` | **new** | `slideId` stamping · `remediation_slide_id` column · `remediation_records` + RLS · reviewed anchor seed data · capstone description copy fix |
| `src/lib/remediation.ts` | **new** | Field minimum lengths, the outstanding-remediation resolver shared by page and route, slide-anchor resolution |
| `src/app/api/remediation/[moduleId]/route.ts` | **new** | `POST` one corrective-action record. Validates ownership, that the question was genuinely critical and genuinely missed in that session, and field minimums. Service-role write. Mirrors `api/practical/[moduleId]`. |
| `src/components/quiz/CorrectiveActionScreen.tsx` | **new** | The gate screen, with a per-item panel: question, answers, explanation, slide link, three fields |
| `src/components/quiz/CooldownScreen.tsx` | **deleted** | The 24-hour countdown screen has no successor state |
| `src/app/dashboard/module/[id]/quiz/page.tsx:77–99` | replaced | 24h clock → outstanding-remediation check |
| `src/app/api/quiz/[moduleId]/route.ts` | gate added | Server-side mirror at the top of `POST`, immediately after the `isPracticalModule` block, following that pattern exactly |
| `src/components/quiz/QuizClient.tsx:321, 510, 608` | copy | "Wrong Answer = Tactical Reset" / "24-Hour Lockout" → corrective-action language |
| `src/lib/email.ts:221` | copy | "A 24-hour cooldown is in effect" → corrective-action language |
| `src/app/dashboard/module/[id]/page.tsx` | extended | Accept `?slide=<slideId>` deep-link; signal acknowledgement back to the panel |
| `scripts/generate-remediation-anchors.mjs` | **new** | Build-time anchor candidate generator (§4.3) |

### 7.1 Boundaries

`src/lib/remediation.ts` is the single source of truth for whether a learner has outstanding
remediation. Both the page gate and the API route gate call it. This mirrors the existing
`isPracticalModule` arrangement and prevents the two gates from drifting apart — a real risk, since
the page and route gates in this codebase are already independent implementations of the same rules.

### 7.2 Copy that lives in the database

The PI-24 and UAS-24 capstone `mjm_modules.description` values contain the string *"any wrong answer
triggers 24-hour cooldown"*. These live in the **live database**. Editing
`009_pi_module_registry.sql:106` and `017_uas_module_registry.sql:106` changes nothing in production —
those migrations have already run. Migration `028` must issue explicit `UPDATE` statements.

**Related defect, already resolved — see `027_remove_non_georgia_content.sql`.** MOD-04's live
description ended *"Maps to US 123515 — Handle and Use a Handgun."* `US 123515` is a **South African
SAQA unit standard** on a Georgia GBPDSA course under Rule 509-3-.01, and it was student-visible.

It was **not** drawn from MJM's source material: a full-text search of all three original course PDFs
(Armed 16hr, PI 72hr, Basic Security 24hr — 92,808 words) returned **zero** hits for SAQA / PSIRA /
PFTC / "unit standard" / `US 1xxxxx` / "Firearms Control Act" / "South Africa", while a control search
confirmed GBPDSA, 509-3, OCGA and Georgia appear throughout. It was introduced during the platform
build by `004_syllabus_phase1_3.sql:42` and maps to no standard this course must teach.

**Removed from production 2026-09-09** and recorded as migration `027`. A sweep of `mjm_modules` (64),
`module_lessons` (393 slides) and `quiz_questions` (329) confirms **0** non-Georgia items remain.

Out-of-state references that are **legitimate Georgia teaching and must be left alone**: Florida
licence reciprocity (a FL licence is not valid in GA), all-party consent states under federal ECPA
(stops a GA PI applying Georgia's one-party rule where it is a crime), and `Horton v. California`
(federal plain-view doctrine, binding in Georgia). Re-verify any time with
`node scripts/strip-non-georgia-content.mjs` (dry run).

---

## 8. Error handling

| Condition | Behaviour |
|---|---|
| Anchor `slideId` not found in current slides | Link to module overview; fields enabled immediately (§3.4) |
| `remediation_slide_id` is `NULL` | Same as above |
| Duplicate submission for the same `(quiz_session_id, question_id)` | Upsert on the unique key; last write wins. Idempotent retry, not an error. |
| Note below minimum length | `400` with the offending field named. Client validates too, server is authoritative. |
| Submission for a question that was not critical, or was answered correctly in that session | `403`. Prevents fabricating records for items the learner did not miss. |
| Submission for a session belonging to another operator | `403` |
| Learner never completes remediation | Module retry stays closed indefinitely. This is learner-released and requires no staff action to open. |

---

## 9. Testing

The repository currently has one test suite (`src/__tests__/shuffle.test.ts`). This work adds the
first meaningful coverage of the gating logic:

1. Gate blocks when the latest session has `critical_fail` and any missed critical item lacks a record.
2. Gate opens once every missed critical item for that session has a record.
3. A second critical fail on the same module creates a **new** record rather than colliding on the
   unique key — the specific failure the `report_submissions` key shape would have caused.
4. An unresolvable or `NULL` `slideId` degrades open rather than trapping the learner.
5. Privileged roles bypass the gate.
6. Submitting a record for a non-critical or correctly-answered question returns `403`.
7. Page gate and route gate agree — both delegate to `src/lib/remediation.ts`.

---

## 10. Rollout

1. Generate anchor candidates; Sheldon reviews and corrects (§4.3).
2. Apply migration `028`.

   **Migration state, to avoid confusion:** `026` is the highest migration actually *run* through the
   migration process. `027_remove_non_georgia_content.sql` exists as a file but has **not** been run —
   its effect was applied directly to production on 2026-09-09 via
   `scripts/strip-non-georgia-content.mjs --apply`, and the file exists so a rebuilt database matches
   prod. It carries a `LIKE '%US 123515%'` guard, so running it later is a safe no-op. This work is
   therefore `028`.
3. Deploy. No data backfill is required: learners with an *expired* 24-hour lockout are unaffected;
   learners inside an *active* one are released immediately and will be asked for corrective action on
   their next attempt at that module rather than retroactively.
4. Confirm the capstone descriptions no longer mention a cooldown.

**Migration `028` must land before the code deploys, not alongside it.** The gate's degradation path
(§3.4) depends on `remediation_slide_id` existing and on slides carrying `slideId`. Deploying the code
first would put every learner released from an active lockout onto the degraded path at once, and any
learner mid-remediation would hit a missing column. The ordering above is the required ordering.

### Risk

The main risk is **anchor rot** — future slide rewrites dropping `slideId`, silently returning
questions to the degraded path. Mitigation: an admin-visible count of critical questions whose anchors
no longer resolve, so drift surfaces rather than hides.

---

## 11. Open items

- ~~Whether `hardGate.ts` (SCORM path) copy should be aligned.~~ **Resolved 2026-09-08: nothing to do.**
  `SCORMPlayerClient.tsx` contains no lockout or cooldown wording at all — only a `GateState` of
  `'critical_fail'`. The SCORM path writes `operator_progress.status = 'reset'` and nothing else, which
  remains correct under this design. No change required.
- Whether coordinators should be able to *comment on* a corrective-action record. Out of scope here;
  records are read-only to staff in this iteration.
