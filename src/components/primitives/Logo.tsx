import Image from 'next/image';

interface LogoProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

export function Logo({ size = 72, glow = false, className }: LogoProps) {
  const glowStyle = glow
    ? {
        filter: [
          'drop-shadow(0 2% 4% rgba(0,0,0,.6))',
          'drop-shadow(0 8% 18% rgba(0,0,0,.5))',
          'drop-shadow(0 16% 32% rgba(0,0,0,.35))',
          'drop-shadow(0 0 18px rgba(197,160,89,.32))',
          'drop-shadow(0 0 8px rgba(232,200,128,.24))',
        ].join(' '),
      }
    : undefined;

  return (
    <Image
      src="/assets/logo.png"
      alt="Spartan Training"
      width={size}
      height={size}
      style={{ objectFit: 'contain', ...glowStyle }}
      className={className}
      priority
    />
  );
}
