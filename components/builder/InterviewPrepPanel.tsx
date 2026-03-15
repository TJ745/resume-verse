// "use client";

// import { useState, useEffect, useCallback } from "react";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// interface Question {
//   category:
//     | "behavioral"
//     | "technical"
//     | "situational"
//     | "culture"
//     | "resume_specific";
//   difficulty: "easy" | "medium" | "hard";
//   question: string;
//   whyAsked: string;
//   tipToAnswer: string;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// type QType = "behavioral" | "technical" | "situational" | "culture";
// const ALL_TYPES: QType[] = [
//   "behavioral",
//   "technical",
//   "situational",
//   "culture",
// ];

// const CAT_COLOR: Record<string, string> = {
//   behavioral: "#1e3a5f",
//   technical: "#2d5a3d",
//   situational: "#6b3fa0",
//   culture: "#b7791f",
//   resume_specific: "#c84b2f",
// };
// const CAT_BG: Record<string, string> = {
//   behavioral: "rgba(30,58,95,0.08)",
//   technical: "rgba(45,90,61,0.08)",
//   situational: "rgba(107,63,160,0.08)",
//   culture: "rgba(183,121,31,0.08)",
//   resume_specific: "rgba(200,75,47,0.08)",
// };
// const DIFF_COLOR: Record<string, string> = {
//   easy: "#2d7a4f",
//   medium: "#b7791f",
//   hard: "#c84b2f",
// };
// const CAT_LABEL: Record<string, string> = {
//   behavioral: "Behavioral",
//   technical: "Technical",
//   situational: "Situational",
//   culture: "Culture Fit",
//   resume_specific: "Resume-Specific",
// };

// function buildResumeText(
//   resume: ResumeData,
//   sections: ResumeSection[],
// ): string {
//   const lines: string[] = [];
//   const p = resume.personalInfo;
//   if (p?.fullName) lines.push(p.fullName);
//   if (p?.jobTitle) lines.push(p.jobTitle);
//   const sorted = [...sections].sort((a, b) => a.order - b.order);
//   for (const s of sorted) {
//     lines.push(`\n${s.title.toUpperCase()}`);
//     const c = s.content;
//     if (
//       s.type === "summary" &&
//       c &&
//       typeof c === "object" &&
//       "text" in (c as object)
//     ) {
//       lines.push((c as { text: string }).text ?? "");
//     } else if (Array.isArray(c)) {
//       for (const item of c as Record<string, unknown>[]) {
//         const parts: string[] = [];
//         if (item.role) parts.push(String(item.role));
//         if (item.company) parts.push(String(item.company));
//         if (item.institution) parts.push(String(item.institution));
//         if (item.degree) parts.push(String(item.degree));
//         if (item.name) parts.push(String(item.name));
//         if (parts.length) lines.push(parts.join(" | "));
//         if (Array.isArray(item.bullets))
//           for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
//         if (item.description) lines.push(String(item.description));
//       }
//     } else if (c && typeof c === "object" && "categories" in (c as object)) {
//       for (const cat of (
//         c as { categories: { name: string; skills: string }[] }
//       ).categories) {
//         lines.push(`${cat.name}: ${cat.skills}`);
//       }
//     }
//   }
//   return lines.filter(Boolean).join("\n");
// }

// const inp: React.CSSProperties = {
//   width: "100%",
//   padding: "0.5rem 0.75rem",
//   border: "1px solid var(--rv-border)",
//   borderRadius: 2,
//   background: "var(--rv-white)",
//   color: "var(--rv-ink)",
//   fontSize: "0.78rem",
//   fontFamily: "inherit",
//   outline: "none",
//   boxSizing: "border-box",
// };

// export default function InterviewPrepPanel({
//   open,
//   onClose,
//   resume,
//   sections,
// }: Props) {
//   const [jobDescription, setJobDescription] = useState("");
//   const [selectedTypes, setSelectedTypes] = useState<QType[]>([
//     "behavioral",
//     "technical",
//     "situational",
//   ]);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeFilter, setActiveFilter] = useState<string>("all");
//   const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());

