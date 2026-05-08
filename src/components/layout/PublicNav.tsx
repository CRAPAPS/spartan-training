'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Lockup } from '@/components/primitives/Lockup';
import { BrassButton } from '@/components/primitives/BrassButton';
import { createClient } from '@/utils/supabase/client';

const NAV_LINKS = [
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'Faculty',    href: '/faculty' },
  { label: 'About',      href: '/about' },
  { label: 'Contact',    href: '/contact' },
];

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  color: 'var(--ink-dim)',
  textDecoration: 'none',
  textTransform: 'uppercase',
};

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const CTAs = loggedIn ? (
    <Link href="/dashboard">
      <BrassButton variant="primary" size="sm">My Dashboard →</BrassButton>
    </Link>
  ) : (
    <>
      <Link href="/sign-in">
        <BrassButton variant="ghost" size="sm">Sign In</BrassButton>
      </Link>
      <Link href="/apply">
        <BrassButton variant="primary" size="sm">Apply ⤳</BrassButton>
      </Link>
    </>
  );

  return (
    <nav className="pub-nav">
      <Lockup logoSize={40} textSize="sm" />

      {/* Desktop links */}
      <div className="pub-nav-links">
        {NAV_LINKS.map(item => (
          <Link key={item.label} href={item.href} style={linkStyle}>{item.label}</Link>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className={`pub-nav-cta${open ? ' open' : ''}`}>
        {CTAs}
      </div>

      {/* Mobile hamburger */}
      <button
        className="pub-hamburger"
        onClick={() => setOpen(v => !v)}
        aria-label="Toggle navigation"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      <div className={`pub-nav-links${open ? ' open' : ''}`}>
        {NAV_LINKS.map(item => (
          <Link key={item.label} href={item.href} style={linkStyle}>{item.label}</Link>
        ))}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
          {CTAs}
        </div>
      </div>
    </nav>
  );
}
