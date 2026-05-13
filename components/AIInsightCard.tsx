interface AIInsightCardProps {
  label: string;
  text: string;
  confidence?: number;
  accentColor?: string;
}

export default function AIInsightCard({
  label,
  text,
  confidence,
  accentColor = "text-blue-400",
}: AIInsightCardProps) {
  return (
    <div className="p-4 border border-zinc-800/60 rounded-sm bg-zinc-950">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          {label}
        </span>
        {confidence !== undefined && (
          <span className={`text-[9px] font-mono tabular-nums ${accentColor}`}>
            {confidence}% confidence
          </span>
        )}
      </div>
      <p className="text-zinc-300 text-[11px] leading-relaxed">{text}</p>
    </div>
  );
}
