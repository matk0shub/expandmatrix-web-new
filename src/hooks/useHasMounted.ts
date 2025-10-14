'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if component has mounted on the client side
 * Useful for preventing hydration mismatches with Framer Motion and other client-only features
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
