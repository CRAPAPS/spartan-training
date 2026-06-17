# Admin-Set Permanent Passwords Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin/coordinator give students a real, non-expiring password — both when enrolling a new operator and when resetting an existing one — and prove the password actually works for login.

**Architecture:** A shared `crypto`-based password generator feeds two paths: (1) the existing enroll route creates the auth user *with* a password instead of password-less, and (2) a new `POST /api/admin/operators/[id]/password` route calls `supabaseAdmin.auth.admin.updateUserById` to set/reset a password on an existing user. Both surface the plaintext password on-screen only. Magic links remain available on demand but are no longer auto-emailed at enrollment.

**Tech Stack:** Next.js 16 App Router (route handlers), Supabase Auth Admin API (`supabaseAdmin` service-role client), Node `crypto`, React (inline-styled client components). No test runner exists — `npm run type-check` is the per-task gate; a live sign-in test is the final acceptance gate.

---

## Context the implementer must know

- **Supabase client rule:** all server-side data + auth-admin calls use `supabaseAdmin` from `src/lib/supabaseServer.ts`. Never the publishable/anon key for server data.
- **Role gate pattern** (copy exactly from `src/app/api/admin/operators/route.ts:14-19`): fetch `operators.role` for the caller, require it be in `['admin','coordinator','super_admin']`, else 403.
- **No test framework is installed.** Do NOT add Jest/Vitest. For the pure generator, sanity-check with a one-off `node -e` command. Everything else is gated by `npm run type-check` plus the final live verification.
- **Working directory** for all commands is the git root: `spartan-app/`.
- Run `npm run type-check` from `spartan-app/` after every code task; it must print no errors.

---

## File Structure

- **Create** `src/lib/password.ts` — pure `generateOperatorPassword()` helper (shared by both paths).
- **Modify** `src/app/api/admin/operators/route.ts` — create user with password; drop auto magic-link; return `password`.
- **Modify** `src/components/admin/EnrollOperatorForm.tsx` — success screen shows password + "Copy login details".
- **Create** `src/app/api/admin/operators/[id]/password/route.ts` — set/reset password on existing operator.
- **Modify** `src/components/admin/OperatorRoster.tsx` — "Set Password" control in expanded row.

---

## Task 1: Shared password generator

**Files:**
- Create: `src/lib/password.ts`

- [ ] **Step 1: Create the generator**

```ts
// src/lib/password.ts
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
```

- [ ] **Step 2: Sanity-check the generator (no test runner available)**

Run from `spartan-app/`:
```bash
node -e "const{randomInt}=require('crypto');const C='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';function g(){let r='';for(let i=0;i<12;i++)r+=C[randomInt(C.length)];return r.slice(0,4)+'-'+r.slice(4,8)+'-'+r.slice(8,12);}const s=new Set();for(let i=0;i<5;i++){const p=g();console.log(p);if(!/^[A-Za-z2-9]{4}-[A-Za-z2-9]{4}-[A-Za-z2-9]{4}$/.test(p))throw new Error('format');if(/[0O1lI]/.test(p))throw new Error('ambiguous char');s.add(p);}if(s.size!==5)throw new Error('not unique');console.log('OK');"
```
Expected: 5 passwords printed in `XXXX-XXXX-XXXX` form, then `OK`. (This mirrors the real helper logic; it validates format, charset, and uniqueness.)

- [ ] **Step 3: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/password.ts
git commit -m "feat: add shared operator password generator"
```

---

## Task 2: Enrollment route creates user with a password

**Files:**
- Modify: `src/app/api/admin/operators/route.ts`

- [ ] **Step 1: Update imports**

Change line 4 from:
```ts
import { sendEnrollmentConfirmation, sendMagicLinkEmail } from '@/lib/email';
```
to:
```ts
import { sendEnrollmentConfirmation } from '@/lib/email';
import { generateOperatorPassword } from '@/lib/password';
```

- [ ] **Step 2: Generate the password and create the user with it**

Replace the create-user block (currently lines 77-86):
```ts
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
```
with:
```ts
  // Create Supabase auth user WITH a permanent password (no magic link needed).
  const password = generateOperatorPassword();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    const status = authError.message.toLowerCase().includes('already') ? 409 : 500;
    return NextResponse.json({ error: authError.message }, { status });
  }
  const newUserId = authData.user.id;
