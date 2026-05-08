import type { TTSProvider } from '@/types/lesson';

export interface TTSOptions {
  provider?: TTSProvider;
  voiceId?: string;    // provider-specific voice ID
  speed?: number;      // 0.5–2.0, default 1.0
}

// ── ElevenLabs ──────────────────────────────────────────────────────────────

async function generateElevenLabs(text: string, opts: TTSOptions): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const voiceId = opts.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL'; // default: Bella

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
        stability: 0.5,
        similarity_boost: 0.75,
        speed: opts.speed ?? 1.0,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// ── AWS Polly ────────────────────────────────────────────────────────────────

async function generatePolly(text: string, opts: TTSOptions): Promise<Buffer> {
  // Requires: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
  // and @aws-sdk/client-polly installed
  const { PollyClient, SynthesizeSpeechCommand } = await import('@aws-sdk/client-polly').catch(() => {
    throw new Error('@aws-sdk/client-polly not installed — run: npm i @aws-sdk/client-polly');
  });

  const client = new PollyClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const voiceId = (opts.voiceId ?? process.env.POLLY_VOICE_ID ?? 'Matthew') as string;

  const { AudioStream } = await client.send(new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceId as Parameters<typeof SynthesizeSpeechCommand>[0]['VoiceId'],
    Engine: 'neural',
  }));

  if (!AudioStream) throw new Error('Polly returned no audio stream');

  const chunks: Uint8Array[] = [];
  for await (const chunk of AudioStream as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// ── Google TTS ───────────────────────────────────────────────────────────────

async function generateGoogle(text: string, opts: TTSOptions): Promise<Buffer> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_TTS_API_KEY not configured');

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: opts.voiceId ?? process.env.GOOGLE_TTS_VOICE ?? 'en-US-Neural2-D',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: opts.speed ?? 1.0,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google TTS error ${res.status}: ${err}`);
  }

  const { audioContent } = await res.json() as { audioContent: string };
  return Buffer.from(audioContent, 'base64');
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function generateNarration(text: string, opts: TTSOptions = {}): Promise<Buffer> {
  const provider: TTSProvider =
    opts.provider ??
    (process.env.TTS_PROVIDER as TTSProvider | undefined) ??
    'elevenlabs';

  switch (provider) {
    case 'elevenlabs': return generateElevenLabs(text, opts);
    case 'polly':      return generatePolly(text, opts);
    case 'google':     return generateGoogle(text, opts);
    default:           throw new Error(`Unknown TTS provider: ${provider}`);
  }
}

// Extracts plain text from a slide suitable for narration
export function slideToNarrationText(slide: Record<string, unknown>): string {
  const parts: string[] = [];

  if (slide.legalRef) parts.push(`Legal reference: ${slide.legalRef}.`);
  if (slide.heading)  parts.push(String(slide.heading) + '.');
  if (slide.body)     parts.push(String(slide.body));
  if (slide.title)    parts.push(String(slide.title) + '.');
  if (slide.scenario) parts.push(`Tactical scenario. ${slide.scenario}`);
  if (slide.reflection) parts.push(`Reflection question: ${slide.reflection}`);

  if (Array.isArray(slide.keyPoints)) {
    parts.push('Key points:');
    for (const kp of slide.keyPoints as string[]) parts.push(kp + '.');
  }

  if (Array.isArray(slide.items)) {
    for (const item of slide.items as Array<{ label: string; description: string }>) {
      parts.push(`${item.label}: ${item.description}`);
    }
  }

  if (slide.callout && typeof slide.callout === 'object') {
    const c = slide.callout as { type: string; text: string };
    const prefix = c.type === 'warning' ? 'Caution.' : c.type === 'tip' ? 'Tip.' : 'Note.';
    parts.push(`${prefix} ${c.text}`);
  }

  return parts.join(' ');
}
