import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import SmoothScroll from '@/components/SmoothScroll';
import { lato } from '../fonts';
import "../globals.css";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isCzech = locale === 'cs';
  
  return {
    title: isCzech 
      ? "ExpandMatrix - AI agenti, weby a implementace AI do businessu"
      : "ExpandMatrix - AI agents, websites and AI business implementation",
    description: isCzech
      ? "Implementujeme chytrou inteligenci, která nezná hranice. AI agenti, moderní weby a implementace AI do businessu. Přesnost, transparentnost a výsledky."
      : "We implement smart intelligence that knows no boundaries. AI agents, modern websites and AI business implementation. Accuracy, transparency and results.",
    keywords: isCzech
      ? "AI agenti, weby, implementace AI, chatbot, automatizace, business, technologie"
      : "AI agents, websites, AI implementation, chatbot, automation, business, technology",
    authors: [{ name: "ExpandMatrix" }],
    creator: "ExpandMatrix",
    publisher: "ExpandMatrix",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: isCzech ? "cs_CZ" : "en_US",
      url: "https://expandmatrix.cz",
      title: isCzech 
        ? "ExpandMatrix - AI agenti, weby a implementace AI do businessu"
        : "ExpandMatrix - AI agents, websites and AI business implementation",
      description: isCzech
        ? "Implementujeme chytrou inteligenci, která nezná hranice. AI agenti, moderní weby a implementace AI do businessu."
        : "We implement smart intelligence that knows no boundaries. AI agents, modern websites and AI business implementation.",
      siteName: "ExpandMatrix",
    },
    twitter: {
      card: "summary_large_image",
      title: isCzech 
        ? "ExpandMatrix - AI agenti, weby a implementace AI do businessu"
        : "ExpandMatrix - AI agents, websites and AI business implementation",
      description: isCzech
        ? "Implementujeme chytrou inteligenci, která nezná hranice. AI agenti, moderní weby a implementace AI do businessu."
        : "We implement smart intelligence that knows no boundaries. AI agents, modern websites and AI business implementation.",
    },
    alternates: {
      canonical: "https://expandmatrix.cz",
      languages: {
        'cs': 'https://expandmatrix.cz/cs',
        'en': 'https://expandmatrix.cz/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${lato.variable} antialiased`}>
        <SmoothScroll />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
