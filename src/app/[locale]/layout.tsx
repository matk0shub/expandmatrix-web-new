import type { Metadata } from "next";
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import '@/payload/prewarm';
import { getPayloadBaseUrl } from '@/utils/payloadServerUrl';
import { lato } from '../fonts';
import "../globals.css";
import CookieConsentBanner from '@/components/CookieConsent';
import ScrollRestoration from '@/components/ScrollRestoration';

const BASE_URL = 'https://expandmatrix.com';
const LOGO_URL = `${BASE_URL}/og-image.png`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isCzech = locale === 'cs';
  const localePath = isCzech ? '/cs' : '/en';
  const pageUrl = `${BASE_URL}${localePath}`;

  const title = isCzech
    ? 'ExpandMatrix - AI agenti, weby a implementace AI do businessu'
    : 'ExpandMatrix - AI agents, websites and AI business implementation';
  const description = isCzech
    ? 'Implementujeme chytrou inteligenci, která nezná hranice. AI agenti, moderní weby a implementace AI do businessu. Přesnost, transparentnost a výsledky.'
    : 'We implement smart intelligence that knows no boundaries. AI agents, modern websites and AI business implementation. Accuracy, transparency and results.';

  return {
    title,
    description,
    keywords: isCzech
      ? 'AI agenti, vývoj AI agentů, webové stránky, e-shopy, implementace AI, chatbot, automatizace, business, technologie, umělá inteligence, AI konzultace, Praha, Česká republika'
      : 'AI agents, AI agent development, websites, e-shops, AI implementation, chatbot, automation, business, technology, artificial intelligence, AI consulting, Prague, Czech Republic',
    authors: [
      { name: 'Matěj Štipčák' },
      { name: 'Matěj Venclík' },
    ],
    creator: 'Expand Matrix s.r.o.',
    publisher: 'Expand Matrix s.r.o.',
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    category: 'technology',
    openGraph: {
      type: 'website',
      locale: isCzech ? 'cs_CZ' : 'en_US',
      alternateLocale: isCzech ? 'en_US' : 'cs_CZ',
      url: pageUrl,
      title,
      description,
      siteName: 'Expand Matrix',
      images: [
        {
          url: LOGO_URL,
          width: 1200,
          height: 630,
          alt: isCzech
            ? 'Expand Matrix - AI agenti a webové řešení'
            : 'Expand Matrix - AI agents and web solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@expandmatrix',
      creator: '@expandmatrix',
      title,
      description,
      images: [LOGO_URL],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${BASE_URL}/cs`,
        en: `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    other: {
      'geo.region': 'CZ-10',
      'geo.placename': 'Prague',
      'geo.position': '50.0833;14.4292',
      'ICBM': '50.0833, 14.4292',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isCzech = locale === 'cs';
  const pageUrl = `${BASE_URL}/${locale}`;

  // Import messages dynamically with error handling
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // Fallback to English if locale file doesn't exist
    console.warn(`Failed to load messages for locale ${locale}, falling back to English`);
    messages = (await import(`@/messages/en.json`)).default;
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#organization`,
    name: "Expand Matrix s.r.o.",
    alternateName: "ExpandMatrix",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 1200,
      height: 630,
    },
    image: LOGO_URL,
    description: isCzech
      ? "Implementujeme AI agenty, moderní weby a AI řešení do businessu. Přesnost, transparentnost a měřitelné výsledky pro české i mezinárodní firmy."
      : "We build AI agents, modern websites and implement AI solutions into business operations. Precision, transparency and measurable results for Czech and international companies.",
    foundingDate: "2023",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 5,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Příčná 1892/4",
      addressLocality: "Praha 1",
      addressRegion: "Hlavní město Praha",
      postalCode: "110 00",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.0833,
      longitude: 14.4292,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@expandmatrix.com",
      contactType: "customer service",
      availableLanguage: ["Czech", "English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/expandmatrix",
      "https://x.com/expandmatrix",
    ],
    areaServed: [
      { "@type": "Country", name: "Czech Republic" },
      { "@type": "Country", name: "Slovakia" },
      { "@type": "Place", name: "European Union" },
    ],
    knowsLanguage: ["cs", "en"],
    slogan: isCzech
      ? "Implementujeme chytrou inteligenci, která nezná hranice."
      : "We implement smart intelligence that knows no boundaries.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isCzech ? "Služby Expand Matrix" : "Expand Matrix Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${BASE_URL}/#ai-agents`,
            name: isCzech ? "AI Agenti" : "AI Agents",
            description: isCzech
              ? "Navrhujeme autonomní AI agenty, kteří přirozeně komunikují, řeší úkoly a přesně se napojují na vaše systémy."
              : "We architect autonomous AI agents that converse naturally, solve tasks, and plug into your systems with razor precision.",
            serviceType: "AI Agent Development",
            provider: { "@id": `${BASE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${BASE_URL}/#web-development`,
            name: isCzech ? "Webové stránky a e-shopy" : "Websites and E-shops",
            description: isCzech
              ? "Vytváříme moderní, rychlé a funkční webové stránky a e-shopy s důrazem na UX/UI design a SEO optimalizaci."
              : "We create modern, fast, and functional websites and e-shops with emphasis on UX/UI design and SEO optimization.",
            serviceType: "Web Development",
            provider: { "@id": `${BASE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${BASE_URL}/#ai-implementation`,
            name: isCzech ? "Implementace AI do businessu" : "AI Business Implementation",
            description: isCzech
              ? "Pomáháme firmám implementovat umělou inteligenci do jejich obchodních procesů pro zvýšení efektivity a konkurenceschopnosti."
              : "We help companies implement artificial intelligence into their business processes to increase efficiency and competitiveness.",
            serviceType: "AI Consulting",
            provider: { "@id": `${BASE_URL}/#organization` },
          },
        },
      ],
    },
    founder: [
      {
        "@type": "Person",
        name: "Matěj Štipčák",
        jobTitle: isCzech ? "Jednatel & Systémový inženýr" : "Founder & System Engineer",
        worksFor: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "Person",
        name: "Matěj Venclík",
        jobTitle: isCzech ? "Jednatel & AI Architekt" : "Founder & AI Architect",
        worksFor: { "@id": `${BASE_URL}/#organization` },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "35",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Expand Matrix",
    url: BASE_URL,
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: [
      { "@type": "Language", name: "Czech", alternateName: "cs" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    potentialAction: {
      "@type": "ReadAction",
      target: [
        `${BASE_URL}/en`,
        `${BASE_URL}/cs`,
      ],
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: isCzech
      ? "ExpandMatrix - AI agenti, weby a implementace AI do businessu"
      : "ExpandMatrix - AI agents, websites and AI business implementation",
    description: isCzech
      ? "Implementujeme chytrou inteligenci, která nezná hranice. AI agenti, moderní weby a implementace AI do businessu."
      : "We implement smart intelligence that knows no boundaries. AI agents, modern websites and AI business implementation.",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    inLanguage: isCzech ? "cs" : "en",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isCzech ? "Hlavní stránka" : "Home",
          item: `${BASE_URL}/${locale}`,
        },
      ],
    },
  };

  const payloadBaseUrl = getPayloadBaseUrl();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preload critical above-the-fold image */}
        <link rel="preload" as="image" href="/logo.svg" fetchPriority="high" />
        {/* Preconnect/DNS-prefetch for Payload host (if configured) */}
        {payloadBaseUrl && (
          <>
            <link rel="preconnect" href={payloadBaseUrl} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={payloadBaseUrl} />
          </>
        )}
      </head>
      <body className={`${lato.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsentBanner />
          <ScrollRestoration />
        </NextIntlClientProvider>
        {isCzech && (
          <Script
            id="chatwoot-widget"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.chatwootSettings = {
                  locale: 'cs',
                  position: 'right',
                  type: 'standard',
                  showPopoutButton: true
                };
                (function(d,t) {
                  var BASE_URL="https://chat.expandmatrix.com";
                  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                  g.src=BASE_URL+"/packs/js/sdk.js";
                  g.async=true;
                  s.parentNode.insertBefore(g,s);
                  g.onload=function(){
                    window.chatwootSDK.run({
                      websiteToken: 'hwKhP9Y2skx6RU1c37PeeK6f',
                      baseUrl: BASE_URL,
                      locale: 'cs'
                    })
                  }
                })(document,"script");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
