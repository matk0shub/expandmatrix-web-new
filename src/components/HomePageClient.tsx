'use client';

import { useCalEmbed } from '@/hooks/useCalEmbed';
import type { Reference } from '@/types/references';

// Import komponent přímo pro SSR rendering (rychlější zobrazení)
import Hero from '@/components/Hero';
import AccuracySection from '@/components/AccuracySection';
import ClientsSection from '@/components/ClientsSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import ReferencesSection from '@/components/ReferencesSection';
import TeamSection from '@/components/TeamSection';
import FAQSection from '@/components/FAQSection';
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';

interface HomePageClientProps {
  locale: string;
  initialReferences: Reference[];
}

export default function HomePageClient({ locale, initialReferences }: HomePageClientProps) {
  // Hook se načte s lazy import, ale nevykoná se kvůli mounted check uvnitř
  useCalEmbed();

  // Use initialReferences directly instead of calling useReferences hook
  // This prevents unnecessary API calls on initial page load
  const referenceData = initialReferences;

  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <div id="about">
          <AccuracySection />
        </div>
        <ClientsSection />
        <div id="services">
          <ServicesSection />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="references">
          <ReferencesSection references={referenceData} />
        </div>
        <div id="team">
          <TeamSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <div id="contact">
          <CookieConsent />
        </div>
      </main>
      <Footer />
    </>
  );
}
