"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "smos_screenshot_mode";

interface Props {
  onChange: (active: boolean) => void;
}

export default function ScreenshotModeToggle({ onChange }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") {
        setActive(true);
        onChange(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function toggle() {
    const next = !active;
    setActive(next);
    onChange(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      title={active ? "Exit screenshot mode" : "Screenshot mode"}
      className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider transition-colors px-2 py-0.5 rounded-sm border ${
        active
          ? "text-white border-zinc-600 bg-zinc-800"
          : "text-zinc-600 border-transparent hover:text-zinc-400"
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${active ? "bg-white" : "bg-zinc-600"}`} />
      SCR
    </button>
  );
}
