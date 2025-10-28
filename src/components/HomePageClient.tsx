'use client';

import dynamic from 'next/dynamic';
import { useCalEmbed } from '@/hooks/useCalEmbed';
import type { Reference } from '@/types/references';

// Dynamicky importovat VŠECHNY komponenty pro co nejrychlejší dev server
const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div className="min-h-screen" />,
  ssr: false
});

const AccuracySection = dynamic(() => import('@/components/AccuracySection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const ClientsSection = dynamic(() => import('@/components/ClientsSection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const ProcessSection = dynamic(() => import('@/components/ProcessSection'), {
  loading: () => <div className="min-h-screen" />,
  ssr: false
});

const ReferencesSection = dynamic(() => import('@/components/ReferencesSection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const TeamSection = dynamic(() => import('@/components/TeamSection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <div className="min-h-[60vh]" />,
  ssr: false
});

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

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
