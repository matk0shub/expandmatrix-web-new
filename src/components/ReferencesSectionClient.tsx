'use client';

import { useState, useEffect, useMemo, useCallback, type CSSProperties, type ReactElement } from 'react';
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

export default function ReferencesSectionClient({
  references,
  copy,
}: ReferencesSectionClientProps): ReactElement | null {
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

  useEffect(() => {
    if (orderedReferences.length < 2) return;
    if (prefersReducedMotion || hasInteracted) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % orderedReferences.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [orderedReferences.length, prefersReducedMotion, hasInteracted]);

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

  const referencesPadding = 'clamp(24px, 4vw, 96px)';
  const sectionStyle = {
    '--references-padding': referencesPadding,
  } as CSSProperties;

  const backgroundInsetStyle = {
    inset: 'var(--references-padding)',
  } as CSSProperties;

  const contentPaddingStyle = {
    paddingInline: 'var(--references-padding)',
  } as CSSProperties;

  return (
    <section
      className="relative my-24 text-white"
      id="references"
      itemScope
      itemType="https://schema.org/ItemList"
      style={sectionStyle}
    >
      <meta itemProp="name" content={copy.metaName} />
      <meta itemProp="description" content={copy.metaDescription} />

      <div className="relative min-h-screen overflow-hidden rounded-[48px] bg-black">
        <div
          className="pointer-events-none absolute overflow-hidden rounded-[40px]"
          style={backgroundInsetStyle}
        >
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

        <div
          className="relative z-10 py-16 sm:py-20 lg:py-32"
          style={contentPaddingStyle}
        >
          <div className="mx-auto w-full max-w-[1780px]">
            <div className="flex flex-col gap-10 sm:gap-12 rounded-[32px] px-4 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-start lg:gap-16 lg:px-10 lg:py-12 bg-black/40 backdrop-blur-md ring-1 ring-white/5">
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-300">
                  {copy.overline}
                </p>
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

              <div className="w-full lg:w-1/2">
                <div className="flex justify-center lg:justify-end">
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
          </div>
        </div>
      </div>
    </section>
  );
}
