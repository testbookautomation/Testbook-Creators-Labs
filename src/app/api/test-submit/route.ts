import { NextResponse } from "next/server";
import { webhookPost } from "@/lib/webhook";

// GET /api/test-submit — fires a real test submission to Apps Script
// Remove this file before production
export async function GET() {
  const result = await webhookPost({
    type:         "submit",
    name:         "Test User",
    phone:        "9999999999",
    userId:       "test-user-001",
    email:        "test@example.com",
    examCategory: "SSC CGL",
    platform:     "YouTube Shorts",
    videoLink:    "https://youtube.com/shorts/test123",
    socialHandle: "@testuser",
    caption:      "Test caption #TestbookPass",
    upiConfirm:   true,
    consent:      true,
  });

  return NextResponse.json(result);
}
