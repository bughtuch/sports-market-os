"use client";

/**
 * Global error boundary — catches unhandled errors in any route segment.
 * Must be a client component per Next.js App Router requirements.
 */

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[SMOS] Unhandled page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-zinc-800 text-[9px] font-mono uppercase tracking-widest mb-5">Error</p>
        <h1 className="text-xl font-semibold tracking-tight mb-3">Something went wrong</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          An unexpected error occurred. The intelligence engine is still running.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="text-sm font-medium text-black bg-white px-5 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/terminal"
            className="text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
          >
            Open Terminal
          </Link>
        </div>
        {error.digest && (
          <p className="text-zinc-800 text-[9px] font-mono mt-6">ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
