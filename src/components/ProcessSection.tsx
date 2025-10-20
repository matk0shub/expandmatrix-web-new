'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONFIGURATION - FUTURISTIC DESIGN
// ============================================================================

const CARD_CONFIG = {
  width: {
    base: 'w-full',
    sm: 'sm:w-[95%]',
    md: 'md:w-[85%]',
    lg: 'lg:w-[720px]',
    xl: 'xl:w-[800px]'
  },
  height: {
    base: 'min-h-[580px]',
    sm: 'sm:min-h-[600px]',
    md: 'md:min-h-[620px]',
    lg: 'lg:min-h-[640px]'
  },
  padding: {
    base: 'p-10',
    sm: 'sm:p-12',
    md: 'md:p-14',
    lg: 'lg:p-16',
    xl: 'xl:p-20'
  },
  borderRadius: 'rounded-3xl', // Standard border-radius
  maxWidth: 'max-w-[92vw] lg:max-w-none',
  typography: {
    number: {
      size: 'text-base sm:text-lg md:text-xl lg:text-2xl',
      weight: 'font-extrabold'
    },
    heading: {
      size: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
      weight: 'font-extrabold'
    },
    description: {
      size: 'text-base sm:text-lg md:text-xl lg:text-2xl',
      weight: 'font-semibold'
    }
  },
  effects: {
    // Multi-layer shadows pro 3D depth
    shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,215,107,0.25)]',
    hoverShadow: 'hover:shadow-[0_24px_64px_rgba(0,0,0,0.7),0_8px_32px_rgba(0,215,107,0.4)]',
    // Transform pro levitaci
    defaultTransform: '-translate-y-2',
    hoverTransform: 'hover:-translate-y-6'
  },
  animation: {
    stickDistance: 100,
    duration: 0.8,
    ease: 'power2.out'
  }
} as const;

// Futuristic glassmorphism card style - bez borderů
const cardBaseStyle = `
  bg-gradient-to-br from-black/90 via-black/95 to-black/98
  backdrop-blur-2xl
  transition-all duration-700
  hover:scale-[1.03]
`;

