/**
 * ExportPreviewCard — inline-style render target for html-to-image.
 *
 * All styles are inline — Tailwind classes are NOT used here because
 * html-to-image captures computed styles at render time. Inline styles
 * are the only reliable way to get consistent cross-environment exports.
 *
 * This component renders the correct layout + theme based on props.
 * It is wrapped in a scaled container for preview, but captured at
 * full native resolution for download.
 */

import type { ExportSignal, ExportOptions, ExportTheme, ExportLayout } from "@/lib/export/exportTypes";
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

const MONO = "ui-monospace, SFMono-Regular, 'Courier New', monospace";
const SERIF = "Georgia, 'Palatino Linotype', 'Book Antiqua', serif";

// ─── Grid texture overlay ──────────────────────────────────────────────────────
function GridOverlay({ color }: { color: string }) {
  if (color === "rgba(0,0,0,0)") return null;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
      pointerEvents: "none",
    }} />
  );
}

// ─── Watermark row — shared across all layouts ─────────────────────────────────
function WatermarkRow({
  theme,
  options,
  watermarkUrl,
  fontSize = 10,
}: {
  theme: ExportTheme;
  options: ExportOptions;
  watermarkUrl: string;
  fontSize?: number;
}) {
  const hasHandle = options.includeCreatorHandle && options.creatorHandle;
  return (
    <div style={{
      display: "flex",
      justifyContent: hasHandle ? "space-between" : "center",
      alignItems: "center",
      fontFamily: MONO,
    }}>
      {hasHandle ? (
        <>
          <span style={{ color: theme.accentDim, fontSize, letterSpacing: "0.1em" }}>
            {options.creatorHandle}
          </span>
          <span style={{ color: theme.muted, fontSize }}>{watermarkUrl}</span>
        </>
      ) : (
        <span style={{ fontSize, letterSpacing: "0.03em" }}>
          <span style={{ color: theme.text, fontWeight: 600 }}>{WATERMARK_URL}</span>
          <span style={{ color: theme.muted }}> · {WATERMARK_CTA}</span>
        </span>
      )}
    </div>
  );
}

// ─── Landscape layout (X / Telegram) ─────────────────────────────────────────
function LandscapeCard({ signal, options, theme, layout }: Props & {
  theme: ExportTheme;
  layout: ExportLayout;
}) {
  const movColor = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const p = 32;
  const bodyFont = theme.serifBody ? SERIF : MONO;
  const descSize = theme.serifBody ? 15 : 13;
  const titleSize = layout.id === "x-landscape" ? (theme.serifBody ? 24 : 22) : (theme.serifBody ? 20 : 18);

  // For outline themes: full 1px border + accent left override
  const cardBorder = theme.showOutline
    ? { border: `1px solid ${theme.border}`, borderLeft: `4px solid ${signal.accentHex}` }
    : { borderLeft: `4px solid ${signal.accentHex}` };

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      ...cardBorder,
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  MONO,
      display:     "flex",
      flexDirection: "column",
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: `${p}px ${p}px 0`, position: "relative" }}>
        <div>
          <div style={{ color: theme.accent, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontFamily: MONO }}>
            {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
          </div>
          <div style={{ color: theme.text, fontSize: titleSize, fontWeight: 700, lineHeight: 1.25, maxWidth: layout.width * 0.55, fontFamily: bodyFont }}>
            {signal.title}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: movColor, fontSize: layout.id === "x-landscape" ? 28 : 22, fontWeight: 700, fontFamily: MONO }}>
            {dirArrow(signal.direction)} {signal.movement}
          </div>
          <div style={{ color: theme.muted, fontSize: 10, marginTop: 4, fontFamily: MONO }}>{signal.timestamp}</div>
        </div>
      </div>

      {/* Type badge */}
      <div style={{ padding: `12px ${p}px 0`, position: "relative" }}>
        <span style={{
          color: signal.accentHex,
          border: `1px solid ${signal.accentHex}40`,
          backgroundColor: `${signal.accentHex}12`,
          fontSize: 9,
          padding: "3px 8px",
          borderRadius: 2,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: MONO,
        }}>
          {signal.type}
        </span>
      </div>

      {/* Description */}
      <div style={{ flex: 1, padding: `14px ${p}px 0`, position: "relative" }}>
        <p style={{ color: theme.subtext, fontSize: descSize, lineHeight: 1.65, margin: 0, fontFamily: bodyFont }}>
          {signal.description}
        </p>
      </div>

      {/* Confidence bar */}
      {options.includeConfidence && (
        <div style={{ padding: `12px ${p}px 0`, display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <div style={{ fontSize: 9, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, fontFamily: MONO }}>
            AI Confidence
          </div>
          <div style={{ flex: 1, height: 2, backgroundColor: theme.border, borderRadius: 1 }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: 1 }} />
          </div>
          <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: MONO }}>
            {signal.confidence}%
          </div>
        </div>
      )}

      {/* Watermark footer */}
      {options.includeWatermark && (
        <div style={{
          padding: `12px ${p}px ${p}px`,
          borderTop: `1px solid ${theme.border}`,
          marginTop: 16,
          position: "relative",
        }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={10} />
        </div>
      )}
    </div>
  );
}

