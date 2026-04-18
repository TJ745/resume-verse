"use client";

import { useState, useEffect, useCallback } from "react";
import { saveSection } from "@/actions/builder.actions";
import type {
  ResumeData,
  ResumeSection,
  SummaryContent,
  ExperienceItem,
  SkillsContent,
} from "@/types/resume";

interface Rewrite {
  sectionId: string | null;
  sectionType: "summary" | "skills" | "experience";
  sectionTitle: string;
  field: "text" | "bullets" | "categories";
  itemId: string | null;
  label: string;
  original: string;
  optimized: string;
  reason: string;
}
interface JDResult {
  matchScore: number;
  matchLabel: "Poor" | "Fair" | "Good" | "Excellent";
  topKeywords: string[];
  missingKeywords: string[];
  rewrites: Rewrite[];
}
interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

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
        if (item.skills && typeof item.skills === "string")
          lines.push(String(item.skills));
      }
    else if (c && typeof c === "object" && "categories" in (c as object))
      for (const cat of (
        c as { categories: { name: string; skills: string }[] }
      ).categories)
        lines.push(`${cat.name}: ${cat.skills}`);
  }
  return lines.filter(Boolean).join("\n");
}

const sc = (n: number) =>
  n >= 81 ? "#2d7a4f" : n >= 61 ? "#b7791f" : n >= 41 ? "#c84b2f" : "#9b1c1c";
const st = (n: number) =>
  n >= 81 ? "#dcfce7" : n >= 61 ? "#fef9c3" : n >= 41 ? "#ffedd5" : "#fee2e2";

