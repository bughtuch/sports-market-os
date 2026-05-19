/**
 * GET /api/odds/games?sport=tennis
 *
 * Returns upcoming match data from The Odds API for the requested sport.
 * Maps our DB sport keys (tennis, nba, nfl…) to Odds API tournament-specific
 * keys, trying them in priority order and merging results.
 *
 * Response: { games: GameListing[], sport_keys_used: string[], total: number }
 * On error: { games: [], error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  fetchMatchesForSport,
  type NormalizedOddsMatch,
} from "@/lib/providers/oddsApi/fetchMatches";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Odds data must never be statically cached

export interface GameListing {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  sport_key: string;
  sport: string;
  bookmaker: string;      // "best of N books"
  home_odds: number | null;
  away_odds: number | null;
  bookmaker_count: number;
}

function matchToGameListing(m: NormalizedOddsMatch): GameListing {
  // Best price per selection across all books
  const homeOdds = m.outcomes
    .filter((o) => o.selection === m.home_team)
    .reduce((best, o) => (o.price > (best ?? 0) ? o.price : best), null as number | null);
  const awayOdds = m.outcomes
    .filter((o) => o.selection === m.away_team)
    .reduce((best, o) => (o.price > (best ?? 0) ? o.price : best), null as number | null);

  // Which bookmakers covered this match
  const bookmakerTitles = [...new Set(m.outcomes.map((o) => o.bookmaker_title))];

  return {
    id: m.id,
    home_team: m.home_team,
    away_team: m.away_team,
    commence_time: m.commence_time,
    sport_key: m.sport_key,
    sport: m.sport,
    bookmaker: bookmakerTitles.slice(0, 2).join(", ") + (bookmakerTitles.length > 2 ? ` +${bookmakerTitles.length - 2}` : ""),
    home_odds: homeOdds !== null ? Math.round(homeOdds * 100) / 100 : null,
    away_odds: awayOdds !== null ? Math.round(awayOdds * 100) / 100 : null,
    bookmaker_count: m.bookmaker_count,
  };
}

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get("sport") ?? "tennis";

  console.log(`[api/odds/games] Request for sport=${sport}`);

  try {
    const matches = await fetchMatchesForSport(sport);

    console.log(`[api/odds/games] Returning ${matches.length} matches for sport=${sport}`);

    const games = matches.map(matchToGameListing);

    const sportKeysUsed = [...new Set(matches.map((m) => m.sport_key))];

    if (games.length === 0) {
      return NextResponse.json({
        games: [],
        sport_keys_used: sportKeysUsed,
        total: 0,
        message: `No active markets for ${sport} on The Odds API right now.`,
      });
    }

    return NextResponse.json({
      games,
      sport_keys_used: sportKeysUsed,
      total: games.length,
    });
  } catch (error) {
    console.error("[api/odds/games] Error:", error);
    return NextResponse.json(
      {
        games: [],
        error: "Odds API unavailable",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 200 } // 200 so the page renders with empty state, not an error boundary
    );
  }
}
