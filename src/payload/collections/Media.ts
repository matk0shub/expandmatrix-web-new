import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Allow public read access to media files
  },
  upload: {
    staticDir: 'media',
    // Convert uploaded rasters (e.g., PNG/JPG) to WebP for smaller size.
    // SVGs are left as-is by Sharp.
    formatOptions: {
      format: 'webp',
      options: {
        quality: 78,
        nearLossless: true,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        // Ensure sizes are also output as WebP
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/*',
      'image/svg+xml',
      'application/svg+xml',
      'application/xml',
      'text/xml',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
