import { MetadataRoute } from 'next';
import { getPayloadClient } from '@/payload/getPayloadClient';

export const revalidate = 3600;

const latestUpdate = async (collection: 'partners' | 'teamMembers' | 'faqs'): Promise<Date> => {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection,
      sort: '-updatedAt',
      limit: 1,
      depth: 0,
    });
    const doc = result?.docs?.[0] as { updatedAt?: string } | undefined;
    const when = doc?.updatedAt ? new Date(doc.updatedAt) : null;
    return when && !Number.isNaN(when.getTime()) ? when : new Date();
  } catch {
    return new Date();
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://expandmatrix.com';
  const now = new Date();
  const [partnersMtime, teamMtime, faqMtime] = await Promise.all([
    latestUpdate('partners'),
    latestUpdate('teamMembers'),
    latestUpdate('faqs'),
  ]);

  const locales = ['en', 'cs'] as const;
  const homeAndLocales: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 1,
    })),
  ];

  const legalPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/${locale}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]);

  const contentPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/partners`,
      lastModified: partnersMtime,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: teamMtime,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: faqMtime,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...homeAndLocales, ...contentPages, ...legalPages];
}
