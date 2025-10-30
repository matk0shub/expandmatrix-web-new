'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import HeroStatic from './HeroStatic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HeroAnimated = dynamic(() => import('./HeroAnimated'), {
  ssr: false,
  loading: () => <HeroStatic />,
});

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion) {
      setIsMounted(true);
    }
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || !isMounted) {
    return <HeroStatic />;
  }

  return <HeroAnimated />;
}
