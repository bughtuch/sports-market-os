"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { FeedEvent, FeedEventType, FeedSeverity } from "@/lib/realtime/feedTypes";
import { getFeedEngine } from "@/lib/realtime/feedEngine";

const MAX_EVENTS = 8;

// Only surface high-signal event types in the event stack
const SIGNIFICANT_TYPES = new Set<FeedEventType>([
  "volatility_spike",
  "liquidity_shift",
  "news_catalyst",
  "regime_change",
  "anomaly_detected",
  "signal_created",
]);

const TYPE_LABEL: Record<FeedEventType, string> = {
  signal_created:         "SIGNAL",
  signal_updated:         "UPDATE",
  volatility_spike:       "VOL",
  liquidity_shift:        "LIQ",
  news_catalyst:          "NEWS",
  regime_change:          "REGIME",
  anomaly_detected:       "ANOMALY",
  creator_share:          "CREATOR",
  ai_brief_generated:     "BRIEF",
  provider_status_change: "PROVIDER",
};

const SEV_DOT: Record<FeedSeverity, string> = {
  low:      "bg-zinc-600",
  medium:   "bg-amber-400",
  high:     "bg-orange-400",
  critical: "bg-red-400",
};

const SEV_TYPE_COLOR: Record<FeedSeverity, string> = {
  low:      "text-zinc-600 border-zinc-800/60",
  medium:   "text-amber-700 border-amber-900/40",
  high:     "text-orange-700 border-orange-900/40",
  critical: "text-red-600 border-red-900/40",
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const s = d.getUTCSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function EventStack() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [expanded, setExpanded] = useState(true);
  const newestId = useRef<string | null>(null);

  const onEvent = useCallback((event: FeedEvent) => {
    if (!SIGNIFICANT_TYPES.has(event.type)) return;
    newestId.current = event.id;
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  useEffect(() => {
    const engine = getFeedEngine();
    if (!engine) return;
    return engine.subscribe(onEvent);
  }, [onEvent]);

  return (
    <section className="border-b border-zinc-900/80">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-2 group"
      >
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Intelligence Event Stack
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-2">
          <span className="text-zinc-700 text-[8px] font-mono tabular-nums">
            {events.length}/{MAX_EVENTS}
          </span>
          {events.length > 0 && (
            <span className="w-1 h-1 rounded-full bg-amber-400 pulse-dot" />
          )}
          <span className="text-zinc-700 text-[9px] font-mono group-hover:text-zinc-500 transition-colors ml-1">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="pb-2">
          {events.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <span className="text-zinc-700 text-[9px] font-mono">
                Monitoring — events will appear as they occur
              </span>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900/60">
              {events.map((evt) => {
                const isNewest = evt.id === newestId.current;
                const typeColor = SEV_TYPE_COLOR[evt.severity];
                return (
                  <div
                    key={evt.id}
                    className={`px-4 py-2.5 flex items-start gap-3 ${isNewest ? "event-enter" : ""}`}
                  >
                    {/* Time */}
                    <span className="text-zinc-700 text-[8px] font-mono tabular-nums shrink-0 mt-0.5 w-14">
                      {formatTime(evt.timestamp)}
                    </span>

                    {/* Type badge */}
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-sm shrink-0 ${typeColor}`}
                    >
                      {TYPE_LABEL[evt.type]}
                    </span>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-300 text-[10px] leading-snug">
                        {evt.message}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-zinc-600 text-[8px] font-mono">
                          {evt.market}
                        </span>
                        <span className="text-zinc-700 text-[8px] font-mono">·</span>
                        <span className="text-zinc-600 text-[8px] font-mono">
                          {evt.source}
                        </span>
                      </div>
                    </div>

                    {/* Confidence + severity dot */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-zinc-600 text-[8px] font-mono tabular-nums">
                        {evt.confidence}%
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${SEV_DOT[evt.severity]} ${evt.severity === "critical" ? "pulse-dot" : ""}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
