export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { createClient } from '@supabase/supabase-js';
import { generateNarration, slideToNarrationText } from '@/lib/ttsProvider';
import type { TTSProvider } from '@/types/lesson';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-build-only',
  { auth: { persistSession: false } }
);

interface RouteContext {
  params: Promise<{ moduleId: string; slideIndex: string }>;
}

async function requireAdmin(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role === 'super_admin' ? user : null;
}

// ── POST — Upload MP3 or generate via TTS ────────────────────────────────────
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { moduleId, slideIndex } = await params;
  const idx = parseInt(slideIndex, 10);

  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Fetch current slides
  const { data: lesson, error: fetchErr } = await admin
    .from('module_lessons')
    .select('slides')
    .eq('module_id', moduleId)
    .single();

  if (fetchErr || !lesson) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  const slides = lesson.slides as Record<string, unknown>[];
  if (idx < 0 || idx >= slides.length) {
    return NextResponse.json({ error: 'Slide index out of range' }, { status: 400 });
  }

  let audioBuffer: Buffer;
  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    // ── MP3 upload path ──────────────────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 });
    }
    audioBuffer = Buffer.from(await file.arrayBuffer());
  } else {
    // ── TTS generation path ──────────────────────────────────────────────────
    const body = await req.json() as { provider?: TTSProvider; voiceId?: string; speed?: number };
    const slide = slides[idx];
    const text = slideToNarrationText(slide);
    if (!text.trim()) {
      return NextResponse.json({ error: 'Slide has no text content for TTS' }, { status: 400 });
    }
    audioBuffer = await generateNarration(text, {
      provider: body.provider,
      voiceId: body.voiceId,
      speed: body.speed,
    });
  }

  // Upload to Supabase Storage
  const storagePath = `${moduleId}/${idx}.mp3`;
  const { error: uploadErr } = await admin.storage
    .from('lesson-narrations')
    .upload(storagePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });

  if (uploadErr) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 500 });
  }

  // Build public URL
  const { data: { publicUrl } } = admin.storage
    .from('lesson-narrations')
    .getPublicUrl(storagePath);

  // Patch narrationUrl into the slide JSONB
  const updated = slides.map((s, i) =>
    i === idx ? { ...s, narrationUrl: publicUrl } : s
  );

  const { error: updateErr } = await admin
    .from('module_lessons')
    .update({ slides: updated, updated_at: new Date().toISOString() })
    .eq('module_id', moduleId);

  if (updateErr) {
    return NextResponse.json({ error: `DB update failed: ${updateErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, narrationUrl: publicUrl, slideIndex: idx });
}

// ── DELETE — Remove narration from a slide ───────────────────────────────────
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { moduleId, slideIndex } = await params;
  const idx = parseInt(slideIndex, 10);

  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data: lesson } = await admin
    .from('module_lessons')
    .select('slides')
    .eq('module_id', moduleId)
    .single();

  if (!lesson) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

  // Remove from storage
  await admin.storage
    .from('lesson-narrations')
    .remove([`${moduleId}/${idx}.mp3`]);

  // Clear narrationUrl from slide
  const slides = lesson.slides as Record<string, unknown>[];
  const updated = slides.map((s, i) => {
    if (i !== idx) return s;
    const { narrationUrl: _, ...rest } = s;
    return rest;
  });

  await admin
    .from('module_lessons')
    .update({ slides: updated, updated_at: new Date().toISOString() })
    .eq('module_id', moduleId);

  return NextResponse.json({ ok: true });
}
