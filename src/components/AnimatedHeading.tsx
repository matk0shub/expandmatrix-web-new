'use client';

import { useEffect, useMemo, useRef, useState, type HTMLAttributes } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DEFAULT_DISTANCE = 200;

const DISTANCE_BREAKPOINTS: Array<{ minWidth: number; intensity: number }> = [
  { minWidth: 1440, intensity: 1 },
  { minWidth: 1024, intensity: 0.8 },
  { minWidth: 768, intensity: 0.6 },
  { minWidth: 0, intensity: 0.45 },
];

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type AnimatedHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
  const prefersReducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(() => distance);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    let frame: number | undefined;

    const updateOffset = () => {
      const width = window.innerWidth;
      const intensity =
        DISTANCE_BREAKPOINTS.find(({ minWidth }) => width >= minWidth)?.intensity ??
        DISTANCE_BREAKPOINTS[DISTANCE_BREAKPOINTS.length - 1].intensity;

      setOffset(distance * intensity);
    };

    const handleResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateOffset);
    };

    updateOffset();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
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

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: clamp(0.5, 0, 1) },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, prefersReducedMotion]);

  const transform = hiddenTransform
    ? `translate3d(${hiddenTransform.x ?? 0}px, ${hiddenTransform.y ?? 0}px, 0)`
    : undefined;

  const targetTransform = 'translate3d(0, 0, 0)';

  const transition = prefersReducedMotion
    ? 'none'
    : `transform 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`;

  const Element = as;

  return (
    <Element
      ref={elementRef as never}
      className={className}
      style={{
        transform: isVisible ? targetTransform : transform,
        transition,
        willChange: prefersReducedMotion ? undefined : 'transform',
      }}
      {...rest}
    >
      {children}
    </Element>
  );
}
