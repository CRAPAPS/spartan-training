export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { sendMagicLinkEmail } from '@/lib/email';

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
    .from('operators').select('email, full_name').eq('id', id).single();
  if (!op) return NextResponse.json({ error: 'Operator not found' }, { status: 404 });

  const { email, full_name } = op as { email: string; full_name: string };

  const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
    type:  'magiclink',
    email,
    options: { redirectTo: 'https://spartantraining.live/auth/callback' },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const magicLink = (linkData as { properties?: { action_link?: string } } | null)
    ?.properties?.action_link ?? null;

  // Email the link directly to the operator (best-effort)
  if (magicLink) {
    try {
      await sendMagicLinkEmail(email, full_name, magicLink);
    } catch {
      // best-effort
    }
  }

  return NextResponse.json({ magicLink, emailed: !!magicLink });
}
