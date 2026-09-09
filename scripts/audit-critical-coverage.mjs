/**
 * audit-critical-coverage.mjs
 *
 * Asks one question of every critical exam item: DOES THE COURSE ACTUALLY TEACH
 * THE ANSWER, on the slide the learner is sent back to?
 *
 * A valid anchor is not the same as a taught answer. uas16-q3 has a perfectly good
 * anchor, but the fact it tests — a crowd crush kills by lateral compression
 * preventing the diaphragm expanding — appears on no UAS-16 slide. A learner can
 * critically fail on something never taught, and the corrective action gate then
 * sends them to a slide that does not contain the answer and asks them to write down
 * "the correct standard". On a GA 509 platform that is a real exposure.
 *
 * THREE COVERAGE MEASURES, because anchors cross modules:
 *   anchor  — the slide the learner is actually sent to
 *   home    — every slide in the ANCHOR's module (not the question's; a capstone
 *             question is taught elsewhere, so measuring its own module is wrong)
 *   track   — every slide in the track. If a term is missing here it is taught
 *             NOWHERE, which is a genuine content gap rather than a bad anchor.
 *
 * Matching is stem-tolerant ("prevents" matches "prevention"), because exact
 * substring matching flags inflections as missing and buries the real gaps.
 *
 * This is a SCREEN for human review, not an authority. Low coverage can mean
 * different wording. Every flagged row needs eyes.
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage:
 *   node scripts/audit-critical-coverage.mjs
 *   node scripts/audit-critical-coverage.mjs --track UAS
 */

import { readFileSync, writeFileSync } from 'fs';
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
const OUT = resolve(ROOT, 'docs/superpowers/specs/2026-09-09-critical-coverage-audit.md');

const argVal = (f) => (process.argv.includes(f) ? process.argv[process.argv.indexOf(f) + 1] : null);
const filterTrack = argVal('--track');

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
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9§.\-\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 4 && !STOP.has(t));

// Stem-tolerant: "prevents" should match "prevention". Compare on a 5-char prefix,
// which is crude but right far more often than exact substring matching.
const stem = (t) => t.slice(0, 5);
const buildIndex = (text) => new Set(
  String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(Boolean).map(stem),
);
const covered = (term, index) => index.has(stem(term));

const CITATION = /\b(?:\d{1,3}-\d{1,2}-[\d.]+|\d{2,3}\s*usc\s*§?\s*\d+|§\s*[\d.\-]+)\b/gi;
const citations = (s) =>
  new Set((String(s ?? '').match(CITATION) ?? []).map((c) => c.toLowerCase().replace(/\s+/g, '')));

const slideText = (s) =>
  [
    s.heading ?? '', s.body ?? '',
    Array.isArray(s.keyPoints) ? s.keyPoints.join(' ') : '',
    s.callout?.text ?? '', s.legalRef ?? '',
  ].join(' ');

const moduleOfSlide = (slideId) => (slideId ? slideId.replace(/-s\d+$/, '') : null);

