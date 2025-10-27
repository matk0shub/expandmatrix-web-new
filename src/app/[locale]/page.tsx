import HomePageShell from '@/components/HomePageShell';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return <HomePageShell locale={locale} />;
}
