// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer-core";
// import { execSync } from "child_process";

// export const runtime = "nodejs";
// export const maxDuration = 30;

// // ── Find the system Chrome / Chromium executable ──────────
// // Works on Windows, macOS and Linux without installing a
// // separate Puppeteer-bundled Chrome binary.
// function findChrome(): string {
//   // 1. Explicit override in .env
//   if (process.env.CHROME_EXECUTABLE_PATH) {
//     return process.env.CHROME_EXECUTABLE_PATH;
//   }

//   // 2. Common Windows paths
//   const win = [
//     "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//     "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
//     `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
//     `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
//     "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
//     `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
//   ];
//   for (const p of win) {
//     try {
//       // fs.existsSync is not available at module level in edge runtime,
//       // but this route is nodejs runtime so it's fine.
//       // eslint-disable-next-line @typescript-eslint/no-require-imports
//       if (require("fs").existsSync(p)) return p;
//     } catch {
//       /* skip */
//     }
//   }

//   // 3. macOS
//   const mac = [
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//     "/Applications/Chromium.app/Contents/MacOS/Chromium",
//     "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
//   ];
//   for (const p of mac) {
//     try {
//       if (require("fs").existsSync(p)) return p;
//     } catch {
//       /* skip */
//     }
//   }

//   // 4. Linux — try `which`
//   try {
//     const path = execSync(
//       "which chromium-browser || which chromium || which google-chrome || which google-chrome-stable",
//       { stdio: ["pipe", "pipe", "pipe"] },
//     )
//       .toString()
//       .trim()
//       .split("\n")[0];
//     if (path) return path;
//   } catch {
//     /* not found */
//   }

//   throw new Error(
//     "Chrome not found. Either:\n" +
//       "  • Install Google Chrome normally, OR\n" +
//       "  • Set CHROME_EXECUTABLE_PATH=/path/to/chrome in your .env.local",
//   );
// }

// export async function GET(request: NextRequest) {
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) return new NextResponse("Unauthorized", { status: 401 });

//   const { searchParams } = new URL(request.url);
//   const resumeId = searchParams.get("resumeId");
//   const qTemplate = searchParams.get("template");
//   const qScheme = searchParams.get("colorScheme");
//   const qFont = searchParams.get("font");
//   const qFontSize = searchParams.get("fontSize");

//   if (!resumeId) return new NextResponse("Missing resumeId", { status: 400 });

//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, userId: session.user.id },
//   });
//   if (!resume) return new NextResponse("Resume not found", { status: 404 });

//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
//   const printParams = new URLSearchParams({
//     template: qTemplate ?? resume.template ?? "modern",
//     colorScheme: qScheme ?? resume.colorScheme ?? "terracotta",
//     font:
//       qFont ??
//       ((resume as Record<string, unknown>).font as string) ??
//       "dm-sans",
//     fontSize:
//       qFontSize ??
//       ((resume as Record<string, unknown>).fontSize as string) ??
//       "md",
//   });
//   const printUrl = `${baseUrl}/resume/${resumeId}/print?${printParams.toString()}`;

//   let executablePath: string;
//   try {
//     executablePath = findChrome();
//   } catch (err) {
//     console.error(err);
//     return new NextResponse((err as Error).message, { status: 500 });
//   }

//   const browser = await puppeteer.launch({
//     headless: true,
//     executablePath,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-gpu",
//     ],
//   });

//   try {
//     const page = await browser.newPage();

//     // Forward session cookie so the auth-protected print page loads
//     const cookieHeader = request.headers.get("cookie") ?? "";
//     const cookies = cookieHeader
//       .split(";")
//       .map((c) => {
//         const [name, ...rest] = c.trim().split("=");
//         return {
//           name: name.trim(),
//           value: rest.join("=").trim(),
//           domain: new URL(baseUrl).hostname,
//         };
//       })
//       .filter((c) => c.name && c.value);

//     if (cookies.length) await page.setCookie(...cookies);