//   useEffect(() => {
//     if (open) {
//       setQuestions([]);
//       setError("");
//       setExpandedIdx(new Set());
//       setActiveFilter("all");
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   function toggleType(t: QType) {
//     setSelectedTypes((prev) =>
//       prev.includes(t)
//         ? prev.length > 1
//           ? prev.filter((x) => x !== t)
//           : prev // keep at least one
//         : [...prev, t],
//     );
//   }

//   const handleGenerate = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     setQuestions([]);
//     setExpandedIdx(new Set());
//     try {
//       const resumeText = buildResumeText(resume, sections);
//       const res = await fetch("/api/ai/interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resumeText,
//           jobDescription,
//           questionTypes: selectedTypes,
//         }),
//       });
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setQuestions(data.questions ?? []);
//       setActiveFilter("all");
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [resume, sections, jobDescription, selectedTypes]);

//   function toggleExpand(i: number) {
//     setExpandedIdx((prev) => {
//       const next = new Set(prev);
//       next.has(i) ? next.delete(i) : next.add(i);
//       return next;
//     });
//   }

//   if (!open) return null;

//   const categories = ["all", "resume_specific", ...selectedTypes] as string[];
//   const filtered =
//     activeFilter === "all"
//       ? questions
//       : questions.filter((q) => q.category === activeFilter);

//   const counts: Record<string, number> = { all: questions.length };
//   for (const q of questions) counts[q.category] = (counts[q.category] ?? 0) + 1;

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
//           width: 460,
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
//             <InterviewIcon />
//             <div>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   fontWeight: 700,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Interview Prep
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
//                 AI questions tailored to your resume
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
//               padding: 4,
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {/* Body */}
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: "1rem 1.25rem",
//             display: "flex",
//             flexDirection: "column",
//             gap: "0.85rem",
//           }}
//         >
//           {/* Type selector */}
//           <div>
//             <SLabel>Question categories</SLabel>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//               {ALL_TYPES.map((t) => {
//                 const on = selectedTypes.includes(t);
//                 return (
//                   <button
//                     key={t}
//                     onClick={() => toggleType(t)}
//                     style={{
//                       fontSize: "0.68rem",
//                       fontWeight: 600,
//                       padding: "3px 10px",
//                       borderRadius: 99,
//                       border: `1.5px solid ${on ? CAT_COLOR[t] : "var(--rv-border)"}`,
//                       background: on ? CAT_BG[t] : "var(--rv-white)",
//                       color: on ? CAT_COLOR[t] : "var(--rv-muted)",
//                       cursor: "pointer",
//                       fontFamily: "inherit",
//                     }}
//                   >
//                     {CAT_LABEL[t]}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* JD input */}
//           <div>
//             <SLabel>
//               Job Description{" "}
//               <span
//                 style={{
//                   fontWeight: 400,
//                   textTransform: "none",
//                   letterSpacing: 0,
//                 }}
//               >
//                 (optional — improves targeting)
//               </span>
//             </SLabel>
//             <textarea
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               rows={3}
//               placeholder="Paste the job description here for role-specific questions…"
//               style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
//             />
//           </div>

//           {/* Generate */}
//           <button
//             onClick={handleGenerate}
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
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 8,
//             }}
//           >
//             {loading ? (
//               <>
//                 <Spinner />
//                 Generating questions…
//               </>
//             ) : (
//               <>
//                 <InterviewIcon white />
//                 {questions.length ? "Regenerate" : "Generate Questions"}
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
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* Results */}
//           {questions.length > 0 && (
//             <div>
//               {/* Category filter pills */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: 5,
//                   marginBottom: "0.85rem",
//                 }}
//               >
//                 {categories
//                   .filter((c) => counts[c])
//                   .map((cat) => (
//                     <button
//                       key={cat}
//                       onClick={() => setActiveFilter(cat)}
//                       style={{
//                         fontSize: "0.65rem",
//                         fontWeight: 600,
//                         padding: "3px 10px",
//                         borderRadius: 99,
//                         border: `1.5px solid ${activeFilter === cat ? (CAT_COLOR[cat] ?? "var(--rv-ink)") : "var(--rv-border)"}`,
//                         background:
//                           activeFilter === cat
//                             ? (CAT_BG[cat] ?? "var(--rv-cream)")
//                             : "var(--rv-white)",
//                         color:
//                           activeFilter === cat
//                             ? (CAT_COLOR[cat] ?? "var(--rv-ink)")
//                             : "var(--rv-muted)",
//                         cursor: "pointer",
//                         fontFamily: "inherit",
//                       }}
//                     >
//                       {cat === "all" ? "All" : CAT_LABEL[cat]} ({counts[cat]})
//                     </button>
//                   ))}
//               </div>

