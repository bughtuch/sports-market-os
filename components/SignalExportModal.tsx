"use client";

import { useRef, useState, useEffect } from "react";
import PostGenerator from "@/components/PostGenerator";

export interface ExportSignalData {
  sport: string;
  market: string;
  signalType: string;
  confidence: number;
  movement: string;
  direction: "up" | "down" | "flat";
  insight: string;
  exchange: string;
  timestamp: string;
  accentHex: string;
  accentClass: string;
}

interface Props {
  signal: ExportSignalData;
  onClose: () => void;
}

type Tab = "export" | "post";

// ─── Export card (DOM target for html-to-image) ───────────────────────────────

function ExportCard({ signal }: { signal: ExportSignalData }) {
  const dirColor =
    signal.direction === "up"
      ? "#10b981"
      : signal.direction === "down"
      ? "#ef4444"
      : "#71717a";
  const dirArrow = signal.direction === "up" ? "↑" : signal.direction === "down" ? "↓" : "→";

  return (
    <div
      style={{
        backgroundColor: "#000",
        borderLeft: `3px solid ${signal.accentHex}`,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        width: 480,
        padding: "24px 24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: signal.accentHex, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {signal.sport} · {signal.exchange}
          </div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.3, maxWidth: 320 }}>
            {signal.market}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ color: dirColor, fontSize: 18, fontWeight: 700 }}>
            {dirArrow} {signal.movement}
          </div>
          <div style={{ color: "#52525b", fontSize: 9, marginTop: 2 }}>{signal.timestamp}</div>
        </div>
      </div>

      {/* Signal type badge */}
      <div style={{ marginBottom: 12 }}>
        <span style={{
          color: signal.accentHex,
          border: `1px solid ${signal.accentHex}40`,
          backgroundColor: `${signal.accentHex}10`,
          fontSize: 8,
          padding: "2px 6px",
          borderRadius: 2,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          {signal.signalType}
        </span>
      </div>

      {/* Insight */}
      <p style={{ color: "#a1a1aa", fontSize: 11, lineHeight: 1.6, marginBottom: 16 }}>
        {signal.insight}
      </p>

      {/* Confidence */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          AI Confidence
        </div>
        <div style={{ flex: 1, height: 2, backgroundColor: "#27272a", borderRadius: 1 }}>
          <div style={{ width: `${signal.confidence}%`, height: "100%", backgroundColor: signal.accentHex, borderRadius: 1 }} />
        </div>
        <div style={{ color: signal.accentHex, fontSize: 11, fontWeight: 700 }}>
          {signal.confidence}%
        </div>
      </div>

      {/* Watermark */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #18181b" }}>
        <span style={{ color: "#3f3f46", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Sports Market OS
        </span>
        <span style={{ color: "#3f3f46", fontSize: 9 }}>
          sportsmarketos.com
        </span>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function SignalExportModal({ signal, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("export");
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  async function exportPNG() {
    if (!cardRef.current) return;
    setStatus("working");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `smos-signal-${Date.now()}.png`;
      a.click();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  async function copyImage() {
    if (!cardRef.current) return;
    setStatus("working");
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // Clipboard API not supported — fall back to download
      await exportPNG();
    }
  }

  async function copyText() {
    const text = `${signal.signalType} — ${signal.market}\n\n${signal.insight}\n\nAI Confidence: ${signal.confidence}%\nSports Market OS · sportsmarketos.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const statusLabel = status === "working" ? "Working…" : status === "done" ? "Done ✓" : status === "error" ? "Error" : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800/80 rounded-sm shadow-2xl">

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-zinc-300 text-[11px] font-semibold">Export Signal</span>
            <div className="flex items-center gap-1">
              {(["export", "post"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-colors ${
                    tab === t
                      ? "text-white border-zinc-600 bg-zinc-800"
                      : "text-zinc-600 border-transparent hover:text-zinc-400"
                  }`}
                >
                  {t === "export" ? "PNG / Image" : "Post Generator"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-400 text-sm font-mono transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {tab === "export" ? (
            <div className="space-y-4">
              {/* Card preview */}
              <div className="overflow-hidden rounded-sm border border-zinc-800/60">
                <div ref={cardRef}>
                  <ExportCard signal={signal} />
                </div>
              </div>

              {/* Export actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={exportPNG}
                  disabled={status === "working"}
                  className="text-[11px] font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {statusLabel ?? "Export PNG"}
                </button>
                <button
                  onClick={copyImage}
                  disabled={status === "working"}
                  className="text-[11px] font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  Copy image
                </button>
                <button
                  onClick={copyText}
                  className="text-[11px] font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  {copied ? "Copied ✓" : "Copy text"}
                </button>
              </div>
            </div>
          ) : (
            <PostGenerator
              market={signal.market}
              sport={signal.sport}
              signalType={signal.signalType}
              confidence={signal.confidence}
              insight={signal.insight}
              movement={signal.movement}
            />
          )}
        </div>
      </div>
    </div>
  );
}
