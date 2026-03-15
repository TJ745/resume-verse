import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { checkAIUsage } from "@/lib/ai-gate";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  // ── AI usage gate ──────────────────────────────────────
  const gate = await checkAIUsage(session.user.id);
  if (!gate.allowed) {
    return Response.json(
      { error: gate.reason, upgradeRequired: true, used: gate.used, limit: gate.limit },
      { status: 402 }
    );
  }

  const { resumeText, jobDescription } = await request.json();

  if (!resumeText) return new Response("Missing resumeText", { status: 400 });

  const hasJD = jobDescription && jobDescription.trim().length > 20;

  const prompt = `You are a senior ATS (Applicant Tracking System) specialist. Analyse the resume below${hasJD ? " against the provided job description" : ""} and return a JSON object — nothing else, no markdown fences.

RESUME:
${resumeText}

${hasJD ? `JOB DESCRIPTION:\n${jobDescription}` : ""}

Return EXACTLY this JSON shape:
{
  "score": <integer 0-100>,
  "scoreLabel": <"Poor" | "Fair" | "Good" | "Excellent">,
  "summary": <one sentence explaining the overall score>,
  "keywords": {
    "matched": [<keywords found in resume, max 12>],
    "missing": [<important keywords from JD not found in resume, max 12. Empty array if no JD provided>]
  },
  "formatting": [
    { "pass": <true|false>, "label": <short label>, "detail": <one sentence> }
  ],
  "suggestions": [
    { "priority": <"high"|"medium"|"low">, "text": <actionable suggestion, one sentence> }
  ]
}

Formatting checks to always include (evaluate each honestly):
1. Standard section headings present (Experience, Education, Skills)
2. Contact information complete (name, email, phone)
3. No tables or multi-column layout issues for ATS
4. Appropriate resume length (not too short, not too long)
5. Action verbs used in experience bullets
6. Quantifiable achievements present
7. No excessive special characters or symbols

Suggestions: provide 4-6 actionable suggestions ordered by priority.
Score rubric: 0-40 Poor, 41-60 Fair, 61-80 Good, 81-100 Excellent.
${hasJD ? "Weight keyword match heavily (40% of score) when JD is provided." : "Score based on formatting, completeness, and best practices only."}

Output only the raw JSON object.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1200,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are an ATS resume analysis expert. Return only valid JSON, no markdown, no explanation.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (err) {
    console.error("ATS analysis error:", err);
    return new Response("Analysis failed", { status: 500 });
  }
}