```

- [ ] **Step 3: Remove the magic-link generation + email block**

Delete the entire block currently at lines 137-165 (the `// Generate magic link …` comment through the `if (magicLink) { … }` email block), i.e. everything from:
```ts
  // Generate magic link — always use production URL regardless of where admin panel is running
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
```
down to and including:
```ts
  if (magicLink) {
    try {
      await sendMagicLinkEmail(email, full_name, magicLink);
    } catch {
      // best-effort
    }
  }
```
Replace that whole span with just the welcome email (keep the existing confirmation send that precedes it intact). After this edit, the only email send remaining is `sendEnrollmentConfirmation`. The post-create section should read:
```ts
  // Send enrollment confirmation (best-effort). No credentials are emailed.
  try {
    await sendEnrollmentConfirmation(email, full_name, operatorId, tracks[0]);
  } catch {
    // best-effort
  }
```
(If a duplicate `sendEnrollmentConfirmation` try/catch already exists just above the deleted block, remove the now-redundant one so it is sent exactly once.)

- [ ] **Step 4: Update the response**

Change the final return (currently line 174) from:
```ts
  return NextResponse.json({ operatorId, magicLink: wrappedLink, promoCode: normalizedCode, discountApplied });
```
to:
```ts
  return NextResponse.json({ operatorId, email, password, promoCode: normalizedCode, discountApplied });
```

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: no errors. (No unused `wrappedLink`/`magicLink`/`sendMagicLinkEmail` references should remain — if type-check or lint flags an unused symbol, delete the leftover.)

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/operators/route.ts
git commit -m "feat: enroll creates auth user with permanent password, drop auto magic-link"
```

---

## Task 3: Enroll success screen shows the password

**Files:**
- Modify: `src/components/admin/EnrollOperatorForm.tsx`

- [ ] **Step 1: Update the result interface**

Change line 20 from:
```ts
interface EnrollResult { operatorId: string; magicLink: string | null; promoCode: string | null; discountApplied: number | null }
```
to:
```ts
interface EnrollResult { operatorId: string; email: string; password: string; promoCode: string | null; discountApplied: number | null }
```

- [ ] **Step 2: Replace the `copyLink` helper with a credentials-copy helper**

Replace the `copyLink` function (currently lines 63-68):
```ts
  async function copyLink() {
    if (!result?.magicLink) return;
    await navigator.clipboard.writeText(result.magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
```
with:
```ts
  async function copyDetails() {
    if (!result) return;
    const block =
      `Spartan Training — your login\n` +
      `Sign in: https://spartantraining.live/sign-in\n` +
      `Email: ${result.email}\n` +
      `Password: ${result.password}\n` +
      `(You can change this in Settings after you log in.)`;
    await navigator.clipboard.writeText(block);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
```

- [ ] **Step 3: Replace the magic-link section of the success screen with a password section**

Replace the entire `{result.magicLink ? ( … ) : ( … )}` block (currently lines 108-138) with:
```tsx
        <div style={{ marginBottom: '16px' }}>
          <span style={monoLabel}>Temporary Password — send to student (does not expire)</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, background: 'var(--bg-elev-2)', border: '1px solid var(--border)', padding: '8px 10px', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--brass)', letterSpacing: '0.08em', wordBreak: 'break-all' }}>
                {result.password}
              </span>
            </div>
            <button
              onClick={copyDetails}
              style={{
                flexShrink: 0, padding: '8px 14px',
                background: copied ? 'var(--success)' : 'var(--bg-elev-2)',
                border: '1px solid var(--border)',
                color: copied ? '#fff' : 'var(--brass)',
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'background 200ms',
              }}
            >
              {copied ? 'Copied ✓' : 'Copy Login Details'}
            </button>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', marginTop: '6px', display: 'block' }}>
            “Copy Login Details” copies the sign-in URL, email, and password as a ready-to-send message.
          </span>
        </div>
```

- [ ] **Step 4: Update the form helper text**

Change the helper line (currently line 220-222):
```tsx
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
          A sign-in link will be generated for you to share with the student.
        </span>
```
to:
```tsx
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
          A permanent password will be generated for you to share with the student.
        </span>
```

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/EnrollOperatorForm.tsx
git commit -m "feat: show generated password + copy-login-details on enroll success"
```

---

## Task 4: Set/Reset password API route for existing operators

**Files:**
- Create: `src/app/api/admin/operators/[id]/password/route.ts`

- [ ] **Step 1: Create the route**

```ts
// src/app/api/admin/operators/[id]/password/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { generateOperatorPassword } from '@/lib/password';

interface RouteContext { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
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
    .from('operators').select('email').eq('id', id).single();
  if (!op) return NextResponse.json({ error: 'Operator not found' }, { status: 404 });
  const { email } = op as { email: string };

  // Optional admin-supplied password; otherwise auto-generate.
  let custom: string | undefined;
  try {
    const body = await req.json() as { password?: string };
    custom = body?.password?.trim() || undefined;
  } catch {
    custom = undefined; // empty body is fine
  }
  if (custom !== undefined && (custom.length < 8 || custom.length > 72)) {
    return NextResponse.json({ error: 'Password must be 8–72 characters' }, { status: 400 });
  }
  const password = custom ?? generateOperatorPassword();

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabaseAdmin.from('spartan_audit_log').insert({
    operator_id: id,
    event:       'PASSWORD_SET',
    metadata:    { set_by: user.id },
  });

  return NextResponse.json({ email, password });
}
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/admin/operators/[id]/password/route.ts"
git commit -m "feat: add set/reset password API for existing operators"
```

---

## Task 5: "Set Password" control in the Operator Roster

**Files:**
- Modify: `src/components/admin/OperatorRoster.tsx`

- [ ] **Step 1: Add state for the password flow**

After line 72 (`const [copiedId, setCopiedId] = useState<string | null>(null);`), add:
```ts
  const [pwById,        setPwById]        = useState<Record<string, string>>({});
  const [pwLoading,     setPwLoading]     = useState<string | null>(null);
  const [pwCopiedId,    setPwCopiedId]    = useState<string | null>(null);
  const [pwCustom,      setPwCustom]      = useState<Record<string, string>>({});
```

- [ ] **Step 2: Add the set-password and copy-details handlers**

After the `getLoginLink` function (currently ends line 121), add:
```ts
  async function setPassword(operatorId: string) {
    setPwLoading(operatorId);
    try {
      const custom = (pwCustom[operatorId] ?? '').trim();
      const res = await fetch(`/api/admin/operators/${operatorId}/password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom ? { password: custom } : {}),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? 'Failed to set password'); return; }
      setPwById(prev => ({ ...prev, [operatorId]: data.password as string }));
    } finally { setPwLoading(null); }
  }

  function copyLoginDetails(email: string, password: string, operatorId: string) {
    const block =
      `Spartan Training — your login\n` +
      `Sign in: https://spartantraining.live/sign-in\n` +
      `Email: ${email}\n` +
      `Password: ${password}\n` +
      `(You can change this in Settings after you log in.)`;
    navigator.clipboard.writeText(block);
    setPwCopiedId(operatorId);
    setTimeout(() => setPwCopiedId(null), 2000);
  }
