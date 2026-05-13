import { NextRequest, NextResponse } from "next/server";
import { webhookPost } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic server-side validation
    if (!body.phone || !body.videoLink || !body.name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, phone, videoLink" },
        { status: 400 }
      );
    }

    if (!body.videoLink.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "videoLink must be a valid URL" },
        { status: 400 }
      );
    }

    const result = await webhookPost({ type: "submit", ...body });

    if (result.error === "duplicate") {
      return NextResponse.json({ success: false, error: "duplicate" }, { status: 409 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
