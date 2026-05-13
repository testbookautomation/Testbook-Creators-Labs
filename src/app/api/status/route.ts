import { NextRequest, NextResponse } from "next/server";
import { webhookGet } from "@/lib/webhook";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone  = searchParams.get("phone")  || "";
    const userId = searchParams.get("userId") || "";

    if (!phone && !userId) {
      return NextResponse.json(
        { success: false, error: "phone or userId query param required" },
        { status: 400 }
      );
    }

    const result = await webhookGet({ type: "status", phone, userId });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
