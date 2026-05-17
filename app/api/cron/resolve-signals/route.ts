import { NextResponse } from 'next/server';
import { resolvePendingSignals } from '@/lib/signals/resolution/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const results = await resolvePendingSignals();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success:     true,
      duration_ms: duration,
      resolved:    results.length,
      timestamp:   new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/resolve-signals]', error);
    return NextResponse.json(
      {
        error:   'Resolution failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
