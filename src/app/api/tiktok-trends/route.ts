import { NextRequest, NextResponse } from 'next/server';
import { TIKTOK_BEAUTY_TRENDS } from '@/lib/tiktok-trends';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q')?.toLowerCase();

    let trends = [...TIKTOK_BEAUTY_TRENDS];

    if (category && category !== 'all') {
      trends = trends.filter((t) => t.category === category);
    }

    if (search) {
      trends = trends.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.hashtag.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      data: trends,
      lastUpdated: new Date().toISOString(),
      country: 'BR',
      industry: 'Beleza & Cuidados Pessoais',
    });
  } catch (error) {
    console.error('Error fetching TikTok trends:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar tendências do TikTok Creative Center' },
      { status: 500 }
    );
  }
}
