export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { generateOperatorPassword } from '@/lib/password';

interface RouteContext { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
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
  const { email } = op as { email: string };

  // Optional admin-supplied password; otherwise auto-generate.
  let custom: string | undefined;
  try {
    const body = await req.json() as { password?: string };
    custom = body?.password?.trim() || undefined;
  } catch {
    custom = undefined; // empty body is fine
  }
  if (custom !== undefined && (custom.length < 8 || custom.length > 72)) {
    return NextResponse.json({ error: 'Password must be 8–72 characters' }, { status: 400 });
  }
  const password = custom ?? generateOperatorPassword();

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabaseAdmin.from('spartan_audit_log').insert({
    operator_id: id,
    event:       'PASSWORD_SET',
    metadata:    { set_by: user.id },
  });

  return NextResponse.json({ email, password });
}
