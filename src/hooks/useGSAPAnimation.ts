'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from './useReducedMotion';
import { useIntersectionObserver } from './useIntersectionObserver';

interface GSAPAnimationOptions {
  selector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for GSAP animations with intersection observer
 * Automatically handles reduced motion preferences
 */
export function useGSAPAnimation(options: GSAPAnimationOptions = {}) {
  const {
    selector = '.animate-item',
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    stagger = 0.1,
    delay = 0,
    duration = 0.8,
    ease = 'power3.out',
    triggerOnce = true
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const { ref, isIntersecting, hasTriggered } = useIntersectionObserver({ 
    threshold: 0.3, 
    triggerOnce 
  });

  useEffect(() => {
    if (!isIntersecting || (triggerOnce && hasTriggered)) return;
    
    const element = ref.current;
    if (!element) return;

    const targets = element.querySelectorAll(selector);
    if (targets.length === 0) return;

    if (prefersReducedMotion) {
      // Apply final state immediately for reduced motion
      gsap.set(targets, to);
      return;
    }

    // Animate with GSAP
    gsap.fromTo(
      targets,
      from,
      {
        ...to,
        duration,
        stagger,
        delay,
        ease,
      }
    );
  }, [isIntersecting, hasTriggered, prefersReducedMotion, selector, from, to, stagger, delay, duration, ease, triggerOnce, ref]);

  return { ref };
}
