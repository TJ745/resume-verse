// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { saveSection } from "@/actions/builder.actions";
// import type {
//   ResumeData,
//   ResumeSection,
//   SummaryContent,
//   ExperienceItem,
//   ProjectItem,
//   VolunteerItem,
//   AwardItem,
// } from "@/types/resume";

// // ── Types ─────────────────────────────────────────────────

// interface GrammarIssue {
//   fieldIndex: number;
//   sectionId: string;
//   sectionType: string;
//   label: string;
//   original: string;
//   fixed: string;
//   issueType:
//     | "grammar"
//     | "passive_voice"
//     | "weak_verb"
//     | "clarity"
//     | "wordiness"
//     | "typo"
//     | "cliche";
//   severity: "high" | "medium" | "low";
//   explanation: string;
// }

// interface TextField {
//   sectionId: string;
//   sectionType: string;
//   itemId?: string;
//   label: string;
//   text: string;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   resume: ResumeData;
//   sections: ResumeSection[];
//   onSectionsChange: (s: ResumeSection[]) => void;
// }

// // ── Extract all text fields from resume ───────────────────

// function extractFields(
//   resume: ResumeData,
//   sections: ResumeSection[],
// ): TextField[] {
//   const fields: TextField[] = [];
//   const sorted = [...sections].sort((a, b) => a.order - b.order);

//   for (const s of sorted) {
//     if (s.type === "summary") {
//       const text = (s.content as SummaryContent)?.text ?? "";
//       if (text.trim())
//         fields.push({
//           sectionId: s.id,
//           sectionType: s.type,
//           label: "Summary",
//           text,
//         });
//     } else if (s.type === "experience") {
//       const items = s.content as ExperienceItem[];
//       if (!Array.isArray(items)) continue;
//       for (const exp of items) {
//         const heading = exp.role
//           ? `${exp.role}${exp.company ? ` @ ${exp.company}` : ""}`
//           : "Experience item";
//         for (const b of exp.bullets ?? []) {
//           if (b.trim())
//             fields.push({
//               sectionId: s.id,
//               sectionType: s.type,
//               itemId: exp.id,
//               label: `${heading} — bullet`,
//               text: b,
//             });
//         }
//       }
//     } else if (s.type === "projects") {
//       const items = s.content as ProjectItem[];
//       if (!Array.isArray(items)) continue;
//       for (const proj of items) {
//         if (proj.description?.trim()) {
//           fields.push({
//             sectionId: s.id,
//             sectionType: s.type,
//             itemId: proj.id,
//             label: `Project: ${proj.name || "Untitled"}`,
//             text: proj.description,
//           });
//         }
//       }
//     } else if (s.type === "volunteer") {
//       const items = s.content as VolunteerItem[];
//       if (!Array.isArray(items)) continue;
//       for (const vol of items) {
//         if (vol.description?.trim()) {
//           fields.push({
//             sectionId: s.id,
//             sectionType: s.type,
//             itemId: vol.id,
//             label: `Volunteer: ${vol.role || "Role"}`,
//             text: vol.description,
//           });
//         }
//       }
//     } else if (s.type === "awards") {
//       const items = s.content as AwardItem[];
//       if (!Array.isArray(items)) continue;
//       for (const award of items) {
//         if (award.description?.trim()) {
//           fields.push({
//             sectionId: s.id,
//             sectionType: s.type,
//             itemId: award.id,
//             label: `Award: ${award.title || "Award"}`,
//             text: award.description,
//           });
//         }
//       }
//     }
//   }
//   return fields;
// }

// // ── Severity helpers ──────────────────────────────────────

// const SEVERITY_COLOR: Record<string, string> = {
//   high: "#c84b2f",
//   medium: "#b7791f",
//   low: "#6b7280",
// };
// const SEVERITY_BG: Record<string, string> = {
//   high: "rgba(200,75,47,0.07)",
//   medium: "rgba(183,121,31,0.07)",
//   low: "rgba(107,114,128,0.05)",
// };

// const ISSUE_LABEL: Record<string, string> = {
//   grammar: "Grammar",
//   passive_voice: "Passive Voice",
//   weak_verb: "Weak Verb",
//   clarity: "Clarity",
//   wordiness: "Wordiness",
//   typo: "Typo",
//   cliche: "Cliché",
// };

