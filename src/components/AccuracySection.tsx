'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ScrambleText from './ScrambleText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { ANIMATION_DURATION, ANIMATION_DELAYS } from '@/constants/animations';

export default function AccuracySection() {
  const t = useTranslations('sections.accuracy');
  const prefersReducedMotion = useReducedMotion();
  
  // Use GSAP animation hook
  const { ref: sectionRef } = useGSAPAnimation({
    selector: '.stat-item',
    stagger: ANIMATION_DELAYS.STAGGER_MEDIUM,
    duration: ANIMATION_DURATION.SLOW,
  });


  const stats = [
    { value: "35+", label: t('stats.clients') },
    { value: "3+", label: t('stats.years') },
    { value: "5", label: t('stats.team') },
    { value: "50+", label: t('stats.projects') }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48 -mt-20"
    >
      {/* Background Elements - Clean black background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blurry green spots centered in the section */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] blur-3xl opacity-25" 
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.3) 0%, rgba(0, 184, 92, 0.15) 50%, transparent 70%)' }} 
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-[350px] h-[250px] blur-3xl opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(0, 184, 92, 0.25) 0%, rgba(0, 215, 107, 0.1) 50%, transparent 70%)' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 w-[300px] h-[200px] blur-3xl opacity-15" 
          style={{ background: 'radial-gradient(circle, rgba(0, 215, 107, 0.2) 0%, transparent 60%)' }} 
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[250px] h-[180px] blur-3xl opacity-10" 
          style={{ background: 'radial-gradient(circle, rgba(0, 184, 92, 0.15) 0%, transparent 60%)' }} 
        />
      </div>

      {/* Container with same max-width as Hero */}
      <div className="w-full max-w-[1780px] mx-auto relative px-6 md:px-12 xl:px-0">
        {/* Top Section - Title and Description stacked vertically */}
        <div className="mb-20 lg:mb-32">
          {/* Main Title - aligned left, stacked vertically */}
          <div className="relative inline-block mb-8">
            <h1 
              className="heading-main block" 
            >
              <div>
                <ScrambleText text={t('title.line1')} applyScramble={false} />
              </div>
              <div>
                <ScrambleText text={t('title.line2')} applyScramble={false} />
              </div>
            </h1>
            
            {/* One large traveling neon blob with multiple gradient areas */}
            <div className="absolute -bottom-48 left-0 right-0 h-64 pointer-events-none">
              {/* Main large traveling blob with multiple gradient areas */}
              <div 
                className="absolute top-16 left-1/4 w-[60rem] h-64 blur-3xl opacity-80"
                style={{ 
                  background: `
                    radial-gradient(ellipse 40% 30% at 20% 30%, rgba(0, 215, 107, 0.9) 0%, rgba(0, 184, 92, 0.6) 50%, transparent 70%),
                    radial-gradient(ellipse 60% 25% at 70% 20%, rgba(0, 184, 92, 0.8) 0%, rgba(0, 215, 107, 0.5) 50%, transparent 70%),
                    radial-gradient(ellipse 35% 50% at 15% 80%, rgba(0, 215, 107, 0.7) 0%, rgba(0, 184, 92, 0.4) 50%, transparent 60%),
                    radial-gradient(ellipse 50% 20% at 80% 70%, rgba(0, 184, 92, 0.6) 0%, rgba(0, 215, 107, 0.3) 50%, transparent 60%),
                    radial-gradient(ellipse 30% 40% at 60% 40%, rgba(0, 215, 107, 0.5) 0%, rgba(0, 184, 92, 0.2) 50%, transparent 60%)
                  `,
                  animation: 'breathe 6s ease-in-out infinite, travel 25s ease-in-out infinite'
                }}
              />
            </div>
          </div>

          {/* Description below title - positioned on the right side */}
          <div className="max-w-2xl ml-auto">
            <p 
              className="text-white/90 text-xl md:text-2xl lg:text-3xl leading-relaxed font-lato text-left" 
            >
              <ScrambleText text={t('description')} applyScramble={false} />
            </p>
          </div>
        </div>

        {/* Bottom Section - 4 Stats in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.8, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
              viewport={{ once: true }}
            >
              {/* Apple Liquid Glass Card with Advanced Effects */}
              <div className="relative p-10 lg:p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-3xl hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-1 min-h-[320px] flex flex-col overflow-hidden shadow-2xl shadow-black/50">
                {/* Liquid Glass Base Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-white/[0.05] to-transparent opacity-60" />
                
                {/* Dynamic Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -skew-x-12 group-hover:animate-shimmer" />
                
                {/* Apple-style Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-800" />
                
                {/* Green Neon Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d76b]/[0.08] via-transparent to-[#00d76b]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                
                {/* Inner Glow Border */}
                <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-r from-white/[0.1] via-transparent to-white/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating Particles Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute top-4 left-4 w-1 h-1 bg-[#00d76b]/60 rounded-full animate-float-1" />
                  <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-[#00d76b]/40 rounded-full animate-float-2" />
                  <div className="absolute bottom-6 left-8 w-1 h-1 bg-[#00d76b]/50 rounded-full animate-float-3" />
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-[#00d76b]/30 rounded-full animate-float-4" />
                </div>
                
                {/* Content wrapper */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Label with enhanced styling */}
                  <div className="mb-10">
                    <div 
                      className="text-sm md:text-base text-white/70 font-medium uppercase tracking-[0.2em] font-lato group-hover:text-white/90 transition-colors duration-500" 
                    >
                      <ScrambleText text={stat.label} applyScramble={false} />
                    </div>
                  </div>
                  
                  {/* Large number with advanced effects */}
                  <div 
                    className="text-6xl md:text-7xl lg:text-8xl font-black text-white mt-auto font-lato tracking-tight group-hover:scale-110 transition-transform duration-700" 
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 25%, #e8e8e8 50%, #d8d8d8 75%, #c8c8c8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 8px rgba(0, 215, 107, 0.15)) drop-shadow(0 0 16px rgba(0, 215, 107, 0.08))',
                      textShadow: '0 0 12px rgba(0, 215, 107, 0.12)'
                    }}
                  >
                    <ScrambleText text={stat.value} applyScramble={false} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
