import { NextResponse } from 'next/server';
import { generateSignals } from '@/lib/signals/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const signals = await generateSignals();
    return NextResponse.json({
      success: true,
      generated: signals.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/generate-signals]', error);
    return NextResponse.json(
      {
        error: 'Generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
