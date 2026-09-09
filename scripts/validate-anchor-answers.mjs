/**
 * validate-anchor-answers.mjs
 *
 * Checks the source-slide answers returned by a reviewer BEFORE they are turned
 * into migration SQL. A bad anchor sends a learner to unrelated material while the
 * platform records that they reviewed the source, so every answer is verified:
 *
 *   - the question id exists and is actually a critical question
 *   - the slide id exists in THAT question's module (catches cross-module typos)
 *   - the question was one that needed review (a HIGH row answered is a deliberate override)
 *   - every row that needed review got an answer
 *
 * READ ONLY. Never writes to the database.
 *
 * Usage: node scripts/validate-anchor-answers.mjs
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

async function main() {
  const answers = [];
  for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
    const m = line.match(/^\s*ANSWER\s+for\s+([A-Za-z0-9_-]+)\s*:\s*(\S+)\s*$/);
    if (m) answers.push({ questionId: m[1], slideId: m[2] });
  }

  const anchors = JSON.parse(readFileSync(ANCHORS, 'utf8'));
  const anchorBy = new Map(anchors.map((a) => [a.question_id, a]));
  const neededReview = anchors.filter((a) => a.confidence !== 'HIGH').map((a) => a.question_id);

  const { data: questions } = await db
    .from('quiz_questions')
    .select('id, module_id, is_critical, question')
    .in('id', answers.map((a) => a.questionId));
  const questionBy = new Map((questions ?? []).map((q) => [q.id, q]));

  // Cross-module anchoring: an anchor may point at any slide in the SAME TRACK
  // from a module at or before the question's module in sequence. The learner has
  // necessarily passed those (sequential gating), so the link always resolves.
  // A later module would send them into content they have not unlocked.
  const { data: allModules } = await db
    .from('mjm_modules')
    .select('id, track, sequence_order');
  const moduleBy = new Map((allModules ?? []).map((m) => [m.id, m]));

  const { data: lessons } = await db.from('module_lessons').select('module_id, slides');

  const slideIdsBy = new Map();
  for (const l of lessons ?? []) {
    const ids = (Array.isArray(l.slides) ? l.slides : []).map(
      (s, i) => s.slideId ?? `${l.module_id}-s${String(i).padStart(2, '0')}`,
    );
    slideIdsBy.set(l.module_id, ids);
  }

  // Every slide id reachable from a given module.
  const eligibleFor = (moduleId) => {
    const m = moduleBy.get(moduleId);
    if (!m) return [];
    return (allModules ?? [])
      .filter((x) => x.track === m.track && x.sequence_order <= m.sequence_order)
      .flatMap((x) => slideIdsBy.get(x.id) ?? []);
  };

  const errors = [];
  const warnings = [];
  const ok = [];

  for (const { questionId, slideId } of answers) {
    const q = questionBy.get(questionId);

    if (!q) {
      errors.push(`${questionId} -> ${slideId}   QUESTION ID DOES NOT EXIST`);
      continue;
    }
    if (!q.is_critical) {
      errors.push(`${questionId} -> ${slideId}   question exists but is NOT critical — the gate never fires on it`);
      continue;
    }
    if (slideId.toUpperCase() === 'NONE') {
      ok.push(`${questionId} -> NONE   (ships unanchored, degrades to module overview)`);
      continue;
    }

    const slideModuleId = slideId.replace(/-s\d+$/, '');
    const slideModule = moduleBy.get(slideModuleId);
    const questionModule = moduleBy.get(q.module_id);
    const eligible = eligibleFor(q.module_id);

    if (!eligible.includes(slideId)) {
      let hint;
      if (!(slideIdsBy.get(slideModuleId) ?? []).includes(slideId)) {
        hint = `no such slide — ${slideModuleId} has ${(slideIdsBy.get(slideModuleId) ?? []).length} slides`;
      } else if (!slideModule || slideModule.track !== questionModule?.track) {
        hint = `wrong track — slide is in ${slideModule?.track ?? '?'}, question is in ${questionModule?.track ?? '?'}. A learner is not enrolled in the other track.`;
      } else if (slideModule.sequence_order > (questionModule?.sequence_order ?? 0)) {
        hint = `${slideModuleId} is position ${slideModule.sequence_order}, AFTER ${q.module_id} at ${questionModule?.sequence_order}. The learner has not unlocked it.`;
      } else {
        hint = 'not in the eligible set';
      }
      errors.push(`${questionId} -> ${slideId}   INVALID — ${hint}`);
      continue;
    }

    const a = anchorBy.get(questionId);
    if (a && a.confidence === 'HIGH') {
      warnings.push(`${questionId} -> ${slideId}   answered a HIGH row (matcher said ${a.proposed_slide_id}) — deliberate override?`);
    }
    const cross = slideModuleId !== q.module_id
      ? `   [cross-module: ${q.module_id} question -> ${slideModuleId} slide]`
      : '';
    ok.push(`${questionId} -> ${slideId}${cross}`);
  }

  const answered = new Set(answers.map((a) => a.questionId));
  const missing = neededReview.filter((id) => !answered.has(id));

  console.log(`\nAnswers supplied: ${answers.length}`);
  console.log(`Rows that needed review: ${neededReview.length}\n`);

  console.log(`VALID (${ok.length})`);
  for (const l of ok) console.log(`  ${l}`);

  if (warnings.length) {
    console.log(`\nWARNINGS (${warnings.length})`);
    for (const l of warnings) console.log(`  ${l}`);
  }

  if (errors.length) {
    console.log(`\nERRORS (${errors.length}) — must be resolved before applying`);
    for (const l of errors) console.log(`  ${l}`);
  }

  if (missing.length) {
    console.log(`\nNO ANSWER GIVEN (${missing.length}) — these ship unanchored unless answered`);
    for (const id of missing) {
      const a = anchorBy.get(id);
      console.log(`  ${id.padEnd(14)} ${String(a?.confidence).padEnd(7)} matcher proposed ${a?.proposed_slide_id}`);
      if (a?.question) console.log(`      ${a.question.slice(0, 110)}`);
    }
  }

  console.log('');
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
