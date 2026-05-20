'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Handles all magic-link redirects.
//
// admin.generateLink() uses the implicit flow — Supabase sends tokens in the
// URL hash (#access_token=...).  Route handlers never receive the hash, so
// /auth/callback always fails for admin-generated links.
//
// signInWithOtp from a Server Action may also use implicit flow (no browser
// PKCE context available server-side).
//
// This client component handles both cases:
//   - Implicit flow → tokens in URL hash → setSession()
//   - PKCE flow     → code in URL query param → exchangeCodeForSession()
export default function AuthConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const hash = window.location.hash;

    const onError = (msg?: string) => {
      router.replace(
        '/sign-in?error=' +
          encodeURIComponent(
            msg ?? 'Your login link has expired or is invalid. Request a new one below.',
          ),
      );
    };

    if (code) {
      // PKCE flow — code_verifier was stored in browser cookies during initiation
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) onError();
        else router.replace('/dashboard');
      });
      return;
    }

    if (hash) {
      // Implicit flow — tokens arrive in the URL hash
      const params = new URLSearchParams(hash.slice(1));
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorDesc    = params.get('error_description');

      if (!accessToken || !refreshToken) {
        onError(errorDesc ?? undefined);
        return;
      }

      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) onError('Authentication failed. Please request a new login link.');
          else router.replace('/dashboard');
        });
      return;
    }

    onError();
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: 'var(--brass, #C5A059)',
        fontFamily: 'monospace',
        letterSpacing: '0.12em',
        fontSize: '0.85rem',
      }}
    >
      AUTHENTICATING&hellip;
    </div>
  );
}
