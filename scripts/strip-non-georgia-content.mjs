/**
 * strip-non-georgia-content.mjs
 *
 * Removes non-Georgia jurisdiction content from live module descriptions.
 *
 * Spartan Training is accredited under Georgia Rule 509-3-.01 (GBPDSA). MOD-04's
 * description carried "Maps to US 123515 — Handle and Use a Handgun." — US 123515
 * is a SOUTH AFRICAN SAQA unit standard, set by 004_syllabus_phase1_3.sql:42.
 * It is student-visible on a Georgia course.
 *
 * NOT removed, because these ARE Georgia content and must stay:
 *   - Florida licence reciprocity questions (teaches that a FL licence is not valid in GA)
 *   - All-party consent states under ECPA (stops a GA PI applying GA law elsewhere)
 *   - Horton v. California (federal plain-view doctrine, binding in Georgia)
 *
 * Dry run by default. Pass --apply to write.
 *
 * Usage:
 *   node scripts/strip-non-georgia-content.mjs            # show what would change
 *   node scripts/strip-non-georgia-content.mjs --apply    # write it
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

const APPLY = process.argv.includes('--apply');

// Literal strings to strip, with the module they belong to.
const REMOVALS = [
  { moduleId: 'MOD-04', literal: 'Maps to US 123515 — Handle and Use a Handgun.' },
];

async function main() {
  console.log(APPLY ? '\nMODE: APPLY — writing to the live database\n' : '\nMODE: DRY RUN — nothing will be written\n');

  for (const { moduleId, literal } of REMOVALS) {
    const { data, error } = await db
      .from('mjm_modules')
      .select('id, description')
      .eq('id', moduleId)
      .single();

    if (error || !data) {
      console.log(`${moduleId}: could not read (${error?.message ?? 'not found'})`);
      continue;
    }

    if (!data.description?.includes(literal)) {
      console.log(`${moduleId}: literal not present — nothing to do (already clean)`);
      continue;
    }

    const next = data.description.replace(literal, '').replace(/\s{2,}/g, ' ').trim();

    console.log(`${moduleId} — ORIGINAL (keep this for rollback):`);
    console.log(`  ${data.description}\n`);
    console.log(`${moduleId} — AFTER:`);
    console.log(`  ${next}\n`);

    if (!APPLY) {
      console.log('  (dry run — re-run with --apply to write)\n');
      continue;
    }

    const { error: upErr } = await db
      .from('mjm_modules')
      .update({ description: next })
      .eq('id', moduleId);

    if (upErr) {
      console.log(`  WRITE FAILED: ${upErr.message}`);
      process.exit(1);
    }

    const { data: check } = await db
      .from('mjm_modules')
      .select('description')
      .eq('id', moduleId)
      .single();

    console.log(check?.description?.includes(literal)
      ? '  VERIFY FAILED — literal still present'
      : '  WRITTEN AND VERIFIED — literal is gone');
    console.log('');
  }

  // Whole-platform sweep. Descriptions are not the only student-visible surface —
  // slide bodies and quiz text are too, and slides have been edited since seeding,
  // so the migration files are not proof of what is actually live.
  const FOREIGN = /SAQA|PSIRA|\bSAPS\b|PFTC|unit standard|US ?1\d{5}|Firearms Control Act|South Africa|Handle and Use a Handgun/i;
  let total = 0;

  const { data: mods } = await db.from('mjm_modules').select('id, title, description');
  const modHits = (mods ?? []).filter((m) => FOREIGN.test(`${m.title} ${m.description}`));
  console.log(`mjm_modules   — ${mods?.length ?? 0} records, ${modHits.length} hit(s)`);
  for (const h of modHits) console.log(`    ${h.id}: ${h.title}`);
  total += modHits.length;

  const { data: lessons } = await db.from('module_lessons').select('module_id, title, slides');
  let slideHits = 0;
  for (const l of lessons ?? []) {
    (Array.isArray(l.slides) ? l.slides : []).forEach((s, i) => {
      if (FOREIGN.test(JSON.stringify(s))) {
        console.log(`    ${l.module_id} slide ${i}: ${s.heading ?? ''}`);
        slideHits++;
      }
    });
  }
  const slideCount = (lessons ?? []).reduce((n, l) => n + (Array.isArray(l.slides) ? l.slides.length : 0), 0);
  console.log(`module_lessons — ${slideCount} slides, ${slideHits} hit(s)`);
  total += slideHits;

  const { data: qs } = await db
    .from('quiz_questions')
    .select('id, module_id, question, explanation, option_a, option_b, option_c, option_d, topic');
  const qHits = (qs ?? []).filter((q) => FOREIGN.test(JSON.stringify(q)));
  console.log(`quiz_questions — ${qs?.length ?? 0} questions, ${qHits.length} hit(s)`);
  for (const h of qHits) console.log(`    ${h.id} (${h.module_id}): ${h.question?.slice(0, 90)}`);
  total += qHits.length;

  console.log(`\nTOTAL non-Georgia hits live on the platform: ${total}`);
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
