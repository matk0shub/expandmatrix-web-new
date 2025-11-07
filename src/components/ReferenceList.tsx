'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, Instagram } from 'lucide-react';
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
  const listRef = useRef<HTMLDivElement>(null);
  const formatLabel = useCallback(
    (template: string | ((name: string) => string), name: string) => {
      if (typeof template === 'function') {
        return template(name);
      }

      return template.replace(/\{name\}/g, name);
    },
    []
  );

  // Auto-scroll to keep active item visible
  useEffect(() => {
    if (!listRef.current || prefersReducedMotion) return;

    const activeElement = listRef.current.children[activeIndex] as HTMLElement;
    if (!activeElement) return;

    const containerRect = listRef.current.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();

    const isAbove = elementRect.top < containerRect.top;
    const isBelow = elementRect.bottom > containerRect.bottom;

    if (isAbove || isBelow) {
      // Keep the interaction focused on the list by scrolling only the container
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex, prefersReducedMotion]);

  return (
    <div className="relative h-full flex flex-col">
      <div
        ref={listRef}
        className="space-y-4 lg:space-y-6 flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
      {references.map((reference, index) => {
        const isActive = index === activeIndex;
        const isHovered = hoveredIndex === index;
        const shouldAnimate = isActive || isHovered;

        return (
          <MotionDiv
            key={reference.id}
            className={`cursor-pointer transition-all duration-300 ${
              isActive 
                ? 'opacity-100' 
                : 'opacity-50 sm:opacity-40 hover:opacity-80 sm:hover:opacity-70'
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
            <div className="flex items-center gap-4">
              {/* Company name */}
              <div className="flex-1">
                <div className="relative">
                  <div className="relative z-10">
                    <ScrambleText
                      text={reference.name}
                      className={`font-bold transition-all duration-300 ${
                        isActive 
                          ? 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white sm:drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] lg:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]' 
                          : 'text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 sm:drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] lg:drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]'
                      }`}
                      applyScramble={shouldAnimate && !prefersReducedMotion}
                      trigger="manual"
                    />
                    
                    {/* Subtitle */}
                  {reference.subtitle && (
                      <MotionDiv
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.6,
                          y: 0 
                        }}
                        transition={{ 
                          duration: prefersReducedMotion ? 0 : 0.3,
                          delay: prefersReducedMotion ? 0 : 0.1 
                        }}
                        className={`mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base transition-colors duration-300 ${
                          isActive 
                            ? 'text-gray-200 sm:drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]' 
                            : 'text-gray-400 sm:drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                        }`}
                      >
                        {reference.subtitle}
                      </MotionDiv>
                    )}
                  </div>
                </div>
              </div>

              {/* External links */}
              {isActive && (
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  {reference.instagramUrl && (
                    <a
                      href={reference.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black ${
                        prefersReducedMotion ? '' : 'transform-gpu transition-transform hover:scale-[1.02] active:scale-[0.97]'
                      }`}
                      aria-label={formatLabel(copy.instagramAria, reference.name)}
                    >
                      <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">{copy.instagram}</span>
                    </a>
                  )}

                  {reference.websiteUrl && (
                    <a
                      href={reference.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 bg-white/15 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black ${
                        prefersReducedMotion ? '' : 'transform-gpu transition-transform hover:scale-[1.02] active:scale-[0.97]'
                      }`}
                      aria-label={formatLabel(copy.websiteAria, reference.name)}
                    >
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">{copy.website}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </MotionDiv>
        );
      })}
      </div>
    </div>
  );
}
