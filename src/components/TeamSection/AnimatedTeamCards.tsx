'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TeamCardsGrid from './TeamCardsGrid';
import type { TeamMember } from '@/hooks/useTeamMembers';

interface AnimatedTeamCardsProps {
  members: TeamMember[];
  locale: string;
  sectionRef: React.RefObject<HTMLElement | null>;
  prefersReducedMotion: boolean;
}

export default function AnimatedTeamCards({
  members,
  locale,
  sectionRef,
  prefersReducedMotion,
}: AnimatedTeamCardsProps) {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = cardsContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.team-card'));
    if (!cards.length) return;

    gsap.registerPlugin(ScrollTrigger);

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
            trigger: container,
            start: 'top 75%',
            end: () => {
              const section = sectionRef.current;
              if (!section) return 'center center';
              const sectionTop = section.offsetTop;
              const sectionHeight = section.offsetHeight;
              return `${sectionTop + sectionHeight / 2}px center`;
            },
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, sectionRef]);

  return (
    <div ref={cardsContainerRef} className="relative w-full flex justify-center">
      <div className="w-full">
        <TeamCardsGrid members={members} locale={locale} />
      </div>
    </div>
  );
}

