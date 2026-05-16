import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Sports Market OS",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-zinc-800 text-[9px] font-mono uppercase tracking-widest mb-5">404</p>
        <h1 className="text-xl font-semibold tracking-tight mb-3">Page not found</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          This route doesn&apos;t exist. The intelligence terminal is still running.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/terminal"
            className="inline-block text-sm font-medium text-black bg-white px-6 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            Open Terminal →
          </Link>
          <Link
            href="/"
            className="text-zinc-600 text-[11px] font-mono hover:text-zinc-400 transition-colors"
          >
            ← Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
