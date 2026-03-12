// "use client";

// import { useState, useTransition, useRef, useEffect } from "react";
// import Link from "next/link";
// import { updateResumeMeta } from "@/actions/builder.actions";
// import ExportPDFButton from "@/components/shared/ExportPDFButton";

// // ── Templates & color schemes ─────────────────────────────
// // Imported for local use + re-exported so other files can import from here
// import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
// export { TEMPLATES, COLOR_SCHEMES };

// // ── Props ─────────────────────────────────────────────────

// interface BuilderTopbarProps {
//   resumeId: string;
//   title: string;
//   template: string;
//   colorScheme?: string;
//   onATSOpen: () => void;
// }

// // ── Reusable dropdown wrapper ─────────────────────────────

// function Dropdown({
//   trigger,
//   children,
//   align = "right",
// }: {
//   trigger: React.ReactNode;
//   children: React.ReactNode;
//   align?: "left" | "right";
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node))
//         setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
//       {open && (
//         <div
//           className="absolute mt-1 z-50 py-1"
//           style={{
//             top: "100%",
//             [align === "right" ? "right" : "left"]: 0,
//             background: "var(--rv-white)",
//             border: "1px solid var(--rv-border)",
//             borderRadius: 2,
//             boxShadow: "0 12px 32px rgba(15,14,13,0.12)",
//             minWidth: 220,
//           }}
//           onClick={() => setOpen(false)}
//         >
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Chevron icon ──────────────────────────────────────────

// function ChevronDown() {
//   return (
//     <svg
//       viewBox="0 0 12 12"
//       style={{
//         width: 10,
//         height: 10,
//         stroke: "currentColor",
//         fill: "none",
//         strokeWidth: 1.5,
//       }}
//     >
//       <path d="M2 4l4 4 4-4" />
//     </svg>
//   );
// }

// // ── Main component ────────────────────────────────────────

// export default function BuilderTopbar({
//   resumeId,
//   title,
//   template,
//   colorScheme = "terracotta",
//   onATSOpen,
// }: BuilderTopbarProps) {
//   const [editingTitle, setEditingTitle] = useState(false);
//   const [titleValue, setTitleValue] = useState(title);
//   const [currentTemplate, setCurrentTemplate] = useState(template);
//   const [currentScheme, setCurrentScheme] = useState(colorScheme);
//   const [isPending, startTransition] = useTransition();

//   const activeTemplate =
//     TEMPLATES.find((t) => t.id === currentTemplate) ?? TEMPLATES[0];
//   const activeScheme =
//     COLOR_SCHEMES.find((s) => s.id === currentScheme) ?? COLOR_SCHEMES[0];

//   function handleTitleBlur() {
//     setEditingTitle(false);
//     if (titleValue.trim() === title) return;
//     startTransition(() =>
//       updateResumeMeta(resumeId, {
//         title: titleValue.trim() || "Untitled Resume",
//       }),
//     );
//   }

//   function handleTemplateChange(id: string) {
//     setCurrentTemplate(id);
//     startTransition(() => updateResumeMeta(resumeId, { template: id }));
//   }

//   function handleSchemeChange(id: string) {
//     setCurrentScheme(id);
//     startTransition(() => updateResumeMeta(resumeId, { colorScheme: id }));
//   }

//   return (
//     <header
//       className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 gap-4"
//       style={{
//         height: 56,
//         background: "var(--rv-paper)",
//         borderBottom: "1px solid var(--rv-border)",
//       }}
//     >
//       {/* ── Left: back + title ── */}
//       <div className="flex items-center gap-4 min-w-0">
//         <Link
//           href="/dashboard"
//           className="flex items-center gap-1.5 text-sm no-underline flex-shrink-0 transition-opacity duration-150 hover:opacity-60"
//           style={{ color: "var(--rv-muted)" }}
//         >
//           <span>←</span>
//           <span className="hidden sm:inline">Dashboard</span>
//         </Link>

//         <span style={{ color: "var(--rv-border)", userSelect: "none" }}>|</span>

