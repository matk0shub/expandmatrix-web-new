import AccuracySection from '@/components/AccuracySection';
import CalEmbedInitializer from '@/components/CalEmbedInitializer';
import ClientsSection from '@/components/ClientsSection';
import CookieConsent from '@/components/CookieConsent';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProcessSection from '@/components/ProcessSection';
import ReferencesSection from '@/components/ReferencesSection';
import ServicesSection from '@/components/ServicesSection';
import TeamSection from '@/components/TeamSection';
import { getPartners } from '@/data/partners.server';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t0 = Date.now();
  const [{ partners }] = await Promise.all([
    getPartners(),
  ]);
  console.log('[page] first-render orchestration took', Date.now() - t0, 'ms');

  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <div id="about">
          <AccuracySection />
        </div>
        <ClientsSection partners={partners} />
        <div id="services">
          <ServicesSection locale={locale} />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="references">
          <ReferencesSection locale={locale} />
        </div>
        <div id="team">
          <TeamSection locale={locale} />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <div id="contact">
          <CookieConsent />
        </div>
      </main>
      <Footer />
      <CalEmbedInitializer />
    </>
  );
}
