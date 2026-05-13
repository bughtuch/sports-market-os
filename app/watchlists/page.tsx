import { redirect } from "next/navigation";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

const defaultWatchlist = [
  { name: "Ascot 14:30", sport: "Horse Racing", accent: "text-amber-400", accentBg: "bg-amber-400/10", accentBorder: "border-amber-400/20" },
  { name: "Djokovic vs Alcaraz", sport: "Tennis", accent: "text-emerald-400", accentBg: "bg-emerald-400/10", accentBorder: "border-emerald-400/20" },
  { name: "Warriors vs Lakers", sport: "NBA", accent: "text-blue-400", accentBg: "bg-blue-400/10", accentBorder: "border-blue-400/20" },
  { name: "Chiefs vs Bills Total", sport: "NFL", accent: "text-red-400", accentBg: "bg-red-400/10", accentBorder: "border-red-400/20" },
  { name: "Poirier vs Gaethje", sport: "UFC", accent: "text-orange-400", accentBg: "bg-orange-400/10", accentBorder: "border-orange-400/20" },
  { name: "US Election Contract", sport: "Prediction", accent: "text-purple-400", accentBg: "bg-purple-400/10", accentBorder: "border-purple-400/20" },
];

export default async function WatchlistsPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/signin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/watchlists");
  }

  return (
    <div className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 md:overflow-y-auto">
          {/* Header */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/terminal"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Watchlists</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">
                  Watchlists
                </h1>
                <p className="text-zinc-500 text-sm">
                  Markets you&apos;re monitoring — live signals and alerts.
                </p>
              </div>
              <button className="text-xs font-medium text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors shrink-0">
                + Add Market
              </button>
            </div>
          </section>

          {/* Default watchlist */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Active Markets
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-600 text-[9px] font-mono">LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {defaultWatchlist.map((item) => (
                <div
                  key={item.name}
                  className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${item.accent} ${item.accentBg} ${item.accentBorder}`}
                    >
                      {item.sport}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                      <span className="text-emerald-600 text-[9px] font-mono">LIVE</span>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium leading-snug mb-3">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 text-[10px] font-mono">Watching</span>
                    <button className="text-zinc-700 text-[9px] font-mono hover:text-red-400 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Empty state hint */}
          <section className="px-6 py-5">
            <div className="max-w-md">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
                How Watchlists Work
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Add any market from the Terminal to your watchlist. You&apos;ll receive live signal
                alerts, AI commentary, and priority notifications when movements are detected.
              </p>
              <Link
                href="/terminal"
                className="inline-block mt-4 text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
              >
                Browse Terminal →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
