"use client";

import { useState, useEffect, useCallback } from "react";
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
  resume,
  sections,
}: Props) {
  const [gaps, setGaps] = useState<GapResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const expSection = sections.find((s) => s.type === "experience");
  const expItems = (expSection?.content as ExperienceItem[] | undefined) ?? [];

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
      const jobs = expItems.map((e) => ({
        role: e.role,
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
      }));
      const res = await fetch("/api/ai/career-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs }),
      });
      if (!res.ok) throw new Error();
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

  function toggleExpand(i: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  if (!open) return null;

  const hasExperience = expItems.length >= 2;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(15,14,13,0.35)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 56,
          right: 0,
          bottom: 0,
          width: 440,
          zIndex: 91,
          background: "var(--rv-paper)",
          borderLeft: "1px solid var(--rv-border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(15,14,13,0.1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem 0.75rem",
            borderBottom: "1px solid var(--rv-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GapIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                Career Gap Explainer
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                Professional explanations for employment gaps
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--rv-muted)",
              fontSize: "1.1rem",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem",
          }}
        >
          {/* Analyse button */}
          <button
            onClick={handleAnalyse}
            disabled={loading || !hasExperience}
            style={{
              width: "100%",
              padding: "0.6rem",
              background:
                loading || !hasExperience
                  ? "var(--rv-muted)"
                  : "var(--rv-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: loading || !hasExperience ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Detecting gaps…
              </>
            ) : (
              <>
                <GapIcon white />
                {gaps.length ? "Re-analyse" : "Detect & Explain Gaps"}
              </>
            )}
          </button>

          {!hasExperience && !loading && (
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--rv-muted)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Add at least 2 work experience entries to detect gaps.
            </div>
          )}

          {error && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--rv-accent)",
                background: "rgba(200,75,47,0.07)",
                border: "1px solid rgba(200,75,47,0.2)",
                borderRadius: 2,
                padding: "0.6rem 0.75rem",
              }}
            >
              {error}
            </div>
          )}

          {/* No gaps found */}
          {!loading &&
            !error &&
            gaps.length === 0 &&
            hasExperience &&
            expItems.length >= 2 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "1.5rem 1rem",
                  color: "var(--rv-muted)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    marginBottom: 4,
                    color: "var(--rv-ink)",
                  }}
                >
                  No significant gaps detected
                </div>
                <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                  Your work history looks continuous. No gaps of 3+ months were
                  found between positions.
                </div>
              </div>
            )}

          {/* Gap cards */}
          {gaps.map((gap, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--rv-border)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              {/* Gap header — collapsible */}
              <button
                onClick={() => toggleExpand(i)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "var(--rv-cream)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderBottom: expanded.has(i)
                    ? "1px solid var(--rv-border)"
                    : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background:
                        gap.months >= 12
                          ? "rgba(200,75,47,0.12)"
                          : "rgba(183,121,31,0.1)",
                      color: gap.months >= 12 ? "#c84b2f" : "#b7791f",
                    }}
                  >
                    {gap.months} month{gap.months !== 1 ? "s" : ""}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--rv-ink)",
                    }}
                  >
                    {gap.from} → {gap.to}
                  </span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--rv-muted)" }}>
                  {expanded.has(i) ? "▲" : "▼"}
                </span>
              </button>

              {/* Explanations */}
              {expanded.has(i) && (
                <div
                  style={{
                    padding: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--rv-muted)",
                      marginBottom: 2,
                    }}
                  >
                    Choose an explanation to use in interviews or your resume
                    summary:
                  </div>
                  {gap.explanations.map((ex, j) => {
                    const copyKey = `${i}-${j}`;
                    return (
                      <div
                        key={j}
                        style={{
                          border: "1px solid var(--rv-border)",
                          borderRadius: 2,
                          background: "var(--rv-white)",
                          overflow: "hidden",
                        }}
                      >
                        {/* Reason label */}
                        <div
                          style={{
                            padding: "0.3rem 0.65rem",
                            background: "var(--rv-cream)",
                            borderBottom: "1px solid var(--rv-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "var(--rv-ink)",
                            }}
                          >
                            {ex.reason}
                          </span>
                          <button
                            onClick={() => handleCopy(ex.text, copyKey)}
                            style={{
                              fontSize: "0.6rem",
                              fontWeight: 600,
                              padding: "2px 8px",
                              border: "1px solid var(--rv-border)",
                              borderRadius: 2,
                              background:
                                copied === copyKey
                                  ? "#dcfce7"
                                  : "var(--rv-white)",
                              color:
                                copied === copyKey
                                  ? "#166534"
                                  : "var(--rv-muted)",
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            {copied === copyKey ? "✓ Copied" : "Copy"}
                          </button>
                        </div>
                        <div
                          style={{
                            padding: "0.55rem 0.65rem",
                            fontSize: "0.73rem",
                            color: "var(--rv-ink)",
                            lineHeight: 1.6,
                          }}
                        >
                          {ex.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {!loading && !error && gaps.length === 0 && !hasExperience && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📅</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Career Gap Explainer
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.65 }}>
                Automatically detects gaps of 3+ months in your work history and
                generates professional explanations you can use in interviews or
                your resume summary.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function GapIcon({ white = false }: { white?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: white ? "#fff" : "var(--rv-accent)",
        strokeWidth: 1.5,
        flexShrink: 0,
      }}
    >
      <rect x="1" y="2" width="6" height="12" rx="1" />
      <rect x="9" y="2" width="6" height="12" rx="1" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: "#fff",
        strokeWidth: 1.5,
        animation: "rv-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
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
