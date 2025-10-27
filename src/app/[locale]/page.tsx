import HomePageShell from '@/components/HomePageShell';
import { getSampleReferences } from '@/data/references';

interface PageProps {
  params: { locale: string };
}

export default function HomePage({ params }: PageProps) {
  const { locale } = params;
  const initialReferences = getSampleReferences(locale);

  return <HomePageShell locale={locale} initialReferences={initialReferences} />;
}
