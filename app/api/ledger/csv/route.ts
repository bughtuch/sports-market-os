import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function escapeCsv(val: unknown): string {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('signals')
    .select(`
      id,
      generated_at,
      sport,
      event_title,
      signal_type,
      predicted_direction,
      predicted_magnitude,
      confidence,
      decay_window_minutes,
      source,
      market_type,
      is_published,
      signal_resolutions (
        outcome,
        resolved_at,
        resolution_method,
        actual_direction,
        actual_magnitude
      )
    `)
    .order('generated_at', { ascending: false });

  if (error) {
    return new Response('Failed to fetch ledger data', { status: 500 });
  }

  const COLS = [
    'id',
    'generated_at',
    'sport',
    'event_title',
    'signal_type',
    'predicted_direction',
    'predicted_magnitude',
    'confidence',
    'decay_window_minutes',
    'source',
    'market_type',
    'outcome',
    'resolved_at',
    'resolution_method',
    'actual_direction',
    'actual_magnitude',
  ];

  const header = COLS.join(',');
  const rows = (data ?? []).map(s => {
    const res = Array.isArray(s.signal_resolutions)
      ? s.signal_resolutions[0]
      : s.signal_resolutions;
    return [
      escapeCsv(s.id),
      escapeCsv(s.generated_at),
      escapeCsv(s.sport),
      escapeCsv(s.event_title),
      escapeCsv(s.signal_type),
      escapeCsv(s.predicted_direction),
      escapeCsv(s.predicted_magnitude),
      escapeCsv(s.confidence),
      escapeCsv(s.decay_window_minutes),
      escapeCsv(s.source),
      escapeCsv(s.market_type),
      escapeCsv(res?.outcome ?? ''),
      escapeCsv(res?.resolved_at ?? ''),
      escapeCsv(res?.resolution_method ?? ''),
      escapeCsv(res?.actual_direction ?? ''),
      escapeCsv(res?.actual_magnitude ?? ''),
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="smo-ledger-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
