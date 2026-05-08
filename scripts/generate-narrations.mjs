/**
 * generate-narrations.mjs
 * Generates ElevenLabs narration audio for lesson slides and stores them
 * in Supabase Storage, updating the slides JSONB with the narrationUrl.
 *
 * Usage:
 *   node scripts/generate-narrations.mjs --audition
 *     → Generates a 2-sentence test clip from each candidate voice.
 *       Saves to scripts/audition/[voice].mp3 for local comparison.
 *       Costs ~250 chars per voice (~10 voices = ~2,500 chars total).
 *
 *   node scripts/generate-narrations.mjs --module MOD-01 --slides 0,1
 *   node scripts/generate-narrations.mjs --module MOD-01   (all slides)
 *   node scripts/generate-narrations.mjs --module all      (every module)
 *   node scripts/generate-narrations.mjs --module MOD-01 --dry-run
 *
 * Requires in .env.local:
 *   ELEVENLABS_API_KEY=...
 *   ELEVENLABS_VOICE_ID=...   (set after audition)
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Candidate voices for security/law enforcement training ───────────────────
// Two-voice model:
//   PRIMARY (male)   — main slide content, legal/procedural, key points
//   SECONDARY (female) — scenario slides, reflection prompts, callout boxes
//
// Profile: American English, calm authority, measured pace. Not academic.
// Sounds like a seasoned field instructor. Equal authority between voices.

const CANDIDATE_VOICES_MALE = [
  {
    id:      'nPczCjzI2devNBz1zQrb',
    name:    'Brian',
    profile: 'Deep, composed American. Very measured delivery. Sounds experienced. Top pick.',
  },
  {
    id:      'TxGEqnHWrfWFTfGW9XjX',
    name:    'Josh',
    profile: 'Deep, calm, measured American. Natural warmth without losing authority.',
  },
  {
    id:      'cjVigY5qzO86Huf0OWal',
    name:    'Eric',
    profile: 'Warm, conversational American. Calm and steady. Low-pressure — aids retention.',
  },
  {
    id:      'TX3LPaxmHKxFdv7VOQHJ',
    name:    'Liam',
    profile: 'Calm, clear, neutral American. Even-paced — excellent for dense legal content.',
  },
  {
    id:      'iP95p4xoKVk53GoZ742B',
    name:    'Chris',
    profile: 'Steady and professional. Calm under pressure — suits tactical content.',
  },
  {
    id:      'pNInz6obpgDQGcFmaJgB',
    name:    'Adam',
    profile: 'Deep baritone, authoritative. Clear diction. Strong for legal/procedural slides.',
  },
  {
    id:      'bVMeCyTHy58xNoL34h3p',
    name:    'Jeremy',
    profile: 'Confident without aggression. Natural authority. Engaging instructor feel.',
  },
];

const CANDIDATE_VOICES_FEMALE = [
  {
    id:      'EXAVITQu4vr4xnSDxMaL',
    name:    'Bella',
    profile: 'Calm, professional American female. Clear and composed — strong for scenario delivery.',
  },
  {
    id:      'ThT5KcBeYPX3keUQqHPh',
    name:    'Dorothy',
    profile: 'Warm but authoritative American female. Grounded delivery. Good for reflection prompts.',
  },
  {
    id:      'oWAxZDx7w5VEj9dCyTzz',
    name:    'Grace',
    profile: 'Confident, measured American female. Professional tone. Suits procedural content.',
  },
  {
    id:      'z9fAnlkpzviPz146aGWa',
    name:    'Glinda',
    profile: 'Clear, calm American female. Neutral accent. Strong articulation for technical terms.',
  },
  {
    id:      'XB0fDUnXU5powFXDhCwa',
    name:    'Charlotte',
    profile: 'American female, direct and warm. Calm authority without softness. Top pick.',
  },
  {
    id:      'pFZP5JQG7iQjIQuC4Bku',
    name:    'Lily',
    profile: 'Clear, composed American female. Even pace. Works well for callout and warning content.',
  },
];

// Combined for backward compat
const CANDIDATE_VOICES = [...CANDIDATE_VOICES_MALE, ...CANDIDATE_VOICES_FEMALE];

// Audition test script — same text every voice reads so comparison is fair
const AUDITION_TEXT =
  'Before you carry a firearm on duty in Georgia, four conditions must be met simultaneously. ' +
  'Missing any single one creates legal liability for you, your client, and your agency. ' +
  'Knowing this cold — before an incident, not during — is what separates a defensible action from a criminal conviction.';

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      env[key] = val;
    }
  } catch {
    console.error('Could not read .env.local');
    process.exit(1);
  }
  return env;
}

// ── Parse CLI args ───────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : null;
  };
  return {
    audition: args.includes('--audition'),
    module:   get('--module') ?? 'MOD-01',
    slides:   get('--slides') ?? null,
    voice:    get('--voice')  ?? null,
    speed:    parseFloat(get('--speed') ?? '0.92'),
    dryRun:   args.includes('--dry-run'),
  };
}

// ── Extract narration text from a slide ──────────────────────────────────────
function slideToText(slide) {
  const parts = [];
  if (slide.legalRef)   parts.push(`Legal reference: ${slide.legalRef}.`);
  if (slide.heading)    parts.push(`${slide.heading}.`);
  if (slide.body)       parts.push(slide.body);
  if (slide.title)      parts.push(`${slide.title}.`);
  if (slide.scenario)   parts.push(`Tactical scenario. ${slide.scenario}`);
  if (slide.reflection) parts.push(`Reflection. ${slide.reflection}`);

  if (Array.isArray(slide.keyPoints)) {
    parts.push('Key points.');
    for (const kp of slide.keyPoints) parts.push(kp + '.');
  }
  if (Array.isArray(slide.items)) {
    for (const item of slide.items) {
      parts.push(`${item.label}: ${item.description}`);
    }
  }
  if (slide.callout) {
    const prefix = slide.callout.type === 'warning' ? 'Caution.' :
                   slide.callout.type === 'tip'     ? 'Tip.'     : 'Note.';
    parts.push(`${prefix} ${slide.callout.text}`);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

// ── ElevenLabs TTS ───────────────────────────────────────────────────────────
async function synthesize(text, { apiKey, voiceId, speed }) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability:        0.55,
        similarity_boost: 0.75,
        style:            0.15,   // slight expressiveness — not robotic, not theatrical
        use_speaker_boost: true,
        speed,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// ── Supabase helpers ─────────────────────────────────────────────────────────
async function supabaseGet(url, serviceKey) {
  const res = await fetch(url, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase GET ${res.status}: ${await res.text()}`);
  return res.json();
}

async function supabasePatch(url, serviceKey, body) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 204) throw new Error(`Supabase PATCH ${res.status}: ${await res.text()}`);
}

async function uploadAudio(supabaseUrl, serviceKey, path, buffer) {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/lesson-narrations/${path}`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`Storage upload ${res.status}: ${await res.text()}`);
  return `${supabaseUrl}/storage/v1/object/public/lesson-narrations/${path}`;
}

async function getSlides(supabaseUrl, serviceKey, moduleId) {
  const data = await supabaseGet(
    `${supabaseUrl}/rest/v1/module_lessons?module_id=eq.${moduleId}&select=slides`,
    serviceKey
  );
  if (!data?.[0]) throw new Error(`Module ${moduleId} not found`);
  return data[0].slides;
}

async function getAllModuleIds(supabaseUrl, serviceKey) {
  const data = await supabaseGet(
    `${supabaseUrl}/rest/v1/module_lessons?select=module_id&order=module_id`,
    serviceKey
  );
  return (data ?? []).map(r => r.module_id);
}

async function checkQuota(apiKey) {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    used:      data.character_count ?? 0,
    limit:     data.character_limit ?? 10000,
    remaining: (data.character_limit ?? 10000) - (data.character_count ?? 0),
  };
}

// ── Audition mode ────────────────────────────────────────────────────────────
async function runAudition(apiKey, speed) {
  const outDir = resolve(__dirname, 'audition');
  mkdirSync(resolve(outDir, 'male'),   { recursive: true });
  mkdirSync(resolve(outDir, 'female'), { recursive: true });

  const allVoices = CANDIDATE_VOICES;
  const quota = await checkQuota(apiKey);
  if (quota) {
    const cost = allVoices.length * AUDITION_TEXT.length;
    console.log(`\nElevenLabs quota: ${quota.used.toLocaleString()} / ${quota.limit.toLocaleString()} used`);
    console.log(`Audition will use ~${cost} chars (${quota.remaining.toLocaleString()} remaining)\n`);
    if (quota.remaining < cost) {
      console.error('Insufficient quota. Use --slides with 1-2 voices, or wait for monthly quota reset.');
      process.exit(1);
    }
  }

  console.log('── MALE VOICES (primary — main slide content) ──────────────');
  for (const voice of CANDIDATE_VOICES_MALE) {
    process.stdout.write(`  ${voice.name.padEnd(12)} ${voice.profile.slice(0, 52)}… `);
    try {
      const audio = await synthesize(AUDITION_TEXT, { apiKey, voiceId: voice.id, speed });
      writeFileSync(resolve(outDir, 'male', `${voice.name.toLowerCase()}.mp3`), audio);
      console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB`);
    } catch (e) { console.log(`✗ ${e.message}`); }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n── FEMALE VOICES (secondary — scenarios, reflections, callouts) ──');
  for (const voice of CANDIDATE_VOICES_FEMALE) {
    process.stdout.write(`  ${voice.name.padEnd(12)} ${voice.profile.slice(0, 52)}… `);
    try {
      const audio = await synthesize(AUDITION_TEXT, { apiKey, voiceId: voice.id, speed });
      writeFileSync(resolve(outDir, 'female', `${voice.name.toLowerCase()}.mp3`), audio);
      console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB`);
    } catch (e) { console.log(`✗ ${e.message}`); }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n── NEXT STEPS ───────────────────────────────────────────────');
  console.log('Listen to scripts/audition/male/ and scripts/audition/female/');
  console.log('Then add your chosen pair to .env.local:\n');
  console.log('  ELEVENLABS_VOICE_ID=<male voice id>');
  console.log('  ELEVENLABS_VOICE_ID_SECONDARY=<female voice id>\n');
  console.log('Male top picks:   Brian, Josh, Liam, Eric');
  console.log('Female top picks: Charlotte, Grace, Dorothy\n');

  console.log('Voice IDs reference:');
  for (const v of allVoices) {
    console.log(`  ${v.name.padEnd(12)} ${v.id}`);
  }
  console.log('');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const env  = loadEnv();
  const args = parseArgs();

  const apiKey     = env.ELEVENLABS_API_KEY;
  const supabaseUrl   = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey    = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apiKey)      { console.error('ELEVENLABS_API_KEY missing from .env.local'); process.exit(1); }
  if (!supabaseUrl) { console.error('NEXT_PUBLIC_SUPABASE_URL missing from .env.local'); process.exit(1); }
  if (!serviceKey)  { console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env.local'); process.exit(1); }

  if (args.audition) {
    await runAudition(apiKey, args.speed);
    return;
  }

  // Primary (male) — slide, checklist, video slides
  // Secondary (female) — scenario, reflection, callout-heavy slides
  const voicePrimary   = args.voice   ?? env.ELEVENLABS_VOICE_ID           ?? 'nPczCjzI2devNBz1zQrb'; // Brian
  const voiceSecondary =                 env.ELEVENLABS_VOICE_ID_SECONDARY  ?? 'XB0fDUnXU5powFXDhCwa'; // Charlotte
  const speed = args.speed;

  // Which voice to use per slide type
  const voiceForSlide = (slide) =>
    slide.type === 'scenario' ? voiceSecondary : voicePrimary;

  const quota = await checkQuota(apiKey);
  if (quota) {
    console.log(`\nElevenLabs quota: ${quota.used.toLocaleString()} / ${quota.limit.toLocaleString()} used (${quota.remaining.toLocaleString()} remaining)`);
  }

  const moduleIds = args.module === 'all'
    ? await getAllModuleIds(supabaseUrl, serviceKey)
    : [args.module.toUpperCase()];

  for (const moduleId of moduleIds) {
    console.log(`\n── ${moduleId} ──────────────────────────────────────────`);

    let slides;
    try {
      slides = await getSlides(supabaseUrl, serviceKey, moduleId);
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      continue;
    }

    const indexes = args.slides
      ? args.slides.split(',').map(s => parseInt(s.trim(), 10))
      : slides.map((_, i) => i);

    let totalChars = 0;
    const updatedSlides = [...slides];

    for (const idx of indexes) {
      const slide = slides[idx];
      if (!slide) { console.warn(`  ⚠ Slide ${idx} not found`); continue; }

      if (slide.type === 'video' && slide.src) {
        console.log(`  [${idx}] skip — video slide with src (Colossyan handles audio)`);
        continue;
      }

      const text = slideToText(slide);
      if (!text) { console.warn(`  [${idx}] skip — no text content`); continue; }

      totalChars += text.length;
      const label = slide.heading ?? slide.title ?? slide.type;
      console.log(`  [${idx}] "${label}" (${text.length} chars)`);

      if (args.dryRun) {
        console.log(`        DRY RUN — "${text.slice(0, 90)}…"`);
        continue;
      }

      const voice = voiceForSlide(slide);
      const voiceTag = voice === voiceSecondary ? '[F]' : '[M]';
      try {
        const audio = await synthesize(text, { apiKey, voiceId: voice, speed });
        const url   = await uploadAudio(supabaseUrl, serviceKey, `${moduleId}/${idx}.mp3`, audio);
        updatedSlides[idx] = { ...slide, narrationUrl: url };
        console.log(`        ✓ ${voiceTag} ${(audio.length / 1024).toFixed(1)} KB → Storage`);
      } catch (e) {
        console.error(`        ✗ ${e.message}`);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    if (!args.dryRun && indexes.length > 0) {
      await supabasePatch(
        `${supabaseUrl}/rest/v1/module_lessons?module_id=eq.${moduleId}`,
        serviceKey,
        { slides: updatedSlides, updated_at: new Date().toISOString() }
      );
      console.log(`  → database updated`);
    }

    console.log(`  Total chars this module: ${totalChars}`);
  }

  console.log('\nDone.\n');
}

main().catch(e => { console.error(e.message); process.exit(1); });
