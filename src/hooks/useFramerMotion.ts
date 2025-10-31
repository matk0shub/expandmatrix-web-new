'use client';

import { useEffect, useState } from 'react';

type MotionModule = typeof import('framer-motion');

let motionModulePromise: Promise<MotionModule> | null = null;

export function useFramerMotion() {
  const [module, setModule] = useState<MotionModule | null>(null);

  useEffect(() => {
    if (!motionModulePromise) {
      motionModulePromise = import('framer-motion');
    }

    motionModulePromise.then((mod) => {
      setModule(mod);
    });
  }, []);

  return module;
}
