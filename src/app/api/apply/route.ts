export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyTurnstile } from '@/lib/turnstile';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

const TRACK_PRICES: Record<string, string> = {
  'armed-security':       process.env.STRIPE_PRICE_ARMED_SECURITY!,
  'private-detective':    process.env.STRIPE_PRICE_PI!,
  'executive-protection': process.env.STRIPE_PRICE_EP!,
};

export async function POST(req: NextRequest) {
  const formData   = await req.formData();

  const turnstileToken = formData.get('cf-turnstile-response') as string | null;
  if (!await verifyTurnstile(turnstileToken)) {
    return NextResponse.redirect(
      new URL(`/apply?error=${encodeURIComponent('Security check failed. Please try again.')}`, req.url)
    );
  }

  const email      = formData.get('email') as string;
  const fullName   = formData.get('full_name') as string;
  const track      = formData.get('track') as string ?? 'armed-security';
  const state      = formData.get('state') as string ?? '';
  const licenseNum = formData.get('license_number') as string ?? '';

  const priceId = TRACK_PRICES[track];
  if (!priceId) {
    return NextResponse.redirect(
      new URL(`/apply?error=${encodeURIComponent('Invalid track selected')}`, req.url)
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: formData.get('email') as string,
    metadata: {
      full_name:      fullName,
      track,
      state,
      license_number: licenseNum,
    },
    success_url: `${process.env.NEXTAUTH_URL}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/apply?error=${encodeURIComponent('Payment cancelled')}`,
  });

  return NextResponse.redirect(session.url!, 303);
}
