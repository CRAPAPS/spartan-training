import { randomInt } from 'crypto';

// Unambiguous charset — excludes 0 O 1 l I to keep generated passwords easy to read/type.
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

/**
 * Cryptographically-random 12-char password, grouped as XXXX-XXXX-XXXX
 * for readability (e.g. "K7mQ9rTx4Wnp" -> "K7mQ-9rTx-4Wnp").
 * The dashes are part of the password the user types.
 */
export function generateOperatorPassword(): string {
  let raw = '';
  for (let i = 0; i < 12; i++) {
    raw += CHARSET[randomInt(CHARSET.length)];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}
