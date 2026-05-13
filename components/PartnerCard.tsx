export interface PartnerData {
  name: string;
  platform: string;
  audience: string;
  signalsToday: number;
  reach: string;
  engagement: string;
  live: boolean;
}

const platformColors: Record<string, string> = {
  "Telegram": "text-blue-400",
  "X / Twitter": "text-zinc-300",
  "Discord": "text-purple-400",
  "Newsletter": "text-amber-400",
  "Reddit": "text-orange-400",
};

export default function PartnerCard({
  name,
  platform,
  audience,
  signalsToday,
  reach,
  engagement,
  live,
}: PartnerData) {
  const platformColor = platformColors[platform] ?? "text-zinc-400";

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 hover:border-zinc-700 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white text-sm font-semibold">{name}</p>
          <span className={`text-[10px] font-mono ${platformColor}`}>{platform}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />}
          <span
            className={`text-[9px] font-mono uppercase tracking-wider ${
              live ? "text-emerald-500" : "text-zinc-600"
            }`}
          >
            {live ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">
            Audience
          </p>
          <p className="text-white text-xs font-semibold tabular-nums">{audience}</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">
            Signals
          </p>
          <p className="text-white text-xs font-semibold tabular-nums">{signalsToday}/day</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">
            Engage
          </p>
          <p className="text-emerald-400 text-xs font-semibold tabular-nums">{engagement}</p>
        </div>
      </div>

      {/* Reach bar */}
      <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between">
        <span className="text-zinc-600 text-[9px] font-mono">Est. daily reach</span>
        <span className="text-zinc-300 text-[10px] font-mono tabular-nums font-semibold">
          {reach}
        </span>
      </div>
    </div>
  );
}