// // ── Component ─────────────────────────────────────────────

// export default function GrammarPanel({
//   open,
//   onClose,
//   resume,
//   sections,
//   onSectionsChange,
// }: Props) {
//   const [issues, setIssues] = useState<GrammarIssue[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [applied, setApplied] = useState<Set<string>>(new Set());
//   const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
//     "all",
//   );

//   useEffect(() => {
//     if (open) {
//       setIssues([]);
//       setError("");
//       setApplied(new Set());
//       setFilter("all");
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   const handleCheck = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     setIssues([]);
//     try {
//       const fields = extractFields(resume, sections);
//       if (!fields.length) {
//         setError("No text content found to check.");
//         setLoading(false);
//         return;
//       }
//       const res = await fetch("/api/ai/grammar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fields }),
//       });
//       if (!res.ok) throw new Error();
//       const data: GrammarIssue[] = await res.json();
//       // Re-attach sectionId/sectionType from the original fields array
//       const enriched = data.map((issue) => ({
//         ...issue,
//         sectionId: fields[issue.fieldIndex]?.sectionId ?? issue.sectionId,
//         sectionType: fields[issue.fieldIndex]?.sectionType ?? issue.sectionType,
//       }));
//       setIssues(enriched);
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [resume, sections]);

//   const handleApply = useCallback(
//     (issue: GrammarIssue, key: string) => {
//       const section = sections.find((s) => s.id === issue.sectionId);
//       if (!section) return;

//       let newContent = section.content;

//       if (section.type === "summary") {
//         const current = (section.content as SummaryContent).text ?? "";
//         newContent = {
//           text: current.replace(issue.original, issue.fixed),
//         } as SummaryContent;
//       } else if (section.type === "experience") {
//         newContent = (section.content as ExperienceItem[]).map((exp) => ({
//           ...exp,
//           bullets: exp.bullets.map((b) =>
//             b.trim() === issue.original.trim() ? issue.fixed : b,
//           ),
//         }));
//       } else if (["projects", "volunteer", "awards"].includes(section.type)) {
//         newContent = (section.content as Array<Record<string, unknown>>).map(
//           (item) => {
//             if (
//               typeof item.description === "string" &&
//               item.description.includes(issue.original)
//             ) {
//               return {
//                 ...item,
//                 description: item.description.replace(
//                   issue.original,
//                   issue.fixed,
//                 ),
//               };
//             }
//             return item;
//           },
//         );
//       }

//       const updatedSections = sections.map((s) =>
//         s.id === section.id ? { ...s, content: newContent } : s,
//       );
//       onSectionsChange(updatedSections);
//       saveSection(resume.id, section.id, newContent).catch(console.error);
//       setApplied((prev) => new Set([...prev, key]));
//     },
//     [sections, resume.id, onSectionsChange],
//   );

//   if (!open) return null;

//   const visible = issues.filter(
//     (iss) => filter === "all" || iss.severity === filter,
//   );
//   const highCount = issues.filter((i) => i.severity === "high").length;
//   const medCount = issues.filter((i) => i.severity === "medium").length;
//   const lowCount = issues.filter((i) => i.severity === "low").length;
//   const appliedCount = applied.size;

//   return (
//     <>
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 90,
//           background: "rgba(15,14,13,0.35)",
//         }}
//       />

//       <div
//         style={{
//           position: "fixed",
//           top: 56,
//           right: 0,
//           bottom: 0,
//           width: 440,
//           zIndex: 91,
//           background: "var(--rv-paper)",
//           borderLeft: "1px solid var(--rv-border)",
//           display: "flex",
//           flexDirection: "column",
//           boxShadow: "-8px 0 32px rgba(15,14,13,0.1)",
//           fontFamily: "'DM Sans', sans-serif",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "1rem 1.25rem 0.75rem",
//             borderBottom: "1px solid var(--rv-border)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <GrammarIcon />
//             <div>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   fontWeight: 700,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Grammar & Clarity
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
//                 Fix language issues across your resume
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "var(--rv-muted)",
//               fontSize: "1.1rem",
//               lineHeight: 1,
//               fontFamily: "inherit",
//               padding: 4,
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
//           {/* Check button */}
//           <button
//             onClick={handleCheck}
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: "0.6rem",
//               background: loading ? "var(--rv-muted)" : "var(--rv-accent)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 2,
//               fontSize: "0.8rem",
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               fontFamily: "inherit",
//               marginBottom: "1rem",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 8,
//             }}
//           >
//             {loading ? (
//               <>
//                 <Spinner />
//                 Checking…
//               </>
//             ) : (
//               <>
//                 <GrammarIcon white />
//                 {issues.length ? "Re-check" : "Check Grammar & Clarity"}
//               </>
//             )}
//           </button>

