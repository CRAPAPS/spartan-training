'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export interface TrackProgress {
  track: string;
  label: string;
  completed: number;
  total: number;
  pct: number;
}

interface DashboardShellProps {
  children: React.ReactNode;
  role: string;
  operatorId: string;
  trackProgress: TrackProgress[];
}

export function DashboardShell({ children, role, operatorId, trackProgress }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close sidebar on route change (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="dashboard-root">
      <div
        className={`mobile-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar role={role} isOpen={sidebarOpen} />

      <div className="dashboard-content">
        <TopBar
          operatorId={operatorId}
          role={role}
          trackProgress={trackProgress}
          onMenuToggle={() => setSidebarOpen(v => !v)}
        />
        <main className="main-pad">
          {children}
        </main>
      </div>
    </div>
  );
}
