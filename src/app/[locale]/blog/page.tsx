import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import BlogSearch from '@/components/BlogSearch';
import Footer from '@/components/Footer';
import SiteNavbar from '@/components/SiteNavbar';
import {
  getBlogPosts,
  getFeaturedPost,
  getStrapiMediaUrl,
  formatPostDate,
  type StrapiArticle,
} from '@/lib/strapi';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

/* ─── Article card ───────────────────────────────────────────────────── */
function ArticleCard({ post, locale }: { post: StrapiArticle; locale: string }) {
  const imageUrl = getStrapiMediaUrl(post.coverImage?.url);
  const date = formatPostDate(post.publishedAt, locale);

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden hover:border-[#00d76b]/30 hover:bg-white/[0.07] transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden bg-white/[0.04] shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#00d76b]/8 to-white/[0.02] flex items-center justify-center">
            <span className="text-[#00d76b]/30 text-5xl font-bold font-lato select-none">EM</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-2.5 p-5">
        <time className="text-xs text-white/35 uppercase tracking-wider">{date}</time>
        <h3 className="text-[15px] font-semibold text-white font-lato leading-snug line-clamp-2 group-hover:text-[#00d76b] transition-colors duration-200">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mt-0.5">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

/* ─── Pagination ─────────────────────────────────────────────────────── */
function Pagination({
  page,
  pageCount,
  locale,
  query,
  nextLabel,
}: {
  page: number;
  pageCount: number;
  locale: string;
  query?: string;
  nextLabel: string;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (query) params.set('q', query);
    return `/${locale}/blog?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 pt-12" aria-label="Pagination">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={href(p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
            p === page
              ? 'bg-white text-black'
              : 'border border-white/15 text-white/60 hover:border-white/40 hover:text-white'
          }`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </a>
      ))}
      {page < pageCount && (
        <a
          href={href(page + 1)}
          className="flex h-10 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white/60 hover:border-white/40 hover:text-white transition-all duration-200"
        >
          {nextLabel}
        </a>
      )}
    </nav>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page: pageParam, q } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10));
  const searchQuery = q?.trim() || undefined;

  const t = await getTranslations({ locale, namespace: 'blog' });

  const [featuredPost, { posts, pageCount }] = await Promise.all([
    !searchQuery && currentPage === 1 ? getFeaturedPost(locale) : Promise.resolve(null),
    getBlogPosts(locale, currentPage, 6, searchQuery),
  ]);

  const gridPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  const featuredImageUrl = getStrapiMediaUrl(featuredPost?.coverImage?.url);

  return (
    <div className="bg-black min-h-screen">
      <SiteNavbar variant="page" />
      <main className="text-white">

        {/* ── Hero header ─────────────────────────────────────────── */}
        <section className="pt-12 pb-10 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 max-w-[1780px] mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight font-lato mb-4">
            {t('heading')}
          </h1>
          <p className="text-base text-white/50 mb-8 max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
          <BlogSearch
            placeholder={t('searchPlaceholder')}
            defaultValue={searchQuery ?? ''}
          />
        </section>

        {/* ── Featured post ────────────────────────────────────────── */}
        {featuredPost && (
          <section className="px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 max-w-[1780px] mx-auto pb-14">
            <Link
              href={`/${locale}/blog/${featuredPost.slug}`}
              className="group grid md:grid-cols-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden hover:border-[#00d76b]/25 transition-all duration-300 hover:shadow-[0_8px_48px_rgba(0,215,107,0.06)]"
            >
              {/* Image panel */}
              <div className="relative min-h-[240px] md:min-h-[340px] overflow-hidden bg-white/[0.04]">
                {featuredImageUrl ? (
                  <Image
                    src={featuredImageUrl}
                    alt={featuredPost.coverImage?.alternativeText || featuredPost.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0d2b1e] via-[#0a1f2e] to-black flex items-center justify-center">
                    <span className="text-[#00d76b]/15 text-8xl font-bold font-lato select-none">EM</span>
                  </div>
                )}
              </div>

              {/* Content panel */}
              <div className="flex flex-col justify-center gap-5 p-8 md:p-10 lg:p-14">
                <span className="inline-flex self-start items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  {t('featuredBadge')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-lato leading-snug group-hover:text-[#00d76b] transition-colors duration-200">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-white/50 leading-relaxed text-sm line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <time className="text-xs text-white/30 uppercase tracking-wider">
                  {formatPostDate(featuredPost.publishedAt, locale)}
                </time>
                <span className="inline-flex self-start items-center gap-1.5 rounded-full border border-[#00d76b]/40 bg-[#00d76b]/10 px-5 py-2.5 text-sm font-semibold text-[#00d76b] transition-all duration-200 group-hover:bg-[#00d76b]/20">
                  {t('featuredCta')}
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* ── More articles ────────────────────────────────────────── */}
        <section className="px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 max-w-[1780px] mx-auto pb-28">
          {gridPosts.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold font-lato text-white mb-8">
                {searchQuery ? t('searchResults') : t('moreArticles')}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} locale={locale} />
                ))}
              </div>
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                locale={locale}
                query={searchQuery}
                nextLabel={t('next')}
              />
            </>
          ) : !featuredPost ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-xl font-bold font-lato mb-3">
                {searchQuery ? t('noResults') : t('emptyTitle')}
              </h2>
              <p className="text-white/40 max-w-sm text-sm">
                {searchQuery ? t('noResultsSubtitle') : t('emptySubtitle')}
              </p>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
