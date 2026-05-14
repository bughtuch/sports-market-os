"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "X / Twitter" | "Telegram" | "YouTube" | "Discord" | "Newsletter";
type Status   = "to_contact" | "contacted" | "in_discussion" | "partner";

interface CreatorLead {
  id: string;
  name: string;
  platform: Platform;
  audience: string;
  niche: string;
  status: Status;
  suggestedAngle: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const LEADS: CreatorLead[] = [
  {
    id: "1",
    name: "@SharpMoneyHR",
    platform: "X / Twitter",
    audience: "42K",
    niche: "Horse Racing Trading",
    status: "to_contact",
    suggestedAngle:
      "Betfair queue analysis — show them the Ascot signal card as an example of what our AI produces.",
  },
  {
    id: "2",
    name: "Racing Intelligence Telegram",
    platform: "Telegram",
    audience: "28K subscribers",
    niche: "UK Horse Racing Tips Channel",
    status: "contacted",
    suggestedAngle:
      "Frame as a free intelligence layer they can distribute. Their audience gets signals, we get distribution.",
  },
  {
    id: "3",
    name: "@TennisTradingTV",
    platform: "YouTube",
    audience: "84K subscribers",
    niche: "In-Play Tennis Trading",
    status: "in_discussion",
    suggestedAngle:
      "Shorts content opportunity — volatility compression events make ideal 40-second scripts with live terminal footage.",
  },
  {
    id: "4",
    name: "Sharp Money Discord",
    platform: "Discord",
    audience: "12K members",
    niche: "Sports Betting Analytics",
    status: "partner",
    suggestedAngle:
      "Already onboarded. Auto-distribute daily signal cards to #market-intelligence channel.",
  },
  {
    id: "5",
    name: "@ExchangeEdge",
    platform: "X / Twitter",
    audience: "19K",
    niche: "Betfair Trading Strategies",
    status: "to_contact",
    suggestedAngle:
      "Lead with the market heat panel and queue health signals — directly relevant to their Betfair trading audience.",
  },
  {
    id: "6",
    name: "The Sharp Report",
    platform: "Newsletter",
    audience: "22K subscribers",
    niche: "Sports Market Analysis",
    status: "contacted",
    suggestedAngle:
      "Provide weekly AI Market Brief as a ready-made newsletter section. Branded with their handle + SMOS watermark.",
  },
  {
    id: "7",
    name: "@PredictionTrader",
    platform: "X / Twitter",
    audience: "31K",
    niche: "Polymarket & Prediction Markets",
    status: "to_contact",
    suggestedAngle:
      "Election contract and prediction market signals — show the volume surge detection and pricing divergence analytics.",
  },
  {
    id: "8",
    name: "UFC Liquidity Watch",
    platform: "Telegram",
    audience: "8K subscribers",
    niche: "UFC Exchange Markets",
    status: "in_discussion",
    suggestedAngle:
      "Late money signals specifically — the informed money pattern detection is highly relevant to their methodology.",
  },
  {
    id: "9",
    name: "@NFLSharpReport",
    platform: "X / Twitter",
    audience: "56K",
    niche: "NFL Line Movement",
    status: "to_contact",
    suggestedAngle:
      "Totals implied volatility compression and line movement tracking — directly maps to their content niche.",
  },
  {
    id: "10",
    name: "Basketball Intelligence",
    platform: "YouTube",
    audience: "27K subscribers",
    niche: "NBA Market Analysis",
    status: "to_contact",
    suggestedAngle:
      "NBA pace regression and AI market thesis content — offer a Shorts script built around their game coverage.",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; border: string }
> = {
  to_contact:    { label: "To Contact",    color: "text-zinc-400",   bg: "bg-zinc-800/60",   border: "border-zinc-700" },
  contacted:     { label: "Contacted",     color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  in_discussion: { label: "In Discussion", color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  partner:       { label: "Partner",       color: "text-emerald-400",bg: "bg-emerald-400/10",border: "border-emerald-400/20" },
};

const PLATFORM_COLORS: Record<Platform, string> = {
  "X / Twitter": "text-zinc-300",
  Telegram:      "text-blue-400",
  YouTube:       "text-red-400",
  Discord:       "text-purple-400",
  Newsletter:    "text-amber-400",
};

// ─── Message templates ────────────────────────────────────────────────────────

const TEMPLATES = {
  x_dm: (name: string) =>
    `Hi ${name},\n\nWe built a free Bloomberg-style sports market intelligence terminal — live exchange signals, AI narratives, volatility detection across 7 sports.\n\nEvery signal generates a branded share card you can distribute to your audience. No tips, no picks — pure market structure analysis.\n\nThought it might be useful for your content. Happy to send you access.\n\nsportsmarketos.com`,

  email: (name: string) =>
    `Subject: Free market intelligence infrastructure for ${name}\n\nHi,\n\nWe've built Sports Market OS — a Bloomberg-style terminal for sports market intelligence. It tracks live exchange order flow, AI narratives, volatility events, and liquidity shifts across Horse Racing, Tennis, NBA, NFL, UFC, Football, and Prediction Markets.\n\nFor creators:\n- Every signal generates a watermarked share card\n- Free to distribute to your audience\n- The card links back to SMOS — it's a growth engine for both of us\n\nNo gambling claims. No picks. Pure market structure intelligence.\n\nInterested in taking a look?\n\nsportsmarketos.com`,

  telegram: (name: string) =>
    `Hi ${name} — we built a free sports market intelligence terminal. Live exchange signals, AI analysis, volatility detection across 7 sports. Every signal generates a shareable card for your channel. Market intelligence only — no tips or picks. Worth a look? sportsmarketos.com`,
};

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      onClick={copy}
      className="text-[9px] font-mono px-2 py-1 border border-zinc-800 rounded-sm text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors shrink-0"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type FilterStatus = "all" | Status;

export default function CreatorOutreachQueue() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState<"x_dm" | "email" | "telegram">("x_dm");

  const filtered = filter === "all" ? LEADS : LEADS.filter((l) => l.status === filter);
  const selectedLead = LEADS.find((l) => l.id === selected) ?? null;

  const templateText = selectedLead
    ? TEMPLATES[templateType](selectedLead.name)
    : "";

  const counts: Record<FilterStatus, number> = {
    all:           LEADS.length,
    to_contact:    LEADS.filter((l) => l.status === "to_contact").length,
    contacted:     LEADS.filter((l) => l.status === "contacted").length,
    in_discussion: LEADS.filter((l) => l.status === "in_discussion").length,
    partner:       LEADS.filter((l) => l.status === "partner").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {(["all", "to_contact", "contacted", "in_discussion", "partner"] as FilterStatus[]).map((f) => {
          const label = f === "all" ? "All" : STATUS_CONFIG[f as Status].label;
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[9px] font-mono px-3 py-1.5 rounded-sm border transition-colors ${
                isActive
                  ? "border-zinc-600 bg-zinc-800/60 text-white"
                  : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              {label}
              <span className="ml-1.5 tabular-nums text-zinc-700">{counts[f]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Lead list */}
        <div className="space-y-2">
          {filtered.map((lead) => {
            const sc = STATUS_CONFIG[lead.status];
            const pc = PLATFORM_COLORS[lead.platform];
            const isSelected = selected === lead.id;
            return (
              <button
                key={lead.id}
                onClick={() => setSelected(isSelected ? null : lead.id)}
                className={`w-full text-left bg-zinc-950 border rounded-sm p-4 transition-all ${
                  isSelected
                    ? "border-zinc-600 bg-zinc-900/40"
                    : "border-zinc-800/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-zinc-200 text-[11px] font-mono font-semibold truncate">{lead.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-mono ${pc}`}>{lead.platform}</span>
                      <span className="text-zinc-800 text-[8px]">·</span>
                      <span className="text-zinc-600 text-[9px] font-mono">{lead.audience}</span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[8px] font-mono px-1.5 py-0.5 border rounded-sm ${sc.color} ${sc.bg} ${sc.border}`}
                  >
                    {sc.label}
                  </span>
                </div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider mb-1">
                  {lead.niche}
                </p>
                {isSelected && (
                  <p className="text-zinc-500 text-[10px] leading-relaxed mt-2 pt-2 border-t border-zinc-800/60">
                    Angle: {lead.suggestedAngle}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Message template */}
        <div>
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden sticky top-4">
            <div className="px-4 py-3 border-b border-zinc-900/60">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                Outreach Template
              </p>
              <div className="flex gap-2">
                {(["x_dm", "email", "telegram"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplateType(t)}
                    className={`text-[9px] font-mono px-2 py-1 rounded-sm border transition-colors ${
                      templateType === t
                        ? "border-zinc-600 bg-zinc-800/60 text-white"
                        : "border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {t === "x_dm" ? "X DM" : t === "email" ? "Email" : "Telegram"}
                  </button>
                ))}
              </div>
            </div>

            {selectedLead ? (
              <>
                <div className="px-4 py-3 border-b border-zinc-900/60 bg-zinc-950/60 flex items-center justify-between">
                  <span className="text-zinc-400 text-[10px] font-mono">{selectedLead.name}</span>
                  <CopyButton text={templateText} />
                </div>
                <pre className="px-4 py-4 text-zinc-400 text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                  {templateText}
                </pre>
              </>
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">
                  Select a lead
                </p>
                <p className="text-zinc-800 text-[9px] font-mono">
                  Click a creator above to generate an outreach message
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
