'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ReferenceList from './ReferenceList';
import ReferenceBackground from './ReferenceBackground';
import ReferenceStatsCard from './ReferenceStatsCard';

export interface Reference {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  instagramUrl?: string;
  image: {
    id: string;
    url: string;
    alt?: string;
  };
  metrics: Array<{
    label: string;
    value: string;
  }>;
  order: number;
  isFeatured: boolean;
}

interface ReferencesSectionProps {
  references: Reference[];
}

export default function ReferencesSection({ references }: ReferencesSectionProps) {
  const t = useTranslations('sections.references');
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: intersectionRef } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Filter and sort references
  const featuredReferences = references
    .filter(ref => ref.isFeatured)
    .sort((a, b) => a.order - b.order);

  const activeReference = featuredReferences[activeIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isPinned) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : featuredReferences.length - 1
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => 
          prev < featuredReferences.length - 1 ? prev + 1 : 0
        );
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Could trigger additional action if needed
        break;
    }
  }, [isPinned, featuredReferences.length]);

  // Handle scroll-based pinning
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const shouldPin = rect.top <= 0 && rect.bottom > window.innerHeight;
      setIsPinned(shouldPin);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (isPinned) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPinned, handleKeyDown]);

  // Handle scroll-based reference switching
  useEffect(() => {
    if (!isPinned || !sectionRef.current) return;

    const sectionElement = sectionRef.current;
    const sectionTop = sectionElement.offsetTop;
    const sectionHeight = sectionElement.offsetHeight;
    const totalScrollHeight = sectionHeight * featuredReferences.length;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const relativeScroll = scrollY - sectionTop;
      
      // Calculate progress through the pinned section
      const scrollProgress = Math.max(0, Math.min(1, relativeScroll / totalScrollHeight));
      const newIndex = Math.floor(scrollProgress * featuredReferences.length);
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < featuredReferences.length) {
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPinned, activeIndex, featuredReferences.length]);

  if (!featuredReferences.length) {
    return null;
  }

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        intersectionRef.current = el;
      }}
      className="relative min-h-screen bg-black text-white rounded-3xl overflow-hidden mx-4 my-8"
      id="references"
    >
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
        <div className="absolute inset-0 flex max-w-[1780px] mx-auto">
          {/* Left side - Reference list */}
          <div className="w-1/2 flex flex-col justify-center px-8 lg:px-16 relative z-10">
            <div className="max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-8 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
              >
                {t('overline')}
              </motion.div>
              
              <ReferenceList
                references={featuredReferences}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>

          {/* Right side - Stats card */}
          <div className="w-1/2 relative">
            <AnimatePresence>
              {activeReference && (
                <ReferenceStatsCard
                  key={`stats-${activeReference.id}`}
                  metrics={activeReference.metrics}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Spacer for scroll height - only when pinned */}
      {isPinned && <div style={{ height: `${featuredReferences.length * 100}vh` }} />}
    </section>
  );
}