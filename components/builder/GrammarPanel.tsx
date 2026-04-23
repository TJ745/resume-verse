"use client";

import { useState, useEffect, useCallback } from "react";
import { saveSection } from "@/actions/builder.actions";
import type {
  ResumeData,
  ResumeSection,
  SummaryContent,
  ExperienceItem,
  ProjectItem,
  VolunteerItem,
  AwardItem,
} from "@/types/resume";

interface GrammarIssue {
  fieldIndex: number;
  sectionId: string;
  sectionType: string;
  label: string;
  original: string;
  fixed: string;
  issueType:
    | "grammar"
    | "passive_voice"
    | "weak_verb"
    | "clarity"
    | "wordiness"
    | "typo"
    | "cliche";
  severity: "high" | "medium" | "low";
  explanation: string;
}
interface TextField {
  sectionId: string;
  sectionType: string;
  itemId?: string;
  label: string;
  text: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

function extractFields(
  resume: ResumeData,
  sections: ResumeSection[],
): TextField[] {
  const fields: TextField[] = [];
  for (const s of [...sections].sort((a, b) => a.order - b.order)) {
    if (s.type === "summary") {
      const t = (s.content as SummaryContent)?.text ?? "";
      if (t.trim())
        fields.push({
          sectionId: s.id,
          sectionType: s.type,
          label: "Summary",
          text: t,
        });
    } else if (s.type === "experience") {
      for (const exp of (s.content as ExperienceItem[]) ?? []) {
        const h = exp.role
          ? `${exp.role}${exp.company ? ` @ ${exp.company}` : ""}`
          : "Experience";
        for (const b of exp.bullets ?? [])
          if (b.trim())
            fields.push({
              sectionId: s.id,
              sectionType: s.type,
              itemId: exp.id,
              label: `${h} — bullet`,
              text: b,
            });
      }
    } else if (s.type === "projects") {
      for (const p of (s.content as ProjectItem[]) ?? [])
        if (p.description?.trim())
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: p.id,
            label: `Project: ${p.name || "Untitled"}`,
            text: p.description,
          });
    } else if (s.type === "volunteer") {
      for (const v of (s.content as VolunteerItem[]) ?? [])
        if (v.description?.trim())
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: v.id,
            label: `Volunteer: ${v.role || "Role"}`,
            text: v.description,
          });
    } else if (s.type === "awards") {
      for (const a of (s.content as AwardItem[]) ?? [])
        if (a.description?.trim())
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: a.id,
            label: `Award: ${a.title || "Award"}`,
            text: a.description,
          });
    }
  }
  return fields;
}
const SEV_COL: Record<string, string> = {
  high: "#c84b2f",
  medium: "#b7791f",
  low: "#6b7280",
};
const SEV_BG: Record<string, string> = {
  high: "rgba(200,75,47,0.07)",
  medium: "rgba(183,121,31,0.07)",
  low: "rgba(107,114,128,0.05)",
};
const ISSUE_LABEL: Record<string, string> = {
  grammar: "Grammar",
  passive_voice: "Passive Voice",
  weak_verb: "Weak Verb",
  clarity: "Clarity",
  wordiness: "Wordiness",
  typo: "Typo",
  cliche: "Cliché",
};

