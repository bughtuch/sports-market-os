"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "x_post" | "shorts" | "telegram" | "newsletter" | "roundup" | "spotlight";
type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface CalendarItem {
  time: string;
  type: ContentType;
  title: string;
  description: string;
  sport?: string;
  status: "scheduled" | "draft" | "published";
}

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ContentType, { label: string; color: string; bg: string; border: string }> = {
  x_post:     { label: "X Post",      color: "text-zinc-300",   bg: "bg-zinc-800/60",   border: "border-zinc-700" },
  shorts:     { label: "Short",        color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
  telegram:   { label: "Telegram",     color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  newsletter: { label: "Newsletter",   color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  roundup:    { label: "Roundup",      color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  spotlight:  { label: "Spotlight",    color: "text-emerald-400",bg: "bg-emerald-400/10",border: "border-emerald-400/20" },
};

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", color: "text-zinc-500" },
  draft:     { label: "Draft",     color: "text-amber-500" },
  published: { label: "Published", color: "text-emerald-500" },
};

// ─── Calendar data ────────────────────────────────────────────────────────────

const CALENDAR: Record<DayKey, CalendarItem[]> = {
  Mon: [
    {
      time: "07:30",
      type: "x_post",
      title: "Morning Market Pulse",
      description: "Institutional X post: overnight market structure shifts, AI regime classification, top 3 markets to watch.",
      sport: "Horse Racing",
      status: "scheduled",
    },
    {
      time: "12:00",
      type: "telegram",
      title: "Midday Signal Broadcast",
      description: "Standard Telegram broadcast for the top live signal. AI confidence, movement, and market page link.",
      sport: "Tennis",
      status: "scheduled",
    },
    {
      time: "18:00",
      type: "x_post",
      title: "Evening AI Brief",
      description: "Technical trader post: volatility regime summary, liquidity shift highlights, three-line format.",
      status: "scheduled",
    },
  ],
  Tue: [
    {
      time: "08:00",
      type: "shorts",
      title: "Volatility Spike Short",
      description: "40-second terminal walkthrough — focus on the AIVolatilityPanel during an active compression event.",
      sport: "Tennis",
      status: "draft",
    },
    {
      time: "12:30",
      type: "telegram",
      title: "NBA Market Thesis Broadcast",
      description: "Deep dive broadcast for the NBA signal. Pace regression data, AI confidence, structural note.",
      sport: "NBA",
      status: "scheduled",
    },
    {
      time: "20:00",
      type: "x_post",
      title: "Creator Signal Card",
      description: "Creator/viral post with attached signal card export. Horse Racing focus — Betfair queue analysis.",
      sport: "Horse Racing",
      status: "draft",
    },
  ],
  Wed: [
    {
      time: "07:30",
      type: "x_post",
      title: "Morning Market Pulse",
      description: "Wednesday mid-week market structure review. NFL totals compression and prediction market divergence.",
      sport: "NFL",
      status: "scheduled",
    },
    {
      time: "11:00",
      type: "shorts",
      title: "AI Narrative Breakdown",
      description: "35-second walkthrough of the AINarrativePanel. Show how the AI writes live market commentary.",
      status: "draft",
    },
    {
      time: "19:00",
      type: "telegram",
      title: "Midweek Volatility Watch",
      description: "Brief Telegram broadcast: markets showing unusual volatility compression patterns across sports.",
      status: "scheduled",
    },
  ],
  Thu: [
    {
      time: "08:00",
      type: "newsletter",
      title: "The Weekly AI Brief",
      description: "Newsletter section: past 7 days of AI intelligence highlights, top signals, and market regime summary.",
      status: "draft",
    },
    {
      time: "13:00",
      type: "x_post",
      title: "UFC Late Money Alert",
      description: "Institutional post about the informed money pattern in UFC underdog markets. Structural explanation.",
      sport: "UFC",
      status: "scheduled",
    },
    {
      time: "21:00",
      type: "telegram",
      title: "Evening Signal Package",
      description: "Three-signal Telegram broadcast package covering the top cross-sport intelligence for the evening session.",
      status: "scheduled",
    },
  ],
  Fri: [
    {
      time: "07:30",
      type: "x_post",
      title: "Weekend Preview Pulse",
      description: "Weekend market preview: Horse Racing meet schedule, major sports events, prediction market catalysts.",
      status: "scheduled",
    },
    {
      time: "12:00",
      type: "shorts",
      title: "Terminal Walkthrough Short",
      description: "55-second full terminal walkthrough. Ideal for new audience capture over the weekend distribution window.",
      status: "scheduled",
    },
    {
      time: "18:00",
      type: "spotlight",
      title: "Creator Spotlight",
      description: "Feature a partner creator — show their signal card exports, audience reach, and distribution methodology.",
      status: "draft",
    },
  ],
  Sat: [
    {
      time: "09:00",
      type: "telegram",
      title: "Saturday Racing Broadcast",
      description: "Horse Racing Saturday signal package. Key Betfair markets, AI confidence scores, queue health overview.",
      sport: "Horse Racing",
      status: "scheduled",
    },
    {
      time: "14:00",
      type: "x_post",
      title: "Live Market Card Drop",
      description: "Creator-style post with signal card for the hottest in-play Horse Racing market. Volume surge focus.",
      sport: "Horse Racing",
      status: "draft",
    },
    {
      time: "20:00",
      type: "roundup",
      title: "Saturday Sports Roundup",
      description: "End-of-day AI roundup post: biggest market moves across all seven sports. Institutional tone.",
      status: "draft",
    },
  ],
  Sun: [
    {
      time: "10:00",
      type: "newsletter",
      title: "Weekend Intelligence Digest",
      description: "Sunday newsletter digest: weekly market regime changes, top signals, creator spotlight, and coming week preview.",
      status: "draft",
    },
    {
      time: "16:00",
      type: "x_post",
      title: "Weekend Volatility Summary",
      description: "Technical trader post: volatility regime summary for the weekend session. Three-line institutional format.",
      status: "scheduled",
    },
    {
      time: "20:00",
      type: "roundup",
      title: "Weekly Market Intelligence Roundup",
      description: "Creator-style roundup: top 5 structural market events from the week. With signal card exports attached.",
      status: "draft",
    },
  ],
};

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function WeeklyContentCalendar() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("Mon");
  const items = CALENDAR[selectedDay];

  const totalScheduled = Object.values(CALENDAR).flat().filter((i) => i.status === "scheduled").length;
  const totalDraft = Object.values(CALENDAR).flat().filter((i) => i.status === "draft").length;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <span className="text-zinc-700 text-[9px] font-mono uppercase tracking-wider">Total posts</span>
          <p className="text-white text-sm font-semibold tabular-nums mt-0.5">
            {Object.values(CALENDAR).flat().length}
          </p>
        </div>
        <div>
          <span className="text-zinc-700 text-[9px] font-mono uppercase tracking-wider">Scheduled</span>
          <p className="text-emerald-400 text-sm font-semibold tabular-nums mt-0.5">{totalScheduled}</p>
        </div>
        <div>
          <span className="text-zinc-700 text-[9px] font-mono uppercase tracking-wider">Draft</span>
          <p className="text-amber-400 text-sm font-semibold tabular-nums mt-0.5">{totalDraft}</p>
        </div>
      </div>

      {/* Day selector */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => {
          const dayItems = CALENDAR[day];
          const hasScheduled = dayItems.some((i) => i.status === "scheduled");
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 rounded-sm border text-center transition-colors ${
                isSelected
                  ? "border-zinc-600 bg-zinc-800/60 text-white"
                  : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              <p className="text-[10px] font-mono">{day}</p>
              <p className="text-[9px] font-mono tabular-nums text-zinc-700 mt-0.5">{dayItems.length}</p>
              {hasScheduled && (
                <div className="flex justify-center mt-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day schedule */}
      <div className="space-y-2">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          {selectedDay} — {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
        {items.map((item, i) => {
          const tc = TYPE_CONFIG[item.type];
          const sc = STATUS_CONFIG[item.status];
          return (
            <div
              key={i}
              className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-zinc-500 text-[10px] font-mono tabular-nums shrink-0">
                    {item.time}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 border rounded-sm shrink-0 ${tc.color} ${tc.bg} ${tc.border}`}
                  >
                    {tc.label}
                  </span>
                  {item.sport && (
                    <span className="text-zinc-700 text-[9px] font-mono">{item.sport}</span>
                  )}
                </div>
                <span className={`text-[9px] font-mono shrink-0 ${sc.color}`}>
                  {sc.label}
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] font-medium mb-1">{item.title}</p>
              <p className="text-zinc-600 text-[10px] leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
