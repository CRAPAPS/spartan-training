import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { AdminClient } from '@/components/admin/AdminClient';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: self } = await supabaseAdmin
    .from('operators').select('role').eq('id', user.id).single();
  const selfRole = (self as any)?.role ?? 'agent';
  if (selfRole !== 'admin' && selfRole !== 'coordinator' && selfRole !== 'super_admin') redirect('/dashboard');

  // All 16 modules
  const { data: modules } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, description, sequence_order, scorm_course_id, passing_score, duration_hours')
    .order('sequence_order');

  // Quiz question counts per module
  const { data: quizCounts } = await supabaseAdmin
    .from('quiz_questions')
    .select('module_id');

  const countMap: Record<string, number> = {};
  (quizCounts ?? []).forEach((q: any) => {
    countMap[q.module_id] = (countMap[q.module_id] ?? 0) + 1;
  });

  const moduleData = (modules ?? []).map((m: any) => ({
    ...m,
    quizCount: countMap[m.id] ?? 0,
  }));

  // All operators
  const { data: operators } = await supabaseAdmin
    .from('operators')
    .select('id, operator_id, full_name, email, track, enrolled_at, role')
    .order('enrolled_at', { ascending: false });

  // All progress rows
  const { data: allProgress } = await supabaseAdmin
    .from('operator_progress')
    .select('operator_id, module_id, status, is_competent, score');

  const progressByOp: Record<string, any[]> = {};
  (allProgress ?? []).forEach((p: any) => {
    if (!progressByOp[p.operator_id]) progressByOp[p.operator_id] = [];
    progressByOp[p.operator_id].push(p);
  });

  const operatorData = (operators ?? []).map((op: any) => {
    const prog = progressByOp[op.id] ?? [];
    return {
      ...op,
      competentCount:  prog.filter((p: any) => p.is_competent).length,
      progressDetails: prog,
    };
  });

  // Enrollment map: operator_id → track[]
  const { data: enrollmentRows } = await supabaseAdmin
    .from('operator_enrollments')
    .select('operator_id, track');
  const enrollmentMap: Record<string, string[]> = {};
  (enrollmentRows ?? []).forEach((e: any) => {
    if (!enrollmentMap[e.operator_id]) enrollmentMap[e.operator_id] = [];
    enrollmentMap[e.operator_id].push(e.track);
  });

  // Promo codes
  const { data: promoCodes } = await supabaseAdmin
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, max_uses, uses_count, applicable_tracks, expires_at, is_active, notes, created_at')
    .order('created_at', { ascending: false });

  // Audit log (last 200 entries)
  const { data: auditLog } = await supabaseAdmin
    .from('spartan_audit_log')
    .select('id, operator_id, event, module_id, score, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(200);

  const operatorMap = Object.fromEntries(
    (operators ?? []).map((op: any) => [op.id, op.operator_id])
  );

  const totalCompetencies = (allProgress ?? []).filter((p: any) => p.is_competent).length;
  const criticalFails = (auditLog ?? []).filter((e: any) => e.event === 'TACTICAL_RESET').length;

  return (
    <AdminClient
      modules={moduleData}
      operators={operatorData}
      auditLog={auditLog ?? []}
      operatorMap={operatorMap}
      selfRole={selfRole}
      stats={{
        totalOperators: (operators ?? []).length,
        totalCompetencies,
        criticalFails,
      }}
      enrollmentMap={enrollmentMap}
      promoCodes={(promoCodes ?? []) as import('@/components/admin/PromoCodeManager').PromoCodeData[]}
    />
  );
}
