/**
 * ⚠️  DISABLED — V1 PURE POLYMARKET RELEASE
 *
 * This file is part of the Odds API integration disabled in Sprint V1.
 * Not imported or called from any active code path.
 * Do not re-enable without a full sprint plan.
 */

/**
 * Sportsbook Divergence detector — fires when two or more bookmakers price
 * the same outcome at materially different implied probabilities (≥5 pp apart).
 *
 * This works with CURRENT snapshot data — no price history required.
 * It is the primary signal source for Odds API markets where history is unavailable.
 *
 * Confidence scale:
 *   divergence ≥ 10 pp → 90
 *   divergence ≥  7 pp → 80
 *   divergence ≥  5 pp → 70
 *   divergence <  5 pp → skip
 *
 * Sharp book bonus: Pinnacle, Betfair, or Matchbook in the diverging pair → +5 confidence.
 *
 * One signal per match (highest divergence wins if multiple pairs qualify).
 */

import { randomUUID } from "crypto";
import type { GeneratedSignal } from "../../providers/types";
import type { NormalizedOddsMatch } from "../../providers/oddsApi/fetchMatches";

const DECAY_WINDOW_MINUTES = 120;
const THRESHOLD_PP = 5;
const SHARP_BOOKS = ["pinnacle", "betfair", "matchbook"];

function divToConf(div: number, isSharp: boolean): number | null {
  let c: number;
  if (div >= 10) c = 90;
  else if (div >= 7) c = 80;
  else if (div >= THRESHOLD_PP) c = 70;
  else return null;
  return isSharp ? Math.min(95, c + 5) : c;
}

export function detectSportsbookDivergence(
  match: NormalizedOddsMatch
): GeneratedSignal | null {
  if (match.bookmaker_count < 2) return null;

  const selections = [...new Set(match.outcomes.map((o) => o.selection))];

  let bestConf = 0;
  let bestPayload: object | null = null;
  let bestDirection: "up" | "down" = "up";

  for (const sel of selections) {
    const bookOdds = match.outcomes.filter((o) => o.selection === sel);
    if (bookOdds.length < 2) continue;

    const probs = bookOdds.map((o) => o.implied_prob);
    const maxProb = Math.max(...probs);
    const minProb = Math.min(...probs);
    const div = Math.round((maxProb - minProb) * 100) / 100;

    if (div < THRESHOLD_PP) continue;

    const highBook = bookOdds.find((o) => o.implied_prob === maxProb)!;
    const lowBook  = bookOdds.find((o) => o.implied_prob === minProb)!;

    const isSharp = SHARP_BOOKS.some(
      (s) =>
        highBook.bookmaker_key.includes(s) ||
        lowBook.bookmaker_key.includes(s)
    );

    const conf = divToConf(div, isSharp);
    if (conf === null || conf <= bestConf) continue;

    bestConf = conf;
    bestDirection = "up"; // convergence expected — price will narrow
    bestPayload = {
      selection: sel,
      divergence_pp: div,
      high_book: highBook.bookmaker_title,
      high_implied_prob: highBook.implied_prob,
      low_book: lowBook.bookmaker_title,
      low_implied_prob: lowBook.implied_prob,
      bookmaker_count: match.bookmaker_count,
      sport_key: match.sport_key,
      is_sharp: isSharp,
      all_books: bookOdds.map((o) => ({
        book: o.bookmaker_title,
        price: o.price,
        implied_prob: o.implied_prob,
      })),
    };
  }

  if (!bestPayload || bestConf === 0) return null;

  const eventTitle = `${match.home_team} vs ${match.away_team}`;

  return {
    id: randomUUID(),
    generated_at: new Date().toISOString(),
    sport: match.sport as GeneratedSignal["sport"],
    market_type: "h2h",
    source: "the_odds_api",
    event_id: `odds_api:${match.id}`,
    event_title: eventTitle,
    signal_type: "price_divergence",
    predicted_direction: bestDirection,
    predicted_magnitude: (bestPayload as { divergence_pp: number }).divergence_pp,
    confidence: bestConf,
    decay_window_minutes: DECAY_WINDOW_MINUTES,
    narrative: null,
    historical_analog: null,
    raw_inputs: bestPayload,
    is_published: true,
  };
}

export function detectSportsbookDivergenceBatch(
  matches: NormalizedOddsMatch[]
): GeneratedSignal[] {
  const results: GeneratedSignal[] = [];
  for (const match of matches) {
    const sig = detectSportsbookDivergence(match);
    if (sig) results.push(sig);
  }
  return results;
}
