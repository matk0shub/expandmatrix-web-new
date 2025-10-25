'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import HeroStatic from './HeroStatic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HeroAnimated = dynamic(() => import('./HeroAnimated'), {
  ssr: false,
  loading: () => <HeroStatic />,
});

type IdleHandle = ReturnType<typeof setTimeout> | number;

const scheduleIdleCallback = (cb: () => void): IdleHandle => {
  if (typeof window !== 'undefined') {
    const win = window as Window & typeof globalThis & {
      requestIdleCallback?: (fn: () => void) => number;
    };

    if (typeof win.requestIdleCallback === 'function') {
      return win.requestIdleCallback(cb);
    }

    return win.setTimeout(cb, 200);
  }

  return setTimeout(cb, 200);
};

const cancelIdleCallback = (handle: IdleHandle) => {
  if (typeof window !== 'undefined') {
    const win = window as Window & typeof globalThis & {
      cancelIdleCallback?: (id: IdleHandle) => void;
    };

    if (typeof win.cancelIdleCallback === 'function') {
      win.cancelIdleCallback(handle);
      return;
    }

    win.clearTimeout(handle as ReturnType<typeof setTimeout>);
    return;
  }

  clearTimeout(handle as ReturnType<typeof setTimeout>);
};

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [shouldRenderAnimated, setShouldRenderAnimated] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    const id = scheduleIdleCallback(() => {
      if (!cancelled) {
        setShouldRenderAnimated(true);
      }
    });

    return () => {
      cancelled = true;
      cancelIdleCallback(id);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || !shouldRenderAnimated) {
    return <HeroStatic />;
  }

  return <HeroAnimated />;
}
