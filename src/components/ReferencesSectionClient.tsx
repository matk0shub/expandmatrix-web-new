'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion, FallbackAnimatePresence } from '@/utils/motionFallback';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const boundsRef = useRef({ start: 0, height: 0 });
  const scrollRafRef = useRef<number | null>(null);
  const orderedLengthRef = useRef(0);
  const { ref: intersectionRef } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Sort references
  const orderedReferences = useMemo(
    () => references.slice().sort((a, b) => a.order - b.order),
    [references],
  );

  orderedLengthRef.current = orderedReferences.length;

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(orderedReferences.length - 1, 0)));
  }, [orderedReferences.length]);

  const activeReference = orderedReferences[activeIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isPinned) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : orderedReferences.length - 1
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => 
          prev < orderedReferences.length - 1 ? prev + 1 : 0
        );
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Could trigger additional action if needed
        break;
    }
  }, [isPinned, orderedReferences.length]);

  // Measure section bounds whenever size changes
  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      boundsRef.current = { start, height: rect.height };
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [orderedReferences.length]);

  // Handle keyboard events
  useEffect(() => {
    if (isPinned) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPinned, handleKeyDown]);

  // Handle scroll-based pinning & reference switching
  useEffect(() => {
    const updateFromScroll = () => {
      const { start, height } = boundsRef.current;
      if (!height) {
        setIsPinned(false);
        return;
      }

      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const end = start + height;
      const pinStart = start;
      const pinEnd = Math.max(start, end - winH);
      const shouldPin = scrollY >= pinStart && scrollY < pinEnd;
      setIsPinned(shouldPin);

      if (!shouldPin) {
        return;
      }

      const totalPinnedDistance = height * orderedLengthRef.current;
      if (totalPinnedDistance <= 0) return;

      const relativeScroll = scrollY - start;
      const progress = Math.max(
        0,
        Math.min(1, relativeScroll / totalPinnedDistance),
      );
      const newIndex = Math.min(
        orderedLengthRef.current - 1,
        Math.floor(progress * orderedLengthRef.current),
      );

      setActiveIndex((prev) => (prev === newIndex ? prev : newIndex));
    };

    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateFromScroll();
      });
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  if (!orderedReferences.length) {
    return null;
  }

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        intersectionRef.current = el;
      }}
      className="relative min-h-screen bg-black text-white rounded-3xl overflow-hidden mx-4 py-24 md:py-40 lg:py-48"
      id="references"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={copy.metaName} />
      <meta itemProp="description" content={copy.metaDescription} />
      {/* Full-width background images */}
      <div className={`${isPinned ? 'fixed inset-0 z-10' : 'relative'} h-screen`}>
        <AnimatePresence mode="wait">
          {activeReference && (
            <ReferenceBackground
              key={activeReference.id}
              reference={activeReference}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </AnimatePresence>

        {/* Content overlay with max-width constraint */}
        <div className="absolute inset-0 flex flex-col lg:flex-row max-w-[1780px] mx-auto">
          {/* Left side - Reference list */}
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

          {/* Right side - Stats card */}
          <div className="w-full lg:w-1/2 relative mt-auto lg:mt-0">
            <AnimatePresence>
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

      {/* Spacer for scroll height - only when pinned */}
      {isPinned && <div style={{ height: `${orderedReferences.length * 100}vh` }} />}
    </section>
  );
}
