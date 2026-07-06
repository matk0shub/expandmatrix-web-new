import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Footer from '@/components/Footer';
import SiteNavbar from '@/components/SiteNavbar';
import {
  getBlogPost,
  getStrapiMediaUrl,
  formatPostDate,
  renderBlocksToHtml,
} from '@/lib/strapi';

const BASE_URL = 'https://expandmatrix.com';
const OG_IMAGE_URL = `${BASE_URL}/og-image.png`;

export const revalidate = 300;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const getDateModified = (post: { publishedAt: string } & { updatedAt?: unknown }) =>
  typeof post.updatedAt === 'string' ? post.updatedAt : post.publishedAt;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return { title: 'Article not found' };
  }

  const imageUrl = getStrapiMediaUrl(post.coverImage?.url);
  const pageUrl = `${BASE_URL}/${locale}/blog/${slug}`;
  const description = post.excerpt ?? undefined;

  return {
    title: `${post.title} | Expand Matrix Blog`,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: getDateModified(post),
      authors: ['Expand Matrix s.r.o.'],
      section: 'Blog',
      url: pageUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: post.coverImage?.width,
              height: post.coverImage?.height,
              alt: post.coverImage?.alternativeText || post.title,
            },
          ]
        : [
            {
              url: OG_IMAGE_URL,
              width: 1200,
              height: 630,
              alt: 'Expand Matrix',
            },
          ],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const post = await getBlogPost(slug, locale);
  if (!post) notFound();

  const imageUrl = getStrapiMediaUrl(post.coverImage?.url);
  const date = formatPostDate(post.publishedAt, locale);
  const htmlContent = renderBlocksToHtml(post.content);
  const pageUrl = `${BASE_URL}/${locale}/blog/${slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? post.title,
    ...(imageUrl ? { image: imageUrl } : {}),
    datePublished: post.publishedAt,
    dateModified: getDateModified(post),
    author: {
      '@type': 'Organization',
      name: 'Expand Matrix s.r.o.',
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so CMS-controlled text (title/excerpt) cannot close the
          // script tag and inject markup (JSON.stringify keeps "</script>" raw).
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
      <SiteNavbar variant="page" />
      <main id="main-content" className="min-h-screen bg-black text-white">
        {/* Back link */}
        <div className="pt-32 pb-4 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 max-w-[1780px] mx-auto">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
              ←
            </span>
            {t('backToBlog')}
          </Link>
        </div>

        {/* Article hero */}
        <article className="px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 max-w-[1780px] mx-auto pb-24">
          {/* Header */}
          <header className="max-w-3xl mx-auto pt-8 pb-12 text-center">
            {post.featured && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00d76b]/40 bg-[#00d76b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#00d76b] mb-6">
                {t('featuredBadge')}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-lato leading-tight mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-white/60 leading-relaxed mb-6">{post.excerpt}</p>
            )}
            <time className="text-sm text-white/60 uppercase tracking-wider">{date}</time>
          </header>

          {/* Cover image */}
          {imageUrl && (
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 mb-12">
              <Image
                src={imageUrl}
                alt={post.coverImage?.alternativeText || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 896px"
              />
            </div>
          )}

          {/* Rich text content */}
          {htmlContent ? (
            <div
              className="prose prose-invert prose-lg mx-auto max-w-3xl
                prose-headings:font-lato prose-headings:font-bold prose-headings:text-white
                prose-p:text-white/75 prose-p:leading-relaxed
                prose-a:text-[#00d76b] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-blockquote:border-l-[#00d76b] prose-blockquote:text-white/60
                prose-code:text-[#00d76b] prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
                prose-img:rounded-xl prose-img:border prose-img:border-white/10
                prose-ul:text-white/75 prose-ol:text-white/75
                prose-li:marker:text-[#00d76b]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div className="max-w-3xl mx-auto py-16 text-center text-white/60">
              {t('noContent')}
            </div>
          )}

          {/* Back to blog CTA */}
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/80 hover:border-[#00d76b] hover:text-[#00d76b] transition-all duration-200"
            >
              ← {t('backToBlog')}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
