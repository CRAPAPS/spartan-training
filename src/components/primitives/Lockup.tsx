import { Logo } from './Logo';
import { Wordmark } from './Wordmark';

interface LockupProps {
  logoSize?: number;
  textSize?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  glow?: boolean;
  direction?: 'row' | 'column';
  className?: string;
}

export function Lockup({
  logoSize = 56,
  textSize = 'md',
  showTagline = false,
  glow = false,
  direction = 'row',
  className,
}: LockupProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: direction === 'row' ? 'center' : 'flex-start',
        gap: direction === 'row' ? '16px' : '12px',
      }}
    >
      <Logo size={logoSize} glow={glow} />
      <Wordmark size={textSize} showTagline={showTagline} />
    </div>
  );
}
