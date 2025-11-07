'use client';

import { useState, useEffect } from 'react';
import type { FAQ } from '@/types/faqs';

interface UseFAQsOptions {
  locale: string;
  featuredOnly?: boolean;
}

export function useFAQs({ locale, featuredOnly = false }: UseFAQsOptions) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFAQs = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const params = new URLSearchParams({ locale });

        if (featuredOnly) {
          params.set('featuredOnly', 'true');
        }

        const response = await fetch(`/api/public/faqs?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
        }

        const data = await response.json();
        const docs: FAQ[] = Array.isArray(data) ? data : data?.docs ?? [];
        const sorted = [...docs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        if (isMounted) {
          setFaqs(sorted);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Error fetching FAQs:', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
          setFaqs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFAQs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [locale, featuredOnly]);

  return { faqs, loading, error };
}
