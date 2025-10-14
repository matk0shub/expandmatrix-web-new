'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { Reference } from './ReferencesSection';

interface ReferenceListProps {
  references: Reference[];
  activeIndex: number;
  onSelect: (index: number) => void;
  prefersReducedMotion: boolean;
}

export default function ReferenceList({
  references,
  activeIndex,
  onSelect,
  prefersReducedMotion,
}: ReferenceListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, prefersReducedMotion]);

  return (
    <div ref={listRef} className="space-y-6">
      {references.map((reference, index) => {
        const isActive = index === activeIndex;
        const isHovered = hoveredIndex === index;
        const shouldAnimate = isActive || isHovered;

        return (
          <motion.div
            key={reference.id}
            className={`cursor-pointer transition-all duration-300 ${
              isActive 
                ? 'opacity-100' 
                : 'opacity-40 hover:opacity-70'
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
            aria-label={`Select ${reference.name}`}
            aria-pressed={isActive}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              {/* Company name */}
              <div className="flex-1">
                <ScrambleText
                  text={reference.name}
                  className={`font-bold transition-all duration-300 ${
                    isActive 
                      ? 'text-4xl lg:text-5xl text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]' 
                      : 'text-2xl lg:text-3xl text-gray-200 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]'
                  }`}
                  applyScramble={shouldAnimate && !prefersReducedMotion}
                  trigger="manual"
                />
                
                {/* Subtitle */}
                {reference.subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.6,
                      y: 0 
                    }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 0.3,
                      delay: prefersReducedMotion ? 0 : 0.1 
                    }}
                    className={`mt-2 text-sm lg:text-base transition-colors duration-300 ${
                      isActive 
                        ? 'text-gray-200 drop-shadow-[0_0_12px_rgba(0,0,0,0.7)]' 
                        : 'text-gray-400 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {reference.subtitle}
                  </motion.div>
                )}
              </div>

              {/* Instagram badge */}
              {reference.instagramUrl && isActive && (
                <motion.a
                  href={reference.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : 0.2 
                  }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  aria-label="View Instagram profile"
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
