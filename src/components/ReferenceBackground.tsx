'use client';

import Image from 'next/image';

import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';
import type { Reference } from '@/types/references';

interface ReferenceBackgroundProps {
  reference: Reference;
  prefersReducedMotion: boolean;
  animateOnChange: boolean;
}

export default function ReferenceBackground({
  reference,
  prefersReducedMotion,
  animateOnChange,
}: ReferenceBackgroundProps) {
  const framer = useFramerMotion('idle');
  const MotionDiv = framer?.motion.div ?? fallbackMotion.div;

  const imageUrl = reference.image?.url ?? '';
  const shouldAnimate = animateOnChange && !prefersReducedMotion;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[40px]">
      {shouldAnimate ? (
        <MotionDiv
          key={reference.id}
          className="absolute inset-0 w-full h-full"
          initial={{ x: '15%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-15%', opacity: 0 }}
          transition={{
            duration: 0.6,
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
      ) : (
        <div className="absolute inset-0 w-full h-full">
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
        </div>
      )}

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
