export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

async function requirePrivileged(req: NextRequest) {
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

  const { data, error } = await supabaseAdmin
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, max_uses, uses_count, applicable_tracks, expires_at, is_active, notes, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await requirePrivileged(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json() as {
    code: string;
    discount_type: string;
    discount_value: number;
    max_uses?: number | null;
    applicable_tracks?: string[] | null;
    expires_at?: string | null;
    notes?: string | null;
  };

  const { code, discount_type, discount_value, max_uses = null, applicable_tracks = null, expires_at = null, notes = null } = body;

  if (!code || !discount_type || discount_value == null) {
    return NextResponse.json({ error: 'code, discount_type, and discount_value are required' }, { status: 400 });
  }
  if (!['percentage', 'fixed'].includes(discount_type)) {
    return NextResponse.json({ error: 'discount_type must be percentage or fixed' }, { status: 400 });
  }
  if (discount_value <= 0) {
    return NextResponse.json({ error: 'discount_value must be positive' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('promo_codes')
    .insert({ code: code.toUpperCase().trim(), discount_type, discount_value, max_uses, applicable_tracks, expires_at, notes, created_by: user.id })
    .select()
    .single();

  if (error) {
    const status = error.message.includes('unique') ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json(data, { status: 201 });
}
