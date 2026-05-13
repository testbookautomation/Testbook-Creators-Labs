import { NextRequest, NextResponse } from "next/server";
import { webhookPost } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.eventName) {
      return NextResponse.json(
        { success: false, error: "eventName is required" },
        { status: 400 }
      );
    }

    const result = await webhookPost({ type: "event", ...body });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
