import { MetadataRoute } from 'next';
import { getBlogPosts, type StrapiArticle } from '@/lib/strapi';

export const revalidate = 3600;

const baseUrl = 'https://expandmatrix.com';
const locales = ['en', 'cs'] as const;
type Locale = (typeof locales)[number];

const alternatesFor = (path: string) => ({
  languages: {
    en: `${baseUrl}/en${path}`,
    cs: `${baseUrl}/cs${path}`,
    'x-default': `${baseUrl}/en${path}`,
  },
});

const validDate = (value: string | undefined, fallback: Date): Date => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
};

const getPostLastModified = (post: StrapiArticle, fallback: Date): Date => {
  const updatedAt = (post as StrapiArticle & { updatedAt?: string }).updatedAt;
  return validDate(updatedAt ?? post.publishedAt, fallback);
};

const getLocaleBlogPosts = async (locale: Locale): Promise<StrapiArticle[]> => {
  const pageSize = 100;

  try {
    const firstPage = await getBlogPosts(locale, 1, pageSize);
    const remainingPages =
      firstPage.pageCount > 1
        ? await Promise.all(
            Array.from({ length: firstPage.pageCount - 1 }, (_, index) =>
              getBlogPosts(locale, index + 2, pageSize),
            ),
          )
        : [];

    return [
      ...firstPage.posts,
      ...remainingPages.flatMap(({ posts }) => posts),
    ];
  } catch {
    return [];
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPostsByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await getLocaleBlogPosts(locale),
    })),
  );

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: alternatesFor(''),
  }));

  const legalPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
      alternates: alternatesFor('/privacy'),
    },
    {
      url: `${baseUrl}/${locale}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
      alternates: alternatesFor('/terms'),
    },
  ]);

  const blogPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: alternatesFor('/blog'),
  }));

  const blogPostPages: MetadataRoute.Sitemap = blogPostsByLocale.flatMap(({ locale, posts }) =>
    posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: getPostLastModified(post, now),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
  );

  return [...homePages, ...legalPages, ...blogPages, ...blogPostPages];
}
