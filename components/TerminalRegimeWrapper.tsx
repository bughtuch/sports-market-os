"use client";

import { useState, useEffect } from "react";
import { setRegime } from "@/lib/realtime/motionState";

interface Props {
  children: React.ReactNode;
}

export default function TerminalRegimeWrapper({ children }: Props) {
  const [regime, setRegimeState] = useState("stable");

  useEffect(() => {
    async function fetchRegime() {
      try {
        const res = await fetch("/api/ai/regime");
        if (res.ok) {
          const data = (await res.json()) as { regime?: { regime?: string } };
          const r = data.regime?.regime ?? "stable";
          setRegimeState(r);
          setRegime(r); // update motionState module so feedEngine picks up new cadence
        }
      } catch {
        /* noop */
      }
    }
    void fetchRegime();
    const id = setInterval(() => void fetchRegime(), 22_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-regime={regime}
      className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden"
    >
      {children}
    </div>
  );
}
