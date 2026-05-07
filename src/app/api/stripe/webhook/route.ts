export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseServer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Disable body parsing — Stripe requires the raw body for signature verification
export const config = { api: { bodyParser: false } };

function generateOperatorId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const num  = Math.floor(1000 + Math.random() * 9000);
  return `ST-${year}-${num}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody  = await req.text();
  const sig      = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session;
    const meta     = session.metadata ?? {};
    const email    = session.customer_email ?? '';
    const fullName = meta.full_name ?? '';
    const track    = meta.track ?? 'armed-security';
    const state    = meta.state ?? '';
    const license  = meta.license_number ?? '';

    // Create the Supabase Auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError || !authUser.user) {
      console.error('[Stripe webhook] Failed to create auth user:', authError);
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
    }

    const operatorId = generateOperatorId();

    // Create the operators profile row
    await supabaseAdmin.from('operators').insert({
      id:             authUser.user.id,
      operator_id:    operatorId,
      full_name:      fullName,
      email,
      track,
      state,
      license_number: license,
      role:           'agent',
    });

    // Send a magic link so the new user can set their password
    await supabaseAdmin.auth.admin.generateLink({
      type:  'magiclink',
      email,
      options: { redirectTo: `${process.env.NEXTAUTH_URL}/dashboard` },
    });

    // Log the enrollment
    await supabaseAdmin.from('spartan_audit_log').insert({
      operator_id: authUser.user.id,
      event:       'ENROLLMENT_COMPLETE',
      metadata:    { track, operator_id: operatorId, stripe_session: session.id },
    });
  }

  return NextResponse.json({ received: true });
}
