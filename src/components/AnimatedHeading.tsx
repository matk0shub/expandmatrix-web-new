'use client';

import type { ComponentType, HTMLAttributes } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fallbackMotion } from '@/utils/motionFallback';

const DEFAULT_DISTANCE = 200;

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
  direction = 'right',
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
  const elementRef = useRef<HTMLHeadingElement | null>(null);

  const computeDistance = useCallback((width?: number) => {
    if (!width) {
      return distance;
    }

    if (width >= 1440) {
      return distance;
    }

    if (width >= 1024) {
      return distance * 0.8;
    }

    if (width >= 768) {
      return distance * 0.6;
    }

    return distance * 0.45;
  }, [distance]);

  const [effectiveDistance, setEffectiveDistance] = useState(() =>
    typeof window === 'undefined' ? distance : computeDistance(window.innerWidth),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const updateDistance = () => {
      setEffectiveDistance(computeDistance(window.innerWidth));
    };

    updateDistance();
    window.addEventListener('resize', updateDistance);
    return () => {
      window.removeEventListener('resize', updateDistance);
    };
  }, [prefersReducedMotion, computeDistance]);

  const [isInView, setIsInView] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) {
      return;
    }

    const node = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion, once]);

  const hiddenTransform = useMemo(() => {
    switch (direction) {
      case 'left':
        return { x: -effectiveDistance, y: 0 };
      case 'right':
        return { x: effectiveDistance, y: 0 };
      case 'down':
        return { x: 0, y: -effectiveDistance };
      case 'up':
      default:
        return { x: 0, y: effectiveDistance };
    }
  }, [direction, effectiveDistance]);

  const visibleTransform = useMemo(() => ({ x: 0, y: 0 }), []);

  const animateProps = prefersReducedMotion
    ? {}
    : {
        initial: hiddenTransform,
        animate: isInView ? visibleTransform : hiddenTransform,
        transition: {
          type: 'spring',
          stiffness: 140,
          damping: 18,
          mass: 0.8,
          delay,
        },
      };

  return (
    <MotionComponent
      ref={elementRef as unknown as React.Ref<HTMLHeadingElement>}
      {...animateProps}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
