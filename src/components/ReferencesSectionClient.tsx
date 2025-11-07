'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { FallbackAnimatePresence } from '@/utils/motionFallback';
import ReferenceList from './ReferenceList';
import ReferenceBackground from './ReferenceBackground';
import ReferenceStatsCard from './ReferenceStatsCard';
import type { Reference } from '@/types/references';

interface ReferencesSectionCopy {
  metaName: string;
  metaDescription: string;
  overline: string;
  selectReference: string | ((name: string) => string);
  instagram: string;
  instagramAria: string | ((name: string) => string);
  website: string;
  websiteAria: string | ((name: string) => string);
  impactHeading: string;
}

interface ReferencesSectionClientProps {
  references: Reference[];
  copy: ReferencesSectionCopy;
}

export default function ReferencesSectionClient({ references, copy }: ReferencesSectionClientProps) {
  const framer = useFramerMotion('idle');
  const AnimatePresence = framer?.AnimatePresence ?? FallbackAnimatePresence;
  const prefersReducedMotion = useReducedMotion();
  const orderedReferences = useMemo(
    () => references.slice().sort((a, b) => a.order - b.order),
    [references],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(orderedReferences.length - 1, 0)));
  }, [orderedReferences.length]);

  const activeReference = orderedReferences[activeIndex];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!orderedReferences.length) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setHasInteracted(true);
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : orderedReferences.length - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setHasInteracted(true);
          setActiveIndex((prev) => (prev < orderedReferences.length - 1 ? prev + 1 : 0));
          break;
        default:
          break;
      }
    },
    [orderedReferences.length],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setHasInteracted(true);
      setActiveIndex(index);
    },
    [activeIndex],
  );

  if (!orderedReferences.length) {
    return null;
  }

  return (
    <section
      className="relative mx-4 min-h-screen overflow-hidden rounded-[48px] bg-black text-white py-24 md:py-40 lg:py-48"
      id="references"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={copy.metaName} />
      <meta itemProp="description" content={copy.metaDescription} />

      <div className="pointer-events-none absolute inset-[clamp(8px,2vw,32px)] rounded-[40px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeReference && (
            <ReferenceBackground
              key={activeReference.id}
              reference={activeReference}
              prefersReducedMotion={prefersReducedMotion}
              animateOnChange={hasInteracted}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1780px] px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex flex-col gap-12 rounded-[32px] px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-300">
              {copy.overline}
            </p>
            <div className="mt-8">
              <ReferenceList
                references={orderedReferences}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                prefersReducedMotion={prefersReducedMotion}
                copy={{
                  selectReference: copy.selectReference,
                  instagram: copy.instagram,
                  instagramAria: copy.instagramAria,
                  website: copy.website,
                  websiteAria: copy.websiteAria,
                }}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              {activeReference && (
                <ReferenceStatsCard
                  key={`stats-${activeReference.id}`}
                  metrics={activeReference.metrics}
                  prefersReducedMotion={prefersReducedMotion}
                  heading={copy.impactHeading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
