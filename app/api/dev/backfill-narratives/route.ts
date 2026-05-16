import { NextResponse } from 'next/server';
import { backfillNarratives } from '@/lib/signals/narrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One-time backfill endpoint — generates narratives for ALL signals
 * currently lacking one (no 20-row limit).
 *
 * Gated on ENABLE_DEV_ROUTES env var. Set in Vercel → Environment Variables
 * for Preview (and temporarily for Production during initial backfill).
 */
export async function GET() {
  if (!process.env.ENABLE_DEV_ROUTES) {
    return NextResponse.json(
      { error: 'Dev routes not enabled — set ENABLE_DEV_ROUTES=1' },
      { status: 403 }
    );
  }

  console.log('[dev/backfill-narratives] Starting full narrative backfill');
  const start = Date.now();

  try {
    const count = await backfillNarratives(Infinity);
    return NextResponse.json({
      success: true,
      generated: count,
      duration_ms: Date.now() - start,
    });
  } catch (error) {
    console.error('[dev/backfill-narratives]', error);
    return NextResponse.json(
      {
        error: 'Backfill failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
