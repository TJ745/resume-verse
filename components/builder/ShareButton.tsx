"use client";

import { useState, useTransition } from "react";
import { togglePublic } from "@/actions/resume.actions";

interface Props {
  resumeId: string;
  isPublic: boolean;
}

export default function ShareButton({
  resumeId,
  isPublic: initialPublic,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${resumeId}`;

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(() => togglePublic(resumeId, next));
  }
  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-sm px-3 py-1.5 cursor-pointer transition-all duration-150 ${isPublic ? "bg-[rgba(45,90,61,0.07)] border-[rgba(45,90,61,0.3)] text-[#2d5a3d]" : "bg-transparent border-rv-border text-rv-muted hover:border-rv-accent hover:text-rv-accent"}`}
      >
        <svg
          viewBox="0 0 16 16"
          width={12}
          height={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="shrink-0"
        >
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <line x1="5.5" y1="7.2" x2="10.5" y2="4.8" />
          <line x1="5.5" y1="8.8" x2="10.5" y2="11.2" />
        </svg>
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+6px)] right-0 z-50 bg-rv-white border border-rv-border rounded-lg shadow-[0_8px_24px_rgba(15,14,13,0.12)] p-4 w-70">
            <p className="text-[0.72rem] font-bold text-rv-ink mb-2 tracking-[0.04em] uppercase">
              Share Resume
            </p>
            <p className="text-[0.75rem] text-rv-muted leading-snug mb-3.5">
              {isPublic
                ? "Anyone with the link can view your resume."
                : "Enable public link to share your resume with anyone."}
            </p>

            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[0.78rem] font-semibold text-rv-ink">
                Public link
              </span>
              <button
                onClick={handleToggle}
                disabled={isPending}
                className={`w-10 h-5.5 rounded-full border-0 cursor-pointer relative shrink-0 transition-colors duration-200 ${isPublic ? "bg-[#2d5a3d]" : "bg-rv-border"}`}
              >
                <span
                  className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${isPublic ? "left-5.25" : "left-0.75"}`}
                />
              </button>
            </div>

            {isPublic && (
              <div className="flex gap-1.5">
                <input
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 text-[0.68rem] px-2 py-1.5 border border-rv-border rounded-sm bg-rv-cream text-rv-muted outline-none"
                />
                <button
                  onClick={handleCopy}
                  className={`px-2.5 py-1.5 text-[0.68rem] font-bold text-white border-0 rounded-sm cursor-pointer shrink-0 transition-colors ${copied ? "bg-[#2d5a3d]" : "bg-rv-ink hover:bg-rv-accent"}`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
