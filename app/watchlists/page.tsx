import { redirect } from "next/navigation";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import WatchlistsClient from "@/components/WatchlistsClient";
import { createClient } from "@/lib/supabase/server";
import { getUserWatchlists, getWatchlistMarkets } from "@/lib/db/watchlists";

export default async function WatchlistsPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/watchlists");

  const [watchlists, markets] = await Promise.all([
    getUserWatchlists(supabase, user.id),
    getWatchlistMarkets(supabase, user.id),
  ]);

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
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Watchlists</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Watchlists</h1>
                <p className="text-zinc-500 text-sm">Markets you&apos;re monitoring — persistent and live.</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-600 text-[9px] font-mono">LIVE</span>
              </div>
            </div>
          </section>

          <WatchlistsClient initialWatchlists={watchlists} initialMarkets={markets} />
        </main>
      </div>
    </div>
  );
}
