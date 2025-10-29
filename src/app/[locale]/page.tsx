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
import { getSampleReferences } from '@/data/references';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const initialReferences = getSampleReferences(locale);

  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <div id="about">
          <AccuracySection />
        </div>
        <ClientsSection />
        <div id="services">
          <ServicesSection locale={locale} />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="references">
          <ReferencesSection references={initialReferences} />
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
