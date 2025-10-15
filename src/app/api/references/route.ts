import { NextResponse } from 'next/server';

// Dummy data for development/fallback
function getDummyReferences() {
  return {
    docs: [
      {
        id: '1',
        name: 'TechStartup',
        slug: 'tech-startup',
        subtitle: 'AI-Powered SaaS Platform',
        instagramUrl: 'https://instagram.com/techstartup',
        websiteUrl: 'https://techstartup.ai',
        image: {
          id: 'img1',
          url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
          alt: 'Tech startup office',
        },
        metrics: [
          { label: 'Time saved by AI agents', value: '120+ hrs / month' },
          { label: 'Customer onboarding automation', value: '90% automated' },
          { label: 'Support resolution speed', value: '3× faster' },
          { label: 'Operational cost reduction', value: '-28%' },
          { label: 'AI upsell contribution', value: '+62% revenue / client' },
        ],
        order: 1,
        isFeatured: true,
      },
      {
        id: '2',
        name: 'FashionBrand',
        slug: 'fashion-brand',
        subtitle: 'Sustainable Fashion E-commerce',
        instagramUrl: 'https://instagram.com/fashionbrand',
        websiteUrl: 'https://fashionbrand.studio',
        image: {
          id: 'img2',
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
          alt: 'Fashion brand store',
        },
        metrics: [
          { label: 'Product launch preparation', value: '2 weeks → 4 days' },
          { label: 'Content produced by AI studio', value: '180 assets / month' },
          { label: 'Ad optimization iterations', value: '12 per day' },
          { label: 'Customer service handled by AI', value: '88% of tickets' },
          { label: 'Return processing time', value: '↓ 65%' },
        ],
        order: 2,
        isFeatured: true,
      },
      {
        id: '3',
        name: 'RestaurantChain',
        slug: 'restaurant-chain',
        subtitle: 'Multi-location Restaurant Group',
        instagramUrl: 'https://instagram.com/restaurantchain',
        websiteUrl: 'https://restaurantchain.digital',
        image: {
          id: 'img3',
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
          alt: 'Restaurant interior',
        },
        metrics: [
          { label: 'Staff scheduling time saved', value: '40 hrs / week' },
          { label: 'Supply ordering automation', value: '75% of orders' },
          { label: 'Guest feedback processed', value: '6,400+ reviews / month' },
          { label: 'Menu optimization frequency', value: 'Weekly via AI insights' },
          { label: 'Waste reduction', value: '-32%' },
        ],
        order: 3,
        isFeatured: true,
      },
      {
        id: '4',
        name: 'HealthTech',
        slug: 'health-tech',
        subtitle: 'Digital Health Solutions',
        instagramUrl: 'https://instagram.com/healthtech',
        websiteUrl: 'https://healthtech.care',
        image: {
          id: 'img4',
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop',
          alt: 'Healthcare technology',
        },
        metrics: [
          { label: 'Patient triage automation', value: '82% of inquiries' },
          { label: 'Care team response time', value: '↓ from 12h to 1h' },
          { label: 'AI diagnostic suggestions', value: '97% accuracy' },
          { label: 'Compliance documentation time', value: '↓ 55%' },
          { label: 'Telehealth satisfaction', value: '4.8 / 5 rating' },
        ],
        order: 4,
        isFeatured: true,
      },
      {
        id: '5',
        name: 'EduPlatform',
        slug: 'edu-platform',
        subtitle: 'Online Learning Platform',
        instagramUrl: 'https://instagram.com/eduplatform',
        websiteUrl: 'https://eduplatform.academy',
        image: {
          id: 'img5',
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop',
          alt: 'Online education',
        },
        metrics: [
          { label: 'Course creation assisted by AI', value: '65% of modules' },
          { label: 'Learner support automated', value: '94% of chats' },
          { label: 'Personalized learning paths', value: '18K generated' },
          { label: 'Drop-out reduction', value: '-37%' },
          { label: 'Team hours saved', value: '160 hrs / month' },
        ],
        order: 5,
        isFeatured: true,
      },
      {
        id: '6',
        name: 'FinTech',
        slug: 'fin-tech',
        subtitle: 'Digital Banking Solutions',
        instagramUrl: 'https://instagram.com/fintech',
        websiteUrl: 'https://fintech.global',
        image: {
          id: 'img6',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
          alt: 'Financial technology',
        },
        metrics: [
          { label: 'Fraud detection automation', value: '99.2% coverage' },
          { label: 'Loan approvals processed by AI', value: '78% end-to-end' },
          { label: 'Compliance audit time saved', value: '210 hrs / quarter' },
          { label: 'Customer verification speed', value: '↓ from 48h to 6m' },
          { label: 'Service uptime with AI ops', value: '99.98%' },
        ],
        order: 6,
        isFeatured: true,
      },
    ],
    totalDocs: 6,
    limit: 10,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}

export async function GET() {
  try {
    // For now, return dummy data to avoid Payload configuration issues
    // TODO: Implement proper Payload integration when environment is configured
    const references = getDummyReferences();
    return NextResponse.json(references);
  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { error: 'Failed to fetch references' },
      { status: 500 }
    );
  }
}
