export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { ALLOWED_MIME, MAX_REPORT_BYTES, MODULE_TO_PRACTICAL, isPracticalModule } from '@/lib/practicals';
import type { PracticalSubmissionState } from '@/types/lesson';

const BUCKET = 'practical-reports';

function toState(row: {
  status: string; file_name: string; submitted_at: string;
  grade?: string | null; feedback?: string | null;
}): PracticalSubmissionState {
  return {
    status: row.status as 'submitted' | 'graded',
    fileName: row.file_name,
    submittedAt: row.submitted_at,
    grade: (row.grade ?? null) as 'pass' | 'fail' | null,
    feedback: row.feedback ?? null,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isPracticalModule(moduleId)) return NextResponse.json({ error: 'No practical for this module' }, { status: 400 });

  const { data: sub } = await supabaseAdmin
    .from('report_submissions')
    .select('status, file_name, submitted_at, grade, feedback')
    .eq('operator_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle();

  return NextResponse.json(sub ? toState(sub) : null);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isPracticalModule(moduleId)) return NextResponse.json({ error: 'No practical for this module' }, { status: 400 });

  // Enrollment gate — same doctrine as the module/quiz pages; privileged bypass
  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const role = (self as { role?: string } | null)?.role ?? 'agent';
  const isPrivileged = ['admin', 'coordinator', 'super_admin'].includes(role);

  if (!isPrivileged) {
    const { data: moduleRow } = await supabaseAdmin
      .from('mjm_modules').select('track').eq('id', moduleId).single();
    const { data: enrollment } = await supabaseAdmin
      .from('operator_enrollments')
      .select('id')
      .eq('operator_id', user.id)
      .eq('track', (moduleRow as { track?: string } | null)?.track ?? '')
      .maybeSingle();
    if (!enrollment) return NextResponse.json({ error: 'Not enrolled in this track' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const ext = ALLOWED_MIME[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Accepted formats: PDF, Word document, or an image of your report (JPG/PNG/WebP/HEIC)' }, { status: 400 });
  }
  if (file.size > MAX_REPORT_BYTES) {
    return NextResponse.json({ error: 'File exceeds the 10 MB limit' }, { status: 413 });
  }
  if (file.size === 0) return NextResponse.json({ error: 'File is empty' }, { status: 400 });

  const filePath = `${user.id}/${moduleId}/report${ext}`;

  // If a previous submission used a different extension, remove the orphan object
  const { data: existing } = await supabaseAdmin
    .from('report_submissions')
    .select('file_path')
    .eq('operator_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle();
  if (existing?.file_path && existing.file_path !== filePath) {
    await supabaseAdmin.storage.from(BUCKET).remove([existing.file_path]);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: file.type, upsert: true });
  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const now = new Date().toISOString();
  const { data: row, error: dbError } = await supabaseAdmin
    .from('report_submissions')
    .upsert({
      operator_id: user.id,
      module_id: moduleId,
      practical_id: MODULE_TO_PRACTICAL[moduleId],
      file_path: filePath,
      file_name: file.name || `report${ext}`,
      file_size: file.size,
      mime_type: file.type,
      status: 'submitted',
      grade: null,
      feedback: null,
      graded_by: null,
      graded_at: null,
      submitted_at: now,
      updated_at: now,
    }, { onConflict: 'operator_id,module_id' })
    .select('status, file_name, submitted_at, grade, feedback')
    .single();

  if (dbError || !row) {
    return NextResponse.json({ error: dbError?.message ?? 'Failed to record submission' }, { status: 500 });
  }

  return NextResponse.json(toState(row));
}
