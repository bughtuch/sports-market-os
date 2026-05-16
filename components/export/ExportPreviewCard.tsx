/**
 * ExportPreviewCard — inline-style render target for html-to-image.
 *
 * All styles are inline — Tailwind classes are NOT used here because
 * html-to-image captures computed styles at render time. Inline styles
 * are the only reliable way to get consistent cross-environment exports.
 *
 * Font sizes are absolute px values matched to each layout's export
 * resolution so the downloaded PNG is readable at 100% zoom.
 *
 * The visible on-page preview uses CSS transform: scale() to fit the UI.
 * The off-screen capture target (fixed position, left: -99999) renders at
 * full native resolution — html-to-image captures that, not the preview.
 */

import type { ExportSignal, ExportOptions, ExportTheme, ExportLayout, ExportLayoutId } from "@/lib/export/exportTypes";
import { EXPORT_THEMES } from "@/lib/export/exportThemes";
import { EXPORT_LAYOUTS } from "@/lib/export/exportLayouts";
import { buildWatermarkUrl, WATERMARK_URL, WATERMARK_CTA } from "@/lib/export/exportWatermarks";

interface Props {
  signal: ExportSignal;
  options: ExportOptions;
}

function dirArrow(d: "up" | "down" | "flat"): string {
  return d === "up" ? "↑" : d === "down" ? "↓" : "→";
}

function dirColor(d: "up" | "down" | "flat", theme: ExportTheme): string {
  return d === "up" ? theme.upColor : d === "down" ? theme.downColor : theme.flatColor;
}

const MONO  = "ui-monospace, SFMono-Regular, 'Courier New', monospace";
const SERIF = "Georgia, 'Palatino Linotype', 'Book Antiqua', serif";

// ─── Per-layout type scale ────────────────────────────────────────────────────
// All values are absolute CSS pixels matched to the layout's export resolution.

interface Scale {
  pad:          number; // card padding
  sportHeader:  number; // sport · exchange label
  title:        number; // signal title
  timestamp:    number; // top-right date
  typeBadge:    number; // signal type label / badge
  narrative:    number; // body prose
  confLabel:    number; // "AI Confidence" label
  confValue:    number; // "80%" value
  movement:     number; // "↑ +2.4%" movement number
  watermark:    number; // bottom watermark
  barH:         number; // confidence bar height
  accentBorder: number; // left accent border width
}

const SCALES: Record<string, Scale> = {
  "x-landscape": {
    pad: 48, sportHeader: 18, title: 36, timestamp: 16,
    typeBadge: 17, narrative: 22, confLabel: 16, confValue: 36,
    movement: 44, watermark: 18, barH: 4, accentBorder: 6,
  },
  "telegram-card": {
    pad: 32, sportHeader: 13, title: 25, timestamp: 11,
    typeBadge: 12, narrative: 15, confLabel: 11, confValue: 26,
    movement: 30, watermark: 13, barH: 3, accentBorder: 4,
  },
  "square-post": {
    pad: 64, sportHeader: 20, title: 44, timestamp: 18,
    typeBadge: 18, narrative: 26, confLabel: 18, confValue: 48,
    movement: 64, watermark: 20, barH: 5, accentBorder: 8,
  },
  "vertical-shorts": {
    pad: 64, sportHeader: 26, title: 56, timestamp: 20,
    typeBadge: 22, narrative: 36, confLabel: 20, confValue: 64,
    movement: 96, watermark: 28, barH: 6, accentBorder: 0,
  },
  "instagram-story": {
    pad: 64, sportHeader: 26, title: 56, timestamp: 20,
    typeBadge: 22, narrative: 36, confLabel: 20, confValue: 64,
    movement: 96, watermark: 28, barH: 6, accentBorder: 0,
  },
};

function scale(layoutId: ExportLayoutId): Scale {
  return SCALES[layoutId] ?? SCALES["x-landscape"];
}

