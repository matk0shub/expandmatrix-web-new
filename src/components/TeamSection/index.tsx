'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useEffect, useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/hooks/useTeamMembers';
import { useHasMounted } from '@/hooks/useHasMounted';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TeamSectionBackground from './TeamSectionBackground';
import TeamSectionHeader from './TeamSectionHeader';
import TeamCardsGrid from './TeamCardsGrid';
import { SPOTLIGHT_ORDER } from './constants';

export default function TeamSection() {
  const locale = useLocale();
  const t = useTranslations('sections.team');
  const hasMounted = useHasMounted();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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

  // EFFECT 1: Zastavit animaci nadpisu - ŽÁDNÁ GSAP ANIMACE NA HEADERU!
  useEffect(() => {
    if (!hasMounted) return;

    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const headerElement = sectionElement.querySelector('.team-heading') as HTMLElement;
    if (!headerElement) return;

    // Nastavit transform: none a zakázat všechny transformace
    gsap.set(headerElement, {
      clearProps: 'all',
      transform: 'none',
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotation: 0,
      skewX: 0,
      skewY: 0,
    });

    // Zabránit jakýmkoliv budoucím GSAP animacím na headeru
    gsap.to(headerElement, {
      x: 0,
      y: 0,
      overwrite: 'auto', // Přepsat všechny existující animace
    });
  }, [hasMounted]);

  // EFFECT 2: Animace POUZE karet - zcela izolované od headeru
  useEffect(() => {
    if (!hasMounted || prefersReducedMotion) return;

    const cardsContainer = cardsRef.current;
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.querySelectorAll<HTMLElement>('.team-card'));
    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger);

    // Vytvorit nový GSAP context POUZE pro karty
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsContainer,
            start: 'top 75%',
            end: () => {
              const sectionElement = sectionRef.current;
              if (!sectionElement) return 'center center';
              const sectionTop = sectionElement.offsetTop;
              const sectionHeight = sectionElement.offsetHeight;
              const sectionCenter = sectionTop + sectionHeight / 2;
              return `${sectionCenter}px center`;
            },
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    }, cardsContainer);

    return () => {
      ctx.revert();
    };
  }, [hasMounted, prefersReducedMotion]);

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
            <p className="text-2xl md:text-3xl font-semibold">{t('loading')}</p>
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
            <p className="text-red-400 text-2xl">{t('error')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section
      id="our-team-section"
      data-section="our-team"
      className="relative w-full bg-black py-24 md:py-40 lg:py-48"
      ref={sectionRef}
    >
      <TeamSectionBackground />

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0 flex flex-col items-center gap-16 lg:gap-24">
        <TeamSectionHeader />

        <div ref={cardsRef} className="relative w-full flex justify-center">
          <div className="w-full">
            <TeamCardsGrid members={spotlightMembers} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

