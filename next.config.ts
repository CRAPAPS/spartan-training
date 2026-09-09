import type { NextConfig } from 'next';

// React's DEVELOPMENT build uses eval() for debugging features such as
// reconstructing call stacks. Without 'unsafe-eval' the dev server serves a page
// that never hydrates — it renders, but nothing is clickable and no input works,
// which makes local testing impossible. React never uses eval() in production, so
// this is scoped to development only and the production CSP stays strict.
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cloud.scorm.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "frame-src https://cloud.scorm.com https://challenges.cloudflare.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
              "media-src 'self' https://*.supabase.co",
            ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
    ];
  },
};

export default nextConfig;
