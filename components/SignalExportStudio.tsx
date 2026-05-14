"use client";

/**
 * SignalExportStudio — main export builder.
 *
 * Two renders of ExportPreviewCard:
 *   1. Off-screen at full native resolution → html-to-image capture target
 *   2. Visible, CSS-scaled for preview
 *
 * All capture is client-side only via html-to-image.
 * No social API posting — download + clipboard only.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import ExportPreviewCard from "@/components/export/ExportPreviewCard";
import { EXPORT_THEMES, THEME_ORDER } from "@/lib/export/exportThemes";
import { EXPORT_LAYOUTS, LAYOUT_ORDER } from "@/lib/export/exportLayouts";
import {
  downloadNodeAsPng,
  copyNodeAsImage,
  trackExport,
  exportFilename,
} from "@/lib/export/exportRenderer";
import { getStoredReferral } from "@/lib/partners/referralUtils";
import { queuePost, saveDraft } from "@/lib/distribution/distributionQueue";
import { xPostTemplate } from "@/lib/distribution/distributionTemplates";
import type { ExportSignal, ExportOptions, ExportLayoutId, ExportThemeId } from "@/lib/export/exportTypes";

interface Props {
  initialSignal: ExportSignal;
}

// ─── Theme swatch colours (bg) ────────────────────────────────────────────────
const THEME_BG: Record<ExportThemeId, string> = {
  "institutional-black": "#000000",
  "bloomberg-white":     "#f4f4f5",
  "creator-dark":        "#0c0a1e",
  "signal-red":          "#0a0000",
  "exchange-blue":       "#000814",
};

// ─── Layout aspect indicator ──────────────────────────────────────────────────
function AspectThumb({ layoutId }: { layoutId: ExportLayoutId }) {
  const l = EXPORT_LAYOUTS[layoutId];
  const maxW = 28;
  const maxH = 28;
  const scale = Math.min(maxW / l.width, maxH / l.height);
  return (
    <div
      style={{
        width:  Math.round(l.width  * scale),
        height: Math.round(l.height * scale),
        border: "1px solid currentColor",
        borderRadius: 1,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-zinc-400 text-[11px] font-mono">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-7 h-3.5 rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-zinc-800"}`}
      >
        <span
          className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${checked ? "translate-x-3.5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-700 mb-2">{children}</p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SignalExportStudio({ initialSignal }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);

  const [signal, setSignal] = useState<ExportSignal>(initialSignal);
  const [options, setOptions] = useState<ExportOptions>({
    layout:               "x-landscape",
    theme:                "institutional-black",
    includeConfidence:    true,
    includeVolatility:    true,
    includeExchange:      true,
    includeWatermark:     true,
    includeCreatorHandle: false,
    creatorHandle:        "",
    partnerCode:          "",
  });
  const [downloading,  setDownloading]  = useState(false);
  const [copying,      setCopying]      = useState(false);
  const [copyDone,     setCopyDone]     = useState(false);
  const [queueAction,  setQueueAction]  = useState<"queue" | "draft" | null>(null);
  const [queueDone,    setQueueDone]    = useState<"queue" | "draft" | null>(null);

  // Pre-fill partner code from localStorage on mount
  useEffect(() => {
    const stored = getStoredReferral();
    if (stored?.code) {
      setOptions(o => ({ ...o, partnerCode: stored.code }));
    }
  }, []);

  const layout = EXPORT_LAYOUTS[options.layout];

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function setOpt<K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) {
    setOptions(o => ({ ...o, [key]: value }));
  }

  function setSig<K extends keyof ExportSignal>(key: K, value: ExportSignal[K]) {
    setSignal(s => ({ ...s, [key]: value }));
  }

  const handleDownload = useCallback(async () => {
    if (!captureRef.current || downloading) return;
    setDownloading(true);
    const filename = exportFilename(signal.sport, options.layout);
    await downloadNodeAsPng(captureRef.current, filename, 2);
    trackExport({ layout: options.layout, theme: options.theme, sport: signal.sport, partnerCode: options.partnerCode || undefined });
    setDownloading(false);
  }, [signal.sport, options, downloading]);

  const handleCopy = useCallback(async () => {
    if (!captureRef.current || copying) return;
    setCopying(true);
    const filename = exportFilename(signal.sport, options.layout);
    await copyNodeAsImage(captureRef.current, filename);
    trackExport({ layout: options.layout, theme: options.theme, sport: signal.sport, partnerCode: options.partnerCode || undefined });
    setCopying(false);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  }, [signal.sport, options, copying]);

  const handleQueuePost = useCallback(() => {
    if (queueAction) return;
    setQueueAction("queue");
    queuePost({
      platform:         "x",
      content:          xPostTemplate({ sport: signal.sport, title: signal.title, description: signal.description, movement: signal.movement, direction: signal.direction, confidence: signal.confidence, exchange: signal.exchange, type: signal.type }),
      distributionType: "signal-card",
      metadata:         { sport: signal.sport, exportLayoutId: options.layout, exportThemeId: options.theme },
      partnerCode:      options.partnerCode || undefined,
    });
    setQueueAction(null);
    setQueueDone("queue");
    setTimeout(() => setQueueDone(null), 2500);
  }, [signal, options, queueAction]);

  const handleSaveDraft = useCallback(() => {
    if (queueAction) return;
    setQueueAction("draft");
    saveDraft({
      platform:         "x",
      content:          xPostTemplate({ sport: signal.sport, title: signal.title, description: signal.description, movement: signal.movement, direction: signal.direction, confidence: signal.confidence, exchange: signal.exchange, type: signal.type }),
      distributionType: "signal-card",
      metadata:         { sport: signal.sport, exportLayoutId: options.layout, exportThemeId: options.theme },
      partnerCode:      options.partnerCode || undefined,
    });
    setQueueAction(null);
    setQueueDone("draft");
    setTimeout(() => setQueueDone(null), 2500);
  }, [signal, options, queueAction]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-6 min-h-0 items-start">

      {/* ── Controls panel ─────────────────────────────────────────────────── */}
      <div className="w-64 shrink-0 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">

        {/* Layout */}
        <div>
          <SectionLabel>Layout</SectionLabel>
          <div className="space-y-1">
            {LAYOUT_ORDER.map(id => {
              const l = EXPORT_LAYOUTS[id];
              const active = options.layout === id;
              return (
                <button
                  key={id}
                  onClick={() => setOpt("layout", id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-left transition-colors border ${
                    active
                      ? "border-zinc-600 bg-zinc-900 text-white"
                      : "border-zinc-800/60 bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <span className={active ? "text-zinc-400" : "text-zinc-700"}>
                    <AspectThumb layoutId={id} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono leading-none mb-0.5">{l.label}</div>
                    <div className="text-[9px] font-mono text-zinc-700">{l.aspectLabel} · {l.width}×{l.height}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme */}
        <div>
          <SectionLabel>Theme</SectionLabel>
          <div className="grid grid-cols-5 gap-1.5">
            {THEME_ORDER.map(id => {
              const t = EXPORT_THEMES[id];
              const active = options.theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setOpt("theme", id)}
                  title={t.label}
                  style={{ backgroundColor: THEME_BG[id] }}
                  className={`h-8 rounded-sm border-2 transition-all ${
                    active ? "border-white scale-110" : "border-zinc-700 hover:border-zinc-500"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-zinc-700 text-[9px] font-mono mt-1.5">{EXPORT_THEMES[options.theme].label}</p>
        </div>

        {/* Options */}
        <div>
          <SectionLabel>Options</SectionLabel>
          <div className="space-y-2.5">
            <Toggle label="Confidence bar"    checked={options.includeConfidence}    onChange={v => setOpt("includeConfidence",    v)} />
            <Toggle label="Type / Volatility" checked={options.includeVolatility}    onChange={v => setOpt("includeVolatility",    v)} />
            <Toggle label="Exchange label"    checked={options.includeExchange}      onChange={v => setOpt("includeExchange",      v)} />
            <Toggle label="Watermark"         checked={options.includeWatermark}     onChange={v => setOpt("includeWatermark",     v)} />
            <Toggle label="Creator handle"    checked={options.includeCreatorHandle} onChange={v => setOpt("includeCreatorHandle", v)} />
            {options.includeCreatorHandle && (
              <input
                type="text"
                value={options.creatorHandle}
                onChange={e => setOpt("creatorHandle", e.target.value)}
                placeholder="@yourhandle"
                maxLength={60}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1.5 rounded-sm placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
              />
            )}
          </div>
        </div>

        {/* Signal fields */}
        <div>
          <SectionLabel>Signal</SectionLabel>
          <div className="space-y-2">
            {/* Direction */}
            <div className="flex gap-1">
              {(["up", "flat", "down"] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setSig("direction", d)}
                  className={`flex-1 py-1 text-[10px] font-mono rounded-sm border transition-colors ${
                    signal.direction === d
                      ? d === "up"
                        ? "border-emerald-600 bg-emerald-600/10 text-emerald-400"
                        : d === "down"
                        ? "border-red-600 bg-red-600/10 text-red-400"
                        : "border-zinc-600 bg-zinc-800 text-zinc-400"
                      : "border-zinc-800 text-zinc-700 hover:border-zinc-700"
                  }`}
                >
                  {d === "up" ? "↑ Up" : d === "down" ? "↓ Down" : "→ Flat"}
                </button>
              ))}
            </div>
            {/* Movement */}
            <input
              type="text"
              value={signal.movement}
              onChange={e => setSig("movement", e.target.value)}
              placeholder="+2.4%"
              maxLength={20}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1.5 rounded-sm placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
            />
            {/* Title */}
            <input
              type="text"
              value={signal.title}
              onChange={e => setSig("title", e.target.value)}
              placeholder="Signal title"
              maxLength={100}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1.5 rounded-sm placeholder-zinc-700 focus:outline-none focus:border-zinc-600"
            />
            {/* Description */}
            <textarea
              value={signal.description}
              onChange={e => setSig("description", e.target.value)}
              placeholder="Signal description"
              maxLength={280}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1.5 rounded-sm placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none"
            />
            {/* Confidence */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-700 text-[9px] font-mono w-20 shrink-0">Confidence</span>
              <input
                type="range"
                min={0}
                max={100}
                value={signal.confidence}
                onChange={e => setSig("confidence", Number(e.target.value))}
                className="flex-1 accent-zinc-400"
              />
              <span className="text-zinc-500 text-[10px] font-mono tabular-nums w-8 text-right shrink-0">
                {signal.confidence}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Preview + actions panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center min-w-0">

        {/* Off-screen capture target — full native resolution, no transform */}
        <div
          ref={captureRef}
          style={{ position: "fixed", left: -99999, top: 0, zIndex: -1, pointerEvents: "none" }}
          aria-hidden
        >
          <ExportPreviewCard signal={signal} options={options} />
        </div>

        {/* Visible scaled preview */}
        <div
          style={{
            width:    layout.width  * layout.previewScale,
            height:   layout.height * layout.previewScale,
            overflow: "hidden",
            borderRadius: 4,
            flexShrink: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ transform: `scale(${layout.previewScale})`, transformOrigin: "top left" }}>
            <ExportPreviewCard signal={signal} options={options} />
          </div>
        </div>

        {/* Platform label */}
        <p className="text-zinc-500 text-[10px] font-mono mt-3">{layout.platform}</p>
        <p className="text-zinc-700 text-[9px] font-mono mt-0.5">
          {layout.width} × {layout.height} px · {layout.aspectLabel}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[11px] font-mono rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
                Exporting…
              </>
            ) : (
              "↓ Download PNG"
            )}
          </button>
          <button
            onClick={handleCopy}
            disabled={copying}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-300 text-[11px] font-mono rounded-sm hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copyDone ? "✓ Copied!" : copying ? "Copying…" : "Copy to Clipboard"}
          </button>
        </div>

        {/* Distribution actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleQueuePost}
            disabled={!!queueAction}
            className="px-3 py-1.5 border border-zinc-800 text-zinc-600 text-[10px] font-mono rounded-sm hover:border-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40"
          >
            {queueDone === "queue" ? "✓ Queued" : "Queue Post"}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={!!queueAction}
            className="px-3 py-1.5 border border-zinc-800 text-zinc-600 text-[10px] font-mono rounded-sm hover:border-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-40"
          >
            {queueDone === "draft" ? "✓ Draft Saved" : "Save Draft"}
          </button>
        </div>

        {/* Compliance */}
        <p className="text-zinc-800 text-[9px] font-mono mt-3">
          Market intelligence only · Not financial advice
        </p>
      </div>
    </div>
  );
}
