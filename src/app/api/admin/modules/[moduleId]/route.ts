export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

interface RouteContext { params: Promise<{ moduleId: string }> }

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const role = (self as any)?.role ?? 'agent';
  if (role !== 'admin' && role !== 'coordinator' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if (body.title           !== undefined) patch.title            = body.title;
  if (body.description     !== undefined) patch.description      = body.description;
  if (body.scorm_course_id !== undefined) patch.scorm_course_id  = body.scorm_course_id;
  if (body.passing_score   !== undefined) patch.passing_score    = Number(body.passing_score);
  if (body.duration_hours  !== undefined) patch.duration_hours   = Number(body.duration_hours);

  const { error } = await supabaseAdmin
    .from('mjm_modules').update(patch).eq('id', moduleId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
