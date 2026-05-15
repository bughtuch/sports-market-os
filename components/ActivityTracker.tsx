"use client";

/**
 * ActivityTracker — Invisible global route-tracking component.
 *
 * Fires a privacy-safe activity event when the user navigates to a tracked route.
 * Mounted once in the root layout. Never tracks:
 * - IP addresses
 * - User agents
 * - Personal/sensitive data
 * - Admin or account routes (filtered below)
 *
 * Silently no-ops when unauthenticated.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { ActivityEventType } from "@/lib/activity/activityTypes";
import { ROUTE_EVENT_MAP } from "@/lib/activity/activityTypes";

// Routes that should NOT be tracked (privacy/sensitivity)
const SKIP_ROUTES = new Set([
  "/account", "/admin", "/signin", "/signup",
  "/email-preview", "/onboarding",
]);

function resolveEventType(pathname: string): ActivityEventType | null {
  if (SKIP_ROUTES.has(pathname)) return null;
  // Exact match first
  if (pathname in ROUTE_EVENT_MAP) return ROUTE_EVENT_MAP[pathname];
  // Prefix match for dynamic routes
  for (const [prefix, type] of Object.entries(ROUTE_EVENT_MAP)) {
    if (pathname.startsWith(prefix + "/")) return type;
  }
  return null;
}

export default function ActivityTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;

    const eventType = resolveEventType(pathname);
    if (!eventType) return;

    lastTracked.current = pathname;

    // Fire and forget — never blocks render
    fetch("/api/activity/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ event_type: eventType, route: pathname }),
    }).catch(() => {
      // Swallow errors — tracking is best-effort
    });
  }, [pathname]);

  return null;
}
