import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface PageParams {
  locale: string;
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: PageParams;
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'legal.terms' });
  const sections = t.raw('sections') as Array<{
    heading: string;
    body: string[];
  }>;

  return (
    <main className="min-h-screen bg-black text-white py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12 xl:px-0 space-y-12">
        <div className="space-y-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-300"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur">
              ←
            </span>
            {t('back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-lato">
            {t('title')}
          </h1>
          <p className="text-white/50 text-sm md:text-base">{t('updated')}</p>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.05] backdrop-blur-[18px] shadow-[0_45px_120px_-60px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-[#00d76b]/20 blur-[120px]" />
            <div className="absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-[#00b85c]/18 blur-[130px]" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/12 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#00d76b]/12 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 px-6 py-10 md:px-12 md:py-14 space-y-8">
            <p className="text-white/70 leading-relaxed">{t('intro')}</p>
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.heading} className="space-y-4">
                  <h2 className="text-xl font-semibold text-white font-lato tracking-tight">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-white/70 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-4 text-white/70 backdrop-blur-2xl">
              {t('contact')}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
