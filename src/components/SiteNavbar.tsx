'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import LocaleSwitcher from './LocaleSwitcher';
import { useFramerMotion } from '@/hooks/useFramerMotion';
import { fallbackMotion } from '@/utils/motionFallback';

type SiteNavbarProps = {
  variant?: 'hero' | 'page';
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
};

const NAV_LINKS: Array<{ id: string; labelKey: string }> = [
  { id: 'about', labelKey: 'about' },
  { id: 'services', labelKey: 'services' },
  { id: 'references', labelKey: 'references' },
  { id: 'faq', labelKey: 'faq' },
  { id: 'contact', labelKey: 'contact' },
];

export default function SiteNavbar({
  variant = 'page',
  onNavigateSection,
  className,
}: SiteNavbarProps) {
  const locale = useLocale();
  const navT = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const framer = useFramerMotion('instant');
  const motion = framer?.motion ?? fallbackMotion;
  const enableMotion = variant === 'hero';

  const wrapperClasses = clsx(
    'z-50',
    variant === 'hero' ? 'absolute inset-x-0 top-0' : 'relative',
    className,
  );

  const innerPadding = 'py-16 md:py-20';
  const desktopLinkClass =
    'text-white/80 hover:text-white transition-colors text-base font-medium uppercase tracking-wider font-lato';
  const mobileLinkClass =
    'text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider text-left';

  const sectionHref = (id: string) => `/${locale}#${id}`;

  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionSelect = (sectionId: string) => {
    onNavigateSection?.(sectionId);
    closeMenu();
  };

  const renderDesktopLink = (link: (typeof NAV_LINKS)[number]) => {
    if (onNavigateSection) {
      return (
        <button
          key={link.id}
          type="button"
          onClick={() => handleSectionSelect(link.id)}
          className={desktopLinkClass}
        >
          {navT(link.labelKey)}
        </button>
      );
    }

    return (
      <Link key={link.id} href={sectionHref(link.id)} className={desktopLinkClass} scroll>
        {navT(link.labelKey)}
      </Link>
    );
  };

  const renderMobileLink = (link: (typeof NAV_LINKS)[number]) => {
    if (onNavigateSection) {
      return (
        <button
          key={link.id}
          type="button"
          onClick={() => handleSectionSelect(link.id)}
          className={mobileLinkClass}
        >
          {navT(link.labelKey)}
        </button>
      );
    }

    return (
      <Link
        key={link.id}
        href={sectionHref(link.id)}
        className={mobileLinkClass}
        onClick={closeMenu}
        scroll
      >
        {navT(link.labelKey)}
      </Link>
    );
  };

  const logoWrapperClass = 'flex items-center gap-3 shrink-0';

  const logoContent = (
    <>
      <div className="w-8 h-8 flex items-center justify-center group">
        <svg
          viewBox="0 0 1041.587182 1000"
          className="w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
          aria-label="Expand Matrix Logo"
        >
          <defs>
            <style>{`
              .logo-fill { fill: #00d76b; }
              .group:hover .logo-fill { fill: #00e673; }
            `}</style>
          </defs>
          <polygon
            className="logo-fill transition-colors duration-300"
            points="963.414598 472.195172 925.243946 426.829244 807.134231 286.585378 140.243863 286.585378 140.243863 140.243866 680.366063 140.243866 562.256102 0 0 0 0 527.804828 38.170652 573.170756 140.243863 694.390344 156.280366 713.414622 519.878196 713.414622 401.768481 573.170756 226.890311 573.170756 140.243863 470.305027 140.243863 426.829244 739.390212 426.829244 823.170735 526.280478 823.170735 573.170756 504.329337 573.170756 624.207347 713.414622 749.329316 859.756134 286.890282 859.756134 404.999955 1000 932.926866 1000 932.926866 849.451234 823.170735 719.146472 818.353741 713.414622 963.414598 713.414622 963.414598 472.195172"
          />
        </svg>
      </div>
      <span className="text-white font-bold text-sm sm:text-base lg:text-lg whitespace-nowrap font-lato">
        EXPAND MATRIX
      </span>
    </>
  );

  const desktopNavChildren = (
    <>
      {NAV_LINKS.map(renderDesktopLink)}
      <LocaleSwitcher />
    </>
  );

  const mobileMenu = (
    <div className="lg:hidden mt-4 bg-black/95 backdrop-blur-sm border-t border-white/10 rounded-lg">
      <nav className="flex flex-col p-6 space-y-4" id="site-mobile-nav">
        {NAV_LINKS.map(renderMobileLink)}
        <div className="pt-4 border-t border-white/10">
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );

  return (
    <header className={wrapperClasses}>
      <div className={clsx('w-full max-w-[1780px] mx-auto px-0', innerPadding)}>
        <div className="flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24">
          {enableMotion ? (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={logoWrapperClass}
            >
              {logoContent}
            </motion.div>
          ) : (
            <div className={logoWrapperClass}>{logoContent}</div>
          )}

          {enableMotion ? (
            <motion.nav
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex items-center gap-6 xl:gap-8"
              aria-label="Primary navigation"
            >
              {desktopNavChildren}
            </motion.nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary navigation">
              {desktopNavChildren}
            </nav>
          )}

          {enableMotion ? (
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden text-white p-2"
              aria-label={isMenuOpen ? navT('menuToggleClose') : navT('menuToggleOpen')}
              aria-expanded={isMenuOpen}
              aria-controls="site-mobile-nav"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden text-white p-2"
              aria-label={isMenuOpen ? navT('menuToggleClose') : navT('menuToggleOpen')}
              aria-expanded={isMenuOpen}
              aria-controls="site-mobile-nav"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {isMenuOpen &&
          (enableMotion ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {mobileMenu}
            </motion.div>
          ) : (
            mobileMenu
          ))}
      </div>
    </header>
  );
}
