-- Migration: 025_practical_reports
-- PI track 66h -> 70h: three practical report-writing assignments (PR-1/PR-2/PR-3)
-- worth 4.0h total (1.3 + 1.4 + 1.3), hosted in PI-13 / PI-14 / PI-19.
-- Adds report_submissions table for in-platform report uploads.
-- Slide content for the practicals lands in 026_pi_practical_slides.

-- ── 1. Duration updates: PI track now sums to exactly 70.0 ──────────────────
UPDATE mjm_modules SET duration_hours = 3.3 WHERE id = 'PI-13';  -- was 2.0 (+1.3 PR-1)
UPDATE mjm_modules SET duration_hours = 5.4 WHERE id = 'PI-14';  -- was 4.0 (+1.4 PR-2)
UPDATE mjm_modules SET duration_hours = 3.3 WHERE id = 'PI-19';  -- was 2.0 (+1.3 PR-3)

-- ── 2. Report submissions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS report_submissions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id  UUID        NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  module_id    TEXT        NOT NULL REFERENCES mjm_modules(id),
  practical_id TEXT        NOT NULL CHECK (practical_id IN ('PR-1', 'PR-2', 'PR-3')),
  file_path    TEXT        NOT NULL,
  file_name    TEXT        NOT NULL,
  file_size    INT         NOT NULL CHECK (file_size > 0),
  mime_type    TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
  grade        TEXT        CHECK (grade IN ('pass', 'fail')),
  feedback     TEXT,
  graded_by    UUID        REFERENCES operators(id) ON DELETE SET NULL,
  graded_at    TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (operator_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_report_submissions_status ON report_submissions (status);

-- RLS: operators read their own submissions; privileged roles read all.
-- All writes go through the service role (API routes) — no INSERT/UPDATE policies,
-- matching the operator_enrollments pattern.
ALTER TABLE report_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "report_submissions_select" ON report_submissions
  FOR SELECT
  USING (
    auth.uid() = operator_id
    OR EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = auth.uid()
        AND operators.role IN ('super_admin', 'admin', 'coordinator')
    )
  );

GRANT SELECT ON report_submissions TO authenticated;
