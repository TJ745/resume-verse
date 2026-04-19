import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { execSync } from "child_process";

export const runtime = "nodejs";
export const maxDuration = 30;

// ── Find the system Chrome / Chromium executable ──────────
// Works on Windows, macOS and Linux without installing a
// separate Puppeteer-bundled Chrome binary.
function findChrome(): string {
  // 1. Explicit override in .env
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH;
  }

  // 2. Common Windows paths
  const win = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];
  for (const p of win) {
    try {
      // fs.existsSync is not available at module level in edge runtime,
      // but this route is nodejs runtime so it's fine.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      if (require("fs").existsSync(p)) return p;
    } catch {
      /* skip */
    }
  }

  // 3. macOS
  const mac = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  for (const p of mac) {
    try {
      if (require("fs").existsSync(p)) return p;
    } catch {
      /* skip */
    }
  }

  // 4. Linux — try `which`
  try {
    const path = execSync(
      "which chromium-browser || which chromium || which google-chrome || which google-chrome-stable",
      { stdio: ["pipe", "pipe", "pipe"] },
    )
      .toString()
      .trim()
      .split("\n")[0];
    if (path) return path;
  } catch {
    /* not found */
  }

  throw new Error(
    "Chrome not found. Either:\n" +
      "  • Install Google Chrome normally, OR\n" +
      "  • Set CHROME_EXECUTABLE_PATH=/path/to/chrome in your .env.local",
  );
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get("resumeId");
  const qTemplate = searchParams.get("template");
  const qScheme = searchParams.get("colorScheme");
  const qFont = searchParams.get("font");
  const qFontSize = searchParams.get("fontSize");

  if (!resumeId) return new NextResponse("Missing resumeId", { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });
  if (!resume) return new NextResponse("Resume not found", { status: 404 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const printParams = new URLSearchParams({
    template: qTemplate ?? resume.template ?? "modern",
    colorScheme: qScheme ?? resume.colorScheme ?? "terracotta",
    font:
      qFont ??
      ((resume as Record<string, unknown>).font as string) ??
      "dm-sans",
    fontSize:
      qFontSize ??
      ((resume as Record<string, unknown>).fontSize as string) ??
      "md",
  });
  const printUrl = `${baseUrl}/resume/${resumeId}/print?${printParams.toString()}`;

  let executablePath: string;
  try {
    executablePath = findChrome();
  } catch (err) {
    console.error(err);
    return new NextResponse((err as Error).message, { status: 500 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // Forward session cookie so the auth-protected print page loads
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

    if (cookies.length) await page.setCookie(...cookies);

    await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 25000 });

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
