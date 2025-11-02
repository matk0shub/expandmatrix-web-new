'use client';

import { useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import type { ComponentType } from 'react';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fallbackMotion } from '@/utils/motionFallback';

type Direction = 'up' | 'down' | 'left' | 'right';

type AnimatedRevealProps<T extends keyof typeof fallbackMotion = 'div'> =
  HTMLAttributes<HTMLElement> & {
    as?: T;
    delay?: number;
    direction?: Direction;
    distance?: number;
    once?: boolean;
    viewportAmount?: number;
  };

const DEFAULT_DISTANCE = 200;

const DISTANCE_BREAKPOINTS: Array<{ minWidth: number; intensity: number }> = [
  { minWidth: 1536, intensity: 1 },
  { minWidth: 1280, intensity: 0.85 },
  { minWidth: 1024, intensity: 0.7 },
  { minWidth: 768, intensity: 0.55 },
  { minWidth: 0, intensity: 0.4 },
];

export default function AnimatedReveal<T extends keyof typeof fallbackMotion = 'div'>({
  as,
  delay = 0,
  direction = 'up',
  distance = DEFAULT_DISTANCE,
  once = true,
  viewportAmount = 0.55,
  className,
  children,
  ...rest
}: AnimatedRevealProps<T>) {
  const resolvedTag = as ?? ('div' as T);
  const framer = useFramerMotion();
  const prefersReducedMotion = useReducedMotion();

  const motionModule = framer?.motion as
    | Record<string, ComponentType<Record<string, unknown>>>
    | undefined;
  const MotionComponent =
    (motionModule?.[resolvedTag] ??
      motionModule?.div ??
      (fallbackMotion[resolvedTag] ?? fallbackMotion.div)) as ComponentType<
      Record<string, unknown>
    >;

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

  if (!motionModule || prefersReducedMotion) {
    const FallbackComponent =
      (fallbackMotion[resolvedTag] ?? fallbackMotion.div) as ComponentType<Record<string, unknown>>;

    return (
      <FallbackComponent className={className} {...rest}>
        {children}
      </FallbackComponent>
    );
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, ...(hiddenTransform ?? {}) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: viewportAmount }}
      transition={{
        type: 'spring',
        stiffness: 160,
        damping: 22,
        mass: 0.9,
        delay,
      }}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
