import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { DashboardShell } from '@/components/layout/DashboardShell';
import type { TrackProgress } from '@/components/layout/DashboardShell';

const TRACK_LABEL: Record<string, string> = {
  'armed-security':    'Armed Security',
  'private-detective': 'Private Detective',
  'unarmed-security':  'Unarmed Security',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const [operatorRes, modulesRes, progressRes] = await Promise.all([
    supabaseAdmin.from('operators').select('operator_id, role').eq('id', user.id).single(),
    supabaseAdmin.from('mjm_modules').select('id, track').eq('is_active', true),
    supabaseAdmin.from('operator_progress').select('module_id').eq('operator_id', user.id).eq('is_competent', true),
  ]);

  const operator = operatorRes.data;
  const role = operator?.role ?? 'agent';

  const completedIds = new Set((progressRes.data ?? []).map(p => p.module_id as string));
  const trackMap: Record<string, { total: number; completed: number }> = {};

  for (const m of modulesRes.data ?? []) {
    const track = m.track as string;
    if (!trackMap[track]) trackMap[track] = { total: 0, completed: 0 };
    trackMap[track].total++;
    if (completedIds.has(m.id)) trackMap[track].completed++;
  }

  const trackProgress: TrackProgress[] = Object.entries(trackMap).map(([track, { total, completed }]) => ({
    track,
    label: TRACK_LABEL[track] ?? track,
    total,
    completed,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
  }));

  return (
    <DashboardShell role={role} operatorId={operator?.operator_id ?? '—'} trackProgress={trackProgress}>
      {children}
    </DashboardShell>
  );
}
