import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import SmoothScroll from '@/components/SmoothScroll';
import { lato } from '../fonts';
import "../globals.css";

const BASE_URL = 'https://expandmatrix.com';
const LOGO_URL = `${BASE_URL}/logo.png`;

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
      ? 'AI agenti, weby, implementace AI, chatbot, automatizace, business, technologie'
      : 'AI agents, websites, AI implementation, chatbot, automation, business, technology',
    authors: [{ name: 'ExpandMatrix' }],
    creator: 'ExpandMatrix',
    publisher: 'ExpandMatrix',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: isCzech ? 'cs_CZ' : 'en_US',
      url: pageUrl,
      title,
      description,
      siteName: 'ExpandMatrix',
      images: [
        {
          url: LOGO_URL,
          width: 1200,
          height: 630,
          alt: 'Expand Matrix brand mark',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [LOGO_URL],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${BASE_URL}/cs`,
        en: `${BASE_URL}/en`,
      },
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
    "@type": "Organization",
    name: "Expand Matrix",
    url: BASE_URL,
    logo: LOGO_URL,
    sameAs: [
      "https://www.linkedin.com/company/expandmatrix",
      "https://x.com/expandmatrix",
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lato.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SmoothScroll />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
