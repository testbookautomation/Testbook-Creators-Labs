import { NextResponse } from "next/server";
import { webhookGet } from "@/lib/webhook";

export async function GET() {
  const result = await webhookGet({ type: "ping" });
  return NextResponse.json(result);
}
