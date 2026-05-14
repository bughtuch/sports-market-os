import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchLatestBrief } from "@/lib/dailyBriefs/briefPersistence";
import { generateDailyBrief } from "@/lib/briefs/dailyBriefGenerator";
import { scoreBrief } from "@/lib/dailyBriefs/briefScoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  // Try persisted brief first
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const persisted = await fetchLatestBrief(supabase);
      if (persisted) return NextResponse.json({ brief: persisted, source: "persisted" });
    }
  }

  // Fall back to in-memory generation
  const brief  = generateDailyBrief();
  const scores = scoreBrief(brief);
  return NextResponse.json({ brief, scores, source: "generated" });
}
