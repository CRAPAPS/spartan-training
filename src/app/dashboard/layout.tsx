import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: operator } = await supabase
    .from('operators')
    .select('operator_id, role')
    .eq('id', user.id)
    .single();

  const role = (operator as { role?: string } | null)?.role ?? 'agent';

  return (
    <DashboardShell role={role} operatorId={operator?.operator_id ?? '—'}>
      {children}
    </DashboardShell>
  );
}
