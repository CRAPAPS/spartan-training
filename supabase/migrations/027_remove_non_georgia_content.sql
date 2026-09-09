-- Migration: 027_remove_non_georgia_content
-- Applied to production 2026-09-09 (via scripts/strip-non-georgia-content.mjs --apply).
-- This file records that change so a rebuilt database matches production.
--
-- WHY
-- Spartan Training is accredited under Georgia Rule 509-3-.01 (GBPDSA). MOD-04's
-- student-visible description ended:
--
--     "Maps to US 123515 — Handle and Use a Handgun."
--
-- US 123515 is a SOUTH AFRICAN SAQA unit standard. It was introduced during the
-- platform build by 004_syllabus_phase1_3.sql:42 and is NOT drawn from MJM's
-- source material: a full-text search of all three original course PDFs
-- (Armed 16hr, Private Detective 72hr, Basic Security 24hr — 92,808 words)
-- returned ZERO hits for SAQA, PSIRA, SAPS, PFTC, "unit standard", US 1xxxxx,
-- 123515, 117705, "Firearms Control Act" or "South Africa", while a control
-- search confirmed GBPDSA / 509-3 / OCGA / Georgia are present throughout.
--
-- It therefore maps to no standard this course must teach or meet, and has no
-- place on a Georgia course. Only the trailing sentence is removed; the terminal
-- ballistics teaching content is legitimate and is retained in full.
--
-- WHAT IS DELIBERATELY *NOT* TOUCHED — these are Georgia content, not foreign:
--   * Florida licence reciprocity questions — teach that a FL licence is not
--     valid in Georgia without GBPDSA licensure (022_uas_quiz.sql)
--   * All-party consent states under federal ECPA — stop a Georgia PI applying
--     Georgia's one-party rule in a state where that is a crime (012_pi_lessons_09_12.sql)
--   * Horton v. California (1990) — federal plain-view doctrine, binding in Georgia
--     (011_pi_lessons_05_08.sql)

-- ── Remove the South African unit standard reference ────────────────────────
-- Idempotent: the LIKE guard makes a re-run a no-op.
UPDATE mjm_modules
SET description = trim(regexp_replace(
  replace(description, 'Maps to US 123515 — Handle and Use a Handgun.', ''),
  '\s{2,}', ' ', 'g'
))
WHERE id = 'MOD-04'
  AND description LIKE '%US 123515%';

-- ── Verification ────────────────────────────────────────────────────────────
-- Expected: 0 rows.
--
--   SELECT id, title FROM mjm_modules
--   WHERE description ~* 'SAQA|PSIRA|PFTC|unit standard|US ?1[0-9]{5}|Firearms Control Act|South Africa';
--
-- A full sweep on 2026-09-09 across mjm_modules (64), module_lessons (393 slides)
-- and quiz_questions (329) found this to be the ONLY non-Georgia content on the
-- platform. Re-run scripts/strip-non-georgia-content.mjs (dry run) to re-verify.
