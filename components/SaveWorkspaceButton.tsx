"use client";

import { useState } from "react";

const STORAGE_KEY = "smos_workspace_v1";

export default function SaveWorkspaceButton() {
  const [saved, setSaved] = useState(false);

  function save() {
    try {
      const workspace = {
        savedAt: Date.now(),
        filters: { sport: "All Sports", tier: "Free" },
        panels: { pulse: true, heat: true, ai: true, feeds: true },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <button
      onClick={save}
      className="text-zinc-700 text-[9px] font-mono hover:text-zinc-400 transition-colors"
      title="Save current workspace layout"
    >
      {saved ? "Saved ✓" : "Save workspace"}
    </button>
  );
}
