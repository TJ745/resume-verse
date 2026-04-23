"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ResumeData, ResumeSection, ExperienceItem } from "@/types/resume";

interface GapExplanation {
  reason: string;
  text: string;
}
interface GapResult {
  gapIndex: number;
  from: string;
  to: string;
  months: number;
  label: string;
  explanations: GapExplanation[];
}
interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}

export default function CareerGapPanel({
  open,
  onClose,
  sections,
}: Props) {
  const [gaps, setGaps] = useState<GapResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const expSection = sections.find((s) => s.type === "experience");
  const expItems = useMemo(
    () => (expSection?.content as ExperienceItem[] | undefined) ?? [],
    [expSection],
  );

  useEffect(() => {
    if (open) {
      setGaps([]);
      setError("");
      setCopied(null);
      setExpanded(new Set([0]));
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
    if (!expItems.length) return;
    setLoading(true);
    setError("");
    setGaps([]);
    try {
      const res = await fetch("/api/ai/career-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: expItems.map((e) => ({
            role: e.role,
            company: e.company,
            startDate: e.startDate,
            endDate: e.endDate,
            current: e.current,
          })),
        }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      const data = await res.json();
      setGaps(data.gaps ?? []);
      setExpanded(new Set([0]));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [expItems]);

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  function toggle(i: number) {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  }

  if (!open) return null;
  const hasExp = expItems.length >= 2;

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
                Career Gap Explainer
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                Professional explanations for employment gaps
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
          <button
            onClick={handleAnalyse}
            disabled={loading || !hasExp}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold flex items-center justify-center gap-2 transition-colors ${loading || !hasExp ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spin />
                Detecting gaps…
              </>
            ) : (
              <>
                <GIcon white />
                {gaps.length ? "Re-analyse" : "Detect & Explain Gaps"}
              </>
            )}
          </button>
          {!hasExp && !loading && (
            <div className="text-[0.72rem] text-rv-muted text-center leading-snug">
              Add at least 2 work experience entries to detect gaps.
            </div>
          )}
          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5">
              {error}
            </div>
          )}
          {!loading &&
            !error &&
            gaps.length === 0 &&
            hasExp &&
            expItems.length >= 2 && (
              <div className="text-center py-6 px-4 text-rv-muted">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                  No significant gaps detected
                </div>
                <div className="text-[0.72rem] leading-relaxed">
                  Your work history looks continuous. No gaps of 3+ months
                  found.
                </div>
              </div>
            )}
          {gaps.map((gap, i) => (
            <div
              key={i}
              className="border border-rv-border rounded-[3px] overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className={`w-full px-3.5 py-2.5 bg-rv-cream border-0 flex items-center justify-between cursor-pointer ${expanded.has(i) ? "border-b border-rv-border" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        gap.months >= 12
                          ? "rgba(200,75,47,0.12)"
                          : "rgba(183,121,31,0.1)",
                      color: gap.months >= 12 ? "#c84b2f" : "#b7791f",
                    }}
                  >
                    {gap.months} month{gap.months !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[0.72rem] font-semibold text-rv-ink">
                    {gap.from} → {gap.to}
                  </span>
                </div>
                <span className="text-[0.7rem] text-rv-muted">
                  {expanded.has(i) ? "▲" : "▼"}
                </span>
              </button>
              {expanded.has(i) && (
                <div className="p-3 flex flex-col gap-2">
                  <div className="text-[0.65rem] text-rv-muted">
                    Choose an explanation for interviews or your resume summary:
                  </div>
                  {gap.explanations.map((ex, j) => {
                    const ck = `${i}-${j}`;
                    return (
                      <div
                        key={j}
                        className="border border-rv-border rounded-sm bg-rv-white overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-2.5 py-1.5 bg-rv-cream border-b border-rv-border">
                          <span className="text-[0.65rem] font-bold text-rv-ink">
                            {ex.reason}
                          </span>
                          <button
                            onClick={() => handleCopy(ex.text, ck)}
                            className="text-[0.6rem] font-semibold px-2 py-0.5 border border-rv-border rounded-sm cursor-pointer transition-colors"
                            style={{
                              background:
                                copied === ck ? "#dcfce7" : "var(--rv-white)",
                              color:
                                copied === ck ? "#166534" : "var(--rv-muted)",
                            }}
                          >
                            {copied === ck ? "✓ Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="px-2.5 py-2 text-[0.73rem] text-rv-ink leading-relaxed">
                          {ex.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {!loading && !error && gaps.length === 0 && !hasExp && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Career Gap Explainer
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Detects gaps of 3+ months and generates professional
                explanations for interviews or your resume summary.
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
      <rect x="1" y="2" width="6" height="12" rx="1" />
      <rect x="9" y="2" width="6" height="12" rx="1" />
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
