'use client';

import { useTranslations } from 'next-intl';
import { motion, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useSafeScroll } from '@/hooks/useSafeScroll';
import { useLocale } from 'next-intl';
import TeamCard from '@/components/TeamCard';

export default function TeamSection() {
  const t = useTranslations('sections.team');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const { teamMembers, loading, error } = useTeamMembers({ 
    locale, 
    featuredOnly: true 
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const hasMounted = useHasMounted();

  // Use safe scroll hook that prevents hydration errors
  const { scrollYProgress, isReady } = useSafeScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress for different animation phases - always call hooks
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.3, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0, -50, -100]);
  
  // Cards animation - they slide over the headline
  const cardsY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [200, 0, -50, -100]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.8, 1], [0, 0, 1, 1, 0.8]);

  // Background glow animation
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  // Staggered card animations - create transforms for each card individually
  const card0Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [200, 0, -50, -100]);
  const card0Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card1Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [220, 0, -50, -100]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card2Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [240, 0, -50, -100]);
  const card2Opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card3Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [260, 0, -50, -100]);
  const card3Opacity = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card4Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [280, 0, -50, -100]);
  const card4Opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card5Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [300, 0, -50, -100]);
  const card5Opacity = useTransform(scrollYProgress, [0, 0.2, 0.55, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card6Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [320, 0, -50, -100]);
  const card6Opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.8, 1], [0, 0, 1, 1, 0.8]);
  
  const card7Y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [340, 0, -50, -100]);
  const card7Opacity = useTransform(scrollYProgress, [0, 0.2, 0.65, 0.8, 1], [0, 0, 1, 1, 0.8]);

  // Array of transforms for easy access
  const cardTransforms = [
    { y: card0Y, opacity: card0Opacity },
    { y: card1Y, opacity: card1Opacity },
    { y: card2Y, opacity: card2Opacity },
    { y: card3Y, opacity: card3Opacity },
    { y: card4Y, opacity: card4Opacity },
    { y: card5Y, opacity: card5Opacity },
    { y: card6Y, opacity: card6Opacity },
    { y: card7Y, opacity: card7Opacity },
  ];

  // Handle pinning effect
  useEffect(() => {
    if (!isReady) return;
    
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsPinned(latest > 0.2 && latest < 0.8);
    });
    return unsubscribe;
  }, [scrollYProgress, isReady]);

  // Show loading state during SSR or when loading
  if (!hasMounted || loading) {
    return (
      <section className="relative w-full bg-black py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <div className="text-white text-2xl">Loading team...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full bg-black py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <div className="text-red-400 text-2xl">Error loading team</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full bg-black py-24 md:py-40 lg:py-48 overflow-hidden ${
        isPinned && !prefersReducedMotion ? 'h-screen' : 'min-h-screen'
      }`}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: prefersReducedMotion ? 0.3 : (isReady ? glowOpacity : 0.3),
          scale: prefersReducedMotion ? 1 : (isReady ? glowScale : 1),
        }}
      >
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 215, 107, 0.4) 0%, rgba(0, 184, 92, 0.2) 50%, transparent 80%)'
          }}
        />
      </motion.div>

      <div 
        ref={containerRef}
        className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0 relative z-10"
      >
        {/* Headline */}
        <motion.div 
          className="text-center mb-20 lg:mb-32"
          style={{
            opacity: prefersReducedMotion ? 1 : (isReady ? headlineOpacity : 1),
            y: prefersReducedMotion ? 0 : (isReady ? headlineY : 0),
          }}
        >
          <h1 className="heading-main">
            {t('title')}
          </h1>
        </motion.div>

        {/* Team Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          style={{
            opacity: prefersReducedMotion ? 1 : (isReady ? cardsOpacity : 1),
            y: prefersReducedMotion ? 0 : (isReady ? cardsY : 0),
          }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              style={{
                y: prefersReducedMotion ? 0 : (isReady ? cardTransforms[index]?.y : 0),
                opacity: prefersReducedMotion ? 1 : (isReady ? cardTransforms[index]?.opacity : 1),
              }}
              className="relative"
            >
              <TeamCard member={member} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}