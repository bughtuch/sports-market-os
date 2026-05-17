"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export type SignalTag = "Free" | "Premium" | "Creator" | "API";

export interface SignalCardData {
  id?: string;
  sport: string;
  timestamp: string;
  title: string;
  description: string;
  confidence: number;
  tag: SignalTag;
  type: string;
  // Sprint 2
  movement?: string;
  direction?: "up" | "down" | "flat";
  aiScore?: number;
  exchange?: string;
  sparkData?: number[];
  // Sprint 3N
  source?: string;
  event_id?: string;
  event_title?: string;
  signal_type?: string;
  narrative?: string;
  polymarketSlug?: string;
}

const POLYMARKET_BUILDER_CODE = "sportsmarketos";

function buildPolymarketUrl(slug?: string): string {
  if (slug) return `https://polymarket.com/event/${slug}?ref=${POLYMARKET_BUILDER_CODE}`;
  return `https://polymarket.com?ref=${POLYMARKET_BUILDER_CODE}`;
}

function buildExportUrl(props: SignalCardData): string {
  const { sport, title, confidence, exchange, type, id } = props;
  return `/export-studio?sport=${encodeURIComponent(sport)}&title=${encodeURIComponent(title)}&confidence=${confidence}&exchange=${encodeURIComponent(exchange ?? "")}&type=${encodeURIComponent(type)}${id ? `&id=${encodeURIComponent(id)}` : ""}`;
}

// ── Sign-in prompt modal ───────────────────────────────────────────────────────

function SignInPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-[8px] p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
          Track Markets
        </p>
        <h3 className="text-white text-sm font-semibold mb-2">
          Sign in to track markets
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed mb-5">
          Build your watchlist, monitor live signals, and set confidence alerts
          on any market.
        </p>
        <div className="flex gap-3">
          <Link
            href="/signin"
            className="flex-1 text-center text-xs font-medium text-black bg-white px-4 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex-1 text-center text-xs font-medium text-zinc-300 border border-zinc-700 px-4 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
          >
            Sign up
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-[10px] font-mono text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          dismiss
        </button>
      </div>
    </div>
  );
}

// ── Signal card ────────────────────────────────────────────────────────────────

export default function SignalCard(props: SignalCardData) {
  const {
    id,
    sport,
    timestamp,
    title,
    description,
    confidence,
    type,
    exchange,
    source,
    event_id,
    event_title,
    signal_type,
    narrative,
    polymarketSlug,
  } = props;

  const [tracked, setTracked]         = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [copyState, setCopyState]     = useState<"idle" | "copied">("idle");
  const [showSignIn, setShowSignIn]   = useState(false);

  // Check if already tracked when event_id is known
  useEffect(() => {
    if (!event_id) return;
    void (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("user_watchlists")
          .select("id")
          .eq("event_id", event_id)
          .maybeSingle();
        setTracked(!!data);
      } catch {
        // non-fatal — leave default untracked state
      }
    })();
  }, [event_id]);

  // ── Derived values ───────────────────────────────────────────────────────────

  const venue = sport.toUpperCase();
  const header = [venue, type.toUpperCase(), exchange?.toUpperCase()]
    .filter(Boolean)
    .join(" · ");

  const isPolymarket =
    source === "polymarket" ||
    exchange?.toLowerCase() === "polymarket";

  const polymarketUrl = buildPolymarketUrl(polymarketSlug);

  if (isPolymarket && !polymarketSlug) {
    console.warn("[SignalCard] No Polymarket slug available for signal", id);
  }

  const exportUrl = buildExportUrl(props);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleTrack() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setShowSignIn(true);
        return;
      }

      setTrackLoading(true);

      if (tracked) {
        await fetch("/api/watchlist/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id }),
        });
        setTracked(false);
        track("watchlist_remove", { signal_id: id ?? "", sport });
      } else {
        await fetch("/api/watchlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id:    event_id ?? id ?? "",
            event_title: event_title ?? title,
            sport,
            source:      source ?? "unknown",
          }),
        });
        setTracked(true);
        track("watchlist_add", { signal_id: id ?? "", sport });
      }
    } catch {
      // non-fatal
    } finally {
      setTrackLoading(false);
    }
  }

  async function handleCopy() {
    const fullUrl = `https://sportsmarketos.com${exportUrl}`;
    const shareText = [
      title,
      "",
      narrative ?? description,
      "",
      "See more sports market intelligence at sportsmarketos.com",
      "",
      fullUrl,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = shareText;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopyState("copied");
    track("share_copy", { signal_id: id ?? "", sport });
    setTimeout(() => setCopyState("idle"), 2000);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {showSignIn && <SignInPromptModal onClose={() => setShowSignIn(false)} />}

      <div className="group bg-zinc-950 border border-zinc-900 rounded-[8px] p-4 hover:border-zinc-800 transition-[border-color] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]">
        {/* Header row — venue/type/exchange left, timestamp right */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest leading-none">
            {header}
          </span>
          <span className="text-zinc-700 text-[9px] font-mono tabular-nums shrink-0">
            {timestamp}
          </span>
        </div>

        {/* Signal text */}
        <p className="text-white text-xs font-semibold leading-snug mb-1.5">
          {title}
        </p>
        <p className="text-zinc-400 text-[11px] leading-relaxed mb-4">
          {description}
        </p>

        {/* Confidence bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-zinc-900 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full"
              style={{ width: `${confidence}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-semibold tabular-nums shrink-0"
            style={{ color: "var(--accent)" }}
          >
            {confidence}%
          </span>
        </div>

        {/* Action row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-0">
          {/* evidence */}
          <Link
            href={exportUrl}
            className="inline-flex items-center min-h-[44px] text-[9px] font-mono hover:underline transition-colors"
            style={{ color: "var(--accent)" }}
            onClick={() => track("export_studio_open", { signal_id: id ?? "" })}
          >
            evidence →
          </Link>

          {/* polymarket deeplink */}
          {isPolymarket && (
            <>
              <span className="text-zinc-800 text-[9px] select-none">·</span>
              <a
                href={polymarketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] text-[9px] font-mono hover:underline transition-colors"
                style={{ color: "var(--accent)" }}
                onClick={() =>
                  track("polymarket_click", {
                    signal_id:   id ?? "",
                    sport,
                    signal_type: signal_type ?? type,
                    confidence,
                  })
                }
              >
                view on polymarket →
              </a>
            </>
          )}

          {/* track */}
          <span className="text-zinc-800 text-[9px] select-none">·</span>
          <button
            onClick={() => void handleTrack()}
            disabled={trackLoading}
            className="inline-flex items-center min-h-[44px] text-[9px] font-mono transition-colors disabled:opacity-50"
            style={tracked ? { color: "var(--accent)" } : undefined}
          >
            <span className={tracked ? "" : "text-zinc-500 hover:text-zinc-300"}>
              {trackLoading ? "..." : tracked ? "✓ tracking" : "+ track"}
            </span>
          </button>

          {/* copy */}
          <span className="text-zinc-800 text-[9px] select-none">·</span>
          <button
            onClick={() => void handleCopy()}
            className="inline-flex items-center min-h-[44px] text-[9px] font-mono transition-colors"
            style={copyState === "copied" ? { color: "var(--accent)" } : undefined}
          >
            <span className={copyState === "copied" ? "" : "text-zinc-500 hover:text-zinc-300"}>
              {copyState === "copied" ? "✓ copied" : "copy →"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
