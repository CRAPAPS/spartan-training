/**
 * generate-remediation-anchors.mjs
 *
 * Produces the candidate question -> source-slide mapping used by the
 * Corrective Action Gate (docs/superpowers/specs/2026-09-08-corrective-action-gate-design.md, §4.3).
 *
 * For every CRITICAL quiz question, scores each slide in that question's own module
 * and proposes the slide that teaches the point. Emits a human review file so the
 * ambiguous rows can be corrected before the mapping is committed to migration 027.
 *
 * READ ONLY. This script never writes to the database.
 *
 * Usage:
 *   node scripts/generate-remediation-anchors.mjs
 *   node scripts/generate-remediation-anchors.mjs --track PI
 *   node scripts/generate-remediation-anchors.mjs --module MOD-02
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── env ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// ── args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const argVal = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const filterTrack  = argVal('--track');   // MOD | PI | UAS
const filterModule = argVal('--module');

// ── text scoring ─────────────────────────────────────────────────────────────
// Deliberately dumb and transparent: weighted term overlap, no ML, no API calls.
// The output is a CANDIDATE list for human review, not an authority.

const STOPWORDS = new Set([
  'the','and','for','are','but','not','you','all','any','can','her','was','one','our','out','who',
  'has','had','have','his','she','him','they','them','this','that','with','from','which','when',
  'what','were','will','would','there','their','been','than','then','into','only','other','such',
  'must','may','shall','should','could','under','while','during','before','after','above','below',
  'does','doing','done','each','more','most','some','said','also','upon','both','over','same',
  'following','because','about','against','between','through','being','these','those','where',
  'question','answer','correct','operator','officer','security','training','module','course',
  'georgia','best','describes','statement','true','false','primary','main',
]);

const tokenize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9§.\-\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3 && !STOPWORDS.has(t));

// Legal citations are the single strongest signal in this curriculum:
// "OCGA 16-3-21", "509-3-.01", "42 USC § 1983", "16-3-23.1"
const CITATION = /\b(?:\d{1,3}-\d{1,2}-[\d.]+|\d{2,3}\s*usc\s*§?\s*\d+|§\s*[\d.\-]+)\b/gi;
const citations = (s) =>
  new Set(
    (String(s ?? '').match(CITATION) ?? []).map((c) =>
      c.toLowerCase().replace(/\s+/g, '').replace(/^§/, ''),
    ),
  );

function slideText(slide) {
  return {
    heading: slide.heading ?? '',
    points: Array.isArray(slide.keyPoints) ? slide.keyPoints.join(' ') : '',
    body: [slide.body ?? '', slide.callout?.text ?? '', slide.legalRef ?? ''].join(' '),
    legalRef: slide.legalRef ?? '',
  };
}

function scoreSlide(query, slide) {
  const t = slideText(slide);
  const qTerms = new Set(query.terms);
  if (qTerms.size === 0) return { score: 0, hits: [] };

  const hits = [];
  let score = 0;

  const bucket = (text, weight, label) => {
    const seen = new Set();
    for (const term of tokenize(text)) {
      if (qTerms.has(term) && !seen.has(term)) {
        seen.add(term);
        score += weight;
        hits.push(`${label}:${term}`);
      }
    }
  };

  bucket(t.heading, 3.0, 'H');
  bucket(t.points, 2.0, 'K');
  bucket(t.body, 1.0, 'B');

  // Citation match — a shared statute reference is near-decisive.
  const slideCites = citations([t.heading, t.points, t.body].join(' '));
  for (const c of query.citations) {
    if (slideCites.has(c)) {
      score += 8.0;
      hits.push(`CITE:${c}`);
    }
  }

  // Summary / recap slides restate the whole module, so they match everything and
  // crowd out the slide that actually teaches the point. A recap is a poor thing to
  // send a learner back to. Penalise it so it only wins when nothing specific beats it.
  if (RECAP.test(t.heading)) {
    score *= 0.7;
    hits.push('RECAP-penalty');
  }

  // Normalise by query size so long questions don't outscore short ones.
  return { score: score / Math.sqrt(qTerms.size), hits };
}

const RECAP = /\b(summary|recap|review|conclusion|wrap[- ]?up|key\s+takeaway)\b/i;

function confidenceOf(top, runnerUp) {
  if (!top || top.score < 1.2) return 'LOW';
  const margin = top.score - (runnerUp?.score ?? 0);
  const decisive = top.hits.some((h) => h.startsWith('CITE:'));
  if (decisive && margin >= 0.5) return 'HIGH';
  if (top.score >= 3.0 && margin >= 1.0) return 'HIGH';
  if (top.score >= 1.8 && margin >= 0.4) return 'MEDIUM';
  return 'LOW';
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  let qy = db
    .from('quiz_questions')
    .select('id, module_id, sequence, question, topic, correct, option_a, option_b, option_c, option_d')
    .eq('is_critical', true)
    .order('module_id')
    .order('sequence');

  if (filterModule) qy = qy.eq('module_id', filterModule);

  const { data: questions, error: qErr } = await qy;
  if (qErr) throw qErr;

  let rows = questions ?? [];
  if (filterTrack) rows = rows.filter((q) => q.module_id.startsWith(`${filterTrack}-`));

  if (rows.length === 0) {
    console.error('No critical questions matched.');
    process.exit(1);
  }

  const moduleIds = [...new Set(rows.map((q) => q.module_id))];
  const { data: lessons, error: lErr } = await db
    .from('module_lessons')
    .select('module_id, slides')
    .in('module_id', moduleIds);
  if (lErr) throw lErr;

  const slidesByModule = new Map();
  for (const l of lessons ?? []) slidesByModule.set(l.module_id, l.slides ?? []);

  const results = [];

  for (const q of rows) {
    const slides = slidesByModule.get(q.module_id) ?? [];

    // The correct option carries the doctrine; weight it in with the stem and topic.
    const correctOption = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[q.correct] ?? '';
    const queryRaw = [q.topic, q.topic, q.question, correctOption].join(' ');
    const query = { terms: tokenize(queryRaw), citations: citations(queryRaw) };

    const scored = slides
      .map((s, i) => ({
        index: i,
        slideId: `${q.module_id}-s${String(i).padStart(2, '0')}`,
        heading: s.heading ?? `(slide ${i} — no heading)`,
        type: s.type ?? 'slide',
        ...scoreSlide(query, s),
      }))
      .sort((a, b) => b.score - a.score);

    const top = scored[0];
    const runnerUp = scored[1];
    const confidence = slides.length === 0 ? 'NONE' : confidenceOf(top, runnerUp);

    results.push({
      question_id: q.id,
      module_id: q.module_id,
      sequence: q.sequence,
      topic: q.topic ?? '',
      question: q.question,
      slide_count: slides.length,
      proposed_slide_id: confidence === 'NONE' ? null : top.slideId,
      proposed_heading: confidence === 'NONE' ? null : top.heading,
      score: top ? Number(top.score.toFixed(2)) : 0,
      runner_up_slide_id: runnerUp?.slideId ?? null,
      runner_up_heading: runnerUp?.heading ?? null,
      runner_up_score: runnerUp ? Number(runnerUp.score.toFixed(2)) : 0,
      matched_on: top?.hits.slice(0, 6).join(', ') ?? '',
      confidence,
    });
  }

  // ── output ──────────────────────────────────────────────────────────────────
  const outDir = resolve(ROOT, 'docs/superpowers/specs');
  mkdirSync(outDir, { recursive: true });

  const jsonPath = resolve(outDir, '2026-09-08-remediation-anchors.json');
  writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  const counts = results.reduce((a, r) => ((a[r.confidence] = (a[r.confidence] ?? 0) + 1), a), {});
  const needsReview = results.filter((r) => r.confidence !== 'HIGH');

  const md = [];
  md.push('# Remediation anchors — review list');
  md.push('');
  md.push(`**Generated:** ${new Date().toISOString().slice(0, 10)} · \`node scripts/generate-remediation-anchors.mjs\``);
  md.push(`**Critical questions:** ${results.length}`);
  md.push(`**Confidence:** HIGH ${counts.HIGH ?? 0} · MEDIUM ${counts.MEDIUM ?? 0} · LOW ${counts.LOW ?? 0} · NONE ${counts.NONE ?? 0}`);
  md.push('');
  md.push('## How to review');
  md.push('');
  md.push('Each row proposes the slide a learner is sent back to re-read after failing that critical question.');
  md.push('**A wrong anchor is worse than no anchor** — it sends the learner to unrelated material and the platform');
  md.push('then asserts they reviewed the source. If a proposal looks wrong and no better slide exists, set it to `NONE`;');
  md.push('the gate degrades to a module-overview link and still requires the written corrective action.');
  md.push('');
  md.push('Edit the **Verdict** column only:');
  md.push('');
  md.push('- `OK` — proposal is correct');
  md.push('- `<slide-id>` — wrong; use this slide instead (e.g. `PI-14-s07`)');
  md.push('- `NONE` — no single slide teaches this; ship unanchored');
  md.push('');
  md.push('`HIGH` rows are worth a skim. **`MEDIUM`, `LOW` and `NONE` rows are the ones that need you.**');
  md.push('');

  const table = (list) => {
    const out = [];
    out.push('| Verdict | Question | Module | Topic | Proposed slide | Conf | Runner-up |');
    out.push('|---|---|---|---|---|---|---|');
    for (const r of list) {
      const proposed = r.proposed_slide_id ? `\`${r.proposed_slide_id}\` ${r.proposed_heading}` : '—';
      const runner = r.runner_up_slide_id ? `\`${r.runner_up_slide_id}\` ${r.runner_up_heading} (${r.runner_up_score})` : '—';
      out.push(`| | \`${r.question_id}\` | ${r.module_id} | ${r.topic} | ${proposed} (${r.score}) | **${r.confidence}** | ${runner} |`);
    }
    return out;
  };

  md.push(`## Needs review — ${needsReview.length} rows`);
  md.push('');
  md.push(...table(needsReview));
  md.push('');
  md.push('### Question text for the rows above');
  md.push('');
  for (const r of needsReview) {
    md.push(`- \`${r.question_id}\` — ${r.question}`);
  }
  md.push('');
  md.push(`## High confidence — ${(counts.HIGH ?? 0)} rows (skim)`);
  md.push('');
  md.push(...table(results.filter((r) => r.confidence === 'HIGH')));
  md.push('');

  const mdPath = resolve(outDir, '2026-09-08-remediation-anchors-review.md');
  writeFileSync(mdPath, md.join('\n'));

  console.log(`\nCritical questions: ${results.length}`);
  console.log(`HIGH ${counts.HIGH ?? 0} · MEDIUM ${counts.MEDIUM ?? 0} · LOW ${counts.LOW ?? 0} · NONE ${counts.NONE ?? 0}`);
  console.log(`Needs your review: ${needsReview.length}`);
  console.log(`\nReview file: ${mdPath}`);
  console.log(`JSON:        ${jsonPath}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
