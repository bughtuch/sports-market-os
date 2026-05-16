import { NextResponse } from 'next/server';
import { generateSignals } from '@/lib/signals/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dev test endpoint for signal generation.
 *
 * Gated on ENABLE_DEV_ROUTES env var (not NODE_ENV) so it works on
 * Vercel preview deployments when that var is set, and is disabled in
 * production where ENABLE_DEV_ROUTES is unset.
 *
 * Set ENABLE_DEV_ROUTES=1 in Vercel → Environment Variables → Preview only.
 */
export async function GET() {
  if (!process.env.ENABLE_DEV_ROUTES) {
    return NextResponse.json(
      { error: 'Dev routes not enabled — set ENABLE_DEV_ROUTES=1 in Vercel preview env' },
      { status: 403 }
    );
  }

  console.log('[dev/test-signals] Starting signal generation');
  const startTime = Date.now();

  try {
    const signals = await generateSignals();
    const duration = Date.now() - startTime;

    console.log(
      `[dev/test-signals] Generated ${signals.length} signals in ${duration}ms`
    );

    return NextResponse.json({
      success: true,
      duration_ms: duration,
      signal_count: signals.length,
      signals,
    });
  } catch (error) {
    console.error('[dev/test-signals]', error);
    return NextResponse.json(
      {
        error: 'Generation failed',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