//               {/* Question cards */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                 {filtered.map((q, i) => {
//                   const isOpen = expandedIdx.has(i);
//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         border: "1px solid var(--rv-border)",
//                         borderRadius: 3,
//                         overflow: "hidden",
//                         background: "var(--rv-white)",
//                       }}
//                     >
//                       {/* Question row */}
//                       <button
//                         onClick={() => toggleExpand(i)}
//                         style={{
//                           width: "100%",
//                           padding: "0.65rem 0.75rem",
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                           fontFamily: "inherit",
//                           display: "flex",
//                           alignItems: "flex-start",
//                           gap: 8,
//                           textAlign: "left",
//                         }}
//                       >
//                         {/* Badges */}
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 3,
//                             flexShrink: 0,
//                             paddingTop: 2,
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "0.55rem",
//                               fontWeight: 700,
//                               padding: "1px 5px",
//                               borderRadius: 99,
//                               background:
//                                 CAT_BG[q.category] ?? "var(--rv-cream)",
//                               color: CAT_COLOR[q.category] ?? "var(--rv-muted)",
//                             }}
//                           >
//                             {CAT_LABEL[q.category]}
//                           </span>
//                           <span
//                             style={{
//                               fontSize: "0.55rem",
//                               fontWeight: 700,
//                               padding: "1px 5px",
//                               borderRadius: 99,
//                               background: "rgba(0,0,0,0.04)",
//                               color: DIFF_COLOR[q.difficulty],
//                             }}
//                           >
//                             {q.difficulty}
//                           </span>
//                         </div>
//                         {/* Question text */}
//                         <span
//                           style={{
//                             fontSize: "0.73rem",
//                             color: "var(--rv-ink)",
//                             lineHeight: 1.55,
//                             flex: 1,
//                           }}
//                         >
//                           {q.question}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: "0.65rem",
//                             color: "var(--rv-muted)",
//                             flexShrink: 0,
//                             paddingTop: 2,
//                           }}
//                         >
//                           {isOpen ? "▲" : "▼"}
//                         </span>
//                       </button>

//                       {/* Expanded tips */}
//                       {isOpen && (
//                         <div
//                           style={{
//                             padding: "0 0.75rem 0.75rem",
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 8,
//                             borderTop: "1px solid var(--rv-border)",
//                           }}
//                         >
//                           <TipBlock
//                             label="Why they ask this"
//                             text={q.whyAsked}
//                             color="#1e3a5f"
//                             bg="rgba(30,58,95,0.05)"
//                           />
//                           <TipBlock
//                             label="How to answer"
//                             text={q.tipToAnswer}
//                             color="#2d7a4f"
//                             bg="rgba(45,122,79,0.05)"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Empty state */}
//           {!questions.length && !loading && !error && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "2rem 1rem",
//                 color: "var(--rv-muted)",
//               }}
//             >
//               <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎤</div>
//               <div
//                 style={{
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   marginBottom: 4,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Prepare for Your Interview
//               </div>
//               <div style={{ fontSize: "0.72rem", lineHeight: 1.65 }}>
//                 Generates 12–15 questions tailored to your specific resume —
//                 including questions about your actual jobs, skills, and
//                 projects. Paste a JD for role-specific targeting.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function TipBlock({
//   label,
//   text,
//   color,
//   bg,
// }: {
//   label: string;
//   text: string;
//   color: string;
//   bg: string;
// }) {
//   return (
//     <div
//       style={{
//         background: bg,
//         borderRadius: 2,
//         padding: "0.5rem 0.65rem",
//         borderLeft: `2px solid ${color}`,
//         marginTop: 6,
//       }}
//     >
//       <div
//         style={{
//           fontSize: "0.58rem",
//           fontWeight: 700,
//           color,
//           letterSpacing: "0.06em",
//           textTransform: "uppercase",
//           marginBottom: 3,
//         }}
//       >
//         {label}
//       </div>
//       <div
//         style={{ fontSize: "0.7rem", color: "var(--rv-ink)", lineHeight: 1.55 }}
//       >
//         {text}
//       </div>
//     </div>
//   );
// }
// function SLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <div
//       style={{
//         fontSize: "0.65rem",
//         fontWeight: 700,
//         color: "var(--rv-muted)",
//         textTransform: "uppercase",
//         letterSpacing: "0.06em",
//         marginBottom: 5,
//       }}
//     >
//       {children}
//     </div>
//   );
// }
// function InterviewIcon({ white = false }: { white?: boolean }) {
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
//       <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
//       <path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
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
import type { ResumeData, ResumeSection } from "@/types/resume";

