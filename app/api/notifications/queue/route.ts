import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { simulateDelivery, getQueueStats } from "@/lib/notifications/notificationQueue";
import { fetchNotificationPreferences } from "@/lib/notifications/notificationPreferences";
import { queueNotification } from "@/lib/notifications/notificationRouting";
import { buildTemplate } from "@/lib/notifications/notificationTemplates";
import type { NotificationType } from "@/lib/notifications/notificationTypes";

export const dynamic = "force-dynamic";

/**
 * GET — return queue stats for authenticated user
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ stats: null, source: "no-supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await getQueueStats(supabase, user.id);
  return NextResponse.json({ stats });
}

/**
 * POST — enqueue a notification or simulate delivery flush
 * Body: { action: "enqueue" | "flush", notification_type?, context? }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { action, notification_type, context } = body as {
    action:            "enqueue" | "flush";
    notification_type?: NotificationType;
    context?:          Record<string, unknown>;
  };

  if (action === "flush") {
    const result = await simulateDelivery(supabase, user.id);
    return NextResponse.json({ delivered: result.delivered });
  }

  if (action === "enqueue" && notification_type) {
    const [prefs, template] = await Promise.all([
      fetchNotificationPreferences(supabase, user.id),
      Promise.resolve(buildTemplate(notification_type, context ?? {})),
    ]);

    const result = await queueNotification(supabase, user.id, prefs, {
      notification_type,
      title:    template.title,
      message:  template.body,
      severity: template.severity,
      metadata: context,
    });

    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
