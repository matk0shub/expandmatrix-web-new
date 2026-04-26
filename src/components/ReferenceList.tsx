'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect, useRef, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Globe, Instagram } from 'lucide-react';
import ScrambleText from './ScrambleText';
import type { Reference } from '@/types/references';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';

interface ReferenceListCopy {
  selectReference: string | ((name: string) => string);
  instagram: string;
  instagramAria: string | ((name: string) => string);
  website: string;
  websiteAria: string | ((name: string) => string);
}

interface ReferenceListProps {
  references: Reference[];
  activeIndex: number;
  onSelect: (index: number) => void;
  prefersReducedMotion: boolean;
  copy: ReferenceListCopy;
}

export default function ReferenceList({
  references,
  activeIndex,
  onSelect,
  prefersReducedMotion,
  copy,
}: ReferenceListProps) {
  const framer = useFramerMotion('idle');
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');
  const previousIndexRef = useRef(activeIndex);
  const formatLabel = useCallback(
    (template: string | ((name: string) => string), name: string) => {
      if (typeof template === 'function') {
        return template(name);
      }

      return template.replace(/\{name\}/g, name);
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    const prev = previousIndexRef.current;
    if (prev === activeIndex || references.length <= 1) return;
    const total = references.length;
    const forward = (prev + 1 + total) % total === activeIndex;
    setTransitionDirection(forward ? 'next' : 'prev');
    previousIndexRef.current = activeIndex;
  }, [activeIndex, references.length]);

  const renderReference = useCallback(
    (reference: Reference, index: number) => {
      const isActive = index === activeIndex;
      const isHovered = hoveredIndex === index;
      const shouldAnimate = isActive || isHovered;

      return (
        <MotionDiv
          key={reference.id}
          className={`cursor-pointer transition-all duration-300 ${
            isActive ? 'opacity-100' : 'opacity-60 sm:opacity-50'
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onSelect(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(index);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={formatLabel(copy.selectReference, reference.name)}
          aria-pressed={isActive}
          whileHover={{}}
          whileTap={{}}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Small logo chip. Each reference's image is now a self-contained
                  square (square brand mark with its own background), so we use
                  a transparent wrapper and let the logo's own shape carry the
                  identity. Active state gets a subtle outer glow. */}
              {reference.image?.url && (
                <div
                  className={`relative h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 transition-all duration-300 ${
                    isActive
                      ? 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                      : 'opacity-70'
                  }`}
                >
                  <Image
                    src={reference.image.url}
                    alt={reference.image.alt ?? reference.name}
                    fill
                    sizes="(min-width: 1024px) 80px, 64px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <ScrambleText
                  text={reference.name}
                  className={`font-bold transition-all duration-300 ${
                    isActive
                      ? 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white'
                      : 'text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200'
                  }`}
                  applyScramble={shouldAnimate && !prefersReducedMotion}
                  trigger="manual"
                />

                {reference.subtitle && (
                  <MotionDiv
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.3,
                      delay: prefersReducedMotion ? 0 : 0.1,
                    }}
                    className={`mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base transition-colors duration-300 ${
                      isActive ? 'text-gray-200' : 'text-gray-400'
                    }`}
                  >
                    {reference.subtitle}
                  </MotionDiv>
                )}
              </div>
            </div>

            {isActive && (
              <div className="flex flex-wrap gap-3">
                {reference.instagramUrl && (
                  <a
                    href={reference.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white sm:px-5 sm:text-sm ${
                      prefersReducedMotion
                        ? ''
                        : 'transform-gpu transition-transform hover:scale-[1.02] active:scale-[0.97]'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black`}
                    aria-label={formatLabel(copy.instagramAria, reference.name)}
                  >
                    <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{copy.instagram}</span>
                  </a>
                )}

                {reference.websiteUrl && (
                  <a
                    href={reference.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:px-5 sm:text-sm ${
                      prefersReducedMotion
                        ? ''
                        : 'transform-gpu transition-transform hover:scale-[1.02] active:scale-[0.97]'
                    } focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black`}
                    aria-label={formatLabel(copy.websiteAria, reference.name)}
                  >
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">{copy.website}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </MotionDiv>
      );
    },
    [
      MotionDiv,
      activeIndex,
      copy.instagram,
      copy.instagramAria,
      copy.selectReference,
      copy.website,
      copy.websiteAria,
      formatLabel,
      hoveredIndex,
      onSelect,
      prefersReducedMotion,
    ],
  );

  const goPrev = useCallback(() => {
    if (!references.length) return;
    onSelect((activeIndex - 1 + references.length) % references.length);
  }, [activeIndex, onSelect, references.length]);

  const goNext = useCallback(() => {
    if (!references.length) return;
    onSelect((activeIndex + 1) % references.length);
  }, [activeIndex, onSelect, references.length]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
      const SWIPE_THRESHOLD = 50;
      if (dx > SWIPE_THRESHOLD) goPrev();
      else if (dx < -SWIPE_THRESHOLD) goNext();
      touchStartX.current = null;
    },
    [goNext, goPrev],
  );

  if (isDesktop) {
    return (
      <div className="relative flex flex-col gap-4">
        <div className="space-y-4 lg:space-y-6 max-h-[72vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          {references.map((reference, index) => renderReference(reference, index))}
        </div>
      </div>
    );
  }

  // Mobile / tablet: single-card carousel with chevron prev/next + pagination
  // dots placed ABOVE the active reference (out of the photo's centerline).
  // CSS opacity transition only (no AnimatePresence) so nothing can get stuck
  // mid-exit when the user taps controls in quick succession.
  return (
    <div className="relative flex h-full flex-col gap-4">
      {references.length > 1 && (
        <div className="flex items-center justify-between gap-3 self-end">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d76b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Previous reference"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Reference selector">
            {references.map((reference, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={reference.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={formatLabel(copy.selectReference, reference.name)}
                  onClick={() => onSelect(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6 bg-[#00d76b]' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d76b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Next reference"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        className="relative min-h-[120px] sm:min-h-[140px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <MotionDiv
          key={activeIndex}
          initial={prefersReducedMotion ? false : {
            opacity: 0,
            x: transitionDirection === 'next' ? 24 : -24,
          }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: 'easeOut',
          }}
        >
          {references[activeIndex] && renderReference(references[activeIndex], activeIndex)}
        </MotionDiv>
      </div>
    </div>
  );
}
