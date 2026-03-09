import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get("resumeId");

  if (!resumeId) {
    return new NextResponse("Missing resumeId", { status: 400 });
  }

  // Verify ownership
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });

  if (!resume) {
    return new NextResponse("Resume not found", { status: 404 });
  }

  // Build the print URL — Puppeteer visits this page
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const printUrl = `${baseUrl}/resume/${resumeId}/print`;

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Pass the session cookie so the print page can auth
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookies = cookieHeader
      .split(";")
      .map((c) => {
        const [name, ...rest] = c.trim().split("=");
        return {
          name: name.trim(),
          value: rest.join("=").trim(),
          domain: new URL(baseUrl).hostname,
        };
      })
      .filter((c) => c.name && c.value);

    if (cookies.length) {
      await page.setCookie(...cookies);
    }

    await page.goto(printUrl, {
      waitUntil: "networkidle0",
      timeout: 20000,
    });

    // A4 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const safeTitle = resume.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeTitle}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await browser.close();
  }
}
