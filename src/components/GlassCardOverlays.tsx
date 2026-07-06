import type { CSSProperties } from 'react';

type GlassCardOverlaysProps = {
  roundedClass?: string;
  gradientOrder?: 'gradient-first' | 'rounded-first';
  glowStyle?: CSSProperties;
  accentOpacity?: 'opacity-60' | 'opacity-80';
  hoverOverlay?: boolean;
};

const gradientLayers: Array<{
  gradientClass: string;
  opacityClass?: string;
}> = [
  {
    gradientClass: 'bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02]',
  },
  {
    gradientClass: 'bg-gradient-to-r from-transparent via-white/[0.05] to-transparent',
    opacityClass: 'opacity-50',
  },
  {
    gradientClass: 'bg-gradient-to-br from-white/[0.06] via-transparent to-transparent',
    opacityClass: 'opacity-40',
  },
  {
    gradientClass: 'bg-gradient-to-tl from-transparent via-white/[0.04] to-transparent',
    opacityClass: 'opacity-30',
  },
] as const;

export default function GlassCardOverlays({
  roundedClass = 'rounded-3xl',
  gradientOrder = 'gradient-first',
  glowStyle,
  accentOpacity,
  hoverOverlay = false,
}: GlassCardOverlaysProps) {
  return (
    <>
      {gradientLayers.map(({ gradientClass, opacityClass }) => (
        <div
          key={`${gradientClass}-${opacityClass ?? 'base'}`}
          className={
            gradientOrder === 'rounded-first'
              ? [
                  'absolute inset-0',
                  roundedClass,
                  gradientClass,
                  opacityClass,
                  'pointer-events-none mix-blend-normal',
                ]
                  .filter(Boolean)
                  .join(' ')
              : [
                  'absolute inset-0',
                  gradientClass,
                  opacityClass,
                  roundedClass,
                  'pointer-events-none mix-blend-normal',
                ]
                  .filter(Boolean)
                  .join(' ')
          }
        />
      ))}

      {glowStyle ? (
        <div
          className={`absolute inset-0 ${roundedClass} animate-border-glow pointer-events-none`}
          style={glowStyle}
        />
      ) : null}

      {hoverOverlay ? (
        <div className="absolute inset-0 rounded-3xl bg-white/0 transition-all duration-500 pointer-events-none group-hover:bg-white/[0.03] group-hover:backdrop-blur-sm touch:group-has-[input:checked]/card:bg-white/[0.03]" />
      ) : null}

      {accentOpacity ? (
        <div className={`absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] ${accentOpacity} rounded-b-3xl`} />
      ) : null}
    </>
  );
}
