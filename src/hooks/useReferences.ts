'use client';

import { useState, useEffect } from 'react';
import type { Reference } from '@/types/references';
import { getSampleReferences } from '@/data/references';

interface UseReferencesOptions {
  locale?: string;
  featuredOnly?: boolean;
  initialReferences?: Reference[];
}

export function useReferences(options: UseReferencesOptions = {}) {
  const {
    locale = 'en',
    featuredOnly = true,
    initialReferences = [],
  } = options;
  const [references, setReferences] = useState<Reference[]>(initialReferences);
  const [loading, setLoading] = useState(initialReferences.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        if (!initialReferences.length) {
          setLoading(true);
        }
        setError(null);

        const params = new URLSearchParams({
          locale,
          depth: '2', // Include related media
          sort: 'order',
          ...(featuredOnly && { 'where[isFeatured][equals]': 'true' }),
        });

        const response = await fetch(`/api/references?${params}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch references: ${response.statusText}`);
        }

        const data = await response.json();
        setReferences(data.docs || []);
      } catch (err) {
        console.error('Error fetching references:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch references');
        // Fallback to sample data for development
        if (!initialReferences.length) {
          setReferences(getSampleReferences());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [locale, featuredOnly, initialReferences.length]);

  return { references, loading, error };
}
