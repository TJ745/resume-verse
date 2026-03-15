import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { resumeText, jobDescription, questionTypes } = await request.json();

  if (!resumeText) return new Response("Missing resumeText", { status: 400 });

  const hasJD = jobDescription?.trim().length > 20;

  // questionTypes: array of "behavioral" | "technical" | "situational" | "culture"
  const types: string[] = questionTypes?.length
    ? questionTypes
    : ["behavioral", "technical", "situational"];

  const prompt = `You are a senior interviewer and career coach. Generate targeted interview questions based on this resume${hasJD ? " and job description" : ""}.

RESUME:
${resumeText}

${hasJD ? `JOB DESCRIPTION:\n${jobDescription}\n` : ""}
Generate questions across these categories: ${types.join(", ")}.

Return ONLY a valid JSON array, no markdown:
[
  {
    "category": <"behavioral" | "technical" | "situational" | "culture" | "resume_specific">,
    "difficulty": <"easy" | "medium" | "hard">,
    "question": <the interview question>,
    "whyAsked": <one sentence: why interviewers ask this and what they're looking for>,
    "tipToAnswer": <one sentence: how to best answer this — frameworks, what to highlight>
  }
]

Rules:
- Generate 12-15 questions total spread across categories
- resume_specific: 3-4 questions that directly reference specific jobs, skills, or projects from this resume
- behavioral: "Tell me about a time…" questions referencing actual experience from the resume
- technical: skills/tools mentioned in the resume — practical application questions
- situational: "What would you do if…" scenarios relevant to the target role
- culture: values, work style, team fit
- ${hasJD ? "Weight heavily toward the JD's required skills and responsibilities" : "Base questions on the resume's strongest experience"}
- Difficulty: easy = warm-up, medium = core, hard = stretch/senior-level
- Make questions feel like they come from a real interviewer, not a template

Output only the raw JSON array.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1800,
      temperature: 0.6,
      messages: [
        { role: "system", content: "You are an expert interviewer. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
    });

    const raw    = completion.choices[0]?.message?.content ?? "[]";
    const clean  = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ questions: parsed });
  } catch (err) {
    console.error("Interview prep error:", err);
    return new Response("Generation failed", { status: 500 });
  }
}