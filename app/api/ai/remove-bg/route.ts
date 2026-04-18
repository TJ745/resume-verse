import { auth }    from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime     = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/ai/remove-bg
 * Body: { imageBase64: string }   (full data URL or raw base64)
 * Returns: { resultBase64: string }  — PNG with transparent background (data URL)
 *
 * Uses remove.bg API for pixel-perfect AI background removal.
 * Falls back gracefully if REMOVE_BG_API_KEY is not set.
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { imageBase64 } = await request.json() as { imageBase64?: string };
  if (!imageBase64) return new NextResponse("Missing imageBase64", { status: 400 });

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    // No API key — tell client to do client-side only (crop only, no bg removal)
    return NextResponse.json({ resultBase64: null, reason: "no_api_key" });
  }

  try {
    // Strip data URL prefix, get raw base64
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const binary     = Buffer.from(base64Data, "base64");

    // Call remove.bg
    const formData = new FormData();
    formData.append("image_file",    new Blob([binary], { type: "image/jpeg" }), "photo.jpg");
    formData.append("size",          "auto");
    formData.append("type",          "person");
    formData.append("type_level",    "2");
    formData.append("format",        "png");

    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method:  "POST",
      headers: { "X-Api-Key": apiKey },
      body:    formData,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("remove.bg error:", res.status, err);
      return NextResponse.json({ resultBase64: null, reason: "api_error" });
    }

    const buffer     = await res.arrayBuffer();
    const resultB64  = Buffer.from(buffer).toString("base64");
    return NextResponse.json({ resultBase64: `data:image/png;base64,${resultB64}` });

  } catch (err) {
    console.error("remove-bg route failed:", err);
    return NextResponse.json({ resultBase64: null, reason: "error" });
  }
}