//           {error && (
//             <div
//               style={{
//                 fontSize: "0.75rem",
//                 color: "var(--rv-accent)",
//                 background: "rgba(200,75,47,0.07)",
//                 border: "1px solid rgba(200,75,47,0.2)",
//                 borderRadius: 2,
//                 padding: "0.6rem 0.75rem",
//                 marginBottom: "1rem",
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* Results */}
//           {issues.length > 0 && (
//             <div>
//               {/* Stats row */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr 1fr 1fr",
//                   gap: 6,
//                   marginBottom: "0.85rem",
//                 }}
//               >
//                 {[
//                   {
//                     label: "All",
//                     count: issues.length,
//                     color: "var(--rv-ink)",
//                     bg: "var(--rv-cream)",
//                     id: "all" as const,
//                   },
//                   {
//                     label: "High",
//                     count: highCount,
//                     color: "#c84b2f",
//                     bg: "rgba(200,75,47,0.07)",
//                     id: "high" as const,
//                   },
//                   {
//                     label: "Medium",
//                     count: medCount,
//                     color: "#b7791f",
//                     bg: "rgba(183,121,31,0.07)",
//                     id: "medium" as const,
//                   },
//                   {
//                     label: "Low",
//                     count: lowCount,
//                     color: "#6b7280",
//                     bg: "rgba(107,114,128,0.06)",
//                     id: "low" as const,
//                   },
//                 ].map((f) => (
//                   <button
//                     key={f.id}
//                     onClick={() => setFilter(f.id)}
//                     style={{
//                       padding: "0.4rem 0.25rem",
//                       borderRadius: 2,
//                       cursor: "pointer",
//                       textAlign: "center",
//                       border:
//                         filter === f.id
//                           ? `1.5px solid ${f.color}`
//                           : "1px solid var(--rv-border)",
//                       background: filter === f.id ? f.bg : "var(--rv-white)",
//                       fontFamily: "inherit",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "1rem",
//                         fontWeight: 800,
//                         color: f.color,
//                         lineHeight: 1,
//                       }}
//                     >
//                       {f.count}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: "0.58rem",
//                         color: f.color,
//                         fontWeight: 600,
//                         marginTop: 1,
//                       }}
//                     >
//                       {f.label}
//                     </div>
//                   </button>
//                 ))}
//               </div>

//               {appliedCount > 0 && (
//                 <div
//                   style={{
//                     fontSize: "0.7rem",
//                     color: "#2d7a4f",
//                     background: "#dcfce7",
//                     border: "1px solid #bbf7d0",
//                     borderRadius: 2,
//                     padding: "0.45rem 0.75rem",
//                     marginBottom: "0.75rem",
//                   }}
//                 >
//                   ✓ {appliedCount} fix{appliedCount > 1 ? "es" : ""} applied to
//                   your resume
//                 </div>
//               )}

