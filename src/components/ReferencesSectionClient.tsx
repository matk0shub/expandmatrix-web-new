'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion, FallbackAnimatePresence } from '@/utils/motionFallback';
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
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;
  const AnimatePresence = framer?.AnimatePresence ?? FallbackAnimatePresence;
  const prefersReducedMotion = useReducedMotion();
  const orderedReferences = useMemo(
    () => references.slice().sort((a, b) => a.order - b.order),
    [references],
  );
  const [activeIndex, setActiveIndex] = useState(0);

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
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : orderedReferences.length - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
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

  if (!orderedReferences.length) {
    return null;
  }

  return (
    <section
      className="relative min-h-screen bg-black text-white rounded-3xl overflow-hidden mx-4 py-24 md:py-40 lg:py-48"
      id="references"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={copy.metaName} />
      <meta itemProp="description" content={copy.metaDescription} />

      <div className="relative flex justify-center">
        <div className="relative w-[min(90vw,1600px)] h-[min(90vh,900px)] rounded-[40px] overflow-hidden bg-black/60 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            {activeReference && (
              <ReferenceBackground
                key={activeReference.id}
                reference={activeReference}
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col lg:flex-row max-w-full px-4 sm:px-8 lg:px-12">
            <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0 relative z-10 min-h-0">
              <div className="max-w-md w-full flex flex-col min-h-0">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                  className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-6 lg:mb-8 flex-shrink-0"
                >
                  {copy.overline}
                </MotionDiv>

                <div className="flex-1 min-h-0 overflow-hidden">
                  <ReferenceList
                    references={orderedReferences}
                    activeIndex={activeIndex}
                    onSelect={setActiveIndex}
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
            </div>

            <div className="w-full lg:w-1/2 relative mt-auto lg:mt-0">
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
    </section>
  );
}
