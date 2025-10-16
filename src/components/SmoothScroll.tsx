'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number | undefined;
    let lenisInstance: { raf: (time: number) => void; destroy: () => void } | undefined;
    let isMounted = true;

    (async () => {
      const { default: Lenis } = await import('lenis');
      if (!isMounted) {
        return;
      }

      lenisInstance = new Lenis({
        duration: 1.1,
        // Slightly softer easing curve to keep scrolling responsive while smooth
        easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      });

      // Integrate GSAP ScrollTrigger with Lenis so markers and triggers are correct
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        // Update ScrollTrigger on every Lenis scroll
        // @ts-expect-error Lenis has runtime 'on' API
        lenisInstance.on?.('scroll', () => {
          ScrollTrigger.update();
        });

        // Ensure ScrollTrigger refresh accounts for smooth scrolling
        ScrollTrigger.addEventListener('refresh', () => {
          // Kick lenis once after layout changes so positions are up-to-date
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          lenisInstance && (document.documentElement.style.scrollBehavior = 'auto');
        });

        // Initial refresh after everything is set up
        ScrollTrigger.refresh();
      } catch {}

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        animationFrameId = window.requestAnimationFrame(raf);
      };

      animationFrameId = window.requestAnimationFrame(raf);
    })();

    return () => {
      isMounted = false;
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      lenisInstance?.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
