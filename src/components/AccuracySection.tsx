'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AnimatedHeading from './AnimatedHeading';
import AnimatedReveal from './AnimatedReveal';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { ANIMATION_DURATION, ANIMATION_DELAYS } from '@/constants/animations';

export default function AccuracySection() {
  const t = useTranslations('sections.accuracy');

  // Use GSAP animation hook
  const { ref: sectionRef } = useGSAPAnimation({
    selector: '.stat-item',
    stagger: ANIMATION_DELAYS.STAGGER_MEDIUM,
    duration: ANIMATION_DURATION.SLOW,
  });

  // Generate random animation values only on client side to prevent hydration mismatch
  const [animationValues, setAnimationValues] = useState<{ delay: number; duration: string }[]>([]);
  
  useEffect(() => {
    setAnimationValues(
      Array.from({ length: 4 }, () => ({
        delay: Math.random() * 5,
        duration: `${2 + Math.random() * 3}s`
      }))
    );
  }, []);

  const stats = [
    { value: "35+", label: t('stats.clients') },
    { value: "3+", label: t('stats.years') },
    { value: "5", label: t('stats.team') },
    { value: "50+", label: t('stats.projects') }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48"
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
            <AnimatedHeading
              as="h2"
              className="heading-main block"
            >
              <div>
                {t('title.line1')}
              </div>
              <div>
                {t('title.line2')}
              </div>
            </AnimatedHeading>
            
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
              {t('description')}
            </p>
          </div>
        </div>

        {/* Bottom Section - 4 Stats in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <AnimatedReveal
              key={stat.label}
              className="stat-item relative group"
              direction="up"
              delay={index * 0.12}
              distance={220}
              viewportAmount={0.55}
              fade={false}
            >
              {/* Coal Liquid Glass Card */}
              <div className="relative p-10 lg:p-12 bg-gradient-to-br from-black/95 via-black/98 to-black/99 backdrop-blur-2xl rounded-3xl transition-all duration-700 group-hover:scale-[1.05] group-hover:rotate-1 min-h-[320px] flex flex-col overflow-hidden">
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

                {/* Content wrapper */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Label with enhanced styling */}
                  <div className="mb-10">
                    <div 
                      className="text-sm md:text-base text-white/70 font-medium uppercase tracking-[0.2em] font-lato group-hover:text-white/90 transition-colors duration-500" 
                    >
                      {stat.label}
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
                    {stat.value}
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
