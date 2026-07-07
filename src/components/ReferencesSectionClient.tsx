'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type TouchEvent,
} from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Reference } from '@/types/references';
import GlassCardOverlays from './GlassCardOverlays';
import ReferenceList from './ReferenceList';
import ReferenceStatsCard from './ReferenceStatsCard';

interface ReferencesSectionCopy {
  metaName: string;
  metaDescription: string;
  overline: string;
  heading: string;
  subtitle: string;
  deliveredHeading: string;
  selectReference: string | ((name: string) => string);
  instagram: string;
  instagramAria: string | ((name: string) => string);
  website: string;
  websiteAria: string | ((name: string) => string);
}

interface ReferencesSectionClientProps {
  references: Reference[];
  copy: ReferencesSectionCopy;
}

export default function ReferencesSectionClient({
  references,
  copy,
}: ReferencesSectionClientProps): ReactElement | null {
  const prefersReducedMotion = useReducedMotion();
  const orderedReferences = useMemo(
    () => references.slice().sort((a, b) => a.order - b.order),
    [references],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(orderedReferences.length - 1, 0)));
  }, [orderedReferences.length]);

  useEffect(() => {
    if (orderedReferences.length < 2) return;
    if (prefersReducedMotion || hasInteracted) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % orderedReferences.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [orderedReferences.length, prefersReducedMotion, hasInteracted]);

  const goPrev = useCallback(() => {
    if (!orderedReferences.length) return;
    setHasInteracted(true);
    setActiveIndex((prev) => (prev - 1 + orderedReferences.length) % orderedReferences.length);
  }, [orderedReferences.length]);

  const goNext = useCallback(() => {
    if (!orderedReferences.length) return;
    setHasInteracted(true);
    setActiveIndex((prev) => (prev + 1) % orderedReferences.length);
  }, [orderedReferences.length]);

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setHasInteracted(true);
      setActiveIndex(index);
    },
    [activeIndex],
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    setHasInteracted(true);
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      if (touchStartX.current === null) return;

      const dx = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
      const swipeThreshold = 50;

      if (dx > swipeThreshold) {
        goPrev();
      } else if (dx < -swipeThreshold) {
        goNext();
      }

      touchStartX.current = null;
    },
    [goNext, goPrev],
  );

  if (!orderedReferences.length) {
    return null;
  }

  const activeReference = orderedReferences[activeIndex] ?? orderedReferences[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-black py-24 text-white md:py-40 lg:py-48"
      id="references"
      itemScope
      itemType="https://schema.org/ItemList"
      onMouseEnter={() => setHasInteracted(true)}
      onFocusCapture={() => setHasInteracted(true)}
    >
      <meta itemProp="name" content={copy.metaName} />
      <meta itemProp="description" content={copy.metaDescription} />

      {/* Complete ItemList markup: every reference, not just the visible one, so
          crawlers see all client organizations without interacting with tabs. */}
      <ul className="sr-only">
        {orderedReferences.map((reference, index) => (
          <li
            key={reference.id}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={String(index + 1)} />
            <div itemProp="item" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content={reference.name} />
              {reference.websiteUrl ? (
                <meta itemProp="url" content={reference.websiteUrl} />
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <BackgroundOrnaments />

      <div className="relative z-10 mx-auto w-full max-w-[1780px] px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
        <div className="mb-14 max-w-4xl md:mb-20 lg:mb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00d76b] sm:text-sm">
            {copy.overline}
          </p>
          <h2 className="heading-main mt-5 text-balance">{copy.heading}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
            {copy.subtitle}
          </p>
        </div>

        <div
          className="mx-auto flex w-full max-w-[980px] flex-col gap-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <article
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/95 via-black/98 to-black/99 px-5 py-6 shadow-[0_35px_120px_rgba(0,0,0,0.55)] sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            aria-live="polite"
            aria-atomic="true"
            id="reference-panel"
          >
            <GlassCardOverlays gradientOrder="rounded-first" accentOpacity="opacity-80" />

            <div className="relative z-10">
              <ReferenceList
                references={orderedReferences}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                prefersReducedMotion={prefersReducedMotion}
                mode="identity"
                copy={{
                  selectReference: copy.selectReference,
                  instagram: copy.instagram,
                  instagramAria: copy.instagramAria,
                  website: copy.website,
                  websiteAria: copy.websiteAria,
                }}
              />

              <div className="mt-8 border-t border-white/10 pt-8">
                <ReferenceStatsCard
                  metrics={activeReference.metrics}
                  heading={copy.deliveredHeading}
                />
              </div>
            </div>
          </article>

          <ReferenceList
            references={orderedReferences}
            activeIndex={activeIndex}
            onSelect={handleSelect}
            prefersReducedMotion={prefersReducedMotion}
            mode="tabs"
            copy={{
              selectReference: copy.selectReference,
              instagram: copy.instagram,
              instagramAria: copy.instagramAria,
              website: copy.website,
              websiteAria: copy.websiteAria,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -left-40 top-[12%] h-[420px] w-[520px] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 58% 46%, rgba(0, 215, 107, 0.18) 0%, rgba(0, 215, 107, 0.10) 48%, transparent 82%)',
        }}
      />
      <div
        className="absolute -right-44 top-[34%] h-[460px] w-[560px] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 54% 48%, rgba(0, 215, 107, 0.14) 0%, rgba(0, 184, 92, 0.10) 52%, transparent 84%)',
        }}
      />
      <div
        className="absolute bottom-[6%] left-1/2 h-[360px] w-[520px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 215, 107, 0.12) 0%, rgba(0, 215, 107, 0.08) 50%, transparent 82%)',
        }}
      />
    </div>
  );
}
