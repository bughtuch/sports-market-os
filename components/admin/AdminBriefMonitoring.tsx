"use client";

import { useEffect, useState } from "react";

interface BriefStats {
  totalToday:    number;
  avgConfidence: number;
  lastGenerated: string | null;
  topRegime:     string | null;
}

interface BriefHistoryEntry {
  id:            string;
  generated_for: string;
  session_type:  string;
  title:         string;
  ai_confidence: number;
  regime:        string;
  created_at:    string;
}

interface HistoryResponse {
  history: BriefHistoryEntry[];
  stats:   BriefStats | null;
}

export default function AdminBriefMonitoring() {
  const [data, setData]       = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/daily-brief/history?limit=10")
      .then(r => r.json())
      .then((d: HistoryResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <section id="briefs" className="border border-zinc-800 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Daily Brief Engine</h2>
        </div>
        <span className={`text-[10px] font-mono font-bold tracking-widest ${loading ? "text-zinc-600" : "text-emerald-400"}`}>
          {loading ? "LOADING" : "OPERATIONAL"}
        </span>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Generated Today", val: stats?.totalToday ?? "\u2014",       color: "text-white" },
          { label: "Avg Confidence",  val: stats?.avgConfidence ? `${stats.avgConfidence}%` : "\u2014", color: stats?.avgConfidence && stats.avgConfidence >= 70 ? "text-emerald-400" : "text-amber-400" },
          { label: "Top Regime",      val: stats?.topRegime ? stats.topRegime.split(" ").slice(0, 2).join(" ") : "\u2014", color: "text-zinc-300" },
          { label: "Last Generated",  val: stats?.lastGenerated ? new Date(stats.lastGenerated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "\u2014", color: "text-zinc-300" },
        ].map(({ label, val, color }) => (
          <div key={label} className="border border-zinc-800 rounded-sm p-3">
            <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-1">{label}</p>
            <p className={`text-lg font-mono font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Recent briefs */}
      {!loading && data?.history.length ? (
        <div>
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Recent Briefs</p>
          <div className="space-y-2">
            {data.history.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center gap-3 px-3 py-2 border border-zinc-900 rounded-sm">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-sm ${
                  entry.session_type === "morning"   ? "border-amber-800 text-amber-400"   :
                  entry.session_type === "midday"    ? "border-blue-800 text-blue-400"     :
                  "border-violet-800 text-violet-400"
                }`}>{entry.session_type}</span>
                <span className="text-[10px] font-mono text-zinc-300 flex-1 truncate">{entry.title}</span>
                <span className={`text-[9px] font-mono shrink-0 ${entry.ai_confidence >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
                  {entry.ai_confidence}%
                </span>
                <span className="text-[9px] font-mono text-zinc-600 shrink-0">
                  {new Date(entry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : !loading ? (
        <p className="text-[9px] font-mono text-zinc-700">No briefs persisted yet \u2014 generate via /daily-brief.</p>
      ) : null}

      {/* Engine architecture */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Engine Architecture</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: "Generator",    note: "lib/dailyBriefs/briefGeneration.ts",   status: "active" },
            { label: "Scoring",      note: "lib/dailyBriefs/briefScoring.ts",      status: "active" },
            { label: "Persistence",  note: "daily_briefs + sections tables",       status: "active" },
            { label: "Email Queue",  note: "notification_events channel",          status: "active" },
            { label: "History API",  note: "/api/daily-brief/history",             status: "active" },
            { label: "Creator Mode", note: "creator-opportunities section",        status: "active" },
          ].map(({ label, note, status }) => (
            <div key={label} className="flex items-start gap-2 p-2 border border-zinc-800 rounded-sm">
              <div className={`w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 ${status === "active" ? "bg-emerald-400" : "bg-zinc-600"}`} />
              <div>
                <p className="text-[10px] font-mono text-white">{label}</p>
                <p className="text-[9px] font-mono text-zinc-600">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
