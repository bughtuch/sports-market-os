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

// ─── Grid texture overlay ──────────────────────────────────────────────────────
function GridOverlay({ color }: { color: string }) {
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

// ─── Landscape layout (X / Telegram) ─────────────────────────────────────────
function LandscapeCard({ signal, options, theme, layout }: Props & {
  theme: ExportTheme;
  layout: ExportLayout;
}) {
  const movColor = dirColor(signal.direction, theme);
  const watermarkUrl = buildWatermarkUrl(options.partnerCode || undefined);
  const p = 32;

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      borderLeft:  `4px solid ${signal.accentHex}`,
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  "ui-monospace, SFMono-Regular, 'Courier New', monospace",
      display:     "flex",
      flexDirection: "column",
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: `${p}px ${p}px 0`, position: "relative" }}>
        <div>
          <div style={{ color: signal.accentHex, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
          </div>
          <div style={{ color: theme.text, fontSize: layout.id === "x-landscape" ? 22 : 18, fontWeight: 700, lineHeight: 1.25, maxWidth: layout.width * 0.55 }}>
            {signal.title}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: movColor, fontSize: layout.id === "x-landscape" ? 28 : 22, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>
            {dirArrow(signal.direction)} {signal.movement}
          </div>
          <div style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>{signal.timestamp}</div>
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
        }}>
          {signal.type}
        </span>
      </div>

      {/* Description */}
      <div style={{ flex: 1, padding: `12px ${p}px 0`, position: "relative" }}>
        <p style={{ color: theme.subtext, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          {signal.description}
        </p>
      </div>

      {/* Confidence bar */}
      {options.includeConfidence && (
        <div style={{ padding: `12px ${p}px 0`, display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <div style={{ fontSize: 9, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
            AI Confidence
          </div>
          <div style={{ flex: 1, height: 2, backgroundColor: theme.border, borderRadius: 1 }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: 1 }} />
          </div>
          <div style={{ color: signal.accentHex, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {signal.confidence}%
          </div>
        </div>
      )}

      {/* Watermark footer */}
      {options.includeWatermark && (
        <div style={{
          display: "flex",
          justifyContent: options.includeCreatorHandle && options.creatorHandle ? "space-between" : "center",
          alignItems: "center",
          padding: `12px ${p}px ${p}px`,
          borderTop: `1px solid ${theme.border}`,
          marginTop: 16,
          position: "relative",
        }}>
          {options.includeCreatorHandle && options.creatorHandle ? (
            <>
              <div style={{ color: theme.accentDim, fontSize: 9, letterSpacing: "0.1em" }}>
                {options.creatorHandle}
              </div>
              <div style={{ color: theme.muted, fontSize: 9 }}>{watermarkUrl}</div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, letterSpacing: "0.04em" }}>
              <span style={{ color: theme.text }}>{WATERMARK_URL}</span>
              <span style={{ color: theme.muted }}> · {WATERMARK_CTA}</span>
            </div>
          )}
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

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  "ui-monospace, SFMono-Regular, 'Courier New', monospace",
      display:     "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding:     "80px 64px",
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: signal.accentHex }} />

      {/* Sport badge */}
      <div style={{ color: signal.accentHex, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24, position: "relative" }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Giant headline */}
      <div style={{ color: theme.text, fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 40, position: "relative" }}>
        {signal.title}
      </div>

      {/* Movement big number */}
      <div style={{ color: movColor, fontSize: 80, fontWeight: 900, fontFamily: "ui-monospace, monospace", marginBottom: 40, position: "relative" }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 40, marginBottom: 40, position: "relative" }}>
        {options.includeConfidence && (
          <div>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>AI Confidence</div>
            <div style={{ color: signal.accentHex, fontSize: 36, fontWeight: 700 }}>{signal.confidence}%</div>
          </div>
        )}
        {options.includeVolatility && (
          <div>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Type</div>
            <div style={{ color: theme.text, fontSize: 24, fontWeight: 700, textTransform: "uppercase" }}>{signal.type}</div>
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ color: theme.subtext, fontSize: 22, lineHeight: 1.6, marginBottom: 60, position: "relative", maxWidth: 800 }}>
        {signal.description}
      </div>

      {/* Pulse indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, position: "relative" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10b981" }} />
        <div style={{ color: "#10b981", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live Market Intelligence</div>
      </div>

      {/* Watermark footer */}
      {options.includeWatermark && (
        <div style={{
          position: "absolute",
          bottom: 60,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: options.includeCreatorHandle && options.creatorHandle ? "space-between" : "center",
          alignItems: "center",
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 24,
        }}>
          {options.includeCreatorHandle && options.creatorHandle ? (
            <>
              <div style={{ color: theme.accentDim, fontSize: 14, letterSpacing: "0.1em" }}>
                {options.creatorHandle}
              </div>
              <div style={{ color: theme.muted, fontSize: 14 }}>{watermarkUrl}</div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
              <span style={{ color: theme.text }}>{WATERMARK_URL}</span>
              <span style={{ color: theme.muted }}> · {WATERMARK_CTA}</span>
            </div>
          )}
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
  const p = 56;

  return (
    <div style={{
      width:       layout.width,
      height:      layout.height,
      backgroundColor: theme.bg,
      borderLeft:  `6px solid ${signal.accentHex}`,
      position:    "relative",
      overflow:    "hidden",
      fontFamily:  "ui-monospace, SFMono-Regular, 'Courier New', monospace",
      display:     "flex",
      flexDirection: "column",
      padding:     p,
    }}>
      <GridOverlay color={theme.gridColor} />

      {/* Sport + badge */}
      <div style={{ color: signal.accentHex, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, position: "relative" }}>
        {signal.sport}{options.includeExchange && signal.exchange ? ` · ${signal.exchange}` : ""}
      </div>

      {/* Title */}
      <div style={{ color: theme.text, fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 24, flex: 1, position: "relative" }}>
        {signal.title}
      </div>

      {/* Movement */}
      <div style={{ color: movColor, fontSize: 48, fontWeight: 900, marginBottom: 24, fontFamily: "ui-monospace, monospace", position: "relative" }}>
        {dirArrow(signal.direction)} {signal.movement}
      </div>

      {/* Confidence */}
      {options.includeConfidence && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, position: "relative" }}>
          <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>AI Confidence</div>
          <div style={{ flex: 1, height: 3, backgroundColor: theme.border, borderRadius: 2 }}>
            <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: 2 }} />
          </div>
          <div style={{ color: signal.accentHex, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{signal.confidence}%</div>
        </div>
      )}

      {/* Watermark */}
      {options.includeWatermark && (
        <div style={{
          display: "flex",
          justifyContent: options.includeCreatorHandle && options.creatorHandle ? "space-between" : "center",
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 16,
          position: "relative",
        }}>
          {options.includeCreatorHandle && options.creatorHandle ? (
            <>
              <div style={{ color: theme.accentDim, fontSize: 10, letterSpacing: "0.1em" }}>
                {options.creatorHandle}
              </div>
              <div style={{ color: theme.muted, fontSize: 10 }}>{watermarkUrl}</div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10 }}>
              <span style={{ color: theme.text }}>{WATERMARK_URL}</span>
              <span style={{ color: theme.muted }}> · {WATERMARK_CTA}</span>
            </div>
          )}
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
