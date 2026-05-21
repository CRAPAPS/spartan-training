'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function VerifyClient() {
  const searchParams = useSearchParams();
  const [link, setLink] = useState<string | null>(null);
  const [bad,  setBad]  = useState(false);

  useEffect(() => {
    const next = searchParams.get('next');
    if (!next) { setBad(true); return; }
    try {
      const decoded = atob(next);
      if (!decoded.startsWith('https://')) { setBad(true); return; }
      setLink(decoded);
    } catch {
      setBad(true);
    }
  }, [searchParams]);

  const wrap: React.CSSProperties = {
    display: 'flex', height: '100vh', alignItems: 'center',
    justifyContent: 'center', background: '#0A0907',
    flexDirection: 'column', gap: '20px', padding: '24px',
  };
  const mono: React.CSSProperties = {
    fontFamily: "'Courier New',monospace", fontSize: '11px',
    letterSpacing: '0.18em', color: '#C5A059',
    textTransform: 'uppercase', margin: 0,
  };

  if (bad) {
    return (
      <div style={wrap}>
        <p style={mono}>SPARTAN TRAINING</p>
        <p style={{ color: '#B8B0A0', fontFamily: 'Inter,sans-serif', fontSize: '14px', margin: 0, textAlign: 'center' }}>
          This login link is invalid or has expired.
        </p>
        <Link href="/sign-in?mode=link"
          style={{ color: '#C5A059', fontFamily: "'Courier New',monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Request a new link →
        </Link>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <p style={mono}>SPARTAN TRAINING</p>
      <p style={{ color: '#B8B0A0', fontFamily: 'Inter,sans-serif', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '340px' }}>
        Click below to access your Spartan Training dashboard.
      </p>
      <button
        onClick={() => { if (link) window.location.href = link; }}
        disabled={!link}
        style={{
          padding: '14px 40px', background: link ? '#C5A059' : 'rgba(197,160,89,.3)',
          border: 'none', color: '#0A0907',
          fontFamily: "'Courier New',monospace", fontSize: '12px',
          fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          cursor: link ? 'pointer' : 'not-allowed', borderRadius: '3px',
        }}
      >
        {link ? 'Access Dashboard' : 'Loading…'}
      </button>
      <p style={{ color: '#4A4440', fontFamily: 'Inter,sans-serif', fontSize: '11px', margin: 0, textAlign: 'center', maxWidth: '340px' }}>
        Single-use link · expires in 1 hour
      </p>
    </div>
  );
}
