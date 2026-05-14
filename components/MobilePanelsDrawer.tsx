"use client";

import { useState } from "react";
import AlertRail from "@/components/AlertRail";
import AIPanel from "@/components/AIPanel";
import Watchlist from "@/components/Watchlist";
import CreatorFeed from "@/components/CreatorFeed";

/**
 * On mobile: renders a toggle button + slide-in drawer for the right panel.
 * On md+: hidden (the real right panel is rendered in terminal/page.tsx).
 */
export default function MobilePanelsDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-[9px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-sm hover:text-zinc-300 hover:border-zinc-600 transition-colors shrink-0"
        aria-label="Open panels"
      >
        Panels
      </button>

      {/* Drawer overlay — mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 right-0 bottom-0 w-72 bg-zinc-950 border-l border-zinc-800/60 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60 shrink-0">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Intelligence Panels
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-zinc-300 text-sm font-mono transition-colors"
                aria-label="Close panels"
              >
                ✕
              </button>
            </div>

            {/* Panel content — scrollable */}
            <div className="flex-1 overflow-y-auto">
              <AlertRail />
              <AIPanel />
              <Watchlist />
              <CreatorFeed />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
