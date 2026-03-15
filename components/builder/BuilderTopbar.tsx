// "use client";

// import { useState, useTransition, useRef, useEffect } from "react";
// import Link from "next/link";
// import { updateResumeMeta } from "@/actions/builder.actions";
// import ShareButton from "./ShareButton";
// import ExportPDFButton from "../shared/ExportPDFButton";
// import ExportDOCXButton from "../shared/ExportDOCXButton";

// // ── Templates & color schemes ─────────────────────────────
// // Imported for local use + re-exported so other files can import from here
// import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
// export { TEMPLATES, COLOR_SCHEMES };

// // ── Props ─────────────────────────────────────────────────

// import type { ResumeData, ResumeSection } from "@/types/resume";

// interface BuilderTopbarProps {
//   resumeId: string;
//   resume: ResumeData;
//   sections: ResumeSection[];
//   title: string;
//   template: string;
//   colorScheme?: string;
//   onATSOpen: () => void;
//   onJDMatchOpen: () => void;
//   onCoverLetterOpen: () => void;
//   onGrammarOpen: () => void;
//   onAchievementOpen: () => void;
//   onCareerGapOpen: () => void;
//   onInterviewOpen: () => void;
//   isPublic?: boolean;
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
//   resume,
//   sections,
//   title,
//   template,
//   colorScheme = "terracotta",
//   onATSOpen,
//   onJDMatchOpen,
//   onCoverLetterOpen,
//   onGrammarOpen,
//   onAchievementOpen,
//   onCareerGapOpen,
//   onInterviewOpen,
//   isPublic = false,
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
//           className="flex items-center gap-1.5 text-sm no-underline shrink-0 transition-opacity duration-150 hover:opacity-60"
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
//             className="text-xs shrink-0"
//             style={{ color: "var(--rv-muted)" }}
//           >
//             Saving…
//           </span>
//         )}
//       </div>

//       {/* ── Right: dropdowns + export ── */}
//       <div className="flex items-center gap-2 shrink-0">
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

//         {/* ── Smart Tools dropdown ── */}
//         <Dropdown
//           align="right"
//           trigger={
//             <button
//               className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
//               style={{
//                 background: "rgba(200,75,47,0.07)",
//                 border: "1px solid rgba(200,75,47,0.25)",
//                 borderRadius: 2,
//                 padding: "0.4rem 0.85rem",
//                 cursor: "pointer",
//                 color: "var(--rv-accent)",
//                 fontFamily: "inherit",
//               }}
//             >
//               <SparkleIcon />
//               <span>AI Tools</span>
//               <svg
//                 viewBox="0 0 16 16"
//                 style={{
//                   width: 10,
//                   height: 10,
//                   fill: "none",
//                   stroke: "currentColor",
//                   strokeWidth: 1.8,
//                   marginLeft: 1,
//                 }}
//               >
//                 <path
//                   d="M4 6l4 4 4-4"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </button>
//           }
//         >
//           {[
//             {
//               label: "ATS Score",
//               desc: "Score your resume",
//               icon: <ATSButtonIcon />,
//               color: "var(--rv-accent)",
//               onClick: onATSOpen,
//             },
//             {
//               label: "JD Match",
//               desc: "Optimize for job description",
//               icon: <JDIcon />,
//               color: "#b7791f",
//               onClick: onJDMatchOpen,
//             },
//             {
//               label: "Cover Letter",
//               desc: "Generate a cover letter",
//               icon: <LetterIconSmall />,
//               color: "#2d7a4f",
//               onClick: onCoverLetterOpen,
//             },
//             {
//               label: "Grammar Check",
//               desc: "Fix language issues",
//               icon: <GrammarIconSmall />,
//               color: "#4b5563",
//               onClick: onGrammarOpen,
//             },
//             {
//               label: "Achievements",
//               desc: "Turn duties into wins",
//               icon: <AchievIconSmall />,
//               color: "#6b3fa0",
//               onClick: onAchievementOpen,
//             },
//             {
//               label: "Career Gap",
//               desc: "Explain employment gaps",
//               icon: <GapIconSmall />,
//               color: "#1e3a5f",
//               onClick: onCareerGapOpen,
//             },
//             {
//               label: "Interview Prep",
//               desc: "Practice questions",
//               icon: <InterviewIconSmall />,
//               color: "#2d5a3d",
//               onClick: onInterviewOpen,
//             },
//           ].map((tool) => (
//             <button
//               key={tool.label}
//               onClick={tool.onClick}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 width: "100%",
//                 padding: "0.55rem 0.85rem",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 fontFamily: "inherit",
//                 textAlign: "left",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "var(--rv-cream)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "none";
//               }}
//             >
//               <span
//                 style={{ color: tool.color, flexShrink: 0, display: "flex" }}
//               >
//                 {tool.icon}
//               </span>
//               <span>
//                 <span
//                   style={{
//                     display: "block",
//                     fontSize: "0.75rem",
//                     fontWeight: 600,
//                     color: "var(--rv-ink)",
//                   }}
//                 >
//                   {tool.label}
//                 </span>
//                 <span
//                   style={{
//                     display: "block",
//                     fontSize: "0.65rem",
//                     color: "var(--rv-muted)",
//                     marginTop: 1,
//                   }}
//                 >
//                   {tool.desc}
//                 </span>
//               </span>
//             </button>
//           ))}
//         </Dropdown>

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
//         <ShareButton resumeId={resumeId} isPublic={isPublic} />
//         <ExportDOCXButton resume={resume} sections={sections} />
//         <ExportPDFButton resumeId={resumeId} variant="topbar" />
//       </div>
//     </header>
//   );
// }

