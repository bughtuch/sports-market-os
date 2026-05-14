"use client";

import { useState } from "react";

export interface PostGeneratorProps {
  market: string;
  sport: string;
  signalType: string;
  confidence: number;
  insight: string;
  movement?: string;
}

type PostStyle = "institutional" | "creator" | "technical";

function generatePost(data: PostGeneratorProps, style: PostStyle): string {
  const { market, sport, signalType, confidence, insight, movement } = data;
  const movStr = movement ? ` (${movement})` : "";

  switch (style) {
    case "institutional":
      return `${signalType} detected — ${market}.

${insight}

Sports Market OS AI confidence: ${confidence}%.
Intelligence terminal: sportsmarketos.com`;

    case "creator":
      return `🔍 ${sport} | ${market}${movStr}

${insight}

Confidence: ${confidence}% via Sports Market OS AI engine.

Full analytics: sportsmarketos.com`;

    case "technical":
      return `[${sport.toUpperCase()}] ${market} — ${signalType}${movStr}

AI signal: ${insight}

Confidence score: ${confidence}/100
Source: Sports Market OS Intelligence Terminal
sportsmarketos.com`;
  }
}

const STYLE_LABELS: Record<PostStyle, string> = {
  institutional: "Institutional",
  creator: "Creator",
  technical: "Technical",
};

const X_BASE = "https://twitter.com/intent/tweet?text=";
const TG_BASE = "https://t.me/share/url?url=https://sportsmarketos.com&text=";

export default function PostGenerator(props: PostGeneratorProps) {
  const [style, setStyle] = useState<PostStyle>("institutional");
  const [copied, setCopied] = useState(false);

  const post = generatePost(props, style);

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the textarea
    }
  }

  function shareX() {
    window.open(X_BASE + encodeURIComponent(post), "_blank", "noopener");
  }

  function shareTelegram() {
    window.open(TG_BASE + encodeURIComponent(post), "_blank", "noopener");
  }

  return (
    <div className="space-y-3">
      {/* Style selector */}
      <div className="flex items-center gap-1">
        {(Object.keys(STYLE_LABELS) as PostStyle[]).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-colors ${
              style === s
                ? "text-white border-zinc-600 bg-zinc-800"
                : "text-zinc-600 border-zinc-800 hover:text-zinc-400"
            }`}
          >
            {STYLE_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Post preview */}
      <pre className="text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800/60 rounded-sm p-3 whitespace-pre-wrap font-sans leading-relaxed">
        {post}
      </pre>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={copyPost}
          className="text-[10px] font-mono text-black bg-white px-3 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy text"}
        </button>
        <button
          onClick={shareX}
          className="text-[10px] font-mono text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
        >
          Post to X
        </button>
        <button
          onClick={shareTelegram}
          className="text-[10px] font-mono text-zinc-300 border border-zinc-700 px-3 py-1.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
        >
          Telegram
        </button>
      </div>
    </div>
  );
}
