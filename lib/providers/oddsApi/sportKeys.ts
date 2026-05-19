/**
 * sportKeys — canonical mapping from internal DB sport keys → Odds API sport keys.
 *
 * Keys are tried IN ORDER. First key with active matches wins.
 * Tournament-specific keys always lead; generic keys are last-resort fallbacks.
 *
 * French Open is live (May 2026) — tennis_atp/wta_french_open leads.
 */

export const SPORT_KEY_MAP: Record<string, string[]> = {
  tennis: [
    "tennis_atp_french_open",
    "tennis_wta_french_open",
    "tennis_atp_wimbledon",
    "tennis_wta_wimbledon",
    "tennis_atp_us_open",
    "tennis_wta_us_open",
    "tennis_atp_aus_open",
    "tennis_wta_aus_open",
    "tennis_atp",
    "tennis_wta",
  ],
  nba: ["basketball_nba"],
  nfl: ["americanfootball_nfl"],
  mlb: ["baseball_mlb"],
  nhl: ["icehockey_nhl"],
  football: [
    "soccer_epl",
    "soccer_la_liga",
    "soccer_serie_a",
    "soccer_germany_bundesliga",
    "soccer_france_ligue_one",
    "soccer_uefa_champs_league",
    "soccer_uefa_europa_league",
  ],
  ufc: ["mma_mixed_martial_arts"],
  golf: [
    "golf_pga_championship",
    "golf_us_open",
    "golf_masters_tournament",
    "golf_the_open_championship",
  ],
};

export function getOddsApiKeysForSport(sport: string): string[] {
  return SPORT_KEY_MAP[sport.toLowerCase()] ?? [];
}

/** Maps an Odds API sport key prefix back to our DB sport key. */
export function oddsKeyToSport(oddsKey: string): string | null {
  if (oddsKey.startsWith("tennis_")) return "tennis";
  if (oddsKey.startsWith("soccer_")) return "football";
  if (oddsKey.startsWith("golf_")) return "golf";
  const exact: Record<string, string> = {
    basketball_nba: "nba",
    americanfootball_nfl: "nfl",
    baseball_mlb: "mlb",
    icehockey_nhl: "nhl",
    mma_mixed_martial_arts: "ufc",
  };
  return exact[oddsKey] ?? null;
}