//         {editingTitle ? (
//           <input
//             autoFocus
//             value={titleValue}
//             onChange={(e) => setTitleValue(e.target.value)}
//             onBlur={handleTitleBlur}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") e.currentTarget.blur();
//               if (e.key === "Escape") {
//                 setTitleValue(title);
//                 setEditingTitle(false);
//               }
//             }}
//             className="text-sm font-medium"
//             style={{
//               border: "none",
//               borderBottom: "1px solid var(--rv-accent)",
//               background: "transparent",
//               color: "var(--rv-ink)",
//               outline: "none",
//               fontFamily: "inherit",
//               padding: "0 0 1px",
//               maxWidth: 260,
//             }}
//           />
//         ) : (
//           <button
//             onClick={() => setEditingTitle(true)}
//             className="text-sm font-medium truncate"
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "text",
//               color: "var(--rv-ink)",
//               fontFamily: "inherit",
//               padding: 0,
//               maxWidth: 260,
//             }}
//             title="Click to rename"
//           >
//             {titleValue}
//           </button>
//         )}

//         {isPending && (
//           <span
//             className="text-xs flex-shrink-0"
//             style={{ color: "var(--rv-muted)" }}
//           >
//             Saving…
//           </span>
//         )}
//       </div>

//       {/* ── Right: dropdowns + export ── */}
//       <div className="flex items-center gap-2 flex-shrink-0">
//         {/* Color scheme dropdown */}
//         <Dropdown
//           align="right"
//           trigger={
//             <button
//               className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
//               style={{
//                 background: "none",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 padding: "0.4rem 0.75rem",
//                 cursor: "pointer",
//                 color: "var(--rv-ink)",
//                 fontFamily: "inherit",
//               }}
//             >
//               {/* Color swatch */}
//               <span
//                 style={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   background: activeScheme.swatch,
//                   display: "inline-block",
//                   flexShrink: 0,
//                 }}
//               />
//               <span className="hidden sm:inline">{activeScheme.label}</span>
//               <ChevronDown />
//             </button>
//           }
//         >
//           <div
//             className="px-3 py-1.5"
//             style={{
//               fontSize: "0.65rem",
//               fontWeight: 600,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "var(--rv-muted)",
//               borderBottom: "1px solid var(--rv-border)",
//               marginBottom: 4,
//             }}
//           >
//             Color scheme
//           </div>
//           {COLOR_SCHEMES.map((scheme) => (
//             <button
//               key={scheme.id}
//               onClick={() => handleSchemeChange(scheme.id)}
//               className="w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-100"
//               style={{
//                 background:
//                   currentScheme === scheme.id ? "var(--rv-cream)" : "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "var(--rv-ink)",
//                 fontFamily: "inherit",
//                 textAlign: "left",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "var(--rv-cream)")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background =
//                   currentScheme === scheme.id ? "var(--rv-cream)" : "none")
//               }
//             >
//               <span
//                 style={{
//                   width: 14,
//                   height: 14,
//                   borderRadius: "50%",
//                   background: scheme.swatch,
//                   flexShrink: 0,
//                   border:
//                     currentScheme === scheme.id
//                       ? `2px solid ${scheme.swatch}`
//                       : "2px solid transparent",
//                   outline:
//                     currentScheme === scheme.id
//                       ? `1px solid ${scheme.swatch}`
//                       : "none",
//                   outlineOffset: 1,
//                 }}
//               />
//               <span className="font-medium">{scheme.label}</span>
//               {currentScheme === scheme.id && (
//                 <span
//                   style={{
//                     marginLeft: "auto",
//                     color: "var(--rv-accent)",
//                     fontSize: 10,
//                   }}
//                 >
//                   ✓
//                 </span>
//               )}
//             </button>
//           ))}
//         </Dropdown>

