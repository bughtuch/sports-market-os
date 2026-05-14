"use client";

import { useEffect, useState } from "react";
import type { BriefHistoryEntry } from "@/lib/dailyBriefs/briefTypes";
import { CONFIDENCE_COLOR } from "@/lib/dailyBriefs/briefTypes";

interface BriefStats {
  totalToday:    number;
  avgConfidence: number;
  lastGenerated: string | null;
  topRegime:     string | null;
}

interface HistoryResponse {
  history: BriefHistoryEntry[];
  stats:   BriefStats | null;
}

const SESSION_DOT: Record<string, string> = {
  morning:   "bg-amber-400",
  midday:    "bg-blue-400",
  overnight: "bg-violet-400",
};

export default function DailyBriefHistoryRail() {
  const [data, setData]         = useState<HistoryResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg]     = useState("");

  function load() {
    setLoading(true);
    fetch("/api/daily-brief/history")
      .then(r => r.json())
      .then((d: HistoryResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function generate() {
    setGenerating(true);
    setGenMsg("");
    const res  = await fetch("/api/daily-brief/generate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ queueEmail: true }),
    });
    const body = await res.json() as { persisted?: boolean; rateLimited?: boolean; error?: string };
    if (body.persisted) {
      setGenMsg("Generated \u2713");
      load();
    } else if (body.rateLimited) {
      setGenMsg("Rate limited \u2014 retry in 5 min");
    } else {
      setGenMsg(body.error ?? "Error");
    }
    setGenerating(false);
  }

  const stats = data?.stats;

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Today",     val: stats.totalToday },
            { label: "Avg Conf.", val: stats.avgConfidence ? `${stats.avgConfidence}%` : "\u2014" },
          ].map(({ label, val }) => (
            <div key={label} className="border border-zinc-800 rounded-sm p-2">
              <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mb-0.5">{label}</p>
              <p className="text-sm font-mono font-bold text-white">{val}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={generating}
        className="w-full text-[10px] font-mono px-3 py-2 border border-zinc-700 text-zinc-300 rounded-sm hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
      >
        {generating ? "Generating\u2026" : "Generate New Brief"}
      </button>
      {genMsg && (
        <p className={`text-[9px] font-mono ${genMsg.includes("\u2713") ? "text-emerald-400" : "text-amber-400"}`}>
          {genMsg}
        </p>
      )}

      {/* History list */}
      <div className="space-y-2">
        <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Brief History</p>
        {loading ? (
          <p className="text-[9px] font-mono text-zinc-700 animate-pulse">Loading...</p>
        ) : data?.history.length ? (
          data.history.map(entry => (
            <div key={entry.id} className="border border-zinc-900 rounded-sm px-3 py-2.5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1 h-1 rounded-full shrink-0 ${SESSION_DOT[entry.session_type] ?? "bg-zinc-600"}`} />
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                  {entry.session_type}
                </span>
                <span className="text-[8px] font-mono text-zinc-700 ml-auto">
                  {new Date(entry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-300 leading-tight line-clamp-1 mb-1">{entry.title}</p>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono ${CONFIDENCE_COLOR(entry.ai_confidence)}`}>
                  {entry.ai_confidence}% conf
                </span>
                <span className="text-[8px] font-mono text-zinc-700 line-clamp-1">{entry.regime}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[9px] font-mono text-zinc-700">
            No persisted briefs yet. Click Generate to create one.
          </p>
        )}
      </div>
    </div>
  );
}
