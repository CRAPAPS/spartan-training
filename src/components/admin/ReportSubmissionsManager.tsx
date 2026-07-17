'use client';

import { useState } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';

export interface SubmissionData {
  id: string;
  operator_id: string;
  operator_code: string;
  operator_name: string;
  module_id: string;
  practical_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: string;
  grade: string | null;
  feedback: string | null;
  graded_at: string | null;
  submitted_at: string;
}

interface ReportSubmissionsManagerProps {
  initialSubmissions: SubmissionData[];
}

const PRACTICAL_LABELS: Record<string, string> = {
  'PR-1': 'PR-1 · Incident Report',
  'PR-2': 'PR-2 · Law Enforcement Report',
  'PR-3': 'PR-3 · Domestic Disturbance Report',
};

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-elev-2)', border: '1px solid var(--border)',
  color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '12px',
  padding: '7px 10px', outline: 'none', boxSizing: 'border-box',
};
const monoLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em',
  textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'block', marginBottom: '5px',
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ReportSubmissionsManager({ initialSubmissions }: ReportSubmissionsManagerProps) {
  const [subs, setSubs]           = useState<SubmissionData[]>(initialSubmissions);
  const [filter, setFilter]       = useState<'all' | 'ungraded'>('all');
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grade, setGrade]         = useState<'pass' | 'fail'>('pass');
  const [feedback, setFeedback]   = useState('');
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const visible = filter === 'all' ? subs : subs.filter(s => s.status !== 'graded');
  const ungradedCount = subs.filter(s => s.status !== 'graded').length;

  async function handleDownload(id: string) {
    setError(null);
    const res = await fetch(`/api/admin/submissions/${id}`);
    const data = await res.json() as { url?: string; error?: string };
    if (!res.ok || !data.url) { setError(data.error ?? 'Could not generate download link'); return; }
    window.open(data.url, '_blank', 'noopener');
  }

  function openGradeForm(s: SubmissionData) {
    setGradingId(prev => prev === s.id ? null : s.id);
    setGrade((s.grade === 'fail' ? 'fail' : 'pass'));
    setFeedback(s.feedback ?? '');
    setError(null);
  }

  async function handleGrade(id: string) {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, feedback: feedback || null }),
      });
      const data = await res.json() as SubmissionData & { error?: string };
      if (!res.ok) { setError(data.error ?? 'Failed to save grade'); return; }
      setSubs(prev => prev.map(s => s.id === id
        ? { ...s, status: data.status, grade: data.grade, feedback: data.feedback, graded_at: data.graded_at }
        : s));
      setGradingId(null);
    } catch {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <MonoLabel dot dotColor="var(--brass)">Practical Report Submissions · PI Track</MonoLabel>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'ungraded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px', background: 'transparent',
                border: `1px solid ${filter === f ? 'var(--brass)' : 'var(--border)'}`,
                color: filter === f ? 'var(--brass)' : 'var(--ink-mute)',
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {f === 'all' ? `All (${subs.length})` : `Ungraded (${ungradedCount})`}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: 'rgba(232,64,64,.08)', border: '1px solid rgba(232,64,64,.3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>{error}</span>
        </div>
      )}

      {visible.length === 0 ? (
        <div style={{ padding: '32px 24px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', textAlign: 'center' }}>
          <MonoLabel size="xs">{filter === 'ungraded' ? 'No ungraded submissions.' : 'No report submissions yet.'}</MonoLabel>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 70px 180px 1fr 90px 80px 150px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '860px' }}>
            {['Operator', 'Module', 'Practical', 'File', 'Submitted', 'Status', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          <div style={{ minWidth: '860px' }}>
            {visible.map((s, i) => (
              <div key={s.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 70px 180px 1fr 90px 80px 150px', gap: '8px', padding: '10px 16px', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brass)', fontWeight: 700 }}>{s.operator_code}</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.operator_name}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)' }}>{s.module_id}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)' }}>{PRACTICAL_LABELS[s.practical_id] ?? s.practical_id}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.file_name} · {formatSize(s.file_size)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
                    {new Date(s.submitted_at).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: s.status === 'graded' ? (s.grade === 'pass' ? 'var(--success)' : 'var(--danger)') : 'var(--brass)',
                  }}>
                    {s.status === 'graded' ? `Graded · ${s.grade}` : 'Submitted'}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => void handleDownload(s.id)}
                      style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => openGradeForm(s)}
                      style={{ padding: '4px 8px', background: 'transparent', border: '1px solid rgba(197,160,89,.4)', color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      {gradingId === s.id ? 'Close' : s.status === 'graded' ? 'Re-grade' : 'Grade'}
                    </button>
                  </div>
                </div>

                {gradingId === s.id && (
                  <div style={{ padding: '14px 16px 18px', borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(197,160,89,.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
                      <div>
                        <label style={monoLabelStyle}>Grade *</label>
                        <select value={grade} onChange={e => setGrade(e.target.value as 'pass' | 'fail')} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="pass">Pass</option>
                          <option value="fail">Fail — resubmit</option>
                        </select>
                      </div>
                      <div>
                        <label style={monoLabelStyle}>Instructor Feedback (shown to the operator)</label>
                        <textarea
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          rows={3}
                          placeholder="Strengths, deficiencies, corrections required…"
                          style={{ ...inputStyle, resize: 'vertical' }}
                        />
                      </div>
                    </div>
                    <div>
                      <BrassButton variant="primary" size="sm" onClick={() => void handleGrade(s.id)} disabled={busy}>
                        {busy ? 'Saving…' : 'Save Grade ⤳'}
                      </BrassButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
        Grading protocol: each operator submits all three practicals · formally grade at least one per operator (operator is not told which)
      </span>
    </div>
  );
}
