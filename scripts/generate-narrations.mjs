/**
 * generate-narrations.mjs
 * Generates ElevenLabs narration audio for lesson slides and stores them
 * in Supabase Storage, updating the slides JSONB with the narrationUrl.
 *
 * Usage:
 *   node scripts/generate-narrations.mjs --module MOD-01 --slides 0,1
 *   node scripts/generate-narrations.mjs --module MOD-01            (all slides)
 *   node scripts/generate-narrations.mjs --module all               (all modules)
 *
 * Requires in .env.local:
 *   ELEVENLABS_API_KEY=...
 *   ELEVENLABS_VOICE_ID=...   (optional, defaults to Adam)
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

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
    module: get('--module') ?? 'MOD-01',
    slides: get('--slides') ?? null,   // null = all slides
    voice:  get('--voice')  ?? null,   // override voice ID
    speed:  parseFloat(get('--speed') ?? '0.95'),
    dryRun: args.includes('--dry-run'),
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
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// ── Supabase helpers ─────────────────────────────────────────────────────────
async function supabaseRequest(url, serviceKey, method, body, isBlob = false) {
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      ...(isBlob ? { 'Content-Type': 'audio/mpeg' } : { 'Content-Type': 'application/json' }),
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    body: body ? (isBlob ? body : JSON.stringify(body)) : undefined,
  });
  if (!res.ok && res.status !== 200 && res.status !== 201 && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

async function getSlides(supabaseUrl, serviceKey, moduleId) {
  const data = await supabaseRequest(
    `${supabaseUrl}/rest/v1/module_lessons?module_id=eq.${moduleId}&select=slides`,
    serviceKey, 'GET'
  );
  if (!data || !data[0]) throw new Error(`Module ${moduleId} not found`);
  return data[0].slides;
}

async function uploadAudio(supabaseUrl, serviceKey, path, buffer) {
  const uploadUrl = `${supabaseUrl}/storage/v1/object/lesson-narrations/${path}`;
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage upload ${res.status}: ${err}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/lesson-narrations/${path}`;
}

async function updateSlides(supabaseUrl, serviceKey, moduleId, slides) {
  await supabaseRequest(
    `${supabaseUrl}/rest/v1/module_lessons?module_id=eq.${moduleId}`,
    serviceKey, 'PATCH',
    { slides, updated_at: new Date().toISOString() }
  );
}

async function getAllModuleIds(supabaseUrl, serviceKey) {
  const data = await supabaseRequest(
    `${supabaseUrl}/rest/v1/module_lessons?select=module_id&order=module_id`,
    serviceKey, 'GET'
  );
  return (data ?? []).map(r => r.module_id);
}

// ── Check remaining ElevenLabs quota ────────────────────────────────────────
async function checkQuota(apiKey) {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const used = data.character_count ?? 0;
  const limit = data.character_limit ?? 10000;
  return { used, limit, remaining: limit - used };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const env  = loadEnv();
  const args = parseArgs();

  const apiKey    = env.ELEVENLABS_API_KEY;
  const supabaseUrl  = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey   = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!apiKey)      { console.error('ELEVENLABS_API_KEY missing from .env.local'); process.exit(1); }
  if (!supabaseUrl) { console.error('NEXT_PUBLIC_SUPABASE_URL missing from .env.local'); process.exit(1); }
  if (!serviceKey)  { console.error('SUPABASE_SERVICE_ROLE_KEY missing from .env.local'); process.exit(1); }

  // Default voice: Adam (pNInz6obpgDQGcFmaJgB) — deep, authoritative American male
  const voiceId = args.voice ?? env.ELEVENLABS_VOICE_ID ?? 'pNInz6obpgDQGcFmaJgB';
  const speed   = args.speed;

  // Show quota
  const quota = await checkQuota(apiKey);
  if (quota) {
    console.log(`\nElevenLabs quota: ${quota.used.toLocaleString()} / ${quota.limit.toLocaleString()} chars used (${quota.remaining.toLocaleString()} remaining)\n`);
  }

  // Resolve modules
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

    // Resolve slide indexes
    const indexes = args.slides
      ? args.slides.split(',').map(s => parseInt(s.trim(), 10))
      : slides.map((_, i) => i);

    let totalChars = 0;
    const updatedSlides = [...slides];

    for (const idx of indexes) {
      const slide = slides[idx];
      if (!slide) { console.warn(`  ⚠ Slide ${idx} not found`); continue; }

      // Skip video slides with a src (Colossyan handles audio)
      if (slide.type === 'video' && slide.src) {
        console.log(`  [${idx}] skip — video slide with src (Colossyan)`);
        continue;
      }

      const text = slideToText(slide);
      if (!text) { console.warn(`  [${idx}] skip — no text content`); continue; }

      totalChars += text.length;
      console.log(`  [${idx}] ${slide.heading ?? slide.title ?? slide.type} (${text.length} chars)`);

      if (args.dryRun) {
        console.log(`        DRY RUN — would synthesize: "${text.slice(0, 80)}..."`);
        continue;
      }

      try {
        const audio = await synthesize(text, { apiKey, voiceId, speed });
        const path  = `${moduleId}/${idx}.mp3`;
        const url   = await uploadAudio(supabaseUrl, serviceKey, path, audio);
        updatedSlides[idx] = { ...slide, narrationUrl: url };
        console.log(`        ✓ uploaded (${(audio.length / 1024).toFixed(1)} KB)`);
      } catch (e) {
        console.error(`        ✗ ${e.message}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    if (!args.dryRun && indexes.length > 0) {
      await updateSlides(supabaseUrl, serviceKey, moduleId, updatedSlides);
      console.log(`  → slides JSONB updated`);
    }

    console.log(`  Total chars this module: ${totalChars}`);
  }

  console.log('\nDone.\n');
}

main().catch(e => { console.error(e); process.exit(1); });
