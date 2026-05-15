export interface PulseCardData {
  title: string;
  sport: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
  sparkData: number[];
  timestamp: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

export default function PulseCard({ title, sport, value, timestamp }: PulseCardData) {
  return (
    <div className="border border-zinc-900 rounded-[8px] p-3 hover:border-zinc-800 transition-[border-color] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]">
      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-white text-xs font-semibold leading-snug mb-0.5">{sport}</p>
      <p className="text-zinc-400 text-[10px] font-mono leading-none mb-3">{value}</p>
      <p className="text-zinc-700 text-[9px] font-mono tabular-nums">{timestamp}</p>
    </div>
  );
}