// function SparkleIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 13,
//         height: 13,
//         fill: "none",
//         stroke: "currentColor",
//         strokeWidth: 1.6,
//       }}
//     >
//       <path
//         d="M8 2v2M8 12v2M2 8h2M12 8h2M4.22 4.22l1.42 1.42M10.36 10.36l1.42 1.42M4.22 11.78l1.42-1.42M10.36 5.64l1.42-1.42"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
// function AchievIconSmall() {
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
//       <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
//     </svg>
//   );
// }
// function GapIconSmall() {
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
//       <rect x="1" y="2" width="6" height="12" rx="1" />
//       <rect x="9" y="2" width="6" height="12" rx="1" />
//     </svg>
//   );
// }
// function InterviewIconSmall() {
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
//       <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
//       <path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
//     </svg>
//   );
// }

// function JDIcon() {
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
//       <circle cx="8" cy="8" r="3.5" />
//       <circle cx="8" cy="8" r="1" fill="currentColor" />
//     </svg>
//   );
// }
// function LetterIconSmall() {
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
//       <rect x="1" y="3" width="14" height="10" rx="1.5" />
//       <path d="M1 4l7 5 7-5" />
//     </svg>
//   );
// }
// function GrammarIconSmall() {
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
//       <path
//         d="M2 12L6 4l4 8M3.5 9h5M10 4h4M12 4v8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
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
import ShareButton from "./ShareButton";
import ExportPDFButton from "@/components/shared/ExportPDFButton";
import ExportDOCXButton from "@/components/shared/ExportDOCXButton";

// ── Templates & color schemes ─────────────────────────────
// Imported for local use + re-exported so other files can import from here
import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
export { TEMPLATES, COLOR_SCHEMES };

// ── Props ─────────────────────────────────────────────────

import type { ResumeData, ResumeSection } from "@/types/resume";

