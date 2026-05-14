/**
 * /email-preview — Email template preview page.
 * Dev/testing only. Noindexed via robots.ts.
 */

import type { Metadata } from "next";
import EmailPreviewClient from "@/components/EmailPreviewClient";

export const metadata: Metadata = {
  title:  "Email Preview — Sports Market OS",
  robots: { index: false, follow: false },
};

export default function EmailPreviewPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase mb-2">
          Dev · Email System
        </p>
        <h1 className="text-sm font-mono font-bold text-white tracking-widest uppercase mb-1">
          Email Template Preview
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Rendered preview of all Resend email templates. Not indexed.
        </p>
      </div>

      <EmailPreviewClient />
    </main>
  );
}
