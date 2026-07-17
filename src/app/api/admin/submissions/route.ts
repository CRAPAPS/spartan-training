export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

async function requirePrivileged(_req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: self } = await supabaseAdmin.from('operators').select('role').eq('id', user.id).single();
  const role = (self as { role?: string } | null)?.role ?? 'agent';
  if (!['admin', 'coordinator', 'super_admin'].includes(role)) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requirePrivileged(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: submissions, error } = await supabaseAdmin
    .from('report_submissions')
    .select('id, operator_id, module_id, practical_id, file_name, file_size, mime_type, status, grade, feedback, graded_at, submitted_at')
    .order('submitted_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Merge operator display fields
  const operatorIds = [...new Set((submissions ?? []).map(s => s.operator_id as string))];
  const { data: operators } = operatorIds.length > 0
    ? await supabaseAdmin.from('operators').select('id, operator_id, full_name').in('id', operatorIds)
    : { data: [] };
  const opMap = Object.fromEntries((operators ?? []).map(o => [o.id as string, o]));

  const merged = (submissions ?? []).map(s => ({
    ...s,
    operator_code: (opMap[s.operator_id as string] as { operator_id?: string } | undefined)?.operator_id ?? '—',
    operator_name: (opMap[s.operator_id as string] as { full_name?: string } | undefined)?.full_name ?? 'Unknown',
  }));

  return NextResponse.json(merged);
}
