"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResumeData, ResumeSection } from "@/types/resume";

interface Question {
  category:
    | "behavioral"
    | "technical"
    | "situational"
    | "culture"
    | "resume_specific";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  whyAsked: string;
  tipToAnswer: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}
type QType = "behavioral" | "technical" | "situational" | "culture";
const ALL_TYPES: QType[] = [
  "behavioral",
  "technical",
  "situational",
  "culture",
];
const CAT_COLOR: Record<string, string> = {
  behavioral: "#1e3a5f",
  technical: "#2d5a3d",
  situational: "#6b3fa0",
  culture: "#b7791f",
  resume_specific: "#c84b2f",
};
const CAT_BG: Record<string, string> = {
  behavioral: "rgba(30,58,95,0.08)",
  technical: "rgba(45,90,61,0.08)",
  situational: "rgba(107,63,160,0.08)",
  culture: "rgba(183,121,31,0.08)",
  resume_specific: "rgba(200,75,47,0.08)",
};
const DIFF_COL: Record<string, string> = {
  easy: "#2d7a4f",
  medium: "#b7791f",
  hard: "#c84b2f",
};
const CAT_LBL: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  situational: "Situational",
  culture: "Culture Fit",
  resume_specific: "Resume-Specific",
};

function buildText(resume: ResumeData, sections: ResumeSection[]): string {
  const lines: string[] = [];
  const p = resume.personalInfo;
  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  for (const s of [...sections].sort((a, b) => a.order - b.order)) {
    lines.push(`\n${s.title.toUpperCase()}`);
    const c = s.content;
    if (
      s.type === "summary" &&
      c &&
      typeof c === "object" &&
      "text" in (c as object)
    )
      lines.push((c as { text: string }).text ?? "");
    else if (Array.isArray(c))
      for (const item of c as Record<string, unknown>[]) {
        const p: string[] = [];
        if (item.role) p.push(String(item.role));
        if (item.company) p.push(String(item.company));
        if (item.institution) p.push(String(item.institution));
        if (item.degree) p.push(String(item.degree));
        if (item.name) p.push(String(item.name));
        if (p.length) lines.push(p.join(" | "));
        if (Array.isArray(item.bullets))
          for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
        if (item.description) lines.push(String(item.description));
      }
    else if (c && typeof c === "object" && "categories" in (c as object))
      for (const cat of (
        c as { categories: { name: string; skills: string }[] }
      ).categories)
        lines.push(`${cat.name}: ${cat.skills}`);
  }
  return lines.filter(Boolean).join("\n");
}

