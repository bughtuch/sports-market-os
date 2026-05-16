/**
 * Cross-Source Divergence detector — THE KILLER SIGNAL.
 *
 * Compares implied probabilities between Polymarket and Odds API for the same
 * real-world event. Divergence > 3 percentage points triggers a signal.
 *
 * Price scale conventions:
 *   - Polymarket: current_prices[i].price is 0-1 probability (e.g. 0.65 = 65%)
 *   - Odds API:   current_prices[i].price is decimal odds (e.g. 1.54 → 1/1.54 = 64.9%)
 *
 * Events are matched across sources using sport + fuzzy title match.
 * Fuzzy match uses Jaccard similarity on tokenized titles (threshold 0.2).
 *
 * Sharp book bonus: +5 confidence when the diverging Odds API source is
 * Pinnacle or Betfair — these are sharp markets where divergence is more
 * significant.
 */

import { randomUUID } from 'crypto';
import type { NormalizedMarketEvent, GeneratedSignal } from '../../providers/types';

const DECAY_WINDOW_MINUTES = 120;
const DIVERGENCE_THRESHOLD_PCT = 3; // Minimum divergence in percentage points
const FUZZY_MATCH_THRESHOLD = 0.2;
const SHARP_BOOKS = ['pinnacle', 'betfair'];

// ─── Fuzzy title matching ─────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'the', 'vs', 'vs.', 'at', 'in', 'on', 'of', 'and', 'or',
  'will', 'win', 'who', 'to', 'be', 'a', 'an', 'for', 'is',
  'are', 'was', 'were', 'which', 'that',
]);

function tokenize(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length >= 3 && !STOPWORDS.has(t))
  );
}

function jaccardSimilarity(a: string, b: string): number {
  const tokA = tokenize(a);
  const tokB = tokenize(b);
  if (tokA.size === 0 || tokB.size === 0) return 0;
  const intersection = [...tokA].filter(t => tokB.has(t)).length;
  const union = new Set([...tokA, ...tokB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─── Implied probability conversion ──────────────────────────────────────────

/**
 * Returns implied probability as a percentage (0-100).
 * Polymarket: price * 100
 * Odds API: (1 / price) * 100
 */
function impliedProbPct(price: number, source: 'polymarket' | 'the_odds_api'): number {
  if (source === 'polymarket') return price * 100;
  if (price <= 1) return 0;
  return (1 / price) * 100;
}

// ─── Confidence mapping ───────────────────────────────────────────────────────

function divergenceToConfidence(divergencePct: number, isSharpBook: boolean): number | null {
  let confidence: number | null;
  if (divergencePct >= 8)      confidence = 90;
  else if (divergencePct >= 5) confidence = 80;
  else if (divergencePct >= DIVERGENCE_THRESHOLD_PCT) confidence = 70;
  else return null;

  if (isSharpBook) confidence = Math.min(95, confidence + 5);
  return confidence;
}

// ─── Main detector ────────────────────────────────────────────────────────────

export async function detectCrossSourceDivergence(
  events: NormalizedMarketEvent[]
): Promise<GeneratedSignal[]> {
  const signals: GeneratedSignal[] = [];

  const polyEvents = events.filter(e => e.source === 'polymarket');
  const oddsEvents = events.filter(e => e.source === 'the_odds_api');

  if (polyEvents.length === 0 || oddsEvents.length === 0) return [];

  for (const polyEvent of polyEvents) {
    // Find the YES outcome (Polymarket binary market)
    const yesEntry = polyEvent.current_prices.find(p =>
      p.selection.toLowerCase() === 'yes'
    );
    if (!yesEntry || yesEntry.price <= 0 || yesEntry.price >= 1) continue;

    const polyProbPct = impliedProbPct(yesEntry.price, 'polymarket');

    // Find Odds API events for the same sport and similar title
    const candidates = oddsEvents.filter(e => {
      if (e.sport !== polyEvent.sport) return false;
      const sim = jaccardSimilarity(e.event_title, polyEvent.event_title);
      return sim >= FUZZY_MATCH_THRESHOLD;
    });

    for (const oddsEvent of candidates) {
      // Use the first outcome of the matched Odds API event as the reference side
      const oddsEntry = oddsEvent.current_prices[0];
      if (!oddsEntry || oddsEntry.price <= 1) continue;

      const oddsProbPct = impliedProbPct(oddsEntry.price, 'the_odds_api');
      const divergencePct = Math.abs(polyProbPct - oddsProbPct);

      const isSharpBook = SHARP_BOOKS.some(s =>
        oddsEvent.event_title.toLowerCase().includes(s) ||
        oddsEvent.external_id.toLowerCase().includes(s)
      );

      const confidence = divergenceToConfidence(divergencePct, isSharpBook);
      if (confidence === null) continue;

      // Markets typically converge — direction is 'narrow'
      signals.push({
        id: randomUUID(),
        generated_at: new Date().toISOString(),
        sport: polyEvent.sport,
        market_type: 'h2h',
        source: 'polymarket',
        event_id: polyEvent.event_id,
        event_title: polyEvent.event_title,
        signal_type: 'cross_source_divergence',
        predicted_direction: 'narrow',
        predicted_magnitude: Math.round(divergencePct * 100) / 100,
        confidence,
        decay_window_minutes: DECAY_WINDOW_MINUTES,
        narrative: null,
        historical_analog: null,
        raw_inputs: {
          polymarket_event_id: polyEvent.event_id,
          polymarket_event_title: polyEvent.event_title,
          polymarket_prob_pct: Math.round(polyProbPct * 100) / 100,
          odds_api_event_id: oddsEvent.event_id,
          odds_api_event_title: oddsEvent.event_title,
          odds_api_prob_pct: Math.round(oddsProbPct * 100) / 100,
          divergence_pct: Math.round(divergencePct * 100) / 100,
          is_sharp_book: isSharpBook,
          // Both source snapshots included for ledger verification
          polymarket_snapshot: polyEvent.current_prices,
          odds_api_snapshot: oddsEvent.current_prices,
        },
        is_published: true,
      });
    }
  }

  return signals;
}
