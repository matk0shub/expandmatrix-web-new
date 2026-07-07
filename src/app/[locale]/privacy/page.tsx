import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import Footer from '@/components/Footer';
import SiteNavbar from '@/components/SiteNavbar';
import { legalContent, getSectionIcon } from '@/data/legalContent';

const BASE_URL = 'https://expandmatrix.com';
const OG_IMAGE_URL = `${BASE_URL}/og-image.png`;

interface PageParams {
  locale: string;
}

type RouteProps = { params: Promise<PageParams> };

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'cs' }];
}

export const revalidate = false;

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  const localePath = locale === 'cs' ? 'cs' : 'en';
  const pageUrl = `${BASE_URL}/${localePath}/privacy`;
  const title = t('metaTitle');
  const description = t('metaDescription');

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${BASE_URL}/cs/privacy`,
        en: `${BASE_URL}/en/privacy`,
        'x-default': `${BASE_URL}/en/privacy`,
      },
    },
    openGraph: {
      type: 'website',
      locale: localePath === 'cs' ? 'cs_CZ' : 'en_US',
      alternateLocale: localePath === 'cs' ? 'en_US' : 'cs_CZ',
      url: pageUrl,
      title,
      description,
      siteName: 'Expand Matrix',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: 'Expand Matrix',
        },
      ],
    },
  };
}

export default async function PrivacyPolicyPage({ params }: RouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });
  const localeKey = locale === 'cs' ? 'cs' : 'en';
  const content = legalContent.privacy[localeKey];
  const HeroIcon = getSectionIcon('Shield');

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-black text-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1780px] px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 space-y-16">
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

          <header className="rounded-[40px] border border-white/10 bg-white/[0.03] px-8 py-10 backdrop-blur xl:px-14 xl:py-16">
            <div className="flex flex-col gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/5 backdrop-blur lg:mx-0">
                <HeroIcon className="h-9 w-9 text-[#00d76b]" />
              </div>
              <div className="space-y-4">
                <p className="text-white/60 uppercase tracking-[0.3em] text-xs">{content.subtitle}</p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl font-lato lg:text-6xl">
                  {content.title}
                </h1>
              </div>
              <p className="text-white/70 text-sm font-semibold tracking-widest uppercase">{content.updated}</p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {content.sections.map((section) => {
              const Icon = getSectionIcon(section.icon);
              return (
                <article
                  key={section.key}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-lg shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex flex-col"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-[#00d76b]" />
                    </div>
                    <p
                      className="text-sm font-semibold text-white font-lato sm:text-base"
                      role="heading"
                      aria-level={2}
                    >
                      {section.title}
                    </p>
                  </div>
                  <div className="space-y-4 text-white/70 leading-relaxed flex-1">
                    {section.body.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-[#00d76b]/10 p-8 backdrop-blur lg:flex lg:items-center lg:justify-between">
            <p className="text-white/70 text-base">{t('contact')}</p>
            <div className="mt-4 space-y-1 text-sm text-white/70 lg:mt-0 lg:text-right">
              {content.companyInfo.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