export default function InterviewPrepPanel({
  open,
  onClose,
  resume,
  sections,
}: Props) {
  const [jd, setJd] = useState("");
  const [selTypes, setSelTypes] = useState<QType[]>([
    "behavioral",
    "technical",
    "situational",
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open) {
      setQuestions([]);
      setError("");
      setExpanded(new Set());
      setFilter("all");
    }
  }, [open]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function toggleType(t: QType) {
    setSelTypes((prev) =>
      prev.includes(t)
        ? prev.length > 1
          ? prev.filter((x) => x !== t)
          : prev
        : [...prev, t],
    );
  }

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setExpanded(new Set());
    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: buildText(resume, sections),
          jobDescription: jd,
          questionTypes: selTypes,
        }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setFilter("all");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections, jd, selTypes]);

  function toggleExpand(i: number) {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  if (!open) return null;
  const cats = ["all", "resume_specific", ...selTypes] as string[];
  const filtered =
    filter === "all"
      ? questions
      : questions.filter((q) => q.category === filter);
  const counts: Record<string, number> = { all: questions.length };
  for (const q of questions) counts[q.category] = (counts[q.category] ?? 0) + 1;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-[460px] z-[91] bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <IIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                Interview Prep
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                AI questions tailored to your resume
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-rv-muted text-lg leading-none p-1 hover:text-rv-ink transition-colors"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5">
          <div>
            <SL>Question categories</SL>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((t) => {
                const on = selTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className="text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer border transition-colors"
                    style={{
                      border: `1.5px solid ${on ? CAT_COLOR[t] : "var(--rv-border)"}`,
                      background: on ? CAT_BG[t] : "var(--rv-white)",
                      color: on ? CAT_COLOR[t] : "var(--rv-muted)",
                    }}
                  >
                    {CAT_LBL[t]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <SL>
              Job Description{" "}
              <span className="font-normal normal-case">
                (optional — improves targeting)
              </span>
            </SL>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={3}
              placeholder="Paste the job description here for role-specific questions…"
              className="w-full px-3 py-2 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.78rem] resize-y outline-none leading-snug focus:border-rv-accent transition-colors"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold flex items-center justify-center gap-2 transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spin />
                Generating questions…
              </>
            ) : (
              <>
                <IIcon white />
                {questions.length ? "Regenerate" : "Generate Questions"}
              </>
            )}
          </button>
          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5">
              {error}
            </div>
          )}
          {questions.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {cats
                  .filter((c) => counts[c])
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className="text-[0.65rem] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer border transition-colors"
                      style={{
                        border: `1.5px solid ${filter === cat ? (CAT_COLOR[cat] ?? "var(--rv-ink)") : "var(--rv-border)"}`,
                        background:
                          filter === cat
                            ? (CAT_BG[cat] ?? "var(--rv-cream)")
                            : "var(--rv-white)",
                        color:
                          filter === cat
                            ? (CAT_COLOR[cat] ?? "var(--rv-ink)")
                            : "var(--rv-muted)",
                      }}
                    >
                      {cat === "all" ? "All" : CAT_LBL[cat]} ({counts[cat]})
                    </button>
                  ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {filtered.map((q, i) => {
                  const isOpen = expanded.has(i);
                  return (
                    <div
                      key={i}
                      className="border border-rv-border rounded-[3px] overflow-hidden bg-rv-white"
                    >
                      <button
                        onClick={() => toggleExpand(i)}
                        className="w-full px-3 py-2.5 bg-transparent border-0 cursor-pointer text-left flex items-start gap-2"
                      >
                        <div className="flex flex-col gap-0.5 shrink-0 pt-0.5">
                          <span
                            className="text-[0.55rem] font-bold px-1.5 py-px rounded-full"
                            style={{
                              background:
                                CAT_BG[q.category] ?? "var(--rv-cream)",
                              color: CAT_COLOR[q.category] ?? "var(--rv-muted)",
                            }}
                          >
                            {CAT_LBL[q.category]}
                          </span>
                          <span
                            className="text-[0.55rem] font-bold px-1.5 py-px rounded-full bg-[rgba(0,0,0,0.04)]"
                            style={{ color: DIFF_COL[q.difficulty] }}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <span className="text-[0.73rem] text-rv-ink leading-snug flex-1">
                          {q.question}
                        </span>
                        <span className="text-[0.65rem] text-rv-muted shrink-0 pt-0.5">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 flex flex-col gap-2 border-t border-rv-border">
                          <Tip
                            label="Why they ask this"
                            text={q.whyAsked}
                            color="#1e3a5f"
                            bg="rgba(30,58,95,0.05)"
                          />
                          <Tip
                            label="How to answer"
                            text={q.tipToAnswer}
                            color="#2d7a4f"
                            bg="rgba(45,122,79,0.05)"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!questions.length && !loading && !error && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">🎤</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Prepare for Your Interview
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Generates 12–15 questions tailored to your resume — including
                questions about your actual jobs, skills, and projects. Paste a
                JD for role-specific targeting.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Tip({
  label,
  text,
  color,
  bg,
}: {
  label: string;
  text: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="mt-1.5 rounded-sm px-2.5 py-2 border-l-2"
      style={{ background: bg, borderColor: color }}
    >
      <div
        className="text-[0.58rem] font-bold uppercase tracking-[0.06em] mb-0.5"
        style={{ color }}
      >
        {label}
      </div>
      <div className="text-[0.7rem] text-rv-ink leading-snug">{text}</div>
    </div>
  );
}
function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.65rem] font-bold text-rv-muted uppercase tracking-[0.06em] mb-1.5">
      {children}
    </div>
  );
}
function IIcon({ white = false }: { white?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke={white ? "#fff" : "var(--rv-accent)"}
      strokeWidth={1.5}
      className="shrink-0"
    >
      <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
      <path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
    </svg>
  );
}
function Spin() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="#fff"
      strokeWidth={1.5}
      className="shrink-0 animate-spin"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        strokeDasharray="28"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
