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

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return { title: 'Article not found' };
  }

  const imageUrl = getStrapiMediaUrl(post.coverImage?.url);
  const BASE_URL = 'https://expandmatrix.com';

  return {
    title: `${post.title} | Expand Matrix Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
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

  return (
    <>
      <SiteNavbar variant="page" />
      <main className="min-h-screen bg-black text-white">
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
            <time className="text-sm text-white/40 uppercase tracking-wider">{date}</time>
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
            <div className="max-w-3xl mx-auto py-16 text-center text-white/40">
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
