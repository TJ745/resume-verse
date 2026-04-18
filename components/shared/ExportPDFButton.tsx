"use client";

import { useState } from "react";

interface Props {
  resumeId:    string;
  variant?:    "topbar" | "card";
  template?:   string;
  colorScheme?: string;
}

export default function ExportPDFButton({
  resumeId,
  variant = "topbar",
  template,
  colorScheme,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  function buildUrl() {
    // Always pass the current template + colorScheme as URL params so
    // Puppeteer renders exactly what the user sees — not the stale DB value.
    const p = new URLSearchParams({ resumeId });
    if (template)    p.set("template",    template);
    if (colorScheme) p.set("colorScheme", colorScheme);
    return `/api/resume/export?${p.toString()}`;
  }

  async function handleExport() {
    setLoading(true); setError(false);
    try {
      window.open(buildUrl(), "_blank");
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "topbar") {
    return (
      <button
        onClick={handleExport}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold border-0 rounded-sm px-4 py-1.5 whitespace-nowrap transition-colors duration-150 ${
          loading ? "bg-rv-muted cursor-not-allowed text-white" : "bg-rv-ink text-white cursor-pointer hover:bg-rv-accent"
        }`}
      >
        {loading ? <><Spin />Generating…</> : error ? "Failed — retry" : <><PDF />Export PDF</>}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleExport(); }}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-xs font-medium border-0 bg-transparent py-1 cursor-pointer transition-colors ${
        loading ? "text-rv-muted cursor-not-allowed" : "text-rv-muted hover:text-rv-accent"
      }`}
      title="Export as PDF"
    >
      {loading ? <Spin /> : <PDF />}
      {loading ? "Generating…" : "PDF"}
    </button>
  );
}

function PDF() {
  return (
    <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.5} className="shrink-0">
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <path d="M9 2v4h4" /><path d="M6 9h4M6 11.5h2" />
    </svg>
  );
}

function Spin() {
  return (
    <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.5} className="shrink-0 animate-spin">
      <circle cx="8" cy="8" r="6" strokeOpacity="0.3" /><path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
}