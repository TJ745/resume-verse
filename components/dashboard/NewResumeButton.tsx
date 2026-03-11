// "use client";

// import { useTransition } from "react";
// import { createResume } from "@/actions/resume.actions";

// export default function NewResumeButton() {
//   const [isPending, startTransition] = useTransition();

//   return (
//     <button
//       onClick={() => startTransition(() => createResume())}
//       disabled={isPending}
//       className="flex flex-col items-center justify-center gap-3 w-full transition-colors duration-200"
//       style={{
//         background: isPending ? "var(--rv-cream)" : "transparent",
//         border: "2px dashed var(--rv-border)",
//         cursor: isPending ? "not-allowed" : "pointer",
//         minHeight: 240,
//         padding: "2rem",
//         fontFamily: "inherit",
//       }}
//       onMouseEnter={(e) => {
//         if (!isPending) {
//           e.currentTarget.style.borderColor = "var(--rv-accent)";
//           e.currentTarget.style.background = "rgba(200,75,47,0.03)";
//         }
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.borderColor = "var(--rv-border)";
//         e.currentTarget.style.background = "transparent";
//       }}
//     >
//       <div
//         className="flex items-center justify-center"
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: "50%",
//           background: isPending ? "var(--rv-border)" : "var(--rv-accent)",
//           color: "var(--rv-white)",
//           fontSize: "1.25rem",
//           lineHeight: 1,
//           transition: "background 0.15s",
//         }}
//       >
//         {isPending ? "…" : "+"}
//       </div>
//       <span
//         className="text-sm font-medium"
//         style={{ color: isPending ? "var(--rv-muted)" : "var(--rv-ink)" }}
//       >
//         {isPending ? "Creating…" : "New resume"}
//       </span>
//     </button>
//   );
// }

"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createResume } from "@/actions/resume.actions";

export default function NewResumeButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPending]);

  function handleCreate() {
    startTransition(() => createResume(title.trim() || "Untitled Resume"));
  }

  return (
    <>
      {/* ── Card trigger ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 w-full transition-colors duration-200"
        style={{
          background: "transparent",
          border: "2px dashed var(--rv-border)",
          cursor: "pointer",
          minHeight: 240,
          padding: "2rem",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--rv-accent)";
          e.currentTarget.style.background = "rgba(200,75,47,0.03)";
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
            background: "var(--rv-accent)",
            color: "var(--rv-white)",
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
        >
          +
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--rv-ink)" }}
        >
          New resume
        </span>
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(15,14,13,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) setOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--rv-white)",
              border: "1px solid var(--rv-border)",
              borderRadius: 4,
              padding: "2rem",
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 24px 64px rgba(15,14,13,0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--rv-ink)",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  New resume
                </h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--rv-muted)",
                    margin: "0.25rem 0 0",
                  }}
                >
                  Give your resume a name to get started.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--rv-muted)",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                  padding: 4,
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            </div>

            {/* Name input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--rv-muted)",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                RESUME NAME
              </label>
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isPending) handleCreate();
                }}
                placeholder="e.g. Software Engineer — Google"
                disabled={isPending}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.875rem",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  background: "var(--rv-paper)",
                  color: "var(--rv-ink)",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rv-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rv-border)")
                }
              />
            </div>

            {/* Actions */}
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                style={{
                  padding: "0.55rem 1.1rem",
                  background: "none",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  cursor: "pointer",
                  color: "var(--rv-muted)",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                style={{
                  padding: "0.55rem 1.4rem",
                  background: isPending
                    ? "var(--rv-muted)"
                    : "var(--rv-accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 2,
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  transition: "background 0.15s",
                  minWidth: 130,
                }}
                onMouseEnter={(e) => {
                  if (!isPending)
                    e.currentTarget.style.background = "var(--rv-ink)";
                }}
                onMouseLeave={(e) => {
                  if (!isPending)
                    e.currentTarget.style.background = "var(--rv-accent)";
                }}
              >
                {isPending ? "Creating…" : "Create resume →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
