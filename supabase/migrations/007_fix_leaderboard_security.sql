-- Migration 007: Remove SECURITY DEFINER from operator_leaderboard view
--
-- WHY: Supabase security advisor flags SECURITY DEFINER views because they run
-- as the view owner (postgres superuser), bypassing RLS for all callers.
-- This is unnecessary here — the only caller is supabaseAdmin (service role)
-- which already bypasses RLS. Setting security_invoker = true makes the view
-- use the caller's permissions instead, which is safer and removes the advisor flag.
--
-- IMPACT: None. leaderboard/page.tsx queries via supabaseAdmin only.

ALTER VIEW public.operator_leaderboard SET (security_invoker = true);
