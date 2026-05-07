'use client';

import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'silver';
type Size    = 'sm' | 'md' | 'lg';

interface BrassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const paddingMap: Record<Size, string> = {
  sm: '8px 14px',
  md: '12px 22px',
  lg: '16px 30px',
};

const fontSizeMap: Record<Size, string> = {
  sm: '11px',
  md: '12px',
  lg: '13px',
};

function getVariantStyle(variant: Variant): React.CSSProperties {
  if (variant === 'primary') {
    return {
      background: 'var(--btn-brass-bg)',
      color: '#1a140a',
      border: '1px solid var(--brass)',
      boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 -1px 0 rgba(0,0,0,.3) inset, 0 6px 16px rgba(197,160,89,.25)',
    };
  }
  if (variant === 'silver') {
    return {
      background: 'var(--btn-silver-bg)',
      color: '#0a0a0c',
      border: '1px solid var(--silver)',
      boxShadow: '0 1px 0 rgba(255,255,255,.3) inset, 0 -1px 0 rgba(0,0,0,.2) inset',
    };
  }
  return {
    background: 'transparent',
    color: 'var(--ink)',
    border: '1px solid var(--border-strong)',
    boxShadow: 'none',
  };
}

export function BrassButton({ variant = 'primary', size = 'md', icon, children, style, ...props }: BrassButtonProps) {
  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: paddingMap[size],
        fontFamily: 'var(--font-ui)',
        fontSize: fontSizeMap[size],
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'opacity 150ms ease, box-shadow 150ms ease',
        ...getVariantStyle(variant),
        ...style,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
    >
      {children}
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
}
