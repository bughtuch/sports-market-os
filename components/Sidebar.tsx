"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  accent?: string;
}

const mainNav: NavItem[] = [
  { label: "Pulse", href: "/terminal" },
  { label: "Horse Racing", href: "/terminal/horse-racing", accent: "text-amber-400" },
  { label: "Tennis", href: "/terminal/tennis", accent: "text-emerald-400" },
  { label: "NBA", href: "/terminal/nba", accent: "text-blue-400" },
  { label: "NFL", href: "/terminal/nfl", accent: "text-red-400" },
  { label: "UFC", href: "/terminal/ufc", accent: "text-orange-400" },
  { label: "Football", href: "/terminal/football" },
  { label: "Prediction Markets", href: "/terminal/prediction", accent: "text-purple-400" },
];

const tradingApps: NavItem[] = [
  { label: "HRT", href: "#" },
  { label: "Tennis Trader UK", href: "#" },
  { label: "Tennis Trader USA", href: "#" },
];

const growth: NavItem[] = [
  { label: "Creator Studio", href: "#" },
  { label: "Partner Program", href: "#" },
  { label: "API Access", href: "#" },
];

function NavSection({
  title,
  items,
  activeHref,
}: {
  title: string;
  items: NavItem[];
  activeHref: string;
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
            className={`flex items-center gap-2 px-4 py-1.5 text-xs transition-colors ${
              isActive
                ? "text-white bg-zinc-900"
                : `hover:text-white hover:bg-zinc-900/50 ${item.accent ?? "text-zinc-500"}`
            }`}
          >
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-white shrink-0" />
            )}
            {!isActive && item.accent && (
              <span className={`w-1 h-1 rounded-full bg-current shrink-0 opacity-60`} />
            )}
            {!isActive && !item.accent && (
              <span className="w-1 h-1 shrink-0" />
            )}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-zinc-800/60 bg-zinc-950 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-zinc-800/60">
        <Link href="/" className="block">
          <span className="text-white text-xs font-semibold tracking-tight leading-tight">
            Sports Market<br />
            <span className="text-zinc-400">OS</span>
          </span>
        </Link>
        <p className="text-zinc-700 text-[9px] font-mono mt-1 tracking-wider">INTELLIGENCE TERMINAL</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-4">
        <NavSection title="Markets" items={mainNav} activeHref={pathname} />
        <NavSection title="Trading Apps" items={tradingApps} activeHref={pathname} />
        <NavSection title="Growth" items={growth} activeHref={pathname} />
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-zinc-600 text-[9px] font-mono">SYSTEM NOMINAL</span>
        </div>
      </div>
    </aside>
  );
}
