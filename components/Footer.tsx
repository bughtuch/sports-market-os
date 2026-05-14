import Link from "next/link";

const PLATFORM_LINKS = [
  { label: "Terminal",             href: "/terminal" },
  { label: "Markets",              href: "/markets" },
  { label: "Creator Studio",       href: "/creator-studio" },
  { label: "Export Studio",        href: "/export-studio" },
  { label: "Distribution Center",  href: "/distribution-center" },
  { label: "Pricing",              href: "/pricing" },
  { label: "Partner Program",      href: "/partner-program" },
  { label: "API Access",           href: "/api-access" },
  { label: "Contact",              href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Terms",      href: "/terms" },
  { label: "Privacy",    href: "/privacy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <>
      {/* Legal disclaimer strip */}
      <div className="border-t border-zinc-900/60 bg-black">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <p className="text-zinc-700 text-[10px] leading-relaxed text-center">
            Sports Market OS provides market intelligence, analytics, and informational tooling only.
            No wagers are accepted. No trades are executed. Nothing presented constitutes financial,
            investment, betting, or gambling advice.
          </p>
        </div>
      </div>

      {/* Footer */}
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
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                AI-powered sports market intelligence and analytics platform.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-3">
                Platform
              </p>
              <ul className="space-y-2">
                {PLATFORM_LINKS.map((link) => (
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

            {/* Company */}
            <div>
              <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-3">
                Company
              </p>
              <p className="text-zinc-400 text-[11px] font-medium mb-1">Bug Hutch Ltd</p>
              <a
                href="mailto:support@sportsmarketos.com"
                className="text-zinc-500 text-[11px] hover:text-white transition-colors"
              >
                support@sportsmarketos.com
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-900/60 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-zinc-700 text-[10px]">
              © 2026 Sports Market OS. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-700 text-[10px] hover:text-zinc-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
