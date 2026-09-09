/**
 * cleanup-test-data.mjs
 *
 * Removes everything the corrective-action-gate testing left on a TEST operator.
 *
 * seed-capstone-test.mjs --undo only removes the 23 fabricated PI-01..PI-23
 * completions. Testing also produced real quiz attempts, progress rows and
 * corrective action records, and those are just as much test residue — a test
 * account showing "competent" on modules nobody sat is worse than no record at all.
 *
 * Removes, for ONE named operator:
 *   remediation_records   written during the gate walkthroughs
 *   quiz_sessions         every attempt, including the deliberate critical fails
 *   operator_progress     both the seeded completions and the genuine attempts
 *
 * Does NOT touch the operators row, enrolments, or any other account.
 *
 * WRITES TO PRODUCTION. .env.local holds the live keys. Dry run by default.
 *
 * Usage:
 *   node scripts/cleanup-test-data.mjs           # inventory only
 *   node scripts/cleanup-test-data.mjs --apply   # delete
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

// Deliberately hard-coded. This deletes training records; it must never be
// pointable at an arbitrary operator from the command line.
const OPERATOR = 'ST-26-0014';

const APPLY = process.argv.includes('--apply');

async function inventory(opId) {
  const [prog, sess, recs] = await Promise.all([
    db.from('operator_progress').select('module_id, status, is_competent').eq('operator_id', opId),
    db.from('quiz_sessions').select('id, module_id, score, critical_fail').eq('operator_id', opId),
    db.from('remediation_records').select('id, module_id, question_id').eq('operator_id', opId),
  ]);
  return {
    progress: prog.data ?? [],
    sessions: sess.data ?? [],
    records: recs.data ?? [],
  };
}

async function main() {
  const { data: op } = await db
    .from('operators').select('id, operator_id, full_name, role')
    .eq('operator_id', OPERATOR).single();

  if (!op) { console.error(`Operator ${OPERATOR} not found.`); process.exit(1); }

  console.log(`\nTarget: ${op.operator_id}  ${op.full_name}  role=${op.role}`);

  const before = await inventory(op.id);
  console.log(`\n  operator_progress    ${before.progress.length} rows`);
  console.log(`    competent: ${before.progress.filter(p => p.is_competent).map(p => p.module_id).join(' ') || 'none'}`);
  console.log(`    other:     ${before.progress.filter(p => !p.is_competent).map(p => `${p.module_id}(${p.status})`).join(' ') || 'none'}`);
  console.log(`  quiz_sessions        ${before.sessions.length} rows`);
  console.log(`    ${before.sessions.map(s => `${s.module_id}:${s.score}${s.critical_fail ? '/CF' : ''}`).join('  ') || 'none'}`);
  console.log(`  remediation_records  ${before.records.length} rows`);
  console.log(`    ${before.records.map(r => r.question_id).join('  ') || 'none'}`);

  if (!APPLY) {
    console.log(`\nDRY RUN — nothing deleted. Re-run with --apply.`);
    console.log('Enrolments and the operator record are never touched.\n');
    return;
  }

  // remediation_records first: quiz_sessions cascades to them, but deleting
  // explicitly keeps the reported counts honest rather than silently implicit.
  const r1 = await db.from('remediation_records').delete().eq('operator_id', op.id);
  if (r1.error) { console.error(`remediation_records: ${r1.error.message}`); process.exit(1); }

  const r2 = await db.from('quiz_sessions').delete().eq('operator_id', op.id);
  if (r2.error) { console.error(`quiz_sessions: ${r2.error.message}`); process.exit(1); }

  const r3 = await db.from('operator_progress').delete().eq('operator_id', op.id);
  if (r3.error) { console.error(`operator_progress: ${r3.error.message}`); process.exit(1); }

  const after = await inventory(op.id);
  console.log(`\nDeleted.`);
  console.log(`  operator_progress    ${before.progress.length} -> ${after.progress.length}`);
  console.log(`  quiz_sessions        ${before.sessions.length} -> ${after.sessions.length}`);
  console.log(`  remediation_records  ${before.records.length} -> ${after.records.length}`);

  const clean = !after.progress.length && !after.sessions.length && !after.records.length;
  console.log(clean
    ? `\n${OPERATOR} is back to a clean slate. Enrolments intact — the account still works.\n`
    : `\nSomething remains. Re-run the inventory.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
