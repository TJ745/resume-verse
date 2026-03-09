"use client";

import { useState } from "react";
import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2Profile from "./Step2Profile";
import Step3Experience from "./Step3Experience";
import Step4Education from "./Step4Education";

const STEPS = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Profile" },
  { number: 3, label: "Experience" },
  { number: 4, label: "Education" },
] as const;

interface StepWizardProps {
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
  onPersonalInfoChange: (p: PersonalInfo) => void;
}

export default function StepWizard({
  resume,
  sections,
  onSectionsChange,
  onPersonalInfoChange,
}: StepWizardProps) {
  const [step, setStep] = useState(1);

  const isLast = step === STEPS.length;
  const isFirst = step === 1;

  function goTo(n: number) {
    if (n >= 1 && n <= STEPS.length) setStep(n);
  }

  const nextLabel = isLast ? "Save & Finish" : "Save & Next →";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Step indicator ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "stretch",
          height: 48,
          borderBottom: "1px solid var(--rv-border)",
          background: "var(--rv-paper)",
          overflowX: "auto",
        }}
      >
        {STEPS.map((s) => {
          const isActive = s.number === step;
          const isComplete = s.number < step;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => goTo(s.number)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? "2px solid var(--rv-accent)"
                  : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0 14px",
                height: "100%",
                transition: "border-color 0.15s",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isActive
                    ? "var(--rv-accent)"
                    : isComplete
                      ? "#2d8a4e"
                      : "var(--rv-border)",
                  color: isActive || isComplete ? "#fff" : "var(--rv-muted)",
                  transition: "background 0.15s",
                }}
              >
                {isComplete ? "✓" : s.number}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--rv-ink)"
                    : isComplete
                      ? "#2d8a4e"
                      : "var(--rv-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Step content — scrollable ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1rem" }}>
        {step === 1 && (
          <Step1PersonalInfo
            resumeId={resume.id}
            personalInfo={resume.personalInfo}
            onSave={onPersonalInfoChange}
          />
        )}
        {step === 2 && (
          <Step2Profile
            resumeId={resume.id}
            jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""}
            sections={sections}
            onSectionsChange={onSectionsChange}
          />
        )}
        {step === 3 && (
          <Step3Experience
            resumeId={resume.id}
            jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""}
            sections={sections}
            onSectionsChange={onSectionsChange}
          />
        )}
        {step === 4 && (
          <Step4Education
            resumeId={resume.id}
            sections={sections}
            onSectionsChange={onSectionsChange}
          />
        )}
      </div>

      {/* ── Navigation ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.65rem 1rem",
          borderTop: "1px solid var(--rv-border)",
          background: "var(--rv-paper)",
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => goTo(step - 1)}
          disabled={isFirst}
          style={{
            background: "none",
            border: "1px solid var(--rv-border)",
            borderRadius: 2,
            padding: "0.4rem 1rem",
            cursor: isFirst ? "not-allowed" : "pointer",
            color: isFirst ? "var(--rv-border)" : "var(--rv-muted)",
            fontFamily: "inherit",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: "0.7rem", color: "var(--rv-muted)" }}>
          {step} / {STEPS.length}
        </span>

        <button
          type="button"
          onClick={() => goTo(step + 1)}
          disabled={isLast}
          style={{
            background: isLast ? "#2d8a4e" : "var(--rv-ink)",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "0.4rem 1.1rem",
            cursor: isLast ? "default" : "pointer",
            fontFamily: "inherit",
            fontSize: "0.78rem",
            fontWeight: 600,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!isLast) e.currentTarget.style.background = "var(--rv-accent)";
          }}
          onMouseLeave={(e) => {
            if (!isLast) e.currentTarget.style.background = "var(--rv-ink)";
          }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
