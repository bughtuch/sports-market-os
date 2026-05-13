interface AIModule {
  name: string;
  status: string;
  commentary: string;
  indicator: "active" | "processing" | "idle";
}

const aiModules: AIModule[] = [
  {
    name: "Market Narrator",
    status: "LIVE",
    indicator: "active",
    commentary:
      "Late liquidity is appearing without matching public movement. Market structure suggests hidden pressure rather than broad consensus.",
  },
  {
    name: "Liquidity Interpreter",
    status: "SCANNING",
    indicator: "processing",
    commentary:
      "Queue depth at Ascot deteriorating. Exchange imbalance forming on the 2.40 — institutional positioning detected on the lay side.",
  },
  {
    name: "Volatility AI",
    status: "ALERT",
    indicator: "active",
    commentary:
      "Compression event detected in the Djokovic market. Implied volatility contracting ahead of a likely directional move.",
  },
  {
    name: "Behavioural Intelligence",
    status: "LIVE",
    indicator: "active",
    commentary:
      "Sharp money entering NBA spread markets. Pattern matches three prior high-confidence line movements from the last 90 days.",
  },
  {
    name: "Opportunity Engine",
    status: "READY",
    indicator: "idle",
    commentary:
      "UFC underdog liquidity thinning — value window forming. Exchange price diverging from sharp consensus model by 4.2 points.",
  },
];

const indicatorColors = {
  active: "bg-emerald-400 pulse-dot",
  processing: "bg-amber-400 pulse-dot",
  idle: "bg-zinc-600",
};

const statusColors = {
  active: "text-emerald-400",
  processing: "text-amber-400",
  idle: "text-zinc-500",
};

export default function AIPanel() {
  return (
    <aside className="w-72 shrink-0 border-l border-zinc-800/60 bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">AI Market Desk</span>
        </div>
        <p className="text-zinc-600 text-[10px] font-mono">5 modules active — real-time analysis</p>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
        {aiModules.map((module) => (
          <div key={module.name} className="px-4 py-4 hover:bg-zinc-900/50 transition-colors">
            {/* Module header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs font-semibold">{module.name}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${indicatorColors[module.indicator]}`} />
                <span className={`text-[9px] font-mono uppercase tracking-wider ${statusColors[module.indicator]}`}>
                  {module.status}
                </span>
              </div>
            </div>

            {/* Commentary */}
            <p className="text-zinc-500 text-[11px] leading-relaxed">{module.commentary}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800/60 bg-black/40">
        <p className="text-zinc-700 text-[9px] font-mono tracking-wider">
          AI MARKET DESK — SPORTS MARKET OS
        </p>
      </div>
    </aside>
  );
}
