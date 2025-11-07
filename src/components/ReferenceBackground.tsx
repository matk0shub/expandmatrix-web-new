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
  const framer = useFramerMotion('idle');
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;

  const imageUrl = reference.image?.url ?? '';

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[40px]">
      <MotionDiv
        key={reference.id}
        className="absolute inset-0 w-full h-full"
        initial={{ x: prefersReducedMotion ? 0 : '15%', opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: prefersReducedMotion ? 0 : '-15%', opacity: prefersReducedMotion ? 1 : 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.65,
          ease: 'easeInOut',
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

      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div
        className="absolute inset-0 rounded-[40px] opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}
