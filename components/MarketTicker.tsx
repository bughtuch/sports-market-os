const tickerItems = [
  { label: "HORSE RACING", message: "BETFAIR · Ascot 14:30 lay liability imbalance forming — queue depth deteriorating" },
  { label: "TENNIS",       message: "SMARKETS · Djokovic serve pattern regression flagged — matched volume 34% above 20-day mean" },
  { label: "NBA",          message: "FANDUEL · Warriors spread pressure building — sharp-side consensus aligning with AI projection" },
  { label: "NFL",          message: "DRAFTKINGS · Chiefs totals IV compression: three hours without a triggering event" },
  { label: "UFC",          message: "BETFAIR · Poirier ML shortening without public volume match — informed positioning pattern" },
  { label: "PREDICTION",   message: "POLYMARKET · US Election contract 6.8pt divergence from polling aggregate" },
  { label: "FOOTBALL",     message: "PINNACLE · Asian handicap-to-match result rotation — institutional rebalancing pattern" },
  { label: "HORSE RACING", message: "BETFAIR · Cheltenham 3:15 queue depth at 38% of pre-race average — 18 minutes out" },
  { label: "TENNIS",       message: "BETFAIR · Roland Garros clay-court pace regression model updated — three surface corrections" },
  { label: "NBA",          message: "BETMGM · Lakers late sharp positioning — line movement accelerating across three books" },
  { label: "NFL",          message: "CAESARS · Bills defensive scheme data weighting adjustment — AI model recalibrating" },
  { label: "FOOTBALL",     message: "BETFAIR · Champions League second-half volume pattern emerging — cross-market rotation" },
];

const labelColors: Record<string, string> = {
  "HORSE RACING": "text-amber-400",
  "TENNIS":       "text-emerald-400",
  "NBA":          "text-blue-400",
  "NFL":          "text-red-400",
  "UFC":          "text-orange-400",
  "PREDICTION":   "text-purple-400",
  "FOOTBALL":     "text-zinc-300",
};

export default function MarketTicker() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="overflow-hidden bg-zinc-950 border-b border-zinc-800/60 py-2">
      <div className="ticker-animate">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-6 text-xs tracking-wide"
          >
            <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
            <span className={`font-semibold font-mono text-[10px] ${labelColors[item.label] ?? "text-zinc-400"}`}>
              {item.label}
            </span>
            <span className="text-zinc-500 text-[10px]">{item.message}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
