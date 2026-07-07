export interface ReferenceMetric {
  label: string;
  value: string;
}

export interface ReferenceImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Reference {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  sector?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  image: ReferenceImage;
  metrics: ReferenceMetric[];
  order: number;
  isFeatured?: boolean;
}
