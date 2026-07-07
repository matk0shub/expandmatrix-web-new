export const revalidateSiteContent = async (tag?: string) => {
  let cache: typeof import('next/cache');

  try {
    const nextCacheModule = 'next/cache';
    cache = await import(/* webpackIgnore: true */ nextCacheModule);
  } catch {
    // Standalone payload compile / migration context - Next cache not available.
    return;
  }

  // Separate try/catch from the import above: a genuine revalidation failure here
  // must be visible (Netlify function logs), not swallowed like the expected
  // "next/cache unavailable outside the app" case. Pages using `revalidate: false`
  // have no TTL fallback, so a silently failed revalidation would leave them
  // stale indefinitely with no signal. The hook still resolves either way so a
  // caching hiccup never blocks a content editor's save in the Payload admin.
  try {
    if (tag) {
      cache.revalidateTag(tag);
    }
    cache.revalidatePath('/en', 'page');
    cache.revalidatePath('/cs', 'page');
  } catch (error) {
    console.error('[revalidateSiteContent] Failed to revalidate cache:', error);
  }
};
