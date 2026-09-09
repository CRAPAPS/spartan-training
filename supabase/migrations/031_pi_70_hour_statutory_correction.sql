-- Migration: 031_pi_70_hour_statutory_correction
--
-- Corrects a MISSTATEMENT OF GEORGIA LAW in student-facing course material and in
-- two exam questions.
--
-- THE LAW
-- Ga. Comp. R. & Regs. R. 509-3-.06:
--   "Effective July 1, 2022 a minimum of seventy (70) hours of classroom instruction
--    is required for all private detective licensees and registered private detective
--    employees."
-- Source: https://www.law.cornell.edu/regulations/georgia/Ga-Comp-R-Regs-R-509-3-.06
-- Confirmed independently by MAJ Makropoulos (licensing agent) via Tristan, 2026-09-09.
--
-- THE PROBLEM
-- The platform asserted 72 hours in four places, and — worse — two exam questions
-- marked "72 hours" as the CORRECT answer. Students were being taught and tested on
-- the wrong statutory requirement. The 72-hour figure predates the July 2022 rule
-- change and came from the original MJM course material.
--
-- The PI track itself already sums to exactly 70.0h (66h instruction + 4.0h of
-- practical reports added by migration 025), so only the text was wrong.
--
-- NOT CHANGED — these 72s are correct and unrelated:
--   MOD-13-s03 / mod-13-q3  CCTV footage overwritten on a 24-72 hour cycle
--   mod-11-q5               a 72-hour reporting deadline option
--   src/app/privacy         GDPR Art. 33 breach notification within 72 hours
--
-- NARRATION WARNING: PI-01 slides 0, 1 and 5 and PI-24 slide 4 change here. Their
-- recorded audio will still say "seventy-two". Re-narrate:
--   node scripts/generate-narrations.mjs --module PI-01 --slides 0,1,5
--   node scripts/generate-narrations.mjs --module PI-24 --slides 4

-- ── 1. Slide content (PI-01 and PI-24 only) ─────────────────────────────────
-- Phrase-level replacement rather than a blanket '72'->'70', so unrelated numbers
-- in these modules cannot be caught. Idempotent: once replaced the patterns are
-- gone and the WHERE guard stops matching.
UPDATE module_lessons
SET slides = replace(replace(replace(replace(
      slides::text,
      '72 curriculum hours', '70 curriculum hours'),
      '72-hour',             '70-hour'),
      '72-Hour',             '70-Hour'),
      '72 hours',            '70 hours')::jsonb
WHERE module_id IN ('PI-01', 'PI-24')
  AND (
    slides::text LIKE '%72-hour%'
    OR slides::text LIKE '%72-Hour%'
    OR slides::text LIKE '%72 hours%'
    OR slides::text LIKE '%72 curriculum hours%'
  );

-- ── 2. Exam questions where 72 was the CORRECT answer ───────────────────────
-- Both are is_critical = false, so no corrective-action anchor is affected.

-- pi01-q3: "Georgia Admin Code 509-3-.06 establishes what requirement...?"
UPDATE quiz_questions
SET option_b = 'A mandatory 70-hour initial training curriculum',
    explanation = 'GA Admin Code 509-3-.06 mandates a 70-hour initial training curriculum for persons seeking licensure as private investigators in Georgia, effective July 1, 2022. This is the statutory basis for the MJM 2026 curriculum.'
WHERE id = 'pi01-q3';

-- pi24-q10: "...requires completion of how many hours of curriculum...?"
UPDATE quiz_questions
SET option_c = '70 hours',
    explanation = 'GA Admin Code 509-3-.06 mandates a 70-hour PI training curriculum for licensure, effective July 1, 2022. The MJM 2026 program is specifically designed to meet and document completion of these 70 required hours.'
WHERE id = 'pi24-q10';

-- ── Verification ────────────────────────────────────────────────────────────
-- 1. No 72-hour claim left in PI content (expect 0 rows each):
--      SELECT module_id FROM module_lessons
--      WHERE module_id LIKE 'PI-%'
--        AND (slides::text ILIKE '%72-hour%' OR slides::text ILIKE '%72 hours%');
--
--      SELECT id FROM quiz_questions
--      WHERE module_id LIKE 'PI-%'
--        AND (option_a || option_b || option_c || option_d || coalesce(explanation,''))
--            ILIKE '%72%';
--
-- 2. The correct answers still point at the right option (expect 70 for both):
--      SELECT id, correct,
--             CASE correct WHEN 'A' THEN option_a WHEN 'B' THEN option_b
--                          WHEN 'C' THEN option_c ELSE option_d END AS correct_text
--      FROM quiz_questions WHERE id IN ('pi01-q3', 'pi24-q10');
--
-- 3. The track still sums to 70.0 (unchanged by this migration):
--      SELECT sum(duration_hours) FROM mjm_modules WHERE track = 'private-detective';
