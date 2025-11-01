'use client';

import type { ComponentType, HTMLAttributes } from 'react';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fallbackMotion } from '@/utils/motionFallback';

const DEFAULT_DISTANCE = 32;

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type AnimatedHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
};

type MotionLike = Record<string, ComponentType<Record<string, unknown>>>;

export default function AnimatedHeading({
  as = 'h2',
  delay = 0,
  direction = 'up',
  distance = DEFAULT_DISTANCE,
  once = true,
  className,
  children,
  ...rest
}: AnimatedHeadingProps) {
  const framer = useFramerMotion();
  const prefersReducedMotion = useReducedMotion();
  const motion = (framer?.motion ?? fallbackMotion) as MotionLike;
  const MotionComponent = (motion[as] ?? motion.h2 ?? motion.div) as ComponentType<Record<string, unknown>>;

    const initial = prefersReducedMotion
      ? undefined
      : (() => {
          switch (direction) {
            case 'left':
              return { opacity: 0, x: -distance };
            case 'right':
              return { opacity: 0, x: distance };
            case 'down':
              return { opacity: 0, y: -distance };
            case 'up':
            default:
              return { opacity: 0, y: distance };
          }
        })();

    const animate = prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 };
    const viewport = prefersReducedMotion ? undefined : { once, amount: 0.6 };
    const transition = prefersReducedMotion
      ? undefined
      : { duration: 0.8, ease: 'easeOut', delay };

  return (
    <MotionComponent
      initial={initial}
      whileInView={animate}
      viewport={viewport}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
