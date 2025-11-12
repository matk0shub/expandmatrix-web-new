import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import SiteNavbar from '@/components/SiteNavbar';
import { legalContent, getSectionIcon } from '@/data/legalContent';

interface PageParams {
  locale: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<PageParams> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  const localeKey = locale === 'cs' ? 'cs' : 'en';
  const content = legalContent.privacy[localeKey];
  const HeroIcon = getSectionIcon('Shield');

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-black text-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 space-y-16">
          <div className="flex items-center gap-4 text-sm text-white/60">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-300"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur">
                ←
              </span>
              {t('back')}
            </Link>
          </div>

          <header className="text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur">
              <HeroIcon className="h-7 w-7 text-[#00d76b]" />
            </div>
            <div className="space-y-3">
              <p className="text-white/60 uppercase tracking-[0.3em] text-xs">{content.subtitle}</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl font-lato">
                {content.title}
              </h1>
              <p className="text-white/60">{content.updated}</p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            {content.sections.map((section) => {
              const Icon = getSectionIcon(section.icon);
              return (
                <article
                  key={section.key}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-lg shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-[#00d76b]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white font-lato">{section.title}</h2>
                  </div>
                  <div className="space-y-4 text-white/70 leading-relaxed">
                    {section.body.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-[#00d76b]/10 p-8 text-center backdrop-blur">
            <p className="text-white/60">{t('contact')}</p>
            <div className="mt-4 space-y-1 text-sm text-white/70">
              {content.companyInfo.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
