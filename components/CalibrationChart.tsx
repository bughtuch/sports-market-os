"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export interface CalibrationBucket {
  bucket: string;
  hitRate: number | null; // null if no resolved signals in this bucket
  expected: number;       // bucket midpoint as implied accuracy
  total: number;
  resolved: number;
}

interface Props {
  data: CalibrationBucket[];
  hasEnoughData: boolean;
}

export default function CalibrationChart({ data, hasEnoughData }: Props) {
  if (!hasEnoughData) {
    return (
      <div className="flex items-center justify-center h-48 border border-zinc-900 rounded-[8px] bg-zinc-950">
        <div className="text-center">
          <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.1em] mb-2">
            Calibration Curve
          </p>
          <p className="text-zinc-500 text-[13px] font-mono">
            Activates after 20 resolved signals.
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.map(d => ({
    bucket: d.bucket,
    "Hit Rate": d.hitRate ?? 0,
    "Perfect Calibration": d.expected,
  }));

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" />
          <XAxis
            dataKey="bucket"
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 4,
              fontSize: 10,
              fontFamily: "monospace",
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`]}
          />
          <ReferenceLine y={0} stroke="#27272a" />
          <Bar dataKey="Hit Rate" fill="#5EE7DF" opacity={0.8} radius={[2, 2, 0, 0]} />
          <Line
            type="monotone"
            dataKey="Perfect Calibration"
            stroke="#3f3f46"
            strokeDasharray="4 2"
            dot={false}
            strokeWidth={1}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
