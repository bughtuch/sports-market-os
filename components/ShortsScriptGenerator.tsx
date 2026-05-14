"use client";

import { useState } from "react";

// ─── Script topics ────────────────────────────────────────────────────────────

type TopicKey =
  | "market_heat"
  | "volatility_spike"
  | "ai_narrative"
  | "news_catalyst"
  | "terminal_walkthrough";

const TOPICS: { id: TopicKey; label: string; accentClass: string }[] = [
  { id: "market_heat",          label: "Market Heat Event",         accentClass: "text-red-400" },
  { id: "volatility_spike",     label: "Volatility Spike",          accentClass: "text-amber-400" },
  { id: "ai_narrative",         label: "AI Narrative Breakdown",    accentClass: "text-blue-400" },
  { id: "news_catalyst",        label: "News Catalyst Alert",       accentClass: "text-orange-400" },
  { id: "terminal_walkthrough", label: "Terminal Walkthrough",      accentClass: "text-purple-400" },
];

// ─── Script definitions ───────────────────────────────────────────────────────

interface ScriptSection {
  label: string;
  direction?: string;
  content: string;
}

interface Script {
  title: string;
  duration: string;
  caption: string;
  cta: string;
  sections: ScriptSection[];
}

const SCRIPTS: Record<TopicKey, Script> = {
  market_heat: {
    title: "Market Heat — Ascot 2:40 Liquidity Shift",
    duration: "45–55 seconds",
    caption:
      "Our AI just detected a major liquidity shift at Ascot 2:40. This is what the market structure looks like right now. #HorseRacing #MarketIntelligence #SportsTrade",
    cta: "Follow for live market intelligence. Free terminal at sportsmarketos.com.",
    sections: [
      {
        label: "Hook (0–5s)",
        direction: "Open on terminal heatmap — zoom into Ascot 2:40 cell, red glow",
        content:
          "This is what a liquidity shift looks like before the market moves.",
      },
      {
        label: "Context (5–18s)",
        direction: "Scroll through MarketHeatPanel — show multiple sport cells",
        content:
          "Sports Market OS tracks live exchange order flow across seven sports. Right now, our AI is flagging an unusual pattern at Ascot 2:40 — late liquidity entering without matching public movement.",
      },
      {
        label: "Signal breakdown (18–38s)",
        direction: "Cut to LiveSignalFeed — zoom into the Ascot card, highlight confidence bar at 87%",
        content:
          "AI confidence: 87%. The signal type is Sharp Money. Exchange: Betfair. The queue structure is deteriorating on the lay side — this is a structural market intelligence observation, not a tip. Our AI tracks the shape of market activity, not the outcome.",
      },
      {
        label: "Demo (38–50s)",
        direction: "Open Creator Studio → Signal Card Generator → select Horse Racing → export PNG",
        content:
          "You can export this signal as a branded card — free to share on X, Telegram, or Discord. Every card carries the Sports Market OS watermark.",
      },
      {
        label: "CTA (50–55s)",
        direction: "Return to terminal overview — wide shot",
        content:
          "Free access at sportsmarketos.com. Follow for daily market intelligence.",
      },
    ],
  },
  volatility_spike: {
    title: "Volatility Spike — Tennis Compression Event",
    duration: "40–50 seconds",
    caption:
      "AI detected volatility compression in the Djokovic market. Three cycles without a catalyst — this is what the data looks like. #Tennis #MarketIntelligence #AITrading",
    cta: "Live terminal at sportsmarketos.com. Free access.",
    sections: [
      {
        label: "Hook (0–5s)",
        direction: "Open AIVolatilityPanel — show IV compression readout",
        content:
          "When price stops moving despite high volume, something is usually about to break.",
      },
      {
        label: "Context (5–15s)",
        direction: "Scroll to Tennis section of the terminal",
        content:
          "Sports Market OS is tracking a volatility compression event in the Djokovic market. Three consecutive compression cycles without a price catalyst. Historically, this pattern precedes a directional expansion.",
      },
      {
        label: "AI analysis (15–35s)",
        direction: "Show AIVolatilityPanel in detail — highlight regime and anomaly score",
        content:
          "Our volatility engine is showing implied volatility down 18.4% from session open. Matched volume is 34% above the 20-day average. This is not normal market structure. The AI regime classification: compression.",
      },
      {
        label: "Signal card (35–45s)",
        direction: "Open the Tennis signal card in Creator Studio",
        content:
          "Every signal generates a shareable card you can export and distribute to your audience. Analytics only — no predictions, no tips.",
      },
      {
        label: "CTA (45–50s)",
        direction: "Terminal overview — fade to watermark",
        content: "Market intelligence, free. sportsmarketos.com.",
      },
    ],
  },
  ai_narrative: {
    title: "What Our AI Says About Today's Markets",
    duration: "35–45 seconds",
    caption:
      "We built an AI engine that reads live market structure across 7 sports. Here's what it's flagging today. #AI #MarketIntelligence #SportsTech",
    cta: "Read the full AI brief at sportsmarketos.com. Free terminal access.",
    sections: [
      {
        label: "Hook (0–5s)",
        direction: "Open AINarrativePanel — scroll slowly",
        content:
          "This is a live AI narrative, written by our market cognition engine in real time.",
      },
      {
        label: "AI walkthrough (5–25s)",
        direction: "Scroll through AINarrativePanel, AIBriefPanel, and AIRegimePanel",
        content:
          "Sports Market OS runs six AI engines simultaneously — narrator, liquidity interpreter, volatility analyser, opportunity scanner, behavioural intelligence, and the regime classifier. Right now the global regime is: volatile. That means faster pulse rates, higher signal density, and wider structural spreads across the book.",
      },
      {
        label: "Live signal (25–38s)",
        direction: "Show the AIOpportunityScanner — zoom into first opportunity card",
        content:
          "The opportunity scanner is flagging three markets right now. Each one has an AI confidence score and a structural explanation. No picks. No tips. Pure market structure analysis.",
      },
      {
        label: "CTA (38–45s)",
        direction: "Pull back to full terminal view",
        content: "Free access. sportsmarketos.com.",
      },
    ],
  },
  news_catalyst: {
    title: "Breaking: Weight Cut Rumour Hits the Exchange",
    duration: "30–40 seconds",
    caption:
      "Our AI flagged a news catalyst before it hit mainstream sports media. Here's what the market structure looked like. #UFC #MarketIntelligence #AIAlert",
    cta: "Live catalyst feed at sportsmarketos.com.",
    sections: [
      {
        label: "Hook (0–4s)",
        direction: "Show NewsCatalystFeed — timestamp on the UFC alert",
        content:
          "Our AI flagged this 14 minutes before it broke on sports media.",
      },
      {
        label: "Signal breakdown (4–22s)",
        direction: "Show the UFC signal card — highlight price movement and confidence",
        content:
          "Sports Market OS detected unusual price movement in the Poirier market on Betfair. Underdog price shortening without matching public volume — AI confidence 65%. The behavioural engine classified this as informed money responding to non-public information.",
      },
      {
        label: "Catalyst context (22–34s)",
        direction: "Show NewsCatalystFeed and OddsMovementFeed side by side",
        content:
          "This is the news catalyst feed alongside the odds movement tracker. You can see the structural change in the market before the story broke publicly. This is not prediction. This is market structure observation.",
      },
      {
        label: "CTA (34–40s)",
        direction: "Return to terminal overview",
        content: "Live feeds. Free access. sportsmarketos.com.",
      },
    ],
  },
  terminal_walkthrough: {
    title: "Inside the Sports Market OS Terminal",
    duration: "55–60 seconds",
    caption:
      "We built a Bloomberg-style market intelligence terminal for sports. Here's a full walkthrough. #SportsTech #MarketIntelligence #Bloomberg",
    cta: "Free access at sportsmarketos.com. No card required.",
    sections: [
      {
        label: "Hook (0–5s)",
        direction: "Open terminal full-screen — zoom out for dramatic effect",
        content:
          "This is a Bloomberg-style terminal for sports market intelligence. And it's free.",
      },
      {
        label: "Market Pulse (5–18s)",
        direction: "Scroll through pulse cards — highlight the animated sparklines",
        content:
          "The global market pulse shows the six hottest markets right now — volatility spikes, liquidity shifts, and sharp money movement across Horse Racing, Tennis, NBA, NFL, UFC, and Prediction Markets.",
      },
      {
        label: "AI Engine (18–35s)",
        direction: "Scroll down to AI sections — show regime, narrative, and opportunity scanner",
        content:
          "Six AI engines run continuously. The regime classifier sets the pulse rate. The narrator writes live market commentary. The opportunity scanner surfaces structural anomalies. No gambling language. No tips. Pure market intelligence.",
      },
      {
        label: "Creator Tools (35–50s)",
        direction: "Open Creator Studio — show signal card generator, select Horse Racing, export",
        content:
          "Every signal can be exported as a branded share card. Creators distribute these across X, Telegram, and Discord. The watermark grows the network — every share points back to Sports Market OS.",
      },
      {
        label: "CTA (50–60s)",
        direction: "Back to terminal overview — show full layout",
        content:
          "Free access. No credit card. Built by traders, for the market intelligence community. sportsmarketos.com.",
      },
    ],
  },
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
      className="text-[9px] font-mono px-2 py-1 border border-zinc-800 rounded-sm text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShortsScriptGenerator() {
  const [topicId, setTopicId] = useState<TopicKey>("terminal_walkthrough");
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const script = SCRIPTS[topicId];

  const fullScript = script.sections.map((s) => `[${s.label}]\n${s.content}`).join("\n\n");

  return (
    <div className="space-y-4">
      {/* Topic selector */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopicId(t.id)}
            className={`text-[10px] font-mono px-3 py-1.5 rounded-sm border transition-colors ${
              topicId === t.id
                ? `border-zinc-600 bg-zinc-800/60 ${t.accentClass}`
                : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Script metadata */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3 flex items-center gap-6 flex-wrap">
        <div>
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Duration</span>
          <p className={`text-[11px] font-mono mt-0.5 ${topic.accentClass}`}>{script.duration}</p>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Title</span>
          <p className="text-zinc-300 text-[11px] font-mono mt-0.5 truncate">{script.title}</p>
        </div>
        <CopyButton text={fullScript} />
      </div>

      {/* Script sections */}
      <div className="space-y-2">
        {script.sections.map((section) => (
          <div
            key={section.label}
            className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-zinc-900/60 flex items-center gap-3">
              <span className={`text-[9px] font-mono uppercase tracking-widest ${topic.accentClass}`}>
                {section.label}
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {section.direction && (
                <div className="flex items-start gap-2">
                  <span className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider shrink-0 mt-0.5 w-16">
                    Camera
                  </span>
                  <p className="text-zinc-600 text-[10px] leading-relaxed italic">
                    {section.direction}
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider shrink-0 mt-0.5 w-16">
                  Voice
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Caption + CTA */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-900/60 flex items-center justify-between">
            <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">Caption</span>
            <CopyButton text={script.caption} />
          </div>
          <p className="px-4 py-3 text-zinc-400 text-[10px] leading-relaxed">{script.caption}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-900/60 flex items-center justify-between">
            <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">CTA</span>
            <CopyButton text={script.cta} />
          </div>
          <p className="px-4 py-3 text-zinc-400 text-[10px] leading-relaxed">{script.cta}</p>
        </div>
      </div>
    </div>
  );
}
