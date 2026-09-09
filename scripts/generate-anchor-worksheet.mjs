/**
 * generate-anchor-worksheet.mjs
 *
 * Builds a SELF-CONTAINED text worksheet for a training specialist who has no
 * access to the platform. For every critical question needing a human decision:
 *
 *   1. Every slide of that question's own module, in full, labelled with its slide id
 *   2. A compact index of every OTHER slide the learner could be sent to
 *   3. The exam question, all four options, and which one is correct
 *   4. The matcher's proposals and a blank to fill in
 *
 * CROSS-MODULE ANCHORING
 * A capstone question tests material taught in earlier modules — that is what a
 * capstone is. Restricting the answer to the question's own module forces NONE on
 * exactly the questions where the gate matters most. So the eligible pool is every
 * slide in the SAME TRACK from a module at or before this one in sequence. The
 * learner has necessarily already passed those modules (sequential gating), so the
 * link is always reachable. Later modules are excluded — a learner cannot be sent
 * forward into content they have not unlocked.
 *
 * Own-module slides are printed in full; the rest are a one-line-per-slide index,
 * which keeps the document small enough to survive being emailed around.
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage:
 *   node scripts/generate-anchor-worksheet.mjs
 *   node scripts/generate-anchor-worksheet.mjs --all
 *   node scripts/generate-anchor-worksheet.mjs --only UAS-07,UAS-24
 *
 * Requires scripts/generate-remediation-anchors.mjs to have been run first.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
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

const INCLUDE_ALL = process.argv.includes('--all');

// --only MOD-01,PI-04 restricts the worksheet to named modules. Use it to re-send
// a subset: the first full run was truncated in transit by the recipient's tooling,
// which silently cost five modules' worth of decisions.
const onlyArg = process.argv[process.argv.indexOf('--only') + 1];
const ONLY = process.argv.includes('--only') && onlyArg
  ? onlyArg.split(',').map((s) => s.trim()).filter(Boolean)
  : [];

const ANCHORS_JSON = resolve(ROOT, 'docs/superpowers/specs/2026-09-08-remediation-anchors.json');

// Separate outputs so no run ever clobbers another worksheet.
// One module per file when a single module is requested. The first full worksheet
// was silently truncated in transit and cost five modules' worth of answers, so
// keep each document small enough that it cannot happen again.
const OUT = resolve(
  ROOT,
  ONLY.length === 1
    ? `docs/superpowers/specs/worksheets/2026-09-09-anchor-${ONLY[0]}.md`
    : ONLY.length
      ? 'docs/superpowers/specs/2026-09-09-anchor-worksheet-RESEND.md'
      : INCLUDE_ALL
        ? 'docs/superpowers/specs/2026-09-08-anchor-worksheet-ALL.md'
        : 'docs/superpowers/specs/2026-09-08-anchor-worksheet.md',
);

const KNOWN = new Set([
  'slideId', 'type', 'heading', 'body', 'keyPoints', 'legalRef', 'callout',
  'narrationUrl', 'audioUrl', 'narration', 'narrationText',
]);

const slideIdOf = (s, i, moduleId) => s.slideId ?? `${moduleId}-s${String(i).padStart(2, '0')}`;

function renderSlide(slide, index, moduleId) {
  const out = [];
  out.push(`#### ${slideIdOf(slide, index, moduleId)}${slide.type && slide.type !== 'slide' ? `  ·  [${slide.type}]` : ''}`);
  out.push('');
  out.push(`**${slide.heading ?? '(no heading)'}**`);
  out.push('');

  if (slide.body) { out.push(slide.body); out.push(''); }

  if (Array.isArray(slide.keyPoints) && slide.keyPoints.length) {
    out.push('Key points:');
    for (const p of slide.keyPoints) out.push(`  - ${p}`);
    out.push('');
  }
  // checklist slides hold everything in items[] — omit these and the reviewer sees
  // an empty slide and cannot choose it, which is how UAS-07-s05 was missed.
  if (Array.isArray(slide.items) && slide.items.length) {
    out.push('Checklist items:');
    for (const it of slide.items) {
      out.push(`  - **${it?.label ?? ''}** — ${it?.description ?? ''}`);
    }
    out.push('');
  }

  if (slide.legalRef) { out.push(`Legal reference: ${slide.legalRef}`); out.push(''); }
  if (slide.callout?.text) {
    out.push(`> ${slide.callout.type ? `[${String(slide.callout.type).toUpperCase()}] ` : ''}${slide.callout.text}`);
    out.push('');
  }

  for (const [k, v] of Object.entries(slide)) {
    if (KNOWN.has(k)) continue;
    if (typeof v === 'string' && v.trim()) { out.push(`${k}: ${v}`); out.push(''); }
    else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      out.push(`${k}:`);
      for (const x of v) out.push(`  - ${x}`);
      out.push('');
    }
  }
  return out;
}

function renderQuestion(q, anchor, ownSlideIds, eligibleCount) {
  const out = [];
  const letters = ['A', 'B', 'C', 'D'];
  const options = [q.option_a, q.option_b, q.option_c, q.option_d];

  out.push(`### DECISION ${q.__n}  ·  question \`${q.id}\``);
  out.push('');
  out.push(`**Topic tag:** ${q.topic ?? '(none)'}  ·  **Matcher confidence:** ${anchor?.confidence ?? 'n/a'}`);
  out.push('');
  out.push('**Exam question:**');
  out.push('');
  out.push(`> ${q.question}`);
  out.push('');
  for (let i = 0; i < 4; i++) {
    out.push(`- **${letters[i]}.** ${options[i]}${letters[i] === q.correct ? '  ← CORRECT ANSWER' : ''}`);
  }
  out.push('');
  out.push('**Which slide teaches the point this question tests?**');
  out.push('');
  out.push(`The matcher suggested \`${anchor?.proposed_slide_id ?? 'none'}\` (1st) and \`${anchor?.runner_up_slide_id ?? 'none'}\` (2nd),`);
  out.push('but it only ever looked inside this question\'s own module. You are not limited to that.');
  out.push('');
  out.push(`You may choose **any** of the ${eligibleCount} slide ids available to this module — the`);
  out.push(`${ownSlideIds.length} printed in full above, or any from the earlier-module index above them.`);
  out.push('Write `NONE` only if no slide anywhere in the eligible list teaches this point.');
  out.push('');
  out.push('```');
  out.push(`ANSWER for ${q.id}:  ______________________`);
  out.push('```');
  out.push('');
  return out;
}

async function main() {
  const anchors = JSON.parse(readFileSync(ANCHORS_JSON, 'utf8'));
  const wanted = anchors
    .filter((a) => INCLUDE_ALL || a.confidence !== 'HIGH')
    .filter((a) => ONLY.length === 0 || ONLY.includes(a.module_id));

  if (wanted.length === 0) {
    console.error(ONLY.length ? `No matching rows for --only ${ONLY.join(',')}` : 'No rows selected.');
    process.exit(1);
  }

  const moduleIds = [...new Set(wanted.map((a) => a.module_id))].sort();

  // Every module, so the eligible pool can span the track.
  const { data: allModules } = await db
    .from('mjm_modules')
    .select('id, title, track, sequence_order')
    .order('track')
    .order('sequence_order');
  const moduleBy = new Map((allModules ?? []).map((m) => [m.id, m]));

  const tracks = [...new Set(moduleIds.map((id) => moduleBy.get(id)?.track).filter(Boolean))];
  const trackModuleIds = (allModules ?? []).filter((m) => tracks.includes(m.track)).map((m) => m.id);

  const { data: lessons } = await db
    .from('module_lessons')
    .select('module_id, slides')
    .in('module_id', trackModuleIds);

  const slidesBy = new Map();
  for (const l of lessons ?? []) {
    const arr = (Array.isArray(l.slides) ? l.slides : []).map((s, i) => ({
      ...s, __id: slideIdOf(s, i, l.module_id),
    }));
    slidesBy.set(l.module_id, arr);
  }

  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, sequence, question, topic, correct, option_a, option_b, option_c, option_d')
    .in('id', wanted.map((a) => a.question_id));

  const anchorBy = new Map(anchors.map((a) => [a.question_id, a]));
  const questionsBy = new Map();
  for (const q of questions ?? []) {
    if (!questionsBy.has(q.module_id)) questionsBy.set(q.module_id, []);
    questionsBy.get(q.module_id).push(q);
  }

  // Slides a learner sitting THIS module can already reach: same track, at or
  // before this module in sequence.
  const eligibleFor = (mid) => {
    const m = moduleBy.get(mid);
    if (!m) return [];
    return (allModules ?? [])
      .filter((x) => x.track === m.track && x.sequence_order <= m.sequence_order)
      .flatMap((x) => (slidesBy.get(x.id) ?? []).map((s) => ({ ...s, __module: x.id, __moduleTitle: x.title })));
  };

  const md = [];
  md.push('# Corrective Action — Source Slide Worksheet');
  md.push('');
  md.push(`**Generated:** ${new Date().toISOString().slice(0, 10)}`);
  md.push(`**Decisions required:** ${wanted.length}`);
  md.push(`**Modules covered:** ${moduleIds.length}`);
  md.push('');
  md.push('---');
  md.push('');
  md.push('## What this document is for');
  md.push('');
  md.push('Spartan Training is replacing its 24-hour lockout. Today, if a learner gets a **critical**');
  md.push('exam question wrong, they are locked out of that assessment for a full day. That is being');
  md.push('removed. In its place, the learner must go back and re-read the specific slide that teaches');
  md.push('the point they got wrong, then write a short corrective action. As soon as they do, the');
  md.push('assessment reopens — there is no waiting period at all.');
  md.push('');
  md.push('For that to work, **every critical question needs to know which slide teaches its point.**');
  md.push('');
  md.push('**Your task:** for each DECISION below, read the slides, read the exam question, and write');
  md.push('the slide id a learner should be sent back to re-read. Everything you need is in this');
  md.push('document. No system access is required.');
  md.push('');
  md.push('### You are NOT limited to the question\'s own module');
  md.push('');
  md.push('Capstone and final-exam questions test material taught in earlier modules — that is what a');
  md.push('capstone is. So each module section gives you **two** things:');
  md.push('');
  md.push('1. **Every slide in the question\'s own module, in full text**');
  md.push('2. **An index of every earlier slide in the same track** — id and heading, one line each');
  md.push('');
  md.push('Pick from either. If the right slide is in the index and you want its full text before');
  md.push('committing, say so and it will be sent.');
  md.push('');
  md.push('Only slides from *earlier or the same* module are offered: the learner has already passed');
  md.push('those, so the link always works. They cannot be sent forward into locked content.');
  md.push('');
  md.push('### How to answer');
  md.push('');
  md.push('- Write the slide id, e.g. `PI-06-s02`');
  md.push('- Write `NONE` only if nothing in the eligible list teaches the point');
  md.push('- Pick the slide that **teaches** the point, not a summary or an overview that mentions it');
  md.push('- If two slides both cover it, pick the one that explains *why*, not the one that just states the rule');
  md.push('');
  md.push('---');
  md.push('');
  md.push('## Contents');
  md.push('');
  for (const mid of moduleIds) {
    md.push(`- **${mid}** — ${moduleBy.get(mid)?.title ?? ''} (${(questionsBy.get(mid) ?? []).length} decision(s))`);
  }
  md.push('');
  md.push('---');
  md.push('');

  let n = 0;
  for (const mid of moduleIds) {
    const own = slidesBy.get(mid) ?? [];
    const eligible = eligibleFor(mid);
    const earlier = eligible.filter((s) => s.__module !== mid);
    const qs = (questionsBy.get(mid) ?? []).sort((a, b) => a.sequence - b.sequence);
    const m = moduleBy.get(mid);

    md.push(`## Module ${mid} — ${m?.title ?? ''}`);
    md.push('');
    md.push(`Track: ${m?.track ?? '—'}  ·  Position in track: ${m?.sequence_order ?? '?'}  ·  Own slides: ${own.length}  ·  Eligible slides in total: ${eligible.length}`);
    md.push('');

    if (earlier.length) {
      md.push(`### Index — ${earlier.length} earlier slides in this track (also selectable)`);
      md.push('');
      md.push('_Id and heading only. Ask for full text of any of these if you need it._');
      md.push('');
      let lastMod = null;
      for (const s of earlier) {
        if (s.__module !== lastMod) {
          lastMod = s.__module;
          md.push('');
          md.push(`**${s.__module} — ${s.__moduleTitle}**`);
        }
        md.push(`- \`${s.__id}\` — ${s.heading ?? `(${s.type ?? 'slide'}, no heading)`}`);
      }
      md.push('');
    }

    md.push(`### All slides in ${mid} — full text`);
    md.push('');
    own.forEach((s, i) => {
      md.push(...renderSlide(s, i, mid));
      md.push('---');
      md.push('');
    });
    if (own.length === 0) { md.push('_No slide content found for this module._'); md.push(''); }

    md.push(`### Decisions for ${mid}`);
    md.push('');
    for (const q of qs) {
      q.__n = ++n;
      md.push(...renderQuestion(q, anchorBy.get(q.id), own.map((s) => s.__id), eligible.length));
      md.push('---');
      md.push('');
    }
  }

  md.push('## Answer summary');
  md.push('');
  md.push('Copy your answers here so they can be entered in one pass.');
  md.push('');
  md.push('```');
  let i = 0;
  for (const mid of moduleIds) {
    for (const q of (questionsBy.get(mid) ?? []).sort((a, b) => a.sequence - b.sequence)) {
      md.push(`${String(++i).padStart(2, ' ')}. ${q.id.padEnd(22)} -> ______________________`);
    }
  }
  md.push('```');
  md.push('');

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, md.join('\n'));

  console.log(`Decisions: ${wanted.length} across ${moduleIds.length} modules`);
  console.log(`Worksheet: ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
