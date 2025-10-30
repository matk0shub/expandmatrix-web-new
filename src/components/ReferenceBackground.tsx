'use client';

import Image from 'next/image';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';
import type { Reference } from '@/types/references';

interface ReferenceBackgroundProps {
  reference: Reference;
  prefersReducedMotion: boolean;
}

export default function ReferenceBackground({
  reference,
  prefersReducedMotion,
}: ReferenceBackgroundProps) {
  const framer = useFramerMotion();
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;

  const imageUrl =
    reference.image?.sources?.hero?.url ?? reference.image?.url ?? '';

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <MotionDiv
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: 'easeInOut' 
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={reference.image?.alt ?? ''}
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        )}
      </MotionDiv>

      {/* Enhanced gradient overlay for better text legibility */}
      <MotionDiv
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.6,
          delay: prefersReducedMotion ? 0 : 0.2 
        }}
      />
      {/* Remove heavy mobile-only darkening */}
      
      {/* Additional subtle overlay for extra contrast */}
      <MotionDiv
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.8,
          delay: prefersReducedMotion ? 0 : 0.4 
        }}
      />

      {/* Fallback gradient for missing images */}
      {/* Subtle pattern overlay */}
      <MotionDiv
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 1,
          delay: prefersReducedMotion ? 0 : 0.5 
        }}
      />
    </div>
  );
}
