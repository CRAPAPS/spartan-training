-- ════════════════════════════════════════════════════════════════════
-- MIGRATION 005: Role Hierarchy v2
-- Four-tier access model:
--   super_admin  →  CISO — full platform control + destructive ops (CSO confirm)
--   coordinator  →  Senior oversight — read-all, advisory, module management
--   admin        →  Simple administration — account support, limited backend
--   agent        →  Field operative — training track (replaces 'operator')
-- ════════════════════════════════════════════════════════════════════

-- ── Step 1: Update CHECK constraint ──────────────────────────────────────
ALTER TABLE public.operators DROP CONSTRAINT IF EXISTS operators_role_check;

ALTER TABLE public.operators
  ADD CONSTRAINT operators_role_check
  CHECK (role IN ('super_admin', 'coordinator', 'admin', 'agent'));

-- Update column default
ALTER TABLE public.operators ALTER COLUMN role SET DEFAULT 'agent';

-- ── Step 2: Migrate existing data ────────────────────────────────────────
-- Rename 'operator' → 'agent' for all existing rows
UPDATE public.operators SET role = 'agent' WHERE role = 'operator';

-- Assign coordinators
UPDATE public.operators SET role = 'coordinator'
  WHERE email IN ('mak@palisadeintl.com', 'tristan@thiinkvp.com');

-- Confirm CISO retains super_admin (no-op, safety check)
UPDATE public.operators SET role = 'super_admin'
  WHERE email = 'ciso@shelinfosec.com';

-- ── Step 3: Rebuild helper function with new default ─────────────────────
CREATE OR REPLACE FUNCTION public.current_operator_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.operators WHERE id = auth.uid()),
    'agent'
  );
$$;

-- ── Step 4: Rebuild RLS policies ─────────────────────────────────────────

-- operators table
DROP POLICY IF EXISTS "operators_select"            ON public.operators;
DROP POLICY IF EXISTS "operators_select_v2"         ON public.operators;
DROP POLICY IF EXISTS "operators_update"            ON public.operators;
DROP POLICY IF EXISTS "operators_update_v2"         ON public.operators;
DROP POLICY IF EXISTS "admins_insert_operators"     ON public.operators;
DROP POLICY IF EXISTS "operators_insert_v2"         ON public.operators;

-- All elevated roles can SELECT all operators
DROP POLICY IF EXISTS "operators_select_v2" ON public.operators;
CREATE POLICY "operators_select_v2" ON public.operators
  FOR SELECT USING (
    auth.uid() = id
    OR public.current_operator_role() IN ('admin', 'coordinator', 'super_admin')
  );

-- super_admin and admin can UPDATE operators (coordinator is advisory — read-only on user records)
DROP POLICY IF EXISTS "operators_update_v2" ON public.operators;
CREATE POLICY "operators_update_v2" ON public.operators
  FOR UPDATE USING (
    auth.uid() = id
    OR public.current_operator_role() IN ('admin', 'super_admin')
  );

-- INSERT handled by service role (Stripe webhook) — this covers admin dashboard use
DROP POLICY IF EXISTS "operators_insert_v2" ON public.operators;
CREATE POLICY "operators_insert_v2" ON public.operators
  FOR INSERT WITH CHECK (
    public.current_operator_role() IN ('admin', 'super_admin')
  );

-- mjm_modules: elevated roles bypass the Hard Gate entirely
DROP POLICY IF EXISTS "hard_gate_module_access"     ON public.mjm_modules;
DROP POLICY IF EXISTS "hard_gate_module_access_v2"  ON public.mjm_modules;

DROP POLICY IF EXISTS "hard_gate_module_access_v2" ON public.mjm_modules;
CREATE POLICY "hard_gate_module_access_v2" ON public.mjm_modules
  FOR SELECT USING (
    -- Coordinators, admins, and super_admin see all modules without sequencing restriction
    public.current_operator_role() IN ('admin', 'coordinator', 'super_admin')
    OR (
      is_active = true
      AND (
        sequence_order = 1
        OR EXISTS (
          SELECT 1
          FROM public.operator_progress op
          JOIN public.mjm_modules prev
            ON prev.id = op.module_id
           AND prev.sequence_order = mjm_modules.sequence_order - 1
          WHERE op.operator_id = auth.uid()
            AND op.is_competent = true
        )
      )
    )
  );

-- operator_progress: agents see own; elevated roles see all
DROP POLICY IF EXISTS "progress_select_own"         ON public.operator_progress;
DROP POLICY IF EXISTS "progress_admin_select"       ON public.operator_progress;
DROP POLICY IF EXISTS "operator_progress_select_v2" ON public.operator_progress;

DROP POLICY IF EXISTS "operator_progress_select_v2" ON public.operator_progress;
CREATE POLICY "operator_progress_select_v2" ON public.operator_progress
  FOR SELECT USING (
    auth.uid() = operator_id
    OR public.current_operator_role() IN ('admin', 'coordinator', 'super_admin')
  );

-- audit log: coordinator and above can read; admin gets limited access
DROP POLICY IF EXISTS "audit_log_admin_select"  ON public.spartan_audit_log;
DROP POLICY IF EXISTS "audit_log_select_v2"     ON public.spartan_audit_log;
DROP POLICY IF EXISTS "audit_log_insert"        ON public.spartan_audit_log;
DROP POLICY IF EXISTS "audit_log_insert_v2"     ON public.spartan_audit_log;

DROP POLICY IF EXISTS "audit_log_select_v2" ON public.spartan_audit_log;
CREATE POLICY "audit_log_select_v2" ON public.spartan_audit_log
  FOR SELECT USING (
    public.current_operator_role() IN ('coordinator', 'super_admin')
  );

-- admin role gets a narrower audit view: only enrollment and auth events
DROP POLICY IF EXISTS "audit_log_admin_select_v2" ON public.spartan_audit_log;
CREATE POLICY "audit_log_admin_select_v2" ON public.spartan_audit_log
  FOR SELECT USING (
    public.current_operator_role() = 'admin'
    AND event IN ('LOGIN', 'AUTH_FAILED', 'ENROLLMENT_COMPLETE', 'MFA_ENABLED')
  );

DROP POLICY IF EXISTS "audit_log_insert_v2" ON public.spartan_audit_log;
CREATE POLICY "audit_log_insert_v2" ON public.spartan_audit_log
  FOR INSERT WITH CHECK (true);
