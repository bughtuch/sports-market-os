"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  accent?: string;
  dotColor?: string;
  count?: string;
  live?: boolean;
}

const mainNav: NavItem[] = [
  { label: "Pulse", href: "/terminal", live: true },
  { label: "Horse Racing",      href: "/horse-racing",        accent: "text-amber-400",  dotColor: "bg-amber-400",  count: "48", live: true },
  { label: "Tennis",            href: "/tennis",              accent: "text-emerald-400", dotColor: "bg-emerald-400", count: "24", live: true },
  { label: "NBA",               href: "/nba",                 accent: "text-blue-400",   dotColor: "bg-blue-400",   count: "16", live: true },
  { label: "NFL",               href: "/nfl",                 accent: "text-red-400",    dotColor: "bg-red-400",    count: "12", live: true },
  { label: "UFC",               href: "/ufc",                 accent: "text-orange-400", dotColor: "bg-orange-400", count: "8",  live: true },
  { label: "Football",          href: "/football",                                        dotColor: "bg-zinc-500",   count: "64", live: true },
  { label: "Prediction Markets",href: "/prediction-markets",  accent: "text-purple-400", dotColor: "bg-purple-400", count: "76", live: true },
];

const tradingApps: NavItem[] = [
  { label: "Horse Racing Trader", href: "/terminal" },
  { label: "Tennis Trader UK",    href: "/terminal" },
  { label: "Tennis Trader USA",   href: "/terminal" },
];

const growth: NavItem[] = [
  { label: "Creator Studio",       href: "/creator-studio",        dotColor: "bg-purple-400" },
  { label: "Content Command",      href: "/content-command",       dotColor: "bg-red-400" },
  { label: "Export Studio",        href: "/export-studio",         dotColor: "bg-violet-400" },
  { label: "Distribution Center",  href: "/distribution-center",   dotColor: "bg-sky-400" },
  { label: "Daily Brief",          href: "/daily-brief",           dotColor: "bg-emerald-400" },
  { label: "Alerts",               href: "/alerts",                dotColor: "bg-amber-400" },
  { label: "System Status",        href: "/system-status",         dotColor: "bg-teal-400" },
  { label: "Provider Config",      href: "/provider-config",       dotColor: "bg-blue-400" },
  { label: "Notifications",        href: "/notification-settings", dotColor: "bg-violet-400" },
  { label: "Partner Dashboard",    href: "/partner-dashboard",     dotColor: "bg-zinc-400" },
  { label: "Partner Ecosystem",    href: "/partners",              dotColor: "bg-teal-400" },
  { label: "Partner Program",      href: "/partner-program",       dotColor: "bg-amber-400" },
  { label: "API Access",           href: "/api-access",            dotColor: "bg-blue-400" },
  { label: "Pricing",              href: "/pricing" },
  { label: "Contact",              href: "/contact" },
];

function NavSection({
  title,
  items,
  activeHref,
  showCounts = false,
}: {
  title: string;
  items: NavItem[];
  activeHref: string;
  showCounts?: boolean;
}) {
  return (
    <div className="mb-6">
      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 px-4 mb-2">
        {title}
      </p>
      {items.map((item) => {
        const isActive = activeHref === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center justify-between px-4 py-2 text-xs transition-all duration-150 ${
              isActive
                ? "text-white bg-zinc-800"
                : `hover:text-white hover:bg-zinc-900/60 ${item.accent ?? "text-zinc-400"}`
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              ) : item.dotColor ? (
                <span
                  className={`w-1 h-1 rounded-full shrink-0 opacity-60 group-hover:opacity-100 transition-opacity ${
                    item.live ? "pulse-dot" : ""
                  } ${item.dotColor}`}
                />
              ) : (
                <span className="w-1 h-1 shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </div>

            {showCounts && item.count && (
              <span className="text-zinc-600 text-[10px] font-mono tabular-nums shrink-0 group-hover:text-zinc-400 transition-colors">
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

import OnboardingPrompt from "@/components/OnboardingPrompt";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-zinc-800/60 bg-zinc-950 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-zinc-800/60 shrink-0">
        <Link href="/" className="block">
          <span className="text-white text-sm font-semibold tracking-tight leading-tight">
            Sports Market
            <br />
            <span className="text-zinc-500">OS</span>
          </span>
        </Link>
        <p className="text-zinc-600 text-[9px] font-mono mt-1.5 tracking-widest uppercase">
          Intelligence Terminal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-4">
        <NavSection title="Markets" items={mainNav} activeHref={pathname} showCounts />
        <NavSection title="Trading Apps" items={tradingApps} activeHref={pathname} />
        <NavSection title="Tools" items={growth} activeHref={pathname} />
      </nav>

      {/* AI Status block */}
      <div className="px-4 py-3 border-t border-zinc-800/40 shrink-0 bg-black/20">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">AI Engine</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-emerald-500 text-[9px] font-mono">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-[9px] font-mono">Feeds</span>
            <span className="text-zinc-300 text-[10px] font-mono font-semibold">12 live</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 text-[9px] font-mono">Signals</span>
            <span className="text-zinc-300 text-[10px] font-mono font-semibold">142/hr</span>
          </div>
        </div>
      </div>

      {/* Onboarding CTA */}
      <OnboardingPrompt />

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-zinc-600 text-[9px] font-mono">System Nominal</span>
        </div>
      </div>
    </aside>
  );
}
