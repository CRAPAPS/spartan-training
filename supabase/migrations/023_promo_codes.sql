-- Migration: 023_promo_codes
-- Discount / promo code system (pre-Stripe)
-- Future: add stripe_coupon_id TEXT when Stripe integration lands

CREATE TABLE IF NOT EXISTS promo_codes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT        UNIQUE NOT NULL,
  discount_type     TEXT        NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value    NUMERIC     NOT NULL CHECK (discount_value > 0),
  max_uses          INT         DEFAULT NULL,          -- NULL = unlimited
  uses_count        INT         NOT NULL DEFAULT 0,
  applicable_tracks TEXT[]      DEFAULT NULL,          -- NULL = valid for all tracks
  expires_at        TIMESTAMPTZ DEFAULT NULL,
  is_active         BOOL        NOT NULL DEFAULT true,
  notes             TEXT,
  created_by        UUID        REFERENCES operators(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add promo tracking columns to operator_enrollments
ALTER TABLE operator_enrollments
  ADD COLUMN IF NOT EXISTS promo_code      TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS discount_applied NUMERIC DEFAULT NULL;

-- RLS: only privileged roles can manage promo codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "privileged_full_access_promo_codes" ON promo_codes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = auth.uid()
        AND operators.role IN ('super_admin', 'admin', 'coordinator')
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON promo_codes TO authenticated;
