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
  const AnimatePresence = framer?.AnimatePresence ?? null;

  const imageUrl = reference.image?.url ?? '';
  const shouldAnimate = animateOnChange && !prefersReducedMotion;

  const imageLayer = (
    <MotionDiv
      key={reference.id}
      className="absolute inset-0 w-full h-full"
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={shouldAnimate ? { opacity: 0 } : undefined}
      transition={{
        duration: shouldAnimate ? 0.4 : 0,
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
  );

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[40px]">
      {AnimatePresence && shouldAnimate
        ? <AnimatePresence mode="sync">{imageLayer}</AnimatePresence>
        : imageLayer
      }

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
