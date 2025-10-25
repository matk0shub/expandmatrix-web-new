'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

import LocaleSwitcher from './LocaleSwitcher';
import ScrambleText from './ScrambleText';
import { CalCTAButton } from './CalCTAButton';

export default function HeroStatic() {
  const t = useTranslations('hero');
  const nav = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,215,107,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="relative w-full max-w-[1780px] mx-auto min-h-screen flex flex-col px-6 md:px-12 xl:px-0">
        <header className="py-8 md:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Expand Matrix logo"
                width={48}
                height={48}
                className="w-10 h-10"
                priority
              />
              <span className="font-bold tracking-wide font-lato">
                <ScrambleText text="EXPAND MATRIX" applyScramble={false} />
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm uppercase tracking-wider">
              {['about', 'services', 'references', 'faq', 'contact'].map((key) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <ScrambleText text={nav(key as Parameters<typeof nav>[0])} applyScramble={false} />
                </button>
              ))}
              <LocaleSwitcher />
            </nav>

            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen((prev) => !prev)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/80 p-6 lg:hidden space-y-4">
              {['about', 'services', 'references', 'faq', 'contact'].map((key) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="block w-full text-left text-white/85 text-base uppercase tracking-widest"
                >
                  {nav(key as Parameters<typeof nav>[0])}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10">
                <LocaleSwitcher />
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col justify-between pb-16">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              {t('eyebrow', { defaultValue: 'AI Innovation Studio' })}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight font-semibold max-w-4xl">
              <span className="block text-white">
                <ScrambleText text={t('heading.line1')} applyScramble={false} />
              </span>
              <span className="block text-white/90">
                <ScrambleText
                  text={`${t('heading.line2a')} ${t('heading.line2b')}`}
                  applyScramble={false}
                />
              </span>
              <span className="block text-white/80">
                <ScrambleText text={t('heading.line3')} applyScramble={false} />
              </span>
              <span className="block text-white/80">
                <ScrambleText text={t('heading.line4')} applyScramble={false} />
              </span>
            </h1>
          </div>

          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-white/75 text-lg md:text-xl max-w-2xl">
              <ScrambleText text={t('subtitle')} applyScramble={false} />
            </p>
            <CalCTAButton className="self-start md:self-auto">
              <ScrambleText text={t('cta')} applyScramble={false} />
            </CalCTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
