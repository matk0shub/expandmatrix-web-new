'use client';

import dynamic from 'next/dynamic';
import type { Reference } from '@/types/references';

// Completely lazy load HomePageClient to prevent ANY webpack blocking
const HomePageClient = dynamic(() => import('./HomePageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  ),
});

interface HomePageShellProps {
  locale: string;
  initialReferences: Reference[];
}

export default function HomePageShell({ locale, initialReferences }: HomePageShellProps) {
  return <HomePageClient locale={locale} initialReferences={initialReferences} />;
}

