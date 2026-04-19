"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  renameResume,
  deleteResume,
  duplicateResume,
} from "@/actions/resume.actions";
import ExportPDFButton from "@/components/shared/ExportPDFButton";

interface ResumeCardProps {
  id: string;
  title: string;
  template: string;
  colorScheme: string;
  font?: string;
  fontSize?: string;
  updatedAt: Date;
  jobTitle?: string;
}

export default function ResumeCard({
  id,
  title,
  template,
  colorScheme,
  font,
  fontSize,
  updatedAt,
  jobTitle,
}: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameValue, setNameValue] = useState(title);
  const [limitError, setLimitError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  function handleRenameSubmit() {
    if (nameValue.trim() === title) {
      setRenaming(false);
      return;
    }
    startTransition(async () => {
      await renameResume(id, nameValue);
      setRenaming(false);
    });
  }
  function handleDelete() {
    setMenuOpen(false);
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(() => deleteResume(id));
  }
  function handleDuplicate() {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await duplicateResume(id);
      if (result?.error) setLimitError(true);
    });
  }
  async function handleUpgradeFromLimit() {
    setLimitError(false);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const templateLabel = template.charAt(0).toUpperCase() + template.slice(1);
  const timeAgo = formatTimeAgo(updatedAt);

  return (
    <>
      <div
        className={`group relative flex flex-col bg-rv-white border border-rv-border transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(15,14,13,0.08)] ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Preview area */}
        <Link href={`/builder/${id}`} className="block no-underline p-5 pb-4">
          <div className="w-full h-35 bg-rv-cream border border-rv-border p-3 overflow-hidden flex flex-col gap-1.5">
            {/* Skeleton that reflects template style */}
            <div
              className="h-1 rounded-sm w-1/2"
              style={{ background: "var(--rv-accent)" }}
            />
            <div className="h-2 rounded-sm w-4/5 bg-rv-border" />
            <div className="h-1.5 rounded-sm w-2/5 bg-rv-border" />
            <div className="h-px bg-rv-border my-1" />
            <div className="h-1.5 rounded-sm w-[90%] bg-rv-border" />
            <div className="h-1.5 rounded-sm w-[70%] bg-rv-border" />
            <div className="h-1.5 rounded-sm w-[85%] bg-rv-border" />
            <div className="h-1.5 rounded-sm w-[60%] bg-rv-border" />
          </div>
        </Link>

        {/* Footer */}
        <div className="flex items-start justify-between px-5 pb-5 gap-2">
          <div className="flex-1 min-w-0">
            {renaming ? (
              <input
                ref={inputRef}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") {
                    setNameValue(title);
                    setRenaming(false);
                  }
                }}
                className="w-full text-sm font-medium bg-transparent border-0 border-b border-rv-accent text-rv-ink outline-none pb-px"
              />
            ) : (
              <p className="text-sm font-medium text-rv-ink truncate">
                {title}
              </p>
            )}
            <p className="text-xs text-rv-muted mt-0.5">
              {templateLabel} · {timeAgo}
            </p>
            {jobTitle && (
              <p className="text-[0.65rem] font-semibold text-rv-accent mt-1 truncate tracking-[0.02em]">
                ✦ {jobTitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* PDF export — passes template+colorScheme+font+fontSize for correct output */}
            <ExportPDFButton
              resumeId={id}
              variant="card"
              template={template}
              colorScheme={colorScheme}
              font={font}
              fontSize={fontSize}
            />

            {/* 3-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen((o) => !o);
                }}
                className={`w-7 h-7 rounded-sm border-0 cursor-pointer text-rv-muted text-base flex items-center justify-center transition-colors ${menuOpen ? "bg-rv-cream" : "bg-transparent hover:bg-rv-cream"}`}
              >
                ···
              </button>

              {menuOpen && (
                <div className="absolute right-0 bottom-full mb-1 py-1 min-w-40 bg-rv-white border border-rv-border rounded-sm shadow-[0_8px_24px_rgba(15,14,13,0.1)] z-10">
                  {[
                    {
                      label: "Rename",
                      action: () => {
                        setMenuOpen(false);
                        setRenaming(true);
                      },
                      danger: false,
                    },
                    {
                      label: "Duplicate",
                      action: handleDuplicate,
                      danger: false,
                    },
                    { label: "Delete", action: handleDelete, danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full text-left px-4 py-2 text-sm bg-transparent border-0 cursor-pointer hover:bg-rv-cream transition-colors ${item.danger ? "text-rv-accent" : "text-rv-ink"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade modal */}
      {limitError && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(15,14,13,0.5)] z-100"
            onClick={() => setLimitError(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-rv-white rounded-lg p-8 max-w-95 w-[90%] shadow-[0_20px_60px_rgba(15,14,13,0.2)] text-center">
            <div className="w-11 h-11 rounded-full bg-[rgba(200,75,47,0.08)] flex items-center justify-center mx-auto mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-5.5 h-5.5 stroke-rv-accent fill-none"
                strokeWidth={1.5}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-[1.25rem] text-rv-ink mb-2">
              Resume limit reached
            </h3>
            <p className="text-[0.82rem] text-rv-muted leading-relaxed mb-6">
              The Free plan includes 1 resume. Upgrade to Pro for unlimited
              resumes, all 10 templates, DOCX export, and unlimited AI tools.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUpgradeFromLimit}
                className="px-5 py-2 bg-rv-accent text-white border-0 rounded-sm text-[0.82rem] font-bold cursor-pointer hover:bg-rv-ink transition-colors"
              >
                Upgrade to Pro →
              </button>
              <button
                onClick={() => setLimitError(false)}
                className="px-4 py-2 bg-transparent text-rv-muted border border-rv-border rounded-sm text-[0.82rem] cursor-pointer hover:border-rv-ink hover:text-rv-ink transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function formatTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
