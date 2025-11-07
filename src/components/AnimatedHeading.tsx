'use client';

import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import type { ComponentType } from 'react';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fallbackMotion } from '@/utils/motionFallback';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type AnimatedHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
};

const DEFAULT_DISTANCE = 200;

const DISTANCE_BREAKPOINTS: Array<{ minWidth: number; intensity: number }> = [
  { minWidth: 1440, intensity: 1 },
  { minWidth: 1024, intensity: 0.8 },
  { minWidth: 768, intensity: 0.6 },
  { minWidth: 0, intensity: 0.45 },
];

export default function AnimatedHeading({
  as = 'h2',
  delay = 0,
  direction = 'right',
  distance = DEFAULT_DISTANCE,
  once = true,
  className,
  children,
  ...rest
}: AnimatedHeadingProps) {
  const framer = useFramerMotion('idle');
  const prefersReducedMotion = useReducedMotion();
  // Resolve target component (Framer motion element or fallback heading)
  const motionModule = framer?.motion as Record<string, ComponentType<Record<string, unknown>>> | undefined;
  const MotionComponent =
    (motionModule?.[as] ??
      motionModule?.h2 ??
      motionModule?.div ??
      (fallbackMotion[as] ?? fallbackMotion.h2)) as ComponentType<Record<string, unknown>>;

  // Calculate offset dynamically on mount; we avoid resize listeners to keep runtime overhead minimal.
  const [offset, setOffset] = useState(() => distance);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    const width = window.innerWidth;
    const intensity =
      DISTANCE_BREAKPOINTS.find(({ minWidth }) => width >= minWidth)?.intensity ??
      DISTANCE_BREAKPOINTS[DISTANCE_BREAKPOINTS.length - 1].intensity;

    setOffset(distance * intensity);
  }, [distance, prefersReducedMotion]);

  const hiddenTransform = useMemo(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    switch (direction) {
      case 'left':
        return { x: -offset, y: 0 };
      case 'right':
        return { x: offset, y: 0 };
      case 'down':
        return { x: 0, y: -offset };
      case 'up':
      default:
        return { x: 0, y: offset };
    }
  }, [direction, offset, prefersReducedMotion]);

  const animationProps =
    prefersReducedMotion || !motionModule
      ? {}
      : {
          initial: hiddenTransform,
          whileInView: { x: 0, y: 0 },
          viewport: { once, amount: 0.5 },
          transition: {
            type: 'spring',
            stiffness: 160,
            damping: 22,
            mass: 0.9,
            delay,
          },
        };

  // For non-Framer fallback, ensure we don't pass motion-specific props
  if (!motionModule || prefersReducedMotion) {
    const FallbackComponent = fallbackMotion[as] ?? fallbackMotion.h2;

    return (
      <FallbackComponent className={className} {...rest}>
        {children}
      </FallbackComponent>
    );
  }

  return (
    <MotionComponent {...animationProps} className={className} {...rest}>
      {children}
    </MotionComponent>
  );
}
