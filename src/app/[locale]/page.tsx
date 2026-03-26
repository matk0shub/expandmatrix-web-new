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

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  console.log('[env check] PAYLOAD_SECRET present?', Boolean(process.env.PAYLOAD_SECRET));
  let safePartners: NormalizedPartner[] = [];

  try {
    const { partners } = await getPartners();
    safePartners = partners;
  } catch (error) {
    console.error('[home] Failed to load partners from Payload CMS:', error);
  }

  return (
    <>
      <main className="min-h-screen">
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
          <Suspense fallback={<div className="min-h-[60vh] bg-black" />}>
            <ReferencesSection locale={locale} />
          </Suspense>
        </div>
        <div id="team">
          <Suspense fallback={<div className="min-h-[60vh] bg-black" />}>
            <TeamSection locale={locale} />
          </Suspense>
        </div>
        <div id="faq">
          <Suspense fallback={<div className="min-h-[50vh] bg-black" />}>
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
