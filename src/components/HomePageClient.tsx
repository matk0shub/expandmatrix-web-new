'use client';

import Hero from '@/components/Hero';
import AccuracySection from '@/components/AccuracySection';
import ClientsSection from '@/components/ClientsSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import ReferencesSection from '@/components/ReferencesSection';
import TeamSection from '@/components/TeamSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { useCalEmbed } from '@/hooks/useCalEmbed';
import { useReferences } from '@/hooks/useReferences';
import type { Reference } from '@/types/references';

interface HomePageClientProps {
  locale: string;
  initialReferences: Reference[];
}

export default function HomePageClient({ locale, initialReferences }: HomePageClientProps) {
  useCalEmbed();

  const { references } = useReferences({
    locale,
    featuredOnly: true,
    initialReferences,
  });

  const referenceData = references.length ? references : initialReferences;

  return (
    <main className="min-h-screen">
      <Hero />
      <div id="about">
        <AccuracySection />
      </div>
      <ClientsSection />
      <div id="services">
        <ServicesSection />
      </div>
      <ProcessSection />
      <div id="references">
        <ReferencesSection references={referenceData} />
      </div>
      <div id="team">
        <TeamSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <Footer />
      <div id="contact">
        <CookieConsent />
      </div>
    </main>
  );
}
