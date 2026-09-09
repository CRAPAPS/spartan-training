/**
 * suggest-better-anchor.mjs
 *
 * For a given critical question, ranks EVERY slide the learner could be sent to
 * against the correct answer, so "should this anchor move?" is decided on evidence
 * rather than a guess.
 *
 * The eligible pool is the cross-module one: same track, module at or before the
 * question's module in sequence_order — the slides sequential gating guarantees the
 * learner has already unlocked.
 *
 * Ranking is a screen, not a verdict. Term overlap favours slides that happen to
 * reuse the answer's wording, which is not the same as teaching the point. Always
 * read the printed text before moving an anchor.
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage:
 *   node scripts/suggest-better-anchor.mjs uas12-q1 mod07-q3
 *   node scripts/suggest-better-anchor.mjs uas12-q1 --full   (print candidate bodies)
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
const ANCHORS = resolve(ROOT, 'docs/superpowers/specs/2026-09-08-remediation-anchors.json');

const FULL = process.argv.includes('--full');
const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!ids.length) { console.error('Give one or more question ids.'); process.exit(1); }

const STOP = new Set([
  'the','and','for','are','but','not','you','all','any','can','was','one','our','out','who','has',
  'had','have','his','her','she','him','they','them','this','that','with','from','which','when',
  'what','were','will','would','there','their','been','than','then','into','only','other','such',
  'must','may','shall','should','could','under','while','during','before','after','above','below',
  'does','doing','done','each','more','most','some','also','upon','both','over','same','because',
  'about','against','between','through','being','these','those','where','your','officer','security',
  'operator','georgia','unless','without','within','until','even','make','made','take','taken',
  'give','given','used','using','work','case','cases','person','persons','required','require',
  'actually','additional','potentially','including','specific','appropriate','immediately',
]);

const tokenize = (s) =>
  String(s ?? '').toLowerCase().replace(/[^a-z0-9§.\-\s]/g, ' ').split(/\s+/)
    .filter((t) => t.length > 4 && !STOP.has(t));

const stem = (t) => t.slice(0, 5);
const buildIndex = (text) => new Set(
  String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).map(stem),
);

// A `checklist` slide holds all of its content in items[] and has a `title` rather
// than a `heading`. Omit those and whole slides score as empty — see the note in
// audit-critical-coverage.mjs.
const slideText = (s) => [
  s.heading ?? '', s.title ?? '', s.body ?? '',
  Array.isArray(s.keyPoints) ? s.keyPoints.join(' ') : '',
  Array.isArray(s.items)
    ? s.items.map((i) => `${i?.label ?? ''} ${i?.description ?? ''}`).join(' ')
    : '',
  s.callout?.text ?? '', s.legalRef ?? '',
].join(' ');

async function main() {
  const { data: mods } = await db.from('mjm_modules').select('id, title, track, sequence_order');
  const modBy = new Map((mods ?? []).map((m) => [m.id, m]));

  const { data: lessons } = await db.from('module_lessons').select('module_id, slides');
  const slidesBy = new Map();
  for (const l of lessons ?? []) {
    slidesBy.set(l.module_id, (Array.isArray(l.slides) ? l.slides : []).map((s, i) => ({
      ...s, __id: s.slideId ?? `${l.module_id}-s${String(i).padStart(2, '0')}`, __module: l.module_id,
    })));
  }

  const anchorOf = new Map();
  for (const a of JSON.parse(readFileSync(ANCHORS, 'utf8'))) {
    if (a.confidence === 'HIGH' && a.proposed_slide_id) anchorOf.set(a.question_id, a.proposed_slide_id);
  }
  for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
    const m = line.match(/^\s*ANSWER\s+for\s+([A-Za-z0-9_-]+)\s*:\s*(\S+)\s*$/);
    if (m) anchorOf.set(m[1], m[2].toUpperCase() === 'NONE' ? null : m[2]);
  }

  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, question, correct, option_a, option_b, option_c, option_d, explanation')
    .in('id', ids);

  for (const qid of ids) {
    const q = (questions ?? []).find((x) => x.id === qid);
    console.log('\n' + '='.repeat(90));
    if (!q) { console.log(`${qid}: NOT FOUND`); continue; }

    const correctText = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[q.correct] ?? '';
    const terms = [...new Set(tokenize(correctText))];
    const home = modBy.get(q.module_id);

    console.log(`${qid}   [${q.module_id} — ${home?.title ?? ''}]`);
    console.log('='.repeat(90));
    console.log(`Q:       ${q.question}`);
    console.log(`CORRECT: ${correctText}`);
    if (q.explanation) console.log(`WHY:     ${q.explanation}`);
    console.log(`TERMS:   ${terms.join(', ')}`);

    const current = anchorOf.get(qid) ?? null;

    const pool = (mods ?? [])
      .filter((m) => m.track === home?.track && m.sequence_order <= (home?.sequence_order ?? 0))
      .flatMap((m) => slidesBy.get(m.id) ?? []);

    const ranked = pool.map((s) => {
      const idx = buildIndex(slideText(s));
      const hit = terms.filter((t) => idx.has(stem(t)));
      return {
        s, hits: hit.length,
        missing: terms.filter((t) => !idx.has(stem(t))),
        pct: terms.length ? hit.length / terms.length : 0,
      };
    }).sort((a, b) => b.pct - a.pct);

    console.log(`\nEligible slides: ${pool.length}   Current anchor: ${current ?? 'NONE'}`);
    console.log('\nTOP CANDIDATES');
    for (const r of ranked.slice(0, 5)) {
      const mark = r.s.__id === current ? ' <== CURRENT' : '';
      console.log(`  ${String(Math.round(r.pct * 100)).padStart(3)}%  ${r.s.__id.padEnd(12)} ${(r.s.heading ?? '(no heading)').slice(0, 62)}${mark}`);
    }

    const cur = ranked.find((r) => r.s.__id === current);
    if (cur && !ranked.slice(0, 5).some((r) => r.s.__id === current)) {
      console.log(`  ${String(Math.round(cur.pct * 100)).padStart(3)}%  ${cur.s.__id.padEnd(12)} ${(cur.s.heading ?? '').slice(0, 62)} <== CURRENT`);
    }
    if (cur) console.log(`\nCurrent anchor missing: ${cur.missing.join(', ') || '(nothing)'}`);

    if (FULL) {
      for (const r of ranked.slice(0, 3)) {
        console.log(`\n--- ${r.s.__id} : ${r.s.heading} ---`);
        if (r.s.body) console.log(r.s.body);
        for (const p of r.s.keyPoints ?? []) console.log('  - ' + p);
      }
    }
  }
  console.log('');
}

main().catch((e) => { console.error(e); process.exit(1); });