//               {/* Issue cards */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {visible.map((issue, i) => {
//                   const key = `${issue.sectionId}-${issue.fieldIndex}-${i}`;
//                   const isApplied = applied.has(key);
//                   return (
//                     <div
//                       key={key}
//                       style={{
//                         border: `1px solid ${isApplied ? "#bbf7d0" : "var(--rv-border)"}`,
//                         borderRadius: 3,
//                         background: isApplied
//                           ? "rgba(45,122,79,0.04)"
//                           : "var(--rv-white)",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {/* Card header */}
//                       <div
//                         style={{
//                           padding: "0.45rem 0.75rem",
//                           borderBottom: "1px solid var(--rv-border)",
//                           background: "var(--rv-cream)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           gap: 8,
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                             minWidth: 0,
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "0.58rem",
//                               fontWeight: 700,
//                               padding: "1px 6px",
//                               borderRadius: 99,
//                               background: SEVERITY_BG[issue.severity],
//                               color: SEVERITY_COLOR[issue.severity],
//                               textTransform: "uppercase",
//                               letterSpacing: "0.04em",
//                               flexShrink: 0,
//                             }}
//                           >
//                             {issue.severity}
//                           </span>
//                           <span
//                             style={{
//                               fontSize: "0.58rem",
//                               fontWeight: 600,
//                               padding: "1px 6px",
//                               borderRadius: 99,
//                               background: "var(--rv-white)",
//                               color: "var(--rv-muted)",
//                               border: "1px solid var(--rv-border)",
//                               flexShrink: 0,
//                             }}
//                           >
//                             {ISSUE_LABEL[issue.issueType] ?? issue.issueType}
//                           </span>
//                           <span
//                             style={{
//                               fontSize: "0.65rem",
//                               color: "var(--rv-muted)",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {issue.label}
//                           </span>
//                         </div>
//                         {isApplied ? (
//                           <span
//                             style={{
//                               fontSize: "0.65rem",
//                               fontWeight: 700,
//                               color: "#2d7a4f",
//                               flexShrink: 0,
//                             }}
//                           >
//                             ✓ Fixed
//                           </span>
//                         ) : (
//                           <button
//                             onClick={() => handleApply(issue, key)}
//                             style={{
//                               fontSize: "0.65rem",
//                               fontWeight: 700,
//                               padding: "3px 10px",
//                               flexShrink: 0,
//                               background: "var(--rv-accent)",
//                               color: "#fff",
//                               border: "none",
//                               borderRadius: 2,
//                               cursor: "pointer",
//                               fontFamily: "inherit",
//                             }}
//                           >
//                             Fix →
//                           </button>
//                         )}
//                       </div>

//                       {/* Before / After */}
//                       <div
//                         style={{
//                           padding: "0.6rem 0.75rem",
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 5,
//                         }}
//                       >
//                         <div>
//                           <div
//                             style={{
//                               fontSize: "0.58rem",
//                               fontWeight: 700,
//                               color: "#c84b2f",
//                               letterSpacing: "0.06em",
//                               marginBottom: 2,
//                             }}
//                           >
//                             ORIGINAL
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "0.7rem",
//                               color: "#6b6560",
//                               lineHeight: 1.55,
//                               background: "rgba(200,75,47,0.05)",
//                               padding: "0.35rem 0.6rem",
//                               borderRadius: 2,
//                               borderLeft: "2px solid #c84b2f",
//                             }}
//                           >
//                             {issue.original}
//                           </div>
//                         </div>
//                         <div>
//                           <div
//                             style={{
//                               fontSize: "0.58rem",
//                               fontWeight: 700,
//                               color: "#2d7a4f",
//                               letterSpacing: "0.06em",
//                               marginBottom: 2,
//                             }}
//                           >
//                             SUGGESTED FIX
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "0.7rem",
//                               color: "var(--rv-ink)",
//                               lineHeight: 1.55,
//                               background: "rgba(45,122,79,0.05)",
//                               padding: "0.35rem 0.6rem",
//                               borderRadius: 2,
//                               borderLeft: "2px solid #2d7a4f",
//                             }}
//                           >
//                             {issue.fixed}
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             fontSize: "0.63rem",
//                             color: "var(--rv-muted)",
//                             fontStyle: "italic",
//                             lineHeight: 1.4,
//                           }}
//                         >
//                           {issue.explanation}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Clean bill of health */}
//           {!loading && !error && issues.length > 0 && visible.length === 0 && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "1.5rem",
//                 color: "var(--rv-muted)",
//                 fontSize: "0.75rem",
//               }}
//             >
//               No {filter}-severity issues found.
//             </div>
//           )}

//           {/* No issues found after check */}
//           {!loading && !error && issues.length === 0 && applied.size === 0 && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "2rem 1rem",
//                 color: "var(--rv-muted)",
//               }}
//             >
//               <div style={{ fontSize: "2rem", marginBottom: 8 }}>✍️</div>
//               <div
//                 style={{
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   marginBottom: 4,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Check Your Writing
//               </div>
//               <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
//                 Scans your summary, bullet points, and descriptions for grammar
//                 errors, passive voice, weak verbs, and clarity issues.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function GrammarIcon({ white = false }: { white?: boolean }) {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: white ? "#fff" : "var(--rv-accent)",
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
// function Spinner() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: "#fff",
//         strokeWidth: 1.5,
//         animation: "rv-spin 0.7s linear infinite",
//         flexShrink: 0,
//       }}
//     >
//       <circle
//         cx="8"
//         cy="8"
//         r="6"
//         strokeDasharray="28"
//         strokeDashoffset="10"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { saveSection } from "@/actions/builder.actions";
import type {
  ResumeData,
  ResumeSection,
  SummaryContent,
  ExperienceItem,
  ProjectItem,
  VolunteerItem,
  AwardItem,
} from "@/types/resume";

