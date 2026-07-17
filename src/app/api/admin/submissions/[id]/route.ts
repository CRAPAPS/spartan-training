export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';

const BUCKET = 'practical-reports';

async function requirePrivileged(_req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: self } = await supabaseAdmin.from('operators').select('role').eq('id', user.id).single();
  const role = (self as { role?: string } | null)?.role ?? 'agent';
  if (!['admin', 'coordinator', 'super_admin'].includes(role)) return null;
  return user;
}

// GET — short-lived signed download URL for the submitted report
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requirePrivileged(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { data: sub } = await supabaseAdmin
    .from('report_submissions')
    .select('file_path')
    .eq('id', id)
    .maybeSingle();
  if (!sub) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

  const { data: signed, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(sub.file_path as string, 300);
  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? 'Could not sign URL' }, { status: 500 });
  }
  return NextResponse.json({ url: signed.signedUrl });
}

// PATCH — grade a submission { grade: 'pass' | 'fail', feedback?: string }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requirePrivileged(req);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json() as { grade?: string; feedback?: string | null };
  if (!body.grade || !['pass', 'fail'].includes(body.grade)) {
    return NextResponse.json({ error: 'grade must be pass or fail' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data: row, error } = await supabaseAdmin
    .from('report_submissions')
    .update({
      status: 'graded',
      grade: body.grade,
      feedback: body.feedback?.trim() || null,
      graded_by: user.id,
      graded_at: now,
      updated_at: now,
    })
    .eq('id', id)
    .select('id, operator_id, module_id, practical_id, file_name, file_size, mime_type, status, grade, feedback, graded_at, submitted_at')
    .single();

  if (error || !row) {
    return NextResponse.json({ error: error?.message ?? 'Submission not found' }, { status: 404 });
  }
  return NextResponse.json(row);
}
