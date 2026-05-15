/**
 * ODDS_API_CONFIG — quota-conscious configuration for The Odds API v4.
 *
 * Sports are filtered against the live /sports endpoint on every cold start
 * (cached 24 h). If a specific tournament key is not in season, the adapter
 * falls back to the generic sport key (e.g. tennis_atp_wimbledon → tennis_atp).
 *
 * Free tier: 500 requests / month — pollIntervalMinutes controls how often
 * each sport is refreshed. At 240 min (4 h) with 7 configured sports:
 *   worst case = 7 API calls per 4 h = ~1,260 calls/month.
 *   In practice, out-of-season sports are skipped, so real usage is lower.
 */

export const ODDS_API_CONFIG = {
  sports: [
    "tennis_atp_french_open",
    "tennis_atp_wimbledon",
    "soccer_epl",
    "soccer_uefa_champs_league",
    "americanfootball_nfl",
    "basketball_nba",
    "mma_mixed_martial_arts",
  ],
  markets: "h2h,spreads",
  regions: "uk",
  oddsFormat: "decimal",
  /** Cache TTL per sport. Do not lower below 60 — protects free-tier quota. */
  pollIntervalMinutes: 240,
} as const;

/** Fallback keys tried when a specific tournament is out of season. */
export const TENNIS_FALLBACK_KEYS = ["tennis_atp", "tennis_wta"] as const;
