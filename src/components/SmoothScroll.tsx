'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DESKTOP_QUERY = '(min-width: 1024px)';
const IS_IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);


type LenisLike = {
  raf: (time: number) => void;
  destroy: () => void;
  on?: (event: string, cb: (...args: unknown[]) => unknown) => unknown;
  off?: (event: string, cb: (...args: unknown[]) => unknown) => unknown;
};

export default function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    if (!desktopMedia.matches || IS_IOS) {
      return undefined;
    }

    let disposed = false;
    let lenisInstance: LenisLike | undefined;
    let rafId: number | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let loadHandler: (() => void) | undefined;
    let scrollCleanup: (() => void) | undefined;

    const dispose = () => {
      if (disposed) {
        return;
      }

      disposed = true;

      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
      }

      if (typeof window.cancelIdleCallback === 'function' && idleId) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      if (scrollCleanup) {
        scrollCleanup();
      }

      lenisInstance?.destroy();
      desktopMedia.removeEventListener('change', handleDesktopChange);
    };

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        dispose();
      }
    };

    desktopMedia.addEventListener('change', handleDesktopChange);

    const startLoop = () => {
      const raf = (time: number) => {
        if (disposed) {
          return;
        }
        lenisInstance?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    };

    const initializeSmoothScroll = async () => {
      const { default: Lenis } = await import('lenis');
      if (disposed) {
        return;
      }

      lenisInstance = (new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      })) as unknown as LenisLike;

      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        if (disposed) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const onLenisScroll = () => ScrollTrigger.update();
        lenisInstance.on?.('scroll', onLenisScroll);

        const onRefresh = () => {
          document.documentElement.style.scrollBehavior = 'auto';
        };
        ScrollTrigger.addEventListener('refresh', onRefresh);
        ScrollTrigger.refresh();

        scrollCleanup = () => {
          lenisInstance?.off?.('scroll', onLenisScroll);
          ScrollTrigger.removeEventListener('refresh', onRefresh);
        };
      } catch {
        scrollCleanup = () => undefined;
      }

      startLoop();
    };

    const queueInitialization = () => {
      const schedule = () => {
        if (typeof window.requestIdleCallback === 'function') {
          idleId = window.requestIdleCallback(() => {
            initializeSmoothScroll().catch(() => dispose());
          });
        } else {
          timeoutId = setTimeout(() => {
            initializeSmoothScroll().catch(() => dispose());
          }, 0);
        }
      };

      if (document.readyState === 'complete') {
        schedule();
      } else {
        loadHandler = () => schedule();
        window.addEventListener('load', loadHandler, { once: true });
      }
    };

    queueInitialization();

    return dispose;
  }, [prefersReducedMotion]);

  return null;
}
