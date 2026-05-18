"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SPORTS_SUBMENU = [
  { label: "NBA",      href: "/nba" },
  { label: "Football", href: "/football" },
  { label: "NHL",      href: "/nhl" },
  { label: "Tennis",   href: "/tennis" },
  { label: "NFL",      href: "/nfl" },
  { label: "UFC",      href: "/ufc" },
];

const mainNav = [
  { label: "Terminal", href: "/terminal" },
  { label: "Markets",  href: "/markets", submenu: SPORTS_SUBMENU },
  { label: "Ledger",   href: "/accuracy" },
  { label: "Partners", href: "/partners" },
  { label: "API",      href: "/api-access" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 border-r border-zinc-800/60 bg-zinc-950 flex flex-col overflow-hidden">
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
        <div className="mb-2">
          <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-700 px-4 mb-2">
            Navigation
          </p>
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div key={item.label} className={hasSubmenu ? "group relative" : ""}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs transition-all duration-150 ${
                    isActive
                      ? "text-white bg-zinc-900"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-1 h-1 rounded-full shrink-0 ${
                        isActive ? "bg-white" : "bg-zinc-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {hasSubmenu && (
                    <span className="text-zinc-700 text-[9px] font-mono">›</span>
                  )}
                </Link>

                {/* Hover submenu */}
                {hasSubmenu && (
                  <div className="absolute left-full top-0 w-44 bg-zinc-950 border border-zinc-800/60 rounded-sm shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                    {item.submenu!.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-4 py-2 text-xs transition-colors duration-100 ${
                          pathname === sub.href
                            ? "text-white bg-zinc-800"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer status */}
      <div className="px-4 py-3 border-t border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-zinc-600 text-[9px] font-mono">System Nominal</span>
        </div>
      </div>
    </aside>
  );
}
