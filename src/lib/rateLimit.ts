const windows = new Map<string, number[]>();

/**
 * Sliding-window rate limiter. Returns false if the key has exceeded max
 * requests within windowMs milliseconds. In-memory; resets on restart.
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (windows.get(key) ?? []).filter(t => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  windows.set(key, hits);
  return true;
}