//         {/* Template dropdown */}
//         <Dropdown
//           align="right"
//           trigger={
//             <button
//               className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
//               style={{
//                 background: "none",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 padding: "0.4rem 0.75rem",
//                 cursor: "pointer",
//                 color: "var(--rv-ink)",
//                 fontFamily: "inherit",
//               }}
//             >
//               <TemplateIcon />
//               <span className="hidden sm:inline">{activeTemplate.label}</span>
//               <ChevronDown />
//             </button>
//           }
//         >
//           <div
//             className="px-3 py-1.5"
//             style={{
//               fontSize: "0.65rem",
//               fontWeight: 600,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "var(--rv-muted)",
//               borderBottom: "1px solid var(--rv-border)",
//               marginBottom: 4,
//             }}
//           >
//             Template
//           </div>
//           {TEMPLATES.map((tmpl) => (
//             <button
//               key={tmpl.id}
//               onClick={() => handleTemplateChange(tmpl.id)}
//               className="w-full flex flex-col px-3 py-2 text-xs transition-colors duration-100"
//               style={{
//                 background:
//                   currentTemplate === tmpl.id ? "var(--rv-cream)" : "none",
//                 border: "none",
//                 cursor: "pointer",
//                 fontFamily: "inherit",
//                 textAlign: "left",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "var(--rv-cream)")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background =
//                   currentTemplate === tmpl.id ? "var(--rv-cream)" : "none")
//               }
//             >
//               <div className="flex items-center justify-between w-full">
//                 <span
//                   className="font-medium"
//                   style={{
//                     color:
//                       currentTemplate === tmpl.id
//                         ? "var(--rv-accent)"
//                         : "var(--rv-ink)",
//                   }}
//                 >
//                   {tmpl.label}
//                 </span>
//                 {currentTemplate === tmpl.id && (
//                   <span style={{ color: "var(--rv-accent)", fontSize: 10 }}>
//                     ✓
//                   </span>
//                 )}
//               </div>
//               <span
//                 style={{
//                   color: "var(--rv-muted)",
//                   marginTop: 1,
//                   fontSize: "0.7rem",
//                 }}
//               >
//                 {tmpl.description}
//               </span>
//             </button>
//           ))}
//         </Dropdown>

//         {/* ATS button */}
//         <button
//           onClick={onATSOpen}
//           className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
//           style={{
//             background: "rgba(200,75,47,0.07)",
//             border: "1px solid rgba(200,75,47,0.25)",
//             borderRadius: 2,
//             padding: "0.4rem 0.75rem",
//             cursor: "pointer",
//             color: "var(--rv-accent)",
//             fontFamily: "inherit",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "var(--rv-accent)";
//             e.currentTarget.style.color = "#fff";
//             e.currentTarget.style.borderColor = "var(--rv-accent)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "rgba(200,75,47,0.07)";
//             e.currentTarget.style.color = "var(--rv-accent)";
//             e.currentTarget.style.borderColor = "rgba(200,75,47,0.25)";
//           }}
//         >
//           <ATSButtonIcon />
//           <span className="hidden sm:inline">ATS Score</span>
//         </button>

//         {/* Divider */}
//         <span
//           style={{
//             width: 1,
//             height: 20,
//             background: "var(--rv-border)",
//             display: "inline-block",
//           }}
//         />

//         {/* Export */}
//         <ExportPDFButton resumeId={resumeId} variant="topbar" />
//       </div>
//     </header>
//   );
// }

// function ATSButtonIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 12,
//         height: 12,
//         fill: "none",
//         stroke: "currentColor",
//         strokeWidth: 1.5,
//         flexShrink: 0,
//       }}
//     >
//       <circle cx="8" cy="8" r="7" />
//       <path d="M5 8l2 2 4-4" />
//     </svg>
//   );
// }

// function TemplateIcon() {
//   return (
//     <svg
//       viewBox="0 0 14 14"
//       style={{
//         width: 12,
//         height: 12,
//         stroke: "currentColor",
//         fill: "none",
//         strokeWidth: 1.5,
//       }}
//     >
//       <rect x="1" y="1" width="12" height="12" rx="1" />
//       <path d="M1 4h12M5 4v9" />
//     </svg>
//   );
// }

"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { updateResumeMeta } from "@/actions/builder.actions";
import ExportPDFButton from "@/components/shared/ExportPDFButton";

// ── Templates & color schemes ─────────────────────────────
// Imported for local use + re-exported so other files can import from here
import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
export { TEMPLATES, COLOR_SCHEMES };

// ── Props ─────────────────────────────────────────────────

