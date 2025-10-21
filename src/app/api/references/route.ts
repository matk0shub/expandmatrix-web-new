import { NextResponse } from 'next/server';
import { getSampleReferencesResponse } from '@/data/references';

export async function GET() {
  try {
    // For now, return sample data to avoid Payload configuration issues
    // TODO: Implement proper Payload integration when environment is configured
    const references = getSampleReferencesResponse();
    return NextResponse.json(references);
  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { error: 'Failed to fetch references' },
      { status: 500 }
    );
  }
}
