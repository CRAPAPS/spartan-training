'use client';

import { useState } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { Rule } from '@/components/primitives/Rule';
import { ModuleManager, type ModuleData } from './ModuleManager';
import { OperatorRoster, type OperatorData } from './OperatorRoster';
import { AuditLogViewer, type AuditEntry } from './AuditLogViewer';
import { PromoCodeManager, type PromoCodeData } from './PromoCodeManager';

type Tab = 'modules' | 'operators' | 'audit' | 'promo';

interface AdminClientProps {
  modules: ModuleData[];
  operators: OperatorData[];
  auditLog: AuditEntry[];
  operatorMap: Record<string, string>;
  selfRole: string;
  stats: { totalOperators: number; totalCompetencies: number; criticalFails: number };
  enrollmentMap: Record<string, string[]>;
  promoCodes: PromoCodeData[];
}

export function AdminClient({ modules, operators, auditLog, operatorMap, selfRole, stats, enrollmentMap, promoCodes }: AdminClientProps) {
  const [tab, setTab] = useState<Tab>('modules');

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'modules',   label: 'Modules',     count: modules.length },
    { id: 'operators', label: 'Operators',   count: operators.length },
    { id: 'audit',     label: 'Audit Log',   count: auditLog.length },
    { id: 'promo',     label: 'Promo Codes', count: promoCodes.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header + stats strip */}
      <div>
        <div className="dash-page-header" style={{ marginBottom: '20px' }}>
          <div>
            <MonoLabel dot dotColor="var(--brass)" style={{ marginBottom: '8px' }}>
              {selfRole === 'super_admin' ? 'SUPER ADMIN · FULL ACCESS' : selfRole === 'coordinator' ? 'COORDINATOR · SENIOR OVERSIGHT' : 'ADMIN PANEL'}
            </MonoLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
              Command & Control
            </h1>
          </div>
        </div>

        {/* Stat strip */}
        <div className="metric-strip">
          <div className="metric-strip-item">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--brass)', lineHeight: 1 }}>{stats.totalOperators}</span>
            <MonoLabel>Enrolled Operators</MonoLabel>
          </div>
          <div className="metric-strip-item">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{modules.filter(m => m.scorm_course_id !== 'TBD').length}/16</span>
            <MonoLabel>SCORM Linked</MonoLabel>
          </div>
          <div className="metric-strip-item">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{stats.totalCompetencies}</span>
            <MonoLabel>Total Competencies</MonoLabel>
          </div>
          <div className="metric-strip-item">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: stats.criticalFails > 0 ? 'var(--danger)' : 'var(--ink)', lineHeight: 1 }}>{stats.criticalFails}</span>
            <MonoLabel>Critical Fails</MonoLabel>
          </div>
        </div>
      </div>

      <Rule />

      {/* Tab bar */}
      <div className="admin-tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--brass)' : '2px solid transparent',
              color: tab === t.id ? 'var(--brass)' : 'var(--ink-mute)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-1px',
              transition: 'color 150ms',
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{
                padding: '1px 6px',
                background: tab === t.id ? 'rgba(197,160,89,.15)' : 'var(--bg-elev-2)',
                color: tab === t.id ? 'var(--brass)' : 'var(--ink-mute)',
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em',
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'modules' && <ModuleManager modules={modules} />}
      {tab === 'operators' && (
        <OperatorRoster
          operators={operators.map(op => ({ ...op, enrolledTracks: enrollmentMap[op.id] ?? [] }))}
          selfRole={selfRole}
        />
      )}
      {tab === 'audit' && <AuditLogViewer entries={auditLog} operatorMap={operatorMap} />}
      {tab === 'promo' && <PromoCodeManager initialCodes={promoCodes} />}
    </div>
  );
}