// ─── Grid texture overlay ──────────────────────────────────────────────────────
function GridOverlay({ color, cellSize }: { color: string; cellSize: number }) {
  if (color === "rgba(0,0,0,0)") return null;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${cellSize}px ${cellSize}px`,
      pointerEvents: "none",
    }} />
  );
}

// ─── Watermark row — shared across all layouts ─────────────────────────────────
function WatermarkRow({
  theme, options, watermarkUrl, fontSize,
}: {
  theme: ExportTheme;
  options: ExportOptions;
  watermarkUrl: string;
  fontSize: number;
}) {
  const hasHandle = options.includeCreatorHandle && options.creatorHandle;
  return (
    <div style={{ display: "flex", justifyContent: hasHandle ? "space-between" : "center", alignItems: "center", fontFamily: MONO }}>
      {hasHandle ? (
        <>
          <span style={{ color: theme.accentDim, fontSize, letterSpacing: "0.1em" }}>{options.creatorHandle}</span>
          <span style={{ color: theme.muted, fontSize }}>{watermarkUrl}</span>
        </>
      ) : (
        <span style={{ fontSize, letterSpacing: "0.03em" }}>
          <span style={{ color: theme.text, fontWeight: 700 }}>{WATERMARK_URL}</span>
          <span style={{ color: theme.muted }}> · {WATERMARK_CTA}</span>
        </span>
      )}
    </div>
  );
}

// ─── Landscape layout (X / Telegram) ─────────────────────────────────────────
function LandscapeCard({ signal, options, theme, layout }: Props & { theme: ExportTheme; layout: ExportLayout }) {
  const s         = scale(layout.id);
  const movColor  = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const bodyFont  = theme.serifBody ? SERIF : MONO;

  const cardBorder = theme.showOutline
    ? { border: `1px solid ${theme.border}`, borderLeft: `${s.accentBorder}px solid ${signal.accentHex}` }
    : { borderLeft: `${s.accentBorder}px solid ${signal.accentHex}` };

  return (
    <div style={{
      width: layout.width, height: layout.height,
      backgroundColor: theme.bg, ...cardBorder,
      position: "relative", overflow: "hidden",
      fontFamily: MONO, display: "flex", flexDirection: "column",
    }}>
      <GridOverlay color={theme.gridColor} cellSize={48} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: `${s.pad}px ${s.pad}px 0`, position: "relative" }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: s.pad }}>
          {/* Sport · Exchange */}
          <div style={{ color: theme.accent, fontSize: s.sportHeader, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: s.pad * 0.4, fontFamily: MONO }}>
            {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
          </div>
          {/* Title */}
          <div style={{ color: theme.text, fontSize: s.title, fontWeight: 700, lineHeight: 1.2, fontFamily: bodyFont }}>
            {signal.title}
          </div>
        </div>
        {/* Movement + timestamp */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: movColor, fontSize: s.movement, fontWeight: 700, fontFamily: MONO, lineHeight: 1 }}>
            {dirArrow(signal.direction)} {signal.movement}
          </div>
          <div style={{ color: theme.muted, fontSize: s.timestamp, marginTop: 8, fontFamily: MONO }}>{signal.timestamp}</div>
        </div>
      </div>

      {/* Type label */}
      <div style={{ padding: `${Math.round(s.pad * 0.5)}px ${s.pad}px 0`, position: "relative" }}>
        <span style={{
          color: signal.accentHex,
          border: `1px solid ${signal.accentHex}40`,
          backgroundColor: `${signal.accentHex}12`,
          fontSize: s.typeBadge, padding: `${Math.round(s.typeBadge * 0.25)}px ${Math.round(s.typeBadge * 0.6)}px`,
          borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: MONO,
        }}>
          {signal.type}
        </span>
      </div>

      {/* Narrative body */}
      <div style={{ flex: 1, padding: `${Math.round(s.pad * 0.5)}px ${s.pad}px 0`, position: "relative", overflow: "hidden" }}>
        <p style={{ color: theme.subtext, fontSize: s.narrative, lineHeight: 1.55, margin: 0, fontFamily: bodyFont }}>
          {signal.description}
        </p>
      </div>

      {/* Confidence */}
      {options.includeConfidence && (
        <div style={{ padding: `${Math.round(s.pad * 0.4)}px ${s.pad}px 0`, display: "flex", alignItems: "center", gap: s.pad * 0.5, position: "relative" }}>
          <div style={{ fontSize: s.confLabel, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, fontFamily: MONO }}>
            AI Confidence
          </div>
          <div style={{ flex: 1, height: s.barH, backgroundColor: theme.border, borderRadius: s.barH }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: s.barH }} />
          </div>
          <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: s.confValue, fontWeight: 700, flexShrink: 0, fontFamily: MONO }}>
            {signal.confidence}%
          </div>
        </div>
      )}

      {/* Watermark */}
      {options.includeWatermark && (
        <div style={{ padding: `${Math.round(s.pad * 0.4)}px ${s.pad}px ${s.pad}px`, borderTop: `1px solid ${theme.border}`, marginTop: Math.round(s.pad * 0.5), position: "relative" }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={s.watermark} />
        </div>
      )}
    </div>
  );
}

// ─── Vertical layout (Shorts / Story) ─────────────────────────────────────────
function VerticalCard({ signal, options, theme, layout }: Props & { theme: ExportTheme; layout: ExportLayout }) {
  const s         = scale(layout.id);
  const movColor  = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const bodyFont  = theme.serifBody ? SERIF : MONO;

  return (
    <div style={{
      width: layout.width, height: layout.height,
      backgroundColor: theme.bg,
      border: theme.showOutline ? `1px solid ${theme.border}` : "none",
      position: "relative", overflow: "hidden",
      fontFamily: MONO, display: "flex", flexDirection: "column",
      justifyContent: "center", padding: `${s.pad * 1.25}px ${s.pad}px`,
    }}>
      <GridOverlay color={theme.gridColor} cellSize={64} />

      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, backgroundColor: signal.accentHex }} />

      {/* Sport badge */}
      <div style={{ color: theme.accent, fontSize: s.sportHeader, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32, position: "relative", fontFamily: MONO }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Title */}
      <div style={{ color: theme.text, fontSize: s.title, fontWeight: 900, lineHeight: 1.1, marginBottom: 48, position: "relative", fontFamily: bodyFont }}>
        {signal.title}
      </div>

      {/* Movement */}
      <div style={{ color: movColor, fontSize: s.movement, fontWeight: 900, fontFamily: MONO, marginBottom: 48, position: "relative" }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Confidence stats */}
      <div style={{ display: "flex", gap: 48, marginBottom: 48, position: "relative" }}>
        {options.includeConfidence && (
          <div>
            <div style={{ color: theme.muted, fontSize: s.confLabel, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: MONO }}>AI Confidence</div>
            <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: s.confValue, fontWeight: 700, fontFamily: MONO }}>{signal.confidence}%</div>
          </div>
        )}
        {options.includeVolatility && (
          <div>
            <div style={{ color: theme.muted, fontSize: s.confLabel, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: MONO }}>Type</div>
            <div style={{ color: theme.text, fontSize: s.typeBadge * 1.4, fontWeight: 700, textTransform: "uppercase", fontFamily: MONO }}>{signal.type}</div>
          </div>
        )}
      </div>

      {/* Narrative */}
      <div style={{ color: theme.subtext, fontSize: s.narrative, lineHeight: 1.55, marginBottom: 80, position: "relative", fontFamily: bodyFont }}>
        {signal.description}
      </div>

      {/* Pulse indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48, position: "relative" }}>
        <div style={{ width: s.confLabel, height: s.confLabel, borderRadius: "50%", backgroundColor: "#10b981", flexShrink: 0 }} />
        <div style={{ color: "#10b981", fontSize: s.sportHeader, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: MONO }}>Live Market Intelligence</div>
      </div>

      {/* Watermark */}
      {options.includeWatermark && (
        <div style={{ position: "absolute", bottom: s.pad, left: s.pad, right: s.pad, borderTop: `1px solid ${theme.border}`, paddingTop: 28 }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={s.watermark} />
        </div>
      )}
    </div>
  );
}

// ─── Square layout ────────────────────────────────────────────────────────────
function SquareCard({ signal, options, theme, layout }: Props & { theme: ExportTheme; layout: ExportLayout }) {
  const s         = scale(layout.id);
  const movColor  = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const bodyFont  = theme.serifBody ? SERIF : MONO;

  const cardBorder = theme.showOutline
    ? { border: `1px solid ${theme.border}`, borderLeft: `${s.accentBorder}px solid ${signal.accentHex}` }
    : { borderLeft: `${s.accentBorder}px solid ${signal.accentHex}` };

  return (
    <div style={{
      width: layout.width, height: layout.height,
      backgroundColor: theme.bg, ...cardBorder,
      position: "relative", overflow: "hidden",
      fontFamily: MONO, display: "flex", flexDirection: "column", padding: s.pad,
    }}>
      <GridOverlay color={theme.gridColor} cellSize={56} />

      {/* Sport + exchange */}
      <div style={{ color: theme.accent, fontSize: s.sportHeader, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20, position: "relative", fontFamily: MONO }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Title */}
      <div style={{ color: theme.text, fontSize: s.title, fontWeight: 700, lineHeight: 1.2, marginBottom: 28, flex: 1, position: "relative", fontFamily: bodyFont }}>
        {signal.title}
      </div>

      {/* Movement */}
      <div style={{ color: movColor, fontSize: s.movement, fontWeight: 900, marginBottom: 28, fontFamily: MONO, position: "relative", lineHeight: 1 }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Narrative */}
      <div style={{ color: theme.subtext, fontSize: s.narrative, lineHeight: 1.55, marginBottom: 28, position: "relative", fontFamily: bodyFont }}>
        {signal.description}
      </div>

      {/* Confidence */}
      {options.includeConfidence && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, position: "relative" }}>
          <div style={{ fontSize: s.confLabel, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, fontFamily: MONO }}>AI Confidence</div>
          <div style={{ flex: 1, height: s.barH, backgroundColor: theme.border, borderRadius: s.barH }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: s.barH }} />
          </div>
          <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: s.confValue, fontWeight: 700, flexShrink: 0, fontFamily: MONO }}>{signal.confidence}%</div>
        </div>
      )}

      {/* Watermark */}
      {options.includeWatermark && (
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 20, position: "relative" }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={s.watermark} />
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ExportPreviewCard({ signal, options }: Props) {
  const theme  = EXPORT_THEMES[options.theme];
  const layout = EXPORT_LAYOUTS[options.layout];
  const sharedProps = { signal, options, theme, layout };

  if (options.layout === "vertical-shorts" || options.layout === "instagram-story") {
    return <VerticalCard {...sharedProps} />;
  }
  if (options.layout === "square-post") {
    return <SquareCard {...sharedProps} />;
  }
  return <LandscapeCard {...sharedProps} />;
}
