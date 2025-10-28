'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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
}

export default function HomePageShell({ locale }: HomePageShellProps) {
  const [initialReferences, setInitialReferences] = useState<any[]>([]);

  useEffect(() => {
    // Lazy load references data only after mount
    import('@/data/references').then(({ getSampleReferences }) => {
      setInitialReferences(getSampleReferences(locale));
    });
  }, [locale]);

  // Don't render HomePageClient until references are loaded
  if (!initialReferences.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <HomePageClient locale={locale} initialReferences={initialReferences} />;
}

