// ─── Notification types ───────────────────────────────────────────────────────

export type NotificationType =
  | "volatility-spike"
  | "liquidity-anomaly"
  | "catalyst-detected"
  | "daily-brief-ready"
  | "queue-deterioration"
  | "ai-regime-shift"
  | "creator-export-ready"
  | "watchlist-anomaly"
  | "exchange-flow-shift"
  | "alert-rule-triggered";

export type DeliveryChannel =
  | "email"
  | "telegram"
  | "push"
  | "in-app"
  | "creator-broadcast";

export type DeliveryStatus =
  | "queued"
  | "delivered"
  | "failed"
  | "retrying"
  | "skipped";

export type NotificationSeverity = "info" | "warning" | "high" | "critical";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface NotificationPreferences {
  id?:                 string;
  user_id:             string;
  email_enabled:       boolean;
  telegram_enabled:    boolean;
  push_enabled:        boolean;
  daily_brief_enabled: boolean;
  volatility_alerts:   boolean;
  catalyst_alerts:     boolean;
  queue_alerts:        boolean;
  creator_alerts:      boolean;
  quiet_hours:         QuietHours;
  created_at?:         string;
  updated_at?:         string;
}

export interface QuietHours {
  enabled?: boolean;
  from?:    string;   // "HH:MM" UTC
  to?:      string;   // "HH:MM" UTC
}

export interface NotificationEvent {
  id?:               string;
  user_id:           string;
  notification_type: NotificationType;
  delivery_channel:  DeliveryChannel;
  title:             string;
  message:           string;
  severity:          NotificationSeverity;
  delivery_status:   DeliveryStatus;
  metadata:          Record<string, unknown>;
  created_at?:       string;
}

export interface NotificationPayload {
  notification_type: NotificationType;
  title:             string;
  message:           string;
  severity:          NotificationSeverity;
  metadata?:         Record<string, unknown>;
}

export interface QueueStats {
  queued:    number;
  delivered: number;
  failed:    number;
  retrying:  number;
  skipped:   number;
  total:     number;
  channels:  Partial<Record<DeliveryChannel, number>>;
}

// ─── Display maps ─────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  "volatility-spike":      "Volatility Spike",
  "liquidity-anomaly":     "Liquidity Anomaly",
  "catalyst-detected":     "Catalyst Detected",
  "daily-brief-ready":     "Daily Brief Ready",
  "queue-deterioration":   "Queue Deterioration",
  "ai-regime-shift":       "AI Regime Shift",
  "creator-export-ready":  "Export Ready",
  "watchlist-anomaly":     "Watchlist Anomaly",
  "exchange-flow-shift":   "Exchange Flow Shift",
  "alert-rule-triggered":  "Alert Rule Triggered",
};

export const CHANNEL_LABELS: Record<DeliveryChannel, string> = {
  "email":             "Email",
  "telegram":          "Telegram",
  "push":              "Push",
  "in-app":            "In-App",
  "creator-broadcast": "Creator Broadcast",
};

export const CHANNEL_STATUS: Record<DeliveryChannel, "ready" | "pending" | "mock"> = {
  "email":             "pending",   // Resend not yet connected
  "telegram":          "pending",   // Bot not yet connected
  "push":              "pending",   // Web-push not yet enabled
  "in-app":            "ready",     // Always available
  "creator-broadcast": "mock",      // Creator distribution channel
};

export const SEVERITY_COLOR: Record<NotificationSeverity, string> = {
  info:     "text-blue-400",
  warning:  "text-amber-400",
  high:     "text-orange-400",
  critical: "text-red-400",
};

export const STATUS_COLOR: Record<DeliveryStatus, string> = {
  queued:    "text-amber-400",
  delivered: "text-emerald-400",
  failed:    "text-red-400",
  retrying:  "text-orange-400",
  skipped:   "text-zinc-500",
};

export const DEFAULT_PREFERENCES: Omit<NotificationPreferences, "user_id"> = {
  email_enabled:       true,
  telegram_enabled:    false,
  push_enabled:        false,
  daily_brief_enabled: true,
  volatility_alerts:   true,
  catalyst_alerts:     true,
  queue_alerts:        true,
  creator_alerts:      false,
  quiet_hours:         {},
};
