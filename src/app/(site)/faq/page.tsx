import { getPayloadClient } from '@/payload/getPayloadClient';
import faqsFallback from '@/data/faqs.json' assert { type: 'json' };

type LocalizedString =
  | string
  | null
  | undefined
  | {
      cs?: string | null;
      en?: string | null;
      [key: string]: string | null | undefined;
    };

type FAQDocument = {
  id: string;
  question?: LocalizedString;
  answer?: LocalizedString;
  questionTitle?: string | null;
};

const resolveLocalized = (value: LocalizedString, fallback = '—'): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    return value.en ?? value.cs ?? fallback;
  }

  return fallback;
};

export const revalidate = 60;

export default async function FAQPage() {
  let faqs: FAQDocument[] = [];

  try {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: 'faqs',
      sort: 'order',
      limit: 100,
      where: {
        showOnSite: {
          equals: true,
        },
      },
    });

    faqs = Array.isArray(result.docs) ? (result.docs as FAQDocument[]) : [];
  } catch (error) {
    console.warn('[faq] Payload CMS unavailable, using local FAQ fallback.', error);
    faqs = faqsFallback as FAQDocument[];
  }

  const visibleFaqs = faqs.filter((faq) => faq.showOnSite ?? true);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-500">
          Fetched directly from the Payload Local API to validate the cms &lt;-&gt; Next.js integration.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        {visibleFaqs.length === 0 ? (
          <p className="text-sm text-gray-600">No FAQs published yet.</p>
        ) : (
          visibleFaqs.map((faq) => (
            <article
              key={faq.id}
              className="rounded-lg border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
            >
              <h2 className="text-xl font-medium">
                {resolveLocalized(faq.question, faq.questionTitle ?? 'Untitled question')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {resolveLocalized(faq.answer, 'Answer forthcoming.')}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