// Subtle rotations for scattered look
const cardRotations = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg'];
const cardOffsets = ['-15px', '20px', '-10px', '18px', '-8px'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProcessSection() {
  const t = useTranslations('sections.process');
  const prefersReducedMotion = useReducedMotion();
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    { key: 'meeting', number: '01' },
    { key: 'contract', number: '02' },
    { key: 'access', number: '03' },
    { key: 'implementation', number: '04' },
    { key: 'optimization', number: '05' }
  ];

  // ============================================================================
  // GSAP SCROLL TRIGGER - STACKING CARDS EFFECT
  // ============================================================================

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = cardsContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cardWrappers = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('.process-card-wrapper')
      );

      if (cardWrappers.length === 0) return;

      const cards = cardWrappers.map((wrapper) =>
        wrapper.querySelector<HTMLElement>('.process-card')
      );

      const existingCards = cards.filter((card): card is HTMLElement => Boolean(card));
      if (existingCards.length === 0) return;

      // Set initial state
      gsap.set(existingCards, { opacity: 1, yPercent: 0 });

      // Create last card trigger for pin end calculation
      const lastCardTrigger = ScrollTrigger.create({
        trigger: cardWrappers[cardWrappers.length - 1],
        start: 'bottom bottom',
      });

      // Create scroll trigger for each card
      cardWrappers.forEach((wrapper, index) => {
        const card = cards[index];
        if (!card) return;

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'center center',
          end: () => (lastCardTrigger.start || 0) + CARD_CONFIG.animation.stickDistance,
          pin: true,
          pinSpacing: false,
          toggleActions: 'restart none none reverse',
          onEnter: () => {
            gsap.to(card, { 
              yPercent: 0, 
              rotation: cardRotations[index],
              x: cardOffsets[index],
              duration: CARD_CONFIG.animation.duration,
              ease: CARD_CONFIG.animation.ease,
              overwrite: 'auto' 
            });
          },
          onEnterBack: () => {
            gsap.to(card, { 
              yPercent: 0, 
              rotation: cardRotations[index],
              x: cardOffsets[index],
              duration: CARD_CONFIG.animation.duration,
              ease: CARD_CONFIG.animation.ease,
              overwrite: 'auto' 
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
      id="process"
    >
      {/* Modern Background Effects - Green Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated blob - top left */}
        <div 
          className="absolute top-[5%] left-[8%] w-[480px] h-[380px] blur-3xl opacity-40 animate-pulse" 
          style={{ 
            background: 'radial-gradient(ellipse 55% 45%, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 40%, rgba(0, 184, 92, 0.2) 70%, transparent 85%)',
            animationDuration: '8s'
          }} 
        />

        {/* Animated blob - top right */}
        <div 
          className="absolute top-[10%] right-[5%] w-[520px] h-[400px] blur-3xl opacity-45 animate-pulse" 
          style={{ 
            background: 'radial-gradient(ellipse 50% 50%, rgba(0, 215, 107, 0.65) 0%, rgba(0, 255, 120, 0.45) 35%, rgba(0, 184, 92, 0.25) 65%, transparent 80%)',
            animationDuration: '10s',
            animationDelay: '1s'
          }} 
        />

        {/* Animated blob - center */}
        <div 
          className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[400px] h-[320px] blur-3xl opacity-35 animate-pulse" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 184, 92, 0.4) 0%, rgba(0, 215, 107, 0.25) 50%, transparent 75%)',
            animationDuration: '12s',
            animationDelay: '2s'
          }} 
        />

        {/* Animated blob - bottom left */}
        <div 
          className="absolute bottom-[10%] left-[10%] w-[380px] h-[320px] blur-3xl opacity-30 animate-pulse" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 255, 120, 0.5) 0%, rgba(0, 215, 107, 0.3) 50%, transparent 75%)',
            animationDuration: '9s',
            animationDelay: '3s'
          }} 
        />

        {/* Animated blob - bottom right */}
        <div 
          className="absolute bottom-[15%] right-[8%] w-[420px] h-[340px] blur-3xl opacity-35 animate-pulse" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 215, 107, 0.55) 0%, rgba(0, 184, 92, 0.35) 50%, transparent 75%)',
            animationDuration: '11s',
            animationDelay: '1.5s'
          }} 
        />

        {/* Small glowing particles */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-green-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[60%] right-[20%] w-1 h-1 bg-green-500 rounded-full opacity-40 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[25%] w-1.5 h-1.5 bg-green-400 rounded-full opacity-50 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="w-full max-w-[1780px] mx-auto relative px-6 md:px-12 xl:px-0">
          {/* Title */}
          <div className="mb-16 lg:mb-24">
            <div className="relative inline-block mb-8">
              <h2 className="heading-main">
                <ScrambleText text={t('title')} applyScramble={false} />
              </h2>
            </div>
          </div>

          {/* Description and CTA */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ 
              opacity: 1, 
              x: 0,
              transition: { duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }
            }}
            viewport={{ once: true }}
            className="flex justify-start md:justify-end mb-16"
          >
            <div className="max-w-2xl text-left">
              {/* Description */}
              <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-lato mb-8">
                <ScrambleText text={t('description')} applyScramble={false} />
              </p>
              
              {/* CTA Button */}
              <div className="flex justify-start">
                <motion.button
                  data-cal-namespace="strategy"
                  data-cal-link="team/em-core/strategy"
                  data-cal-origin="https://meet.expandmatrix.com"
                  data-cal-config='{"layout":"month_view"}'
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                  className="group relative inline-flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm md:text-base cursor-pointer font-lato focus:outline-none focus:ring-4 focus:ring-[#00d76b]/50" 
                >
                  <span className="uppercase tracking-wide">
                    <ScrambleText text={t('cta')} applyScramble={false} />
                  </span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Process Cards - Futuristic Stacking Effect */}
      <section className="relative w-full overflow-hidden bg-transparent py-20 sm:py-32 md:py-48 lg:py-64">
        <div
          ref={cardsContainerRef}
          className={`relative w-full ${prefersReducedMotion ? 'space-y-12 sm:space-y-16' : ''}`}
        >
          {steps.map((step, index) => (
            <section
              key={step.key}
              className={`process-card-wrapper ${
                prefersReducedMotion ? 'relative' : 'flex min-h-screen items-center justify-center'
              }`}
            >
              {/* Futuristic Card Container */}
              <div
                className={`
                  process-card
                  group
                  ${CARD_CONFIG.width.base}
                  ${CARD_CONFIG.width.sm}
                  ${CARD_CONFIG.width.md}
                  ${CARD_CONFIG.width.lg}
                  ${CARD_CONFIG.width.xl}
                  ${CARD_CONFIG.height.base}
                  ${CARD_CONFIG.height.sm}
                  ${CARD_CONFIG.height.md}
                  ${CARD_CONFIG.height.lg}
                  ${CARD_CONFIG.maxWidth}
                  ${CARD_CONFIG.borderRadius}
                  ${cardBaseStyle}
                  ${CARD_CONFIG.effects.shadow}
                  ${CARD_CONFIG.effects.hoverShadow}
                  ${CARD_CONFIG.effects.defaultTransform}
                  ${CARD_CONFIG.effects.hoverTransform}
                  mx-auto
                  transform-gpu
                  ${prefersReducedMotion ? '' : 'hover:rotate-0'}
                  relative
                  overflow-hidden
                `}
              >
                {/* Holographic Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-transparent via-50% to-cyan-500/10 opacity-60 rounded-3xl pointer-events-none transition-opacity duration-700 group-hover:opacity-80"
                />

                {/* Scan Line Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-30">
                  <div 
                    className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-green-400/80 to-transparent"
                    style={{
                      animation: 'scanLine 8s linear infinite',
                    }}
                  />
                </div>

                {/* Corner Accents - Glowing Dots */}
                <div className="absolute top-8 left-8 w-2.5 h-2.5 bg-green-400 rounded-full opacity-80 animate-pulse" 
                  style={{ 
                    boxShadow: '0 0 16px rgba(0, 215, 107, 0.9)',
                    animationDuration: '3s' 
                  }} 
                />
                <div className="absolute top-8 right-8 w-2.5 h-2.5 bg-green-400 rounded-full opacity-80 animate-pulse" 
                  style={{ 
                    boxShadow: '0 0 16px rgba(0, 215, 107, 0.9)',
                    animationDuration: '3.5s',
                    animationDelay: '0.5s'
                  }} 
                />

                {/* Bottom edge accent - stejně jako FAQ má z levé strany */}
                <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-60 rounded-b-3xl" />

                {/* Card Content */}
                <div 
                  className={`
                    ${CARD_CONFIG.padding.base}
                    ${CARD_CONFIG.padding.sm}
                    ${CARD_CONFIG.padding.md}
                    ${CARD_CONFIG.padding.lg}
                    ${CARD_CONFIG.padding.xl}
                    h-full
                    flex flex-col
                    justify-between
                    relative
                    z-10
                  `}
                >
                  {/* Content */}
                  <div>
                    {/* Step number with line */}
                    <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
                      <div 
                        className={`
                          text-green-400 
                          ${CARD_CONFIG.typography.number.size}
                          ${CARD_CONFIG.typography.number.weight}
                          font-mono
                          tracking-[0.2em]
                          uppercase
                        `}
                        style={{
                          textShadow: '0 0 24px rgba(0, 215, 107, 0.8), 0 0 12px rgba(0, 215, 107, 0.6)'
                        }}
                      >
                        {step.number}
                      </div>
                      <div className="h-[2px] w-20 sm:w-28 md:w-36 bg-gradient-to-r from-green-500/50 to-transparent" />
                    </div>
                    
                    {/* Title */}
                    <h3 
                      className={`
                        text-white
                        ${CARD_CONFIG.typography.heading.size}
                        ${CARD_CONFIG.typography.heading.weight}
                        font-lato
                        mb-10 sm:mb-12 md:mb-16
                        leading-[0.9]
                        tracking-tight
                      `}
                    >
                      <ScrambleText text={t(`steps.${step.key}`)} applyScramble={false} />
                    </h3>
                    
                    {/* Description */}
                    <p 
                      className={`
                        text-white/85
                        ${CARD_CONFIG.typography.description.size}
                        ${CARD_CONFIG.typography.description.weight}
                        font-lato
                        leading-relaxed
                        max-w-full
                        lg:max-w-[90%]
                      `}
                    >
                      <ScrambleText text={t(`stepDescriptions.${step.key}`)} applyScramble={false} />
                    </p>
                  </div>

                  {/* Bottom glow accent */}
                  <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-green-400/30 to-transparent rounded-full blur-3xl" />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Scan Line Animation Keyframes */}
      <style jsx>{`
        @keyframes scanLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(200vh);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