//     await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 25000 });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: 0, right: 0, bottom: 0, left: 0 },
//     });

//     const safeTitle = resume.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `inline; filename="${safeTitle}.pdf"`,
//         "Cache-Control": "no-store",
//       },
//     });
//   } finally {
//     await browser.close();
//   }
// }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { execSync } from "child_process";

export const runtime = "nodejs";
export const maxDuration = 60; // increased — Google Fonts + first compile can be slow

// ── Find system Chrome / Chromium ─────────────────────────

function findChrome(): string {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH;
  }

  // Windows
  const win = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs");
  for (const p of win) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* skip */
    }
  }

  // macOS
  const mac = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  for (const p of mac) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* skip */
    }
  }

  // Linux
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
    "Chrome not found.\n" +
      "  • Install Google Chrome, OR\n" +
      "  • Set CHROME_EXECUTABLE_PATH=/path/to/chrome in .env.local",
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
  const qStyleOverrides = searchParams.get("styleOverrides");

  if (!resumeId) return new NextResponse("Missing resumeId", { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });
  if (!resume) return new NextResponse("Resume not found", { status: 404 });

  // ── Build print URL ───────────────────────────────────────
  const db = resume as typeof resume & { font?: string; fontSize?: string };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const printParams = new URLSearchParams({
    template: qTemplate ?? db.template ?? "modern",
    colorScheme: qScheme ?? db.colorScheme ?? "terracotta",
    font: qFont ?? db.font ?? "dm-sans",
    fontSize: qFontSize ?? db.fontSize ?? "md",
  });
  // Forward live styleOverrides from the client — takes priority over DB
  if (qStyleOverrides) {
    printParams.set("styleOverrides", qStyleOverrides);
  }
  const printUrl = `${baseUrl}/resume/${resumeId}/print?${printParams.toString()}`;

  // ── Launch Puppeteer ──────────────────────────────────────
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
      "--disable-web-security", // allows cross-origin cookies in headless
      "--allow-running-insecure-content",
    ],
  });

  try {
    const page = await browser.newPage();

    // ── Set viewport to A4 at 96 dpi ─────────────────────────
    await page.setViewport({ width: 794, height: 1123 });

    // ── Forward session cookie ────────────────────────────────
    // Two methods for reliability:
    // 1. setCookie — Puppeteer's built-in cookie jar
    // 2. setExtraHTTPHeaders — raw cookie header on every request
    const cookieHeader = request.headers.get("cookie") ?? "";

    if (cookieHeader) {
      const hostname = new URL(baseUrl).hostname;
      const cookies = cookieHeader
        .split(";")
        .map((c) => {
          const eqIdx = c.indexOf("=");
          if (eqIdx === -1) return null;
          const name = c.slice(0, eqIdx).trim();
          const value = c.slice(eqIdx + 1).trim();
          return name && value ? { name, value, domain: hostname } : null;
        })
        .filter(Boolean) as { name: string; value: string; domain: string }[];

      if (cookies.length) {
        await page.setCookie(...cookies);
      }
      // Also send as raw header — catches edge cases with SameSite cookies
      await page.setExtraHTTPHeaders({ cookie: cookieHeader });
    }

    // ── Navigate to print page ────────────────────────────────
    // Use "domcontentloaded" instead of "networkidle0":
    // networkidle0 waits for ALL network to go silent — Google Fonts alone
    // can delay this by 3–5s and the 25s timeout is easily hit.
    // domcontentloaded fires as soon as the HTML + inline scripts are parsed.
    // We then wait for the resume wrapper to appear before printing.
    await page.goto(printUrl, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Wait for the .page div which wraps the resume template
    await page.waitForSelector(".page", { timeout: 15000 });

    // Small extra wait for web fonts to render (avoids FOUT in PDF)
    await page.evaluate(() =>
      document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 300))),
    );

    // ── Generate PDF ──────────────────────────────────────────
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const safeTitle = resume.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new NextResponse(Buffer.from(pdfBuffer), {
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
