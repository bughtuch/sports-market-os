/**
 * activityTypes.ts — Activity tracking type definitions.
 *
 * Privacy-safe: no IP addresses, no full user agents, no PII beyond user_id.
 */

export type ActivityEventType =
  | "terminal_view"
  | "signal_export"
  | "alert_created"
  | "brief_viewed"
  | "watchlist_opened"
  | "distribution_queued"
  | "creator_post_generated"
  | "partner_link_copied"
  | "onboarding_completed"
  | "email_test_sent"
  | "route_view";

export interface ActivityEvent {
  id?:          string;
  user_id:      string;
  event_type:   ActivityEventType;
  event_source?: string;
  route?:       string;
  metadata:     Record<string, unknown>;
  created_at?:  string;
}

export interface DailyActivity {
  id?:                   string;
  user_id:               string;
  activity_date:         string;   // YYYY-MM-DD
  terminal_views:        number;
  exports_created:       number;
  alerts_created:        number;
  briefs_viewed:         number;
  watchlists_used:       number;
  distribution_actions:  number;
  created_at?:           string;
  updated_at?:           string;
}

export interface ActivitySummary {
  today:         DailyActivity | null;
  last7Days:     DailyActivity[];
  streak:        number;   // consecutive active days
  totalEvents:   number;
}

export const EVENT_LABELS: Record<ActivityEventType, string> = {
  terminal_view:          "Terminal View",
  signal_export:          "Signal Export",
  alert_created:          "Alert Created",
  brief_viewed:           "Brief Viewed",
  watchlist_opened:       "Watchlist Opened",
  distribution_queued:    "Distribution Queued",
  creator_post_generated: "Creator Post Generated",
  partner_link_copied:    "Partner Link Copied",
  onboarding_completed:   "Onboarding Completed",
  email_test_sent:        "Email Test Sent",
  route_view:             "Page View",
};

// Map routes to event types for the ActivityTracker component
export const ROUTE_EVENT_MAP: Record<string, ActivityEventType> = {
  "/terminal":             "terminal_view",
  "/daily-brief":         "brief_viewed",
  "/watchlists":          "watchlist_opened",
  "/alerts":              "route_view",
  "/export-studio":       "route_view",
  "/distribution-center": "distribution_queued",
  "/creator-studio":      "creator_post_generated",
};
