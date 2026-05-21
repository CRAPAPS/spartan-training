import { Suspense } from 'react';
import { VerifyClient } from './VerifyClient';

const Loading = () => (
  <div style={{
    display: 'flex', height: '100vh', alignItems: 'center',
    justifyContent: 'center', background: '#0A0907',
    color: '#C5A059', fontFamily: "'Courier New',monospace",
    letterSpacing: '0.12em', fontSize: '0.85rem',
  }}>
    LOADING&hellip;
  </div>
);

export default function AuthVerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyClient />
    </Suspense>
  );
}
