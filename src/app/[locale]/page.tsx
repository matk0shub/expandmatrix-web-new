import HomePageClient from '@/components/HomePageClient';
import { getSampleReferences } from '@/data/references';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const initialReferences = getSampleReferences();

  return <HomePageClient locale={locale} initialReferences={initialReferences} />;
}
