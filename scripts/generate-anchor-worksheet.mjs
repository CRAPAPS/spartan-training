/**
 * generate-anchor-worksheet.mjs
 *
 * Builds a SELF-CONTAINED text worksheet for a training specialist who has no
 * access to the platform. For every critical question that needs a human decision,
 * it prints:
 *
 *   1. Every slide of that module, in full, each labelled with its slide id
 *   2. The exam question, all four options, and which one is correct
 *   3. The candidate slides (what the matcher proposed) and a blank to fill in
 *
 * Modules are printed once and their questions grouped under them, so a module
 * with two questions to decide does not repeat its slides.
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage:
 *   node scripts/generate-anchor-worksheet.mjs           # only rows needing review
 *   node scripts/generate-anchor-worksheet.mjs --all     # all 65 critical questions
 *
 * Requires scripts/generate-remediation-anchors.mjs to have been run first
 * (it produces the JSON this reads).
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

const INCLUDE_ALL = process.argv.includes('--all');

const ANCHORS_JSON = resolve(ROOT, 'docs/superpowers/specs/2026-09-08-remediation-anchors.json');
// Separate outputs so the full run never clobbers the short review-only worksheet.
const OUT = resolve(
  ROOT,
  INCLUDE_ALL
    ? 'docs/superpowers/specs/2026-09-08-anchor-worksheet-ALL.md'
    : 'docs/superpowers/specs/2026-09-08-anchor-worksheet.md',
);

// Fields rendered explicitly; anything else on a slide gets dumped generically so
// nothing is silently hidden from the specialist.
const KNOWN = new Set([
  'slideId', 'type', 'heading', 'body', 'keyPoints', 'legalRef', 'callout',
  'narrationUrl', 'audioUrl', 'narration', 'narrationText',
]);

function renderSlide(slide, index, moduleId) {
  const id = slide.slideId ?? `${moduleId}-s${String(index).padStart(2, '0')}`;
  const out = [];

  out.push(`#### ${id}${slide.type && slide.type !== 'slide' ? `  ·  [${slide.type}]` : ''}`);
  out.push('');
  out.push(`**${slide.heading ?? '(no heading)'}**`);
  out.push('');

  if (slide.body) {
    out.push(slide.body);
    out.push('');
  }

  if (Array.isArray(slide.keyPoints) && slide.keyPoints.length) {
    out.push('Key points:');
    for (const p of slide.keyPoints) out.push(`  - ${p}`);
    out.push('');
  }

  if (slide.legalRef) {
    out.push(`Legal reference: ${slide.legalRef}`);
    out.push('');
  }

  if (slide.callout?.text) {
    out.push(`> ${slide.callout.type ? `[${String(slide.callout.type).toUpperCase()}] ` : ''}${slide.callout.text}`);
    out.push('');
  }

  for (const [k, v] of Object.entries(slide)) {
    if (KNOWN.has(k)) continue;
    if (typeof v === 'string' && v.trim()) {
      out.push(`${k}: ${v}`);
      out.push('');
    } else if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      out.push(`${k}:`);
      for (const x of v) out.push(`  - ${x}`);
      out.push('');
    }
  }

  return out;
}

function renderQuestion(q, anchor, slides, moduleId) {
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
    const mark = letters[i] === q.correct ? '  ← CORRECT ANSWER' : '';
    out.push(`- **${letters[i]}.** ${options[i]}${mark}`);
  }
  out.push('');

  out.push('**Which slide teaches the point this question tests?**');
  out.push('');
  out.push('The matcher suggested:');
  const propHeading = slides.find((s) => s.slideId === anchor?.proposed_slide_id)?.heading ?? '';
  const runHeading = slides.find((s) => s.slideId === anchor?.runner_up_slide_id)?.heading ?? '';
  out.push(`  - 1st guess: \`${anchor?.proposed_slide_id ?? 'none'}\` — ${propHeading}`);
  out.push(`  - 2nd guess: \`${anchor?.runner_up_slide_id ?? 'none'}\` — ${runHeading}`);
  out.push('');
  out.push('Choose ONE from the slides listed above for this module. Write the slide id.');
  out.push('If no single slide genuinely teaches this point, write `NONE` — that is a valid and');
  out.push('useful answer. A wrong slide is worse than none, because the learner gets sent to');
  out.push('unrelated material and the system records that they reviewed the source.');
  out.push('');
  out.push('```');
  out.push(`ANSWER for ${q.id}:  ______________________`);
  out.push('```');
  out.push('');
  out.push(`(valid options: ${slides.map((s, i) => s.slideId ?? `${moduleId}-s${String(i).padStart(2, '0')}`).join(', ')}, or NONE)`);
  out.push('');

  return out;
}

async function main() {
  const anchors = JSON.parse(readFileSync(ANCHORS_JSON, 'utf8'));
  const wanted = anchors.filter((a) => INCLUDE_ALL || a.confidence !== 'HIGH');
  const byQuestion = new Map(anchors.map((a) => [a.question_id, a]));

  const moduleIds = [...new Set(wanted.map((a) => a.module_id))].sort();

  const { data: lessons } = await db
    .from('module_lessons')
    .select('module_id, title, slides')
    .in('module_id', moduleIds);

  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, sequence, question, topic, correct, option_a, option_b, option_c, option_d')
    .in('id', wanted.map((a) => a.question_id));

  const { data: modules } = await db
    .from('mjm_modules')
    .select('id, title, track')
    .in('id', moduleIds);

  const lessonBy = new Map((lessons ?? []).map((l) => [l.module_id, l]));
  const moduleBy = new Map((modules ?? []).map((m) => [m.id, m]));
  const questionsBy = new Map();
  for (const q of questions ?? []) {
    if (!questionsBy.has(q.module_id)) questionsBy.set(q.module_id, []);
    questionsBy.get(q.module_id).push(q);
  }

  // Slide ids are stamped by migration 027, which has not run yet. Derive the same
  // ids from position so the worksheet and the migration agree.
  for (const l of lessons ?? []) {
    if (!Array.isArray(l.slides)) continue;
    l.slides.forEach((s, i) => {
      if (!s.slideId) s.slideId = `${l.module_id}-s${String(i).padStart(2, '0')}`;
    });
  }

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
  md.push('the point they got wrong, then write down a short corrective action. As soon as they do,');
  md.push('the assessment reopens — there is no waiting period at all.');
  md.push('');
  md.push('For that to work, **every critical question needs to know which slide teaches its point.**');
  md.push('That link does not exist yet. A matching script proposed one for each question and got most');
  md.push('of them right on its own, but the ones in this document were too close to call.');
  md.push('');
  md.push('**Your task:** for each DECISION below, read the module\'s slides, read the exam question,');
  md.push('and write down the slide id of the slide a learner should be sent back to re-read.');
  md.push('');
  md.push('Everything you need is in this document. No system access is required.');
  md.push('');
  md.push('### How to answer');
  md.push('');
  md.push('- Write the slide id, e.g. `MOD-02-s01`');
  md.push('- Write `NONE` if no single slide genuinely covers it — this is a real answer, not a failure');
  md.push('- Pick the slide that **teaches the point**, not a summary slide that merely mentions it');
  md.push('- If two slides both cover it, pick the one that explains *why*, not the one that just states the rule');
  md.push('');
  md.push('---');
  md.push('');
  md.push('## Contents');
  md.push('');
  for (const mid of moduleIds) {
    const qs = questionsBy.get(mid) ?? [];
    md.push(`- **${mid}** — ${moduleBy.get(mid)?.title ?? ''} (${qs.length} decision${qs.length === 1 ? '' : 's'})`);
  }
  md.push('');
  md.push('---');
  md.push('');

  let n = 0;
  for (const mid of moduleIds) {
    const lesson = lessonBy.get(mid);
    const slides = Array.isArray(lesson?.slides) ? lesson.slides : [];
    const qs = (questionsBy.get(mid) ?? []).sort((a, b) => a.sequence - b.sequence);

    md.push(`## Module ${mid} — ${moduleBy.get(mid)?.title ?? ''}`);
    md.push('');
    md.push(`Track: ${moduleBy.get(mid)?.track ?? '—'}  ·  Slides: ${slides.length}  ·  Decisions in this module: ${qs.length}`);
    md.push('');
    md.push(`### All slides in ${mid}`);
    md.push('');
    md.push('_Read these first. Your answer must be one of these slide ids, or NONE._');
    md.push('');

    slides.forEach((s, i) => {
      md.push(...renderSlide(s, i, mid));
      md.push('---');
      md.push('');
    });

    if (slides.length === 0) {
      md.push('_No slide content found for this module._');
      md.push('');
    }

    md.push(`### Decisions for ${mid}`);
    md.push('');

    for (const q of qs) {
      q.__n = ++n;
      md.push(...renderQuestion(q, byQuestion.get(q.id), slides, mid));
      md.push('---');
      md.push('');
    }
  }

  md.push('## Answer summary');
  md.push('');
  md.push('Copy your answers here so they can be entered in one pass.');
  md.push('');
  md.push('```');
  let m = 0;
  for (const mid of moduleIds) {
    for (const q of (questionsBy.get(mid) ?? []).sort((a, b) => a.sequence - b.sequence)) {
      md.push(`${String(++m).padStart(2, ' ')}. ${q.id.padEnd(22)} -> ______________________`);
    }
  }
  md.push('```');
  md.push('');

  writeFileSync(OUT, md.join('\n'));

  console.log(`Decisions: ${wanted.length} across ${moduleIds.length} modules`);
  console.log(`Worksheet: ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
