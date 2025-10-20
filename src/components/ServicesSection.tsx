'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Card configuration for easy customization
const CARD_CONFIG = {
  height: {
    base: 'h-[400px]',
    md: 'md:h-[420px]',
    lg: 'lg:h-[440px]'
  },
  padding: {
    base: 'p-8',
    sm: 'sm:p-10',
    md: 'md:p-12',
    lg: 'lg:p-14'
  },
  borderRadius: 'rounded-3xl',
  animation: {
    duration: 0.8,
    staggerDelay: 0.15
  }
} as const;

export default function ServicesSection() {
  const t = useTranslations('sections.services');
  const prefersReducedMotion = useReducedMotion();

  const services = [
    {
      key: 'ai-agents',
      number: t('services.ai-agents.number'),
      title: t('services.ai-agents.title'),
      description: t('services.ai-agents.description'),
    },
    {
      key: 'web-development',
      number: t('services.web-development.number'),
      title: t('services.web-development.title'),
      description: t('services.web-development.description'),
    },
    {
      key: 'ai-implementation',
      number: t('services.ai-implementation.number'),
      title: t('services.ai-implementation.title'),
      description: t('services.ai-implementation.description'),
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
        {/* Top Section - Title */}
        <div className="mb-20 lg:mb-32">
          <div className="relative inline-block mb-8">
            <h2 className="heading-main">
              <ScrambleText text={t('title')} applyScramble={false} />
            </h2>
          </div>
        </div>

        {/* Bottom Section - Responsive service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={prefersReducedMotion ? {} : { 
                opacity: 1, 
                y: 0
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : CARD_CONFIG.animation.duration,
                delay: prefersReducedMotion ? 0 : index * CARD_CONFIG.animation.staggerDelay,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              {/* Card Container */}
              <div 
                className={`
                  relative w-full
                  ${CARD_CONFIG.height.base}
                  ${CARD_CONFIG.height.md}
                  ${CARD_CONFIG.height.lg}
                  ${CARD_CONFIG.borderRadius}
                  bg-black
                  transition-all duration-500
                  group-hover:scale-[1.02]
                  overflow-hidden
                `}
              >
                {/* Left edge accent - stejně jako FAQ */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00d76b] to-[#00b85c] opacity-60 rounded-l-3xl" />

                {/* Background glow effect on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(closest-side,rgba(34,197,94,0.15),transparent_70%)] rotate-12" />
                </div>

                {/* Content wrapper */}
                <div 
                  className={`
                    relative z-10
                    ${CARD_CONFIG.padding.base}
                    ${CARD_CONFIG.padding.sm}
                    ${CARD_CONFIG.padding.md}
                    ${CARD_CONFIG.padding.lg}
                    h-full
                    flex flex-col
                  `}
                >
                  {/* Top row - Number and Plus icon */}
                  <div className="flex justify-between items-start mb-8 sm:mb-10 md:mb-12">
                    {/* Number */}
                    <div className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium font-lato">
                      <ScrambleText text={service.number} applyScramble={false} />
                    </div>

                    {/* Plus Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-green-500 flex items-center justify-center transition-all duration-300 group-hover:bg-green-400 group-hover:scale-110">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:rotate-90" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-green-500/50 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* Center content area - Title and Description */}
                  <div className="relative flex-1 flex items-center justify-center">
                    {/* Title - visible by default */}
                    <div 
                      className={`
                        absolute inset-0 flex items-center justify-center
                        transition-opacity duration-500
                        ${prefersReducedMotion ? 'group-hover:opacity-0' : 'opacity-100 group-hover:opacity-0'}
                      `}
                    >
                      <h3 className="heading-secondary text-center px-4">
                        <ScrambleText text={service.title} applyScramble={false} />
                      </h3>
                    </div>

                    {/* Description - visible on hover */}
                    <div 
                      className={`
                        absolute inset-0 flex items-center justify-center
                        transition-all duration-500
                        ${prefersReducedMotion 
                          ? 'opacity-0 group-hover:opacity-100' 
                          : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                        }
                      `}
                    >
                      <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-lato font-medium text-center px-4 sm:px-6">
                        <ScrambleText text={service.description} applyScramble={false} />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle overlay on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/[0.02] backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
