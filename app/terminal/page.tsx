import { createClient } from "@supabase/supabase-js";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import TerminalClientLayer from "@/components/TerminalClientLayer";
import Watchlist from "@/components/Watchlist";
import TerminalRegimeWrapper from "@/components/TerminalRegimeWrapper";
import LiveSignalFeed from "@/components/LiveSignalFeed";
import DataModeIndicator from "@/components/DataModeIndicator";
import DailyBriefWidget from "@/components/DailyBriefWidget";
import MobilePanelsDrawer from "@/components/MobilePanelsDrawer";
import MarketsPulse from "@/components/MarketsPulse";

export const revalidate = 300; // 5-minute server-side cache

// ─── Supabase ─────────────────────────────────────────────────────────────────

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPORT_DISPLAY: Record<string, string> = {
  nba: "NBA", nfl: "NFL", nhl: "NHL", mlb: "MLB", ufc: "UFC",
  mma: "MMA", tennis: "Tennis", soccer: "Football",
  horse_racing: "Horse Racing", cricket: "Cricket",
  golf: "Golf", rugby: "Rugby",
};

function formatSportLabel(sport: string): string {
  return SPORT_DISPLAY[sport] ??
    sport.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function buildRegimeSentence(sportCounts: Record<string, number>, totalSignals: number): string {
  const sorted = Object.entries(sportCounts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return "Markets quiet across covered sports. Engine running, ledger compounding.";
  }

  const topSports = sorted.slice(0, 3).map(([s]) => formatSportLabel(s));

  if (topSports.length >= 3) {
    return `Signal density in ${topSports[0]}, ${topSports[1]}, ${topSports[2]} over the last 4 hours. ${totalSignals} signal${totalSignals === 1 ? "" : "s"} at >70% confidence.`;
  }

  const sportList = topSports.length === 1 ? topSports[0] : `${topSports[0]} and ${topSports[1]}`;
  return `Signal activity concentrated in ${sportList}. ${totalSignals} signal${totalSignals === 1 ? "" : "s"} at >70% confidence in the last 4 hours.`;
}

// ─── Terminal page ────────────────────────────────────────────────────────────

export default async function TerminalPage() {
  const db = adminClient();
  const since4h = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Parallel fetches: 4h signals (for regime sentence) + 7d stats (for ledger snapshot)
  const [recentSignalsRes, weekSignalsRes, weekResolutionsRes] = await Promise.all([
    db.from("signals").select("sport").gte("generated_at", since4h),
    db.from("signals")
      .select("id, confidence, generated_at")
      .gte("generated_at", since7d),
    db.from("signal_resolutions")
      .select("outcome, signal_id")
      .gte("resolved_at", since7d),
  ]);

  // ── Regime sentence ───────────────────────────────────────────────────────
  const recentSignals = recentSignalsRes.data ?? [];
  const sportCounts: Record<string, number> = {};
  for (const s of recentSignals) {
    sportCounts[s.sport] = (sportCounts[s.sport] ?? 0) + 1;
  }
  const regimeSentence = buildRegimeSentence(sportCounts, recentSignals.length);

  // ── Ledger snapshot ───────────────────────────────────────────────────────
  const weekSignals = weekSignalsRes.data ?? [];
  const weekResolutions = weekResolutionsRes.data ?? [];

  const signalsIssuedThisWeek = weekSignals.length;

  const avgConfidence =
    weekSignals.length > 0
      ? Math.round(weekSignals.reduce((s, x) => s + x.confidence, 0) / weekSignals.length)
      : null;

  const highConfCalls = weekSignals.filter((s) => s.confidence >= 85).length;

  // 7-day accuracy: resolutions that belong to signals from this week
  const weekSignalIds = new Set(weekSignals.map((s) => s.id));
  const weekResolved = weekResolutions.filter((r) => weekSignalIds.has(r.signal_id));
  const weekCorrect = weekResolved.filter((r) => r.outcome === "correct").length;
  const weekAccuracy =
    weekResolved.length > 0
      ? Math.round((weekCorrect / weekResolved.length) * 100)
      : null;

  const ledgerStats = [
    {
      label: "Signal Accuracy",
      value: weekAccuracy != null ? `${weekAccuracy}%` : "—",
      sub: weekResolved.length > 0 ? `${weekResolved.length} resolved` : "No resolved signals",
      accent: weekAccuracy != null,
    },
    {
      label: "Signals Issued",
      value: signalsIssuedThisWeek.toLocaleString(),
      sub: "This week",
      accent: false,
    },
    {
      label: "Avg Confidence",
      value: avgConfidence != null ? `${avgConfidence}%` : "—",
      sub: "Weighted mean",
      accent: false,
    },
    {
      label: "High-conf Calls",
      value: highConfCalls.toLocaleString(),
      sub: "≥ 85% confidence",
      accent: false,
    },
  ];

  return (
    <TerminalRegimeWrapper>
      {/* Client-side layer: welcome overlay + keyboard shortcuts */}
      <TerminalClientLayer />

      {/* Status bar */}
      <div className="sticky top-0 z-30 md:static md:z-auto shrink-0">
        <TerminalHeader />
      </div>

      {/* Main layout — two columns: nav sidebar + scrolling main canvas */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — nav only; hidden in screenshot mode via CSS */}
        <div className="hidden md:block terminal-sidebar shrink-0">
          <Sidebar />
        </div>

        {/* Main canvas — single scrolling column */}
        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          {/* Filter bar */}
          <div className="sticky top-0 z-10 h-9 shrink-0 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between px-4 terminal-filter-bar">
            <div className="flex items-center gap-3">
              <span className="text-white text-[11px] font-semibold">Live Market Intelligence</span>
              <DataModeIndicator />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-[9px] font-mono">LIVE</span>
              </div>
              <MobilePanelsDrawer />
            </div>
          </div>

          <main>
            {/* ── Zone 1: Global Pulse ─────────────────────────────────── */}
            <section className="px-6 py-14 border-b border-zinc-900/80">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Active Markets</p>
              <p className="text-[96px] font-bold tabular-nums text-white num-breathe leading-none mb-4">
                {signalsIssuedThisWeek > 0 ? signalsIssuedThisWeek : "—"}
              </p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
                signals · last 7 days
              </p>
              <p className="font-serif text-lg text-white max-w-2xl leading-[1.65]">
                {regimeSentence}
              </p>
            </section>

            {/* ── Zone 2: Today's Brief ────────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Today&apos;s Intelligence Brief</span>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>
              <DailyBriefWidget />
            </section>

            {/* ── Zone 3: Markets Pulse ────────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <MarketsPulse />
            </section>

            {/* ── Zone 4: Signal Feed ──────────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <LiveSignalFeed />
            </section>

            {/* ── Zone 5: Watchlist ────────────────────────────────────── */}
            <section className="border-b border-zinc-900/80">
              <div className="flex items-center gap-3 px-6 pt-8 mb-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Active Watchlist</span>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>
              <Watchlist />
            </section>

            {/* ── Zone 6: Ledger Snapshot ──────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Ledger Snapshot</span>
                <div className="flex-1 h-px bg-zinc-900" />
                <span className="text-[9px] font-mono text-zinc-700">Last 7 days</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ledgerStats.map((stat) => (
                  <div key={stat.label} className="border border-zinc-900 rounded-[8px] p-4">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p
                      className="text-3xl font-bold tabular-nums leading-none mb-1"
                      style={{ color: stat.accent ? "var(--accent)" : "white" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-zinc-600 text-[10px] font-mono">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-zinc-700 text-xs font-mono">
                Accuracy reflects signals where final outcome was determinable. Historical performance does not guarantee future results.
              </p>
            </section>

            <Footer />
          </main>
        </div>
      </div>

    </TerminalRegimeWrapper>
  );
}
