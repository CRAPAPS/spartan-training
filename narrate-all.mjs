/**
 * narrate-all.mjs
 * Batch narration with 3-voice rotation: MOD-02 → MOD-16, PI-01 → PI-24
 *
 * Voice assignment:
 *   - Scenario slides  → Bella  (always, regardless of module)
 *   - Checklist slides → Brian  (always, regardless of module)
 *   - Regular slides   → module base voice, rotating Eric → Bella → Brian per module
 *
 * MOD base voice rotation (MOD-02 = index 0):
 *   MOD-02 Eric | MOD-03 Bella | MOD-04 Brian | MOD-05 Eric | ...
 *
 * PI base voice rotation (PI-01 = index 0):
 *   PI-01 Eric | PI-02 Bella | PI-03 Brian | PI-04 Eric | ...
 *
 * Usage:
 *   node narrate-all.mjs                         — skip slides already narrated
 *   node narrate-all.mjs --force                 — redo ALL slides
 *   node narrate-all.mjs --force MOD-03 PI-01    — force only listed modules
 *
 * Run from spartan-app/: node narrate-all.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Credentials ──────────────────────────────────────────────────────────────
const SUPABASE_URL   = 'https://zlblxrxirhmolkzbfxva.supabase.co';
const SUPABASE_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYmx4cnhpcmhtb2xremJmeHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU4MjgyNiwiZXhwIjoyMDkzMTU4ODI2fQ.ubjreS8MP9YDl1hqcmdHD9hRKXK8m-5FyGSf4QvC5ZE';
const ELEVENLABS_KEY = 'sk_d08813fb5fa58029cefe280034730c11ed94ddf66d4e4a0d';

const VOICE_ERIC  = 'cjVigY5qzO86Huf0OWal';   // Eric  — regular slides (rotating)
const VOICE_BELLA = 'EXAVITQu4vr4xnSDxMaL';   // Bella — scenarios + MOD-03/06/09/12/15
const VOICE_BRIAN = 'nPczCjzI2devNBz1zQrb';   // Brian — checklists + MOD-04/07/10/13/16

const MODULE_VOICES = ['Eric', 'Bella', 'Brian']; // cycling order
const VOICE_MAP = { Eric: VOICE_ERIC, Bella: VOICE_BELLA, Brian: VOICE_BRIAN };

const TRANSCRIPT_FILE    = path.join(__dirname, '..', 'SLIDE_TRANSCRIPTS_FOR_TTS.txt');
const TRANSCRIPT_FILE_PI = path.join(__dirname, '..', 'SLIDE_TRANSCRIPTS_FOR_TTS_PI.txt');

const admin = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

// ── Voice selection ──────────────────────────────────────────────────────────
function getModuleVoice(moduleId) {
  if (moduleId.startsWith('PI-')) {
    const num = parseInt(moduleId.replace('PI-', ''), 10);
    return MODULE_VOICES[(num - 1) % 3]; // PI-01=Eric, PI-02=Bella, PI-03=Brian
  }
  // MOD-02 = index 0, MOD-03 = index 1, ... MOD-16 = index 14
  const num = parseInt(moduleId.replace('MOD-', ''), 10);
  return MODULE_VOICES[(num - 2) % 3];
}

function pickVoice(text, moduleId) {
  const t = text.trim();
  if (t.startsWith('Scenario.') || t.startsWith('Scenario:')) return VOICE_BELLA;
  if (t.startsWith('Checklist items follow')) return VOICE_BRIAN;
  return VOICE_MAP[getModuleVoice(moduleId)];
}

function voiceName(id) {
  if (id === VOICE_ERIC)  return 'Eric';
  if (id === VOICE_BELLA) return 'Bella';
  return 'Brian';
}

// ── ElevenLabs TTS ───────────────────────────────────────────────────────────
async function generateAudio(text, voiceId, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1.0 },
        }),
      });

      if (res.status === 429) {
        const wait = 15000 * attempt;
        console.log(`    Rate limited — waiting ${wait / 1000}s (attempt ${attempt}/${retries})`);
        await sleep(wait);
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`ElevenLabs ${res.status}: ${err}`);
      }

      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(3000 * attempt);
    }
  }
}

// ── Upload + patch JSONB ─────────────────────────────────────────────────────
async function uploadAndPatch(moduleId, slideIndex, audioBuffer) {
  const storagePath = `${moduleId}/${slideIndex}.mp3`;

  const { error: uploadErr } = await admin.storage
    .from('lesson-narrations')
    .upload(storagePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

  if (uploadErr) throw new Error(`Storage: ${uploadErr.message}`);

  const { data: { publicUrl } } = admin.storage
    .from('lesson-narrations')
    .getPublicUrl(storagePath);

  const { data: lesson, error: fetchErr } = await admin
    .from('module_lessons')
    .select('slides')
    .eq('module_id', moduleId)
    .single();

  if (fetchErr || !lesson) throw new Error(`DB fetch failed for ${moduleId}`);

  const slides = lesson.slides;
  const updated = slides.map((s, i) =>
    i === slideIndex ? { ...s, narrationUrl: publicUrl } : s
  );

  const { error: updateErr } = await admin
    .from('module_lessons')
    .update({ slides: updated, updated_at: new Date().toISOString() })
    .eq('module_id', moduleId);

  if (updateErr) throw new Error(`DB patch: ${updateErr.message}`);

  return publicUrl;
}

// ── Transcript parser ────────────────────────────────────────────────────────
function parseTranscripts(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const modules = {};

  let currentModule = null;
  let currentText   = [];
  let slideCount    = 0;

  const skipPrefixes = [
    'SPARTAN TRAINING LMS',
    'Use these transcripts',
    'File naming convention',
    'Upload MP3s',
    'Path format',
    '======',
    '[FILENAME:',
    'MODULE MOD-',
    'MODULE PI-',
    '--- SLIDE',
  ];

  function flushSlide() {
    if (currentModule !== null && slideCount > 0) {
      const text = currentText.join(' ').replace(/\s+/g, ' ').trim();
      modules[currentModule].push(text);
    }
    currentText = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const modMatch = line.match(/^MODULE ((?:MOD|PI)-\d+)/);
    if (modMatch) {
      flushSlide();
      currentModule = modMatch[1];
      slideCount    = 0;
      modules[currentModule] = [];
      continue;
    }

    if (line.startsWith('--- SLIDE ')) {
      flushSlide();
      slideCount++;
      continue;
    }

    if (skipPrefixes.some(p => line.startsWith(p))) continue;

    if (currentModule && slideCount > 0) {
      currentText.push(line);
    }
  }
  flushSlide();

  return modules;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');
  const forcedModules = args.filter(a => a.startsWith('MOD-') || a.startsWith('PI-'));

  console.log('Spartan Training — Batch Narration with 3-Voice Rotation\n');

  const transcripts = parseTranscripts(TRANSCRIPT_FILE);
  if (fs.existsSync(TRANSCRIPT_FILE_PI)) {
    const piTranscripts = parseTranscripts(TRANSCRIPT_FILE_PI);
    Object.assign(transcripts, piTranscripts);
  }

  const allModules = Object.keys(transcripts)
    .filter(m => m !== 'MOD-01')
    .sort((a, b) => {
      const prefix = s => s.startsWith('PI-') ? 1 : 0;
      if (prefix(a) !== prefix(b)) return prefix(a) - prefix(b);
      return a.localeCompare(b);
    });

  // Print voice plan
  console.log('Voice assignment per module:');
  for (const m of allModules) {
    const base = getModuleVoice(m);
    console.log(`  ${m} → ${base} (regular slides)`);
  }
  console.log('  Scenarios → Bella always | Checklists → Brian always\n');

  const modulesToRun = forcedModules.length > 0 ? forcedModules : allModules;
  const totalSlides = modulesToRun.reduce((n, m) => n + (transcripts[m]?.length ?? 0), 0);

  console.log(`Mode: ${forceFlag ? 'FORCE (redo all)' : 'RESUME (skip already narrated)'}`);
  console.log(`Modules: ${modulesToRun.join(', ')}`);
  console.log(`Total slides: ${totalSlides}\n`);

  let done = 0, skipped = 0, failed = 0;

  for (const moduleId of modulesToRun) {
    const slides = transcripts[moduleId];
    if (!slides) { console.log(`\nWARN: No transcript for ${moduleId}`); continue; }

    const forceThisModule = forceFlag || forcedModules.includes(moduleId);
    const baseVoice = getModuleVoice(moduleId);
    console.log(`\n=== ${moduleId} — ${slides.length} slides — base voice: ${baseVoice} ===`);

    const { data: lesson } = await admin
      .from('module_lessons')
      .select('slides')
      .eq('module_id', moduleId)
      .single();

    const dbSlides = lesson?.slides ?? [];

    for (let i = 0; i < slides.length; i++) {
      const text = slides[i];

      if (!forceThisModule && dbSlides[i]?.narrationUrl) {
        console.log(`  [${i}] SKIP — already narrated`);
        skipped++;
        continue;
      }

      if (!text) {
        console.log(`  [${i}] SKIP — no transcript text`);
        skipped++;
        continue;
      }

      const vId   = pickVoice(text, moduleId);
      const vName = voiceName(vId);
      const chars = text.length;

      try {
        process.stdout.write(`  [${i}] ${vName} (${chars} chars) — generating... `);
        const audio = await generateAudio(text, vId);
        process.stdout.write('uploading... ');
        await uploadAndPatch(moduleId, i, audio);
        console.log('✓');
        done++;
      } catch (err) {
        console.log('FAILED');
        console.error(`      ${err.message}`);
        failed++;
      }

      await sleep(800);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`Done: ${done}  |  Skipped: ${skipped}  |  Failed: ${failed}`);
  if (failed > 0) console.log('Re-run the same command to retry failed slides.');
}

main().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
