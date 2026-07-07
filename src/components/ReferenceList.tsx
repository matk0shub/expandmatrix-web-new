'use client';

import { useRef, type KeyboardEvent } from 'react';
import { Globe, Instagram } from 'lucide-react';

import type { Reference } from '@/types/references';
import ClientLogo from './ClientLogo';

interface ReferenceListCopy {
  selectReference: string | ((name: string) => string);
  instagram: string;
  instagramAria: string | ((name: string) => string);
  website: string;
  websiteAria: string | ((name: string) => string);
}

interface ReferenceListProps {
  references: Reference[];
  activeIndex: number;
  onSelect: (index: number) => void;
  prefersReducedMotion: boolean;
  mode: 'identity' | 'tabs';
  copy: ReferenceListCopy;
}

const formatLabel = (template: string | ((name: string) => string), name: string) => {
  if (typeof template === 'function') {
    return template(name);
  }

  return template.replace(/\{name\}/g, name);
};

const linkButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-[#00d76b]/40 px-4 py-2 text-xs font-semibold text-[#00d76b] transition-colors hover:bg-[#00d76b]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d76b]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-5 sm:text-sm';

export default function ReferenceList({
  references,
  activeIndex,
  onSelect,
  prefersReducedMotion,
  mode,
  copy,
}: ReferenceListProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeReference = references[activeIndex] ?? references[0];

  if (!activeReference) {
    return null;
  }

  if (mode === 'tabs') {
    // Standard ARIA tabs keyboard pattern: arrows move between tabs only when a
    // tab is focused (scoped here, not on the whole section), moving both
    // selection and focus so links inside the panel are never hijacked.
    const handleTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (references.length < 2) return;

      let nextIndex: number | null = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (activeIndex + 1) % references.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (activeIndex - 1 + references.length) % references.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = references.length - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      onSelect(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    };

    return (
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div
          className="flex min-w-max items-center gap-3 sm:min-w-0 sm:flex-wrap sm:justify-center"
          role="tablist"
          aria-label={formatLabel(copy.selectReference, activeReference.name)}
          onKeyDown={handleTabsKeyDown}
        >
          {references.map((reference, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={reference.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="reference-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(index)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d76b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  isActive
                    ? 'border border-transparent bg-[#00d76b] text-[#050a08]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                aria-label={formatLabel(copy.selectReference, reference.name)}
              >
                {reference.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
      <ClientLogo logoUrl={undefined} name={activeReference.name} alt={activeReference.name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {activeReference.name}
            </h3>

            {activeReference.subtitle ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                {activeReference.subtitle}
              </p>
            ) : null}
          </div>

          {activeReference.sector ? (
            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#00d76b]/30 bg-[#00d76b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#00d76b]">
              {activeReference.sector}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {activeReference.instagramUrl ? (
            <a
              href={activeReference.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                prefersReducedMotion
                  ? linkButtonClass
                  : `${linkButtonClass} active:bg-[#00d76b]/15`
              }
              aria-label={formatLabel(copy.instagramAria, activeReference.name)}
            >
              <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{copy.instagram}</span>
            </a>
          ) : null}

          {activeReference.websiteUrl ? (
            <a
              href={activeReference.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                prefersReducedMotion
                  ? linkButtonClass
                  : `${linkButtonClass} active:bg-[#00d76b]/15`
              }
              aria-label={formatLabel(copy.websiteAria, activeReference.name)}
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{copy.website}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
