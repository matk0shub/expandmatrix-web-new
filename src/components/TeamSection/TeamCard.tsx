'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import type { TeamSpotlightCardProps } from './types';
import { getLocalizedCopy } from './constants';

export default function TeamCard({
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

