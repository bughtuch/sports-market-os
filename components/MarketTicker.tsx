const tickerItems = [
  { label: "HORSE RACING", message: "Queue health weakening at Ascot — late liquidity detected" },
  { label: "TENNIS", message: "Momentum compression detected — Djokovic market volatility rising" },
  { label: "NBA", message: "Sharp spread pressure building — late-side movement flagged" },
  { label: "NFL", message: "Market volatility index rising — line movement accelerating" },
  { label: "UFC", message: "Late money entering underdog side — behavioural shift detected" },
  { label: "PREDICTION", message: "Volume surge flagged — contract pricing diverging from consensus" },
  { label: "HORSE RACING", message: "Ascot liquidity spike detected — exchange imbalance forming" },
  { label: "TENNIS", message: "AI flagged momentum shift — serve pattern regression noted" },
];

const labelColors: Record<string, string> = {
  "HORSE RACING": "text-amber-400",
  "TENNIS": "text-emerald-400",
  "NBA": "text-blue-400",
  "NFL": "text-red-400",
  "UFC": "text-orange-400",
  "PREDICTION": "text-purple-400",
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
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
            <span className={`font-semibold font-mono ${labelColors[item.label] ?? "text-zinc-400"}`}>
              {item.label}
            </span>
            <span className="text-zinc-400">{item.message}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
