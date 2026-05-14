/**
 * /api/distribution/posts
 *
 * GET  — list user's distribution posts (auth required)
 * POST — create a distribution post (auth required)
 * PATCH — update status (auth required)
 * DELETE — remove by id (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getDistributionPosts,
  createDistributionPost,
  updateDistributionPost,
  deleteDistributionPost,
} from "@/lib/distribution/distributionDb";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as Parameters<typeof getDistributionPosts>[1];

  const posts = await getDistributionPosts(user.id, status);
  return NextResponse.json({ posts }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { platform, content, status, distributionType, partnerCode, metadata, engagementEstimate } = body;

    if (!platform || !content) {
      return NextResponse.json({ error: "platform and content required" }, { status: 400 });
    }

    const post = await createDistributionPost(user.id, {
      platform,
      content,
      status:             status ?? "draft",
      distribution_type:  distributionType ?? null,
      partner_code:       partnerCode ?? null,
      metadata:           metadata ?? {},
      engagement_estimate: engagementEstimate ?? 0,
    });

    if (!post) return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, metadata } = body;

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const ok = await updateDistributionPost(user.id, id, {
      ...(status   !== undefined ? { status }   : {}),
      ...(metadata !== undefined ? { metadata } : {}),
    });

    return NextResponse.json({ updated: ok });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ok = await deleteDistributionPost(user.id, id);
  return NextResponse.json({ deleted: ok });
}
