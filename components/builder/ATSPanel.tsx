"use client";

import { useState, useEffect } from "react";
import type { ResumeData, ResumeSection } from "@/types/resume";

interface ATSResult {
  score: number;
  scoreLabel: "Poor" | "Fair" | "Good" | "Excellent";
  summary: string;
  keywords: { matched: string[]; missing: string[] };
  formatting: { pass: boolean; label: string; detail: string }[];
  suggestions: { priority: "high" | "medium" | "low"; text: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}

function buildResumeText(
  resume: ResumeData,
  sections: ResumeSection[],
): string {
  const lines: string[] = [];
  const p = resume.personalInfo;
  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  if (p?.email) lines.push(p.email);
  if (p?.phone) lines.push(p.phone);
  if (p?.linkedin) lines.push(p.linkedin);
  if (p?.github) lines.push(p.github);
  for (const s of [...sections].sort((a, b) => a.order - b.order)) {
    lines.push(`\n${s.title.toUpperCase()}`);
    const c = s.content;
    if (
      s.type === "summary" &&
      c &&
      typeof c === "object" &&
      "text" in (c as object)
    ) {
      lines.push((c as { text: string }).text ?? "");
    } else if (Array.isArray(c)) {
      for (const item of c as unknown as Record<string, unknown>[]) {
        const parts: string[] = [];
        if (item.role) parts.push(String(item.role));
        if (item.company) parts.push(String(item.company));
        if (item.institution) parts.push(String(item.institution));
        if (item.degree) parts.push(String(item.degree));
        if (item.name) parts.push(String(item.name));
        if (item.title) parts.push(String(item.title));
        if (item.language) parts.push(String(item.language));
        if (item.issuer) parts.push(String(item.issuer));
        if (parts.length) lines.push(parts.join(" | "));
        if (Array.isArray(item.bullets))
          for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
        if (item.description) lines.push(String(item.description));
        if (item.skills && typeof item.skills === "string")
          lines.push(String(item.skills));
      }
    } else if (c && typeof c === "object" && "categories" in (c as object)) {
      for (const cat of (
        c as { categories: { name: string; skills: string }[] }
      ).categories)
        lines.push(`${cat.name}: ${cat.skills}`);
    }
  }
  return lines.filter(Boolean).join("\n");
}

const scoreColor = (n: number) =>
  n >= 81 ? "#2d7a4f" : n >= 61 ? "#b7791f" : n >= 41 ? "#c84b2f" : "#9b1c1c";
const scoreTrack = (n: number) =>
  n >= 81 ? "#dcfce7" : n >= 61 ? "#fef9c3" : n >= 41 ? "#ffedd5" : "#fee2e2";
const PCOL: Record<string, string> = {
  high: "#c84b2f",
  medium: "#b7791f",
  low: "#6b7280",
};
const PBG: Record<string, string> = {
  high: "rgba(200,75,47,0.08)",
  medium: "rgba(183,121,31,0.08)",
  low: "rgba(107,114,128,0.06)",
};

export default function ATSPanel({ open, onClose, resume, sections }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<
    "score" | "keywords" | "formatting" | "suggestions"
  >("score");

  useEffect(() => {
    if (open) {
      setResult(null);
      setError("");
      setTab("score");
    }
  }, [open]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleAnalyse() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: buildResumeText(resume, sections),
          jobDescription,
        }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      setResult(await res.json());
      setTab("score");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  const passCount = result?.formatting.filter((f) => f.pass).length ?? 0;
  const totalCheck = result?.formatting.length ?? 0;

  return (
    <>
      <div
        className="fixed inset-0 z-90 bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-100 z-91 bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <ATSIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                ATS Optimizer
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                Check resume compatibility
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-4">
            <label className="block text-[0.7rem] font-semibold text-rv-muted mb-1.5 tracking-[0.04em] uppercase">
              Job Description{" "}
              <span className="font-normal normal-case tracking-normal">
                (optional — improves keyword analysis)
              </span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder="Paste the job description here for keyword matching…"
              className="w-full px-3 py-2.5 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.78rem] resize-y outline-none leading-snug focus:border-rv-accent transition-colors"
            />
          </div>

          <button
            onClick={handleAnalyse}
            disabled={loading}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold mb-5 flex items-center justify-center gap-2 transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spinner />
                Analysing…
              </>
            ) : (
              <>
                <ATSIcon white />
                {result ? "Re-analyse" : "Analyse Resume"}
              </>
            )}
          </button>

          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5 mb-4">
              {error}
            </div>
          )}

          {result && (
            <div>
              <div
                className="rounded-lg p-4 mb-4 text-center"
                style={{ background: scoreTrack(result.score) }}
              >
                <div
                  className="text-5xl font-extrabold leading-none"
                  style={{ color: scoreColor(result.score) }}
                >
                  {result.score}
                </div>
                <div
                  className="text-[0.7rem] font-bold tracking-widest uppercase mt-0.5"
                  style={{ color: scoreColor(result.score) }}
                >
                  {result.scoreLabel}
                </div>
                <div className="h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full mx-auto mt-2.5 max-w-50">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${result.score}%`,
                      background: scoreColor(result.score),
                    }}
                  />
                </div>
                <p className="text-[0.72rem] text-[#4a4540] mt-2.5 leading-snug">
                  {result.summary}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-0.5 mb-4 bg-rv-cream p-0.5 rounded-[3px]">
                {(
                  ["score", "keywords", "formatting", "suggestions"] as const
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 px-1 border-0 rounded-sm text-[0.65rem] font-semibold cursor-pointer capitalize transition-all ${tab === t ? "bg-rv-white text-rv-accent shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-transparent text-rv-muted"}`}
                  >
                    {t === "score" && "Overview"}
                    {t === "keywords" &&
                      `Keywords ${result.keywords.missing.length > 0 ? `(${result.keywords.missing.length}✗)` : "✓"}`}
                    {t === "formatting" &&
                      `Format (${passCount}/${totalCheck})`}
                    {t === "suggestions" &&
                      `Tips (${result.suggestions.length})`}
                  </button>
                ))}
              </div>

              {tab === "score" && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <StatCard
                      label="Matched"
                      value={`${result.keywords.matched.length}`}
                      sub="keywords"
                      color="#2d7a4f"
                      bg="#dcfce7"
                    />
                    <StatCard
                      label="Missing"
                      value={`${result.keywords.missing.length}`}
                      sub="keywords"
                      color={
                        result.keywords.missing.length > 0
                          ? "#c84b2f"
                          : "#2d7a4f"
                      }
                      bg={
                        result.keywords.missing.length > 0
                          ? "rgba(200,75,47,0.08)"
                          : "#dcfce7"
                      }
                    />
                    <StatCard
                      label="Checks"
                      value={`${passCount}/${totalCheck}`}
                      sub="passed"
                      color={passCount === totalCheck ? "#2d7a4f" : "#b7791f"}
                      bg={passCount === totalCheck ? "#dcfce7" : "#fef9c3"}
                    />
                  </div>
                  {result.suggestions.filter((s) => s.priority === "high")
                    .length > 0 && (
                    <div>
                      <div className="text-[0.65rem] font-bold text-rv-muted uppercase tracking-[0.06em] mb-1.5">
                        Top Priorities
                      </div>
                      {result.suggestions
                        .filter((s) => s.priority === "high")
                        .map((s, i) => (
                          <SuggestionRow key={i} s={s} />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "keywords" && (
                <div>
                  {result.keywords.matched.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[0.65rem] font-bold text-[#2d7a4f] uppercase tracking-[0.06em] mb-1.5">
                        ✓ Found ({result.keywords.matched.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords.matched.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[0.7rem] bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full border border-[#bbf7d0]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.keywords.missing.length > 0 ? (
                    <div>
                      <div className="text-[0.65rem] font-bold text-rv-accent uppercase tracking-[0.06em] mb-1.5">
                        ✗ Missing ({result.keywords.missing.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords.missing.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[0.7rem] bg-[rgba(200,75,47,0.07)] text-rv-accent px-2 py-0.5 rounded-full border border-[rgba(200,75,47,0.2)]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[0.75rem] text-[#2d7a4f] bg-[#dcfce7] px-3 py-2.5 rounded-[3px]">
                      {jobDescription.trim()
                        ? "✓ No missing keywords from the job description!"
                        : "Paste a job description above to check keyword match."}
                    </div>
                  )}
                </div>
              )}

              {tab === "formatting" && (
                <div className="flex flex-col gap-1.5">
                  {result.formatting.map((f, i) => (
                    <div
                      key={i}
                      className="flex gap-2.5 items-start px-3 py-2.5 rounded-[3px] border"
                      style={{
                        background: f.pass
                          ? "rgba(45,122,79,0.05)"
                          : "rgba(200,75,47,0.05)",
                        borderColor: f.pass
                          ? "rgba(45,122,79,0.15)"
                          : "rgba(200,75,47,0.15)",
                      }}
                    >
                      <span className="text-[0.75rem] mt-0.5 shrink-0">
                        {f.pass ? "✅" : "❌"}
                      </span>
                      <div>
                        <div
                          className="text-[0.72rem] font-semibold mb-0.5"
                          style={{ color: f.pass ? "#166534" : "#c84b2f" }}
                        >
                          {f.label}
                        </div>
                        <div className="text-[0.68rem] text-rv-muted leading-snug">
                          {f.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "suggestions" && (
                <div className="flex flex-col gap-1.5">
                  {result.suggestions.map((s, i) => (
                    <SuggestionRow key={i} s={s} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Check ATS Compatibility
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Paste a job description for keyword matching, then click
                Analyse.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-[3px] p-2 text-center" style={{ background: bg }}>
      <div className="text-xl font-extrabold leading-none" style={{ color }}>
        {value}
      </div>
      <div className="text-[0.58rem] font-semibold mt-0.5" style={{ color }}>
        {sub}
      </div>
      <div className="text-[0.58rem] text-[#6b6560] mt-0.5">{label}</div>
    </div>
  );
}

function SuggestionRow({ s }: { s: { priority: string; text: string } }) {
  return (
    <div
      className="flex gap-2 items-start px-3 py-2 rounded-[3px] border"
      style={{
        background: PBG[s.priority] ?? "transparent",
        borderColor: `${PCOL[s.priority]}22`,
      }}
    >
      <span
        className="shrink-0 mt-0.5 text-[0.58rem] font-bold px-1.5 py-px rounded-full uppercase tracking-[0.04em]"
        style={{ color: PCOL[s.priority], background: `${PCOL[s.priority]}18` }}
      >
        {s.priority}
      </span>
      <span className="text-[0.72rem] text-rv-ink leading-snug">{s.text}</span>
    </div>
  );
}

function ATSIcon({ white = false }: { white?: boolean }) {
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
      <circle cx="8" cy="8" r="7" />
      <path d="M5 8l2 2 4-4" />
    </svg>
  );
}

function Spinner() {
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
