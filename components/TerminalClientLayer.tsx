"use client";

import { useEffect } from "react";
import TerminalWelcomeOverlay from "@/components/TerminalWelcomeOverlay";

const SCR_KEY = "smos_screenshot_mode";

/**
 * Mounts alongside the terminal server component.
 * Handles: welcome overlay, screenshot mode keyboard shortcut, localStorage restore.
 */
export default function TerminalClientLayer() {
  // Restore screenshot mode from localStorage on mount
  useEffect(() => {
    try {
      if (localStorage.getItem(SCR_KEY) === "1") {
        document.body.setAttribute("data-screenshot", "1");
      }
    } catch {
      // ignore
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Alt+S  →  toggle screenshot mode
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const current = document.body.getAttribute("data-screenshot");
        if (current === "1") {
          document.body.removeAttribute("data-screenshot");
          try { localStorage.removeItem(SCR_KEY); } catch {}
        } else {
          document.body.setAttribute("data-screenshot", "1");
          try { localStorage.setItem(SCR_KEY, "1"); } catch {}
        }
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return <TerminalWelcomeOverlay />;
}
