"use client";

import { useEffect, useState } from "react";

interface Metric {
  label: string;
  value: number;
  target: number;
  suffix: string;
  color: string;
}

const METRICS: Metric[] = [
  { label: "Creator Reach",        value: 0, target: 820000, suffix: "",    color: "text-emerald-400" },
  { label: "Signals Generated",    value: 0, target: 142,    suffix: "/hr", color: "text-blue-400"    },
  { label: "Engagement Events",    value: 0, target: 4800,   suffix: "",    color: "text-purple-400"  },
  { label: "Exchange Flow Events", value: 0, target: 3240,   suffix: "",    color: "text-amber-400"   },
  { label: "Screenshots Exported", value: 0, target: 18700,  suffix: "",    color: "text-teal-400"    },
  { label: "Est. Impressions",     value: 0, target: 2100000,suffix: "",    color: "text-red-400"     },
  { label: "Active Creators",      value: 0, target: 47,     suffix: "",    color: "text-orange-400"  },
  { label: "Content Exports",      value: 0, target: 1240,   suffix: "",    color: "text-zinc-300"    },
];

function formatValue(n: number, suffix: string): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M" + suffix;
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 100_000 ? 0 : 1) + "K" + suffix;
  return n.toString() + suffix;
}

export default function PartnerMetricsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>(METRICS.map((m) => ({ ...m })));
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (animated) return;
    setAnimated(true);

    const duration = 1800;
    const steps = 60;
    const stepMs = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setMetrics(
        METRICS.map((m) => ({
          ...m,
          value: Math.round(m.target * eased),
        }))
      );

      if (step >= steps) clearInterval(timer);
    }, stepMs);

    return () => clearInterval(timer);
  }, [animated]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm"
        >
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">
            {m.label}
          </p>
          <p className={`text-xl font-bold tabular-nums ${m.color}`}>
            {formatValue(m.value, m.suffix)}
          </p>
        </div>
      ))}
    </div>
  );
}
