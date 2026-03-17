// "use client";

// import { useState, useTransition, useEffect, useRef } from "react";
// import { createResume } from "@/actions/resume.actions";

// export default function NewResumeButton() {
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Focus input when modal opens
//   useEffect(() => {
//     if (open) {
//       setTitle("");
//       setTimeout(() => inputRef.current?.focus(), 50);
//     }
//   }, [open]);

//   // Close on Escape
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape" && !isPending) setOpen(false);
//     }
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [isPending]);

//   function handleCreate() {
//     startTransition(() => createResume(title.trim() || "Untitled Resume"));
//   }

//   return (
//     <>
//       {/* ── Card trigger ── */}
//       <button
//         onClick={() => setOpen(true)}
//         className="flex flex-col items-center justify-center gap-3 w-full transition-colors duration-200"
//         style={{
//           background: "transparent",
//           border: "2px dashed var(--rv-border)",
//           cursor: "pointer",
//           minHeight: 240,
//           padding: "2rem",
//           fontFamily: "inherit",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.borderColor = "var(--rv-accent)";
//           e.currentTarget.style.background = "rgba(200,75,47,0.03)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.borderColor = "var(--rv-border)";
//           e.currentTarget.style.background = "transparent";
//         }}
//       >
//         <div
//           className="flex items-center justify-center"
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: "50%",
//             background: "var(--rv-accent)",
//             color: "var(--rv-white)",
//             fontSize: "1.25rem",
//             lineHeight: 1,
//           }}
//         >
//           +
//         </div>
//         <span
//           className="text-sm font-medium"
//           style={{ color: "var(--rv-ink)" }}
//         >
//           New resume
//         </span>
//       </button>

//       {/* ── Modal ── */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 100,
//             background: "rgba(15,14,13,0.45)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "1rem",
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget && !isPending) setOpen(false);
//           }}
//         >
//           <div
//             style={{
//               background: "var(--rv-white)",
//               border: "1px solid var(--rv-border)",
//               borderRadius: 4,
//               padding: "2rem",
//               width: "100%",
//               maxWidth: 440,
//               boxShadow: "0 24px 64px rgba(15,14,13,0.2)",
//             }}
//           >
//             {/* Header */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "1.5rem",
//               }}
//             >
//               <div>
//                 <h2
//                   style={{
//                     fontSize: "1.1rem",
//                     fontWeight: 600,
//                     color: "var(--rv-ink)",
//                     margin: 0,
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   New resume
//                 </h2>
//                 <p
//                   style={{
//                     fontSize: "0.8rem",
//                     color: "var(--rv-muted)",
//                     margin: "0.25rem 0 0",
//                   }}
//                 >
//                   Give your resume a name to get started.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 disabled={isPending}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "var(--rv-muted)",
//                   fontSize: "1.2rem",
//                   lineHeight: 1,
//                   padding: 4,
//                   fontFamily: "inherit",
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Name input */}
//             <div style={{ marginBottom: "1.5rem" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "0.72rem",
//                   fontWeight: 600,
//                   color: "var(--rv-muted)",
//                   letterSpacing: "0.06em",
//                   marginBottom: 6,
//                 }}
//               >
//                 RESUME NAME
//               </label>
//               <input
//                 ref={inputRef}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !isPending) handleCreate();
//                 }}
//                 placeholder="e.g. Software Engineer — Google"
//                 disabled={isPending}
//                 style={{
//                   width: "100%",
//                   padding: "0.65rem 0.875rem",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   background: "var(--rv-paper)",
//                   color: "var(--rv-ink)",
//                   fontSize: "0.9rem",
//                   outline: "none",
//                   fontFamily: "inherit",
//                   boxSizing: "border-box",
//                   transition: "border-color 0.15s",
//                 }}
//                 onFocus={(e) =>
//                   (e.currentTarget.style.borderColor = "var(--rv-accent)")
//                 }
//                 onBlur={(e) =>
//                   (e.currentTarget.style.borderColor = "var(--rv-border)")
//                 }
//               />
//             </div>

//             {/* Actions */}
//             <div
//               style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
//             >
//               <button
//                 onClick={() => setOpen(false)}
//                 disabled={isPending}
//                 style={{
//                   padding: "0.55rem 1.1rem",
//                   background: "none",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   cursor: "pointer",
//                   color: "var(--rv-muted)",
//                   fontSize: "0.85rem",
//                   fontFamily: "inherit",
//                   fontWeight: 500,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreate}
//                 disabled={isPending}
//                 style={{
//                   padding: "0.55rem 1.4rem",
//                   background: isPending
//                     ? "var(--rv-muted)"
//                     : "var(--rv-accent)",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 2,
//                   cursor: isPending ? "not-allowed" : "pointer",
//                   fontSize: "0.85rem",
//                   fontFamily: "inherit",
//                   fontWeight: 600,
//                   transition: "background 0.15s",
//                   minWidth: 130,
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isPending)
//                     e.currentTarget.style.background = "var(--rv-ink)";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isPending)
//                     e.currentTarget.style.background = "var(--rv-accent)";
//                 }}
//               >
//                 {isPending ? "Creating…" : "Create resume →"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createResume } from "@/actions/resume.actions";

export default function NewResumeButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) {
        setOpen(false);
        setShowUpgrade(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPending]);

  async function handleCreate() {
    startTransition(async () => {
      const result = await createResume(title.trim() || "Untitled Resume");
      if (result?.error) {
        setOpen(false);
        setShowUpgrade(true);
      }
    });
  }

  async function handleUpgrade() {
    const res = await fetch("/api/lemonsqueezy/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
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

      {/* Upgrade modal — shown when free plan limit hit */}
      {showUpgrade && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,14,13,0.5)",
              zIndex: 100,
            }}
            onClick={() => setShowUpgrade(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101,
              background: "var(--rv-white)",
              borderRadius: 4,
              padding: "2rem",
              maxWidth: 380,
              width: "90%",
              boxShadow: "0 20px 60px rgba(15,14,13,0.2)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(200,75,47,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 22,
                  height: 22,
                  stroke: "var(--rv-accent)",
                  fill: "none",
                  strokeWidth: 1.5,
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3
              className="font-serif"
              style={{
                fontSize: "1.25rem",
                color: "var(--rv-ink)",
                marginBottom: "0.5rem",
              }}
            >
              Resume limit reached
            </h3>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--rv-muted)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              The Free plan includes 1 resume. Upgrade to Pro for unlimited
              resumes, all 10 templates, DOCX export, and unlimited AI tools.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                onClick={handleUpgrade}
                style={{
                  padding: "0.55rem 1.25rem",
                  background: "var(--rv-accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 2,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Upgrade to Pro →
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                style={{
                  padding: "0.55rem 1rem",
                  background: "none",
                  color: "var(--rv-muted)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
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
