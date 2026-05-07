interface RuleProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Rule({
  orientation = 'horizontal',
  color = 'var(--border)',
  thickness = 1,
  className,
  style,
}: RuleProps) {
  if (orientation === 'vertical') {
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: `${thickness}px`,
          alignSelf: 'stretch',
          backgroundColor: color,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <hr
      className={className}
      style={{
        border: 'none',
        borderTop: `${thickness}px solid ${color}`,
        width: '100%',
        ...style,
      }}
    />
  );
}