interface BuilderTopbarProps {
  resumeId: string;
  title: string;
  template: string;
  colorScheme?: string;
  onATSOpen: () => void;
  onJDMatchOpen: () => void;
  onCoverLetterOpen: () => void;
  onGrammarOpen: () => void;
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className="absolute mt-1 z-50 py-1"
          style={{
            top: "100%",
            [align === "right" ? "right" : "left"]: 0,
            background: "var(--rv-white)",
            border: "1px solid var(--rv-border)",
            borderRadius: 2,
            boxShadow: "0 12px 32px rgba(15,14,13,0.12)",
            minWidth: 220,
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Chevron icon ──────────────────────────────────────────

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 12 12"
      style={{
        width: 10,
        height: 10,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: 1.5,
      }}
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────

export default function BuilderTopbar({
  resumeId,
  title,
  template,
  colorScheme = "terracotta",
  onATSOpen,
  onJDMatchOpen,
  onCoverLetterOpen,
  onGrammarOpen,
}: BuilderTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [currentScheme, setCurrentScheme] = useState(colorScheme);
  const [isPending, startTransition] = useTransition();

  const activeTemplate =
    TEMPLATES.find((t) => t.id === currentTemplate) ?? TEMPLATES[0];
  const activeScheme =
    COLOR_SCHEMES.find((s) => s.id === currentScheme) ?? COLOR_SCHEMES[0];

  function handleTitleBlur() {
    setEditingTitle(false);
    if (titleValue.trim() === title) return;
    startTransition(() =>
      updateResumeMeta(resumeId, {
        title: titleValue.trim() || "Untitled Resume",
      }),
    );
  }

  function handleTemplateChange(id: string) {
    setCurrentTemplate(id);
    startTransition(() => updateResumeMeta(resumeId, { template: id }));
  }

  function handleSchemeChange(id: string) {
    setCurrentScheme(id);
    startTransition(() => updateResumeMeta(resumeId, { colorScheme: id }));
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 gap-4"
      style={{
        height: 56,
        background: "var(--rv-paper)",
        borderBottom: "1px solid var(--rv-border)",
      }}
    >
      {/* ── Left: back + title ── */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm no-underline flex-shrink-0 transition-opacity duration-150 hover:opacity-60"
          style={{ color: "var(--rv-muted)" }}
        >
          <span>←</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <span style={{ color: "var(--rv-border)", userSelect: "none" }}>|</span>

        {editingTitle ? (
          <input
            autoFocus
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setTitleValue(title);
                setEditingTitle(false);
              }
            }}
            className="text-sm font-medium"
            style={{
              border: "none",
              borderBottom: "1px solid var(--rv-accent)",
              background: "transparent",
              color: "var(--rv-ink)",
              outline: "none",
              fontFamily: "inherit",
              padding: "0 0 1px",
              maxWidth: 260,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-medium truncate"
            style={{
              background: "none",
              border: "none",
              cursor: "text",
              color: "var(--rv-ink)",
              fontFamily: "inherit",
              padding: 0,
              maxWidth: 260,
            }}
            title="Click to rename"
          >
            {titleValue}
          </button>
        )}

        {isPending && (
          <span
            className="text-xs flex-shrink-0"
            style={{ color: "var(--rv-muted)" }}
          >
            Saving…
          </span>
        )}
      </div>

      {/* ── Right: dropdowns + export ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Color scheme dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
              style={{
                background: "none",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
              }}
            >
              {/* Color swatch */}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: activeScheme.swatch,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="hidden sm:inline">{activeScheme.label}</span>
              <ChevronDown />
            </button>
          }
        >
          <div
            className="px-3 py-1.5"
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              borderBottom: "1px solid var(--rv-border)",
              marginBottom: 4,
            }}
          >
            Color scheme
          </div>
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleSchemeChange(scheme.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-100"
              style={{
                background:
                  currentScheme === scheme.id ? "var(--rv-cream)" : "none",
                border: "none",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rv-cream)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  currentScheme === scheme.id ? "var(--rv-cream)" : "none")
              }
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: scheme.swatch,
                  flexShrink: 0,
                  border:
                    currentScheme === scheme.id
                      ? `2px solid ${scheme.swatch}`
                      : "2px solid transparent",
                  outline:
                    currentScheme === scheme.id
                      ? `1px solid ${scheme.swatch}`
                      : "none",
                  outlineOffset: 1,
                }}
              />
              <span className="font-medium">{scheme.label}</span>
              {currentScheme === scheme.id && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--rv-accent)",
                    fontSize: 10,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </Dropdown>

        {/* Template dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
              style={{
                background: "none",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
              }}
            >
              <TemplateIcon />
              <span className="hidden sm:inline">{activeTemplate.label}</span>
              <ChevronDown />
            </button>
          }
        >
          <div
            className="px-3 py-1.5"
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              borderBottom: "1px solid var(--rv-border)",
              marginBottom: 4,
            }}
          >
            Template
          </div>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateChange(tmpl.id)}
              className="w-full flex flex-col px-3 py-2 text-xs transition-colors duration-100"
              style={{
                background:
                  currentTemplate === tmpl.id ? "var(--rv-cream)" : "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rv-cream)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  currentTemplate === tmpl.id ? "var(--rv-cream)" : "none")
              }
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="font-medium"
                  style={{
                    color:
                      currentTemplate === tmpl.id
                        ? "var(--rv-accent)"
                        : "var(--rv-ink)",
                  }}
                >
                  {tmpl.label}
                </span>
                {currentTemplate === tmpl.id && (
                  <span style={{ color: "var(--rv-accent)", fontSize: 10 }}>
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  color: "var(--rv-muted)",
                  marginTop: 1,
                  fontSize: "0.7rem",
                }}
              >
                {tmpl.description}
              </span>
            </button>
          ))}
        </Dropdown>

        {/* ATS button */}
        <button
          onClick={onATSOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
          style={{
            background: "rgba(200,75,47,0.07)",
            border: "1px solid rgba(200,75,47,0.25)",
            borderRadius: 2,
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            color: "var(--rv-accent)",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--rv-accent)";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "var(--rv-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(200,75,47,0.07)";
            e.currentTarget.style.color = "var(--rv-accent)";
            e.currentTarget.style.borderColor = "rgba(200,75,47,0.25)";
          }}
        >
          <ATSButtonIcon />
          <span className="hidden sm:inline">ATS Score</span>
        </button>

        {/* JD Match button */}
        <button
          onClick={onJDMatchOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
          style={{
            background: "rgba(183,121,31,0.07)",
            border: "1px solid rgba(183,121,31,0.25)",
            borderRadius: 2,
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            color: "#b7791f",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#b7791f";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#b7791f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(183,121,31,0.07)";
            e.currentTarget.style.color = "#b7791f";
            e.currentTarget.style.borderColor = "rgba(183,121,31,0.25)";
          }}
        >
          <JDIcon />
          <span className="hidden sm:inline">JD Match</span>
        </button>

        {/* Cover Letter button */}
        <button
          onClick={onCoverLetterOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
          style={{
            background: "rgba(45,122,79,0.07)",
            border: "1px solid rgba(45,122,79,0.25)",
            borderRadius: 2,
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            color: "#2d7a4f",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2d7a4f";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#2d7a4f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(45,122,79,0.07)";
            e.currentTarget.style.color = "#2d7a4f";
            e.currentTarget.style.borderColor = "rgba(45,122,79,0.25)";
          }}
        >
          <LetterIconSmall />
          <span className="hidden sm:inline">Cover Letter</span>
        </button>

        {/* Grammar button */}
        <button
          onClick={onGrammarOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
          style={{
            background: "rgba(107,114,128,0.07)",
            border: "1px solid rgba(107,114,128,0.25)",
            borderRadius: 2,
            padding: "0.4rem 0.75rem",
            cursor: "pointer",
            color: "#4b5563",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#4b5563";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#4b5563";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(107,114,128,0.07)";
            e.currentTarget.style.color = "#4b5563";
            e.currentTarget.style.borderColor = "rgba(107,114,128,0.25)";
          }}
        >
          <GrammarIconSmall />
          <span className="hidden sm:inline">Grammar</span>
        </button>

        {/* Divider */}
        <span
          style={{
            width: 1,
            height: 20,
            background: "var(--rv-border)",
            display: "inline-block",
          }}
        />

        {/* Export */}
        <ExportPDFButton resumeId={resumeId} variant="topbar" />
      </div>
    </header>
  );
}

function JDIcon() {
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
      <circle cx="8" cy="8" r="7" />
      <circle cx="8" cy="8" r="3.5" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
function LetterIconSmall() {
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
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}
function GrammarIconSmall() {
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
      <path
        d="M2 12L6 4l4 8M3.5 9h5M10 4h4M12 4v8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ATSButtonIcon() {
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
      <circle cx="8" cy="8" r="7" />
      <path d="M5 8l2 2 4-4" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      style={{
        width: 12,
        height: 12,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: 1.5,
      }}
    >
      <rect x="1" y="1" width="12" height="12" rx="1" />
      <path d="M1 4h12M5 4v9" />
    </svg>
  );
}
