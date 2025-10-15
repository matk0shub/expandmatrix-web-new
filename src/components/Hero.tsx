'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import LocaleSwitcher from './LocaleSwitcher';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useClient } from '@/hooks/useClient';

type GSAPTimeline = gsap.core.Timeline;

export default function Hero() {
  const t = useTranslations('hero');
  const nav = useTranslations('navigation');
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isClient = useClient();
  const prefersReducedMotion = useReducedMotion();


  useEffect(() => {
    if (!heroRef.current || !isClient || prefersReducedMotion) {
      return;
    }

    let isMounted = true;
    let handleMouseMove: ((event: MouseEvent) => void) | null = null;
    let timeline: GSAPTimeline | null = null;

    (async () => {
      const { gsap } = await import('gsap');
      if (!isMounted || !heroRef.current) {
        return;
      }

      timeline = gsap.timeline();
      timeline.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );

      handleMouseMove = (event: MouseEvent) => {
        if (!logoRef.current) {
          return;
        }

        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 10;
        const yPos = (clientY / innerHeight - 0.5) * 10;

        gsap.to(logoRef.current, {
          rotateY: xPos,
          rotateX: -yPos,
          duration: 0.6,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
    })();

    return () => {
      isMounted = false;
      if (handleMouseMove) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      timeline?.kill();
    };
  }, [isClient, prefersReducedMotion]);

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        boxShadow: '0 -50px 100px rgba(0, 0, 0, 0.8), 0 -20px 50px rgba(0, 0, 0, 0.6)'
      }}
    >
          {/* Container with max-width */}
          <div className="w-full max-w-[1780px] mx-auto relative min-h-screen px-0">
        {/* Header with Logo and Navigation */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="w-full max-w-[1780px] mx-auto py-16 md:py-20 px-0">
            <div className="flex items-center justify-between px-6 md:px-12 xl:px-0">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3 shrink-0"
              >
               <div className="w-8 h-8 flex items-center justify-center group">
                 <svg 
                   viewBox="0 0 1041.587182 1000"
                   className="w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                   aria-label="Expand Matrix Logo"
                 >
                   <defs>
                     <style>{`
                       .logo-fill { fill: #00d76b; }
                       .group:hover .logo-fill { fill: #00e673; }
                     `}</style>
                   </defs>
                   <polygon 
                     className="logo-fill transition-colors duration-300" 
                     points="963.414598 472.195172 925.243946 426.829244 807.134231 286.585378 140.243863 286.585378 140.243863 140.243866 680.366063 140.243866 562.256102 0 0 0 0 527.804828 38.170652 573.170756 140.243863 694.390344 156.280366 713.414622 519.878196 713.414622 401.768481 573.170756 226.890311 573.170756 140.243863 470.305027 140.243863 426.829244 739.390212 426.829244 823.170735 526.280478 823.170735 573.170756 504.329337 573.170756 624.207347 713.414622 749.329316 859.756134 286.890282 859.756134 404.999955 1000 932.926866 1000 932.926866 849.451234 823.170735 719.146472 818.353741 713.414622 963.414598 713.414622 963.414598 472.195172"
                   />
                 </svg>
               </div>
                   <span 
                     className="text-white font-bold text-sm sm:text-base lg:text-lg whitespace-nowrap font-lato" 
                   >
                      <ScrambleText text="EXPAND MATRIX" applyScramble={false} />
                    </span>
              </motion.div>

              {/* Desktop Navigation */}
              <motion.nav
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden lg:flex items-center gap-6 xl:gap-8"
              >
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato"
                  >
                    <ScrambleText text={nav('about')} applyScramble={false} />
                  </button>
                <button 
                  onClick={() => scrollToSection('services')}
                    className="text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato"
                >
                  <ScrambleText text={nav('services')} applyScramble={false} />
                </button>
                <button 
                  onClick={() => scrollToSection('references')}
                    className="text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato"
                >
                  <ScrambleText text={nav('references')} applyScramble={false} />
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                    className="text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato"
                >
                  <ScrambleText text={nav('faq')} applyScramble={false} />
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                    className="text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato"
                >
                  <ScrambleText text={nav('contact')} applyScramble={false} />
                </button>
                <LocaleSwitcher />
              </motion.nav>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden mt-4 bg-black/95 backdrop-blur-sm border-t border-white/10 rounded-lg"
              >
                <nav className="flex flex-col p-6 space-y-4">
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left"
                  >
                    {nav('about')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left"
                  >
                    {nav('services')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('references')}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left"
                  >
                    {nav('references')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('faq')}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left"
                  >
                    {nav('faq')}
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left"
                  >
                    {nav('contact')}
                  </button>
                  <div className="pt-4 border-t border-white/10">
                    <LocaleSwitcher />
                  </div>
                </nav>
              </motion.div>
            )}
          </div>
        </header>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-between py-15 md:py-19 px-0">
           {/* Top Section - Modern Heading Layout */}
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="pt-16 md:pt-20 px-6 md:px-12 xl:px-0 relative z-50"
           >
             {/* Grid-based heading layout with ghost sizer for perfect alignment */}
             <div className="hero-heading-container">
               <h1 
                 className="hero-heading hero-heading-grid" 
                 aria-label={`${t('heading.line1')} ${t('heading.line2a')} ${t('heading.line2b')} ${t('heading.line3')} ${t('heading.line4')}`}
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
               </h1>
               
               {/* Subtitle with better spacing */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 1.2 }}
                 className="mt-6 md:mt-8 lg:mt-10"
               >
                 <p className="text-lg md:text-xl lg:text-2xl text-white/80 font-lato font-medium tracking-wide">
                   <ScrambleText 
                     text={t('slogan')}
                     applyScramble={false}
                     className="block"
                   />
                 </p>
               </motion.div>
             </div>
           </motion.div>

          {/* Bottom Section - CTA with better positioning */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1.4 }}
             className="flex justify-start md:justify-end items-end pb-8 md:pb-12 px-6 md:px-12 xl:px-0 mt-8 md:mt-12"
           >
            <div className="text-left md:text-right max-w-md md:max-w-lg">
              <p className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed mb-6 font-outfit">
                <ScrambleText 
                  text={t('subtitle')}
                  applyScramble={false}
                />
              </p>
               <button 
                 data-cal-namespace="strategy"
                 data-cal-link="team/em-core/strategy"
                 data-cal-origin="https://meet.expandmatrix.com"
                 data-cal-config='{"layout":"month_view"}'
                 className="group relative inline-flex items-center gap-3 px-7 md:px-9 py-4 md:py-5 bg-gradient-to-r from-[#00d76b] to-[#00b85c] text-white font-semibold rounded-full hover:from-[#00e673] hover:to-[#00d76b] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-base md:text-lg cursor-pointer font-lato" 
               >
                 <span className="uppercase tracking-wide">
                   <ScrambleText text={t('cta')} applyScramble={false} />
                 </span>
                 <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                 
                 {/* Glow effect */}
                 <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d76b]/20 to-[#00b85c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
               </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 3D Rotating Logo - Center */}
        {isClient && (
           <div 
             ref={logoRef}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
             style={{
               perspective: '1200px',
               transformStyle: 'preserve-3d',
             }}
           >

            {/* True 3D Logo with Extrusion */}
            <motion.div
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
              {/* Extrusion Layers - Creating Real 3D Thickness */}
        {[...Array(40)].map((_, i) => (
                <div
                  key={`extrusion-${i}`}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(-${i * 2}px)`,
                    opacity: Math.max(0, 1 - (i * 0.02)),
                  }}
                >
                  <Image 
                    src="/logo.svg" 
                    alt="Expand Matrix" 
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    style={{
                      filter: 'brightness(1.0) contrast(1.0)',
                      transform: 'scale(1.05)',
                      willChange: 'transform',
                    }}
                    priority
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
                    alt="Expand Matrix" 
                    width={200}
                    height={200}
                    className="w-full h-full object-contain relative z-10"
                    style={{
                      filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
                      transform: 'scale(1.05)',
                      willChange: 'transform',
                    }}
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
                    }}
                  />
                </div>
              </div>

            </motion.div>
          </div>
        )}

            {/* Advanced Matrix Rain Effect */}
            {isClient && [...Array(50)].map((_, i) => {
              // Use deterministic values based on index to prevent hydration mismatch
              const left = (i * 7.3) % 100;
              const top = (i * 11.7) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 6);
              const charCode = 0x30A0 + (i % 96);
              
              return (
                <motion.div
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
                </motion.div>
              );
            })}

        {/* Neural Network Connections */}
        {isClient && [...Array(25)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration mismatch
          const left = (i * 13.7) % 100;
          const top = (i * 19.3) % 100;
          const duration = 3 + (i % 2);
          const delay = (i % 4);
          
          return (
            <motion.div
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
        {isClient && [...Array(15)].map((_, i) => (
          <motion.div
            key={`grid-${i}`}
            className="absolute border border-[#00d76b]/30"
        style={{
              left: `${(i * 6.67)}%`,
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
        {isClient && [...Array(8)].map((_, i) => (
          <motion.div
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
            {isClient && [...Array(12)].map((_, i) => {
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
                <motion.div
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
                </motion.div>
              );
            })}

        {/* Quantum Dots */}
        {isClient && [...Array(40)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration mismatch
          const left = (i * 17.3) % 100;
          const top = (i * 29.7) % 100;
          const xOffset = (i * 13) % 60 - 30;
          const yOffset = (i * 19) % 60 - 30;
          const duration = 4 + (i % 3);
          const delay = (i % 4);
          
          return (
            <motion.div
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
        {isClient && [...Array(3)].map((_, i) => (
          <motion.div
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
  );
}
