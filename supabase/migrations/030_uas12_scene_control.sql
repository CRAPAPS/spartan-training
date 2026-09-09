-- Migration: 030_uas12_scene_control
-- Content fix: teach the scene-control obligation that uas12-q5 tests.
--
-- WHY
-- uas12-q5 is a CRITICAL question:
--   "A mass casualty incident occurs on your property. Law enforcement and EMS
--    are en route. Your immediate role is:"
--   correct: "Secure the perimeter, prevent additional persons from entering the
--             danger zone, and direct emergency responders upon arrival"
--
-- The coverage audit (scripts/audit-critical-coverage.mjs) found UAS-12-s00 — the
-- slide the learner is sent back to — missing "perimeter", "prevent", "entering",
-- "danger" and "arrival". The slide covers meeting responders at the entry point
-- and preserving the scene, but never teaches keeping additional people OUT of the
-- danger zone, which is the substance of the correct answer.
--
-- UAS-12-s00 remains the right anchor: it is the emergency-response role slide and
-- no other UAS-12 slide teaches scene control. Fix the content, not the anchor.
--
-- Smaller sibling of 029 (UAS-16 crush mechanism), found by the same audit.
--
-- NARRATION WARNING: UAS-12 slide 0 has recorded narration that will no longer
-- match the on-screen text. Re-narrate that slide (Admin -> Modules -> narration,
-- or narrate-all.mjs).
--
-- Appends to body rather than replacing, so it does not depend on the exact
-- existing wording. No slide is added or removed — slide ids stay stable.

UPDATE module_lessons
SET slides = jsonb_set(
      jsonb_set(
        slides,
        '{0,body}',
        to_jsonb(
          (slides->0->>'body') ||
          E'\n\nSCENE CONTROL — KEEPING PEOPLE OUT:\nOnce the immediate life-safety actions are underway, your highest-value contribution before professional responders arrive is preventing further casualties. Establish and hold a perimeter. Prevent bystanders, staff, and arriving members of the public from entering the danger zone, including people trying to reach friends or colleagues. In a mass casualty incident every person you keep out of the danger zone is a casualty that does not happen. Hold the perimeter and direct responders in at the entry point rather than attempting triage or rescue beyond your training.'
        )
      ),
      '{0,keyPoints}',
      (slides->0->'keyPoints') || to_jsonb(
        'Scene control: secure a perimeter and prevent additional persons entering the danger zone — in a mass casualty incident this matters more than anything else you can do before EMS arrives'::text
      )
    )
WHERE module_id = 'UAS-12'
  AND slides->0->>'heading' = 'The Security Officer''s Role in Emergency Response'
  AND slides->0->>'body' NOT ILIKE '%perimeter%';

-- ── Verification ────────────────────────────────────────────────────────────
-- Expected: 1 row, key_points = 6, scene_control_taught = true.
--
--   SELECT module_id,
--          slides->0->>'heading' AS heading,
--          jsonb_array_length(slides->0->'keyPoints') AS key_points,
--          (slides->0->>'body') ILIKE '%perimeter%' AS scene_control_taught
--   FROM module_lessons WHERE module_id = 'UAS-12';
--
-- Then re-run: node scripts/audit-critical-coverage.mjs
-- uas12-q5 should drop off the "WRONG SLIDE?" list.
