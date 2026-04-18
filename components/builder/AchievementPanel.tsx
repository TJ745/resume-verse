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

const iCls =
  "w-full px-3 py-2 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.78rem] outline-none focus:border-rv-accent transition-colors";

export default function AchievementPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [duty, setDuty] = useState("");
  const [targetExpId, setTargetExpId] = useState("");
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
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
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
      const dutyClean = duty.trim().toLowerCase();
      const items = expItems.map((exp) => {
        if (exp.id !== targetExpId) return exp;
        const ei = exp.bullets.findIndex(
          (b) => b.trim().toLowerCase() === dutyClean,
        );
        const bullets =
          ei > -1
            ? exp.bullets.map((b, i) => (i === ei ? achievement : b))
            : [...exp.bullets, achievement];
        return { ...exp, bullets };
      });
      onSectionsChange(
        sections.map((s) =>
          s.id === expSection.id ? { ...s, content: items } : s,
        ),
      );
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
        className="fixed inset-0 z-[90] bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-[440px] z-[91] bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <AIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                Achievement Generator
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                Turn plain duties into quantified wins
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
          {expItems.length > 0 && (
            <div>
              <SL>Apply to experience</SL>
              <select
                value={targetExpId}
                onChange={(e) => setTargetExpId(e.target.value)}
                className={`${iCls} appearance-none cursor-pointer`}
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
          <div>
            <SL>Plain duty or responsibility</SL>
            <textarea
              value={duty}
              onChange={(e) => setDuty(e.target.value)}
              rows={3}
              placeholder="e.g. managed the development team, handled customer complaints…"
              className={`${iCls} resize-y leading-snug`}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !duty.trim()}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold flex items-center justify-center gap-2 transition-colors ${loading || !duty.trim() ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {loading ? (
              <>
                <Spin />
                Generating…
              </>
            ) : (
              <>
                <AIcon white />
                Generate Achievements
              </>
            )}
          </button>
          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5">
              {error}
            </div>
          )}
          {achievements.length > 0 && (
            <div>
              <SL>
                Pick one to insert into {targetExp?.role || "your experience"}
              </SL>
              <div className="flex flex-col gap-2">
                {achievements.map((ach, i) => {
                  const done = inserted.has(String(i));
                  return (
                    <div
                      key={i}
                      className="border rounded-[3px] p-3 flex flex-col gap-2"
                      style={{
                        borderColor: done ? "#bbf7d0" : "var(--rv-border)",
                        background: done
                          ? "rgba(45,122,79,0.04)"
                          : "var(--rv-white)",
                      }}
                    >
                      <div className="text-[0.75rem] text-rv-ink leading-relaxed border-l-2 border-rv-accent pl-2.5">
                        {ach}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.6rem] text-rv-muted">
                          Variation {i + 1}
                        </span>
                        {done ? (
                          <span className="text-[0.65rem] font-bold text-[#2d7a4f]">
                            ✓ Inserted
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInsert(ach, i)}
                            className="text-[0.65rem] font-bold px-3 py-0.5 bg-rv-accent text-white border-0 rounded-sm cursor-pointer"
                          >
                            Insert →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-[0.68rem] text-rv-muted mt-2.5 leading-snug italic">
                💡 "Insert" adds this to the selected experience's bullets. If
                the plain duty already exists, it will be replaced.
              </div>
            </div>
          )}
          {!achievements.length && !loading && !error && (
            <div className="text-center py-8 px-4 text-rv-muted">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Turn Duties into Achievements
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Type any plain responsibility above — AI rewrites it as 3
                quantified, impact-focused bullet points you can insert
                directly.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SL({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.65rem] font-bold text-rv-muted uppercase tracking-[0.06em] mb-1.5">
      {children}
    </div>
  );
}
function AIcon({ white = false }: { white?: boolean }) {
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
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
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
