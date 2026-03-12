import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { resumeText, jobDescription, tone, hiringManager, companyName } =
    await request.json();

  if (!resumeText) return new Response("Missing resumeText", { status: 400 });

  const toneGuide =
    tone === "friendly"
      ? "warm, personable, and conversational — professional but approachable"
      : tone === "confident"
        ? "bold, direct, and confident — assertive without being arrogant"
        : "polished, formal, and professional";

  const prompt = `You are an expert cover letter writer. Write a compelling, tailored cover letter based on the resume and job description below.

RESUME:
${resumeText}

${jobDescription?.trim() ? `JOB DESCRIPTION:\n${jobDescription}` : "No job description provided — write a general cover letter based on the resume."}

TONE: ${toneGuide}
${hiringManager?.trim() ? `HIRING MANAGER: ${hiringManager}` : ""}
${companyName?.trim() ? `COMPANY: ${companyName}` : ""}

Requirements:
- Opening paragraph: hook with genuine enthusiasm and the specific role/company
- Middle 2 paragraphs: connect 2-3 specific achievements from the resume to the JD requirements
- Closing paragraph: clear call to action, confident close
- Total length: 3-4 paragraphs, ~250-320 words
- Use ${hiringManager?.trim() ? `"Dear ${hiringManager},"` : '"Dear Hiring Manager,"'} as salutation
- End with "Sincerely," then a blank line for signature
- Do NOT use placeholders like [Company] — use the actual company name if provided, or omit it naturally
- Do NOT add a subject line or header — start directly with the salutation
- Output only the cover letter text, nothing else`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 600,
    temperature: 0.75,
    messages: [
      {
        role: "system",
        content:
          "You are a professional cover letter writer. Write compelling, natural cover letters. Output only the letter text.",
      },
      { role: "user", content: prompt },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
