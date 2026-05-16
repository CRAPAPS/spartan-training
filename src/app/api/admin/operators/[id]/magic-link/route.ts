export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

interface RouteContext { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const selfRole = (self as { role?: string } | null)?.role ?? 'agent';
  if (!['admin', 'coordinator', 'super_admin'].includes(selfRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: op } = await supabaseAdmin
    .from('operators').select('email').eq('id', id).single();
  if (!op) return NextResponse.json({ error: 'Operator not found' }, { status: 404 });

  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
    type:  'magiclink',
    email: (op as { email: string }).email,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const magicLink = (linkData as { properties?: { action_link?: string } } | null)
    ?.properties?.action_link ?? null;

  return NextResponse.json({ magicLink });
}
