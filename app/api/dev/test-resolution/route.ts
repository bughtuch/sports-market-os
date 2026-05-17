import { NextResponse } from 'next/server';
import { resolvePendingSignals } from '@/lib/signals/resolution/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  if (process.env.ENABLE_DEV_ROUTES !== '1') {
    return NextResponse.json({ error: 'Dev routes disabled' }, { status: 403 });
  }

  const startTime = Date.now();
  console.log('[dev/test-resolution] Starting resolution run');

  try {
    const results = await resolvePendingSignals();
    const duration = Date.now() - startTime;

    console.log(`[dev/test-resolution] Completed in ${duration}ms — ${results.length} resolved`);

    return NextResponse.json({
      success:     true,
      duration_ms: duration,
      resolved:    results.length,
      results:     results.map(r => ({
        signal_id:         r.signal_id,
        outcome:           r.outcome,
        resolution_method: r.resolution_method,
        actual_direction:  r.actual_direction ?? null,
        actual_magnitude:  r.actual_magnitude ?? null,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[dev/test-resolution]', error);
    return NextResponse.json(
      {
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
