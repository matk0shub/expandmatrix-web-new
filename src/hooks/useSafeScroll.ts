'use client';

import { useScroll, UseScrollOptions } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useHasMounted } from './useHasMounted';

interface UseSafeScrollOptions {
  target?: React.RefObject<HTMLElement | null>;
  offset?: UseScrollOptions['offset'];
  container?: React.RefObject<HTMLElement | null>;
}

/**
 * Safe wrapper around useScroll that prevents hydration errors
 * Only initializes scroll tracking after component has mounted
 */
export function useSafeScroll(options: UseSafeScrollOptions = {}) {
  const hasMounted = useHasMounted();
  const [isReady, setIsReady] = useState(false);
  
  // Use a stable ref that's always available
  const stableRef = useRef<HTMLDivElement>(null);
  
  // Only use the target ref after hydration
  const targetRef = hasMounted && options.target?.current ? options.target : stableRef;
  
  // Always call useScroll hook (Rules of Hooks compliance)
  const scrollResult = useScroll({
    target: isReady ? targetRef : undefined,
    offset: options.offset || ["start end", "end start"],
    container: options.container,
  });

  // Set ready state after a brief delay to ensure DOM is fully hydrated
  useEffect(() => {
    if (hasMounted) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [hasMounted]);

  return {
    ...scrollResult,
    hasMounted,
    isReady,
  };
}
