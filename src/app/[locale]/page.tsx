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
  const { partners } = await getPartners();
  const safePartners = Array.isArray(partners) ? partners : [];

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
          <ReferencesSection locale={locale} />
        </div>
        <div id="team">
          <TeamSection locale={locale} />
        </div>
        <div id="faq">
          <FAQSection locale={locale} />
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
