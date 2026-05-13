export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-build-only',
  { auth: { persistSession: false } }
);

interface RouteContext {
  params: Promise<{ moduleId: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify module exists — use admin client (publishable key breaks PostgREST)
  const { data: module } = await admin
    .from('mjm_modules')
    .select('id')
    .eq('id', moduleId)
    .single();

  if (!module) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

  const body = await req.json();
  const { currentSlide, totalSlides } = body as { currentSlide: number; totalSlides: number };

  if (typeof currentSlide !== 'number' || currentSlide < 0) {
    return NextResponse.json({ error: 'Invalid slide index' }, { status: 400 });
  }

  const lessonData = {
    currentSlide,
    totalSlides,
    lastSavedAt: new Date().toISOString(),
  };

  // Check for an existing progress row
  const { data: existing } = await admin
    .from('operator_progress')
    .select('id, status, scorm_data')
    .eq('operator_id', user.id)
    .eq('module_id', moduleId)
    .single();

  if (!existing) {
    // First touch — create progress row, fires MODULE_START audit event via trigger
    await admin.from('operator_progress').insert({
      operator_id:  user.id,
      module_id:    moduleId,
      status:       'in_progress',
      is_competent: false,
      attempts:     0,
      scorm_data:   { lesson: lessonData },
      updated_at:   new Date().toISOString(),
    });
  } else {
    // Merge lesson sub-key — preserves existing quiz/answers data
    const merged = {
      ...(existing.scorm_data as Record<string, unknown> ?? {}),
      lesson: lessonData,
    };
    // Only set in_progress if quiz has not already determined a final status
    const finalStatuses = ['completed', 'reset'];
    const newStatus = finalStatuses.includes(existing.status) ? existing.status : 'in_progress';

    await admin
      .from('operator_progress')
      .update({ scorm_data: merged, status: newStatus, updated_at: new Date().toISOString() })
      .eq('operator_id', user.id)
      .eq('module_id', moduleId);
  }

  return NextResponse.json({ ok: true });
}
