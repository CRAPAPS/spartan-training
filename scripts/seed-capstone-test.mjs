/**
 * seed-capstone-test.mjs
 *
 * Unlocks the PI-24 capstone for a test operator so the CROSS-MODULE anchor path
 * can be exercised in a browser.
 *
 * WHY THIS EXISTS
 * The corrective action gate was verified end-to-end on MOD-01, but both of that
 * module's anchors point at MOD-01-s00 — a same-module link. The interesting case is
 * a capstone question anchored to a slide in an EARLIER module, which is untested.
 * PI-24's three critical questions anchor to PI-21, PI-15 and PI-05, so failing that
 * one exam exercises three different cross-module jumps at once.
 *
 * The quiz page's sequential gate only checks the IMMEDIATELY previous module, so a
 * single operator_progress row for PI-23 is all that is required.
 *
 * WRITES TO PRODUCTION. .env.local holds the live keys. This fabricates a completion
 * record for a TEST operator. Do not run it against a real student.
 *
 * Dry run by default.
 *
 * Usage:
 *   node scripts/seed-capstone-test.mjs            # show what it would do
 *   node scripts/seed-capstone-test.mjs --apply    # unlock PI-24
 *   node scripts/seed-capstone-test.mjs --undo     # remove the seeded row
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

const OPERATOR = 'ST-26-0014';   // test account
const TARGET   = 'PI-24';

// Unlocking ONLY PI-23 is not enough, and the first attempt at this test failed
// because of it. The quiz page's sequential gate checks the previous module, but so
// does the MODULE page — so a cross-module anchor into PI-21 hit PI-21's own gate,
// which checks PI-20, and redirected to /dashboard?gate=blocked. A real learner
// sitting the capstone has the whole track behind them. Seed the whole path.

const APPLY = process.argv.includes('--apply');
const UNDO  = process.argv.includes('--undo');

async function main() {
  const { data: op } = await db
    .from('operators').select('id, operator_id, full_name, role')
    .eq('operator_id', OPERATOR).single();

  if (!op) { console.error(`Operator ${OPERATOR} not found.`); process.exit(1); }
  if (op.role !== 'agent') {
    console.error(`${OPERATOR} has role '${op.role}'. Privileged roles BYPASS the gate, so the test would prove nothing.`);
    process.exit(1);
  }

  console.log(`\nOperator: ${op.operator_id}  ${op.full_name}  role=${op.role}`);

  // Every module in the target's track that comes before it.
  const { data: target } = await db.from('mjm_modules')
    .select('track, sequence_order').eq('id', TARGET).single();
  const { data: path } = await db.from('mjm_modules')
    .select('id, sequence_order')
    .eq('track', target.track)
    .lt('sequence_order', target.sequence_order)
    .order('sequence_order');
  const UNLOCK = (path ?? []).map((m) => m.id);

  if (UNDO) {
    const { error } = await db.from('operator_progress')
      .delete().eq('operator_id', op.id).in('module_id', UNLOCK);
    console.log(error
      ? `Undo failed: ${error.message}`
      : `Removed ${UNLOCK.length} seeded progress rows (${UNLOCK[0]}..${UNLOCK[UNLOCK.length - 1]}). ${TARGET} is locked again.`);
    return;
  }

  // What the learner will see once they fail the capstone.
  const { data: crits } = await db
    .from('quiz_questions')
    .select('id, sequence, question, correct, option_a, option_b, option_c, option_d, remediation_slide_id')
    .eq('module_id', TARGET).eq('is_critical', true).order('sequence');

  const anchorModules = [...new Set((crits ?? []).map(q => q.remediation_slide_id?.replace(/-s\d+$/, '')).filter(Boolean))];
  const { data: lessons } = await db.from('module_lessons').select('module_id, slides').in('module_id', anchorModules);
  const slideBy = new Map();
  for (const l of lessons ?? []) (l.slides ?? []).forEach((s, i) =>
    slideBy.set(s.slideId ?? `${l.module_id}-s${String(i).padStart(2, '0')}`, s));

  console.log(`\n${TARGET} critical questions — answer ALL of these wrong:\n`);
  for (const q of crits ?? []) {
    const correct = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[q.correct];
    const slide = slideBy.get(q.remediation_slide_id);
    console.log(`  ${q.id}  (Q${q.sequence})`);
    console.log(`    ${q.question}`);
    console.log(`    DO NOT PICK: ${String(correct).slice(0, 100)}`);
    console.log(`    -> should send you to ${q.remediation_slide_id}  [${q.remediation_slide_id?.replace(/-s\d+$/, '')}]`);
    console.log(`       "${slide?.heading ?? slide?.title ?? '(no heading)'}"\n`);
  }
  console.log('Options are shuffled per attempt, so go by the text above, not by letter.\n');

  if (!APPLY) {
    console.log(`DRY RUN — would mark ${UNLOCK.length} modules competent for ${OPERATOR}:`);
    console.log(`  ${UNLOCK.join(' ')}`);
    console.log(`\nThat is the whole ${target.track} path before ${TARGET}. The module page has its`);
    console.log('own sequential gate, so the anchored modules must be reachable too — seeding only');
    console.log('the immediately-previous module sends the learner to /dashboard?gate=blocked.');
    console.log('\nRe-run with --apply to unlock, or --undo afterwards to remove it.\n');
    return;
  }

  const now = new Date().toISOString();
  const { error } = await db.from('operator_progress').upsert(
    UNLOCK.map((moduleId) => ({
      operator_id: op.id,
      module_id: moduleId,
      status: 'completed',
      is_competent: true,
      score: 100,
      attempts: 1,
      completed_at: now,
      updated_at: now,
    })),
    { onConflict: 'operator_id,module_id' },
  );

  if (error) { console.error(`Write failed: ${error.message}`); process.exit(1); }

  console.log(`Unlocked ${UNLOCK.length} modules (${UNLOCK[0]}..${UNLOCK[UNLOCK.length - 1]}).`);
  console.log(`${OPERATOR} can now open ${TARGET} AND the modules its anchors point into.`);
  console.log(`\n  http://localhost:7473/dashboard/module/${TARGET}/quiz\n`);
  console.log(`When finished: node scripts/seed-capstone-test.mjs --undo\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
