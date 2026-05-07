'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';
import { Rule } from '@/components/primitives/Rule';

export interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  sequence_order: number;
  scorm_course_id: string;
  passing_score: number;
  duration_hours: number | null;
  quizCount: number;
}

interface EditState {
  title: string;
  description: string;
  scorm_course_id: string;
  passing_score: string;
  duration_hours: string;
}

export function ModuleManager({ modules }: { modules: ModuleData[] }) {
  const router = useRouter();
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editForm, setEditForm]     = useState<EditState>({} as EditState);
  const [saving, setSaving]         = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [genCounts, setGenCounts]   = useState<Record<string, number>>({});
  const [genError, setGenError]     = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);

  function startEdit(m: ModuleData) {
    setEditingId(m.id);
    setEditForm({
      title:           m.title,
      description:     m.description ?? '',
      scorm_course_id: m.scorm_course_id,
      passing_score:   String(m.passing_score),
      duration_hours:  String(m.duration_hours ?? ''),
    });
  }

  async function saveEdit(moduleId: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:           editForm.title,
          description:     editForm.description,
          scorm_course_id: editForm.scorm_course_id,
          passing_score:   editForm.passing_score,
          duration_hours:  editForm.duration_hours || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEditingId(null);
      router.refresh();
    } catch (e: unknown) {
      alert(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  async function generateQuiz(moduleId: string) {
    setGeneratingId(moduleId);
    setGenError(null);
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      setGenCounts(prev => ({ ...prev, [moduleId]: data.count }));
      router.refresh();
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : String(e));
    } finally {
      setGeneratingId(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 0', background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--border-strong)', color: 'var(--ink)',
    fontFamily: 'var(--font-ui)', fontSize: '13px', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Quiz generation controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: 'var(--bg-elev-2)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <MonoLabel size="xs">Claude Quiz Generation</MonoLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MonoLabel size="xs">Questions:</MonoLabel>
          {[5, 8, 10, 15, 20].map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              style={{
                padding: '3px 8px',
                border: `1px solid ${questionCount === n ? 'var(--brass)' : 'var(--border)'}`,
                background: questionCount === n ? 'rgba(197,160,89,.1)' : 'transparent',
                color: questionCount === n ? 'var(--brass)' : 'var(--ink-mute)',
                fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        {genError && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--danger)', letterSpacing: '0.1em' }}>
            {genError}
          </span>
        )}
      </div>

      {/* Module table */}
      <div className="table-scroll" style={{ border: '1px solid var(--border)' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 90px 1fr 110px 80px 60px 180px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '700px' }}>
          {['Seq', 'ID', 'Title', 'SCORM', 'Pass%', 'Quiz', 'Actions'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {modules.map((m, i) => {
          const isEditing   = editingId === m.id;
          const isGenerating = generatingId === m.id;
          const qCount      = genCounts[m.id] ?? m.quizCount;
          const scormSet    = m.scorm_course_id && m.scorm_course_id !== 'TBD';

          return (
            <div key={m.id} style={{ borderBottom: i < modules.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {/* Main row */}
              <div style={{ display: 'grid', gridTemplateColumns: '44px 90px 1fr 110px 80px 60px 180px', gap: '8px', padding: '12px 16px', background: isEditing ? 'rgba(197,160,89,.04)' : i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)', alignItems: 'center', minWidth: '700px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--brass)' }}>
                  {String(m.sequence_order).padStart(2, '0')}
                </span>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', letterSpacing: '0.06em' }}>
                  {m.id}
                </span>

                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.title}
                </span>

                {/* SCORM badge */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: scormSet ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase' }}>
                  {scormSet ? '● LINKED' : '○ TBD'}
                </span>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>
                  {m.passing_score}%
                </span>

                {/* Quiz count badge */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: qCount > 0 ? 'var(--success)' : 'var(--ink-mute)', textTransform: 'uppercase' }}>
                  {qCount > 0 ? `${qCount}Q` : 'NONE'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(m.id)}
                        disabled={saving}
                        style={{ padding: '4px 10px', border: '1px solid var(--brass)', background: 'rgba(197,160,89,.1)', color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '9px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(m)}
                        style={{ padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--ink-dim)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => generateQuiz(m.id)}
                        disabled={isGenerating || generatingId !== null}
                        style={{ padding: '4px 10px', border: `1px solid ${isGenerating ? 'var(--border)' : 'rgba(197,160,89,.4)'}`, background: isGenerating ? 'transparent' : 'rgba(197,160,89,.06)', color: isGenerating ? 'var(--ink-mute)' : 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', cursor: isGenerating ? 'wait' : 'pointer', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                      >
                        {isGenerating ? 'Generating…' : 'Gen Quiz'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline edit form */}
              {isEditing && (
                <div style={{ padding: '20px 16px 24px', background: 'rgba(197,160,89,.03)', borderTop: '1px solid rgba(197,160,89,.15)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                    <div>
                      <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Title</MonoLabel>
                      <input
                        value={editForm.title}
                        onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>SCORM Course ID</MonoLabel>
                      <input
                        value={editForm.scorm_course_id}
                        onChange={e => setEditForm(f => ({ ...f, scorm_course_id: e.target.value }))}
                        placeholder="e.g. course-abc123"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Passing Score (%)</MonoLabel>
                      <input
                        type="number" min="50" max="100"
                        value={editForm.passing_score}
                        onChange={e => setEditForm(f => ({ ...f, passing_score: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Duration (hours)</MonoLabel>
                      <input
                        type="number" min="0" step="0.5"
                        value={editForm.duration_hours}
                        onChange={e => setEditForm(f => ({ ...f, duration_hours: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <MonoLabel size="xs" style={{ marginBottom: '6px', display: 'block' }}>Description</MonoLabel>
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      style={{ ...inputStyle, borderBottom: 'none', border: '1px solid var(--border-strong)', padding: '8px', resize: 'vertical', lineHeight: 1.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '10px 0' }}>
        <MonoLabel size="xs">
          {modules.filter(m => m.scorm_course_id !== 'TBD').length} / {modules.length} modules linked to SCORM Cloud
          · {modules.reduce((s, m) => s + (genCounts[m.id] ?? m.quizCount), 0)} total quiz questions
        </MonoLabel>
      </div>
    </div>
  );
}
