# Design: Admin-Set Permanent Passwords (Enrollment + Reset)

**Date:** 2026-06-17
**Status:** Approved — ready for implementation plan
**Trigger:** Edwin Chaparro (`ST-26-0006`) enrolled with a magic link only. Magic links
expire (1hr) and are single-use; students who never set a passphrase create recurring
access friction. Need permanent, non-expiring credentials an admin/coordinator can hand out.

## Goal
When an admin/coordinator enrolls a student — and for students already enrolled — allow
setting a real password so the student receives working, non-expiring login credentials.
The password MUST be written into Supabase Auth and MUST work for `signInWithPassword`.

## Decisions (locked)
1. **Password creation:** auto-generate a strong password (not admin-invented) at enrollment.
   For the reset path, auto-generate by default with an optional "type your own" override.
2. **Delivery:** on-screen only (Operator ID · Email · Password + "Copy login details").
   No plaintext password is ever sent by email.
3. **First-login change:** optional. The temp password is a working credential; the existing
   Settings page lets the student change it. No forced-change flow.
4. **Emails:** keep the enrollment confirmation email; stop auto-sending the magic-link email.
   Magic link remains available on demand via Admin → Operators → Get Login Link.

## Scope

### Part 1 — Enrollment (`POST /api/admin/operators`)
- Generate a strong password server-side with Node `crypto`:
  - 12 chars from an unambiguous charset (exclude `0 O 1 l I`), grouped `XXXX-XXXX-XXXX`,
    e.g. `K7mQ-9rTx-4Wnp`. Cryptographically random (`crypto.randomInt`).
- Create the auth user WITH the password:
  `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`.
- Remove the auto magic-link generation + `sendMagicLinkEmail` call from this route.
- Keep `sendEnrollmentConfirmation` (welcome email, no credentials).
- Response shape changes: return `{ operatorId, email, password, promoCode, discountApplied }`
  (was `{ operatorId, magicLink, promoCode, discountApplied }`).
- Audit log unchanged (`ENROLLMENT_COMPLETE`).

### Part 2 — Enroll success screen (`EnrollOperatorForm.tsx`)
- `EnrollResult` interface: replace `magicLink: string | null` with `password: string`.
- Success screen shows **Operator ID · Email · Temporary Password** (mono + copy button).
- Add a **"Copy login details"** button that copies a ready-to-send block:
  ```
  Spartan Training — your login
  Sign in: https://spartantraining.live/sign-in
  Email: <email>
  Password: <password>
  (You can change this in Settings after you log in.)
  ```
- Update helper text ("a sign-in link will be generated") to reflect the password.

### Part 3 — Set/Reset Password for existing operators
- **New API route:** `POST /api/admin/operators/[id]/password`
  - Role gate: `admin` / `coordinator` / `super_admin` (same as enroll route).
  - Body: optional `password?: string`. If absent/empty → auto-generate (same generator as Part 1).
    If present → validate (min length 8, max 72 — Supabase/bcrypt limit).
  - Look up the operator's email from `operators` by `id`.
  - `supabaseAdmin.auth.admin.updateUserById(id, { password })` — writes the password hash
    into `auth.users`; this is exactly what `signInWithPassword` validates against.
  - Audit log: `PASSWORD_SET` with `{ set_by: <admin id> }`.
  - Response: `{ email, password }`.
- **Operator Roster UI (`OperatorRoster.tsx`):**
  - "Set Password" button in the expanded row, beside "Get Login Link".
  - Optional inline "or type your own" field.
  - On success, show the password + the same "Copy login details" block.

## Password generator (shared helper)
- Add `generateOperatorPassword()` to a shared module (e.g. `src/lib/password.ts`) so Part 1
  and Part 3 use the same logic.
- Charset: `ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789` (no ambiguous chars).
- 12 chars, `crypto.randomInt` per char, formatted `XXXX-XXXX-XXXX`.

## Verification (hard requirement — must pass before "done")
Prove end-to-end against LIVE Supabase (`zlblxrxirhmolkzbfxva`):
1. Call the set-password path on a real auth user (Edwin's `ST-26-0006` account).
2. Immediately `signInWithPassword({ email, password })` against the live auth endpoint.
3. Confirm a valid session is returned (access token present). If no session → NOT done.
Run this for Edwin's actual account so the final credentials handed over are real and working.

## Non-goals / out of scope
- No DB migration (passwords live in `auth.users`).
- No forced first-login password change.
- No change to the Stripe webhook enrollment path (separate, still magic-link based; blocked on Stripe).
- No email delivery of passwords.

## Correctness gate
`npm run type-check` must pass (no test suite in this repo).

## Files touched
- `src/lib/password.ts` (new) — shared generator.
- `src/app/api/admin/operators/route.ts` — Part 1.
- `src/components/admin/EnrollOperatorForm.tsx` — Part 2.
- `src/app/api/admin/operators/[id]/password/route.ts` (new) — Part 3 API.
- `src/components/admin/OperatorRoster.tsx` — Part 3 UI.
