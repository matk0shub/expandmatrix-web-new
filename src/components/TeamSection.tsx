'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/hooks/useTeamMembers';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasMounted } from '@/hooks/useHasMounted';

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
  wrapperClass?: string;
  glowStyle: string;
  frameGradient: string;
  headerOverlay: string;
  accentBorder: string;
  accentGlow: string;
};

const CARD_THEMES: TeamCardTheme[] = [
  {
    wrapperClass: 'lg:-rotate-2',
    glowStyle: 'radial-gradient(circle at 32% 22%, rgba(0, 166, 124, 0.55), transparent 72%)',
    frameGradient:
      'linear-gradient(145deg, rgba(4, 26, 22, 0.95), rgba(2, 14, 12, 0.97) 60%, rgba(1, 8, 7, 0.98))',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 166, 124, 0.35), rgba(0, 54, 44, 0.05))',
    accentBorder: 'border-emerald-300/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,166,124,0.35),transparent_65%)]',
  },
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 55% 28%, rgba(0, 208, 150, 0.58), transparent 70%)',
    frameGradient:
      'linear-gradient(150deg, rgba(3, 24, 21, 0.95), rgba(1, 13, 11, 0.97) 55%, rgba(1, 8, 7, 0.98))',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 195, 142, 0.32), rgba(0, 46, 37, 0.08))',
    accentBorder: 'border-emerald-200/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,195,142,0.32),transparent_65%)]',
  },
  {
    wrapperClass: 'lg:rotate-2',
    glowStyle: 'radial-gradient(circle at 72% 80%, rgba(0, 180, 135, 0.5), transparent 70%)',
    frameGradient:
      'linear-gradient(150deg, rgba(4, 25, 22, 0.95), rgba(2, 14, 12, 0.97) 55%, rgba(1, 8, 7, 0.98))',
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

export default function TeamSection() {
  const t = useTranslations('sections.team');
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const hasMounted = useHasMounted();
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

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!spotlightMembers.length) return;

    const stage = stageRef.current;
    const cardsRow = cardsRowRef.current;

    if (!stage || !cardsRow) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        gsap.killTweensOf(cardsRow);
        timelineRef.current?.kill();

        gsap.set(cardsRow, {
          yPercent: 55,
          autoAlpha: 0,
        });

        timelineRef.current = gsap
          .timeline({
            defaults: { ease: 'power1.out' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: '+=160%',
              scrub: true,
              pin: stage,
              anticipatePin: 0.9,
              invalidateOnRefresh: true,
            },
          })
          .to(cardsRow, { autoAlpha: 1, yPercent: 0, duration: 0.35 })
          .to(cardsRow, { yPercent: -120, duration: 0.75, ease: 'power1.inOut' })
          .to(cardsRow, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, '-=0.15');

        ScrollTrigger.refresh();
      }, stage);

      return () => {
        timelineRef.current?.kill();
        timelineRef.current = null;
        ctx.revert();
      };
    });

    return () => {
      mm.kill();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [prefersReducedMotion, spotlightMembers.length]);

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

  const rowClassName = [
    'relative mt-12 flex w-full max-w-5xl flex-col items-center gap-10',
    'lg:flex-row lg:justify-center lg:gap-12',
    prefersReducedMotion
      ? 'lg:mt-16'
      : 'lg:absolute lg:top-1/2 lg:left-1/2 lg:z-10 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2',
  ].join(' ');

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#020b08] py-24 md:py-40 lg:py-48 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,120,90,0.35),rgba(1,10,8,0.96))]" />
        <motion.div
          className="absolute left-1/2 top-[46%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.9, 1.15, 0.9],
                }
          }
          transition={{
            duration: 18,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle, rgba(0, 166, 124, 0.45) 0%, rgba(0, 50, 39, 0) 70%)',
          }}
        />
        <motion.div
          className="absolute right-[12%] top-[18%] h-[320px] w-[320px] rounded-full blur-[120px]"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [-16, 18, -16],
                  opacity: [0.18, 0.42, 0.18],
                }
          }
          transition={{
            duration: 16,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle, rgba(72, 255, 199, 0.38) 0%, rgba(12, 36, 29, 0) 70%)',
          }}
        />
        <motion.div
          className="absolute left-[14%] bottom-[14%] h-[380px] w-[380px] rounded-full blur-[140px]"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [-18, 16, -18],
                  opacity: [0.16, 0.38, 0.16],
                }
          }
          transition={{
            duration: 20,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle, rgba(0, 214, 158, 0.28) 0%, rgba(10, 35, 28, 0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
        <div
          ref={stageRef}
          className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-visible"
        >
          <h1 className="heading-main text-center text-white/85">{t('title')}</h1>
          <div ref={cardsRowRef} className={rowClassName}>
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
                  prefersReducedMotion={prefersReducedMotion}
                />
              );
            })}
          </div>
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
  prefersReducedMotion: boolean;
};

function TeamSpotlightCard({
  member,
  locale,
  narrative,
  theme,
  prefersReducedMotion,
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
    <motion.article
      className={`team-card relative w-full max-w-[440px] sm:max-w-[500px] md:max-w-[520px] lg:max-w-none lg:w-[300px] xl:w-[340px] 2xl:w-[360px] ${
        theme.wrapperClass ?? ''
      } ${prefersReducedMotion ? '' : 'group/card'}`}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1.02,
              rotateZ: 0,
            }
      }
      transition={{ duration: 0.45, ease: 'easeOut' }}
      tabIndex={0}
    >
      <div className="pointer-events-none absolute -inset-20 rounded-[42px] opacity-0 blur-3xl transition duration-700 group-hover/card:opacity-100">
        <div
          className="h-full w-full rounded-[42px]"
          style={{
            background: theme.glowStyle,
          }}
        />
      </div>
      <div className="relative z-10 overflow-hidden rounded-[30px] border border-white/10 bg-black/30 backdrop-blur-3xl p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div
          className="relative rounded-[28px] pb-9"
          style={{
            background: theme.frameGradient,
          }}
        >
          <div className="relative w-full overflow-hidden rounded-t-[28px] border-b border-white/10">
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
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/40 via-emerald-400/30 to-transparent text-4xl font-semibold text-white/85">
                  {initials}
                </div>
              )}
            </div>
            <div
              className="pointer-events-none absolute inset-0 rounded-t-[28px]"
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

          <div className="px-8 pt-9 md:px-9 md:pt-10">
            <div className="flex flex-col gap-4">
              <div className={`inline-flex items-center gap-2 rounded-full border ${theme.accentBorder} bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-emerald-100/80`}>
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

          <div className="px-8 md:px-9">
            <div className="mt-9 flex items-center gap-3">
              <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-300 via-emerald-400/50 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-emerald-200/50">
                Orbit stabilised
              </span>
            </div>
          </div>

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
    </motion.article>
  );
}
