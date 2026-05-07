export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

interface RouteContext { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only super_admin can change roles
  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const selfRole = (self as any)?.role ?? 'agent';
  if (selfRole !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden — super_admin required' }, { status: 403 });
  }

  // Prevent super_admin from demoting themselves
  if (id === user.id) {
    return NextResponse.json({ error: 'Cannot modify your own role' }, { status: 400 });
  }

  const { role } = await req.json();
  if (!['agent', 'admin', 'coordinator', 'super_admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('operators').update({ role }).eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
