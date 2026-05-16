-- Migration 016: operator_enrollments
-- Tracks which courses each operator has paid for / been granted access to.
-- Enables manual enrollment (EFT, cash, card-present) without Stripe.

CREATE TABLE public.operator_enrollments (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id    UUID        NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  track          TEXT        NOT NULL,
  payment_method TEXT        NOT NULL DEFAULT 'manual'
                 CHECK (payment_method IN ('stripe','manual','eft','cash','complimentary')),
  enrolled_by    UUID        REFERENCES public.operators(id),
  notes          TEXT,
  enrolled_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (operator_id, track)
);

ALTER TABLE public.operator_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enroll_select" ON public.operator_enrollments FOR SELECT USING (
  auth.uid() = operator_id
  OR public.current_operator_role() IN ('admin','coordinator','super_admin')
);

-- Backfill existing operators from their track column
INSERT INTO public.operator_enrollments (operator_id, track, payment_method, notes)
SELECT id, track, 'stripe', 'Backfilled from operators.track'
FROM public.operators
WHERE track IS NOT NULL AND track != ''
ON CONFLICT (operator_id, track) DO NOTHING;
