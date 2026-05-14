"use client";

import { useState, useEffect, useCallback } from "react";
import type { NewsItem, DataMode } from "@/lib/providers/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentStyle = "x_post" | "shorts_hook" | "telegram";

interface GeneratedContent {
  style: ContentStyle;
  text: string;
}

// ─── Content generators ───────────────────────────────────────────────────────

function generateXPost(item: NewsItem): string {
  const tag = item.severity === "critical" || item.severity === "high"
    ? "⚡ MARKET ALERT"
    : "📊 MARKET INTELLIGENCE";

  return `${tag}

${item.headline}

${item.sport} · ${item.catalystType} · ${item.linkedMarket}

Market intelligence detected via AI analysis. ${item.impact.slice(0, 120)}${item.impact.length > 120 ? "…" : ""}

Not financial advice. AI-generated market intelligence only.
#SportsMarkets #${item.sport.replace(/\s+/g, "")} #MarketIntelligence`.trim();
}

function generateShortsHook(item: NewsItem): string {
  return `HOOK (0–3s):
"${item.sport} market just moved — here's what the data is showing."

CONTEXT (3–15s):
"${item.headline}. The AI terminal picked up ${item.catalystType.toLowerCase()} — ${item.impact.slice(0, 100)}…"

CTA (15–20s):
"Full analysis on the Sports Market OS terminal. Link in bio."

Caption: ${item.sport} market intelligence · ${item.catalystType} · AI analysis
Tags: #${item.sport.replace(/\s+/g, "")} #MarketIntelligence #SportsMarkets`.trim();
}

function generateTelegram(item: NewsItem): string {
  const emoji = item.severity === "critical" ? "🔴" : item.severity === "high" ? "🟠" : item.severity === "medium" ? "🟡" : "⚪";
  return `${emoji} *${item.sport.toUpperCase()} — ${item.catalystType.toUpperCase()}*

*${item.headline}*

Market: ${item.linkedMarket}
Source: ${item.source}
Time: ${item.timestamp}

${item.impact}

_Severity: ${item.severity.toUpperCase()} · AI-generated market intelligence only. Not financial advice._`.trim();
}

const STYLES: { id: ContentStyle; label: string; color: string }[] = [
  { id: "x_post",       label: "X Post",       color: "text-zinc-300" },
  { id: "shorts_hook",  label: "Shorts Hook",  color: "text-red-400" },
  { id: "telegram",     label: "Telegram",     color: "text-blue-400" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CatalystContentGenerator() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [activeStyle, setActiveStyle] = useState<ContentStyle>("x_post");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/live/news");
        if (res.ok) {
          const json = await res.json() as { items?: NewsItem[]; meta?: { mode?: DataMode } };
          const loaded = json.items ?? [];
          setItems(loaded);
          if (json.meta?.mode) setMode(json.meta.mode);
          if (loaded.length > 0) setSelectedItem(loaded[0]);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const getContent = useCallback((): GeneratedContent | null => {
    if (!selectedItem) return null;
    const generators: Record<ContentStyle, (item: NewsItem) => string> = {
      x_post:      generateXPost,
      shorts_hook: generateShortsHook,
      telegram:    generateTelegram,
    };
    return { style: activeStyle, text: generators[activeStyle](selectedItem) };
  }, [selectedItem, activeStyle]);

  async function handleCopy() {
    const content = getContent();
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }

  const content = getContent();

  const modeColors: Record<DataMode, string> = {
    simulation: "text-amber-600",
    hybrid:     "text-blue-500",
    live:       "text-emerald-500",
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-zinc-600 text-xs px-1">
        No catalysts available. Configure a news API key to load live catalysts.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left — catalyst list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            Select Catalyst
          </span>
          <span className={`text-[9px] font-mono uppercase ${modeColors[mode]}`}>
            {mode}
          </span>
        </div>

        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left px-3 py-2.5 rounded-sm border transition-colors ${
                  isSelected
                    ? "border-zinc-600 bg-zinc-900"
                    : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">{item.sport}</span>
                  <span className="text-[9px] font-mono text-zinc-700">{item.catalystType}</span>
                  {item.severity === "critical" && (
                    <span className="text-[8px] font-mono text-red-400 uppercase">CRIT</span>
                  )}
                  {item.severity === "high" && (
                    <span className="text-[8px] font-mono text-orange-400 uppercase">HIGH</span>
                  )}
                </div>
                <p className="text-white text-[10px] leading-snug line-clamp-2">{item.headline}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-zinc-700 text-[9px] font-mono">{item.source}</span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-700 hover:text-zinc-400 text-[9px] font-mono transition-colors"
                    >
                      Source →
                    </a>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — content output */}
      <div>
        {/* Style tabs */}
        <div className="flex items-center gap-1 mb-3">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStyle(s.id)}
              className={`text-[9px] font-mono px-3 py-1.5 border rounded-sm transition-colors ${
                activeStyle === s.id
                  ? `border-zinc-600 bg-zinc-900 ${s.color}`
                  : "border-zinc-800 text-zinc-600 hover:border-zinc-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Generated content */}
        {content ? (
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
            <pre className="text-zinc-300 text-[10px] leading-relaxed whitespace-pre-wrap font-mono mb-4 min-h-[160px]">
              {content.text}
            </pre>
            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3">
              <span className="text-zinc-700 text-[9px] font-mono tabular-nums">
                {content.text.length} chars
              </span>
              <button
                onClick={() => void handleCopy()}
                className="text-[9px] font-mono px-3 py-1.5 border border-zinc-700 rounded-sm hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 text-zinc-600 text-xs">
            Select a catalyst to generate content.
          </div>
        )}

        {/* Compliance note */}
        <p className="text-zinc-700 text-[9px] font-mono mt-3 leading-relaxed">
          All generated content uses market intelligence language only. No financial advice, picks, or gambling language.
        </p>
      </div>
    </div>
  );
}
