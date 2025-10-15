'use client';

import { useTranslations } from 'next-intl';
import { motion, useTransform } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useSafeScroll } from '@/hooks/useSafeScroll';
import { useLocale } from 'next-intl';
import Image from 'next/image';

const SPOTLIGHT_ORDER = ['Matěj Štipčák', 'Matěj Venclík', 'Jakub Hrůza'];

const CARD_CONFIGURATIONS = [
  {
    layoutClass: 'lg:absolute lg:-left-10 xl:-left-20 lg:top-8 xl:top-6 lg:max-w-[360px] z-30',
    glowClass: 'from-emerald-500/40 via-emerald-400/25 to-transparent',
    accentClass: 'bg-emerald-400/30',
    parallaxRange: [40, -40] as [number, number],
    rotate: -5,
    tilt: 3,
    hoverRotate: -2,
  },
  {
    layoutClass: 'lg:absolute lg:right-[18%] xl:right-[22%] lg:top-0 lg:max-w-[380px] z-40',
    glowClass: 'from-cyan-500/40 via-blue-400/20 to-transparent',
    accentClass: 'bg-cyan-400/30',
    parallaxRange: [60, -60] as [number, number],
    rotate: 3,
    tilt: 2.5,
    hoverRotate: 5,
  },
  {
    layoutClass: 'lg:absolute lg:right-0 lg:bottom-10 xl:bottom-0 lg:max-w-[360px] z-20',
    glowClass: 'from-purple-500/35 via-fuchsia-400/20 to-transparent',
    accentClass: 'bg-purple-400/30',
    parallaxRange: [30, -30] as [number, number],
    rotate: -1,
    tilt: 2,
    hoverRotate: 1,
  },
];

const CARD_NARRATIVES = {
  'Matěj Štipčák': {
    cs: 'Udává vizi autonomního získávání zákazníků a propojuje AI agenty s reálnými výsledky.',
    en: 'Leads the vision for autonomous customer acquisition and ties every AI agent to measurable outcomes.'
  },
  'Matěj Venclík': {
    cs: 'Navrhuje AI workflow, mentoruje delivery tým a dohlíží na špičkovou kvalitu řešení.',
    en: 'Designs AI workflows, mentors the delivery team, and keeps every solution razor-sharp.'
  },
  'Jakub Hrůza': {
    cs: 'Zajišťuje provozní excelenci, škáluje implementace AI a drží projekty v precizním tempu.',
    en: 'Safeguards operational excellence, scales AI implementations, and keeps projects in precise rhythm.'
  }
} as const;

export default function TeamSection() {
  const t = useTranslations('sections.team');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const { teamMembers, loading, error } = useTeamMembers({
    locale,
    featuredOnly: true
  });

  const spotlightMembers = useMemo(() => {
    const ordered = SPOTLIGHT_ORDER.map(name =>
      teamMembers.find(member => member.name.toLowerCase() === name.toLowerCase())
    ).filter((member): member is (typeof teamMembers)[number] => Boolean(member));

    if (ordered.length === SPOTLIGHT_ORDER.length) {
      return ordered;
    }

    const fallback = teamMembers.filter(
      member => !SPOTLIGHT_ORDER.some(name => name.toLowerCase() === member.name.toLowerCase())
    );

    return [...ordered, ...fallback].slice(0, SPOTLIGHT_ORDER.length);
  }, [teamMembers]);

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
  
  // Background glow animation
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  const [primaryConfig, secondaryConfig, tertiaryConfig] = CARD_CONFIGURATIONS;

  const primaryParallax = useTransform(scrollYProgress, [0, 1], primaryConfig.parallaxRange);
  const primaryRotation = useTransform(scrollYProgress, [0, 1], [
    primaryConfig.rotate - primaryConfig.tilt,
    primaryConfig.rotate + primaryConfig.tilt,
  ]);

  const secondaryParallax = useTransform(scrollYProgress, [0, 1], secondaryConfig.parallaxRange);
  const secondaryRotation = useTransform(scrollYProgress, [0, 1], [
    secondaryConfig.rotate - secondaryConfig.tilt,
    secondaryConfig.rotate + secondaryConfig.tilt,
  ]);

  const tertiaryParallax = useTransform(scrollYProgress, [0, 1], tertiaryConfig.parallaxRange);
  const tertiaryRotation = useTransform(scrollYProgress, [0, 1], [
    tertiaryConfig.rotate - tertiaryConfig.tilt,
    tertiaryConfig.rotate + tertiaryConfig.tilt,
  ]);

  const motionConfigs = [
    { config: primaryConfig, y: primaryParallax, rotate: primaryRotation },
    { config: secondaryConfig, y: secondaryParallax, rotate: secondaryRotation },
    { config: tertiaryConfig, y: tertiaryParallax, rotate: tertiaryRotation },
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

        {/* Spotlight Cards */}
        <div className="relative flex flex-col gap-10 lg:h-[620px] lg:gap-0">
          {spotlightMembers.map((member, index) => {
            const motionConfig = motionConfigs[index] ?? motionConfigs[motionConfigs.length - 1];
            const { config, y, rotate } = motionConfig;
            const narrative = CARD_NARRATIVES[member.name as keyof typeof CARD_NARRATIVES];

            return (
              <motion.article
                key={member.id}
                className={`group relative w-full overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl shadow-[0_25px_120px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${config.layoutClass}`}
                style={{
                  y: prefersReducedMotion ? 0 : (isReady ? y ?? 0 : 0),
                  rotate: prefersReducedMotion
                    ? config.rotate
                    : (isReady ? rotate ?? config.rotate : config.rotate),
                }}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={prefersReducedMotion ? undefined : { y: -14, rotate: config.hoverRotate }}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className={`absolute -inset-32 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${config.glowClass} bg-gradient-to-br`} />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-start gap-5">
                    <div className="relative h-20 w-20 shrink-0 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/0 p-[2px]">
                      <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-black/60">
                        {member.avatar?.url ? (
                          <Image
                            src={member.avatar.url}
                            alt={member.avatar.alt || member.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 80px, (max-width: 1280px) 88px, 96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/0 text-2xl font-semibold text-white">
                            {member.name
                              .split(' ')
                              .map(word => word.charAt(0))
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <motion.span
                        className={`absolute -bottom-3 right-2 h-8 w-8 rounded-full ${config.accentClass}`}
                        animate={{
                          scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
                          opacity: prefersReducedMotion ? 0.6 : [0.6, 0.9, 0.6],
                        }}
                        transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
                        {member.role[locale as keyof typeof member.role] || member.role.cs}
                      </span>
                      <h3 className="mt-2 text-3xl font-semibold text-white md:text-[34px]">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {narrative && (
                    <p className="text-base leading-relaxed text-gray-300">
                      {narrative[locale as keyof typeof narrative] || narrative.cs}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="h-[2px] w-12 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
                    <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                      ExpandMatrix Core Team
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}