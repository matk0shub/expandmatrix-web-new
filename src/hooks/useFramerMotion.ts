'use client';

import { useEffect, useRef, useState } from 'react';

type MotionModule = typeof import('framer-motion');

let motionModulePromise: Promise<MotionModule> | null = null;

const loadFramerModule = async () => {
  if (!motionModulePromise) {
    motionModulePromise = import('framer-motion');
  }

  return motionModulePromise;
};

type LoadStrategy = 'instant' | 'idle' | 'interaction';

type InteractionWindow = Window & {
  requestIdleCallback?: (
    callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const IDLE_TIMEOUT = 2500;

export function useFramerMotion(strategy: LoadStrategy = 'instant') {
  const [module, setModule] = useState<MotionModule | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (module || startedRef.current) {
      return;
    }

    let cancelled = false;
    const startLoad = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      loadFramerModule()
        .then((mod) => {
          if (!cancelled) {
            setModule(mod);
          }
        })
        .catch(() => {
          startedRef.current = false;
        });
    };

    if (strategy === 'instant') {
      startLoad();
      return () => {
        cancelled = true;
      };
    }

    if (typeof window === 'undefined') {
      return () => {
        cancelled = true;
      };
    }

    const win = window as InteractionWindow;

    if (strategy === 'interaction') {
      const handler = () => {
        cleanup();
        startLoad();
      };

      const cleanup = () => {
        window.removeEventListener('pointerdown', handler);
        window.removeEventListener('keydown', handler);
        window.removeEventListener('scroll', handler, true);
      };

      window.addEventListener('pointerdown', handler, { once: true });
      window.addEventListener('keydown', handler, { once: true });
      window.addEventListener('scroll', handler, { once: true, capture: true });

      return () => {
        cancelled = true;
        cleanup();
      };
    }

    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    if (typeof win.requestIdleCallback === 'function') {
      idleHandle = win.requestIdleCallback(startLoad, { timeout: IDLE_TIMEOUT });
    } else {
      timeoutHandle = window.setTimeout(startLoad, IDLE_TIMEOUT);
    }

    return () => {
      cancelled = true;
      if (idleHandle && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [module, strategy]);

  return module;
}