```

- [ ] **Step 3: Render the Set Password control under the login-link row**

Immediately after the progress-header `</div>` that closes the login-link block (the `</div>` currently on line 299, which closes the flex row opened at line 274), insert this block:
```tsx
                  {/* Set / reset password */}
                  {isPrivileged && (
                    <div style={{ marginBottom: '12px', padding: '10px 12px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)' }}>
                      {pwById[op.id] ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
                            Password set — send to student (does not expire)
                          </span>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--brass)', letterSpacing: '0.08em' }}>{pwById[op.id]}</span>
                            <button
                              onClick={() => copyLoginDetails(op.email, pwById[op.id], op.id)}
                              style={{ padding: '4px 10px', background: pwCopiedId === op.id ? 'rgba(80,200,120,.15)' : 'var(--bg-elev-2)', border: `1px solid ${pwCopiedId === op.id ? 'var(--success)' : 'var(--border)'}`, color: pwCopiedId === op.id ? 'var(--success)' : 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                              {pwCopiedId === op.id ? 'Copied ✓' : 'Copy Login Details'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            value={pwCustom[op.id] ?? ''}
                            onChange={e => setPwCustom(prev => ({ ...prev, [op.id]: e.target.value }))}
                            placeholder="optional — type your own"
                            style={{ flex: '1 1 180px', background: 'var(--bg-elev-2)', border: '1px solid var(--border)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '6px 8px', outline: 'none' }}
                          />
                          <button
                            onClick={() => setPassword(op.id)}
                            disabled={pwLoading === op.id}
                            style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(197,160,89,.4)', color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                            {pwLoading === op.id ? 'Setting…' : 'Set Password'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
```

- [ ] **Step 4: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/OperatorRoster.tsx
git commit -m "feat: add Set Password control to operator roster"
```

---

## Task 6: Live verification (acceptance gate — must pass before declaring done)

This task does not change code. It proves the mechanism works against live Supabase using Edwin's real account so the credentials handed over are real.

**Prereqs:** `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and the anon/publishable key are available (they are in `spartan-app/.env.local`). The Supabase URL is `https://zlblxrxirhmolkzbfxva.supabase.co`.

- [ ] **Step 1: Set a password on Edwin's account and immediately sign in with it**

Create a throwaway script `verify-password.mjs` in `spartan-app/` (delete after):
```js
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env from .env.local
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);

const url     = env.NEXT_PUBLIC_SUPABASE_URL;
const service = env.SUPABASE_SERVICE_ROLE_KEY;
const anon    = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const EMAIL    = 'ecinstr4guns@gmail.com';
const PASSWORD = 'K7mQ-9rTx-4Wnp'; // example; replace with a freshly generated one if desired

const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

// Find Edwin's auth user id by email
const { data: list, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) throw listErr;
const target = list.users.find(u => u.email?.toLowerCase() === EMAIL.toLowerCase());
if (!target) throw new Error('Edwin auth user not found');

const { error: updErr } = await admin.auth.admin.updateUserById(target.id, { password: PASSWORD });
if (updErr) throw new Error('updateUserById failed: ' + updErr.message);
console.log('Password set on', EMAIL);

// Now prove login works with a fresh anon client
const pub = createClient(url, anon, { auth: { persistSession: false } });
const { data: signIn, error: signErr } = await pub.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
if (signErr) throw new Error('SIGN-IN FAILED: ' + signErr.message);
if (!signIn.session?.access_token) throw new Error('No session returned');
console.log('SIGN-IN OK — access token length', signIn.session.access_token.length);
```

Run from `spartan-app/`:
```bash
node verify-password.mjs
```
Expected output:
```
Password set on ecinstr4guns@gmail.com
SIGN-IN OK — access token length <some number > 0>
```
If `SIGN-IN FAILED` or `No session returned` appears, the feature is NOT done — stop and debug before proceeding.

- [ ] **Step 2: Clean up the throwaway script**

```bash
rm verify-password.mjs
```

- [ ] **Step 3: Hand off Edwin's working credentials**

Report to the user: Edwin's email + the password that was just verified to sign in. (Edwin was created with `email_confirm: true`, so `signInWithPassword` is not blocked by an unconfirmed email.)

---

## Self-Review (completed during plan authoring)

1. **Spec coverage:** Part 1 → Task 2; Part 2 → Task 3; Part 3 API → Task 4; Part 3 UI → Task 5; shared generator → Task 1; live verification requirement → Task 6. All spec sections mapped.
2. **Placeholder scan:** No TBD/TODO/"handle edge cases". The `K7mQ-9rTx-4Wnp` in Task 6 is a clearly-labeled example value, replaceable.
3. **Type consistency:** Enroll route returns `{ operatorId, email, password, … }` (Task 2) and `EnrollResult` consumes exactly those (Task 3). Password route returns `{ email, password }` (Task 4) and `setPassword`/`pwById` consume `data.password` (Task 5). `generateOperatorPassword()` named identically in Tasks 1, 2, 4.

---

## Notes for the implementer

- **Edwin is the live trigger.** Once Task 6 passes, the user can immediately send Edwin his working credentials — that is the real-world acceptance criterion the user stated ("the user is definitely one hundred percent going to be able to log in").
- **Do not email passwords.** Per spec decision, plaintext passwords are on-screen only.
- **Memory update after merge:** record that enrollment now issues permanent passwords and the roster has a Set Password tool, in the project memory files.
