export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  colorOverride?: string;
  className?: string;
}

export default function Sparkline({
  data,
  width = 60,
  height = 20,
  colorOverride,
  className = "",
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <span className={className} style={{ display: "inline-block", width, height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 1.5;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const px = (i: number) => pad + (i / (data.length - 1)) * w;
  const py = (v: number) => pad + h - ((v - min) / range) * h;

  const first = data[0];
  const last = data[data.length - 1];
  const trend = last > first ? "up" : last < first ? "down" : "flat";

  const stroke =
    colorOverride ??
    (trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#52525b");

  const linePath = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L${px(data.length - 1).toFixed(1)},${(pad + h).toFixed(1)} L${pad.toFixed(1)},${(pad + h).toFixed(1)} Z`;

  const endX = px(data.length - 1);
  const endY = py(last);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: "visible" }}
    >
      <path d={areaPath} fill={stroke} fillOpacity={0.1} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={endX.toFixed(1)} cy={endY.toFixed(1)} r="1.5" fill={stroke} />
    </svg>
  );
}
