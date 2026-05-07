interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { spartan: '1.4rem', training: '0.9rem', tagline: '0.6rem', gap: '2px' },
  md: { spartan: '2rem',   training: '1.2rem', tagline: '0.65rem', gap: '3px' },
  lg: { spartan: '3rem',   training: '1.8rem', tagline: '0.7rem', gap: '4px' },
};

export function Wordmark({ size = 'md', showTagline = false, className }: WordmarkProps) {
  const s = sizeMap[size];

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: s.gap, lineHeight: 1 }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: s.spartan,
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          background: 'linear-gradient(180deg, var(--brass-light) 0%, var(--brass) 60%, var(--brass-deep) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        SPARTAN
      </span>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: s.training,
          fontWeight: 600,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          background: 'linear-gradient(180deg, var(--silver) 0%, var(--steel) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          WebkitTextStroke: '0.5px var(--steel)',
        }}
      >
        TRAINING
      </span>
      {showTagline && (
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: s.tagline,
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginTop: '4px',
          }}
        >
          Private Investigation · Executive Protection · Certification
        </span>
      )}
    </div>
  );
}
