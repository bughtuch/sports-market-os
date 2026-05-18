/**
 * MatchSlate — compact upcoming fixture list (full-width stacked rows).
 *
 * Server component. Alternative to LiveGameTicker for denser display.
 * Used below the ticker for a full table view.
 */

import type { GameListing } from "@/app/api/odds/games/route";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${month} ${d.getUTCDate()} · ${h}:${m}`;
}

interface Props {
  games: GameListing[];
  accentColor?: string;
}

export default function MatchSlate({ games, accentColor = "text-teal-400" }: Props) {
  if (games.length === 0) return null;

  return (
    <div className="divide-y divide-zinc-900">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-2">
        {["Match", "Date (UTC)", "Home", "Away"].map((h) => (
          <span key={h} className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-600">
            {h}
          </span>
        ))}
      </div>

      {games.map((g) => (
        <div key={g.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center py-3">
          {/* Match */}
          <p className="text-[14px] font-medium text-white truncate">
            {g.home_team} vs {g.away_team}
          </p>

          {/* Date */}
          <span className="text-[11px] font-mono text-zinc-600 shrink-0 whitespace-nowrap">
            {formatDate(g.commence_time)}
          </span>

          {/* Home odds */}
          <span className={`text-[13px] font-mono tabular-nums shrink-0 ${accentColor}`}>
            {g.home_odds !== null ? g.home_odds.toFixed(2) : "—"}
          </span>

          {/* Away odds */}
          <span className="text-[13px] font-mono tabular-nums text-zinc-400 shrink-0">
            {g.away_odds !== null ? g.away_odds.toFixed(2) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
