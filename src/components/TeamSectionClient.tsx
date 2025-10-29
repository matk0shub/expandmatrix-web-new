'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

import type { NormalizedTeamMember } from '@/types/team';
import ScrambleText from './ScrambleText';

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
  error: string;
  empty: string;
}

interface TeamSectionClientProps {
  members: NormalizedTeamMember[];
  copy: TeamSectionCopy;
  showFallbackNotice: boolean;
}

export default function TeamSectionClient({ members, copy, showFallbackNotice }: TeamSectionClientProps) {
  const { title, error: errorCopy, empty } = copy;

  // Generate random animation values only on client side to prevent hydration mismatch
  const [animationValues, setAnimationValues] = useState<{ delay: number; duration: string }[]>([]);
  
  useEffect(() => {
    if (!members.length) {
      setAnimationValues([]);
      return;
    }

    setAnimationValues(
      members.map(() => ({
        delay: Math.random() * 5,
        duration: `${2 + Math.random() * 3}s`,
      }))
    );
  }, [members]);

  return (
    <section className="relative isolate w-full bg-gradient-to-b from-black via-[#041109] to-black py-24 md:py-36 lg:py-40 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[12%] left-[24%] h-[460px] w-[500px] blur-3xl opacity-68"
          style={{
            background:
              'radial-gradient(ellipse 58% 42%, rgba(0, 255, 186, 0.85) 0%, rgba(0, 215, 107, 0.58) 55%, rgba(0, 184, 92, 0.25) 78%, transparent 90%)',
          }}
        />
        <div
          className="absolute top-[8%] right-[28%] h-[480px] w-[520px] blur-3xl opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 55% 50%, rgba(110, 255, 206, 0.8) 0%, rgba(0, 215, 107, 0.52) 48%, rgba(0, 184, 92, 0.28) 70%, transparent 88%)',
          }}
        />
        <div
          className="absolute top-[44%] left-[30%] h-[420px] w-[420px] blur-3xl opacity-52"
          style={{
            background:
              'radial-gradient(ellipse 60% 40%, rgba(0, 215, 150, 0.68) 0%, rgba(0, 184, 92, 0.45) 58%, transparent 86%)',
          }}
        />
        <div
          className="absolute bottom-[22%] right-[30%] h-[420px] w-[440px] blur-3xl opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 215, 120, 0.66) 0%, rgba(0, 184, 92, 0.4) 60%, transparent 86%)',
          }}
        />
        <div
          className="absolute bottom-[12%] left-[46%] h-[340px] w-[360px] blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 255, 170, 0.6) 0%, rgba(0, 215, 107, 0.4) 55%, transparent 82%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 left-0 w-[320px] bg-gradient-to-r from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-y-0 right-0 w-[320px] bg-gradient-to-l from-black via-[#03150df5] to-transparent opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_56%,rgba(0,0,0,0.78)_100%)] opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent_30%,transparent_70%,rgba(0,0,0,0.55))]" />
      </div>

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="heading-main inline-flex flex-col items-center gap-2 text-center">
            <ScrambleText text={title} applyScramble={false} cursor={false} trigger="hover" />
          </h2>
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 text-7xl md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.4em] text-white/5"
          >
            {title}
          </span>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {showFallbackNotice && (
            <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center text-red-200">
              {errorCopy}
            </div>
          )}

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
                <motion.article
                  key={member.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="group relative"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <meta itemProp="name" content={member.name} />
                  <meta itemProp="jobTitle" content={member.role} />
                  {member.bio ? <meta itemProp="description" content={member.bio} /> : null}
                  <div
                    className="absolute -top-8 -left-8 h-28 w-24 rounded-3xl opacity-70 blur-3xl transition-transform duration-700 group-hover:scale-110"
                    style={{ background: accent }}
                  />
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-white/[0.03] backdrop-blur-2xl shadow-[0_35px_120px_-40px_rgba(0,0,0,0.8)]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {member.avatar?.url ? (
                        <Image
                          src={member.avatar.url}
                          alt={member.avatar.alt ?? `${member.name} portrait`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-all duration-700 grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105"
                          priority={index < 2}
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
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 opacity-100 transition-opacity duration-700 group-hover:via-black/35 group-hover:to-black/70" />
                    </div>
                    <div className="relative px-6 pb-8 pt-8 text-center backdrop-blur-3xl bg-white/[0.08] border-t border-white/15 overflow-hidden rounded-b-[2rem]">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.04] rounded-b-[2rem]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-70" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.08] to-transparent opacity-40" />
                      <div
                        className="absolute inset-0 rounded-b-[2rem] border border-white/30 animate-border-glow"
                        style={{
                          '--glow-delay': animationValues[index]?.delay || 0,
                          '--glow-duration': animationValues[index]?.duration || '2s',
                        } as React.CSSProperties}
                      />

                      <div className="relative z-10">
                        <h3 className="text-2xl font-semibold text-white font-lato">{member.name}</h3>
                        <p className="mt-2 text-[0.75rem] uppercase tracking-[0.45em] text-white/50 font-lato">
                          {member.role}
                        </p>
                        {member.bio && member.bio.trim() ? (
                          <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed font-lato">
                            {member.bio}
                          </p>
                        ) : null}
                        {member.focus.length > 0 && (
                          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {member.focus.map((focusText, focusIndex) => (
                              <li
                                key={`${member.id}-focus-${focusIndex}`}
                                className="rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-[0.26em] text-white/80 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.12] group-hover:text-white font-lato"
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
                                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
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
                </motion.article>
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
