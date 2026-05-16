"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";

interface WatchlistItem {
  id: string;
  event_id: string;
  event_title: string;
  sport: string;
  source: string;
  added_at: string;
}

const SPORT_COLORS: Record<string, string> = {
  nba:          "text-blue-400",
  nfl:          "text-amber-400",
  mlb:          "text-red-400",
  nhl:          "text-sky-400",
  ufc:          "text-orange-400",
  tennis:       "text-lime-400",
  football:     "text-emerald-400",
  horse_racing: "text-purple-400",
  golf:         "text-green-400",
  f1:           "text-red-500",
};

function sportColor(sport: string) {
  return SPORT_COLORS[sport.toLowerCase().replace(" ", "_")] ?? "text-zinc-400";
}

function formatSport(sport: string) {
  return sport
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Watchlist() {
  const [items, setItems]         = useState<WatchlistItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [signedIn, setSignedIn]   = useState(false);
  const [removing, setRemoving]   = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setSignedIn(true);

      const { data } = await supabase
        .from("user_watchlists")
        .select("*")
        .order("added_at", { ascending: false });

      setItems((data as WatchlistItem[]) ?? []);
    } catch {
      // non-fatal — show empty state
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(event_id: string) {
    setRemoving(event_id);
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.event_id !== event_id));
    try {
      await fetch("/api/watchlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id }),
      });
      track("watchlist_remove", { event_id });
    } catch {
      // non-fatal — optimistic update already applied
    } finally {
      setRemoving(null);
    }
  }

  // ── Signed-out empty state ─────────────────────────────────────────────────
  if (!loading && !signedIn) {
    return (
      <div className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              Active Watchlist
            </span>
          </div>
          <span className="text-zinc-700 text-[9px] font-mono">
            0 markets · sign in to track
          </span>
        </div>
        <div className="px-4 py-6">
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            Watchlist activates once you sign in. Track live markets, set
            confidence thresholds, and receive alerts when signals cross your
            trigger.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="px-4 py-2 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-700 animate-pulse" />
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            Active Watchlist
          </span>
        </div>
        <div className="px-4 pb-4 space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="skeleton h-10 rounded-sm"
              style={{ opacity: 1 - i * 0.25 }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Signed-in empty state ──────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              Active Watchlist
            </span>
          </div>
          <span className="text-zinc-700 text-[9px] font-mono">0 markets</span>
        </div>
        <div className="px-4 py-6">
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            No tracked markets yet. Tap{" "}
            <span className="text-zinc-500 font-mono">+ track</span> on any
            signal card to start your watchlist.
          </p>
        </div>
      </div>
    );
  }

  // ── Watchlist items ────────────────────────────────────────────────────────
  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
            Active Watchlist
          </span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono">
          {items.length} market{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-zinc-900/60">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-4 py-3 flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Sport tag */}
              <span
                className={`shrink-0 text-[9px] font-mono uppercase tracking-widest ${sportColor(item.sport)}`}
              >
                {formatSport(item.sport)}
              </span>
              {/* Title */}
              <span className="text-zinc-300 text-[11px] leading-snug truncate">
                {item.event_title}
              </span>
            </div>

            {/* Remove */}
            <button
              onClick={() => void handleRemove(item.event_id)}
              disabled={removing === item.event_id}
              className="shrink-0 text-zinc-700 hover:text-zinc-400 transition-colors text-sm leading-none disabled:opacity-30"
              aria-label="Remove from watchlist"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