interface Question {
  category:
    | "behavioral"
    | "technical"
    | "situational"
    | "culture"
    | "resume_specific";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  whyAsked: string;
  tipToAnswer: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}

type QType = "behavioral" | "technical" | "situational" | "culture";
const ALL_TYPES: QType[] = [
  "behavioral",
  "technical",
  "situational",
  "culture",
];

const CAT_COLOR: Record<string, string> = {
  behavioral: "#1e3a5f",
  technical: "#2d5a3d",
  situational: "#6b3fa0",
  culture: "#b7791f",
  resume_specific: "#c84b2f",
};
const CAT_BG: Record<string, string> = {
  behavioral: "rgba(30,58,95,0.08)",
  technical: "rgba(45,90,61,0.08)",
  situational: "rgba(107,63,160,0.08)",
  culture: "rgba(183,121,31,0.08)",
  resume_specific: "rgba(200,75,47,0.08)",
};
const DIFF_COLOR: Record<string, string> = {
  easy: "#2d7a4f",
  medium: "#b7791f",
  hard: "#c84b2f",
};
const CAT_LABEL: Record<string, string> = {
  behavioral: "Behavioral",
  technical: "Technical",
  situational: "Situational",
  culture: "Culture Fit",
  resume_specific: "Resume-Specific",
};

