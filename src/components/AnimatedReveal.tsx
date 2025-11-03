'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type Direction = 'up' | 'down' | 'left' | 'right';

type AnimatedRevealProps<T extends keyof JSX.IntrinsicElements = 'div'> =
  HTMLAttributes<HTMLElement> & {
    as?: T;
    delay?: number;
    direction?: Direction;
    distance?: number;
    once?: boolean;
    viewportAmount?: number;
    fade?: boolean;
  };

const DEFAULT_DISTANCE = 200;

const DISTANCE_BREAKPOINTS: Array<{ minWidth: number; intensity: number }> = [
  { minWidth: 1536, intensity: 1 },
  { minWidth: 1280, intensity: 0.85 },
  { minWidth: 1024, intensity: 0.7 },
  { minWidth: 768, intensity: 0.55 },
  { minWidth: 0, intensity: 0.4 },
];

export default function AnimatedReveal<T extends keyof JSX.IntrinsicElements = 'div'>({
  as,
  delay = 0,
  direction = 'up',
  distance = DEFAULT_DISTANCE,
  once = true,
  viewportAmount = 0.55,
  fade = true,
  className,
  children,
  ...rest
}: AnimatedRevealProps<T>) {
  const resolvedTag = as ?? ('div' as T);
  const prefersReducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLElement | null>(null);

  const [offset, setOffset] = useState(() => distance);

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

  const baseTransform = hiddenTransform
    ? `translate3d(${hiddenTransform.x ?? 0}px, ${hiddenTransform.y ?? 0}px, 0)`
    : 'translate3d(0, 0, 0)';

  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = elementRef.current;
    if (!node) {
      return;
    }

    let currentNode: HTMLElement | null = node;
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
      {
        threshold: clampViewportAmount(viewportAmount),
      },
    );

    observer.observe(currentNode);

    return () => {
      observer.disconnect();
      currentNode = null;
    };
  }, [once, prefersReducedMotion, viewportAmount]);

  const transition = prefersReducedMotion
    ? 'none'
    : `transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s${
        fade ? `, opacity 0.5s ease ${delay}s` : ''
      }`;

  const computedStyle: CSSProperties = {
    transform: isVisible ? 'translate3d(0, 0, 0)' : baseTransform,
    opacity: fade ? (isVisible ? 1 : 0) : 1,
    transition,
    willChange: prefersReducedMotion ? undefined : 'transform',
  };

  const { style, ...restProps } = rest;
  const mergedStyle = style
    ? ({ ...style, ...computedStyle } as CSSProperties)
    : computedStyle;

  const Element = resolvedTag as keyof JSX.IntrinsicElements;

  return (
    <Element
      ref={elementRef as never}
      className={className}
      style={mergedStyle}
      {...(restProps as Omit<HTMLAttributes<HTMLElement>, 'style'>)}
    >
      {children}
    </Element>
  );
}

function clampViewportAmount(amount: number): number {
  if (Number.isNaN(amount)) return 0.5;
  return Math.min(Math.max(amount, 0), 1);
}
