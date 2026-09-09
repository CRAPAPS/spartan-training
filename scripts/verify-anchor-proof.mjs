/**
 * verify-anchor-proof.mjs
 *
 * validate-anchor-answers.mjs proves an anchor is STRUCTURALLY valid (the ids
 * exist, the slide is in the right module). It cannot tell you whether the chosen
 * slide actually TEACHES the question. This does the second half: it prints each
 * question next to the full text of the slide chosen for it, so the pairing can be
 * judged on evidence rather than taken on trust.
 *
 * Optionally checks that a claimed proof phrase really appears in that slide —
 * pass phrases as `<question_id>=<phrase>` arguments.
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage:
 *   node scripts/verify-anchor-proof.mjs
 *   node scripts/verify-anchor-proof.mjs --brief
 *   node scripts/verify-anchor-proof.mjs pi04-q5="one step onto private property"
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

const ANSWERS = resolve(ROOT, 'docs/superpowers/specs/2026-09-09-anchor-answers.txt');
const BRIEF = process.argv.includes('--brief');

// Optional proof phrases: question_id=phrase
const proofs = new Map();
for (const arg of process.argv.slice(2)) {
  const m = arg.match(/^([A-Za-z0-9_-]+)=(.+)$/);
  if (m) proofs.set(m[1], m[2]);
}

const slideText = (s) =>
  [
    s.heading ?? '',
    s.body ?? '',
    Array.isArray(s.keyPoints) ? s.keyPoints.join(' ') : '',
    s.callout?.text ?? '',
    s.legalRef ?? '',
  ].join(' ');

async function main() {
  const answers = [];
  for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
    const m = line.match(/^\s*ANSWER\s+for\s+([A-Za-z0-9_-]+)\s*:\s*(\S+)\s*$/);
    if (m) answers.push({ questionId: m[1], slideId: m[2] });
  }

  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, question, correct, option_a, option_b, option_c, option_d')
    .in('id', answers.map((a) => a.questionId));
  const qBy = new Map((questions ?? []).map((q) => [q.id, q]));

  // Anchors cross modules, so the slides we need are NOT only those of the
  // questions' own modules — load the anchor modules too, derived from the ids.
  const anchorModules = answers
    .map((a) => a.slideId.replace(/-s\d+$/, ''))
    .filter((m) => m && m.toUpperCase() !== 'NONE');
  const moduleIds = [...new Set([
    ...(questions ?? []).map((q) => q.module_id),
    ...anchorModules,
  ])];

  const { data: lessons } = await db
    .from('module_lessons')
    .select('module_id, slides')
    .in('module_id', moduleIds);

  const slideBy = new Map();
  for (const l of lessons ?? []) {
    (Array.isArray(l.slides) ? l.slides : []).forEach((s, i) => {
      slideBy.set(s.slideId ?? `${l.module_id}-s${String(i).padStart(2, '0')}`, s);
    });
  }

  let proofPass = 0;
  let proofFail = 0;

  for (const { questionId, slideId } of answers) {
    const q = qBy.get(questionId);
    console.log('\n' + '='.repeat(78));
    console.log(`${questionId}  ->  ${slideId}`);
    console.log('='.repeat(78));

    if (!q) { console.log('  question not found'); continue; }

    console.log(`Q: ${q.question}`);
    const correctText = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[q.correct];
    console.log(`CORRECT (${q.correct}): ${correctText}\n`);

    if (slideId.toUpperCase() === 'NONE') {
      console.log('  -> NONE (unanchored; degrades to module overview)');
      continue;
    }

    const s = slideBy.get(slideId);
    if (!s) { console.log(`  slide ${slideId} NOT FOUND`); continue; }

    console.log(`SLIDE: ${s.heading ?? '(no heading)'}`);
    if (!BRIEF) {
      if (s.body) console.log(`  ${s.body}`);
      if (Array.isArray(s.keyPoints)) for (const p of s.keyPoints) console.log(`  - ${p}`);
      if (s.legalRef) console.log(`  legalRef: ${s.legalRef}`);
      if (s.callout?.text) console.log(`  ! ${s.callout.text}`);
    }

    const phrase = proofs.get(questionId);
    if (phrase) {
      const hit = slideText(s).toLowerCase().includes(phrase.toLowerCase());
      console.log(`\n  PROOF "${phrase}" -> ${hit ? 'CONFIRMED in this slide' : 'NOT PRESENT in this slide'}`);
      if (hit) proofPass++; else proofFail++;
    }
  }

  if (proofs.size) {
    console.log(`\n${'='.repeat(78)}`);
    console.log(`Proof phrases checked: ${proofs.size} — confirmed ${proofPass}, not present ${proofFail}`);
  }
  console.log('');
}

main().catch((e) => { console.error(e); process.exit(1); });
