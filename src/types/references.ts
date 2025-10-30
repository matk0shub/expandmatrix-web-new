export interface ReferenceMetric {
  label: string;
  value: string;
}

export interface ReferenceImageSource {
  url: string;
  width?: number;
  height?: number;
  filesize?: number;
  mimeType?: string;
}

export interface ReferenceImage {
  id: string;
  url: string;
  alt?: string;
  sources?: {
    original?: ReferenceImageSource;
    hero?: ReferenceImageSource;
    grid?: ReferenceImageSource;
    tablet?: ReferenceImageSource;
    card?: ReferenceImageSource;
    thumbnail?: ReferenceImageSource;
  };
}

export interface Reference {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  image: ReferenceImage;
  metrics: ReferenceMetric[];
  order: number;
  isFeatured: boolean;
}
