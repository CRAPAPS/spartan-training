interface MonoLabelProps {
  children: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
  size?: 'xs' | 'sm';
  className?: string;
  style?: React.CSSProperties;
}

export function MonoLabel({ children, dot, dotColor = 'var(--brass)', size = 'sm', className, style }: MonoLabelProps) {
  const fontSize = size === 'xs' ? '9px' : '10px';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize,
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
        lineHeight: 1,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
