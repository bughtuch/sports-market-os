/**
 * GET /api/odds/games?sport=tennis
 *
 * Returns upcoming match data from The Odds API for the requested sport.
 * Mapped to internal sport DB keys (tennis, nba, nfl, football, nhl, ufc).
 *
 * Cached at the Next.js level via revalidate — do NOT call this from client
 * components in a tight loop; the Odds API free tier is 500 req/month.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getOddsApiKey,
  getQuotaState,
} from "@/lib/providers/odds/theOddsApiProvider";

export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour cache

// Map from our DB sport keys → Odds API sport keys (in priority order)
const SPORT_TO_ODDS_KEYS: Record<string, string[]> = {
  tennis:   ["tennis_atp_french_open", "tennis_atp_wimbledon", "tennis_atp", "tennis_wta"],
  nba:      ["basketball_nba"],
  nfl:      ["americanfootball_nfl"],
  football: ["soccer_epl", "soccer_uefa_champs_league"],
  nhl:      ["icehockey_nhl"],
  ufc:      ["mma_mixed_martial_arts"],
};

export interface GameListing {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  sport_key: string;
  bookmaker: string;
  home_odds: number | null;
  away_odds: number | null;
}

interface OddsApiEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{ name: string; price: number }>;
    }>;
  }>;
}

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "tennis";
  const apiKey = getOddsApiKey();

  if (!apiKey) {
    return NextResponse.json({ games: [], quota: null, error: "no_api_key" });
  }

  const oddsKeys = SPORT_TO_ODDS_KEYS[sport];
  if (!oddsKeys) {
    return NextResponse.json({ games: [], quota: null, error: "unsupported_sport" });
  }

  // Try each key until we get data
  for (const oddsKey of oddsKeys) {
    try {
      const url = new URL(`https://api.the-odds-api.com/v4/sports/${oddsKey}/odds/`);
      url.searchParams.set("apiKey", apiKey);
      url.searchParams.set("regions", "uk");
      url.searchParams.set("markets", "h2h");
      url.searchParams.set("oddsFormat", "decimal");
      url.searchParams.set("dateFormat", "iso");

      const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 3600 },
      });

      if (res.status === 422 || res.status === 404) continue; // out of season
      if (!res.ok) break;

      const events = (await res.json()) as OddsApiEvent[];
      if (!Array.isArray(events) || events.length === 0) continue;

      // Take first 8 upcoming events
      const upcoming = events
        .filter((e) => new Date(e.commence_time) > new Date())
        .slice(0, 8);

      const games: GameListing[] = upcoming.map((e) => {
        const bookmaker = e.bookmakers[0];
        const h2h = bookmaker?.markets?.find((m) => m.key === "h2h");
        const homeOutcome = h2h?.outcomes?.find((o) => o.name === e.home_team);
        const awayOutcome = h2h?.outcomes?.find((o) => o.name === e.away_team);
        return {
          id: e.id,
          home_team: e.home_team,
          away_team: e.away_team,
          commence_time: e.commence_time,
          sport_key: e.sport_key,
          bookmaker: bookmaker?.title ?? "—",
          home_odds: homeOutcome?.price ?? null,
          away_odds: awayOutcome?.price ?? null,
        };
      });

      return NextResponse.json({
        games,
        quota: getQuotaState(),
        sport_key_used: oddsKey,
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ games: [], quota: getQuotaState(), error: "no_data" });
}
