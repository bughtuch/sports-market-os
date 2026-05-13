import { NextResponse } from "next/server";
import { routeNews } from "@/lib/providers/providerRouter";

export async function GET() {
  try {
    const data = await routeNews();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "News feed unavailable", items: [], meta: null },
      { status: 503 }
    );
  }
}
