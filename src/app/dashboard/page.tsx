import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabaseServer';
import { MetricStrip } from '@/components/dashboard/MetricStrip';
import { ModuleTable } from '@/components/dashboard/ModuleTable';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: visibleModules } = await supabaseAdmin
    .from('mjm_modules')
    .select('id, title, track, sequence_order')
    .order('sequence_order');

  const { data: progressRows } = await supabase
    .from('operator_progress')
    .select('module_id, status, is_competent, score, updated_at')
    .eq('operator_id', user.id);

  const { data: operator } = await supabase
    .from('operators')
    .select('full_name, operator_id')
    .eq('id', user.id)
    .single();

  const progressMap = Object.fromEntries(
    (progressRows ?? []).map(p => [p.module_id, p])
  );

  const visibleIds = new Set((visibleModules ?? []).map(m => m.id));

  const tableRows = (visibleModules ?? []).map(m => {
    const prog = progressMap[m.id];
    return {
      id:        m.id,
      title:     m.title,
      track:     m.track,
      status:    prog?.status ?? 'not_started',
      progress:  prog?.is_competent ? 100 : prog?.score ?? 0,
      updatedAt: prog?.updated_at ?? undefined,
      isLocked:  false,
    };
  });

  const completedCount = (progressRows ?? []).filter(p => p.is_competent).length;
  const totalHours     = completedCount * 1;
  const activeModules  = (progressRows ?? []).filter(p => p.status === 'in_progress').length;

  const metrics = [
    { value: `${completedCount}/16`, label: 'Modules Complete', accent: true },
    { value: `${Math.round((completedCount / 16) * 100)}%`, label: 'Track Progress' },
    { value: `${totalHours}h`,       label: 'Hours Logged' },
    { value: `${activeModules}`,     label: 'In Progress' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Telemetry strip */}
      <MetricStrip metrics={metrics} />

      <Rule />

      {/* Two-column layout: module table left, briefing video right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '28px',
        alignItems: 'start',
      }}
        className="cmd-grid"
      >
        {/* Left — module table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <MonoLabel dot dotColor="var(--brass)">Active Modules</MonoLabel>
            <MonoLabel size="xs">{visibleIds.size} OF 16 ACCESSIBLE</MonoLabel>
          </div>
          <ModuleTable modules={tableRows} />
        </div>

        {/* Right — briefing video */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Label bar */}
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-elev-2)',
            border: '1px solid var(--border)',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <MonoLabel dot dotColor="var(--brass)" size="xs">Briefing</MonoLabel>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.14em',
              color: 'var(--ink-mute)',
              textTransform: 'uppercase',
            }}>
              MJM 2026
            </span>
          </div>

          {/* Video player */}
          <div style={{
            border: '1px solid var(--border)',
            background: '#000',
            lineHeight: 0,
          }}>
            <video
              controls
              preload="metadata"
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '220px',
                objectFit: 'cover',
              }}
            >
              <source src="/videos/mjm-briefing.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Caption */}
          <div style={{
            padding: '10px 12px',
            border: '1px solid var(--border)',
            borderTop: 'none',
            background: 'var(--bg-elev-1)',
          }}>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: 'var(--ink)',
              fontWeight: 500,
              display: 'block',
              marginBottom: '4px',
            }}>
              MJM 2026 Armed Security Accreditation
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: 'var(--ink-mute)',
              display: 'block',
              lineHeight: 1.5,
            }}>
              Instructor briefing — watch before beginning Module 01.
            </span>
          </div>

          {/* Operator greeting */}
          {operator && (
            <div style={{
              marginTop: '16px',
              padding: '14px 12px',
              border: '1px solid rgba(197,160,89,.2)',
              background: 'rgba(197,160,89,.03)',
            }}>
              <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>
                Operator on Deck
              </MonoLabel>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--ink)',
                display: 'block',
                marginBottom: '2px',
              }}>
                {operator.full_name}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--brass)',
                letterSpacing: '0.08em',
              }}>
                {operator.operator_id}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
