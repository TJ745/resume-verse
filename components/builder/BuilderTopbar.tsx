"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { updateResumeMeta } from "@/actions/builder.actions";
import ShareButton        from "./ShareButton";
import ExportPDFButton  from "@/components/shared/ExportPDFButton";
import ExportDOCXButton from "@/components/shared/ExportDOCXButton";

// ── Templates & color schemes ─────────────────────────────
// Imported for local use + re-exported so other files can import from here
import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
export { TEMPLATES, COLOR_SCHEMES };

// ── Props ─────────────────────────────────────────────────

import type { ResumeData, ResumeSection } from "@/types/resume";

interface BuilderTopbarProps {
  resumeId: string;
  resume:   ResumeData;
  sections: ResumeSection[];
  title: string;
  template: string;
  colorScheme?: string;
  onATSOpen:         () => void;
  onJDMatchOpen:     () => void;
  onCoverLetterOpen: () => void;
  onGrammarOpen:     () => void;
  onAchievementOpen: () => void;
  onCareerGapOpen:   () => void;
  onInterviewOpen:   () => void;
  isPublic?: boolean;
  isPro?:    boolean;
  onTemplateChange?: (id: string) => void;
  onSchemeChange?:   (id: string) => void;
}

// ── Reusable dropdown wrapper ─────────────────────────────

