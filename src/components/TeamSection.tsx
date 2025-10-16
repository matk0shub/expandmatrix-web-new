'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useMemo, useRef, useEffect, useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/hooks/useTeamMembers';
import { useHasMounted } from '@/hooks/useHasMounted';
import ScrambleText from './ScrambleText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SPOTLIGHT_ORDER = ['Matěj Štipčák', 'Matěj Venclík', 'Jakub Hrůza'];
const FALLBACK_LOCALE = 'cs';

type Narrative = Record<string, string>;

const CARD_NARRATIVES: Record<string, Narrative> = {
  'Matěj Štipčák': {
    cs: 'Velí autopilotům, které loví klienty dřív, než mu stihne vychladnout espresso.',
    en: 'Commands the autopilots that charm clients before his espresso cools down.',
  },
  'Matěj Venclík': {
    cs: 'Trénuje agentní mozky, aby držely kurz — a občas je učí i říkat prosím.',
    en: 'Coaches agent minds to stay on course—and occasionally reminds them to say please.',
  },
  'Jakub Hrůza': {
    cs: 'Hlídá, aby náš AI loď plula v rytmu, i když vývojáři spí.',
    en: 'Keeps the AI mothership on tempo even while the engineers are asleep.',
  },
};

type TeamCardTheme = {
  wrapperClass?: string;
  glowStyle: string;
  frameGradient: string;
  headerOverlay: string;
  accentBorder: string;
  accentGlow: string;
};

const CARD_THEMES: TeamCardTheme[] = [
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 32% 22%, rgba(0, 166, 124, 0.55), transparent 72%)',
    frameGradient: 'linear-gradient(145deg, #041a16, #020e0c 60%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 166, 124, 0.35), rgba(0, 54, 44, 0.05))',
    accentBorder: 'border-emerald-300/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,166,124,0.35),transparent_65%)]',
  },
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 55% 28%, rgba(0, 208, 150, 0.58), transparent 70%)',
    frameGradient: 'linear-gradient(150deg, #031815, #010d0b 55%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 195, 142, 0.32), rgba(0, 46, 37, 0.08))',
    accentBorder: 'border-emerald-200/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,195,142,0.32),transparent_65%)]',
  },
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 72% 80%, rgba(0, 180, 135, 0.5), transparent 70%)',
    frameGradient: 'linear-gradient(150deg, #041916, #020e0c 55%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 180, 135, 0.3), rgba(0, 40, 32, 0.08))',
    accentBorder: 'border-emerald-300/40',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,180,135,0.32),transparent_65%)]',
  },
];

const getLocalizedCopy = <T extends Record<string, string>>(dictionary: T, locale: string) => {
  return (
    dictionary[locale as keyof T] ??
    dictionary[FALLBACK_LOCALE as unknown as keyof T] ??
    Object.values(dictionary)[0]
  );
};

