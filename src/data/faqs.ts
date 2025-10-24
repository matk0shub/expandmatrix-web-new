import type { FAQ } from '@/types/faqs';
import sampleFaqsJson from './faqs.json';

export const sampleFaqs: FAQ[] = sampleFaqsJson as FAQ[];

interface GetSampleFAQsOptions {
  featuredOnly?: boolean;
}

export function getSampleFAQs(options: GetSampleFAQsOptions = {}): FAQ[] {
  const { featuredOnly = false } = options;
  const sorted = [...sampleFaqs].sort((a, b) => a.order - b.order);

  const visible = sorted.filter((faq) => faq.showOnSite);

  return featuredOnly ? visible.filter((faq) => faq.isFeatured) : visible;
}

export function getSampleFAQsResponse(options: GetSampleFAQsOptions = {}) {
  const faqs = getSampleFAQs(options);

  return {
    docs: faqs,
    totalDocs: faqs.length,
    limit: faqs.length,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}
