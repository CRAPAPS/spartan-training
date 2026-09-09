/**
 * Verifies a Cloudflare Turnstile token.
 *
 * Guards sign-in (app/actions/auth.ts) and the public application form
 * (app/api/apply/route.ts).
 *
 * DEVELOPMENT BYPASS: the production site key is domain-locked to
 * spartantraining.live, so on localhost the widget cannot issue a valid token and
 * every sign-in fails with "Security check failed" — which made it impossible to
 * test anything locally. In development the check is skipped.
 *
 * This is gated on NODE_ENV === 'development'. Next sets NODE_ENV to 'production'
 * in any built artifact, so a deployed image cannot take this path. Do NOT remove
 * that guard, and do NOT run this app with NODE_ENV=development on a public host —
 * the application form would then accept automated submissions unchecked.
 *
 * The alternative, if you would rather exercise the real code path locally, is
 * Cloudflare's documented test keys in .env.local:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
 *   TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
 */
export async function verifyTurnstile(token: string | null): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[turnstile] DEVELOPMENT — verification skipped. Never runs in a built artifact.');
    return true;
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification');
    return true;
  }
  if (!token) return false;

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  });

  if (!res.ok) {
    console.error('[turnstile] Siteverify request failed:', res.status);
    return false;
  }

  const data = await res.json() as { success: boolean };
  return data.success === true;
}
