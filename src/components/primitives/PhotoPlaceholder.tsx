interface PhotoPlaceholderProps {
  width?: string | number;
  height?: string | number;
  caption?: string;
  className?: string;
}

export function PhotoPlaceholder({ width = '100%', height = 300, caption, className }: PhotoPlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        background: `repeating-linear-gradient(
          -45deg,
          #0d0d0f 0px,
          #0d0d0f 8px,
          #1a1c20 8px,
          #1a1c20 16px
        )`,
        flexShrink: 0,
      }}
    >
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            padding: '4px 8px',
            background: 'rgba(22,23,27,.7)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
