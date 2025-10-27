'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CalCTAButton } from './CalCTAButton';

// Lazy load GSAP to prevent blocking webpack
let gsap: any, ScrollTrigger: any;
let gsapLoaded = false;

async function loadGSAP() {
  if (gsapLoaded) return { gsap, ScrollTrigger };
  const gsapModule = await import('gsap');
  gsap = gsapModule.gsap;
  ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  gsapLoaded = true;
  return { gsap, ScrollTrigger };
}

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

// Futuristic card style with solid background
const cardBaseStyle = `
  bg-gradient-to-br from-black/95 via-black/98 to-black/99
  backdrop-blur-2xl
  transition-all duration-700
  hover:scale-[1.03]
  isolation-auto
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

  // Generate random animation values only on client side to prevent hydration mismatch
  const [animationValues, setAnimationValues] = useState<{ delay: number; duration: string }[]>([]);
  const [stackingEnabled, setStackingEnabled] = useState(false);
  
  useEffect(() => {
    setAnimationValues(
      Array.from({ length: 5 }, () => ({
        delay: Math.random() * 5,
        duration: `${2 + Math.random() * 3}s`
      }))
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const updateStacking = (matches: boolean) => {
      setStackingEnabled((current) => {
        const next = matches && !prefersReducedMotion;
        return current === next ? current : next;
      });
    };

    updateStacking(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      updateStacking(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [prefersReducedMotion]);

  const steps = [
    {
      key: 'meeting',
      number: '01',
      icon: {
        src: '/process-calendar.svg',
        alt: 'Calendar icon symbolizing the kickoff workshop',
        size: 'clamp(180px, 28vw, 320px)',
        bottom: '-80px',
        right: '-6px',
        rotation: -8
      }
    },
    {
      key: 'contract',
      number: '02',
      icon: {
        src: '/process-project.svg',
        alt: 'Project blueprint icon for scoping and contracts',
        size: 'clamp(200px, 30vw, 340px)',
        bottom: '-90px',
        right: '-36px',
        rotation: 5
      }
    },
    {
      key: 'access',
      number: '03',
      icon: {
        src: '/process-lock.svg',
        alt: 'Security lock icon for access hand-off',
        size: 'clamp(170px, 26vw, 300px)',
        bottom: '-70px',
        right: '-25px',
        rotation: -2
      }
    },
    {
      key: 'implementation',
      number: '04',
      icon: {
        src: '/process-done.svg',
        alt: 'Completion checkmark icon for implementation',
        size: 'clamp(190px, 28vw, 330px)',
        bottom: '-85px',
        right: '-28px',
        rotation: 8
      }
    },
    {
      key: 'optimization',
      number: '05',
      icon: {
        src: '/process-gears.svg',
        alt: 'Dual gear icon for optimization cycles',
        size: 'clamp(210px, 32vw, 360px)',
        bottom: '-100px',
        right: '-40px',
        rotation: 12
      }
    }
  ] as const;

  // ============================================================================
  // GSAP SCROLL TRIGGER - STACKING CARDS EFFECT
  // ============================================================================

  useEffect(() => {
    const container = cardsContainerRef.current;

    if (!stackingEnabled || !container) {
      return;
    }

    // Lazy load GSAP to prevent blocking webpack compilation
    loadGSAP().then(({ gsap: gsapLoaded, ScrollTrigger: scrollTrigger }) => {
      if (!gsapLoaded || !scrollTrigger || !container) return;

      const ctx = gsapLoaded.context(() => {
      const cardWrappers = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll('.process-card-wrapper')
      );

      if (cardWrappers.length === 0) return;

      const cards = cardWrappers.map((wrapper) =>
        wrapper.querySelector<HTMLElement>('.process-card')
      );

      const existingCards = cards.filter((card): card is HTMLElement => Boolean(card));
      if (existingCards.length === 0) return;

      gsapLoaded.set(existingCards, { opacity: 1, yPercent: 0 });

      const lastCardTrigger = scrollTrigger.create({
        trigger: cardWrappers[cardWrappers.length - 1],
        start: 'bottom bottom',
      });

      cardWrappers.forEach((wrapper, index) => {
        const card = cards[index];
        if (!card) return;

        scrollTrigger.create({
          id: `process-card-${index}`,
          trigger: wrapper,
          start: 'center center',
          end: () => (lastCardTrigger.start || 0) + CARD_CONFIG.animation.stickDistance,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          toggleActions: 'restart none none reverse',
          onEnter: () => {
            gsapLoaded.to(card, {
              yPercent: 0,
              rotation: cardRotations[index],
              x: cardOffsets[index],
              duration: CARD_CONFIG.animation.duration,
              ease: CARD_CONFIG.animation.ease,
              overwrite: 'auto',
            });
          },
          onEnterBack: () => {
            gsapLoaded.to(card, {
              yPercent: 0,
              rotation: cardRotations[index],
              x: cardOffsets[index],
              duration: CARD_CONFIG.animation.duration,
              ease: CARD_CONFIG.animation.ease,
              overwrite: 'auto',
            });
          },
        });
      });

      scrollTrigger.refresh();
      }, container);

      return () => {
        ctx.revert();
        const cards = container.querySelectorAll<HTMLElement>('.process-card');
        gsapLoaded.set(cards, { clearProps: 'transform,rotation,x,y' });
      };
    });
  }, [stackingEnabled]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
      id="process"
    >
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="w-full max-w-[1780px] mx-auto relative px-6 md:px-12 xl:px-0">
          <div className="pointer-events-none absolute inset-x-[-8%] -top-20 h-[320px] flex justify-center">
            <div className="h-full w-full max-w-4xl rounded-full bg-[radial-gradient(circle,rgba(0,215,107,0.55)_0%,rgba(0,215,107,0.14)_50%,transparent_80%)] blur-3xl opacity-65" />
          </div>
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
                <motion.div
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                  className="inline-flex"
                >
                  <CalCTAButton>
                    <ScrambleText text={t('cta')} applyScramble={false} />
                  </CalCTAButton>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Process Cards - Futuristic Stacking Effect */}
      <section className="relative w-full overflow-hidden bg-transparent py-20 sm:py-32 md:py-48 lg:py-64">
        <div
          ref={cardsContainerRef}
          className={`relative w-full ${stackingEnabled ? '' : 'space-y-12 sm:space-y-16'}`}
        >
          {steps.map((step, index) => (
            <section
              key={step.key}
              className={`process-card-wrapper ${
                stackingEnabled
                  ? 'flex min-h-screen items-center justify-center'
                  : 'relative py-8 sm:py-12'
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
                {/* Enhanced Glass Effect Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] rounded-3xl pointer-events-none mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-50 rounded-3xl pointer-events-none mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-40 rounded-3xl pointer-events-none mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.04] to-transparent opacity-30 rounded-3xl pointer-events-none mix-blend-normal" />

                {/* Border glow effect */}
                <div 
                  className="absolute inset-0 rounded-3xl animate-border-glow pointer-events-none"
                  style={{
                    '--glow-delay': animationValues[index]?.delay || 0,
                    '--glow-duration': animationValues[index]?.duration || '2s'
                  } as React.CSSProperties}
                />

                {/* Bottom edge accent - zelená lajna jako ve FAQ */}
                <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#00d76b] to-[#00b85c] opacity-60 rounded-b-3xl" />

                {/* Icon Accent */}
                <motion.div
                  className="pointer-events-none absolute z-[2]"
                  style={{
                    width: step.icon.size,
                    height: step.icon.size,
                    bottom: step.icon.bottom,
                    right: step.icon.right
                  }}
                  initial={{ rotate: step.icon.rotation }}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          rotate: [
                            step.icon.rotation - 4,
                            step.icon.rotation + 4,
                            step.icon.rotation - 4
                          ],
                          y: [-10, 8, -10]
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 9 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }
                  }
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={step.icon.src}
                      alt={step.icon.alt}
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 768px) 300px, 220px"
                      className="object-contain opacity-80 drop-shadow-[0_22px_40px_rgba(12,16,20,0.28)] mix-blend-screen select-none"
                      priority={index === 0}
                    />
                  </div>
                </motion.div>

                {/* Card Content */}
                <div
                  className={`
                    ${CARD_CONFIG.padding.base}
                    ${CARD_CONFIG.padding.sm}
                    ${CARD_CONFIG.padding.md}
                    ${CARD_CONFIG.padding.lg}
                    ${CARD_CONFIG.padding.xl}
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
                  `}
                >
                  {/* Content */}
                  <div className="flex flex-1 flex-col items-start justify-center gap-6 sm:gap-8 md:gap-10">
                    {/* Step number with line */}
                    <div className="flex w-full items-center gap-4 sm:gap-5">
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
                        heading-secondary
                        text-left
                        uppercase
                        tracking-[0.18em]
                        sm:tracking-[0.22em]
                        md:tracking-[0.24em]
                        leading-tight
                      `}
                    >
                      <ScrambleText text={t(`steps.${step.key}`)} applyScramble={false} />
                    </h3>
                    
                    {/* Description */}
                    <p 
                      className={`
                        text-white/85
                        text-base
                        sm:text-lg
                        md:text-xl
                        lg:text-2xl
                        font-lato
                        font-medium
                        leading-relaxed
                        text-left
                        max-w-[680px]
                        lg:max-w-[75%]
                      `}
                    >
                      <ScrambleText text={t(`stepDescriptions.${step.key}`)} applyScramble={false} />
                    </p>
                  </div>

                  {/* Bottom glow accent */}
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
