'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import type { TeamMember } from '@/hooks/useTeamMembers';
import { useHasMounted } from '@/hooks/useHasMounted';

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
    wrapperClass: '',
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
    <section className="relative w-full bg-[#020b08] py-24 md:py-40 lg:py-48 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,120,90,0.35),rgba(1,10,8,0.96))]" />
        <div
          className="absolute left-1/2 top-[46%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 166, 124, 0.45) 0%, rgba(0, 50, 39, 0) 70%)',
          }}
        />
        <div
          className="absolute right-[12%] top-[18%] h-[320px] w-[320px] rounded-full blur-[120px] opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(72, 255, 199, 0.38) 0%, rgba(12, 36, 29, 0) 70%)',
          }}
        />
        <div
          className="absolute left-[14%] bottom-[14%] h-[380px] w-[380px] rounded-full blur-[140px] opacity-25"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 214, 158, 0.28) 0%, rgba(10, 35, 28, 0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
        <div className="relative flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="heading-main text-center text-white/85 mb-12 md:mb-16 lg:mb-20">
            {t('title')}
          </h1>

          {/* Team Cards */}
          <div className="relative flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-12">
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
    <article
      className={`team-card relative w-full max-w-[440px] sm:max-w-[500px] md:max-w-[520px] lg:max-w-none lg:w-[300px] xl:w-[340px] 2xl:w-[360px] ${
        theme.wrapperClass ?? ''
      }`}
    >
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
    </article>
  );
}
