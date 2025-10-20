'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import ScrambleText from './ScrambleText';

type MemberConfig = {
  key: 'strategist' | 'technologist' | 'designer' | 'operator';
  image: string;
  accent: string;
  linkedin?: string;
  twitter?: string;
  focusCount: number;
};

const MEMBER_CONFIG: MemberConfig[] = [
  {
    key: 'strategist',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1600&auto=format&fit=crop',
    accent: 'linear-gradient(135deg, rgba(0, 215, 107, 0.7), rgba(0, 184, 92, 0.4))',
    linkedin: 'https://www.linkedin.com/company/expandmatrix/',
    twitter: 'https://twitter.com/expandmatrix',
    focusCount: 3,
  },
  {
    key: 'technologist',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
    accent: 'linear-gradient(135deg, rgba(0, 164, 255, 0.65), rgba(96, 69, 255, 0.35))',
    linkedin: 'https://www.linkedin.com/company/expandmatrix/',
    twitter: 'https://twitter.com/expandmatrix',
    focusCount: 3,
  },
  {
    key: 'designer',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop',
    accent: 'linear-gradient(135deg, rgba(255, 165, 0, 0.6), rgba(255, 94, 98, 0.35))',
    linkedin: 'https://www.linkedin.com/company/expandmatrix/',
    twitter: 'https://twitter.com/expandmatrix',
    focusCount: 3,
  },
  {
    key: 'operator',
    image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=1600&auto=format&fit=crop',
    accent: 'linear-gradient(135deg, rgba(255, 99, 164, 0.6), rgba(132, 94, 247, 0.35))',
    linkedin: 'https://www.linkedin.com/company/expandmatrix/',
    twitter: 'https://twitter.com/expandmatrix',
    focusCount: 3,
  },
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

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
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
                className="absolute -top-8 -left-8 h-28 w-24 rounded-[36px] opacity-70 blur-3xl transition-transform duration-700 group-hover:scale-110"
                style={{ background: member.accent }}
              />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.03] via-[#0d0d0d] to-[#050505] shadow-[0_35px_120px_-40px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role} at Expand Matrix`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-all duration-700 grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105"
                    priority={index < 2}
                    itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 opacity-100 transition-opacity duration-700 group-hover:via-black/35 group-hover:to-black/70" />
                </div>
                <div className="relative px-8 pb-10 pt-10 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-white/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
                    <p className="mt-2 text-[0.75rem] uppercase tracking-[0.45em] text-white/50">
                      {member.role}
                    </p>
                    <p className="mt-6 text-sm md:text-base text-white/70 leading-relaxed">
                      {member.bio}
                    </p>
                    <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
                      {member.focus.map((item, focusIndex) => (
                        <li
                          key={`${member.key}-focus-${focusIndex}`}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs sm:text-[0.65rem] uppercase tracking-[0.26em] text-white/70 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex items-center justify-center gap-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="me noopener noreferrer"
                          aria-label={`${member.name} LinkedIn`}
                          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                          itemProp="sameAs"
                        >
                          <Linkedin className="h-5 w-5" />
                          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="me noopener noreferrer"
                          aria-label={`${member.name} X profile`}
                          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                          itemProp="sameAs"
                        >
                          <Twitter className="h-5 w-5" />
                          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </a>
                      )}
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
