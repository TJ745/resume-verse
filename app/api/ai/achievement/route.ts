import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { duty, role, company, industry } = await request.json();

  if (!duty?.trim()) return new Response("Missing duty", { status: 400 });

  const context = [
    role    && `Role: ${role}`,
    company && `Company: ${company}`,
    industry && `Industry: ${industry}`,
  ].filter(Boolean).join("\n");

  const prompt = `You are an expert resume writer specializing in converting vague job duties into powerful, quantified achievement statements.

INPUT DUTY:
"${duty}"

${context ? `CONTEXT:\n${context}\n` : ""}
Generate 3 variations of this duty as strong achievement bullet points. Each must:
- Start with a powerful action verb (Led, Built, Reduced, Increased, Launched, Delivered, etc.)
- Include at least one specific metric or quantified result (%, $, time saved, team size, etc.)
- Be concise (one sentence, under 20 words)
- Sound authentic and realistic — don't invent wild numbers
- If no context is given, use sensible estimates appropriate for a mid-level professional

Return ONLY a valid JSON array of 3 strings, no markdown, no explanation:
["achievement 1", "achievement 2", "achievement 3"]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a resume writing expert. Return only a JSON array of 3 strings.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw   = completion.choices[0]?.message?.content ?? "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ achievements: parsed });
  } catch (err) {
    console.error("Achievement generator error:", err);
    return new Response("Generation failed", { status: 500 });
  }
}