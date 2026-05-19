import { redirect } from 'next/navigation';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { BrassButton } from '@/components/primitives/BrassButton';
import { updatePasswordAction } from '@/app/actions/auth';

interface SettingsPageProps {
  searchParams: Promise<{ updated?: string; error?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: operator } = await supabaseAdmin
    .from('operators')
    .select('operator_id, full_name, email, track, enrolled_at, role')
    .eq('id', user.id)
    .single();

  const { updated, error } = await searchParams;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '640px' }}>

      <div>
        <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>Account Settings</MonoLabel>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
          Operator Profile
        </h1>
      </div>

      <Rule />

      {/* Operator info */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Identity Record</MonoLabel>
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-elev-1)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Operator ID',  value: operator?.operator_id ?? '—' },
            { label: 'Full Name',    value: operator?.full_name ?? '—' },
            { label: 'Email',        value: operator?.email ?? user.email ?? '—' },
            { label: 'Track',        value: (operator?.track ?? '—').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) },
            { label: 'Role',         value: ((operator as typeof operator & { role?: string } | null)?.role ?? 'agent').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) },
            { label: 'Enrolled',     value: operator?.enrolled_at ? new Date(operator.enrolled_at).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <MonoLabel size="xs">{label}</MonoLabel>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* Password change */}
      <section>
        <MonoLabel style={{ marginBottom: '16px', display: 'block' }}>Update Passphrase</MonoLabel>

        {updated === '1' && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(80,160,80,.1)', border: '1px solid rgba(80,160,80,.3)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'var(--success)', textTransform: 'uppercase' }}>
            Passphrase updated successfully
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(192,64,48,.12)', border: '1px solid var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'var(--danger)', textTransform: 'uppercase' }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={updatePasswordAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--border)', padding: '20px', background: 'var(--bg-elev-1)' }}>
          <div>
            <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>New Passphrase</MonoLabel>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div>
            <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Confirm Passphrase</MonoLabel>
            <input
              type="password"
              name="confirm_password"
              required
              minLength={8}
              style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <BrassButton type="submit" variant="silver" size="md">
            Update Passphrase ⤳
          </BrassButton>
        </form>
      </section>
    </div>
  );
}