// ── Types ─────────────────────────────────────────────────

interface GrammarIssue {
  fieldIndex: number;
  sectionId: string;
  sectionType: string;
  label: string;
  original: string;
  fixed: string;
  issueType:
    | "grammar"
    | "passive_voice"
    | "weak_verb"
    | "clarity"
    | "wordiness"
    | "typo"
    | "cliche";
  severity: "high" | "medium" | "low";
  explanation: string;
}

interface TextField {
  sectionId: string;
  sectionType: string;
  itemId?: string;
  label: string;
  text: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

// ── Extract all text fields from resume ───────────────────

function extractFields(
  resume: ResumeData,
  sections: ResumeSection[],
): TextField[] {
  const fields: TextField[] = [];
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  for (const s of sorted) {
    if (s.type === "summary") {
      const text = (s.content as SummaryContent)?.text ?? "";
      if (text.trim())
        fields.push({
          sectionId: s.id,
          sectionType: s.type,
          label: "Summary",
          text,
        });
    } else if (s.type === "experience") {
      const items = s.content as ExperienceItem[];
      if (!Array.isArray(items)) continue;
      for (const exp of items) {
        const heading = exp.role
          ? `${exp.role}${exp.company ? ` @ ${exp.company}` : ""}`
          : "Experience item";
        for (const b of exp.bullets ?? []) {
          if (b.trim())
            fields.push({
              sectionId: s.id,
              sectionType: s.type,
              itemId: exp.id,
              label: `${heading} — bullet`,
              text: b,
            });
        }
      }
    } else if (s.type === "projects") {
      const items = s.content as ProjectItem[];
      if (!Array.isArray(items)) continue;
      for (const proj of items) {
        if (proj.description?.trim()) {
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: proj.id,
            label: `Project: ${proj.name || "Untitled"}`,
            text: proj.description,
          });
        }
      }
    } else if (s.type === "volunteer") {
      const items = s.content as VolunteerItem[];
      if (!Array.isArray(items)) continue;
      for (const vol of items) {
        if (vol.description?.trim()) {
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: vol.id,
            label: `Volunteer: ${vol.role || "Role"}`,
            text: vol.description,
          });
        }
      }
    } else if (s.type === "awards") {
      const items = s.content as AwardItem[];
      if (!Array.isArray(items)) continue;
      for (const award of items) {
        if (award.description?.trim()) {
          fields.push({
            sectionId: s.id,
            sectionType: s.type,
            itemId: award.id,
            label: `Award: ${award.title || "Award"}`,
            text: award.description,
          });
        }
      }
    }
  }
  return fields;
}

// ── Severity helpers ──────────────────────────────────────

const SEVERITY_COLOR: Record<string, string> = {
  high: "#c84b2f",
  medium: "#b7791f",
  low: "#6b7280",
};
const SEVERITY_BG: Record<string, string> = {
  high: "rgba(200,75,47,0.07)",
  medium: "rgba(183,121,31,0.07)",
  low: "rgba(107,114,128,0.05)",
};

const ISSUE_LABEL: Record<string, string> = {
  grammar: "Grammar",
  passive_voice: "Passive Voice",
  weak_verb: "Weak Verb",
  clarity: "Clarity",
  wordiness: "Wordiness",
  typo: "Typo",
  cliche: "Cliché",
};

// ── Component ─────────────────────────────────────────────

