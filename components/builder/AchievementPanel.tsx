"use client";

import { useState, useEffect, useCallback } from "react";
import { saveSection } from "@/actions/builder.actions";
import type { ResumeData, ResumeSection, ExperienceItem } from "@/types/resume";

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.78rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export default function AchievementPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [duty, setDuty] = useState("");
  const [targetExpId, setTargetExpId] = useState<string>("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inserted, setInserted] = useState<Set<string>>(new Set());

  const expSection = sections.find((s) => s.type === "experience");
  const expItems = (expSection?.content as ExperienceItem[] | undefined) ?? [];

  useEffect(() => {
    if (open) {
      setDuty("");
      setAchievements([]);
      setError("");
      setInserted(new Set());
      // default to first experience item
      if (expItems.length) setTargetExpId(expItems[0].id);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleGenerate = useCallback(async () => {
    if (!duty.trim()) return;
    setLoading(true);
    setError("");
    setAchievements([]);
    setInserted(new Set());
    try {
      const target = expItems.find((e) => e.id === targetExpId);
      const res = await fetch("/api/ai/achievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duty,
          role: target?.role ?? resume.personalInfo?.jobTitle ?? "",
          company: target?.company ?? "",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAchievements(data.achievements ?? []);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [duty, targetExpId, expItems, resume.personalInfo?.jobTitle]);

  const handleInsert = useCallback(
    (achievement: string, idx: number) => {
      if (!expSection) return;
      const items = expItems.map((exp) => {
        if (exp.id !== targetExpId) return exp;
        // Replace duty text if found, otherwise append
        const dutyClean = duty.trim().toLowerCase();
        const existingIdx = exp.bullets.findIndex(
          (b) => b.trim().toLowerCase() === dutyClean,
        );
        const bullets =
          existingIdx > -1
            ? exp.bullets.map((b, i) => (i === existingIdx ? achievement : b))
            : [...exp.bullets, achievement];
        return { ...exp, bullets };
      });
      const updated = sections.map((s) =>
        s.id === expSection.id ? { ...s, content: items } : s,
      );
      onSectionsChange(updated);
      saveSection(resume.id, expSection.id, items).catch(console.error);
      setInserted((prev) => new Set([...prev, String(idx)]));
    },
    [
      expSection,
      expItems,
      sections,
      targetExpId,
      duty,
      resume.id,
      onSectionsChange,
    ],
  );

  if (!open) return null;

  const targetExp = expItems.find((e) => e.id === targetExpId);

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
            <AchievIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                Achievement Generator
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                Turn plain duties into quantified wins
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
          {/* Target job selector */}
          {expItems.length > 0 && (
            <div>
              <SLabel>Apply to experience</SLabel>
              <select
                value={targetExpId}
                onChange={(e) => setTargetExpId(e.target.value)}
                style={{ ...inp, appearance: "none" }}
              >
                {expItems.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.role || "Untitled"}
                    {exp.company ? ` @ ${exp.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duty input */}
          <div>
            <SLabel>Plain duty or responsibility</SLabel>
            <textarea
              value={duty}
              onChange={(e) => setDuty(e.target.value)}
              rows={3}
              placeholder="e.g. managed the development team, handled customer complaints, worked on the backend API…"
              style={{ ...inp, resize: "vertical", lineHeight: 1.55 }}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !duty.trim()}
            style={{
              width: "100%",
              padding: "0.6rem",
              background:
                loading || !duty.trim()
                  ? "var(--rv-muted)"
                  : "var(--rv-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: loading || !duty.trim() ? "not-allowed" : "pointer",
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
                Generating…
              </>
            ) : (
              <>
                <AchievIcon white />
                Generate Achievements
              </>
            )}
          </button>

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

          {/* Results */}
          {achievements.length > 0 && (
            <div>
              <SLabel>
                Pick one to insert into {targetExp?.role || "your experience"}
              </SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {achievements.map((ach, i) => {
                  const isInserted = inserted.has(String(i));
                  return (
                    <div
                      key={i}
                      style={{
                        border: `1px solid ${isInserted ? "#bbf7d0" : "var(--rv-border)"}`,
                        borderRadius: 3,
                        background: isInserted
                          ? "rgba(45,122,79,0.04)"
                          : "var(--rv-white)",
                        padding: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {/* Achievement text */}
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--rv-ink)",
                          lineHeight: 1.6,
                          borderLeft: "2px solid var(--rv-accent)",
                          paddingLeft: "0.6rem",
                        }}
                      >
                        {ach}
                      </div>
                      {/* Action row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: "var(--rv-muted)",
                          }}
                        >
                          Variation {i + 1}
                        </span>
                        {isInserted ? (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "#2d7a4f",
                            }}
                          >
                            ✓ Inserted
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInsert(ach, i)}
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              padding: "3px 12px",
                              background: "var(--rv-accent)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 2,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Insert →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: "0.68rem",
                  color: "var(--rv-muted)",
                  marginTop: 10,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                💡 "Insert" adds this to the selected experience's bullets. If
                the plain duty already exists as a bullet, it will be replaced.
              </div>
            </div>
          )}

          {/* Empty state */}
          {!achievements.length && !loading && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏆</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Turn Duties into Achievements
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.65 }}>
                Type any plain responsibility above — AI will rewrite it as 3
                quantified, impact-focused bullet points you can insert directly
                into your resume.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        color: "var(--rv-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 5,
      }}
    >
      {children}
    </div>
  );
}
function AchievIcon({ white = false }: { white?: boolean }) {
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
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
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
