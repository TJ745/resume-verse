import { openai } from "@/lib/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Parse "Jan 2022" / "2022-01" / "January 2022" → Date
function parseDate(str: string): Date | null {
  if (!str?.trim()) return null;
  const months: Record<string, number> = {
    jan:1,feb:2,mar:3,apr:4,may:5,jun:6,
    jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,
  };
  // "Jan 2022" or "January 2022"
  const m = str.trim().match(/^([a-z]+)[\s.-]*(\d{4})$/i);
  if (m) {
    const mo = months[m[1].toLowerCase().slice(0, 3)];
    if (mo) return new Date(parseInt(m[2]), mo - 1, 1);
  }
  // "2022-01" or "2022/01"
  const m2 = str.trim().match(/^(\d{4})[-/](\d{1,2})$/);
  if (m2) return new Date(parseInt(m2[1]), parseInt(m2[2]) - 1, 1);
  // Just a year "2022"
  const m3 = str.trim().match(/^(\d{4})$/);
  if (m3) return new Date(parseInt(m3[1]), 0, 1);
  return null;
}

function monthsBetween(a: Date, b: Date): number {
  return Math.abs((b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
}

interface JobEntry { role: string; company: string; startDate: string; endDate: string; current: boolean; }

interface Gap {
  from:   string;
  to:     string;
  months: number;
  after:  string; // job title + company that ended
  before: string; // job title + company that started after
}

function detectGaps(jobs: JobEntry[]): Gap[] {
  // Sort by start date ascending
  const sorted = [...jobs]
    .map((j) => ({ ...j, startParsed: parseDate(j.startDate), endParsed: j.current ? new Date() : parseDate(j.endDate) }))
    .filter((j) => j.startParsed && j.endParsed)
    .sort((a, b) => a.startParsed!.getTime() - b.startParsed!.getTime());

  const gaps: Gap[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    const gapMonths = monthsBetween(curr.endParsed!, next.startParsed!);
    // Only flag gaps >= 3 months where next starts AFTER current ends
    if (gapMonths >= 3 && next.startParsed! > curr.endParsed!) {
      gaps.push({
        from:   curr.endDate || "Unknown",
        to:     next.startDate || "Unknown",
        months: gapMonths,
        after:  [curr.role, curr.company].filter(Boolean).join(" @ ") || "Previous role",
        before: [next.role, next.company].filter(Boolean).join(" @ ") || "Next role",
      });
    }
  }
  return gaps;
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { jobs } = await request.json() as { jobs: JobEntry[] };

  if (!Array.isArray(jobs) || jobs.length < 2) {
    return Response.json({ gaps: [] });
  }

  const gaps = detectGaps(jobs);

  if (gaps.length === 0) {
    return Response.json({ gaps: [] });
  }

  const prompt = `You are a career coach helping job seekers professionally explain employment gaps on their resume.

DETECTED GAPS:
${gaps.map((g, i) => `Gap ${i + 1}: ${g.months} months between "${g.after}" (ended ${g.from}) and "${g.before}" (started ${g.to})`).join("\n")}

For each gap, provide 3 professional explanation options that are:
- Brief and confident (1-2 sentences each)
- Positive and forward-focused
- Authentic — suggest realistic reasons (caregiving, health, education, relocation, freelancing, job market, personal development, burnout recovery, etc.)
- Appropriate for including in a resume summary OR saying in an interview

Return ONLY a valid JSON array, no markdown:
[
  {
    "gapIndex": 0,
    "from": "<from date>",
    "to": "<to date>",
    "months": <number>,
    "label": "<e.g. '8-month gap (2021-2022)'>",
    "explanations": [
      { "reason": "<short label e.g. 'Family Caregiving'>", "text": "<1-2 sentence explanation>" },
      { "reason": "<short label>", "text": "<explanation>" },
      { "reason": "<short label>", "text": "<explanation>" }
    ]
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 800,
      temperature: 0.6,
      messages: [
        { role: "system", content: "You are a career coach. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
    });

    const raw    = completion.choices[0]?.message?.content ?? "[]";
    const clean  = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json({ gaps: parsed });
  } catch (err) {
    console.error("Career gap error:", err);
    return new Response("Analysis failed", { status: 500 });
  }
}