function Dropdown({
  trigger,
  children,
  align = "right",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={[
            "absolute top-full mt-1 z-50 py-1 bg-rv-white border border-rv-border rounded-sm shadow-[0_12px_32px_rgba(15,14,13,0.12)] min-w-[220px]",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────

export default function BuilderTopbar({
  resumeId,
  resume,
  sections,
  title,
  template,
  colorScheme = "terracotta",
  onATSOpen,
  onJDMatchOpen,
  onCoverLetterOpen,
  onGrammarOpen,
  onAchievementOpen,
  onCareerGapOpen,
  onInterviewOpen,
  isPublic = false,
  isPro    = false,
  onTemplateChange,
  onSchemeChange,
}: BuilderTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [currentScheme, setCurrentScheme] = useState(colorScheme);
  const [isPending, startTransition] = useTransition();

  const activeTemplate = TEMPLATES.find((t) => t.id === currentTemplate) ?? TEMPLATES[0];
  const activeScheme   = COLOR_SCHEMES.find((s) => s.id === currentScheme) ?? COLOR_SCHEMES[0];

  function handleTitleBlur() {
    setEditingTitle(false);
    if (titleValue.trim() === title) return;
    startTransition(() =>
      updateResumeMeta(resumeId, { title: titleValue.trim() || "Untitled Resume" })
    );
  }

  function handleTemplateChange(id: string) {
    setCurrentTemplate(id);
    onTemplateChange?.(id);
    startTransition(() => updateResumeMeta(resumeId, { template: id }));
  }

  function handleSchemeChange(id: string) {
    setCurrentScheme(id);
    onSchemeChange?.(id);
    startTransition(() => updateResumeMeta(resumeId, { colorScheme: id }));
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 gap-4 h-14 bg-rv-paper border-b border-rv-border">

      {/* ── Left: back + title ── */}
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-rv-muted no-underline shrink-0 hover:opacity-60 transition-opacity duration-150">
          <span>←</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <span className="text-rv-border select-none">|</span>

        {editingTitle ? (
          <input
            autoFocus
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") { setTitleValue(title); setEditingTitle(false); }
            }}
            className="text-sm font-medium bg-transparent border-0 border-b border-rv-accent text-rv-ink outline-none max-w-[260px] pb-px"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-medium truncate bg-transparent border-0 cursor-text text-rv-ink max-w-[260px] p-0"
            title="Click to rename"
          >
            {titleValue}
          </button>
        )}

        {isPending && (
          <span className="text-xs shrink-0 text-rv-muted">Saving…</span>
        )}
      </div>

      {/* ── Right: dropdowns + export ── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Color scheme dropdown */}
        <Dropdown align="right" trigger={
          <button className="inline-flex items-center gap-2 text-xs font-medium bg-transparent border border-rv-border rounded-sm px-3 py-1.5 cursor-pointer text-rv-ink hover:border-rv-accent transition-colors duration-150">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ background: activeScheme.swatch }} />
            <span className="hidden sm:inline">{activeScheme.label}</span>
            <ChevronDown />
          </button>
        }>
          <div className="px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-rv-muted border-b border-rv-border mb-1">
            Color scheme
          </div>
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleSchemeChange(scheme.id)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 text-xs border-0 cursor-pointer text-rv-ink text-left transition-colors duration-100 hover:bg-rv-cream",
                currentScheme === scheme.id ? "bg-rv-cream" : "bg-transparent",
              ].join(" ")}
            >
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{
                  background: scheme.swatch,
                  border: currentScheme === scheme.id ? `2px solid ${scheme.swatch}` : "2px solid transparent",
                  outline: currentScheme === scheme.id ? `1px solid ${scheme.swatch}` : "none",
                  outlineOffset: 1,
                }}
              />
              <span className="font-medium">{scheme.label}</span>
              {currentScheme === scheme.id && (
                <span className="ml-auto text-rv-accent text-[10px]">✓</span>
              )}
            </button>
          ))}
        </Dropdown>

        {/* Template dropdown */}
        <Dropdown align="right" trigger={
          <button className="inline-flex items-center gap-2 text-xs font-medium bg-transparent border border-rv-border rounded-sm px-3 py-1.5 cursor-pointer text-rv-ink hover:border-rv-accent transition-colors duration-150">
            <TemplateIcon />
            <span className="hidden sm:inline">{activeTemplate.label}</span>
            <ChevronDown />
          </button>
        }>
          <div className="px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-rv-muted border-b border-rv-border mb-1">
            Template
          </div>
          {TEMPLATES.map((tmpl) => {
            const FREE_TEMPLATES = ["modern", "classic", "minimal"];
            const isLocked = !isPro && !FREE_TEMPLATES.includes(tmpl.id);
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  if (isLocked) {
                    fetch("/api/lemonsqueezy/checkout", { method: "POST" })
                      .then((r) => r.json())
                      .then((d) => { if (d.url) window.location.href = d.url; });
                    return;
                  }
                  handleTemplateChange(tmpl.id);
                }}
                className={[
                  "w-full flex flex-col px-3 py-2 text-xs border-0 cursor-pointer text-left transition-colors duration-100 hover:bg-rv-cream",
                  currentTemplate === tmpl.id ? "bg-rv-cream" : "bg-transparent",
                  isLocked ? "opacity-70" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-medium ${currentTemplate === tmpl.id ? "text-rv-accent" : "text-rv-ink"}`}>
                    {tmpl.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {isLocked && (
                      <span className="text-[0.5rem] font-extrabold bg-rv-accent text-white rounded-full px-1.5 py-px tracking-[0.06em]">
                        PRO
                      </span>
                    )}
                    {currentTemplate === tmpl.id && (
                      <span className="text-rv-accent text-[10px]">✓</span>
                    )}
                  </div>
                </div>
                <span className="text-rv-muted mt-0.5 text-[0.7rem]">{tmpl.description}</span>
              </button>
            );
          })}
        </Dropdown>

        {/* ── Smart Tools dropdown ── */}
        <Dropdown align="right" trigger={
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.25)] rounded-sm px-3.5 py-1.5 cursor-pointer text-rv-accent hover:bg-rv-accent hover:text-white hover:border-rv-accent transition-all duration-150">
            <SparkleIcon />
            <span>AI Tools</span>
            <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-none stroke-current ml-px" strokeWidth={1.8}>
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }>
          {[
            { label: "ATS Score",     desc: "Score your resume",            icon: <ATSButtonIcon />,      color: "var(--rv-accent)", onClick: onATSOpen },
            { label: "JD Match",      desc: "Optimize for job description", icon: <JDIcon />,             color: "#b7791f",          onClick: onJDMatchOpen },
            { label: "Cover Letter",  desc: "Generate a cover letter",      icon: <LetterIconSmall />,    color: "#2d7a4f",          onClick: onCoverLetterOpen },
            { label: "Grammar Check", desc: "Fix language issues",          icon: <GrammarIconSmall />,   color: "#4b5563",          onClick: onGrammarOpen },
            { label: "Achievements",  desc: "Turn duties into wins",        icon: <AchievIconSmall />,    color: "#6b3fa0",          onClick: onAchievementOpen },
            { label: "Career Gap",    desc: "Explain employment gaps",      icon: <GapIconSmall />,       color: "#1e3a5f",          onClick: onCareerGapOpen },
            { label: "Interview Prep",desc: "Practice questions",           icon: <InterviewIconSmall />, color: "#2d5a3d",          onClick: onInterviewOpen },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 bg-transparent border-0 cursor-pointer text-left hover:bg-rv-cream transition-colors"
            >
              <span className="shrink-0 flex" style={{ color: tool.color }}>{tool.icon}</span>
              <span>
                <span className="block text-[0.75rem] font-semibold text-rv-ink">{tool.label}</span>
                <span className="block text-[0.65rem] text-rv-muted mt-px">{tool.desc}</span>
              </span>
            </button>
          ))}
        </Dropdown>

        {/* Divider */}
        <span className="w-px h-5 bg-rv-border inline-block" />

        {/* Export */}
        <ShareButton resumeId={resumeId} isPublic={isPublic} />
        <ExportDOCXButton
          resume={resume}
          sections={sections}
          isPro={isPro}
          template={currentTemplate}
          colorScheme={currentScheme}
        />
        <ExportPDFButton
          resumeId={resumeId}
          variant="topbar"
          template={currentTemplate}
          colorScheme={currentScheme}
        />
      </div>
    </header>
  );
}

const svgCls = "w-3 h-3 fill-none stroke-current shrink-0";
const svgCls13 = "fill-none stroke-current";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.22 4.22l1.42 1.42M10.36 10.36l1.42 1.42M4.22 11.78l1.42-1.42M10.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
  );
}
function AchievIconSmall() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
    </svg>
  );
}
function GapIconSmall() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <rect x="1" y="2" width="6" height="12" rx="1" /><rect x="9" y="2" width="6" height="12" rx="1" />
    </svg>
  );
}
function InterviewIconSmall() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" /><path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
    </svg>
  );
}
function JDIcon() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <circle cx="8" cy="8" r="7" /><circle cx="8" cy="8" r="3.5" /><circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
function LetterIconSmall() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="M1 4l7 5 7-5" />
    </svg>
  );
}
function GrammarIconSmall() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <path d="M2 12L6 4l4 8M3.5 9h5M10 4h4M12 4v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ATSButtonIcon() {
  return (
    <svg viewBox="0 0 16 16" className={svgCls} strokeWidth={1.5}>
      <circle cx="8" cy="8" r="7" />
      <path d="M5 8l2 2 4-4" />
    </svg>
  );
}
function TemplateIcon() {
  return (
    <svg viewBox="0 0 14 14" width={12} height={12} stroke="currentColor" fill="none" strokeWidth={1.5} className={svgCls13}>
      <rect x="1" y="1" width="12" height="12" rx="1" />
      <path d="M1 4h12M5 4v9" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 12 12" width={10} height={10} stroke="currentColor" fill="none" strokeWidth={1.5}>
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}