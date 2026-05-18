export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { sendEnrollmentConfirmation } from '@/lib/email';

const VALID_TRACKS  = ['armed-security', 'private-detective', 'unarmed-security'];
const VALID_PAYMENT = ['stripe', 'manual', 'eft', 'cash', 'complimentary'];

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const selfRole = (self as { role?: string } | null)?.role ?? 'agent';
  if (!['admin', 'coordinator', 'super_admin'].includes(selfRole)) {
    return NextResponse.json({ error: 'Forbidden — coordinator or higher required' }, { status: 403 });
  }

  const body = await req.json() as {
    email: string;
    full_name: string;
    tracks: string[];
    payment_method?: string;
    notes?: string;
    promo_code?: string;
  };
  const { email, full_name, tracks, payment_method = 'manual', notes = '', promo_code } = body;

  if (!email || !full_name || !Array.isArray(tracks) || tracks.length === 0) {
    return NextResponse.json({ error: 'email, full_name, and at least one track are required' }, { status: 400 });
  }
  if (full_name.length > 255) return NextResponse.json({ error: 'full_name exceeds 255 characters' }, { status: 400 });
  if (email.length > 254) return NextResponse.json({ error: 'Invalid email length' }, { status: 400 });
  if (notes && notes.length > 2000) return NextResponse.json({ error: 'notes exceeds 2000 characters' }, { status: 400 });
  if (!tracks.every(t => VALID_TRACKS.includes(t))) {
    return NextResponse.json({ error: 'Invalid track slug' }, { status: 400 });
  }
  if (!VALID_PAYMENT.includes(payment_method)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }

  // Promo code validation
  let promoCodeRow: { id: string; uses_count: number; discount_value: number } | null = null;
  let discountApplied: number | null = null;
  const normalizedCode = promo_code ? promo_code.toUpperCase().trim() : null;
  if (normalizedCode && !/^[A-Z0-9\-]{3,32}$/.test(normalizedCode)) {
    return NextResponse.json({ error: 'Invalid promo code format' }, { status: 400 });
  }

  if (normalizedCode) {
    const { data: codeData } = await supabaseAdmin
      .from('promo_codes')
      .select('id, discount_type, discount_value, max_uses, uses_count, applicable_tracks, expires_at, is_active')
      .eq('code', normalizedCode)
      .single();

    if (!codeData) return NextResponse.json({ error: 'Promo code not found' }, { status: 400 });
    if (!codeData.is_active) return NextResponse.json({ error: 'Promo code is inactive' }, { status: 400 });
    if (codeData.expires_at && new Date(codeData.expires_at as string) < new Date()) {
      return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 });
    }
    if (codeData.max_uses !== null && (codeData.uses_count as number) >= (codeData.max_uses as number)) {
      return NextResponse.json({ error: 'Promo code has reached its usage limit' }, { status: 400 });
    }
    if (codeData.applicable_tracks !== null) {
      const invalid = tracks.filter((t: string) => !(codeData.applicable_tracks as string[]).includes(t));
      if (invalid.length > 0) {
        return NextResponse.json({ error: `Promo code not valid for: ${invalid.join(', ')}` }, { status: 400 });
      }
    }
    promoCodeRow = { id: codeData.id as string, uses_count: codeData.uses_count as number, discount_value: codeData.discount_value as number };
    discountApplied = codeData.discount_value as number;
  }

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (authError) {
    const status = authError.message.toLowerCase().includes('already') ? 409 : 500;
    return NextResponse.json({ error: authError.message }, { status });
  }
  const newUserId = authData.user.id;

  // Generate operator_id: ST-YY-NNNN
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `ST-${year}-`;
  const { data: lastOp } = await supabaseAdmin
    .from('operators')
    .select('operator_id')
    .like('operator_id', `${prefix}%`)
    .order('operator_id', { ascending: false })
    .limit(1)
    .single();
  const lastNum = lastOp
    ? parseInt((lastOp as { operator_id: string }).operator_id.split('-')[2] ?? '0')
    : 0;
  const operatorId = `${prefix}${String(lastNum + 1).padStart(4, '0')}`;

  // Insert operator profile
  const { error: opError } = await supabaseAdmin.from('operators').insert({
    id:          newUserId,
    operator_id: operatorId,
    full_name,
    email,
    track:       tracks[0],
    role:        'agent',
  });
  if (opError) {
    await supabaseAdmin.auth.admin.deleteUser(newUserId);
    return NextResponse.json({ error: opError.message }, { status: 500 });
  }

  // Insert enrollment rows (one per track)
  const enrollmentRows = tracks.map(track => ({
    operator_id:      newUserId,
    track,
    payment_method,
    enrolled_by:      user.id,
    notes:            notes || null,
    promo_code:       normalizedCode,
    discount_applied: discountApplied,
  }));
  await supabaseAdmin.from('operator_enrollments').insert(enrollmentRows);

  // Increment promo code usage count
  if (promoCodeRow) {
    await supabaseAdmin
      .from('promo_codes')
      .update({ uses_count: promoCodeRow.uses_count + 1 })
      .eq('id', promoCodeRow.id);
  }

  // Generate magic link for admin to share
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type:  'magiclink',
    email,
  });
  const magicLink = (linkData as { properties?: { action_link?: string } } | null)
    ?.properties?.action_link ?? null;

  // Enrollment confirmation email (silent if RESEND_API_KEY not set)
  try {
    await sendEnrollmentConfirmation(email, full_name, operatorId, tracks[0]);
  } catch {
    // best-effort
  }

  // Audit
  await supabaseAdmin.from('spartan_audit_log').insert({
    operator_id: newUserId,
    event:       'ENROLLMENT_COMPLETE',
    metadata:    { method: 'manual', tracks, payment_method, enrolled_by: user.id },
  });

  return NextResponse.json({ operatorId, magicLink, promoCode: normalizedCode, discountApplied });
}
