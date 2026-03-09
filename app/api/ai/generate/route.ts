import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

type GenerateRequest = {
  type: "summary" | "experience_bullets" | "skills" | "project_description";
  context: Record<string, string>;
};

function buildPrompt(
  type: GenerateRequest["type"],
  ctx: Record<string, string>,
): string {
  switch (type) {
    case "summary":
      return `You are an expert resume writer. Write a concise, compelling professional summary (3–4 sentences) for a ${ctx.jobTitle ?? "professional"} with the following background:
${ctx.background ?? "No background provided."}

Requirements:
- ATS-friendly, action-oriented language
- Highlight key strengths and value proposition
- Do NOT use first person (no "I", "my", "me")
- No bullet points, just a paragraph
- Output only the summary text, nothing else.`;

    case "experience_bullets":
      return `You are an expert resume writer. Write 3–5 strong, ATS-optimized bullet points for the following job:

Role: ${ctx.role ?? "Unknown role"}
Company: ${ctx.company ?? "Unknown company"}
Responsibilities/context: ${ctx.context ?? "Not provided"}

Requirements:
- Start each bullet with a strong action verb (Led, Built, Increased, Reduced, etc.)
- Include quantifiable results where possible (use realistic estimates if needed)
- Each bullet on its own line, starting with a dash (-)
- No preamble, no labels, output only the bullet points.`;

    case "skills":
      return `You are an expert resume writer. Generate a relevant skills list for a ${ctx.jobTitle ?? "professional"} with this experience:
${ctx.experience ?? "Not provided"}

Return skills as comma-separated values grouped into 2–3 categories.
Format exactly like this:
Frontend: React, TypeScript, Next.js, Tailwind CSS
Backend: Node.js, Prisma, PostgreSQL
Tools: Git, Docker, Figma

Output only the categorized skills, nothing else.`;

    case "project_description":
      return `You are an expert resume writer. Write a concise 2–3 sentence project description for a resume.

Project: ${ctx.name ?? "Unknown project"}
Technologies: ${ctx.technologies ?? "Not specified"}
Context: ${ctx.context ?? "Not provided"}

Requirements:
- Focus on what was built and the impact/outcome
- Mention key technologies naturally
- No bullet points, just 2–3 sentences
- Output only the description, nothing else.`;
  }
}

export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as GenerateRequest;
  const { type, context } = body;

  if (!type || !context) {
    return new Response("Missing type or context", { status: 400 });
  }

  const prompt = buildPrompt(type, context);

  // Stream from OpenAI
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 500,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Output only the requested content — no explanations, no headers, no extra commentary.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Return as a ReadableStream
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
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
