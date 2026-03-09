"use client";

import { useTransition } from "react";
import { createResume } from "@/actions/resume.actions";

export default function NewResumeButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => createResume())}
      disabled={isPending}
      className="flex flex-col items-center justify-center gap-3 w-full transition-colors duration-200"
      style={{
        background: isPending ? "var(--rv-cream)" : "transparent",
        border: "2px dashed var(--rv-border)",
        cursor: isPending ? "not-allowed" : "pointer",
        minHeight: 240,
        padding: "2rem",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!isPending) {
          e.currentTarget.style.borderColor = "var(--rv-accent)";
          e.currentTarget.style.background = "rgba(200,75,47,0.03)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--rv-border)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isPending ? "var(--rv-border)" : "var(--rv-accent)",
          color: "var(--rv-white)",
          fontSize: "1.25rem",
          lineHeight: 1,
          transition: "background 0.15s",
        }}
      >
        {isPending ? "…" : "+"}
      </div>
      <span
        className="text-sm font-medium"
        style={{ color: isPending ? "var(--rv-muted)" : "var(--rv-ink)" }}
      >
        {isPending ? "Creating…" : "New resume"}
      </span>
    </button>
  );
}
