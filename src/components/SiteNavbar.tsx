'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { CalCTAButton } from './CalCTAButton';
import LocaleSwitcher from './LocaleSwitcher';

type Mode = 'scroll' | 'link';
type Variant = 'landing' | 'page';

const NAV_SECTIONS: Array<{ key: string; id: string }> = [
  { key: 'about', id: 'about' },
  { key: 'services', id: 'services' },
  { key: 'process', id: 'process' },
  { key: 'references', id: 'references' },
  { key: 'team', id: 'team' },
  { key: 'faq', id: 'faq' },
];

interface SiteNavbarProps {
  mode?: Mode;
  variant?: Variant;
  onNavigate?: (section: string) => void;
  localeOverride?: string;
}

export default function SiteNavbar({
  mode = 'scroll',
  variant = 'landing',
  onNavigate,
  localeOverride,
}: SiteNavbarProps) {
  const currentLocale = useLocale();
  const locale = localeOverride ?? currentLocale;
  const tNav = useTranslations('navigation');
  const [open, setOpen] = useState(false);

  const handleNavigate = (id: string) => {
    setOpen(false);
    if (mode === 'scroll') {
      onNavigate?.(id);
    }
  };

  const headerClass =
    variant === 'landing'
      ? 'absolute top-0 left-0 right-0 z-50 bg-transparent'
      : 'sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-2xl';

  const containerPadding = 'px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24';

  const renderNavItem = (sectionId: string, labelKey: string) => {
    if (mode === 'link') {
      return (
        <Link
          key={sectionId}
          href={`/${locale}/#${sectionId}`}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
          onClick={() => setOpen(false)}
        >
          {tNav(labelKey)}
        </Link>
      );
    }

    return (
      <button
        key={sectionId}
        type="button"
        onClick={() => handleNavigate(sectionId)}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
      >
        {tNav(labelKey)}
      </button>
    );
  };

  const renderCta = () => {
    const label = tNav.has('cta') ? tNav('cta') : tNav('contact');
    if (mode === 'link') {
      return (
        <CalCTAButton href={`/${locale}#contact`} size="sm" onClick={() => setOpen(false)}>
          {label}
        </CalCTAButton>
      );
    }

    return (
      <CalCTAButton size="sm" onClick={() => handleNavigate('contact')}>
        {label}
      </CalCTAButton>
    );
  };

  return (
    <>
      <header className={headerClass}>
        <div className={`mx-auto flex w-full max-w-[1780px] items-center justify-between ${containerPadding} py-6`}>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-white transition duration-200 hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <svg viewBox="0 0 1041.587182 1000" className="h-6 w-6 text-[#00d76b]" aria-hidden="true">
                <polygon
                  fill="currentColor"
                  points="963.414598 472.195172 925.243946 426.829244 807.134231 286.585378 140.243863 286.585378 140.243863 140.243866 680.366063 140.243866 562.256102 0 0 0 0 527.804828 38.170652 573.170756 140.243863 694.390344 156.280366 713.414622 519.878196 713.414622 401.768481 573.170756 226.890311 573.170756 140.243863 470.305027 140.243863 426.829244 739.390212 426.829244 823.170735 526.280478 823.170735 573.170756 504.329337 573.170756 624.207347 713.414622 749.329316 859.756134 286.890282 859.756134 404.999955 1000 932.926866 1000 932.926866 849.451234 823.170735 719.146472 818.353741 713.414622 963.414598 713.414622 963.414598 472.195172"
                />
              </svg>
            </div>
            <span className="font-lato text-sm font-semibold tracking-[0.2em] text-white">EXPAND MATRIX</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_SECTIONS.map((section) => renderNavItem(section.id, section.key))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            {renderCta()}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 p-2 text-white lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? tNav('menuToggleClose') : tNav('menuToggleOpen')}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="border-b border-white/10 bg-black/90 py-6 lg:hidden">
          <div className={`mx-auto flex w-full max-w-[1780px] flex-col gap-4 ${containerPadding}`}>
            {NAV_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  mode === 'link'
                    ? (window.location.href = `/${locale}/#${section.id}`)
                    : handleNavigate(section.id)
                }
                className="text-base font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-white text-left"
              >
                {tNav(section.key)}
              </button>
            ))}
            <div className="flex items-center justify-between pt-4">
              <LocaleSwitcher />
              {renderCta()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
