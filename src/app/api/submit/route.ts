import { NextRequest, NextResponse } from "next/server";
import { webhookPost } from "@/lib/webhook";

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

async function parseBody(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return req.json();
  }

  const form = await req.formData();
  const videoFile = form.get("videoFile");
  const body: Record<string, unknown> = {};

  form.forEach((value, key) => {
    if (key !== "videoFile") body[key] = String(value);
  });

  body.upiConfirm = body.upiConfirm === "true";
  body.consent = body.consent === "true";

  if (videoFile instanceof File && videoFile.size > 0) {
    if (!videoFile.type.startsWith("video/")) {
      return { ...body, uploadError: "Uploaded file must be a video" };
    }

    if (videoFile.size > MAX_VIDEO_BYTES) {
      return { ...body, uploadError: "Video file must be 50 MB or smaller" };
    }

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    body.videoFileName = videoFile.name;
    body.videoMimeType = videoFile.type || "video/mp4";
    body.videoBase64 = buffer.toString("base64");
  }

  return body;
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req);

    if (body.uploadError) {
      return NextResponse.json(
        { success: false, error: body.uploadError },
        { status: 400 }
      );
    }

    // Basic server-side validation
    if (!body.phone || !body.name || (!body.videoLink && !body.videoBase64)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, phone, video" },
        { status: 400 }
      );
    }

    if (body.videoLink && typeof body.videoLink === "string" && !body.videoLink.startsWith("http")) {
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