// ─── Vertical layout (Shorts / Story) ─────────────────────────────────────────
function VerticalCard({ signal, options, theme, layout }: Props & {
  theme: ExportTheme;
  layout: ExportLayout;
}) {
  const movColor = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const bodyFont = theme.serifBody ? SERIF : MONO;
  const descSize = theme.serifBody ? 24 : 22;

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      border: theme.showOutline ? `1px solid ${theme.border}` : "none",
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  MONO,
      display:     "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding:     "80px 64px",
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: signal.accentHex }} />

      {/* Sport badge */}
      <div style={{ color: theme.accent, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24, position: "relative", fontFamily: MONO }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Giant headline */}
      <div style={{ color: theme.text, fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 40, position: "relative", fontFamily: bodyFont }}>
        {signal.title}
      </div>

      {/* Movement big number */}
      <div style={{ color: movColor, fontSize: 80, fontWeight: 900, fontFamily: MONO, marginBottom: 40, position: "relative" }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 40, marginBottom: 40, position: "relative" }}>
        {options.includeConfidence && (
          <div>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: MONO }}>AI Confidence</div>
            <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: 36, fontWeight: 700, fontFamily: MONO }}>{signal.confidence}%</div>
          </div>
        )}
        {options.includeVolatility && (
          <div>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: MONO }}>Type</div>
            <div style={{ color: theme.text, fontSize: 24, fontWeight: 700, textTransform: "uppercase", fontFamily: MONO }}>{signal.type}</div>
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ color: theme.subtext, fontSize: descSize, lineHeight: 1.65, marginBottom: 60, position: "relative", maxWidth: 800, fontFamily: bodyFont }}>
        {signal.description}
      </div>

      {/* Pulse indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, position: "relative" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
        <div style={{ color: "#10b981", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: MONO }}>Live Market Intelligence</div>
      </div>

      {/* Watermark footer */}
      {options.includeWatermark && (
        <div style={{
          position: "absolute",
          bottom: 60,
          left: 64,
          right: 64,
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 24,
        }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={13} />
        </div>
      )}
    </div>
  );
}

// ─── Square layout ────────────────────────────────────────────────────────────
function SquareCard({ signal, options, theme, layout }: Props & {
  theme: ExportTheme;
  layout: ExportLayout;
}) {
  const movColor = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const bodyFont = theme.serifBody ? SERIF : MONO;
  const p = 56;

  const cardBorder = theme.showOutline
    ? { border: `1px solid ${theme.border}`, borderLeft: `6px solid ${signal.accentHex}` }
    : { borderLeft: `6px solid ${signal.accentHex}` };

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      ...cardBorder,
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  MONO,
      display:     "flex",
      flexDirection: "column",
      padding:     p,
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Sport + badge */}
      <div style={{ color: theme.accent, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, position: "relative", fontFamily: MONO }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Title */}
      <div style={{ color: theme.text, fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 24, flex: 1, position: "relative", fontFamily: bodyFont }}>
        {signal.title}
      </div>

      {/* Movement */}
      <div style={{ color: movColor, fontSize: 48, fontWeight: 900, marginBottom: 24, fontFamily: MONO, position: "relative" }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Confidence */}
      {options.includeConfidence && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, position: "relative" }}>
          <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, fontFamily: MONO }}>AI Confidence</div>
          <div style={{ flex: 1, height: 3, backgroundColor: theme.border, borderRadius: 2 }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: 2 }} />
          </div>
          <div style={{ color: theme.serifBody ? theme.text : signal.accentHex, fontSize: 14, fontWeight: 700, flexShrink: 0, fontFamily: MONO }}>{signal.confidence}%</div>
        </div>
      )}

      {/* Watermark */}
      {options.includeWatermark && (
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 16, position: "relative" }}>
          <WatermarkRow theme={theme} options={options} watermarkUrl={watermarkUrl} fontSize={10} />
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