function buildResumeText(
  resume: ResumeData,
  sections: ResumeSection[],
): string {
  const lines: string[] = [];
  const p = resume.personalInfo;
  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  for (const s of sorted) {
    lines.push(`\n${s.title.toUpperCase()}`);
    const c = s.content;
    if (
      s.type === "summary" &&
      c &&
      typeof c === "object" &&
      "text" in (c as object)
    ) {
      lines.push((c as { text: string }).text ?? "");
    } else if (Array.isArray(c)) {
      for (const item of c as Record<string, unknown>[]) {
        const parts: string[] = [];
        if (item.role) parts.push(String(item.role));
        if (item.company) parts.push(String(item.company));
        if (item.institution) parts.push(String(item.institution));
        if (item.degree) parts.push(String(item.degree));
        if (item.name) parts.push(String(item.name));
        if (parts.length) lines.push(parts.join(" | "));
        if (Array.isArray(item.bullets))
          for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
        if (item.description) lines.push(String(item.description));
      }
    } else if (c && typeof c === "object" && "categories" in (c as object)) {
      for (const cat of (
        c as { categories: { name: string; skills: string }[] }
      ).categories) {
        lines.push(`${cat.name}: ${cat.skills}`);
      }
    }
  }
  return lines.filter(Boolean).join("\n");
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.78rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export default function InterviewPrepPanel({
  open,
  onClose,
  resume,
  sections,
}: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<QType[]>([
    "behavioral",
    "technical",
    "situational",
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open) {
      setQuestions([]);
      setError("");
      setExpandedIdx(new Set());
      setActiveFilter("all");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function toggleType(t: QType) {
    setSelectedTypes((prev) =>
      prev.includes(t)
        ? prev.length > 1
          ? prev.filter((x) => x !== t)
          : prev // keep at least one
        : [...prev, t],
    );
  }

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setExpandedIdx(new Set());
    try {
      const resumeText = buildResumeText(resume, sections);
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          questionTypes: selectedTypes,
        }),
      });
      if (res.status === 402) {
        const data = await res.json();
        throw new Error(
          data.error ??
            "Free plan limit reached. Upgrade to Pro for unlimited AI uses.",
        );
      }
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setActiveFilter("all");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections, jobDescription, selectedTypes]);

  function toggleExpand(i: number) {
    setExpandedIdx((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  if (!open) return null;

  const categories = ["all", "resume_specific", ...selectedTypes] as string[];
  const filtered =
    activeFilter === "all"
      ? questions
      : questions.filter((q) => q.category === activeFilter);

  const counts: Record<string, number> = { all: questions.length };
  for (const q of questions) counts[q.category] = (counts[q.category] ?? 0) + 1;

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
          width: 460,
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
            <InterviewIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                Interview Prep
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                AI questions tailored to your resume
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
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          {/* Type selector */}
          <div>
            <SLabel>Question categories</SLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_TYPES.map((t) => {
                const on = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 99,
                      border: `1.5px solid ${on ? CAT_COLOR[t] : "var(--rv-border)"}`,
                      background: on ? CAT_BG[t] : "var(--rv-white)",
                      color: on ? CAT_COLOR[t] : "var(--rv-muted)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {CAT_LABEL[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* JD input */}
          <div>
            <SLabel>
              Job Description{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional — improves targeting)
              </span>
            </SLabel>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              placeholder="Paste the job description here for role-specific questions…"
              style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Generating questions…
              </>
            ) : (
              <>
                <InterviewIcon white />
                {questions.length ? "Regenerate" : "Generate Questions"}
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
              }}
            >
              {error}
            </div>
          )}

          {/* Results */}
          {questions.length > 0 && (
            <div>
              {/* Category filter pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  marginBottom: "0.85rem",
                }}
              >
                {categories
                  .filter((c) => counts[c])
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 99,
                        border: `1.5px solid ${activeFilter === cat ? (CAT_COLOR[cat] ?? "var(--rv-ink)") : "var(--rv-border)"}`,
                        background:
                          activeFilter === cat
                            ? (CAT_BG[cat] ?? "var(--rv-cream)")
                            : "var(--rv-white)",
                        color:
                          activeFilter === cat
                            ? (CAT_COLOR[cat] ?? "var(--rv-ink)")
                            : "var(--rv-muted)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {cat === "all" ? "All" : CAT_LABEL[cat]} ({counts[cat]})
                    </button>
                  ))}
              </div>

              {/* Question cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.map((q, i) => {
                  const isOpen = expandedIdx.has(i);
                  return (
                    <div
                      key={i}
                      style={{
                        border: "1px solid var(--rv-border)",
                        borderRadius: 3,
                        overflow: "hidden",
                        background: "var(--rv-white)",
                      }}
                    >
                      {/* Question row */}
                      <button
                        onClick={() => toggleExpand(i)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.75rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          textAlign: "left",
                        }}
                      >
                        {/* Badges */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: 99,
                              background:
                                CAT_BG[q.category] ?? "var(--rv-cream)",
                              color: CAT_COLOR[q.category] ?? "var(--rv-muted)",
                            }}
                          >
                            {CAT_LABEL[q.category]}
                          </span>
                          <span
                            style={{
                              fontSize: "0.55rem",
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: 99,
                              background: "rgba(0,0,0,0.04)",
                              color: DIFF_COLOR[q.difficulty],
                            }}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        {/* Question text */}
                        <span
                          style={{
                            fontSize: "0.73rem",
                            color: "var(--rv-ink)",
                            lineHeight: 1.55,
                            flex: 1,
                          }}
                        >
                          {q.question}
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--rv-muted)",
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* Expanded tips */}
                      {isOpen && (
                        <div
                          style={{
                            padding: "0 0.75rem 0.75rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            borderTop: "1px solid var(--rv-border)",
                          }}
                        >
                          <TipBlock
                            label="Why they ask this"
                            text={q.whyAsked}
                            color="#1e3a5f"
                            bg="rgba(30,58,95,0.05)"
                          />
                          <TipBlock
                            label="How to answer"
                            text={q.tipToAnswer}
                            color="#2d7a4f"
                            bg="rgba(45,122,79,0.05)"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!questions.length && !loading && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎤</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Prepare for Your Interview
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.65 }}>
                Generates 12–15 questions tailored to your specific resume —
                including questions about your actual jobs, skills, and
                projects. Paste a JD for role-specific targeting.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TipBlock({
  label,
  text,
  color,
  bg,
}: {
  label: string;
  text: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 2,
        padding: "0.5rem 0.65rem",
        borderLeft: `2px solid ${color}`,
        marginTop: 6,
      }}
    >
      <div
        style={{
          fontSize: "0.58rem",
          fontWeight: 700,
          color,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: "0.7rem", color: "var(--rv-ink)", lineHeight: 1.55 }}
      >
        {text}
      </div>
    </div>
  );
}
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        color: "var(--rv-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 5,
      }}
    >
      {children}
    </div>
  );
}
function InterviewIcon({ white = false }: { white?: boolean }) {
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
      <path d="M13 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3l2 3 2-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
      <path d="M5 6h6M5 8.5h3" strokeLinecap="round" />
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