export default function GrammarPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );

  useEffect(() => {
    if (open) {
      setIssues([]);
      setError("");
      setApplied(new Set());
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

  const handleCheck = useCallback(async () => {
    setLoading(true);
    setError("");
    setIssues([]);
    try {
      const fields = extractFields(resume, sections);
      if (!fields.length) {
        setError("No text content found to check.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/ai/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      const data: GrammarIssue[] = await res.json();
      setIssues(
        data.map((iss) => ({
          ...iss,
          sectionId: fields[iss.fieldIndex]?.sectionId ?? iss.sectionId,
          sectionType: fields[iss.fieldIndex]?.sectionType ?? iss.sectionType,
        })),
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections]);

  const handleApply = useCallback(
    (issue: GrammarIssue, key: string) => {
      const section = sections.find((s) => s.id === issue.sectionId);
      if (!section) return;
      let newContent = section.content;
      if (section.type === "summary")
        newContent = {
          text: ((section.content as SummaryContent).text ?? "").replace(
            issue.original,
            issue.fixed,
          ),
        };
      else if (section.type === "experience")
        newContent = (section.content as ExperienceItem[]).map((exp) => ({
          ...exp,
          bullets: exp.bullets.map((b) =>
            b.trim() === issue.original.trim() ? issue.fixed : b,
          ),
        }));
      else if (["projects", "volunteer", "awards"].includes(section.type))
        newContent = (
          (section.content as unknown as Array<Record<string, unknown>>).map(
            (item) =>
              typeof item.description === "string" &&
              item.description.includes(issue.original)
                ? {
                    ...item,
                    description: item.description.replace(
                      issue.original,
                      issue.fixed,
                    ),
                  }
                : item,
          ) as unknown as typeof section.content
        );
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
  const visible = issues.filter(
    (iss) => filter === "all" || iss.severity === filter,
  );
  const hc = issues.filter((i) => i.severity === "high").length;
  const mc = issues.filter((i) => i.severity === "medium").length;
  const lc = issues.filter((i) => i.severity === "low").length;

  return (
    <>
      <div
        className="fixed inset-0 z-90 bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-110 z-91 bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <GIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                Grammar & Clarity
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                Fix language issues across your resume
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
          <button
            onClick={handleCheck}
            disabled={loading}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold mb-4 flex items-center justify-center gap-2 transition-colors ${loading ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spin />
                Checking…
              </>
            ) : (
              <>
                <GIcon white />
                {issues.length ? "Re-check" : "Check Grammar & Clarity"}
              </>
            )}
          </button>
          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5 mb-4">
              {error}
            </div>
          )}
          {issues.length > 0 && (
            <div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {(
                  [
                    ["all", issues.length, "var(--rv-ink)", "var(--rv-cream)"],
                    ["high", hc, "#c84b2f", "rgba(200,75,47,0.07)"],
                    ["medium", mc, "#b7791f", "rgba(183,121,31,0.07)"],
                    ["low", lc, "#6b7280", "rgba(107,114,128,0.06)"],
                  ] as const
                ).map(([id, count, color, bg]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id as typeof filter)}
                    className="py-1.5 px-1 rounded-sm cursor-pointer text-center border transition-colors"
                    style={{
                      border:
                        filter === id
                          ? `1.5px solid ${color}`
                          : "1px solid var(--rv-border)",
                      background: filter === id ? bg : "var(--rv-white)",
                    }}
                  >
                    <div
                      className="text-base font-extrabold leading-none"
                      style={{ color }}
                    >
                      {count}
                    </div>
                    <div
                      className="text-[0.58rem] font-semibold mt-0.5 capitalize"
                      style={{ color }}
                    >
                      {id}
                    </div>
                  </button>
                ))}
              </div>
              {applied.size > 0 && (
                <div className="text-[0.7rem] text-[#2d7a4f] bg-[#dcfce7] border border-[#bbf7d0] rounded-sm px-3 py-1.5 mb-3">
                  ✓ {applied.size} fix{applied.size > 1 ? "es" : ""} applied
                </div>
              )}
              <div className="flex flex-col gap-2">
                {visible.map((issue, i) => {
                  const key = `${issue.sectionId}-${issue.fieldIndex}-${i}`;
                  const isApplied = applied.has(key);
                  return (
                    <div
                      key={key}
                      className="border rounded-[3px] overflow-hidden"
                      style={{
                        borderColor: isApplied ? "#bbf7d0" : "var(--rv-border)",
                        background: isApplied
                          ? "rgba(45,122,79,0.04)"
                          : "var(--rv-white)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-rv-cream border-b border-rv-border">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="text-[0.58rem] font-bold px-1.5 py-px rounded-full uppercase tracking-[0.04em] shrink-0"
                            style={{
                              background: SEV_BG[issue.severity],
                              color: SEV_COL[issue.severity],
                            }}
                          >
                            {issue.severity}
                          </span>
                          <span className="text-[0.58rem] font-semibold px-1.5 py-px rounded-full bg-rv-white text-rv-muted border border-rv-border shrink-0">
                            {ISSUE_LABEL[issue.issueType] ?? issue.issueType}
                          </span>
                          <span className="text-[0.65rem] text-rv-muted truncate">
                            {issue.label}
                          </span>
                        </div>
                        {isApplied ? (
                          <span className="text-[0.65rem] font-bold text-[#2d7a4f] shrink-0">
                            ✓ Fixed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(issue, key)}
                            className="text-[0.65rem] font-bold px-2.5 py-0.5 bg-rv-accent text-white border-0 rounded-sm cursor-pointer shrink-0"
                          >
                            Fix →
                          </button>
                        )}
                      </div>
                      <div className="px-3 py-2.5 flex flex-col gap-1.5">
                        <div>
                          <div className="text-[0.58rem] font-bold text-rv-accent tracking-[0.06em] mb-1">
                            ORIGINAL
                          </div>
                          <div className="text-[0.7rem] text-[#6b6560] leading-snug bg-[rgba(200,75,47,0.05)] px-2.5 py-1.5 rounded-sm border-l-2 border-rv-accent">
                            {issue.original}
                          </div>
                        </div>
                        <div>
                          <div className="text-[0.58rem] font-bold text-[#2d7a4f] tracking-[0.06em] mb-1">
                            SUGGESTED FIX
                          </div>
                          <div className="text-[0.7rem] text-rv-ink leading-snug bg-[rgba(45,122,79,0.05)] px-2.5 py-1.5 rounded-sm border-l-2 border-[#2d7a4f]">
                            {issue.fixed}
                          </div>
                        </div>
                        <div className="text-[0.63rem] text-rv-muted italic leading-snug">
                          {issue.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {visible.length === 0 && (
                <div className="text-center py-6 text-[0.75rem] text-rv-muted">
                  No {filter}-severity issues found.
                </div>
              )}
            </div>
          )}
          {!loading && !error && issues.length === 0 && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">✍️</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Check Your Writing
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Scans summaries, bullets, and descriptions for grammar errors,
                passive voice, weak verbs, and clarity issues.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function GIcon({ white = false }: { white?: boolean }) {
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
      <path
        d="M2 12L6 4l4 8M3.5 9h5M10 4h4M12 4v8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
