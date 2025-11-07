'use client';

import { useCalEmbed } from '@/hooks/useCalEmbed';

/**
 * Lightweight client island that bootstraps the Cal.com embed script.
 * Keeps the initialization outside of the main landing page shell so the
 * majority of the homepage can render as a server component.
 */
export default function CalEmbedInitializer() {
  useCalEmbed({ resourceHintsOnly: true });
  return null;
}