// ============================================================================
// BACKGROUND COMPONENT - GSAP animated bright glowing green spots
// ============================================================================
function TeamSectionBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const spots = container.querySelectorAll('.glow-spot');


    // Animate each spot with unique GSAP animations
    spots.forEach((spot, index) => {
      const element = spot as HTMLElement;
      
      // Different animation patterns for each spot
      switch (index % 8) {
        case 0:
          // Floating with scale and rotation
          gsap.to(element, {
            y: -50,
            x: 30,
            scale: 1.2,
            rotation: 15,
            duration: 8 + index,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 1:
          // Pulsing glow effect
          gsap.to(element, {
            scale: 1.3,
            opacity: 0.8,
            duration: 4 + index * 0.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 2:
          // Spiral movement
          gsap.to(element, {
            rotation: 360,
            x: 100,
            y: -100,
            duration: 12 + index,
            ease: "none",
            repeat: -1,
          });
          break;
        case 3:
          // Wave motion
          gsap.to(element, {
            y: -80,
            duration: 6 + index * 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(element, {
            x: 60,
            duration: 8 + index * 0.4,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 4:
          // Zigzag pattern
          gsap.to(element, {
            x: 80,
            y: -40,
            duration: 5 + index * 0.2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 5:
          // Breathing with color change
          gsap.to(element, {
            scale: 1.4,
            duration: 7 + index * 0.3,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 6:
          // Complex orbit
          gsap.to(element, {
            rotation: 180,
            x: 120,
            y: -120,
            scale: 1.1,
            duration: 15 + index,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        case 7:
          // Fast pulsing
          gsap.to(element, {
            scale: 1.5,
            opacity: 0.9,
            duration: 2 + index * 0.1,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
      }
    });

    return () => {
      gsap.killTweensOf(spots);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base matte black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* BRIGHT GLOWING SPOTS - Much more visible and vibrant */}
      
      {/* Spot 1 - Massive bright center glow */}
      <div 
        className="glow-spot absolute top-[20%] left-[15%] w-[900px] h-[700px] blur-3xl opacity-60" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 255, 120, 0.8) 0%, rgba(0, 215, 107, 0.6) 30%, rgba(0, 184, 92, 0.4) 60%, transparent 80%)',
          boxShadow: '0 0 200px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 2 - Large bright right side */}
      <div 
        className="glow-spot absolute top-[10%] right-[5%] w-[800px] h-[600px] blur-3xl opacity-55" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 60%, rgba(0, 215, 107, 0.7) 0%, rgba(0, 255, 120, 0.5) 40%, rgba(0, 184, 92, 0.3) 70%, transparent 85%)',
          boxShadow: '0 0 150px rgba(0, 215, 107, 0.4)'
        }} 
      />
      
      {/* Spot 3 - Large bright bottom left */}
      <div 
        className="glow-spot absolute bottom-[5%] left-[5%] w-[850px] h-[650px] blur-3xl opacity-50" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 50%, rgba(0, 184, 92, 0.2) 70%, transparent 80%)',
          boxShadow: '0 0 180px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 4 - Medium bright top left */}
      <div 
        className="glow-spot absolute top-[5%] left-[40%] w-[500px] h-[500px] blur-3xl opacity-45" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 184, 92, 0.6) 0%, rgba(0, 255, 120, 0.4) 40%, rgba(0, 215, 107, 0.2) 70%, transparent 85%)',
          boxShadow: '0 0 120px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 5 - Medium bright center right */}
      <div 
        className="glow-spot absolute top-[50%] right-[20%] w-[550px] h-[450px] blur-3xl opacity-42" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 80%, rgba(0, 215, 107, 0.5) 0%, rgba(0, 255, 120, 0.3) 50%, rgba(0, 184, 92, 0.15) 75%, transparent 85%)',
          boxShadow: '0 0 100px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 6 - Medium bright bottom center */}
      <div 
        className="glow-spot absolute bottom-[15%] left-[50%] w-[480px] h-[480px] blur-3xl opacity-40" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 184, 92, 0.5) 0%, rgba(0, 215, 107, 0.3) 50%, rgba(0, 255, 120, 0.15) 70%, transparent 80%)',
          boxShadow: '0 0 110px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 7 - Small bright top right */}
      <div 
        className="glow-spot absolute top-[15%] right-[30%] w-[350px] h-[350px] blur-3xl opacity-38" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.4) 0%, rgba(0, 215, 107, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 80px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 8 - Small bright center left */}
      <div 
        className="glow-spot absolute top-[35%] left-[25%] w-[400px] h-[400px] blur-3xl opacity-35" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 90px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 9 - Small bright bottom right */}
      <div 
        className="glow-spot absolute bottom-[25%] right-[15%] w-[380px] h-[380px] blur-3xl opacity-33" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.4) 0%, rgba(0, 255, 120, 0.2) 40%, rgba(0, 184, 92, 0.1) 70%, transparent 80%)',
          boxShadow: '0 0 85px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 10 - Small bright top center */}
      <div 
        className="glow-spot absolute top-[8%] left-[60%] w-[320px] h-[320px] blur-3xl opacity-30" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 70%, rgba(0, 184, 92, 0.35) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 70px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 11 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[25%] right-[45%] w-[280px] h-[280px] blur-3xl opacity-32" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.35) 0%, rgba(0, 215, 107, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 12 - Medium bright accent */}
      <div 
        className="glow-spot absolute bottom-[40%] left-[15%] w-[260px] h-[260px] blur-3xl opacity-28" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 184, 92, 0.3) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 55px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 13 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[60%] right-[5%] w-[300px] h-[300px] blur-3xl opacity-26" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.3) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 65px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 14 - Medium bright accent */}
      <div 
        className="glow-spot absolute bottom-[8%] right-[40%] w-[240px] h-[240px] blur-3xl opacity-24" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 60%, rgba(0, 184, 92, 0.25) 0%, rgba(0, 255, 120, 0.08) 50%, transparent 70%)',
          boxShadow: '0 0 50px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 15 - Medium bright accent */}
      <div 
        className="glow-spot absolute top-[45%] left-[5%] w-[220px] h-[220px] blur-3xl opacity-22" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.25) 0%, rgba(0, 215, 107, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 45px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* EXTRA BRIGHT ATMOSPHERIC SPOTS - Background depth */}
      {/* Spot 16 - Huge bright background glow */}
      <div 
        className="glow-spot absolute top-[30%] left-[30%] w-[1200px] h-[1000px] blur-3xl opacity-25" 
        style={{ 
          background: 'radial-gradient(ellipse 80% 50%, rgba(0, 184, 92, 0.2) 0%, rgba(0, 255, 120, 0.1) 40%, rgba(0, 215, 107, 0.05) 60%, transparent 70%)',
          boxShadow: '0 0 300px rgba(0, 184, 92, 0.2)'
        }} 
      />
      
      {/* Spot 17 - Huge bright background glow */}
      <div 
        className="glow-spot absolute bottom-[20%] right-[10%] w-[1100px] h-[900px] blur-3xl opacity-23" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 80%, rgba(0, 215, 107, 0.18) 0%, rgba(0, 255, 120, 0.08) 50%, rgba(0, 184, 92, 0.03) 70%, transparent 80%)',
          boxShadow: '0 0 250px rgba(0, 215, 107, 0.2)'
        }} 
      />
      
      {/* ADDITIONAL BRIGHT DYNAMIC SPOTS - More variety and movement */}
      {/* Spot 18 - Very bright pulsing glow */}
      <div 
        className="glow-spot absolute top-[40%] right-[35%] w-[420px] h-[420px] blur-3xl opacity-48" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.6) 0%, rgba(0, 215, 107, 0.4) 40%, rgba(0, 184, 92, 0.2) 70%, transparent 85%)',
          boxShadow: '0 0 140px rgba(0, 255, 120, 0.4)'
        }} 
      />
      
      {/* Spot 19 - Bright wave motion */}
      <div 
        className="glow-spot absolute bottom-[35%] left-[20%] w-[360px] h-[360px] blur-3xl opacity-40" 
        style={{ 
          background: 'radial-gradient(ellipse 50% 60%, rgba(0, 184, 92, 0.5) 0%, rgba(0, 255, 120, 0.3) 40%, rgba(0, 215, 107, 0.15) 70%, transparent 80%)',
          boxShadow: '0 0 120px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 20 - Bright spiral movement */}
      <div 
        className="glow-spot absolute top-[70%] left-[60%] w-[300px] h-[300px] blur-3xl opacity-36" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 100px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 21 - Bright zigzag pattern */}
      <div 
        className="glow-spot absolute top-[12%] left-[70%] w-[280px] h-[280px] blur-3xl opacity-34" 
        style={{ 
          background: 'radial-gradient(ellipse 60% 40%, rgba(0, 184, 92, 0.35) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 90px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 22 - Bright gentle sway */}
      <div 
        className="glow-spot absolute bottom-[12%] left-[40%] w-[340px] h-[340px] blur-3xl opacity-32" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.3) 0%, rgba(0, 215, 107, 0.15) 50%, rgba(0, 184, 92, 0.08) 70%, transparent 80%)',
          boxShadow: '0 0 110px rgba(0, 255, 120, 0.3)'
        }} 
      />
      
      {/* Spot 23 - Very bright expand and contract */}
      <div 
        className="glow-spot absolute top-[55%] right-[25%] w-[240px] h-[240px] blur-3xl opacity-44" 
        style={{ 
          background: 'radial-gradient(ellipse 70% 30%, rgba(0, 184, 92, 0.4) 0%, rgba(0, 255, 120, 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 80px rgba(0, 184, 92, 0.4)'
        }} 
      />
      
      {/* Spot 24 - Bright complex movement */}
      <div 
        className="glow-spot absolute bottom-[50%] right-[50%] w-[320px] h-[320px] blur-3xl opacity-38" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.35) 0%, rgba(0, 255, 120, 0.2) 40%, rgba(0, 184, 92, 0.1) 70%, transparent 80%)',
          boxShadow: '0 0 95px rgba(0, 215, 107, 0.3)'
        }} 
      />
      
      {/* Spot 25 - Bright fast rotation */}
      <div 
        className="glow-spot absolute top-[30%] left-[50%] w-[200px] h-[200px] blur-3xl opacity-30" 
        style={{ 
          background: 'radial-gradient(ellipse 40% 70%, rgba(0, 184, 92, 0.3) 0%, rgba(0, 255, 120, 0.15) 50%, transparent 70%)',
          boxShadow: '0 0 60px rgba(0, 184, 92, 0.3)'
        }} 
      />
      
      {/* Spot 26 - Bright vertical drift with rotation */}
      <div 
        className="glow-spot absolute bottom-[30%] left-[70%] w-[260px] h-[260px] blur-3xl opacity-28" 
          style={{
          background: 'radial-gradient(circle, rgba(0, 255, 120, 0.25) 0%, rgba(0, 215, 107, 0.12) 50%, transparent 70%)',
          boxShadow: '0 0 70px rgba(0, 255, 120, 0.3)'
          }}
        />
      
      {/* Spot 27 - Bright horizontal drift with breathing */}
        <div
        className="glow-spot absolute top-[18%] left-[35%] w-[180px] h-[180px] blur-3xl opacity-26" 
          style={{
          background: 'radial-gradient(ellipse 60% 50%, rgba(0, 184, 92, 0.25) 0%, rgba(0, 255, 120, 0.1) 50%, transparent 70%)',
          boxShadow: '0 0 50px rgba(0, 184, 92, 0.3)'
          }}
        />
      
      {/* Spot 28 - Bright multi-directional movement */}
        <div
        className="glow-spot absolute bottom-[18%] right-[30%] w-[160px] h-[160px] blur-3xl opacity-24" 
          style={{
          background: 'radial-gradient(circle, rgba(0, 215, 107, 0.2) 0%, rgba(0, 255, 120, 0.08) 50%, transparent 70%)',
          boxShadow: '0 0 40px rgba(0, 215, 107, 0.3)'
          }}
        />
      </div>
  );
}

