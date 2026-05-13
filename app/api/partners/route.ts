import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitPartnerApplication, getUserPartnerApplication } from "@/lib/db/partners";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const application = await getUserPartnerApplication(supabase, user.id);
  return NextResponse.json({ application });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as {
    name?: string;
    platform?: string;
    audience_size?: string;
    channel_url?: string;
    reason?: string;
  };

  if (!body.name?.trim() || !body.platform?.trim()) {
    return NextResponse.json({ error: "name and platform are required" }, { status: 400 });
  }

  const { data, error } = await submitPartnerApplication(supabase, user.id, {
    name: body.name.trim(),
    platform: body.platform.trim(),
    audience_size: body.audience_size,
    channel_url: body.channel_url,
    reason: body.reason,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ application: data }, { status: 201 });
}
