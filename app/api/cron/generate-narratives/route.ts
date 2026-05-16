import { NextResponse } from 'next/server';
import { backfillNarratives } from '@/lib/signals/narrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await backfillNarratives(20);
    return NextResponse.json({
      success: true,
      generated: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/generate-narratives]', error);
    return NextResponse.json(
      {
        error: 'Narrative generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
