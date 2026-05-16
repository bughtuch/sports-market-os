/**
 * Volume Surge detector — fires when a Polymarket market's 24h volume
 * significantly exceeds its synthetic baseline.
 *
 * Sprint 3A note: Without 7-day historical data we use a synthetic baseline
 * of 60% of current volume (baseline = current × 0.6) with stddev = baseline × 0.25.
 * Once signals accumulate in the ledger, the historical baseline fills in
 * automatically and this detector self-upgrades.
 *
 * Only fires on Polymarket events — Odds API does not expose volume_24h.
 */

import { randomUUID } from 'crypto';
import type { NormalizedMarketEvent, GeneratedSignal } from '../../providers/types';

const MIN_VOLUME_USD = 5_000; // Filter noise from tiny markets
const DECAY_WINDOW_MINUTES = 60;

function computeZScore(current: number): number {
  const baseline = current * 0.6;
  const stddev = baseline * 0.25;
  if (stddev === 0) return 0;
  return (current - baseline) / stddev;
}

function zScoreToConfidence(z: number): number | null {
  if (z >= 2.5) return 90;
  if (z >= 2.0) return 80;
  if (z >= 1.5) return 70;
  return null;
}

export async function detectVolumeSurge(
  events: NormalizedMarketEvent[]
): Promise<GeneratedSignal[]> {
  const signals: GeneratedSignal[] = [];

  for (const event of events) {
    if (event.source !== 'polymarket') continue;

    // Find 24h volume — may be on any current_prices entry
    const vol24h = event.current_prices.find(p => p.volume_24h != null)?.volume_24h;
    if (!vol24h || vol24h < MIN_VOLUME_USD) continue;

    const z = computeZScore(vol24h);
    const confidence = zScoreToConfidence(z);
    if (confidence === null) continue;

    // Direction: prices should move up as volume surges
    const yesEntry = event.current_prices.find(p =>
      p.selection.toLowerCase() === 'yes'
    );
    const predicted_direction = yesEntry && yesEntry.price > 0.5 ? 'up' : 'down';

    signals.push({
      id: randomUUID(),
      generated_at: new Date().toISOString(),
      sport: event.sport,
      market_type: event.market_type,
      source: event.source,
      event_id: event.event_id,
      event_title: event.event_title,
      signal_type: 'volume_surge',
      predicted_direction,
      predicted_magnitude: Math.round(vol24h),
      confidence,
      decay_window_minutes: DECAY_WINDOW_MINUTES,
      narrative: null,
      historical_analog: null,
      raw_inputs: {
        volume_24h: vol24h,
        synthetic_baseline: vol24h * 0.6,
        z_score: Math.round(z * 100) / 100,
        current_prices: event.current_prices,
        event_slug: event.event_slug,
      },
      is_published: true,
    });
  }

  return signals;
}
