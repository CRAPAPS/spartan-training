export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

const VALID_TRACKS  = ['armed-security', 'private-detective', 'unarmed-security'];
const VALID_PAYMENT = ['stripe', 'manual', 'eft', 'cash', 'complimentary'];

interface RouteContext { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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

  const { tracks, payment_method = 'manual', notes = '' } = await req.json() as {
    tracks: string[];
    payment_method?: string;
    notes?: string;
  };

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return NextResponse.json({ error: 'tracks[] required' }, { status: 400 });
  }
  if (!tracks.every(t => VALID_TRACKS.includes(t))) {
    return NextResponse.json({ error: 'Invalid track slug' }, { status: 400 });
  }
  if (!VALID_PAYMENT.includes(payment_method)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }

  // Full replace: delete existing enrollments, re-insert
  await supabaseAdmin.from('operator_enrollments').delete().eq('operator_id', id);

  const rows = tracks.map(track => ({
    operator_id:    id,
    track,
    payment_method,
    enrolled_by:    user.id,
    notes:          notes || null,
  }));
  const { error } = await supabaseAdmin.from('operator_enrollments').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Keep operator primary track in sync
  await supabaseAdmin.from('operators').update({ track: tracks[0] }).eq('id', id);

  return NextResponse.json({ enrolledTracks: tracks });
}
