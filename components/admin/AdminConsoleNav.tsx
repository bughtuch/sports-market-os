"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Overview",            href: "#overview",      dot: "bg-white" },
  { label: "Partner Applications",href: "#applications",  dot: "bg-amber-400" },
  { label: "Partner Profiles",    href: "#profiles",      dot: "bg-emerald-400" },
  { label: "Referral Events",     href: "#events",        dot: "bg-blue-400" },
  { label: "Distribution",        href: "#distribution",  dot: "bg-violet-400" },
  { label: "System Status",       href: "#system",        dot: "bg-teal-400" },
  { label: "Provider Activation", href: "#providers",     dot: "bg-blue-400" },
];

export default function AdminConsoleNav() {
  const [active, setActive] = useState("#overview");

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ href }) =>
      document.querySelector(href.replace("#", "#"))
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive("#" + entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="w-44 shrink-0 border-r border-zinc-800/60 bg-zinc-950 px-3 py-5 space-y-1 hidden md:block">
      <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-3 px-1">
        Console
      </p>
      {NAV_ITEMS.map(({ label, href, dot }) => {
        const isActive = active === href;
        return (
          <a
            key={href}
            href={href}
            onClick={() => setActive(href)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-sm text-[10px] transition-colors ${
              isActive
                ? "text-white bg-zinc-900"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
            }`}
          >
            <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? "bg-white" : dot + " opacity-40"}`} />
            {label}
          </a>
        );
      })}

      <div className="pt-4 mt-4 border-t border-zinc-900">
        <p className="text-zinc-800 text-[8px] font-mono px-1 leading-relaxed">
          Admin only · Not linked publicly
        </p>
      </div>
    </nav>
  );
}
