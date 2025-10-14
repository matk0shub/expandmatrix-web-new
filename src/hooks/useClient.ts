'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if component is running on client side
 * Useful for preventing hydration mismatches
 */
export function useClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
