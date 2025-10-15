'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/hooks/useTeamMembers';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

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
  glowStyle: string;
  frameGradient: string;
  headerOverlay: string;
  accentBorder: string;
  accentGlow: string;
};

const CARD_THEMES: TeamCardTheme[] = [
  {
    glowStyle: 'radial-gradient(circle at 32% 22%, rgba(0, 166, 124, 0.6), transparent 72%)',
    frameGradient:
      'linear-gradient(145deg, rgba(11, 47, 38, 0.98), rgba(5, 25, 20, 0.99) 60%, rgba(2, 12, 10, 1))',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 166, 124, 0.4), rgba(0, 54, 44, 0.1))',
    accentBorder: 'border-emerald-400/50',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,166,124,0.4),transparent_70%)]',
  },
  {
    glowStyle: 'radial-gradient(circle at 55% 28%, rgba(0, 208, 150, 0.65), transparent 70%)',
    frameGradient:
      'linear-gradient(150deg, rgba(11, 45, 37, 0.98), rgba(5, 23, 19, 0.99) 55%, rgba(2, 12, 10, 1))',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 195, 142, 0.38), rgba(0, 46, 37, 0.12))',
    accentBorder: 'border-emerald-300/50',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,195,142,0.38),transparent_70%)]',
  },
  {
    glowStyle: 'radial-gradient(circle at 72% 80%, rgba(0, 180, 135, 0.55), transparent 70%)',
    frameGradient:
      'linear-gradient(150deg, rgba(11, 43, 38, 0.98), rgba(5, 22, 19, 0.99) 55%, rgba(2, 12, 10, 1))',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 180, 135, 0.35), rgba(0, 40, 32, 0.12))',
    accentBorder: 'border-emerald-300/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,180,135,0.38),transparent_70%)]',
  },
];

const getLocalizedCopy = <T extends Record<string, string>>(dictionary: T, locale: string) => {
  return (
    dictionary[locale as keyof T] ??
    dictionary[FALLBACK_LOCALE as unknown as keyof T] ??
    Object.values(dictionary)[0]
  );
};

export default function TeamSection() {
  const t = useTranslations('sections.team');
  const locale = useLocale();
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  const { teamMembers, loading, error } = useTeamMembers({
    locale,
    featuredOnly: true,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);

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

  // GSAP Scroll Animation
  useEffect(() => {
    if (prefersReducedMotion || !spotlightMembers.length || !hasMounted) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const heading = headingRef.current;
    const cardsRow = cardsRowRef.current;

    if (!section || !container || !heading || !cardsRow) return;

    const cards = gsap.utils.toArray<HTMLElement>(cardsRow.children);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial state: cards below viewport
      gsap.set(cards, {
        y: '30vh',
        opacity: 0,
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${(cards.length - 1) * 100}%`,
          scrub: true,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      // Animate each card moving up and through the heading
      cards.forEach((card, index) => {
        const startProgress = index / cards.length;
        const endProgress = (index + 1) / cards.length;

        tl.to(
          card,
          {
            y: '-100vh',
            opacity: 1,
            ease: 'none',
          },
          startProgress
        );

        // Fade out as it goes past
        tl.to(
          card,
          {
            opacity: 0,
            ease: 'power1.in',
          },
          endProgress - 0.1
        );
      });

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, [spotlightMembers, hasMounted, prefersReducedMotion]);

  if (!hasMounted || loading) {
    return (
      <section className="relative w-full bg-[#020b08] py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
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

  if (error) {
    return (
      <section className="relative w-full bg-[#020b08] py-24 md:py-40 lg:py-48">
        <div className="w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
          <div className="text-center">
            <p className="text-red-400 text-2xl">Error loading team</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#020b08] overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,120,90,0.4),rgba(1,10,8,0.98))]" />
        <div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px] opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 166, 124, 0.5) 0%, rgba(0, 50, 39, 0) 70%)',
          }}
        />
        <div
          className="absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full blur-[140px] opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(72, 255, 199, 0.4) 0%, rgba(12, 36, 29, 0) 70%)',
          }}
        />
        <div
          className="absolute left-[10%] bottom-[20%] h-[450px] w-[450px] rounded-full blur-[160px] opacity-25"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 214, 158, 0.3) 0%, rgba(10, 35, 28, 0) 70%)',
          }}
        />
      </div>

      {/* Main container - will be pinned */}
      <div
        ref={containerRef}
        className="relative min-h-screen w-full flex items-center justify-center"
      >
        {/* Fixed heading in center */}
        <h1
          ref={headingRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 heading-main text-center text-white/90 px-6 pointer-events-none"
          style={{
            textShadow: '0 4px 20px rgba(0, 166, 124, 0.3)',
          }}
        >
          {t('title')}
        </h1>

        {/* Cards row - will scroll through */}
        <div
          ref={cardsRowRef}
          className="relative z-10 flex gap-8 lg:gap-12 items-center justify-center px-6 md:px-12"
        >
          {spotlightMembers.map((member, index) => {
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
      </div>
    </section>
  );
}

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
    <article className="team-card relative w-full max-w-[380px] lg:w-[360px] xl:w-[400px] 2xl:w-[420px] flex-shrink-0">
      {/* Glow effect */}
      <div className="pointer-events-none absolute -inset-24 rounded-[48px] opacity-60 blur-[100px]">
        <div
          className="h-full w-full rounded-[48px]"
          style={{
            background: theme.glowStyle,
          }}
        />
      </div>

      {/* Card content */}
      <div className="relative z-10 overflow-hidden rounded-[32px] border border-white/15 bg-black/40 backdrop-blur-3xl p-[1.5px] shadow-[0_40px_140px_rgba(0,0,0,0.5)]">
        <div
          className="relative rounded-[30px] pb-10"
          style={{
            background: theme.frameGradient,
          }}
        >
          {/* Image header */}
          <div className="relative w-full overflow-hidden rounded-t-[30px] border-b border-white/15">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {member.avatar?.url ? (
                <Image
                  src={member.avatar.url}
                  alt={member.avatar.alt || member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 420px, 480px"
                  priority={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/50 via-emerald-400/35 to-transparent text-5xl font-semibold text-white/90">
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
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
              }}
            />
          </div>

          {/* Card body */}
          <div className="px-9 pt-10 md:px-10 md:pt-11">
            <div className="flex flex-col gap-5">
              <div className={`inline-flex items-center gap-2 rounded-full border ${theme.accentBorder} bg-white/8 px-5 py-2.5 text-[11px] uppercase tracking-[0.35em] text-emerald-100/85`}>
                {localizedRole}
              </div>
              <h3 className="text-[32px] font-semibold text-white md:text-[36px]">{member.name}</h3>
              {localizedNarrative && (
                <p className="text-lg leading-relaxed text-emerald-100/85 md:text-xl">
                  {localizedNarrative}
                </p>
              )}
            </div>
          </div>

          {/* Footer accent */}
          <div className="px-9 md:px-10">
            <div className="mt-10 flex items-center gap-3">
              <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 via-emerald-400/60 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-emerald-200/60">
                Orbit stabilised
              </span>
            </div>
          </div>

          {/* Bottom glow */}
          <div
            className="absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-[60px] opacity-75"
            style={{
              background: 'radial-gradient(circle, rgba(0, 214, 158, 0.4) 0%, transparent 70%)',
            }}
          />

          {/* Accent orb */}
          <div
            className={`absolute -bottom-7 right-6 h-12 w-12 rounded-full border border-white/15 backdrop-blur-xl ${theme.accentGlow}`}
          />
        </div>
      </div>
    </article>
  );
}