async function main() {
  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, sequence, question, correct, option_a, option_b, option_c, option_d, explanation')
    .eq('is_critical', true)
    .order('module_id').order('sequence');

  let rows = questions ?? [];
  if (filterTrack) rows = rows.filter((q) => q.module_id.startsWith(`${filterTrack}-`));

  const { data: mods } = await db.from('mjm_modules').select('id, title, track');
  const titleBy = new Map((mods ?? []).map((m) => [m.id, m.title]));
  const trackBy = new Map((mods ?? []).map((m) => [m.id, m.track]));

  const { data: lessons } = await db.from('module_lessons').select('module_id, slides');
  const slideBy = new Map();
  const moduleTextBy = new Map();
  const trackTextBy = new Map();
  for (const l of lessons ?? []) {
    const arr = Array.isArray(l.slides) ? l.slides : [];
    arr.forEach((s, i) => slideBy.set(s.slideId ?? `${l.module_id}-s${String(i).padStart(2, '0')}`, s));
    const txt = arr.map(slideText).join(' ');
    moduleTextBy.set(l.module_id, txt);
    const tr = trackBy.get(l.module_id);
    if (tr) trackTextBy.set(tr, (trackTextBy.get(tr) ?? '') + ' ' + txt);
  }

  const moduleIndex = new Map([...moduleTextBy].map(([k, v]) => [k, buildIndex(v)]));
  const trackIndex = new Map([...trackTextBy].map(([k, v]) => [k, buildIndex(v)]));

  // Anchor source: the reviewed answers file wins; otherwise the matcher's HIGH proposal.
  const anchorOf = new Map();
  for (const a of JSON.parse(readFileSync(ANCHORS, 'utf8'))) {
    if (a.confidence === 'HIGH' && a.proposed_slide_id) anchorOf.set(a.question_id, a.proposed_slide_id);
  }
  for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
    const m = line.match(/^\s*ANSWER\s+for\s+([A-Za-z0-9_-]+)\s*:\s*(\S+)\s*$/);
    if (m) anchorOf.set(m[1], m[2].toUpperCase() === 'NONE' ? null : m[2]);
  }

  const results = [];

  for (const q of rows) {
    const correctText = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[q.correct] ?? '';
    const terms = [...new Set(tokenize(correctText))];
    const cites = citations(`${correctText} ${q.question} ${q.explanation ?? ''}`);

    const anchorId = anchorOf.get(q.id) ?? null;
    const anchor = anchorId ? slideBy.get(anchorId) : null;
    const anchorIdx = anchor ? buildIndex(slideText(anchor)) : new Set();

    // Home = the ANCHOR's module. For an unanchored question, the question's own.
    const homeModule = moduleOfSlide(anchorId) ?? q.module_id;
    const homeIdx = moduleIndex.get(homeModule) ?? new Set();
    const trackIdx = trackIndex.get(trackBy.get(q.module_id)) ?? new Set();

    const missAnchor = terms.filter((t) => !covered(t, anchorIdx));
    const missHome = terms.filter((t) => !covered(t, homeIdx));
    const missTrack = terms.filter((t) => !covered(t, trackIdx));
    const missCites = [...cites].filter(
      (c) => !(anchor ? slideText(anchor) : '').toLowerCase().replace(/\s/g, '').includes(c),
    );

    const pct = (miss) => (terms.length ? (terms.length - miss.length) / terms.length : 1);

    results.push({
      id: q.id, module: q.module_id, anchorId, homeModule,
      crossModule: !!anchorId && homeModule !== q.module_id,
      anchorHeading: anchor?.heading ?? (anchorId ? '(SLIDE NOT FOUND)' : '(unanchored)'),
      question: q.question, correctText,
      anchorCov: pct(missAnchor), homeCov: pct(missHome), trackCov: pct(missTrack),
      missAnchor, missHome, missTrack, missCites,
    });
  }

  results.sort((a, b) => a.trackCov - b.trackCov || a.anchorCov - b.anchorCov);

  const gaps = results.filter((r) => r.trackCov < 0.5);
  const weak = results.filter((r) => r.trackCov >= 0.5 && r.anchorCov < 0.4);

  const md = [];
  md.push('# Critical question coverage audit');
  md.push('');
  md.push(`**Generated:** ${new Date().toISOString().slice(0, 10)}`);
  md.push(`**Critical questions audited:** ${results.length}`);
  md.push('');
  md.push('Does the course teach the answer, on the slide the learner is sent back to?');
  md.push('');
  md.push('Coverage is the share of the CORRECT option\'s distinctive words found in the text,');
  md.push('matched on a 5-character stem so inflections count. Three measures: the **anchor** slide,');
  md.push('the anchor\'s **home** module, and the whole **track**. Low coverage can be different');
  md.push('wording rather than a real gap — every row below needs a human look.');
  md.push('');
  md.push(`- **CONTENT GAP (${gaps.length})** — under 50% of the answer's terms appear anywhere in the`);
  md.push('  whole track. The course does not teach this. A learner can critically fail on it and the');
  md.push('  gate has nowhere useful to send them. **Fix the slide content.**');
  md.push(`- **WRONG SLIDE? (${weak.length})** — the track teaches it, but under 40% of it is on the`);
  md.push('  anchored slide. Usually the anchor should move rather than the content changing.');
  md.push('');
  md.push('---');
  md.push('');

  const block = (r) => [
    `### \`${r.id}\` — ${r.module} ${titleBy.get(r.module) ?? ''}`,
    '',
    `**Q:** ${r.question}`,
    '',
    `**Correct:** ${r.correctText}`,
    '',
    `**Anchor:** \`${r.anchorId ?? 'NONE'}\` — ${r.anchorHeading}${r.crossModule ? `  _(cross-module, home ${r.homeModule})_` : ''}`,
    '',
    `**Coverage:** anchor ${Math.round(r.anchorCov * 100)}% · home module ${Math.round(r.homeCov * 100)}% · track ${Math.round(r.trackCov * 100)}%`,
    '',
    ...(r.missTrack.length ? [`**Taught NOWHERE in the track:** ${r.missTrack.map((t) => `\`${t}\``).join(', ')}`, ''] : []),
    ...(r.missAnchor.length ? [`**Not on the anchored slide:** ${r.missAnchor.map((t) => `\`${t}\``).join(', ')}`, ''] : []),
    ...(r.missCites.length ? [`**Statute in the question, absent from the slide:** ${r.missCites.join(', ')}`, ''] : []),
    '---',
    '',
  ];

  md.push(`## CONTENT GAPS — ${gaps.length}`);
  md.push('');
  if (!gaps.length) md.push('_None._\n');
  for (const r of gaps) md.push(...block(r));

  md.push(`## WRONG SLIDE? — ${weak.length}`);
  md.push('');
  if (!weak.length) md.push('_None._\n');
  for (const r of weak) md.push(...block(r));

  md.push('## Full ranking');
  md.push('');
  md.push('| Question | Module | Anchor | Anchor | Home | Track |');
  md.push('|---|---|---|---:|---:|---:|');
  for (const r of results) {
    md.push(`| \`${r.id}\` | ${r.module} | \`${r.anchorId ?? 'NONE'}\`${r.crossModule ? ' ⤴' : ''} | ${Math.round(r.anchorCov * 100)}% | ${Math.round(r.homeCov * 100)}% | ${Math.round(r.trackCov * 100)}% |`);
  }
  md.push('');

  writeFileSync(OUT, md.join('\n'));

  console.log(`Audited ${results.length} critical questions\n`);
  console.log(`CONTENT GAPS — answer taught nowhere in the track: ${gaps.length}`);
  for (const r of gaps) console.log(`   ${r.id.padEnd(13)} ${r.module.padEnd(7)} track ${String(Math.round(r.trackCov * 100)).padStart(3)}%   missing: ${r.missTrack.slice(0, 6).join(', ')}`);
  console.log(`\nWRONG SLIDE? — taught in track, thin on the anchor: ${weak.length}`);
  for (const r of weak) console.log(`   ${r.id.padEnd(13)} ${r.module.padEnd(7)} ${String(r.anchorId).padEnd(12)} anchor ${String(Math.round(r.anchorCov * 100)).padStart(3)}%  track ${Math.round(r.trackCov * 100)}%`);
  console.log(`\nReport: ${OUT}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
