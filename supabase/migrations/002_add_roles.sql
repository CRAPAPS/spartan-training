-- =============================================================================
-- Migration 002: Roles + Admin Access Policies
-- =============================================================================

-- Add role column to operators
ALTER TABLE public.operators
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'operator'
  CHECK (role IN ('super_admin', 'admin', 'operator'));

-- Security-definer helper — avoids infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.current_operator_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.operators WHERE id = auth.uid();
$$;

-- Drop old single-row SELECT policy and replace with role-aware version
DROP POLICY IF EXISTS "operators_select_own" ON public.operators;

CREATE POLICY "operators_select" ON public.operators
  FOR SELECT USING (
    auth.uid() = id
    OR public.current_operator_role() IN ('admin', 'super_admin')
  );

-- Admins can update any operator row; operators can only update their own
DROP POLICY IF EXISTS "operators_update_own" ON public.operators;

CREATE POLICY "operators_update" ON public.operators
  FOR UPDATE USING (
    auth.uid() = id
    OR public.current_operator_role() IN ('admin', 'super_admin')
  );

-- Admins can INSERT new operators (used by Stripe webhook via service role)
-- Service role bypasses RLS entirely, so this policy is for admin dashboard use
CREATE POLICY "admins_insert_operators" ON public.operators
  FOR INSERT WITH CHECK (
    public.current_operator_role() IN ('admin', 'super_admin')
  );

-- Admins can read the full audit log
DROP POLICY IF EXISTS "audit_insert_only" ON public.spartan_audit_log;

CREATE POLICY "audit_log_admin_select" ON public.spartan_audit_log
  FOR SELECT USING (
    public.current_operator_role() IN ('admin', 'super_admin')
  );

CREATE POLICY "audit_log_insert" ON public.spartan_audit_log
  FOR INSERT WITH CHECK (true);

-- Admins can view all progress records
CREATE POLICY "progress_admin_select" ON public.operator_progress
  FOR SELECT USING (
    auth.uid() = operator_id
    OR public.current_operator_role() IN ('admin', 'super_admin')
  );

-- =============================================================================
-- ADMIN USER SEED
-- Run AFTER creating the auth users via the Supabase Dashboard or the
-- scripts/create-admins.ts script. Replace the UUIDs below with the actual
-- auth.users IDs once created.
-- =============================================================================

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → Authentication → Users → Add User
-- 2. Create: ciso@shelinfosec.com     (role: super_admin)
-- 3. Create: tristan@thiinkvp.com     (role: admin)
-- 4. Copy the UUID for each user from the Users table
-- 5. Replace the placeholder UUIDs below and run this block

/*
INSERT INTO public.operators (id, operator_id, full_name, email, role, track)
VALUES
  ('REPLACE-WITH-CISO-UUID',    'ST-26-0001', 'SHEL INFOSEC Admin',  'ciso@shelinfosec.com',  'super_admin', 'armed-security'),
  ('REPLACE-WITH-TRISTAN-UUID', 'ST-26-0002', 'Tristan',             'tristan@thiinkvp.com',  'admin',       'armed-security')
ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role;
*/
