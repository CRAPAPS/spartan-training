-- Migration: 029_uas16_crush_mechanism
-- Content fix: teach the mechanism that uas16-q3 tests.
--
-- WHY
-- uas16-q3 is a CRITICAL question:
--   "A crowd crush can kill people who are standing upright because:"
--   correct: "Lateral compression from the surrounding crowd prevents the
--             diaphragm from expanding — preventing breathing"
--
-- A coverage audit of all 65 critical questions (scripts/audit-critical-coverage.mjs,
-- 2026-09-09) found the word "diaphragm" appears NOWHERE in the entire unarmed-security
-- track, and that UAS-16-s01 — the slide a learner is sent back to — is missing
-- "lateral", "compression", "surrounding", "diaphragm", "expanding" and "breathing".
-- The only related text anywhere is "cannot breathe" in the UAS-16 scenario slide,
-- which gives the symptom and never the mechanism.
--
-- So a candidate can CRITICALLY FAIL on a fact the course never taught, and under the
-- corrective action gate would then be sent to a slide that does not contain the answer
-- and asked to write down "the correct standard". That is a GA 509 exposure, not a
-- cosmetic gap.
--
-- This adds the mechanism to the slide that already teaches crush and density. It does
-- NOT add or remove a slide — array positions are unchanged, so slide ids stay stable.
--
-- NARRATION WARNING: UAS-16 slide 1 has recorded narration that will no longer match
-- the on-screen text after this runs. Re-narrate that slide (Admin -> Modules -> narration,
-- or narrate-all.mjs) or the audio/text drift on this slide gets worse.
--
-- ORDERING: independent of 028 (the corrective action gate). This uses jsonb_set on a
-- single slide and preserves every other field, so it may be applied before or after.

UPDATE module_lessons
SET slides = jsonb_set(
      jsonb_set(
        slides,
        '{1,body}',
        to_jsonb(
          replace(
            slides->1->>'body',
            'CROWD DENSITY THRESHOLDS:',
            E'HOW A CRUSH KILLS — COMPRESSIVE ASPHYXIA:\n'
            'A crowd crush does not kill by trampling. At high density the surrounding crowd '
            'exerts sustained lateral pressure on the chest and abdomen. The diaphragm cannot '
            'expand, breathing stops, and the person suffocates while still standing upright. '
            'Victims are frequently held vertical by the crowd itself and can appear conscious '
            'and uninjured to anyone more than a few feet away. This is why you monitor density '
            'rather than waiting for visible violence, and why any person reporting that they '
            E'cannot breathe is a medical emergency and not a complaint.\n\n'
            'CROWD DENSITY THRESHOLDS:'
          )
        )
      ),
      '{1,keyPoints}',
      (slides->1->'keyPoints') || to_jsonb(
        'A crush kills by compressive asphyxia — lateral pressure stops the diaphragm expanding and victims suffocate upright, not by being trampled'::text
      )
    )
WHERE module_id = 'UAS-16'
  AND slides->1->>'heading' = 'Crowd Density, Crush Prevention & Ingress/Egress Management'
  AND slides->1->>'body' NOT ILIKE '%diaphragm%';

-- ── Verification ────────────────────────────────────────────────────────────
-- Expected: 1 row, key_points = 5, mechanism_taught = true.
--
--   SELECT module_id,
--          slides->1->>'heading' AS heading,
--          jsonb_array_length(slides->1->'keyPoints') AS key_points,
--          (slides->1->>'body') ILIKE '%diaphragm%' AS mechanism_taught
--   FROM module_lessons WHERE module_id = 'UAS-16';
--
-- Then re-run: node scripts/audit-critical-coverage.mjs
-- uas16-q3 anchor coverage should rise from 33%.
