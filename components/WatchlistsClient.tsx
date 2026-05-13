"use client";

import { useState } from "react";
import Link from "next/link";
import type { SavedWatchlist, SavedMarket } from "@/lib/db/types";

const SPORT_STYLES: Record<string, string> = {
  "Horse Racing": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Tennis: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  NBA: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  NFL: "text-red-400 bg-red-400/10 border-red-400/20",
  UFC: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Football: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
  Prediction: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const MOCK_MARKETS = [
  { sport: "Horse Racing", market_name: "Ascot 14:30", market_type: "Exchange", source: "Betfair" },
  { sport: "Tennis", market_name: "Djokovic vs Sinner", market_type: "Match", source: "Smarkets" },
  { sport: "NBA", market_name: "Lakers vs Celtics", market_type: "Spread", source: "FanDuel" },
  { sport: "UFC", market_name: "UFC Main Event", market_type: "Moneyline", source: "Betfair" },
  { sport: "NFL", market_name: "NFL Spread Watch", market_type: "Spread", source: "DraftKings" },
  { sport: "Prediction", market_name: "Prediction Contract Flow", market_type: "Contract", source: "Polymarket" },
];

interface Props {
  initialWatchlists: SavedWatchlist[];
  initialMarkets: SavedMarket[];
}

export default function WatchlistsClient({ initialWatchlists, initialMarkets }: Props) {
  const [watchlists, setWatchlists] = useState<SavedWatchlist[]>(initialWatchlists);
  const [markets, setMarkets] = useState<SavedMarket[]>(initialMarkets);
  const [showNewWL, setShowNewWL] = useState(false);
  const [newWLName, setNewWLName] = useState("");
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [selectedWL, setSelectedWL] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultWLId = watchlists[0]?.id ?? null;

  async function handleCreateWatchlist(e: React.FormEvent) {
    e.preventDefault();
    if (!newWLName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWLName.trim() }),
      });
      const json = await res.json() as { watchlist?: SavedWatchlist; error?: string };
      if (!res.ok) { setError(json.error ?? "Failed to create."); return; }
      if (json.watchlist) {
        setWatchlists((prev) => [json.watchlist!, ...prev]);
        setNewWLName("");
        setShowNewWL(false);
        if (!selectedWL) setSelectedWL(json.watchlist.id);
      }
    } catch {
      setError("Network error.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteWatchlist(id: string) {
    const res = await fetch("/api/watchlists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setWatchlists((prev) => prev.filter((w) => w.id !== id));
      setMarkets((prev) => prev.filter((m) => m.watchlist_id !== id));
    }
  }

  async function handleSaveMarket(mock: typeof MOCK_MARKETS[0]) {
    setSaving(true);
    setError(null);
    const wlId = selectedWL || defaultWLId;
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchlist_id: wlId,
          sport: mock.sport,
          market_name: mock.market_name,
          market_type: mock.market_type,
          source: mock.source,
        }),
      });
      const json = await res.json() as { market?: SavedMarket; error?: string };
      if (!res.ok) { setError(json.error ?? "Failed to save."); return; }
      if (json.market) setMarkets((prev) => [json.market!, ...prev]);
      setShowAddMarket(false);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveMarket(id: string) {
    setRemovingId(id);
    const res = await fetch("/api/markets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMarkets((prev) => prev.filter((m) => m.id !== id));
    setRemovingId(null);
  }

  const sportStyle = (sport: string) =>
    SPORT_STYLES[sport] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";

  const isEmpty = markets.length === 0;

  return (
    <div>
      {/* Watchlist tabs + create */}
      <section className="px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-3 flex-wrap">
          {watchlists.map((wl) => (
            <div key={wl.id} className="flex items-center gap-1 group">
              <button
                onClick={() => setSelectedWL(wl.id)}
                className={`text-[10px] font-mono px-3 py-1.5 rounded-sm border transition-colors ${
                  selectedWL === wl.id || (!selectedWL && wl.id === defaultWLId)
                    ? "text-white border-zinc-600 bg-zinc-900"
                    : "text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {wl.name}
              </button>
              <button
                onClick={() => handleDeleteWatchlist(wl.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-400 text-[10px] font-mono transition-all"
                title="Delete watchlist"
              >
                ×
              </button>
            </div>
          ))}

          {showNewWL ? (
            <form onSubmit={handleCreateWatchlist} className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={newWLName}
                onChange={(e) => setNewWLName(e.target.value)}
                placeholder="Watchlist name…"
                maxLength={48}
                className="bg-zinc-950 border border-zinc-700 text-white text-[10px] font-mono px-2 py-1.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500 w-36"
              />
              <button
                type="submit"
                disabled={creating}
                className="text-[10px] font-mono text-black bg-white px-2.5 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {creating ? "…" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => { setShowNewWL(false); setNewWLName(""); }}
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewWL(true)}
              className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 border border-dashed border-zinc-800 px-2.5 py-1.5 rounded-sm hover:border-zinc-600 transition-colors"
            >
              + New watchlist
            </button>
          )}
        </div>
        {error && <p className="text-red-400 text-[10px] font-mono mt-2">{error}</p>}
      </section>

      {/* Markets grid */}
      <section className="px-6 py-5 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Saved Markets
          </span>
          <div className="flex-1 h-px bg-zinc-900" />
          {markets.length > 0 && (
            <span className="text-zinc-700 text-[9px] font-mono">{markets.length} saved</span>
          )}
          <button
            onClick={() => setShowAddMarket((v) => !v)}
            className="text-[9px] font-mono text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-2 py-0.5 rounded-sm transition-colors"
          >
            + Add market
          </button>
        </div>

        {/* Add market panel */}
        {showAddMarket && (
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 mb-4">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Quick add — mock markets
            </p>
            {watchlists.length === 0 && (
              <p className="text-zinc-600 text-xs mb-3">
                Create a watchlist first to save markets into it.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MOCK_MARKETS.map((m) => {
                const alreadySaved = markets.some(
                  (sm) => sm.market_name === m.market_name
                );
                return (
                  <button
                    key={m.market_name}
                    onClick={() => !alreadySaved && !saving && handleSaveMarket(m)}
                    disabled={alreadySaved || saving || watchlists.length === 0}
                    className={`text-left p-3 rounded-sm border text-xs transition-all ${
                      alreadySaved
                        ? "border-zinc-800 bg-zinc-900/30 cursor-default opacity-50"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900/60 cursor-pointer"
                    } disabled:cursor-not-allowed`}
                  >
                    <p className="text-white font-medium leading-snug">{m.market_name}</p>
                    <p className="text-zinc-600 text-[10px] font-mono mt-0.5">{m.sport} · {m.source}</p>
                    {alreadySaved && (
                      <p className="text-emerald-600 text-[9px] font-mono mt-1">Saved</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isEmpty ? (
          <div className="py-10 text-center">
            <p className="text-zinc-600 text-sm mb-2">No markets saved yet.</p>
            <p className="text-zinc-700 text-xs">
              Use &ldquo;+ Add market&rdquo; above or save signals from the Terminal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {markets
              .filter((m) => {
                const activeId = selectedWL || defaultWLId;
                return activeId ? m.watchlist_id === activeId : true;
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${sportStyle(item.sport)}`}
                    >
                      {item.sport}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                      <span className="text-emerald-600 text-[9px] font-mono">LIVE</span>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium leading-snug mb-1">{item.market_name}</p>
                  {item.source && (
                    <p className="text-zinc-600 text-[10px] font-mono mb-3">{item.market_type} · {item.source}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 text-[10px] font-mono">Watching</span>
                    <button
                      onClick={() => handleRemoveMarket(item.id)}
                      disabled={removingId === item.id}
                      className="text-zinc-700 text-[9px] font-mono hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {removingId === item.id ? "…" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Info */}
      <section className="px-6 py-5">
        <div className="max-w-md">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            How Watchlists Work
          </p>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Save any market to your watchlist. You&apos;ll get live signal alerts, AI commentary,
            and priority notifications when movements are detected.
          </p>
          <Link
            href="/terminal"
            className="inline-block mt-4 text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
          >
            Browse Terminal →
          </Link>
        </div>
      </section>
    </div>
  );
}
