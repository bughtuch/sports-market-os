import MarketTicker from "@/components/MarketTicker";
import Sidebar from "@/components/Sidebar";
import SignalCard, { type SignalCardData } from "@/components/SignalCard";
import AIPanel from "@/components/AIPanel";
import StatusStrip from "@/components/StatusStrip";

// ─── Mock feed data ───────────────────────────────────────────────────────────

const feedCards: SignalCardData[] = [
  {
    sport: "Horse Racing",
    timestamp: "14:32:08",
    title: "Sharp Money Detected — Ascot 2.40",
    description:
      "Significant unmatched liability appearing on the lay side of the 2.40 at Ascot. Queue structure deteriorating. Pattern consistent with informed positioning ahead of a move.",
    confidence: 87,
    tag: "Premium",
    type: "Sharp Money",
  },
  {
    sport: "Tennis",
    timestamp: "14:29:51",
    title: "Liquidity Imbalance — Djokovic vs Alcaraz",
    description:
      "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average with price compression suggesting imminent volatility expansion.",
    confidence: 74,
    tag: "Free",
    type: "Liquidity Imbalance",
  },
  {
    sport: "NBA",
    timestamp: "14:27:14",
    title: "AI Market Thesis — Warriors vs Lakers",
    description:
      "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data. Sharp-side consensus aligning with AI projection.",
    confidence: 81,
    tag: "Premium",
    type: "AI Market Thesis",
  },
  {
    sport: "NFL",
    timestamp: "14:24:03",
    title: "Volatility Compression — Chiefs vs Bills",
    description:
      "Implied volatility contracting sharply across the totals market. Three consecutive hours of compression without a triggering event — historically precedes a significant move.",
    confidence: 69,
    tag: "Free",
    type: "Volatility Watch",
  },
  {
    sport: "Horse Racing",
    timestamp: "14:21:47",
    title: "Queue Health Warning — Cheltenham 3.15",
    description:
      "Betfair queue depth falling below threshold. Liquidity thinning on both sides simultaneously. Not consistent with normal pre-race withdrawal. Monitor for stewards' decision.",
    confidence: 92,
    tag: "API",
    type: "Queue Health",
  },
  {
    sport: "Prediction Markets",
    timestamp: "14:18:30",
    title: "Creator Signal Generated — US Election Market",
    description:
      "AI-generated share card ready. Volume surge detected in the US presidential market. Contract pricing diverging from polling consensus by 6.8 points.",
    confidence: 78,
    tag: "Creator",
    type: "Creator Signal",
  },
  {
    sport: "UFC",
    timestamp: "14:15:12",
    title: "Market News Catalyst — Poirier vs Gaethje",
    description:
      "Weight-cut rumour entering the market. Underdog price shortening without matching public volume. Consistent with informed money responding to non-public information.",
    confidence: 65,
    tag: "Free",
    type: "News Catalyst",
  },
  {
    sport: "Football",
    timestamp: "14:11:55",
    title: "Exchange Flow Shift — Premier League Markets",
    description:
      "Cross-market liquidity rotating from Asian handicap into match result markets. Flow pattern matches institutional rebalancing rather than retail activity.",
    confidence: 72,
    tag: "Premium",
    type: "Exchange Flow",
  },
];

// ─── Terminal page ────────────────────────────────────────────────────────────

export default function TerminalPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top market ticker */}
      <MarketTicker />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Center + Right */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Terminal header bar */}
          <div className="h-10 shrink-0 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="text-white text-xs font-semibold">Live Market Intelligence</span>
              <span className="text-zinc-600 text-[10px] font-mono">— {feedCards.length} signals active</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-zinc-500 text-[10px] font-mono hover:text-white transition-colors uppercase tracking-wider">
                All Sports
              </button>
              <button className="text-zinc-500 text-[10px] font-mono hover:text-white transition-colors uppercase tracking-wider">
                Free
              </button>
              <button className="text-zinc-400 text-[10px] font-mono hover:text-white transition-colors uppercase tracking-wider border border-zinc-700 px-2 py-0.5 rounded-sm">
                Premium
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-[10px] font-mono">LIVE</span>
              </div>
            </div>
          </div>

          {/* Content row */}
          <div className="flex flex-1 overflow-hidden">
            {/* Feed */}
            <main className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {feedCards.map((card, i) => (
                  <SignalCard key={i} {...card} />
                ))}
              </div>
            </main>

            {/* AI Panel */}
            <AIPanel />
          </div>
        </div>
      </div>

      {/* Status strip */}
      <StatusStrip />
    </div>
  );
}
