'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const STORAGE_PREFIX = 'scroll-pos:';
const MAX_ATTEMPTS = 20;

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const storageKey = useMemo(() => {
    const query = searchParams?.toString();
    return `${STORAGE_PREFIX}${pathname || '/'}${query ? `?${query}` : ''}`;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.history === 'undefined') {
      return;
    }

    const { history } = window;
    const previousSetting =
      typeof history.scrollRestoration !== 'undefined' ? history.scrollRestoration : undefined;

    try {
      if (previousSetting !== undefined) {
        history.scrollRestoration = 'manual';
      }
    } catch {
      // Ignored
    }

    return () => {
      if (previousSetting !== undefined) {
        try {
          history.scrollRestoration = previousSetting;
        } catch {
          // Ignored
        }
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savePosition = () => {
      try {
        window.sessionStorage.setItem(storageKey, String(window.scrollY));
      } catch {
        /* ignore storage errors (e.g., Safari private mode) */
      }
    };

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        savePosition();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', savePosition);
    window.addEventListener('pagehide', savePosition);

    return () => {
      savePosition();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', savePosition);
      window.removeEventListener('pagehide', savePosition);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Avoid overriding anchor navigation
    if (window.location.hash) {
      return;
    }

    let rafId: number | null = null;
    let attempts = 0;

    const restore = () => {
      attempts += 1;

      let storedValue: string | null = null;
      try {
        storedValue = window.sessionStorage.getItem(storageKey);
      } catch {
        storedValue = null;
      }

      if (!storedValue) {
        return;
      }

      const target = Number.parseFloat(storedValue);
      if (!Number.isFinite(target)) {
        return;
      }

      const maxScrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScrollable < target && attempts < MAX_ATTEMPTS) {
        rafId = window.requestAnimationFrame(restore);
        return;
      }

      const nextPosition = Math.max(0, Math.min(target, Math.max(0, maxScrollable)));
      window.scrollTo(0, nextPosition);
    };

    rafId = window.requestAnimationFrame(restore);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [storageKey]);

  return null;
}
