'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
// removed GSAP entrance animations to avoid double-load effect

export default function ServicesSection() {
  const t = useTranslations('sections.services');
  const prefersReducedMotion = useReducedMotion();
  
  // GSAP entrance animations removed; Framer Motion whileInView handles appearance

  const services = [
    {
      key: 'ai-agents',
      number: t('services.ai-agents.number'),
      title: t('services.ai-agents.title'),
      description: t('services.ai-agents.description'),
      details: t('services.ai-agents.details')
    },
    {
      key: 'web-development', 
      number: t('services.web-development.number'),
      title: t('services.web-development.title'),
      description: t('services.web-development.description'),
      details: t('services.web-development.details')
    },
    {
      key: 'ai-implementation',
      number: t('services.ai-implementation.number'),
      title: t('services.ai-implementation.title'),
      description: t('services.ai-implementation.description'),
      details: t('services.ai-implementation.details')
    }
  ];

  return (
    <section 
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
    >
      {/* Modern Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large vibrant blob - top left */}
        <div className="absolute top-[5%] left-[8%] w-[550px] h-[420px] blur-3xl opacity-60" 
          style={{ 
            background: 'radial-gradient(ellipse 55% 45%, rgba(0, 255, 120, 0.8) 0%, rgba(0, 215, 107, 0.6) 40%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)' 
          }} 
        />

        {/* Large vibrant blob - top right */}
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[450px] blur-3xl opacity-65" 
          style={{ 
            background: 'radial-gradient(ellipse 50% 50%, rgba(0, 255, 120, 0.85) 0%, rgba(0, 215, 107, 0.65) 35%, rgba(0, 184, 92, 0.4) 65%, transparent 80%)' 
          }} 
        />

        {/* Medium blob - center left */}
        <div className="absolute top-1/2 left-[2%] w-[420px] h-[360px] blur-3xl opacity-50" 
          style={{ 
            background: 'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.7) 0%, rgba(0, 215, 107, 0.5) 50%, transparent 75%)' 
          }} 
        />

        {/* Medium blob - center right */}
        <div className="absolute bottom-[15%] right-[8%] w-[480px] h-[380px] blur-3xl opacity-55" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 215, 107, 0.7) 0%, rgba(0, 255, 120, 0.5) 45%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)' 
          }} 
        />

        {/* Small blob - bottom left */}
        <div className="absolute bottom-[8%] left-[15%] w-[350px] h-[300px] blur-3xl opacity-45" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 55%, transparent 75%)' 
          }} 
        />

        {/* Extra small accent blob - center */}
        <div className="absolute top-[45%] left-[45%] w-[280px] h-[240px] blur-3xl opacity-40" 
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 184, 92, 0.5) 0%, rgba(0, 215, 107, 0.3) 60%, transparent 80%)' 
          }} 
        />

        {/* Additional accent - top center */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[400px] h-[320px] blur-3xl opacity-45" 
          style={{ 
            background: 'radial-gradient(ellipse 45% 55%, rgba(0, 215, 107, 0.6) 0%, rgba(0, 184, 92, 0.4) 50%, transparent 75%)' 
          }} 
        />

        {/* Glowing particles - kept for sparkle */}
        <div className="absolute top-1/5 left-3/4 w-1 h-1 bg-green-400 rounded-full opacity-60 animate-ping shadow-lg shadow-green-400" />
        <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-green-500 rounded-full opacity-40 animate-ping shadow-lg shadow-green-500" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-green-400 rounded-full opacity-50 animate-ping shadow-lg shadow-green-400" />
      </div>

      {/* Container with same max-width as Hero */}
      <div className="w-full max-w-[1780px] mx-auto relative px-6 md:px-12 xl:px-0">
        {/* Top Section - Title and Description stacked vertically */}
        <div className="mb-20 lg:mb-32">
          {/* Main Title - single line */}
          <div className="relative inline-block mb-8">
            <h2 
              className="heading-main" 
            >
              <ScrambleText text={t('title')} applyScramble={false} />
            </h2>
          </div>
        </div>

        {/* Bottom Section - Responsive service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 items-stretch">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              className="service-item relative"
              initial={{ opacity: 0, x: -400 }}
              whileInView={{ 
                opacity: 1, 
                x: prefersReducedMotion ? 0 : [-400, -200, 0],
                transition: {
                  duration: prefersReducedMotion ? 0.01 : 1.8,
                  delay: prefersReducedMotion ? 0 : index * 0.3,
                  ease: "easeOut",
                  ...(prefersReducedMotion ? {} : { times: [0, 0.6, 1] })
                }
              }}
              viewport={{ once: true, margin: "-100px 0px" }}
            >
              {/* Use a button for a11y focus; hover/focus reveal content */}
              <button
                type="button"
                className="group relative w-full h-[320px] md:h-[340px] lg:h-[360px] rounded-3xl focus:outline-none"
                aria-label={service.title}
              >
                {/* Frame with gradient border */}
                <div className="relative bg-transparent transition-all duration-700 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]">
                  <div className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-r from-green-500/40 via-green-400/30 to-green-500/40 transition-all duration-500 group-hover:from-green-400/60 group-hover:via-green-300/40 group-hover:to-green-400/60 group-focus-visible:from-green-400/60 group-focus-visible:via-green-300/40 group-focus-visible:to-green-400/60" />
                  <div className="relative w-full h-full rounded-3xl bg-black overflow-hidden">
                    {/* Subtle background gloss */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-700" aria-hidden="true">
                      <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(closest-side,rgba(34,197,94,0.15),transparent_70%)] rotate-12" />
                    </div>

                    {/* Content wrapper */}
                    <div className="relative z-10 p-12 md:p-14 lg:p-16 h-full flex flex-col">
                      {/* Top row - Number and Plus icon */}
                      <div className="flex justify-between items-start mb-10 md:mb-12">
                        <div className="text-2xl md:text-3xl text-white/90 font-medium font-lato">
                          <ScrambleText text={service.number} applyScramble={false} />
                        </div>

                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center transition-all duration-300 group-hover:bg-green-400 group-focus-visible:bg-green-400 group-hover:scale-110 group-focus-visible:scale-110">
                            <Plus className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90 group-focus-visible:rotate-90" />
                          </div>
                          <div className="absolute inset-0 w-12 h-12 rounded-full bg-green-500/50 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                        </div>
                      </div>

                      {/* Center area: title by default, description on hover; both centered */}
                      <div className="relative flex-1">
                        {/* Hover overlay description */}
                        <div
                          className={`absolute inset-0 transition-all ${prefersReducedMotion ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'} duration-500 flex items-center justify-center`}
                          aria-hidden={false}
                        >
                          <p className="text-white text-base md:text-lg leading-relaxed font-lato text-center px-6">
                            <ScrambleText text={service.description} applyScramble={false} />
                          </p>
                        </div>

                        {/* Title shown by default; hidden on hover/focus */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 
                            className={`heading-secondary text-center transition-all duration-300 ${prefersReducedMotion ? 'opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0' : 'opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0'}`}
                          >
                            <ScrambleText text={service.title} applyScramble={false} />
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Hover/Focus surface effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/[0.02] group-focus-visible:bg-white/[0.02] backdrop-blur-0 group-hover:backdrop-blur-xl group-focus-visible:backdrop-blur-xl transition-all duration-500" aria-hidden="true" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}