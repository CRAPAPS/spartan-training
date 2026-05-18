'use client';

import { useState } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';

export interface PromoCodeData {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  applicable_tracks: string[] | null;
  expires_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

interface PromoCodeManagerProps {
  initialCodes: PromoCodeData[];
}

const TRACK_OPTIONS = [
  { id: 'armed-security',    label: 'Armed Security' },
  { id: 'private-detective', label: 'Private Detective' },
  { id: 'unarmed-security',  label: 'Unarmed Security' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-elev-2)', border: '1px solid var(--border)',
  color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '12px',
  padding: '7px 10px', outline: 'none', boxSizing: 'border-box',
};
const monoLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em',
  textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'block', marginBottom: '5px',
};

export function PromoCodeManager({ initialCodes }: PromoCodeManagerProps) {
  const [codes, setCodes]       = useState<PromoCodeData[]>(initialCodes);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  const [newCode,        setNewCode]        = useState('');
  const [discountType,   setDiscountType]   = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue,  setDiscountValue]  = useState('');
  const [maxUses,        setMaxUses]        = useState('');
  const [allTracks,      setAllTracks]      = useState(true);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [expiresAt,      setExpiresAt]      = useState('');
  const [notes,          setNotes]          = useState('');

  function resetForm() {
    setNewCode(''); setDiscountType('percentage'); setDiscountValue('');
    setMaxUses(''); setAllTracks(true); setSelectedTracks([]);
    setExpiresAt(''); setNotes(''); setError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim() || !discountValue) { setError('Code and discount value are required'); return; }
    if (!allTracks && selectedTracks.length === 0) { setError('Select at least one track or choose "All tracks"'); return; }
    setLoading(true); setError(null); setSuccess(null);
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code:              newCode.toUpperCase().trim(),
          discount_type:     discountType,
          discount_value:    parseFloat(discountValue),
          max_uses:          maxUses ? parseInt(maxUses) : null,
          applicable_tracks: allTracks ? null : selectedTracks,
          expires_at:        expiresAt || null,
          notes:             notes || null,
        }),
      });
      const data = await res.json() as PromoCodeData & { error?: string };
      if (!res.ok) { setError(data.error ?? 'Failed to create code'); return; }
      setCodes(prev => [data, ...prev]);
      setSuccess(`Code ${data.code} created`);
      resetForm();
      setShowForm(false);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    if (res.ok) setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <MonoLabel dot dotColor="var(--brass)">Discount / Promo Codes</MonoLabel>
        <BrassButton variant="primary" size="sm" onClick={() => { setShowForm(v => !v); setError(null); setSuccess(null); }}>
          {showForm ? 'Cancel' : '+ New Code'}
        </BrassButton>
      </div>

      {success && (
        <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>{success}</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: 'rgba(197,160,89,.02)', border: '1px solid rgba(197,160,89,.15)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <MonoLabel>Create New Promo Code</MonoLabel>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={monoLabelStyle}>Code *</label>
              <input type="text" required value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="MAKTRAIN25" style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }} />
            </div>
            <div>
              <label style={monoLabelStyle}>Type *</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label style={monoLabelStyle}>Value * ({discountType === 'percentage' ? '%' : '$'})</label>
              <input type="number" required min="0.01" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? '25' : '50'} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={monoLabelStyle}>Max Uses (blank = unlimited)</label>
              <input type="number" min="1" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" style={inputStyle} />
            </div>
            <div>
              <label style={monoLabelStyle}>Expiry Date (optional)</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={monoLabelStyle}>Applicable Tracks</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={allTracks} onChange={e => setAllTracks(e.target.checked)} style={{ accentColor: 'var(--brass)' }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)' }}>All tracks</span>
            </label>
            {!allTracks && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '22px' }}>
                {TRACK_OPTIONS.map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedTracks.includes(t.id)}
                      onChange={() => setSelectedTracks(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                      style={{ accentColor: 'var(--brass)' }}
                    />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--ink)' }}>{t.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={monoLabelStyle}>Notes (optional)</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Coordinator staff discount" style={inputStyle} />
          </div>

          {error && (
            <div style={{ padding: '8px 12px', background: 'rgba(232,64,64,.08)', border: '1px solid rgba(232,64,64,.3)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>{error}</span>
            </div>
          )}

          <BrassButton variant="primary" size="sm" type="submit">
            {loading ? 'Creating…' : 'Create Code ⤳'}
          </BrassButton>
        </form>
      )}

      {codes.length === 0 ? (
        <div style={{ padding: '32px 24px', border: '1px solid var(--border)', background: 'var(--bg-elev-1)', textAlign: 'center' }}>
          <MonoLabel size="xs">No promo codes yet.</MonoLabel>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '130px 90px 70px 60px 60px 1fr 90px 80px', gap: '8px', padding: '8px 16px', background: 'var(--bg-elev-2)', borderBottom: '1px solid var(--border)', minWidth: '740px' }}>
            {['Code', 'Type', 'Value', 'Used', 'Max', 'Tracks / Notes', 'Expires', 'Status'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>
          <div style={{ minWidth: '740px' }}>
            {codes.map((c, i) => (
              <div
                key={c.id}
                style={{ display: 'grid', gridTemplateColumns: '130px 90px 70px 60px 60px 1fr 90px 80px', gap: '8px', padding: '10px 16px', borderBottom: i < codes.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg-elev-1)', alignItems: 'center', opacity: c.is_active ? 1 : 0.5 }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brass)', fontWeight: 700 }}>{c.code}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>{c.discount_type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)' }}>
                  {c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-dim)' }}>{c.uses_count}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-mute)' }}>{c.max_uses ?? '∞'}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.applicable_tracks ? c.applicable_tracks.map(t => t.replace(/-/g, ' ')).join(', ') : 'All tracks'}
                  {c.notes ? ` · ${c.notes}` : ''}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
                  {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}
                </span>
                <button
                  onClick={() => toggleActive(c.id, c.is_active)}
                  style={{ padding: '4px 8px', background: 'transparent', border: `1px solid ${c.is_active ? 'rgba(232,64,64,.4)' : 'rgba(34,197,94,.4)'}`, color: c.is_active ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  {c.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
