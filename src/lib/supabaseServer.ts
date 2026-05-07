import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Re-export session-aware server client from canonical utils location.
export { createClient as createServerSupabaseClient } from '@/utils/supabase/server';

// Service-role admin client — bypasses RLS.
// Use ONLY in Route Handlers for webhook processing and Hard Gate writes.
// NEVER import this in client components or expose via NEXT_PUBLIC_*.
// Database generic omitted: restore after running `npm run db:generate-types`.
export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
