import { Suspense } from 'react';
import AccuracySection from '@/components/AccuracySection';
import CalEmbedInitializer from '@/components/CalEmbedInitializer';
import ClientsSection from '@/components/ClientsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProcessSection from '@/components/ProcessSection';
import ReferencesSection from '@/components/ReferencesSection';
import ServicesSection from '@/components/ServicesSection';
import TeamSection from '@/components/TeamSection';
import { getPartners } from '@/data/partners.server';
import type { NormalizedPartner } from '@/types/partners';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'cs' }];
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

function SectionFallback({ minHeightClass }: { minHeightClass: string }) {
  return (
    <div className={`${minHeightClass} flex items-center justify-center bg-black`} aria-hidden="true">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 px-6">
        <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.04]" />
        <div className="h-3 w-48 animate-pulse rounded-full bg-white/[0.04]" />
        <div className="h-3 w-24 animate-pulse rounded-full bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  let safePartners: NormalizedPartner[] = [];

  try {
    const { partners } = await getPartners();
    safePartners = partners;
  } catch (error) {
    console.error('[home] Failed to load partners from Payload CMS:', error);
  }

  return (
    <>
      <main id="main-content" className="min-h-screen">
        <Hero />
        <div id="about">
          <AccuracySection locale={locale} />
        </div>
        <ClientsSection partners={safePartners} />
        <div id="services">
          <ServicesSection locale={locale} />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="references">
          <Suspense fallback={<SectionFallback minHeightClass="min-h-[60vh]" />}>
            <ReferencesSection locale={locale} />
          </Suspense>
        </div>
        <div id="team">
          <Suspense fallback={<SectionFallback minHeightClass="min-h-[60vh]" />}>
            <TeamSection locale={locale} />
          </Suspense>
        </div>
        <div id="faq">
          <Suspense fallback={<SectionFallback minHeightClass="min-h-[50vh]" />}>
            <FAQSection locale={locale} />
          </Suspense>
        </div>
        <div id="contact" />
      </main>
      <Footer />
      <CalEmbedInitializer />
    </>
  );
}