// ============================================================================
// HEADER COMPONENT - Title section (centered)
// ============================================================================
function TeamSectionHeader() {
  const t = useTranslations('sections.team');

  return (
    <div className="heading-wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex w-full max-w-4xl items-center justify-center px-6">
      <h1 className="heading-main text-balance text-center">
        <ScrambleText text={t('title')} applyScramble={false} />
      </h1>
    </div>
  );
}

// ============================================================================
// TEAM CARD COMPONENT
// ============================================================================
type TeamSpotlightCardProps = {
  member: TeamMember;
  locale: string;
  narrative?: Narrative;
  theme: TeamCardTheme;
};

function TeamSpotlightCard({
  member,
  locale,
  narrative,
  theme,
}: TeamSpotlightCardProps) {
  const localizedRole = getLocalizedCopy(member.role, locale);
  const localizedNarrative = narrative ? getLocalizedCopy(narrative, locale) : undefined;
  const initials = useMemo(() => {
    return member.name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [member.name]);

  return (
    <article
      className={`team-card relative z-40 w-full max-w-[440px] sm:max-w-[500px] md:max-w-[520px] lg:max-w-none lg:w-[300px] xl:w-[340px] 2xl:w-[360px] ${
        theme.wrapperClass ?? ''
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Card base */}
      <div className="relative z-10 overflow-hidden rounded-[32px] border border-emerald-500/10 bg-[#05251e] p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div
          className="relative rounded-[30px] pb-9"
          style={{
            background: theme.frameGradient,
          }}
        >
          {/* Avatar/Image Section */}
          <div className="relative w-full overflow-hidden rounded-t-[30px] border-b border-white/10">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              {member.avatar?.url ? (
                <Image
                  src={member.avatar.url}
                  alt={member.avatar.alt || member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 480px, (max-width: 1280px) 540px, 600px"
                  priority={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 text-4xl font-semibold text-white/85">
                  {initials}
                </div>
              )}
            </div>
            <div
              className="pointer-events-none absolute inset-0 rounded-t-[30px]"
              style={{
                background: theme.headerOverlay,
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.32) 100%)',
              }}
            />
          </div>

          {/* Content Section */}
          <div className="px-8 pt-9 md:px-9 md:pt-10">
            <div className="flex flex-col gap-4">
              <div className={`inline-flex items-center gap-2 rounded-full border ${theme.accentBorder} bg-[#0c3a2d] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-emerald-100/80`}>
                {localizedRole}
              </div>
              <h3 className="text-[28px] font-semibold text-white md:text-[32px]">{member.name}</h3>
              {localizedNarrative && (
                <p className="text-base leading-relaxed text-emerald-100/80 md:text-lg">
                  {localizedNarrative}
                </p>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-8 md:px-9">
            <div className="mt-9 flex items-center gap-3">
              <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-300 via-emerald-400/50 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-emerald-200/50">
                Orbit stabilised
              </span>
            </div>
          </div>

          {/* Decorative glows */}
          <div
            className="absolute -bottom-8 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full blur-[55px] opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(0, 214, 158, 0.35) 0%, transparent 70%)',
            }}
          />

          <div
            className={`absolute -bottom-6 right-5 h-11 w-11 rounded-full border border-white/10 backdrop-blur-xl ${theme.accentGlow}`}
          />
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// TEAM CARDS GRID COMPONENT
// ============================================================================
type TeamCardsGridProps = {
  members: TeamMember[];
  locale: string;
};

function TeamCardsGrid({ members, locale }: TeamCardsGridProps) {
  return (
    <div className="relative z-40 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:flex-nowrap md:gap-12">
      {members.map((member, index) => {
        const theme = CARD_THEMES[index] ?? CARD_THEMES[CARD_THEMES.length - 1];
        const narrative = CARD_NARRATIVES[member.name as keyof typeof CARD_NARRATIVES];

        return (
          <TeamSpotlightCard
            key={member.id}
            member={member}
            locale={locale}
            narrative={narrative}
            theme={theme}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// MAIN TEAM SECTION COMPONENT
// ============================================================================
export default function TeamSection() {
  const locale = useLocale();
  const hasMounted = useHasMounted();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { teamMembers, loading, error } = useTeamMembers({
    locale,
    featuredOnly: true,
  });

  const spotlightMembers = useMemo(() => {
    const ordered = SPOTLIGHT_ORDER.map((name) =>
      teamMembers.find((member) => member.name.toLowerCase() === name.toLowerCase()),
    ).filter((member): member is TeamMember => Boolean(member));

    if (ordered.length === SPOTLIGHT_ORDER.length) {
      return ordered;
    }

    const fallback = teamMembers.filter(
      (member) =>
        !SPOTLIGHT_ORDER.some((name) => name.toLowerCase() === member.name.toLowerCase()),
    );

    return [...ordered, ...fallback].slice(0, SPOTLIGHT_ORDER.length);
  }, [teamMembers]);

  // Respect reduced motion preference before wiring scroll effects.
  useEffect(() => {
    if (!hasMounted) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleMotionPreferenceChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleMotionPreferenceChange);
      }
    };
  }, [hasMounted]);

  // Build the scroll-driven reveal once motion is allowed and the DOM is ready.
  useEffect(() => {
    if (!hasMounted) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>('.team-card');

    if (!cards.length) return;

    if (prefersReducedMotion) {
      gsap.set(cards, { clearProps: 'transform,opacity' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = Array.from(cards);
      const cardCount = cardElements.length;
      const scrollDistance = cardCount > 1 ? (cardCount - 1) * 100 : 100;

      // Set initial states - cards start from bottom
      gsap.set(cardElements, { yPercent: 150, opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: 'power1.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${scrollDistance}%`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate cards to center (over the header)
      timeline.to(cardElements, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.4,
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [hasMounted, prefersReducedMotion, spotlightMembers.length]);

  // Loading state
  if (!hasMounted || loading) {
    return (
      <section className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48">
        <TeamSectionBackground />
        <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="flex flex-col items-center justify-center gap-4 text-center text-white/80">
            <span className="text-sm uppercase tracking-[0.4em] text-emerald-300/50">
              ExpandMatrix
            </span>
            <p className="text-2xl md:text-3xl font-semibold">Synchronising crew manifest…</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48">
        <TeamSectionBackground />
        <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <p className="text-red-400 text-2xl">Error loading team</p>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className="relative w-full overflow-hidden bg-black py-24 md:py-40 lg:py-48">
      {/* Background with blurry spots */}
      <TeamSectionBackground />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1780px] flex-col items-center px-6 md:px-12 xl:px-0">
        <div
          id="our-team-section"
          data-section="our-team"
          ref={sectionRef}
          className="relative flex min-h-screen w-full items-center justify-center overflow-visible"
        >
          {/* Header - pinned to center of section */}
          <TeamSectionHeader />

          {/* Cards - will animate over the header */}
          <div className="relative w-full z-50">
            <TeamCardsGrid members={spotlightMembers} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
