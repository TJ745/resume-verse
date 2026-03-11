// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";
// export const maxDuration = 30;

// export async function POST(request: NextRequest) {
//   // Auth check
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   const { systemPrompt, userMessage, isPdf } = (await request.json()) as {
//     systemPrompt: string;
//     userMessage: string | Array<Record<string, unknown>>;
//     isPdf: boolean;
//   };

//   // Build message content
//   const content = Array.isArray(userMessage) ? userMessage : userMessage;

//   const res = await fetch("https://api.anthropic.com/v1/messages", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
//       "anthropic-version": "2023-06-01",
//       ...(isPdf ? { "anthropic-beta": "pdfs-2024-09-25" } : {}),
//     },
//     body: JSON.stringify({
//       model: "claude-opus-4-6",
//       max_tokens: 4096,
//       system: systemPrompt,
//       messages: [
//         {
//           role: "user",
//           content,
//         },
//       ],
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     console.error("Anthropic API error:", err);
//     return new NextResponse("AI parsing failed. Please try again.", {
//       status: 502,
//     });
//   }

//   const data = (await res.json()) as {
//     content: Array<{ type: string; text?: string }>;
//   };

//   const text = data.content
//     .filter((b) => b.type === "text")
//     .map((b) => b.text ?? "")
//     .join("");

//   // Strip any accidental markdown fences
//   const clean = text
//     .replace(/^```json\s*/i, "")
//     .replace(/^```\s*/i, "")
//     .replace(/```\s*$/i, "")
//     .trim();

//   return new NextResponse(clean, {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }

import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { systemPrompt, userMessage, isPdf } = (await request.json()) as {
    systemPrompt: string;
    userMessage: string | Array<Record<string, unknown>>;
    isPdf: boolean;
  };

  // For PDF: send as base64 image (GPT-4o can read PDF pages as images)
  // For text: send as plain text content
  let content: Parameters<
    typeof openai.chat.completions.create
  >[0]["messages"][0]["content"];

  if (isPdf && Array.isArray(userMessage)) {
    // Extract the base64 data from the document block
    const docBlock = userMessage.find(
      (b) => (b as Record<string, unknown>).type === "document",
    ) as Record<string, unknown> | undefined;

    const source = docBlock?.source as Record<string, unknown> | undefined;
    const base64 = source?.data as string | undefined;

    if (base64) {
      // Send PDF pages as a base64-encoded file using GPT-4o's file vision
      content = [
        {
          type: "text",
          text: "Parse this resume and return the JSON structure as instructed.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:application/pdf;base64,${base64}`,
            detail: "high",
          },
        },
      ];
    } else {
      content =
        "Parse this resume and return the JSON structure as instructed.";
    }
  } else {
    content =
      typeof userMessage === "string"
        ? userMessage
        : JSON.stringify(userMessage);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // Strip any accidental markdown fences
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return new NextResponse(clean, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI parsing failed";
    console.error("parse-resume error:", msg);
    return new NextResponse("AI parsing failed. Please try again.", {
      status: 502,
    });
  }
}
