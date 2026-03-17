// "use client";

// import { useState, useRef, useEffect, useTransition } from "react";
// import Link from "next/link";
// import {
//   renameResume,
//   deleteResume,
//   duplicateResume,
// } from "@/actions/resume.actions";
// import ExportPDFButton from "@/components/shared/ExportPDFButton";

// interface ResumeCardProps {
//   id: string;
//   title: string;
//   template: string;
//   updatedAt: Date;
//   jobTitle?: string;
// }

// export default function ResumeCard({
//   id,
//   title,
//   template,
//   updatedAt,
//   jobTitle,
// }: ResumeCardProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [renaming, setRenaming] = useState(false);
//   const [nameValue, setNameValue] = useState(title);
//   const [isPending, startTransition] = useTransition();
//   const menuRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Close menu on outside click
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   // Focus input when renaming
//   useEffect(() => {
//     if (renaming) inputRef.current?.select();
//   }, [renaming]);

//   function handleRenameSubmit() {
//     if (nameValue.trim() === title) {
//       setRenaming(false);
//       return;
//     }
//     startTransition(async () => {
//       await renameResume(id, nameValue);
//       setRenaming(false);
//     });
//   }

//   function handleDelete() {
//     setMenuOpen(false);
//     if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
//     startTransition(() => deleteResume(id));
//   }

//   function handleDuplicate() {
//     setMenuOpen(false);
//     startTransition(() => duplicateResume(id));
//   }

//   const templateLabel = template.charAt(0).toUpperCase() + template.slice(1);

//   const timeAgo = formatTimeAgo(updatedAt);

//   return (
//     <div
//       className="group relative flex flex-col transition-shadow duration-200"
//       style={{
//         background: "var(--rv-white)",
//         border: "1px solid var(--rv-border)",
//         opacity: isPending ? 0.5 : 1,
//         pointerEvents: isPending ? "none" : "auto",
//       }}
//     >
//       {/* Resume preview area */}
//       <Link
//         href={`/builder/${id}`}
//         className="block no-underline"
//         style={{ padding: "1.75rem 1.75rem 1.25rem" }}
//       >
//         <div
//           className="w-full flex flex-col gap-2 mb-4"
//           style={{
//             height: 140,
//             background: "var(--rv-cream)",
//             border: "1px solid var(--rv-border)",
//             padding: "1rem",
//             overflow: "hidden",
//           }}
//         >
//           {/* Mini resume preview */}
//           <div
//             style={{
//               height: 3,
//               background: "var(--rv-accent)",
//               width: "50%",
//               borderRadius: 1,
//             }}
//           />
//           <div
//             style={{
//               height: 8,
//               background: "var(--rv-border)",
//               width: "80%",
//               borderRadius: 1,
//             }}
//           />
//           <div
//             style={{
//               height: 5,
//               background: "var(--rv-border)",
//               width: "40%",
//               borderRadius: 1,
//             }}
//           />
//           <div
//             style={{
//               height: 1,
//               background: "var(--rv-border)",
//               margin: "4px 0",
//             }}
//           />
//           <div
//             style={{
//               height: 5,
//               background: "var(--rv-border)",
//               width: "90%",
//               borderRadius: 1,
//             }}
//           />
//           <div
//             style={{
//               height: 5,
//               background: "var(--rv-border)",
//               width: "70%",
//               borderRadius: 1,
//             }}
//           />
//           <div
//             style={{
//               height: 5,
//               background: "var(--rv-border)",
//               width: "85%",
//               borderRadius: 1,
//             }}
//           />
//         </div>
//       </Link>

//       {/* Card footer */}
//       <div
//         className="flex items-start justify-between px-5 pb-5"
//         style={{ gap: "0.5rem" }}
//       >
//         <div className="flex-1 min-w-0">
//           {/* Title — inline rename */}
//           {renaming ? (
//             <input
//               ref={inputRef}
//               value={nameValue}
//               onChange={(e) => setNameValue(e.target.value)}
//               onBlur={handleRenameSubmit}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleRenameSubmit();
//                 if (e.key === "Escape") {
//                   setNameValue(title);
//                   setRenaming(false);
//                 }
//               }}
//               className="w-full text-sm font-medium"
//               style={{
//                 border: "none",
//                 borderBottom: "1px solid var(--rv-accent)",
//                 background: "transparent",
//                 color: "var(--rv-ink)",
//                 outline: "none",
//                 fontFamily: "inherit",
//                 padding: "0 0 2px",
//               }}
//             />
//           ) : (
//             <p
//               className="text-sm font-medium truncate"
//               style={{ color: "var(--rv-ink)" }}
//             >
//               {title}
//             </p>
//           )}

//           <p className="text-xs mt-0.5" style={{ color: "var(--rv-muted)" }}>
//             {templateLabel} · {timeAgo}
//           </p>
//           {jobTitle && (
//             <p
//               className="text-xs mt-1 truncate"
//               style={{
//                 color: "var(--rv-accent)",
//                 fontWeight: 600,
//                 fontSize: "0.65rem",
//                 letterSpacing: "0.02em",
//               }}
//             >
//               ✦ {jobTitle}
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-1">
//           <ExportPDFButton resumeId={id} variant="card" />
//         </div>

//         {/* 3-dot menu */}
//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               setMenuOpen((o) => !o);
//             }}
//             className="flex items-center justify-center transition-colors duration-150"
//             style={{
//               width: 28,
//               height: 28,
//               borderRadius: 2,
//               border: "none",
//               background: menuOpen ? "var(--rv-cream)" : "transparent",
//               cursor: "pointer",
//               color: "var(--rv-muted)",
//               fontSize: "1rem",
//               flexShrink: 0,
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.background = "var(--rv-cream)")
//             }
//             onMouseLeave={(e) => {
//               if (!menuOpen) e.currentTarget.style.background = "transparent";
//             }}
//           >
//             ···
//           </button>

