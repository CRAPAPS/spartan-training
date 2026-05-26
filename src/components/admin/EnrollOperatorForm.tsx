'use client';

import { useState } from 'react';
import { MonoLabel } from '@/components/primitives/MonoLabel';
import { BrassButton } from '@/components/primitives/BrassButton';

const ENROLLABLE_TRACKS = [
  { id: 'armed-security',    label: 'Armed Security Officer (16hr)',   active: true  },
  { id: 'private-detective', label: 'Private Detective (72hr)',         active: true  },
  { id: 'unarmed-security',  label: 'Unarmed Security Officer (24hr)', active: true  },
];

const PAYMENT_METHODS = [
  { id: 'manual',        label: 'Card Present' },
  { id: 'eft',           label: 'EFT / Bank Transfer' },
  { id: 'cash',          label: 'Cash' },
  { id: 'complimentary', label: 'Complimentary / Staff' },
];

interface EnrollResult { operatorId: string; magicLink: string | null; promoCode: string | null; discountApplied: number | null }

interface EnrollOperatorFormProps { onSuccess?: () => void }

export function EnrollOperatorForm({ onSuccess }: EnrollOperatorFormProps) {
  const [email,          setEmail]          = useState('');
  const [fullName,       setFullName]        = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['armed-security']);
  const [paymentMethod,  setPaymentMethod]  = useState('manual');
  const [notes,          setNotes]          = useState('');
  const [promoCode,      setPromoCode]      = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [result,         setResult]         = useState<EnrollResult | null>(null);
  const [copied,         setCopied]         = useState(false);

  function toggleTrack(trackId: string) {
    setSelectedTracks(prev =>
      prev.includes(trackId) ? prev.filter(t => t !== trackId) : [...prev, trackId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedTracks.length === 0) { setError('Select at least one track'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/operators', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, full_name: fullName, tracks: selectedTracks, payment_method: paymentMethod, notes, promo_code: promoCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to enroll operator'); return; }
      setResult(data as EnrollResult);
      onSuccess?.();
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!result?.magicLink) return;
    await navigator.clipboard.writeText(result.magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function reset() {
    setEmail(''); setFullName(''); setSelectedTracks(['armed-security']);
    setPaymentMethod('manual'); setNotes(''); setPromoCode(''); setResult(null); setError(null);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-elev-2)', border: '1px solid var(--border)',
    color: 'var(--ink)', fontFamily: 'var(--font-ui)', fontSize: '13px',
    padding: '8px 10px', outline: 'none', boxSizing: 'border-box',
  };
  const monoLabel: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.16em',
    textTransform: 'uppercase', color: 'var(--ink-mute)', display: 'block', marginBottom: '6px',
  };

  if (result) {
    return (
      <div style={{ padding: '20px 24px', background: 'rgba(80,160,80,.04)', border: '1px solid rgba(80,160,80,.2)' }}>
        <MonoLabel dot dotColor="var(--success)" style={{ marginBottom: '12px' }}>Operator Enrolled</MonoLabel>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <span style={monoLabel}>Operator ID</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--brass)', letterSpacing: '0.06em' }}>{result.operatorId}</span>
          </div>
          <div>
            <span style={monoLabel}>Email</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-dim)' }}>{email}</span>
          </div>
          {result.promoCode && (
            <div>
              <span style={monoLabel}>Promo Applied</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--success)' }}>
                {result.promoCode} — {result.discountApplied}% off
              </span>
            </div>
          )}
        </div>

        {result.magicLink ? (
          <div style={{ marginBottom: '16px' }}>
            <span style={monoLabel}>Sign-in Link — send to student (expires 1hr)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <div style={{ flex: 1, background: 'var(--bg-elev-2)', border: '1px solid var(--border)', padding: '8px 10px', overflow: 'hidden' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-dim)', wordBreak: 'break-all' }}>
                  {result.magicLink}
                </span>
              </div>
              <button
                onClick={copyLink}
                style={{
                  flexShrink: 0, padding: '8px 14px',
                  background: copied ? 'var(--success)' : 'var(--bg-elev-2)',
                  border: '1px solid var(--border)',
                  color: copied ? '#fff' : 'var(--brass)',
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em',
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'background 200ms',
                }}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '16px', padding: '10px 12px', background: 'var(--bg-elev-2)', border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-mute)' }}>
              Magic link unavailable — student can sign in at spartantraining.live with their email.
            </span>
          </div>
        )}

        <button
          onClick={reset}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}
        >
          Enroll Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px 24px', background: 'rgba(197,160,89,.02)', border: '1px solid rgba(197,160,89,.15)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MonoLabel dot dotColor="var(--brass)">Enroll New Operator</MonoLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={monoLabel}>Full Name *</label>
          <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" style={inputStyle} />
        </div>
        <div>
          <label style={monoLabel}>Email Address *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="student@email.com" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={monoLabel}>Enrolled Track(s) *</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ENROLLABLE_TRACKS.map(t => (
            <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: t.active ? 'pointer' : 'not-allowed', opacity: t.active ? 1 : 0.4 }}>
              <input
                type="checkbox"
                checked={selectedTracks.includes(t.id)}
                disabled={!t.active}
                onChange={() => t.active && toggleTrack(t.id)}
                style={{ accentColor: 'var(--brass)', width: '14px', height: '14px' }}
              />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: t.active ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {t.label}
                {!t.active && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)', marginLeft: '8px' }}>NOT READY</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={monoLabel}>Payment Method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label style={monoLabel}>Notes (optional)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. EFT ref #12345" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={monoLabel}>Promo Code (optional)</label>
        <input
          type="text"
          value={promoCode}
          onChange={e => setPromoCode(e.target.value.toUpperCase())}
          placeholder="e.g. MAKTRAIN25"
          style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        />
      </div>

      {error && (
        <div style={{ padding: '8px 12px', background: 'rgba(232,64,64,.08)', border: '1px solid rgba(232,64,64,.3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <BrassButton variant="primary" size="sm" type="submit">
          {loading ? 'Enrolling…' : 'Enroll Operator ⤳'}
        </BrassButton>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-mute)' }}>
          A sign-in link will be generated for you to share with the student.
        </span>
      </div>
    </form>
  );
}
