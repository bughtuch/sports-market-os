/**
 * LiveGameTicker — upcoming match slate from The Odds API.
 *
 * Server component — receives pre-fetched GameListing[] as a prop.
 * Renders a compact scrollable row of upcoming fixtures with odds.
 */

import type { GameListing } from "@/app/api/odds/games/route";

function formatMatchTime(iso: string): string {
  const d = new Date(iso);
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${month} ${d.getUTCDate()} · ${h}:${m} UTC`;
}

function shortName(name: string): string {
  // For tennis: "Carlos Alcaraz" → "Alcaraz"
  // For team sports: keep as-is but truncate at 22 chars
  const parts = name.split(" ");
  if (parts.length >= 2 && name.length > 18) {
    return parts[parts.length - 1];
  }
  return name.length > 22 ? name.slice(0, 20) + "…" : name;
}

interface Props {
  games: GameListing[];
  accentColor?: string;
}

export default function LiveGameTicker({ games, accentColor = "text-teal-400" }: Props) {
  if (games.length === 0) {
    return (
      <div className="border border-zinc-800/60 rounded-sm p-5">
        <p className="text-[12px] font-mono text-zinc-600">
          No upcoming fixtures in Odds API. Markets appear when bookmakers list events.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="flex gap-3 px-4 md:px-0 pb-2 min-w-0">
        {games.map((g) => (
          <div
            key={g.id}
            className="shrink-0 w-[200px] border border-zinc-800/60 rounded-sm p-4 bg-zinc-950"
          >
            {/* Time */}
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-600 mb-3">
              {formatMatchTime(g.commence_time)}
            </p>

            {/* Matchup */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-white truncate">
                  {shortName(g.home_team)}
                </span>
                {g.home_odds !== null && (
                  <span className={`text-[12px] font-mono tabular-nums shrink-0 ${accentColor}`}>
                    {g.home_odds.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-zinc-400 truncate">
                  {shortName(g.away_team)}
                </span>
                {g.away_odds !== null && (
                  <span className="text-[12px] font-mono tabular-nums text-zinc-400 shrink-0">
                    {g.away_odds.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Source */}
            <p className="text-[10px] font-mono text-zinc-700 truncate">
              {g.bookmaker}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
