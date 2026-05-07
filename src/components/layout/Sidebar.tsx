'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lockup } from '@/components/primitives/Lockup';
import { Rule } from '@/components/primitives/Rule';

const NAV_ITEMS = [
  { key: 'CMD', label: 'Command',     href: '/dashboard' },
  { key: 'CUR', label: 'Curriculum',  href: '/dashboard/curriculum' },
  { key: 'LIB', label: 'Library',     href: '/dashboard/library' },
  { key: 'REC', label: 'Records',     href: '/dashboard/records' },
  { key: 'EXM', label: 'Exams',       href: '/dashboard/exams' },
  { key: 'CRD', label: 'Credentials', href: '/dashboard/credentials' },
  { key: 'SET', label: 'Settings',    href: '/dashboard/settings' },
] as const;

const ADMIN_ITEM = { key: 'ADM', label: 'Admin Panel', href: '/dashboard/admin' };

interface SidebarProps {
  role?: string;
  isOpen?: boolean;
}

export function Sidebar({ role = 'agent', isOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === 'admin' || role === 'coordinator' || role === 'super_admin';
  const allItems = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div style={{ padding: '0 20px 24px' }}>
        <Lockup logoSize={36} textSize="sm" direction="row" />
      </div>

      <Rule />

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {allItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 20px',
                textDecoration: 'none',
                color: isActive ? 'var(--brass)' : 'var(--ink-dim)',
                background: isActive ? 'rgba(197,160,89,.06)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--brass)' : '2px solid transparent',
                transition: 'color 150ms, background 150ms',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  color: isActive ? 'var(--brass)' : 'var(--ink-mute)',
                  minWidth: '28px',
                }}
              >
                {item.key}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.04em',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Rule />
      <div style={{ padding: '16px 20px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.18em',
            color: 'var(--ink-mute)',
            textTransform: 'uppercase',
          }}
        >
          MJM 2026 · GBPDSA
        </span>
      </div>
    </aside>
  );
}
