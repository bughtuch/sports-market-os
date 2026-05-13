import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/constants/contact";

const NAV_LINKS = [
  { label: "Terminal",         href: "/terminal" },
  { label: "Markets",          href: "/markets" },
  { label: "Pricing",          href: "/pricing" },
  { label: "Partner Program",  href: "/partner-program" },
  { label: "API Access",       href: "/api-access" },
  { label: "Creator Studio",   href: "/creator-studio" },
  { label: "Contact",          href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900/80 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-2">
              <span className="text-white text-sm font-semibold tracking-tight">
                Sports Market OS
              </span>
            </Link>
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-3">
              Intelligence Terminal
            </p>
            <p className="text-zinc-600 text-[11px] leading-relaxed">
              AI-generated market intelligence infrastructure for serious sports
              market followers.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-3">
              Platform
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 text-[11px] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-3">
              Support
            </p>
            <p className="text-zinc-500 text-[11px] mb-1">General enquiries</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-zinc-400 text-[11px] font-mono hover:text-white transition-colors"
            >
              {SUPPORT_EMAIL}
            </a>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-zinc-700 text-[9px] font-mono">
                System nominal
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-zinc-700 text-[9px] font-mono">
            SPORTS MARKET OS — AI INTELLIGENCE TERMINAL
          </span>
          <span className="text-zinc-800 text-[9px] font-mono text-center">
            For market intelligence purposes only. Not financial or gambling advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
