// Server-side: uses internal Docker network URL when available (faster, no public internet)
const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || '';

// Client-side: public URL used in <Image src={...}>
export const STRAPI_PUBLIC_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '';

export interface StrapiMedia {
  url: string;
  width: number;
  height: number;
  alternativeText?: string | null;
}

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  featured: boolean | null;
  coverImage: StrapiMedia | null;
}

export interface StrapiArticleDetail extends StrapiArticle {
  content: unknown; // Strapi v5 blocks format
}

interface StrapiFetchResult<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/* ─── Public API ─────────────────────────────────────────────────────── */

/** Fetch paginated list of blog posts */
export async function getBlogPosts(
  locale: string,
  page = 1,
  pageSize = 6,
  query?: string,
): Promise<{ posts: StrapiArticle[]; total: number; pageCount: number }> {
  if (!STRAPI_URL) return { posts: [], total: 0, pageCount: 0 };

  try {
    let url = `${STRAPI_URL}/api/articles?locale=${locale}&populate=coverImage&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    if (query) {
      url += `&filters[$or][0][title][$containsi]=${encodeURIComponent(query)}&filters[$or][1][excerpt][$containsi]=${encodeURIComponent(query)}`;
    }
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    const data: StrapiFetchResult<StrapiArticle[]> = await res.json();
    const posts = data.data ?? [];
    return {
      posts,
      total: data.meta.pagination?.total ?? 0,
      pageCount: data.meta.pagination?.pageCount ?? 0,
    };
  } catch {
    return { posts: [], total: 0, pageCount: 0 };
  }
}

/** Fetch a single post by slug */
export async function getBlogPost(
  slug: string,
  locale: string,
): Promise<StrapiArticleDetail | null> {
  if (!STRAPI_URL) return null;

  try {
    const url = `${STRAPI_URL}/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${locale}&populate=coverImage`;
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    const data: StrapiFetchResult<StrapiArticleDetail[]> = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Fetch the featured post */
export async function getFeaturedPost(locale: string): Promise<StrapiArticle | null> {
  if (!STRAPI_URL) return null;

  try {
    const url = `${STRAPI_URL}/api/articles?filters[featured][$eq]=true&locale=${locale}&populate=coverImage&sort=publishedAt:desc&pagination[pageSize]=1`;
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Strapi ${res.status}`);
    const data: StrapiFetchResult<StrapiArticle[]> = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

/** Convert relative Strapi media URL to absolute public URL */
export function getStrapiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_PUBLIC_URL}${url}`;
}

/** Format ISO date string to localized date */
export function formatPostDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Render Strapi v5 blocks content to plain HTML string */
export function renderBlocksToHtml(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block: Record<string, unknown>) => {
      const type = block.type as string;
      const children = Array.isArray(block.children)
        ? (block.children as Array<Record<string, unknown>>)
            .map((child) => {
              let text = String(child.text ?? '');
              if (child.bold) text = `<strong>${text}</strong>`;
              if (child.italic) text = `<em>${text}</em>`;
              if (child.underline) text = `<u>${text}</u>`;
              if (child.code) text = `<code>${text}</code>`;
              if (child.type === 'link' && child.url) {
                const linkChildren = Array.isArray(child.children)
                  ? (child.children as Array<Record<string, unknown>>)
                      .map((c) => String(c.text ?? ''))
                      .join('')
                  : text;
                text = `<a href="${child.url}" rel="noopener noreferrer">${linkChildren}</a>`;
              }
              return text;
            })
            .join('')
        : '';

      switch (type) {
        case 'paragraph':
          return `<p>${children}</p>`;
        case 'heading':
          return `<h${block.level ?? 2}>${children}</h${block.level ?? 2}>`;
        case 'list': {
          const tag = block.format === 'ordered' ? 'ol' : 'ul';
          const items = Array.isArray(block.children)
            ? block.children
                .map(
                  (item: Record<string, unknown>) =>
                    `<li>${Array.isArray(item.children) ? (item.children as Array<Record<string, unknown>>).map((c) => String(c.text ?? '')).join('') : ''}</li>`,
                )
                .join('')
            : '';
          return `<${tag}>${items}</${tag}>`;
        }
        case 'quote':
          return `<blockquote>${children}</blockquote>`;
        case 'code':
          return `<pre><code>${children}</code></pre>`;
        case 'image': {
          const img = block.image as Record<string, unknown> | undefined;
          if (!img?.url) return '';
          const src = getStrapiMediaUrl(String(img.url)) ?? '';
          const alt = String(img.alternativeText ?? '');
          return `<img src="${src}" alt="${alt}" loading="lazy" />`;
        }
        default:
          return children ? `<p>${children}</p>` : '';
      }
    })
    .join('\n');
}
