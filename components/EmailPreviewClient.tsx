"use client";

import { useState, useEffect } from "react";

const TEMPLATE_TYPES = [
  "daily-brief",
  "alert",
  "welcome",
  "onboarding-complete",
  "system-status-warning",
  "creator-export-ready",
] as const;

type TemplateType = typeof TEMPLATE_TYPES[number];

interface PreviewResponse {
  type:    string;
  subject: string;
  html:    string;
}

export default function EmailPreviewClient() {
  const [selected, setSelected]   = useState<TemplateType>("welcome");
  const [preview, setPreview]     = useState<PreviewResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const [viewMode, setViewMode]   = useState<"rendered" | "source">("rendered");

  useEffect(() => {
    setLoading(true);
    setPreview(null);
    fetch(`/api/email/templates?type=${selected}`)
      .then((r) => r.json())
      .then((d: PreviewResponse) => { setPreview(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selected]);

  return (
    <div className="font-mono">
      {/* Type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TEMPLATE_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`text-[10px] font-mono px-3 py-1.5 border rounded-sm transition-colors tracking-widest uppercase ${
              selected === t
                ? "border-white text-white bg-zinc-900"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2 mb-4">
        {(["rendered", "source"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`text-[10px] font-mono px-3 py-1 border rounded-sm transition-colors ${
              viewMode === mode
                ? "border-zinc-400 text-white"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
            }`}
          >
            {mode === "rendered" ? "Rendered" : "HTML Source"}
          </button>
        ))}
        {preview && (
          <span className="ml-auto text-[10px] font-mono text-zinc-500">
            Subject: <span className="text-zinc-300">{preview.subject}</span>
          </span>
        )}
      </div>

      {/* Preview area */}
      <div className="border border-zinc-800 rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-600 animate-pulse">
            Loading template...
          </div>
        ) : preview ? (
          viewMode === "rendered" ? (
            <iframe
              srcDoc={preview.html}
              className="w-full border-0"
              style={{ height: "720px", background: "#000" }}
              title={`Email preview: ${selected}`}
              sandbox="allow-same-origin"
            />
          ) : (
            <pre className="p-4 text-[9px] text-zinc-400 overflow-auto" style={{ maxHeight: "720px" }}>
              {preview.html}
            </pre>
          )
        ) : (
          <div className="p-8 text-center text-xs font-mono text-zinc-600">
            Failed to load preview.
          </div>
        )}
      </div>

      {/* Open in new tab */}
      {preview && viewMode === "rendered" && (
        <div className="mt-3 text-right">
          <a
            href={`/api/email/templates?type=${selected}&format=html`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Open in new tab →
          </a>
        </div>
      )}
    </div>
  );
}