interface BuilderTopbarProps {
  resumeId: string;
  resume: ResumeData;
  sections: ResumeSection[];
  title: string;
  template: string;
  colorScheme?: string;
  onATSOpen: () => void;
  onJDMatchOpen: () => void;
  onCoverLetterOpen: () => void;
  onGrammarOpen: () => void;
  onAchievementOpen: () => void;
  onCareerGapOpen: () => void;
  onInterviewOpen: () => void;
  isPublic?: boolean;
  isPro?: boolean;
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
  resume,
  sections,
  title,
  template,
  colorScheme = "terracotta",
  onATSOpen,
  onJDMatchOpen,
  onCoverLetterOpen,
  onGrammarOpen,
  onAchievementOpen,
  onCareerGapOpen,
  onInterviewOpen,
  isPublic = false,
  isPro = false,
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

        {/* ── Smart Tools dropdown ── */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
              style={{
                background: "rgba(200,75,47,0.07)",
                border: "1px solid rgba(200,75,47,0.25)",
                borderRadius: 2,
                padding: "0.4rem 0.85rem",
                cursor: "pointer",
                color: "var(--rv-accent)",
                fontFamily: "inherit",
              }}
            >
              <SparkleIcon />
              <span>AI Tools</span>
              <svg
                viewBox="0 0 16 16"
                style={{
                  width: 10,
                  height: 10,
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.8,
                  marginLeft: 1,
                }}
              >
                <path
                  d="M4 6l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          }
        >
          {[
            {
              label: "ATS Score",
              desc: "Score your resume",
              icon: <ATSButtonIcon />,
              color: "var(--rv-accent)",
              onClick: onATSOpen,
            },
            {
              label: "JD Match",
              desc: "Optimize for job description",
              icon: <JDIcon />,
              color: "#b7791f",
              onClick: onJDMatchOpen,
            },
            {
              label: "Cover Letter",
              desc: "Generate a cover letter",
              icon: <LetterIconSmall />,
              color: "#2d7a4f",
              onClick: onCoverLetterOpen,
            },
            {
              label: "Grammar Check",
              desc: "Fix language issues",
              icon: <GrammarIconSmall />,
              color: "#4b5563",
              onClick: onGrammarOpen,
            },
            {
              label: "Achievements",
              desc: "Turn duties into wins",
              icon: <AchievIconSmall />,
              color: "#6b3fa0",
              onClick: onAchievementOpen,
            },
            {
              label: "Career Gap",
              desc: "Explain employment gaps",
              icon: <GapIconSmall />,
              color: "#1e3a5f",
              onClick: onCareerGapOpen,
            },
            {
              label: "Interview Prep",
              desc: "Practice questions",
              icon: <InterviewIconSmall />,
              color: "#2d5a3d",
              onClick: onInterviewOpen,
            },
          ].map((tool) => (
            <button
              key={tool.label}
              onClick={tool.onClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "0.55rem 0.85rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--rv-cream)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <span
                style={{ color: tool.color, flexShrink: 0, display: "flex" }}
              >
                {tool.icon}
              </span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--rv-ink)",
                  }}
                >
                  {tool.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.65rem",
                    color: "var(--rv-muted)",
                    marginTop: 1,
                  }}
                >
                  {tool.desc}
                </span>
              </span>
            </button>
          ))}
        </Dropdown>

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
        <ShareButton resumeId={resumeId} isPublic={isPublic} />
        <ExportDOCXButton resume={resume} sections={sections} isPro={isPro} />
        <ExportPDFButton resumeId={resumeId} variant="topbar" />
      </div>
    </header>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 13,
        height: 13,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.6,
      }}
    >
      <path
        d="M8 2v2M8 12v2M2 8h2M12 8h2M4.22 4.22l1.42 1.42M10.36 10.36l1.42 1.42M4.22 11.78l1.42-1.42M10.36 5.64l1.42-1.42"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AchievIconSmall() {
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
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
    </svg>
  );
}
function GapIconSmall() {
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
      <rect x="1" y="2" width="6" height="12" rx="1" />
      <rect x="9" y="2" width="6" height="12" rx="1" />
    </svg>
  );
}
function InterviewIconSmall() {
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
      <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
      <path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
    </svg>
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
