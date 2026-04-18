"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResumeData, ResumeSection } from "@/types/resume";

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  isPro?: boolean;
}
type Tone = "professional" | "friendly" | "confident";

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: "professional", label: "Professional", desc: "Polished & formal" },
  { id: "friendly", label: "Friendly", desc: "Warm & approachable" },
  { id: "confident", label: "Confident", desc: "Bold & assertive" },
];

function buildText(resume: ResumeData, sections: ResumeSection[]): string {
  const lines: string[] = [];
  const p = resume.personalInfo;
  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  if (p?.email) lines.push(p.email);
  if (p?.phone) lines.push(p.phone);
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

const iCls =
  "w-full px-3 py-2 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.78rem] outline-none focus:border-rv-accent transition-colors";

export default function CoverLetterPanel({
  open,
  onClose,
  resume,
  sections,
  isPro = false,
}: Props) {
  const [jd, setJd] = useState("");
  const [manager, setManager] = useState("");
  const [company, setCompany] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [letter, setLetter] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setLetter("");
      setError("");
      setCopied(false);
    }
  }, [open]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleGenerate = useCallback(async () => {
    setStreaming(true);
    setLetter("");
    setError("");
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: buildText(resume, sections),
          jobDescription: jd,
          tone,
          hiringManager: manager,
          companyName: company,
        }),
      });
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error ?? "Free plan limit reached.");
      }
      if (!res.ok) throw new Error("Something went wrong.");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setLetter(acc);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setStreaming(false);
    }
  }, [resume, sections, jd, tone, manager, company]);

  function handleCopy() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDocx() {
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const slug = resume.title.replace(/\s+/g, "-").toLowerCase();
      const paragraphs = letter.split(/\n\n+/).flatMap((block) => {
        const paras = block
          .split("\n")
          .filter(Boolean)
          .map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({ text: line, font: "Calibri", size: 24 }),
                ],
                spacing: { after: 0, line: 276 },
              }),
          );
        paras.push(
          new Paragraph({ children: [new TextRun("")], spacing: { after: 0 } }),
        );
        return paras;
      });
      const doc = new Document({
        styles: {
          default: { document: { run: { font: "Calibri", size: 24 } } },
        },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children: paragraphs,
          },
        ],
      });
      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover-letter-${slug}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
    }
  }

  function handlePdf() {
    const slug = resume.title.replace(/\s+/g, "-").toLowerCase();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Lato',Arial,sans-serif;font-size:12pt;line-height:1.7;color:#1a1a1a;padding:1.2in 1.1in;max-width:8.5in}p{margin-bottom:.9em;white-space:pre-wrap}@media print{body{padding:.9in}@page{margin:0;size:letter}}</style></head><body>${letter
      .split(/\n\n+/)
      .map((b) => `<p>${b.replace(/\n/g, "<br>")}</p>`)
      .join("")}</body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.document.title = `cover-letter-${slug}`;
      win.print();
    };
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-[rgba(15,14,13,0.35)]"
        onClick={onClose}
      />
      <div className="fixed top-14 right-0 bottom-0 w-[440px] z-[91] bg-rv-paper border-l border-rv-border flex flex-col shadow-[-8px_0_32px_rgba(15,14,13,0.1)]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-rv-border shrink-0">
          <div className="flex items-center gap-2">
            <LIcon />
            <div>
              <div className="text-[0.8rem] font-bold text-rv-ink">
                Cover Letter
              </div>
              <div className="text-[0.65rem] text-rv-muted">
                AI-generated, tailored to job
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
            <SL>Tone</SL>
            <div className="grid grid-cols-3 gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className="py-2 px-1.5 rounded-sm cursor-pointer text-center border transition-colors"
                  style={{
                    border:
                      tone === t.id
                        ? "1.5px solid var(--rv-accent)"
                        : "1px solid var(--rv-border)",
                    background:
                      tone === t.id
                        ? "rgba(200,75,47,0.06)"
                        : "var(--rv-white)",
                  }}
                >
                  <div
                    className="text-[0.72rem] font-semibold"
                    style={{
                      color:
                        tone === t.id ? "var(--rv-accent)" : "var(--rv-ink)",
                    }}
                  >
                    {t.label}
                  </div>
                  <div className="text-[0.6rem] text-rv-muted mt-0.5">
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <SL>
                Hiring Manager{" "}
                <span className="font-normal normal-case">(optional)</span>
              </SL>
              <input
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className={iCls}
              />
            </div>
            <div>
              <SL>
                Company Name{" "}
                <span className="font-normal normal-case">(optional)</span>
              </SL>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className={iCls}
              />
            </div>
          </div>
          <div>
            <SL>
              Job Description{" "}
              <span className="font-normal normal-case">
                (optional — improves relevance)
              </span>
            </SL>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={4}
              placeholder="Paste the job description here…"
              className={`${iCls} resize-y leading-snug`}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={streaming}
            className={`w-full py-2.5 border-0 rounded-sm text-white text-[0.8rem] font-semibold flex items-center justify-center gap-2 transition-colors ${streaming ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
          >
            {streaming ? (
              <>
                <Spin />
                Generating…
              </>
            ) : (
              <>
                <LIcon white />
                {letter ? "Regenerate" : "Generate Cover Letter"}
              </>
            )}
          </button>
          {error && (
            <div className="text-[0.75rem] text-rv-accent bg-[rgba(200,75,47,0.07)] border border-[rgba(200,75,47,0.2)] rounded-sm px-3 py-2.5">
              {error}
            </div>
          )}
          {letter && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <SL>Generated Letter</SL>
                <div className="flex gap-1.5">
                  <AB onClick={handleCopy}>{copied ? "✓ Copied" : "Copy"}</AB>
                  <AB
                    onClick={
                      isPro
                        ? handleDocx
                        : async () => {
                            const r = await fetch(
                              "/api/lemonsqueezy/checkout",
                              { method: "POST" },
                            );
                            const d = await r.json();
                            if (d.url) window.location.href = d.url;
                          }
                    }
                  >
                    ↓ .docx
                    {!isPro && (
                      <span className="ml-1 text-[0.55rem] font-extrabold bg-rv-accent text-white rounded-full px-1 py-px">
                        PRO
                      </span>
                    )}
                  </AB>
                  <AB onClick={handlePdf}>↓ PDF</AB>
                </div>
              </div>
              <div className="bg-rv-white border border-rv-border rounded-sm p-4 text-[0.75rem] leading-[1.8] text-rv-ink whitespace-pre-wrap min-h-[200px]">
                {letter}
                {streaming && (
                  <span className="inline-block w-1.5 h-3 bg-rv-accent ml-0.5 align-middle animate-pulse" />
                )}
              </div>
            </div>
          )}
          {!letter && !streaming && !error && (
            <div className="text-center py-6 px-4 text-rv-muted">
              <div className="text-4xl mb-2">✉️</div>
              <div className="text-[0.78rem] font-semibold mb-1 text-rv-ink">
                Generate a Cover Letter
              </div>
              <div className="text-[0.72rem] leading-relaxed">
                Fill in the details above. Pasting a job description produces
                the most tailored result.
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
    <label className="block text-[0.68rem] font-semibold text-rv-muted mb-1.5 tracking-[0.04em] uppercase">
      {children}
    </label>
  );
}
function AB({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[0.68rem] font-semibold px-2.5 py-0.5 border border-rv-border rounded-sm bg-rv-white cursor-pointer text-rv-ink hover:border-rv-accent hover:text-rv-accent transition-colors"
    >
      {children}
    </button>
  );
}
function LIcon({ white = false }: { white?: boolean }) {
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
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
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
