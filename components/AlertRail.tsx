"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { FeedEvent, FeedSeverity } from "@/lib/realtime/feedTypes";
import { getFeedEngine } from "@/lib/realtime/feedEngine";

const MAX_EVENTS = 12;

const SEV_CONFIG: Record<
  FeedSeverity,
  { dot: string; pulse: boolean; text: string; badge: string; label: string }
> = {
  low:      { dot: "bg-zinc-600",   pulse: false, text: "text-zinc-400",   badge: "text-zinc-600 border-zinc-800/60",    label: "LOW"  },
  medium:   { dot: "bg-amber-400",  pulse: false, text: "text-amber-400",  badge: "text-amber-900 border-amber-900/40",  label: "MED"  },
  high:     { dot: "bg-orange-400", pulse: false, text: "text-orange-400", badge: "text-orange-900 border-orange-900/40",label: "HIGH" },
  critical: { dot: "bg-red-400",    pulse: true,  text: "text-red-400",    badge: "text-red-900 border-red-900/40",      label: "CRIT" },
};

function formatAge(ts: number, now: number): string {
  const secs = Math.floor((now - ts) / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  return `${mins}m`;
}

export default function AlertRail() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const newestId = useRef<string | null>(null);

  const onEvent = useCallback((event: FeedEvent) => {
    newestId.current = event.id;
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  useEffect(() => {
    const engine = getFeedEngine();
    if (!engine) return;
    return engine.subscribe(onEvent);
  }, [onEvent]);

  // Refresh ages every 15 s
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="shrink-0 border-b border-zinc-800/60">
      {/* Rail header */}
      <div className="px-3 py-2 flex items-center gap-2 bg-zinc-950/80">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 pulse-dot shrink-0" />
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex-1">
          Active Alerts
        </span>
        <span className="text-zinc-700 text-[8px] font-mono tabular-nums">
          {events.length}
        </span>
      </div>

      {/* Event list */}
      <div className="overflow-y-auto" style={{ maxHeight: "270px" }}>
        {events.length === 0 ? (
          <div className="px-3 py-6 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-1 h-1 rounded-full bg-zinc-700 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-zinc-800 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-1 h-1 rounded-full bg-zinc-700 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">
              Feed initialising
            </p>
            <p className="text-zinc-800 text-[8px] font-mono leading-relaxed">
              Market events will appear as they are detected
            </p>
          </div>
        ) : (
          events.map((evt) => {
            const cfg = SEV_CONFIG[evt.severity];
            const isNewest = evt.id === newestId.current;
            return (
              <div
                key={evt.id}
                className={`px-3 py-2 border-b border-zinc-900/40 last:border-0 ${isNewest ? "event-enter" : ""}`}
              >
                <div className="flex items-start gap-1.5">
                  <span
                    className={`w-1 h-1 rounded-full shrink-0 mt-1.5 ${cfg.dot} ${cfg.pulse ? "pulse-dot" : ""}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[9px] font-mono leading-snug ${cfg.text}`}>
                      {evt.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span
                        className={`text-[8px] font-mono px-1 py-px border rounded-sm shrink-0 ${cfg.badge}`}
                      >
                        {evt.sport}
                      </span>
                      <span className="text-zinc-700 text-[8px] font-mono tabular-nums">
                        {formatAge(evt.timestamp, now)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
