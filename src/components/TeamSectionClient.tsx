'use client';

import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

import type { NormalizedTeamMember } from '@/types/team';
import AnimatedHeading from './AnimatedHeading';
import AnimatedReveal from './AnimatedReveal';

const DEFAULT_ACCENT =
  'linear-gradient(135deg, rgba(0, 215, 107, 0.7), rgba(0, 184, 92, 0.35))';

const SOCIAL_ICON_MAP = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
} as const;

interface TeamSectionCopy {
  title: string;
  empty: string;
}

interface TeamSectionClientProps {
  members: NormalizedTeamMember[];
  copy: TeamSectionCopy;
}

export default function TeamSectionClient({ members, copy }: TeamSectionClientProps) {
  const { title, empty } = copy;

  const backgroundStyle = useMemo<CSSProperties>(
    () => ({
      backgroundImage: [
        'radial-gradient(ellipse 58% 42% at 24% 12%, rgba(0, 255, 186, 0.8) 0%, rgba(0, 215, 107, 0.54) 55%, rgba(0, 184, 92, 0.24) 78%, transparent 92%)',
        'radial-gradient(ellipse 55% 50% at 72% 10%, rgba(110, 255, 206, 0.75) 0%, rgba(0, 215, 107, 0.5) 48%, rgba(0, 184, 92, 0.24) 70%, transparent 90%)',
        'radial-gradient(ellipse 60% 40% at 30% 44%, rgba(0, 215, 150, 0.64) 0%, rgba(0, 184, 92, 0.38) 58%, transparent 86%)',
        'radial-gradient(circle at 70% 78%, rgba(0, 215, 120, 0.6) 0%, rgba(0, 184, 92, 0.32) 60%, transparent 82%)',
        'radial-gradient(circle at 46% 88%, rgba(0, 255, 170, 0.5) 0%, rgba(0, 215, 107, 0.32) 55%, transparent 82%)',
        'linear-gradient(to bottom, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.0) 40%)',
        'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.0) 40%)',
        'linear-gradient(to right, rgba(3, 21, 13, 0.9) 0%, rgba(3, 21, 13, 0.0) 45%)',
        'linear-gradient(to left, rgba(3, 21, 13, 0.9) 0%, rgba(3, 21, 13, 0.0) 45%)',
      ].join(', '),
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
    }),
    [],
  );

  return (
    <section className="relative isolate w-full bg-gradient-to-b from-black via-[#041109] to-black py-24 md:py-36 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={backgroundStyle} />

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
        <div className="relative mx-auto max-w-3xl text-center">
          <AnimatedHeading
            as="h2"
            className="heading-main inline-flex flex-col items-center gap-2 text-center"
          >
            {title}
          </AnimatedHeading>
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 text-7xl md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.4em] text-white/5"
          >
            {title}
          </span>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {members.map((member, index) => {
              const accent = member.accent ?? DEFAULT_ACCENT;
              const socialLinks = (Object.entries(member.socials ?? {}) as Array<
                [keyof typeof SOCIAL_ICON_MAP, string | undefined]
              >)
                .filter(([, url]) => Boolean(url))
                .map(([key, url]) => ({
                  url: url as string,
                  icon: SOCIAL_ICON_MAP[key],
                  label: `${member.name} ${key}`,
                }));

              return (
                <AnimatedReveal
                  key={member.id}
                  as="article"
                  direction="up"
                  delay={index * 0.12}
                  distance={220}
                  viewportAmount={0.55}
                  fade={false}
                  className="group relative"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <meta itemProp="name" content={member.name} />
                  <meta itemProp="jobTitle" content={member.role} />
                  {member.bio ? <meta itemProp="description" content={member.bio} /> : null}
                  <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-black/[0.95] via-black/[0.98] to-black/[0.99] shadow-[0_30px_120px_-48px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] rounded-[inherit] pointer-events-none mix-blend-normal" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-50 rounded-[inherit] pointer-events-none mix-blend-normal" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-40 rounded-[inherit] pointer-events-none mix-blend-normal" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.04] to-transparent opacity-30 rounded-[inherit] pointer-events-none mix-blend-normal" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(closest-side,rgba(34,197,94,0.18),transparent_70%)] rotate-12" />
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {member.avatar?.url ? (
                        <Image
                          src={member.avatar.url}
                          alt={member.avatar.alt ?? `${member.name} portrait`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-all duration-700 grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105"
                          priority={index === 0}
                          itemProp="image"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center bg-[#0c0c0c]"
                          style={{
                            backgroundImage: `${accent}, radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12), transparent 60%)`,
                          }}
                        >
                          <span className="text-5xl font-semibold uppercase tracking-[0.35em] text-white/80 font-lato">
                            {member.name
                              .split(' ')
                              .map((part: string) => part[0]?.toUpperCase() ?? '')
                              .join('')
                              .slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/30 to-black/75 opacity-100 transition-opacity duration-700 group-hover:via-black/25 group-hover:to-black/65" />
                    </div>
                    <div className="relative px-6 pb-8 pt-8 text-center bg-transparent overflow-hidden rounded-b-[2rem]">
                      <div className="absolute inset-0 rounded-b-[2rem] bg-white/[0.08] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-2xl font-semibold text-white font-lato">{member.name}</h3>
                        <p className="mt-2 text-[0.75rem] uppercase tracking-[0.4em] text-white/55 font-lato">
                          {member.role}
                        </p>
                        {member.bio && member.bio.trim() ? (
                          <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed font-lato">
                            {member.bio}
                          </p>
                        ) : null}
                        {member.focus.length > 0 && (
                          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {member.focus.map((focusText, focusIndex) => (
                              <li
                                key={`${member.id}-focus-${focusIndex}`}
                                className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/80 transition-colors duration-300 group-hover:border-white/25 group-hover:bg-white/[0.12] group-hover:text-white font-lato"
                              >
                                {focusText}
                              </li>
                            ))}
                          </ul>
                        )}
                        {socialLinks.length > 0 && (
                          <div className="mt-6 flex items-center justify-center gap-4">
                            {socialLinks.map(({ url, icon: Icon, label }) => (
                              <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="me noopener noreferrer"
                                aria-label={label}
                                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.18] hover:text-white"
                                itemProp="sameAs"
                              >
                                <Icon className="h-5 w-5" />
                                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                   </div>
                </AnimatedReveal>
              );
            })}

          {members.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70">
              {empty}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
