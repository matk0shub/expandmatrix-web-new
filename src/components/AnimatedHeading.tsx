'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type AnimatedHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  revealOnMount?: boolean;
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
  revealOnMount = false,
  className,
  children,
  ...rest
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const HeadingTag: HeadingTag = as;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [offset, setOffset] = useState(() => distance);
  const [isArmed, setIsArmed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }

    const width = window.innerWidth;
    const intensity =
      DISTANCE_BREAKPOINTS.find(({ minWidth }) => width >= minWidth)?.intensity ??
      DISTANCE_BREAKPOINTS[DISTANCE_BREAKPOINTS.length - 1].intensity;

    setOffset(distance * intensity);
  }, [distance, prefersReducedMotion]);

  useEffect(() => {
    if (revealOnMount) {
      return;
    }

    if (prefersReducedMotion || typeof window === 'undefined' || !headingRef.current) {
      setIsArmed(false);
      setIsVisible(true);
      return;
    }

    setIsArmed(true);
    setIsVisible(false);

    let observer: IntersectionObserver | null = null;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer?.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(headingRef.current);

    return () => {
      observer?.disconnect();
    };
  }, [once, prefersReducedMotion, revealOnMount]);

  const hiddenTransform = useMemo(() => {
    if (prefersReducedMotion) {
      return { x: 0, y: 0 };
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

  const style: CSSProperties = {
    ...(rest.style || {}),
    '--reveal-x': `${hiddenTransform.x}px`,
    '--reveal-y': `${hiddenTransform.y}px`,
    transitionDelay: `${delay}s`,
    animationDelay: revealOnMount ? `${delay}s` : undefined,
  } as CSSProperties;

  const classes = [className, 'heading-reveal'];
  if (revealOnMount) {
    classes.push('heading-reveal--mount');
  }
  if (!revealOnMount && isArmed && !prefersReducedMotion) {
    classes.push('heading-reveal--armed');
  }
  if (!revealOnMount && (isVisible || prefersReducedMotion)) {
    classes.push('heading-reveal--visible');
  }

  return (
    <HeadingTag ref={headingRef} className={classes.filter(Boolean).join(' ')} style={style} {...rest}>
      {children}
    </HeadingTag>
  );
}
