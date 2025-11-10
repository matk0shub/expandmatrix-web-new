import { getTranslations } from 'next-intl/server';
import { getPayloadClient } from '@/payload/getPayloadClient';
import faqsFallback from '@/data/faqs.json' assert { type: 'json' };
import type { FAQ } from '@/types/faqs';
import FAQSectionClient from './FAQSectionClient';

interface FAQSectionProps {
  locale: string;
}

type FAQDocument = FAQ & {
  questionTitle?: string | null;
};

const normalizeFaqs = (docs: FAQDocument[]): FAQ[] =>
  docs
    .filter((faq) => faq.showOnSite)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((faq) => ({
      ...faq,
      question: {
        cs: faq.question?.cs ?? faq.question?.en ?? '',
        en: faq.question?.en ?? faq.question?.cs ?? '',
      },
      answer: {
        cs: faq.answer?.cs ?? faq.answer?.en ?? '',
        en: faq.answer?.en ?? faq.answer?.cs ?? '',
      },
    }));

export const revalidate = 60;

export default async function FAQSection({ locale }: FAQSectionProps) {
  const t = await getTranslations({ locale, namespace: 'sections.faq' });

  let faqs: FAQ[] = [];

  try {
    const payload = await getPayloadClient();

    const response = await payload.find({
      collection: 'faqs',
      limit: 100,
      depth: 0,
      where: {
        showOnSite: {
          equals: true,
        },
      },
      sort: 'order',
    });

    faqs = normalizeFaqs((response.docs ?? []) as FAQDocument[]);
  } catch (error) {
    console.warn('[faq section] Payload CMS unavailable, using fallback FAQ data.', error);
    faqs = normalizeFaqs(faqsFallback as FAQDocument[]);
  }

  const copy = {
    titleLine1: t('title.line1'),
    titleLine2: t('title.line2'),
    ctaOverline: t('cta.overline'),
    ctaButton: t('cta.button'),
    emptyState: t.has('empty') ? t('empty') : 'FAQ content will appear here soon.',
  };

  return (
    <FAQSectionClient
      locale={locale}
      faqs={faqs}
      copy={copy}
    />
  );
}
