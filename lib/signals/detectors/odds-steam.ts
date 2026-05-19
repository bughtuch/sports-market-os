/**
 * ⚠️  DISABLED — V1 PURE POLYMARKET RELEASE
 *
 * This file is part of the Odds API integration disabled in Sprint V1.
 * Not imported or called from any active code path.
 * Do not re-enable without a full sprint plan.
 */

/**
 * Steam Move detector — fires when the bookmaker consensus for one outcome
 * is unusually one-sided (4+ books agree, implied prob > 60%, variance low).
 *
 * Without Odds API historical data we can't detect real-time steam (4+ books
 * moving simultaneously). Instead we detect CONSENSUS STATE — the outcome
 * of a steam event — which is the pattern that matters for signal generation.
 *
 * A genuine steam event leaves a fingerprint: high consensus implied probability
 * with low cross-book variance. Books that moved against the steam stand out.
 *
 * Confidence scale:
 *   consensus ≥ 70%  AND books ≥ 5 → 85
 *   consensus ≥ 60%  AND books ≥ 4 → 75
 *   consensus ≥ 55%  AND books ≥ 4 → 70
 *   otherwise → skip
 *
 * At most one signal per match (highest-confidence outcome wins).
 */

import { randomUUID } from "crypto";
import type { GeneratedSignal } from "../../providers/types";
import type { NormalizedOddsMatch } from "../../providers/oddsApi/fetchMatches";

const DECAY_WINDOW_MINUTES = 60;

interface ConsensusResult {
  selection: string;
  consensus_implied_prob: number;
  book_count: number;
  variance: number;
  confidence: number;
  books: Array<{ book: string; implied_prob: number }>;
}

function assessConsensus(match: NormalizedOddsMatch): ConsensusResult | null {
  const selections = [...new Set(match.outcomes.map((o) => o.selection))];

  let best: ConsensusResult | null = null;

  for (const sel of selections) {
    const bookOdds = match.outcomes.filter((o) => o.selection === sel);
    if (bookOdds.length < 4) continue;

    const probs = bookOdds.map((o) => o.implied_prob);
    const mean = probs.reduce((a, b) => a + b, 0) / probs.length;
    const variance =
      probs.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / probs.length;

    // Only fire when variance is low (consensus has formed)
    if (variance > 25) continue;

    let conf: number | null = null;
    if (mean >= 70 && bookOdds.length >= 5) conf = 85;
    else if (mean >= 60 && bookOdds.length >= 4) conf = 75;
    else if (mean >= 55 && bookOdds.length >= 4) conf = 70;

    if (!conf) continue;
    if (best && conf <= best.confidence) continue;

    best = {
      selection: sel,
      consensus_implied_prob: Math.round(mean * 100) / 100,
      book_count: bookOdds.length,
      variance: Math.round(variance * 100) / 100,
      confidence: conf,
      books: bookOdds.map((o) => ({
        book: o.bookmaker_title,
        implied_prob: o.implied_prob,
      })),
    };
  }

  return best;
}

export function detectSteamMove(
  match: NormalizedOddsMatch
): GeneratedSignal | null {
  const consensus = assessConsensus(match);
  if (!consensus) return null;

  const eventTitle = `${match.home_team} vs ${match.away_team}`;

  return {
    id: randomUUID(),
    generated_at: new Date().toISOString(),
    sport: match.sport as GeneratedSignal["sport"],
    market_type: "h2h",
    source: "the_odds_api",
    event_id: `odds_api:${match.id}`,
    event_title: eventTitle,
    signal_type: "sharp_flow",
    predicted_direction: "up",
    predicted_magnitude: consensus.consensus_implied_prob,
    confidence: consensus.confidence,
    decay_window_minutes: DECAY_WINDOW_MINUTES,
    narrative: null,
    historical_analog: null,
    raw_inputs: {
      selection: consensus.selection,
      consensus_implied_prob: consensus.consensus_implied_prob,
      book_count: consensus.book_count,
      variance: consensus.variance,
      sport_key: match.sport_key,
      books: consensus.books,
    },
    is_published: true,
  };
}

export function detectSteamMoveBatch(
  matches: NormalizedOddsMatch[]
): GeneratedSignal[] {
  const results: GeneratedSignal[] = [];
  for (const match of matches) {
    const sig = detectSteamMove(match);
    if (sig) results.push(sig);
  }
  return results;
}