export default function GrammarPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );

  useEffect(() => {
    if (open) {
      setIssues([]);
      setError("");
      setApplied(new Set());
      setFilter("all");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCheck = useCallback(async () => {
    setLoading(true);
    setError("");
    setIssues([]);
    try {
      const fields = extractFields(resume, sections);
      if (!fields.length) {
        setError("No text content found to check.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/ai/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      if (res.status === 402) {
        const data = await res.json();
        throw new Error(
          data.error ??
            "Free plan limit reached. Upgrade to Pro for unlimited AI uses.",
        );
      }
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const data: GrammarIssue[] = await res.json();
      // Re-attach sectionId/sectionType from the original fields array
      const enriched = data.map((issue) => ({
        ...issue,
        sectionId: fields[issue.fieldIndex]?.sectionId ?? issue.sectionId,
        sectionType: fields[issue.fieldIndex]?.sectionType ?? issue.sectionType,
      }));
      setIssues(enriched);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections]);

  const handleApply = useCallback(
    (issue: GrammarIssue, key: string) => {
      const section = sections.find((s) => s.id === issue.sectionId);
      if (!section) return;

      let newContent = section.content;

      if (section.type === "summary") {
        const current = (section.content as SummaryContent).text ?? "";
        newContent = {
          text: current.replace(issue.original, issue.fixed),
        } as SummaryContent;
      } else if (section.type === "experience") {
        newContent = (section.content as ExperienceItem[]).map((exp) => ({
          ...exp,
          bullets: exp.bullets.map((b) =>
            b.trim() === issue.original.trim() ? issue.fixed : b,
          ),
        }));
      } else if (["projects", "volunteer", "awards"].includes(section.type)) {
        newContent = (section.content as Array<Record<string, unknown>>).map(
          (item) => {
            if (
              typeof item.description === "string" &&
              item.description.includes(issue.original)
            ) {
              return {
                ...item,
                description: item.description.replace(
                  issue.original,
                  issue.fixed,
                ),
              };
            }
            return item;
          },
        );
      }

      const updatedSections = sections.map((s) =>
        s.id === section.id ? { ...s, content: newContent } : s,
      );
      onSectionsChange(updatedSections);
      saveSection(resume.id, section.id, newContent).catch(console.error);
      setApplied((prev) => new Set([...prev, key]));
    },
    [sections, resume.id, onSectionsChange],
  );

  if (!open) return null;

  const visible = issues.filter(
    (iss) => filter === "all" || iss.severity === filter,
  );
  const highCount = issues.filter((i) => i.severity === "high").length;
  const medCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;
  const appliedCount = applied.size;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(15,14,13,0.35)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 56,
          right: 0,
          bottom: 0,
          width: 440,
          zIndex: 91,
          background: "var(--rv-paper)",
          borderLeft: "1px solid var(--rv-border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(15,14,13,0.1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem 0.75rem",
            borderBottom: "1px solid var(--rv-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GrammarIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                Grammar & Clarity
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                Fix language issues across your resume
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--rv-muted)",
              fontSize: "1.1rem",
              lineHeight: 1,
              fontFamily: "inherit",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: loading ? "var(--rv-muted)" : "var(--rv-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Checking…
              </>
            ) : (
              <>
                <GrammarIcon white />
                {issues.length ? "Re-check" : "Check Grammar & Clarity"}
              </>
            )}
          </button>

          {error && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--rv-accent)",
                background: "rgba(200,75,47,0.07)",
                border: "1px solid rgba(200,75,47,0.2)",
                borderRadius: 2,
                padding: "0.6rem 0.75rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Results */}
          {issues.length > 0 && (
            <div>
              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 6,
                  marginBottom: "0.85rem",
                }}
              >
                {[
                  {
                    label: "All",
                    count: issues.length,
                    color: "var(--rv-ink)",
                    bg: "var(--rv-cream)",
                    id: "all" as const,
                  },
                  {
                    label: "High",
                    count: highCount,
                    color: "#c84b2f",
                    bg: "rgba(200,75,47,0.07)",
                    id: "high" as const,
                  },
                  {
                    label: "Medium",
                    count: medCount,
                    color: "#b7791f",
                    bg: "rgba(183,121,31,0.07)",
                    id: "medium" as const,
                  },
                  {
                    label: "Low",
                    count: lowCount,
                    color: "#6b7280",
                    bg: "rgba(107,114,128,0.06)",
                    id: "low" as const,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{
                      padding: "0.4rem 0.25rem",
                      borderRadius: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      border:
                        filter === f.id
                          ? `1.5px solid ${f.color}`
                          : "1px solid var(--rv-border)",
                      background: filter === f.id ? f.bg : "var(--rv-white)",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: f.color,
                        lineHeight: 1,
                      }}
                    >
                      {f.count}
                    </div>
                    <div
                      style={{
                        fontSize: "0.58rem",
                        color: f.color,
                        fontWeight: 600,
                        marginTop: 1,
                      }}
                    >
                      {f.label}
                    </div>
                  </button>
                ))}
              </div>

              {appliedCount > 0 && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#2d7a4f",
                    background: "#dcfce7",
                    border: "1px solid #bbf7d0",
                    borderRadius: 2,
                    padding: "0.45rem 0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  ✓ {appliedCount} fix{appliedCount > 1 ? "es" : ""} applied to
                  your resume
                </div>
              )}

              {/* Issue cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visible.map((issue, i) => {
                  const key = `${issue.sectionId}-${issue.fieldIndex}-${i}`;
                  const isApplied = applied.has(key);
                  return (
                    <div
                      key={key}
                      style={{
                        border: `1px solid ${isApplied ? "#bbf7d0" : "var(--rv-border)"}`,
                        borderRadius: 3,
                        background: isApplied
                          ? "rgba(45,122,79,0.04)"
                          : "var(--rv-white)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Card header */}
                      <div
                        style={{
                          padding: "0.45rem 0.75rem",
                          borderBottom: "1px solid var(--rv-border)",
                          background: "var(--rv-cream)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 99,
                              background: SEVERITY_BG[issue.severity],
                              color: SEVERITY_COLOR[issue.severity],
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              flexShrink: 0,
                            }}
                          >
                            {issue.severity}
                          </span>
                          <span
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 600,
                              padding: "1px 6px",
                              borderRadius: 99,
                              background: "var(--rv-white)",
                              color: "var(--rv-muted)",
                              border: "1px solid var(--rv-border)",
                              flexShrink: 0,
                            }}
                          >
                            {ISSUE_LABEL[issue.issueType] ?? issue.issueType}
                          </span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "var(--rv-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {issue.label}
                          </span>
                        </div>
                        {isApplied ? (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "#2d7a4f",
                              flexShrink: 0,
                            }}
                          >
                            ✓ Fixed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(issue, key)}
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              padding: "3px 10px",
                              flexShrink: 0,
                              background: "var(--rv-accent)",
                              color: "#fff",
                              border: "none",
                              borderRadius: 2,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Fix →
                          </button>
                        )}
                      </div>

                      {/* Before / After */}
                      <div
                        style={{
                          padding: "0.6rem 0.75rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              color: "#c84b2f",
                              letterSpacing: "0.06em",
                              marginBottom: 2,
                            }}
                          >
                            ORIGINAL
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "#6b6560",
                              lineHeight: 1.55,
                              background: "rgba(200,75,47,0.05)",
                              padding: "0.35rem 0.6rem",
                              borderRadius: 2,
                              borderLeft: "2px solid #c84b2f",
                            }}
                          >
                            {issue.original}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              color: "#2d7a4f",
                              letterSpacing: "0.06em",
                              marginBottom: 2,
                            }}
                          >
                            SUGGESTED FIX
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--rv-ink)",
                              lineHeight: 1.55,
                              background: "rgba(45,122,79,0.05)",
                              padding: "0.35rem 0.6rem",
                              borderRadius: 2,
                              borderLeft: "2px solid #2d7a4f",
                            }}
                          >
                            {issue.fixed}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "0.63rem",
                            color: "var(--rv-muted)",
                            fontStyle: "italic",
                            lineHeight: 1.4,
                          }}
                        >
                          {issue.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clean bill of health */}
          {!loading && !error && issues.length > 0 && visible.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                color: "var(--rv-muted)",
                fontSize: "0.75rem",
              }}
            >
              No {filter}-severity issues found.
            </div>
          )}

          {/* No issues found after check */}
          {!loading && !error && issues.length === 0 && applied.size === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>✍️</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Check Your Writing
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Scans your summary, bullet points, and descriptions for grammar
                errors, passive voice, weak verbs, and clarity issues.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function GrammarIcon({ white = false }: { white?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: white ? "#fff" : "var(--rv-accent)",
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
function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: "#fff",
        strokeWidth: 1.5,
        animation: "rv-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        strokeDasharray="28"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
