import fs from 'node:fs'
import path from 'node:path'
import type { CollectionConfig, UploadConfig } from 'payload'

const WEBP_OPTIONS = {
  quality: 80,
  alphaQuality: 85,
  smartSubsample: true,
  effort: 6,
} as const;

const uploadDir = process.env.PAYLOAD_UPLOAD_PATH
  ? path.resolve(process.env.PAYLOAD_UPLOAD_PATH)
  : path.resolve(process.cwd(), 'media')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const uploadConfig: UploadConfig & { staticURL: string } = {
  staticDir: uploadDir,
  staticURL: '/media',
  // Convert uploaded rasters (PNG/JPG) to WebP using tuned options that balance quality and size.
  formatOptions: {
    format: 'webp',
    options: WEBP_OPTIONS,
  },
  imageSizes: [
    {
      name: 'thumbnail',
      width: 400,
      height: 300,
      position: 'centre',
      // Ensure generated sizes use the same WebP settings
      formatOptions: { format: 'webp', options: WEBP_OPTIONS },
    },
    {
      name: 'card',
      width: 768,
      height: 1024,
      position: 'centre',
      formatOptions: { format: 'webp', options: WEBP_OPTIONS },
    },
    {
      name: 'tablet',
      width: 1024,
      height: undefined,
      position: 'centre',
      formatOptions: { format: 'webp', options: WEBP_OPTIONS },
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
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Allow public read access to media files
  },
  upload: uploadConfig,
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
