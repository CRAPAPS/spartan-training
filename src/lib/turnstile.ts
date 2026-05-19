export async function verifyTurnstile(token: string | null): Promise<boolean> {
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
