'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import ScrambleText from './ScrambleText';

type MemberConfig = {
  key: 'matejStipcak' | 'matejVenclik' | 'expandee';
  image?: string;
  accent: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  focusCount: number;
};

const MEMBER_CONFIG: MemberConfig[] = [
  {
    key: 'matejVenclik',
    image: '/images/team/matej-venclik.jpg',
    accent: 'linear-gradient(135deg, rgba(0, 164, 255, 0.6), rgba(96, 69, 255, 0.28))',
    linkedin: 'https://www.linkedin.com/in/mat%C4%9Bj-vencl%C3%ADk/',
    twitter: 'https://x.com/matejvenclikai',
    instagram: 'https://www.instagram.com/mvenclik.ai/',
    youtube: 'https://www.youtube.com/@MatejVenclikAI',
    focusCount: 3
  },
  {
    key: 'expandee',
    image: '/about/Expandee.png',
    accent: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(239, 68, 68, 0.3))',
    linkedin: 'https://www.linkedin.com/company/expand-matrix',
    twitter: 'https://x.com/ExpandMatrix',
    instagram: 'https://www.instagram.com/expand.matrix/',
    focusCount: 3
  },
  {
    key: 'matejStipcak',
    image: '/about/Matty.png',
    accent: 'linear-gradient(135deg, rgba(0, 215, 107, 0.7), rgba(0, 184, 92, 0.35))',
    linkedin: 'https://www.linkedin.com/in/mightymatty/',
    twitter: 'https://x.com/mightymattys',
    instagram: 'https://www.instagram.com/mightymatty/',
    focusCount: 3
  }
];

export default function TeamSection() {
  const t = useTranslations('sections.team');

  const members = useMemo(
    () =>
      MEMBER_CONFIG.map(member => ({
        ...member,
        name: t(`members.${member.key}.name`),
        role: t(`members.${member.key}.role`),
        bio: t(`members.${member.key}.bio`),
        focus: Array.from({ length: member.focusCount }, (_, index) =>
          t(`members.${member.key}.focus.${index}`)
        ),
      })),
    [t]
  );

  return (
    <section className="relative w-full bg-[#050505] py-24 md:py-36 lg:py-40 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 right-0 h-[520px] w-[520px] opacity-20 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(0, 215, 107, 0.25), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-[420px] w-[420px] opacity-20 blur-[160px]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(120, 118, 255, 0.18), transparent 65%)',
          }}
        />
        <div
          className="absolute top-1/3 left-0 h-[320px] w-[320px] opacity-15 blur-[150px]"
          style={{
            background:
              'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1780px] mx-auto px-6 md:px-12 xl:px-0">
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="heading-main inline-flex flex-col items-center gap-2 text-center">
            <ScrambleText text={t('title')} applyScramble={false} cursor={false} trigger="hover" />
          </h2>
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 text-7xl md:text-[8rem] lg:text-[10rem] font-extrabold uppercase tracking-[0.4em] text-white/5"
          >
            {t('title')}
          </span>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {members.map((member, index) => (
            <motion.article
              key={member.key}
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
              <meta itemProp="description" content={member.bio} />
              <div
                className="absolute -top-8 -left-8 h-28 w-24 rounded-3xl opacity-70 blur-3xl transition-transform duration-700 group-hover:scale-110"
                style={{ background: member.accent }}
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-white/[0.03] backdrop-blur-2xl shadow-[0_35px_120px_-40px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role} at Expand Matrix`}
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
                        backgroundImage: `${member.accent}, radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12), transparent 60%)`
                      }}
                    >
                      <span className="text-5xl font-semibold uppercase tracking-[0.35em] text-white/80 font-lato">
                        {member.name
                          .split(' ')
                          .map((part) => part[0]?.toUpperCase() ?? '')
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 opacity-100 transition-opacity duration-700 group-hover:via-black/35 group-hover:to-black/70" />
                </div>
                <div className="relative px-6 pb-8 pt-8 text-center backdrop-blur-3xl bg-white/[0.08] border-t border-white/15 overflow-hidden rounded-b-[2rem]">
                  {/* Enhanced Apple liquid glass effect layers */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.04] rounded-b-[2rem]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.08] to-transparent opacity-40" />
                  
                  
                  {/* Border glow effect */}
                  <div 
                    className="absolute inset-0 rounded-b-[2rem] border border-white/30 animate-border-glow"
                    style={{
                      '--glow-delay': Math.random() * 5,
                      '--glow-duration': `${2 + Math.random() * 3}s`
                    } as React.CSSProperties}
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-white font-lato">{member.name}</h3>
                    <p className="mt-2 text-[0.75rem] uppercase tracking-[0.45em] text-white/50 font-lato">
                      {member.role}
                    </p>
                    <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed font-lato">
                      {member.bio}
                    </p>
                    <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {member.focus.map((item, focusIndex) => (
                        <li
                          key={`${member.key}-focus-${focusIndex}`}
                          className="rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-[0.26em] text-white/80 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.12] group-hover:text-white font-lato"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-center gap-4">
                      {[
                        {
                          url: member.linkedin,
                          icon: Linkedin,
                          label: `${member.name} LinkedIn`
                        },
                        {
                          url: member.twitter,
                          icon: Twitter,
                          label: `${member.name} X profile`
                        },
                        {
                          url: member.instagram,
                          icon: Instagram,
                          label: `${member.name} Instagram`
                        },
                        {
                          url: member.youtube,
                          icon: Youtube,
                          label: `${member.name} YouTube`
                        }
                      ]
                        .filter((link): link is { url: string; icon: typeof Linkedin; label: string } => Boolean(link.url))
                        .map(({ url, icon: Icon, label }) => (
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
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
