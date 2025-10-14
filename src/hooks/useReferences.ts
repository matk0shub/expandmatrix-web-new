'use client';

import { useState, useEffect } from 'react';
import { Reference } from '@/components/ReferencesSection';

interface UseReferencesOptions {
  locale?: string;
  featuredOnly?: boolean;
}

export function useReferences(options: UseReferencesOptions = {}) {
  const { locale = 'en', featuredOnly = true } = options;
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true);
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
        // Fallback to dummy data for development
        setReferences(getDummyReferences());
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [locale, featuredOnly]);

  return { references, loading, error };
}

// Dummy data for development/fallback
function getDummyReferences(): Reference[] {
  return [
    {
      id: '1',
      name: 'TechStartup',
      slug: 'tech-startup',
      subtitle: 'AI-Powered SaaS Platform',
      instagramUrl: 'https://instagram.com/techstartup',
      image: {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
        alt: 'Tech startup office',
      },
      metrics: [
        { label: 'Monthly Revenue', value: '2.5M CZK' },
        { label: 'User Growth', value: '+340%' },
        { label: 'Conversion Rate', value: '12.8%' },
      ],
      order: 1,
      isFeatured: true,
    },
    {
      id: '2',
      name: 'FashionBrand',
      slug: 'fashion-brand',
      subtitle: 'Sustainable Fashion E-commerce',
      instagramUrl: 'https://instagram.com/fashionbrand',
      image: {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
        alt: 'Fashion brand store',
      },
      metrics: [
        { label: 'Orders', value: '15,847' },
        { label: 'Revenue Growth', value: '+280%' },
        { label: 'Customer Satisfaction', value: '4.9/5' },
      ],
      order: 2,
      isFeatured: true,
    },
    {
      id: '3',
      name: 'RestaurantChain',
      slug: 'restaurant-chain',
      subtitle: 'Multi-location Restaurant Group',
      instagramUrl: 'https://instagram.com/restaurantchain',
      image: {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
        alt: 'Restaurant interior',
      },
      metrics: [
        { label: 'Monthly Orders', value: '45,230' },
        { label: 'Revenue Increase', value: '+195%' },
        { label: 'Customer Retention', value: '87%' },
      ],
      order: 3,
      isFeatured: true,
    },
    {
      id: '4',
      name: 'HealthTech',
      slug: 'health-tech',
      subtitle: 'Digital Health Solutions',
      instagramUrl: 'https://instagram.com/healthtech',
      image: {
        id: 'img4',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop',
        alt: 'Healthcare technology',
      },
      metrics: [
        { label: 'Patient Registrations', value: '8,945' },
        { label: 'App Downloads', value: '125K+' },
        { label: 'User Engagement', value: '92%' },
      ],
      order: 4,
      isFeatured: true,
    },
    {
      id: '5',
      name: 'EduPlatform',
      slug: 'edu-platform',
      subtitle: 'Online Learning Platform',
      instagramUrl: 'https://instagram.com/eduplatform',
      image: {
        id: 'img5',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop',
        alt: 'Online education',
      },
      metrics: [
        { label: 'Student Enrollments', value: '23,456' },
        { label: 'Course Completion', value: '78%' },
        { label: 'Revenue Growth', value: '+420%' },
      ],
      order: 5,
      isFeatured: true,
    },
    {
      id: '6',
      name: 'FinTech',
      slug: 'fin-tech',
      subtitle: 'Digital Banking Solutions',
      instagramUrl: 'https://instagram.com/fintech',
      image: {
        id: 'img6',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        alt: 'Financial technology',
      },
      metrics: [
        { label: 'Transaction Volume', value: '€12.5M' },
        { label: 'User Acquisition', value: '+560%' },
        { label: 'Processing Speed', value: '0.3s' },
      ],
      order: 6,
      isFeatured: true,
    },
  ];
}
