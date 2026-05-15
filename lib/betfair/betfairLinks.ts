/**
 * betfairLinks.ts — Betfair outbound URL builders.
 *
 * Outbound routing only. Sports Market OS does not execute trades,
 * accept wagers, or hold custody. Execution occurs on Betfair Exchange.
 *
 * Affiliate ID is injected via NEXT_PUBLIC_BETFAIR_AFFILIATE_ID env var.
 * When unset, links still work — they just won't carry the affiliate tag.
 */

const BETFAIR_BASE = "https://www.betfair.com";

/** Sport IDs used in Betfair Exchange URL paths */
export const BETFAIR_SPORT_IDS: Record<string, string> = {
  "Horse Racing": "7",
  Tennis:        "2",
  Football:      "1",
  NBA:           "6423",
  NFL:           "6423", // American Football
  UFC:           "6423", // Fighting / MMA
  Cricket:       "4",
  Golf:          "3",
};

function affiliateTag(): string {
  const id = process.env.NEXT_PUBLIC_BETFAIR_AFFILIATE_ID;
  return id ? `&btag=${encodeURIComponent(id)}` : "";
}

/**
 * Deep-link to a specific Betfair market by market ID.
 * If no marketId is provided, routes to the sport landing.
 */
export function buildBetfairMarketUrl(opts: {
  sport: string;
  marketId?: string;
  eventName?: string;
}): string {
  const sportId = BETFAIR_SPORT_IDS[opts.sport];
  if (opts.marketId) {
    return `${BETFAIR_BASE}/exchange/plus/en/betting/event/${opts.marketId}${affiliateTag()}`;
  }
  if (sportId) {
    return `${BETFAIR_BASE}/exchange/plus/en/sport/${sportId}${affiliateTag()}`;
  }
  return buildBetfairSearchUrl({ query: opts.eventName ?? opts.sport });
}

/** Route to the Betfair Exchange sport landing page. */
export function buildBetfairSportUrl(sport: string): string {
  const sportId = BETFAIR_SPORT_IDS[sport];
  if (sportId) {
    return `${BETFAIR_BASE}/exchange/plus/en/sport/${sportId}${affiliateTag()}`;
  }
  return buildBetfairSearchUrl({ query: sport });
}

/** Search the Betfair Exchange for a given query string. */
export function buildBetfairSearchUrl(opts: { query: string }): string {
  const q = encodeURIComponent(opts.query);
  return `${BETFAIR_BASE}/exchange/plus/en/betting/search?query=${q}${affiliateTag()}`;
}
