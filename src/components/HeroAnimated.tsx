'use client';

import { useTranslations } from 'next-intl';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useClient } from '@/hooks/useClient';
import { useIsMobile } from '@/hooks/useIsMobile';
import { CalCTAButton } from './CalCTAButton';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';
import AnimatedHeading from './AnimatedHeading';
import SiteNavbar from './SiteNavbar';

export default function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const isClient = useClient();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const framer = useFramerMotion('instant');
  const motion = framer?.motion ?? fallbackMotion;
  const MotionDiv = motion.div;
  const logoSizes = '(max-width: 768px) 160px, (max-width: 1280px) 200px, 240px';


  useEffect(() => {
    if (!heroRef.current || prefersReducedMotion) {
      return;
    }

    const node = heroRef.current;
    node.classList.add('hero-animated');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const supportsHover = useMemo(() => {
    if (!isClient || typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, [isClient]);
  const enable3DLogo = useMemo(
    () => isClient && !prefersReducedMotion,
    [isClient, prefersReducedMotion],
  );
  // Decorative particles / scan lines / quantum dots stay desktop-only so mobile first
  // paint isn't flooded with ~80 animated elements competing with the 3D logo.
  const enableDecorations = isClient && !isMobile;

  useEffect(() => {
    if (!heroLogoRef.current || !heroRef.current || prefersReducedMotion || !supportsHover) {
      return;
    }

    const logoElement = heroLogoRef.current;
    const heroElement = heroRef.current;

    let rafId: number | null = null;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let visible = true;

    const applyTilt = () => {
      rafId = null;
      if (!visible) {
        logoElement.style.transform = '';
        return;
      }
      const { innerWidth, innerHeight } = window;
      const rotateY = ((pointerX / innerWidth) - 0.5) * 14;
      const rotateX = ((pointerY / innerHeight) - 0.5) * -14;
      logoElement.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    };

    const queueTilt = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(applyTilt);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!visible) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      queueTilt();
    };

    const handlePointerLeave = () => {
      pointerX = window.innerWidth / 2;
      pointerY = window.innerHeight / 2;
      queueTilt();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          logoElement.style.transform = '';
        }
      },
      { threshold: 0.05 },
    );

    visibilityObserver.observe(heroElement);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      logoElement.style.transform = '';
    };
  }, [prefersReducedMotion, supportsHover]);

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <section
      ref={heroRef}
      className="hero-animated relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        boxShadow: '0 -50px 100px rgba(0, 0, 0, 0.8), 0 -20px 50px rgba(0, 0, 0, 0.6)'
      }}
    >
          {/* Container with max-width */}
          <div className="w-full max-w-[1780px] mx-auto relative min-h-screen px-0">
        {/* Header with Logo and Navigation */}
        <SiteNavbar variant="hero" onNavigateSection={scrollToSection} />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-between py-15 md:py-19 px-0">
           {/* Top Section - Modern Heading Layout */}
           <div
            className="pt-16 md:pt-20 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 relative z-50"
           >
             {/* Grid-based heading layout with ghost sizer for perfect alignment */}
             <div className="hero-heading-container">
               <AnimatedHeading
                 as="h1"
                 className="hero-heading hero-heading-grid"
                 aria-label={`${t('heading.line1')} ${t('heading.line2a')} ${t('heading.line2b')} ${t('heading.line3')} ${t('heading.line4')}`}
                 delay={0.2}
               >
                 {/* First line - WE CREATE / VYVÍJÍME - right-aligned */}
                 <span className="hero-heading-line-first" data-line="1">
                   <ScrambleText 
                     text={t('heading.line1')}
                     applyScramble={true}
                     className="block"
                   />
                 </span>
                 
                 {/* Second line - AI AGENTS THAT / AI AGENTY KTEŘÍ - left-aligned */}
                 <span className="hero-heading-line-second" data-line="2">
                   <ScrambleText 
                     text={`${t('heading.line2a')} ${t('heading.line2b')}`}
                     applyScramble={true}
                     className="block"
                   />
                 </span>
                 
                 {/* Third line - GO BEYOND / POSOUVAJÍ - left-aligned */}
                 <span className="hero-heading-line-rest" data-line="3">
                   <ScrambleText 
                     text={t('heading.line3')}
                     applyScramble={true}
                     className="block"
                   />
                 </span>
                 
                 {/* Fourth line - LIMITS / MOŽNOSTI - left-aligned */}
                 <span className="hero-heading-line-rest" data-line="4">
                   <ScrambleText 
                     text={t('heading.line4')}
                     applyScramble={true}
                     className="block"
                   />
                 </span>
              </AnimatedHeading>
            </div>
           </div>

          {/* Bottom Section - CTA with better positioning */}
           <MotionDiv
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1.4 }}
            className="flex justify-end items-end pb-8 md:pb-12 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 mt-8 md:mt-12"
          >
            <div className="text-right max-w-md md:max-w-lg">
              <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 font-outfit">
                <ScrambleText text={t('subtitle')} applyScramble={false} />
              </p>
              <div className="flex justify-end">
                <CalCTAButton>
                <ScrambleText text={t('cta')} applyScramble={false} />
              </CalCTAButton>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'opacity' }}>
        {/* 3D Rotating Logo - Center */}
        {enable3DLogo ? (
           <div 
             ref={heroLogoRef}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
             style={{
               perspective: '1200px',
               transformStyle: 'preserve-3d',
             }}
           >

            {/* True 3D Logo with Extrusion */}
            <MotionDiv
              className="relative w-full h-full"
              animate={prefersReducedMotion ? {} : {
                rotateY: [0, 360],
                rotateX: [0, 15, -10, 5, 0],
                rotateZ: [0, 8, -5, 3, 0],
              }}
              transition={prefersReducedMotion ? {} : {
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 50%',
                willChange: prefersReducedMotion ? 'auto' : 'transform',
              }}
            >
              {/* Extrusion Layers — 6 stacked copies (at 4px each) produce the same
                  visible ~24px thickness as the previous 12 × 2px stack while
                  halving DOM weight + animation cost on mobile. */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`extrusion-${i}`}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(-${i * 4}px)`,
                    opacity: Math.max(0, 1 - i * 0.04),
                  }}
                  aria-hidden={i !== 0 ? true : undefined}
                >
                  <Image
                    src="/logo.svg"
                    alt={i === 0 ? 'Expand Matrix logo' : ''}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    style={{
                      filter: 'brightness(1.0) contrast(1.0)',
                      transform: 'scale(1.05)',
                      willChange: 'transform',
                    }}
                    sizes={logoSizes}
                    priority={i === 0}
                  />
                </div>
              ))}

              {/* Front Face - Main Logo with SVG Filters */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(1px)',
                }}
              >
                <div className="relative w-full h-full">
                  {/* Base Logo with Consistent Lighting */}
                  <Image
                    src="/logo.svg"
                  alt="Expand Matrix logo"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain relative z-10"
                  style={{
                    filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
                    transform: 'scale(1.05)',
                    willChange: 'transform',
                  }}
                  sizes={logoSizes}
                  priority
                />
                  
                  {/* Smooth Gradient Glow Effect */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(0, 215, 107, 0.08) 0%, rgba(0, 215, 107, 0.04) 40%, transparent 70%)',
                      zIndex: 2,
                      transform: 'scale(1.05)',
                      filter: 'blur(8px)',
                      willChange: 'opacity',
                    }}
                  />
                </div>
              </div>

            </MotionDiv>
            </div>
        ) : (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
            aria-hidden="true"
          >
            <Image
              src="/logo.svg"
              alt="Expand Matrix logo"
              width={224}
              height={224}
              className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,215,107,0.35)]"
              priority
              fetchPriority="high"
              sizes={logoSizes}
            />
          </div>
        )}

            {/* Advanced Matrix Rain Effect */}
        {enableDecorations && [...Array(10)].map((_, i) => {
              // Use deterministic values based on index to prevent hydration mismatch
              const left = (i * 7.3) % 100;
              const top = (i * 11.7) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 6);
              const charCode = 0x30A0 + (i % 96);
              
              return (
                <MotionDiv
                  key={`matrix-${i}`}
                  className="absolute text-[#00d76b] font-mono text-xs"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                  animate={{
                    y: [0, 1000],
                    opacity: [0, 0.8, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                >
                  {String.fromCharCode(charCode)}
                </MotionDiv>
              );
            })}

        {/* Neural Network Connections */}
        {enableDecorations && [...Array(6)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration mismatch
          const left = (i * 13.7) % 100;
          const top = (i * 19.3) % 100;
          const duration = 3 + (i % 2);
          const delay = (i % 4);
          
          return (
            <MotionDiv
              key={`neural-${i}`}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: '2px',
                height: '2px',
                backgroundColor: '#00d76b',
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Advanced Digital Grid Lines */}
        {enableDecorations && [...Array(4)].map((_, i) => (
          <MotionDiv
            key={`grid-${i}`}
            className="absolute border border-[#00d76b]/30"
        style={{
              left: `${(i * 13)}%`,
              top: 0,
              height: '100%',
              width: '1px',
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Holographic Scan Lines */}
        {enableDecorations && [...Array(2)].map((_, i) => (
          <MotionDiv
            key={`scan-${i}`}
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#00d76b]/40 to-transparent"
            style={{
              top: `${(i * 12.5)}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

            {/* Advanced Floating Code Particles */}
            {enableDecorations && [...Array(4)].map((_, i) => {
              // Use deterministic values based on index to prevent hydration mismatch
              const left = (i * 23.7) % 100;
              const top = (i * 31.3) % 100;
              const xOffset = (i * 7) % 80 - 40;
              const yOffset = (i * 11) % 80 - 40;
              const duration = 8 + (i % 4);
              const delay = (i % 5);
              const codeIndex = i % 6;
              const codes = ['01', '10', '11', '00', 'AI', 'ML'];
              
              return (
                <MotionDiv
                  key={`code-${i}`}
                  className="absolute text-[#00d76b]/70 font-mono text-xs"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                  animate={{
                    x: [0, xOffset],
                    y: [0, yOffset],
                    opacity: [0, 0.9, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                >
                  {codes[codeIndex]}
                </MotionDiv>
              );
            })}

        {/* Quantum Dots */}
        {enableDecorations && [...Array(8)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration mismatch
          const left = (i * 17.3) % 100;
          const top = (i * 29.7) % 100;
          const xOffset = (i * 13) % 60 - 30;
          const yOffset = (i * 19) % 60 - 30;
          const duration = 4 + (i % 3);
          const delay = (i % 4);
          
          return (
            <MotionDiv
              key={`quantum-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: '#00d76b',
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
                x: [0, xOffset],
                y: [0, yOffset],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Advanced Gradient overlays with green theme */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'linear-gradient(to bottom left, rgba(0, 215, 107, 0.15), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'linear-gradient(to top right, rgba(0, 215, 107, 0.15), transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'linear-gradient(to bottom right, rgba(0, 215, 107, 0.08), transparent)' }} />
        
        {/* Dynamic Energy Fields */}
        {enableDecorations && [...Array(2)].map((_, i) => (
          <MotionDiv
            key={`energy-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: `radial-gradient(circle, rgba(0, 215, 107, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1,
            }}
          />
        ))}
      </div>
      
      {/* Smooth transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </section>
    </>
  );
}