//           {menuOpen && (
//             <div
//               className="absolute right-0 bottom-full mb-1 py-1"
//               style={{
//                 minWidth: 160,
//                 background: "var(--rv-white)",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
//                 zIndex: 10,
//               }}
//             >
//               {[
//                 {
//                   label: "Rename",
//                   action: () => {
//                     setMenuOpen(false);
//                     setRenaming(true);
//                   },
//                   danger: false,
//                 },
//                 {
//                   label: "Duplicate",
//                   action: handleDuplicate,
//                   danger: false,
//                 },
//                 {
//                   label: "Delete",
//                   action: handleDelete,
//                   danger: true,
//                 },
//               ].map((item) => (
//                 <button
//                   key={item.label}
//                   onClick={item.action}
//                   className="w-full text-left px-4 py-2 text-sm transition-colors duration-100"
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: item.danger ? "#c84b2f" : "var(--rv-ink)",
//                     fontFamily: "inherit",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "var(--rv-cream)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "none")
//                   }
//                 >
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function formatTimeAgo(date: Date): string {
//   const now = new Date();
//   const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
//   if (diff < 60) return "Just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return new Date(date).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }

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
  updatedAt: Date;
  jobTitle?: string;
}

export default function ResumeCard({
  id,
  title,
  template,
  updatedAt,
  jobTitle,
}: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameValue, setNameValue] = useState(title);
  const [isPending, startTransition] = useTransition();
  const [limitError, setLimitError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus input when renaming
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
    const res = await fetch("/api/lemonsqueezy/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const templateLabel = template.charAt(0).toUpperCase() + template.slice(1);

  const timeAgo = formatTimeAgo(updatedAt);

  return (
    <>
      <div
        className="group relative flex flex-col transition-shadow duration-200"
        style={{
          background: "var(--rv-white)",
          border: "1px solid var(--rv-border)",
          opacity: isPending ? 0.5 : 1,
          pointerEvents: isPending ? "none" : "auto",
        }}
      >
        {/* Resume preview area */}
        <Link
          href={`/builder/${id}`}
          className="block no-underline"
          style={{ padding: "1.75rem 1.75rem 1.25rem" }}
        >
          <div
            className="w-full flex flex-col gap-2 mb-4"
            style={{
              height: 140,
              background: "var(--rv-cream)",
              border: "1px solid var(--rv-border)",
              padding: "1rem",
              overflow: "hidden",
            }}
          >
            {/* Mini resume preview */}
            <div
              style={{
                height: 3,
                background: "var(--rv-accent)",
                width: "50%",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 8,
                background: "var(--rv-border)",
                width: "80%",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 5,
                background: "var(--rv-border)",
                width: "40%",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 1,
                background: "var(--rv-border)",
                margin: "4px 0",
              }}
            />
            <div
              style={{
                height: 5,
                background: "var(--rv-border)",
                width: "90%",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 5,
                background: "var(--rv-border)",
                width: "70%",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                height: 5,
                background: "var(--rv-border)",
                width: "85%",
                borderRadius: 1,
              }}
            />
          </div>
        </Link>

        {/* Card footer */}
        <div
          className="flex items-start justify-between px-5 pb-5"
          style={{ gap: "0.5rem" }}
        >
          <div className="flex-1 min-w-0">
            {/* Title — inline rename */}
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
                className="w-full text-sm font-medium"
                style={{
                  border: "none",
                  borderBottom: "1px solid var(--rv-accent)",
                  background: "transparent",
                  color: "var(--rv-ink)",
                  outline: "none",
                  fontFamily: "inherit",
                  padding: "0 0 2px",
                }}
              />
            ) : (
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--rv-ink)" }}
              >
                {title}
              </p>
            )}

            <p className="text-xs mt-0.5" style={{ color: "var(--rv-muted)" }}>
              {templateLabel} · {timeAgo}
            </p>
            {jobTitle && (
              <p
                className="text-xs mt-1 truncate"
                style={{
                  color: "var(--rv-accent)",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  letterSpacing: "0.02em",
                }}
              >
                ✦ {jobTitle}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ExportPDFButton resumeId={id} variant="card" />
          </div>

          {/* 3-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen((o) => !o);
              }}
              className="flex items-center justify-center transition-colors duration-150"
              style={{
                width: 28,
                height: 28,
                borderRadius: 2,
                border: "none",
                background: menuOpen ? "var(--rv-cream)" : "transparent",
                cursor: "pointer",
                color: "var(--rv-muted)",
                fontSize: "1rem",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rv-cream)")
              }
              onMouseLeave={(e) => {
                if (!menuOpen) e.currentTarget.style.background = "transparent";
              }}
            >
              ···
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 bottom-full mb-1 py-1"
                style={{
                  minWidth: 160,
                  background: "var(--rv-white)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
                  zIndex: 10,
                }}
              >
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
                  {
                    label: "Delete",
                    action: handleDelete,
                    danger: true,
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left px-4 py-2 text-sm transition-colors duration-100"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: item.danger ? "#c84b2f" : "var(--rv-ink)",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--rv-cream)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade modal — shown when free plan duplicate limit hit */}
      {limitError && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,14,13,0.5)",
              zIndex: 100,
            }}
            onClick={() => setLimitError(false)}
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
                onClick={handleUpgradeFromLimit}
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
                onClick={() => setLimitError(false)}
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

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
