import type { Metadata, Viewport } from 'next';
import '@/styles/tokens.css';

export const metadata: Metadata = {
  title: 'Spartan Training | MJM 2026 Armed Security Accreditation',
  description: 'GBPDSA 16-hour Armed Security Officer Certification — Spartan Training Platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
