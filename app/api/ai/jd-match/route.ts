import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { resumeText, jobDescription, sections } = await request.json();

  if (!resumeText || !jobDescription) {
    return new Response("Missing resumeText or jobDescription", {
      status: 400,
    });
  }

  const prompt = `You are a senior resume optimization expert. Analyze the resume against the job description and return targeted rewrites to maximize ATS match and relevance.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

CURRENT SECTIONS (JSON):
${JSON.stringify(sections, null, 2)}

Return ONLY a valid JSON object with this exact shape (no markdown fences):
{
  "matchScore": <integer 0-100, how well resume currently matches JD>,
  "matchLabel": <"Poor" | "Fair" | "Good" | "Excellent">,
  "topKeywords": [<8-12 most important keywords from JD>],
  "missingKeywords": [<keywords in JD not found in resume, max 10>],
  "rewrites": [
    {
      "sectionId": <id from sections array, or null if new>,
      "sectionType": <"summary" | "skills" | "experience">,
      "sectionTitle": <title string>,
      "field": <"text" | "bullets" | "categories">,
      "itemId": <id of specific item in array sections, or null for summary/skills>,
      "label": <short human label, e.g. "Summary" or "Software Engineer @ Acme bullets">,
      "original": <the current text as a single string>,
      "optimized": <the rewritten version as a single string, same format>,
      "reason": <one sentence why this improves JD match>
    }
  ]
}

Rules for rewrites:
- Summary: rewrite to mirror JD language and emphasize matching skills
- Skills: suggest adding missing JD keywords as new category or into existing ones  
- Experience bullets: rewrite 1-2 bullets per job to use JD terminology and quantify impact
- Only include sections that have meaningful optimization potential
- Keep rewrites authentic — do not invent experience or skills not implied in original
- Limit to max 6 rewrites total, prioritize highest-impact changes
- For bullets field, optimized should be the full rewritten bullet text (single string)
- For categories field, optimized should be "CategoryName: skill1, skill2, skill3" format

Output only the raw JSON.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a resume optimization expert. Return only valid JSON, no markdown, no explanation.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (err) {
    console.error("JD match error:", err);
    return new Response("Analysis failed", { status: 500 });
  }
}
