import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { fields } = await request.json();
  // fields: Array<{ sectionId, sectionType, label, text }>

  if (!fields?.length) return new Response("Missing fields", { status: 400 });

  const prompt = `You are a professional resume editor specializing in grammar, clarity, and impact. Review each text field below and identify issues.

FIELDS TO REVIEW:
${fields.map((f: { label: string; text: string }, i: number) => `[${i}] ${f.label}:\n${f.text}`).join("\n\n")}

Return ONLY a valid JSON array (no markdown fences):
[
  {
    "fieldIndex": <index from the list above>,
    "sectionId": <copy sectionId from input>,
    "sectionType": <copy sectionType from input>,
    "label": <copy label from input>,
    "original": <the exact problematic phrase or sentence>,
    "fixed": <the corrected version>,
    "issueType": <"grammar" | "passive_voice" | "weak_verb" | "clarity" | "wordiness" | "typo" | "cliche">,
    "severity": <"high" | "medium" | "low">,
    "explanation": <one short sentence explaining the issue>
  }
]

Issue detection rules:
- grammar: spelling mistakes, incorrect punctuation, subject-verb disagreement
- passive_voice: "was managed by", "were responsible for", "has been used" — suggest active alternatives
- weak_verb: "helped with", "worked on", "was involved in", "assisted" — suggest strong action verbs
- clarity: vague or ambiguous phrasing that could be more specific
- wordiness: unnecessarily long phrases that can be shortened
- typo: obvious spelling errors
- cliche: overused resume phrases like "team player", "hard worker", "go-getter", "detail-oriented"

Severity:
- high: grammar errors, typos, passive voice in bullets
- medium: weak verbs, clichés
- low: minor clarity or wordiness issues

Rules:
- Only flag real issues — do not invent problems
- For each field, report at most 3 issues (the most impactful ones)
- If a field is well-written, skip it entirely
- Keep fixed versions concise and natural
- Total issues across all fields: max 15

Output only the raw JSON array. If no issues found, return [].`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1400,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a resume grammar and clarity editor. Return only valid JSON arrays, no markdown.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (err) {
    console.error("Grammar check error:", err);
    return new Response("Check failed", { status: 500 });
  }
}
