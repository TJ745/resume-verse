"use client";

import { useState } from "react";

interface ExportPDFButtonProps {
  resumeId: string;
  variant?: "topbar" | "card";
}

export default function ExportPDFButton({
  resumeId,
  variant = "topbar",
}: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleExport() {
    setLoading(true);
    setError(false);

    try {
      const url = `/api/resume/export?resumeId=${resumeId}`;

      // Open PDF in new tab
      window.open(url, "_blank");

      // Small delay so the tab opens before we reset state
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  // ── Topbar variant ────────────────────────────────────────
  if (variant === "topbar") {
    return (
      <button
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
        style={{
          background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
          color: "var(--rv-white)",
          border: "none",
          borderRadius: 2,
          padding: "0.45rem 1rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--rv-accent)";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--rv-ink)";
        }}
      >
        {loading ? (
          <>
            <SpinnerIcon />
            Generating…
          </>
        ) : error ? (
          "Failed — retry"
        ) : (
          <>
            <PDFIcon />
            Export PDF
          </>
        )}
      </button>
    );
  }

  // ── Card variant (dashboard) ──────────────────────────────
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleExport();
      }}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-150"
      style={{
        background: "none",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        color: loading ? "var(--rv-muted)" : "var(--rv-muted)",
        fontFamily: "inherit",
        padding: "0.25rem 0",
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.color = "var(--rv-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--rv-muted)";
      }}
      title="Export as PDF"
    >
      {loading ? <SpinnerIcon /> : <PDFIcon />}
      {loading ? "Generating…" : "PDF"}
    </button>
  );
}

function PDFIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 12,
        height: 12,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        flexShrink: 0,
      }}
    >
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <path d="M9 2v4h4" />
      <path d="M6 9h4M6 11.5h2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 12,
        height: 12,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        flexShrink: 0,
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" strokeOpacity="0.3" />
      <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
}