export default function JDMatchPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<JDResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"overview" | "rewrites">("overview");

  useEffect(() => {
    if (open) {
      setResult(null);
      setError("");
      setApplied(new Set());
      setTab("overview");
    }
  }, [open]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAnalyse = useCallback(async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: buildText(resume, sections),
          jobDescription: jd,
          sections: sections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            content: s.content,
          })),
        }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      setResult(await res.json());
      setTab("overview");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections, jd]);

  const handleApply = useCallback(
    (rw: Rewrite, key: string) => {
      const section = sections.find((s) => s.id === rw.sectionId);
      if (!section) return;
      let newContent = section.content;
      if (rw.field === "text" && rw.sectionType === "summary")
        newContent = { text: rw.optimized } as SummaryContent;
      else if (
        rw.field === "bullets" &&
        rw.sectionType === "experience" &&
        rw.itemId
      )
        newContent = (section.content as ExperienceItem[]).map((exp) =>
          exp.id !== rw.itemId
            ? exp
            : {
                ...exp,
                bullets: exp.bullets.map((b) =>
                  b.trim() === rw.original.trim() ? rw.optimized : b,
                ),
              },
        );
      else if (rw.field === "categories" && rw.sectionType === "skills") {
        const [namePart, skillsPart] = rw.optimized
          .split(":")
          .map((s) => s.trim());
        const raw = section.content as SkillsContent;
        const ex = raw.categories ?? [];
        const idx = ex.findIndex(
          (c) => c.name.toLowerCase() === namePart.toLowerCase(),
        );
        newContent = {
          categories:
            idx > -1
              ? ex.map((c, i) =>
                  i === idx ? { ...c, skills: skillsPart ?? "" } : c,
                )
              : [
                  ...ex,
                  {
                    id: crypto.randomUUID(),
                    name: namePart,
                    skills: skillsPart ?? "",
                  },
                ],
        };
      }
      onSectionsChange(
        sections.map((s) =>
          s.id === section.id ? { ...s, content: newContent } : s,
        ),
      );
      saveSection(resume.id, section.id, newContent).catch(console.error);
      setApplied((prev) => new Set([...prev, key]));
    },
    [sections, resume.id, onSectionsChange],
  );

  if (!open) return null;
  const rewrites = result?.rewrites.filter((r) => r.sectionId) ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-[460px] z-[91] bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <TIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                JD Match & Optimize
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                Tailor resume to job description
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
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-3">
            <SL>
              Job Description{" "}
              <span className="font-normal normal-case">(required)</span>
            </SL>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here…"
              className="w-full px-3 py-2.5 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.78rem] resize-y outline-none leading-snug focus:border-rv-accent transition-colors"
            />
          </div>
          <button
            onClick={handleAnalyse}
            disabled={loading || !jd.trim()}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold mb-5 flex items-center justify-center gap-2 transition-colors ${loading || !jd.trim() ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spin />
                Analysing…
              </>
            ) : (
              <>
                <TIcon white />
                {result ? "Re-analyse" : "Analyse & Optimize"}
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
                className="rounded-[4px] p-3.5 mb-4 flex items-center gap-4"
                style={{ background: st(result.matchScore) }}
              >
                <div className="text-center shrink-0">
                  <div
                    className="text-[2.2rem] font-extrabold leading-none"
                    style={{ color: sc(result.matchScore) }}
                  >
                    {result.matchScore}
                  </div>
                  <div
                    className="text-[0.6rem] font-bold tracking-[0.08em] uppercase"
                    style={{ color: sc(result.matchScore) }}
                  >
                    {result.matchLabel}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-[rgba(0,0,0,0.1)] rounded-full mb-2">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${result.matchScore}%`,
                        background: sc(result.matchScore),
                      }}
                    />
                  </div>
                  <div className="text-[0.68rem] text-[#4a4540] leading-snug">
                    {result.missingKeywords.length > 0
                      ? `${result.missingKeywords.length} missing keywords · ${rewrites.length} optimizations available`
                      : "Strong match — apply rewrites to push score higher"}
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-4 bg-rv-cream p-0.5 rounded-[3px]">
                {(["overview", "rewrites"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 border-0 rounded-sm text-[0.68rem] font-semibold cursor-pointer transition-all ${tab === t ? "bg-rv-white text-rv-accent shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-transparent text-rv-muted"}`}
                  >
                    {t === "overview"
                      ? "Keywords"
                      : `Rewrites (${rewrites.length})`}
                  </button>
                ))}
              </div>
              {tab === "overview" && (
                <div>
                  {result.topKeywords.length > 0 && (
                    <div className="mb-3">
                      <SL>Top JD Keywords</SL>
                      <div className="flex flex-wrap gap-1.5">
                        {result.topKeywords.map((kw, i) => {
                          const has = !result.missingKeywords.includes(kw);
                          return (
                            <span
                              key={i}
                              className="text-[0.7rem] px-2 py-0.5 rounded-full border"
                              style={{
                                background: has
                                  ? "#dcfce7"
                                  : "rgba(200,75,47,0.07)",
                                color: has ? "#166534" : "#c84b2f",
                                borderColor: has
                                  ? "#bbf7d0"
                                  : "rgba(200,75,47,0.2)",
                              }}
                            >
                              {has ? "✓ " : "✗ "}
                              {kw}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {result.missingKeywords.length > 0 && (
                    <div>
                      <SL style={{ color: "#c84b2f" }}>Missing from Resume</SL>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[0.7rem] px-2 py-0.5 rounded-full bg-[rgba(200,75,47,0.07)] text-rv-accent border border-[rgba(200,75,47,0.2)]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === "rewrites" && (
                <div className="flex flex-col gap-2.5">
                  {rewrites.length === 0 && (
                    <div className="text-center py-6 text-rv-muted text-[0.75rem]">
                      No section rewrites needed — your resume already matches
                      well!
                    </div>
                  )}
                  {rewrites.map((rw, i) => {
                    const key = `${rw.sectionId}-${i}`;
                    const done = applied.has(key);
                    return (
                      <div
                        key={key}
                        className="border rounded-[3px] overflow-hidden"
                        style={{
                          borderColor: done ? "#bbf7d0" : "var(--rv-border)",
                          background: done
                            ? "rgba(45,122,79,0.04)"
                            : "var(--rv-white)",
                        }}
                      >
                        <div className="flex items-center justify-between px-3 py-2 bg-rv-cream border-b border-rv-border">
                          <div>
                            <span className="text-[0.68rem] font-bold text-rv-ink">
                              {rw.label}
                            </span>
                            <span className="text-[0.6rem] text-rv-muted ml-1.5">
                              {rw.sectionType === "summary"
                                ? "Summary"
                                : rw.sectionType === "skills"
                                  ? "Skills"
                                  : "Bullet"}
                            </span>
                          </div>
                          {done ? (
                            <span className="text-[0.65rem] font-bold text-[#2d7a4f]">
                              ✓ Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(rw, key)}
                              className="text-[0.65rem] font-bold px-2.5 py-0.5 bg-rv-accent text-white border-0 rounded-sm cursor-pointer"
                            >
                              Apply →
                            </button>
                          )}
                        </div>
                        <div className="px-3 py-2.5 flex flex-col gap-1.5">
                          <div>
                            <div className="text-[0.58rem] font-bold text-rv-accent tracking-[0.06em] mb-1">
                              BEFORE
                            </div>
                            <div className="text-[0.7rem] text-[#6b6560] leading-snug bg-[rgba(200,75,47,0.05)] px-2.5 py-1.5 rounded-sm border-l-2 border-rv-accent">
                              {rw.original}
                            </div>
                          </div>
                          <div>
                            <div className="text-[0.58rem] font-bold text-[#2d7a4f] tracking-[0.06em] mb-1">
                              AFTER
                            </div>
                            <div className="text-[0.7rem] text-rv-ink leading-snug bg-[rgba(45,122,79,0.05)] px-2.5 py-1.5 rounded-sm border-l-2 border-[#2d7a4f]">
                              {rw.optimized}
                            </div>
                          </div>
                          <div className="text-[0.65rem] text-rv-muted italic leading-snug">
                            💡 {rw.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {!result && !loading && !error && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Match Resume to Job
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Paste a job description and get a match score, keyword gap
                analysis, and one-click section rewrites.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SL({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="text-[0.65rem] font-bold text-rv-muted uppercase tracking-[0.06em] mb-1.5"
      style={style}
    >
      {children}
    </div>
  );
}
function TIcon({ white = false }: { white?: boolean }) {
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
      <circle cx="8" cy="8" r="3.5" />
      <circle cx="8" cy="8" r="1" fill={white ? "#fff" : "var(--rv-accent)"} />
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
