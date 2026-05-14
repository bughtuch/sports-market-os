"use client";

/**
 * SignalQuickActions — Queue / Draft / Broadcast quick-actions for signal cards.
 *
 * Client component — handles localStorage queue writes directly.
 * Rendered inside the LiveSignalFeed wrapper div, not inside SignalCard itself.
 */

import { useState } from "react";
import { queuePost, saveDraft } from "@/lib/distribution/distributionQueue";
import { xPostTemplate, telegramTemplate } from "@/lib/distribution/distributionTemplates";

interface Props {
  sport:       string;
  title:       string;
  description: string;
  movement?:   string;
  direction?:  "up" | "down" | "flat";
  confidence?: number;
  exchange?:   string;
  type?:       string;
  signalId?:   string;
}

export default function SignalQuickActions({
  sport, title, description, movement, direction, confidence, exchange, type, signalId,
}: Props) {
  const [queuedAs, setQueuedAs] = useState<"queue" | "draft" | "broadcast" | null>(null);

  const signal = { sport, title, description, movement, direction, confidence, exchange, type };

  function handleQueue() {
    queuePost({
      platform:         "x",
      content:          xPostTemplate(signal),
      distributionType: "signal-card",
      metadata:         { sport, signalId, tags: [sport.toLowerCase().replace(/\s+/g, "-")] },
    });
    setQueuedAs("queue");
    setTimeout(() => setQueuedAs(null), 2500);
  }

  function handleDraft() {
    saveDraft({
      platform:         "x",
      content:          xPostTemplate(signal),
      distributionType: "signal-card",
      metadata:         { sport, signalId },
    });
    setQueuedAs("draft");
    setTimeout(() => setQueuedAs(null), 2500);
  }

  function handleBroadcast() {
    queuePost({
      platform:         "telegram",
      content:          telegramTemplate(signal),
      distributionType: "telegram-broadcast",
      metadata:         { sport, signalId },
    });
    setQueuedAs("broadcast");
    setTimeout(() => setQueuedAs(null), 2500);
  }

  if (queuedAs) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-mono text-emerald-400">
          ✓ {queuedAs === "queue" ? "Queued" : queuedAs === "draft" ? "Saved draft" : "Broadcast queued"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleQueue}
        title="Queue for X"
        className="text-[9px] font-mono text-zinc-700 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 px-1.5 py-0.5 rounded-sm transition-colors"
      >
        Queue
      </button>
      <button
        onClick={handleDraft}
        title="Save as draft"
        className="text-[9px] font-mono text-zinc-700 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 px-1.5 py-0.5 rounded-sm transition-colors"
      >
        Draft
      </button>
      <button
        onClick={handleBroadcast}
        title="Queue Telegram broadcast"
        className="text-[9px] font-mono text-zinc-700 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 px-1.5 py-0.5 rounded-sm transition-colors"
      >
        Broadcast
      </button>
    </div>
  );
}
