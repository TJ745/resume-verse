// "use client";

// import { useState, useEffect, useRef } from "react";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// // ── Types ─────────────────────────────────────────────────

// interface ATSResult {
//   score: number;
//   scoreLabel: "Poor" | "Fair" | "Good" | "Excellent";
//   summary: string;
//   keywords: { matched: string[]; missing: string[] };
//   formatting: { pass: boolean; label: string; detail: string }[];
//   suggestions: { priority: "high" | "medium" | "low"; text: string }[];
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// // ── Helpers ───────────────────────────────────────────────

// function buildResumeText(
//   resume: ResumeData,
//   sections: ResumeSection[],
// ): string {
//   const lines: string[] = [];
//   const p = resume.personalInfo;

//   if (p?.fullName) lines.push(p.fullName);
//   if (p?.jobTitle) lines.push(p.jobTitle);
//   if (p?.email) lines.push(p.email);
//   if (p?.phone) lines.push(p.phone);
//   if (p?.linkedin) lines.push(p.linkedin);
//   if (p?.github) lines.push(p.github);

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
//         if (item.title) parts.push(String(item.title));
//         if (item.language) parts.push(String(item.language));
//         if (item.issuer) parts.push(String(item.issuer));
//         if (parts.length) lines.push(parts.join(" | "));
//         if (Array.isArray(item.bullets)) {
//           for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
//         }
//         if (item.description) lines.push(String(item.description));
//         if (item.skills && typeof item.skills === "string")
//           lines.push(String(item.skills));
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

// function scoreColor(score: number): string {
//   if (score >= 81) return "#2d7a4f";
//   if (score >= 61) return "#b7791f";
//   if (score >= 41) return "#c84b2f";
//   return "#9b1c1c";
// }

// function scoreTrack(score: number): string {
//   if (score >= 81) return "#dcfce7";
//   if (score >= 61) return "#fef9c3";
//   if (score >= 41) return "#ffedd5";
//   return "#fee2e2";
// }

// const PRIORITY_COLOR: Record<string, string> = {
//   high: "#c84b2f",
//   medium: "#b7791f",
//   low: "#6b7280",
// };
// const PRIORITY_BG: Record<string, string> = {
//   high: "rgba(200,75,47,0.08)",
//   medium: "rgba(183,121,31,0.08)",
//   low: "rgba(107,114,128,0.06)",
// };

// // ── Component ─────────────────────────────────────────────

// export default function ATSPanel({ open, onClose, resume, sections }: Props) {
//   const [jobDescription, setJobDescription] = useState("");
//   const [result, setResult] = useState<ATSResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [tab, setTab] = useState<
//     "score" | "keywords" | "formatting" | "suggestions"
//   >("score");
//   const panelRef = useRef<HTMLDivElement>(null);

//   // Reset when opened fresh
//   useEffect(() => {
//     if (open) {
//       setResult(null);
//       setError("");
//       setTab("score");
//     }
//   }, [open]);

//   // Close on Escape
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   async function handleAnalyse() {
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const resumeText = buildResumeText(resume, sections);
//       const res = await fetch("/api/ai/ats", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resumeText, jobDescription }),
//       });
//       if (!res.ok) throw new Error("Analysis failed");
//       const data: ATSResult = await res.json();
//       setResult(data);
//       setTab("score");
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!open) return null;

//   const passCount = result?.formatting.filter((f) => f.pass).length ?? 0;
//   const totalCheck = result?.formatting.length ?? 0;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 90,
//           background: "rgba(15,14,13,0.35)",
//         }}
//       />

//       {/* Panel */}
//       <div
//         ref={panelRef}
//         style={{
//           position: "fixed",
//           top: 56,
//           right: 0,
//           bottom: 0,
//           width: 400,
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
//             <ATSIcon />
//             <div>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   fontWeight: 700,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 ATS Optimizer
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
//                 Check resume compatibility
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

//         {/* Scrollable body */}
//         <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
//           {/* JD input */}
//           <div style={{ marginBottom: "1rem" }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: "0.7rem",
//                 fontWeight: 600,
//                 color: "var(--rv-muted)",
//                 marginBottom: 6,
//                 letterSpacing: "0.04em",
//                 textTransform: "uppercase",
//               }}
//             >
//               Job Description{" "}
//               <span
//                 style={{
//                   fontWeight: 400,
//                   textTransform: "none",
//                   letterSpacing: 0,
//                 }}
//               >
//                 (optional — improves keyword analysis)
//               </span>
//             </label>
//             <textarea
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               rows={5}
//               placeholder="Paste the job description here for keyword matching…"
//               style={{
//                 width: "100%",
//                 padding: "0.6rem 0.75rem",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 background: "var(--rv-white)",
//                 color: "var(--rv-ink)",
//                 fontSize: "0.78rem",
//                 fontFamily: "inherit",
//                 resize: "vertical",
//                 outline: "none",
//                 lineHeight: 1.5,
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>

//           {/* Analyse button */}
//           <button
//             onClick={handleAnalyse}
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
//               marginBottom: "1.25rem",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 8,
//             }}
//           >
//             {loading ? (
//               <>
//                 <Spinner />
//                 Analysing…
//               </>
//             ) : (
//               <>
//                 <ATSIcon white />
//                 {result ? "Re-analyse" : "Analyse Resume"}
//               </>
//             )}
//           </button>

//           {/* Error */}
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
//           {result && (
//             <div>
//               {/* Score ring */}
//               <div
//                 style={{
//                   background: scoreTrack(result.score),
//                   borderRadius: 4,
//                   padding: "1rem",
//                   marginBottom: "1rem",
//                   textAlign: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "3rem",
//                     fontWeight: 800,
//                     color: scoreColor(result.score),
//                     lineHeight: 1,
//                   }}
//                 >
//                   {result.score}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "0.7rem",
//                     fontWeight: 700,
//                     color: scoreColor(result.score),
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     marginTop: 2,
//                   }}
//                 >
//                   {result.scoreLabel}
//                 </div>
//                 {/* Score bar */}
//                 <div
//                   style={{
//                     height: 6,
//                     background: "rgba(0,0,0,0.08)",
//                     borderRadius: 99,
//                     margin: "0.6rem auto 0",
//                     maxWidth: 200,
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: "100%",
//                       width: `${result.score}%`,
//                       background: scoreColor(result.score),
//                       borderRadius: 99,
//                       transition: "width 0.6s ease",
//                     }}
//                   />
//                 </div>
//                 <p
//                   style={{
//                     fontSize: "0.72rem",
//                     color: "#4a4540",
//                     marginTop: "0.6rem",
//                     lineHeight: 1.5,
//                   }}
//                 >
//                   {result.summary}
//                 </p>
//               </div>

//               {/* Tabs */}
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 2,
//                   marginBottom: "1rem",
//                   background: "var(--rv-cream)",
//                   padding: 3,
//                   borderRadius: 3,
//                 }}
//               >
//                 {(
//                   ["score", "keywords", "formatting", "suggestions"] as const
//                 ).map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTab(t)}
//                     style={{
//                       flex: 1,
//                       padding: "0.35rem 0.25rem",
//                       background: tab === t ? "var(--rv-white)" : "transparent",
//                       border: "none",
//                       borderRadius: 2,
//                       fontSize: "0.65rem",
//                       fontWeight: 600,
//                       color: tab === t ? "var(--rv-accent)" : "var(--rv-muted)",
//                       cursor: "pointer",
//                       fontFamily: "inherit",
//                       textTransform: "capitalize",
//                       boxShadow:
//                         tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
//                       transition: "all 0.1s",
//                     }}
//                   >
//                     {t === "score" && "Overview"}
//                     {t === "keywords" &&
//                       `Keywords ${result.keywords.missing.length > 0 ? `(${result.keywords.missing.length}✗)` : "✓"}`}
//                     {t === "formatting" &&
//                       `Format (${passCount}/${totalCheck})`}
//                     {t === "suggestions" &&
//                       `Tips (${result.suggestions.length})`}
//                   </button>
//                 ))}
//               </div>

//               {/* ── Tab: Overview ── */}
//               {tab === "score" && (
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 8 }}
//                 >
//                   {/* Quick stats */}
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr 1fr",
//                       gap: 6,
//                     }}
//                   >
//                     <StatCard
//                       label="Matched"
//                       value={`${result.keywords.matched.length}`}
//                       sub="keywords"
//                       color="#2d7a4f"
//                       bg="#dcfce7"
//                     />
//                     <StatCard
//                       label="Missing"
//                       value={`${result.keywords.missing.length}`}
//                       sub="keywords"
//                       color={
//                         result.keywords.missing.length > 0
//                           ? "#c84b2f"
//                           : "#2d7a4f"
//                       }
//                       bg={
//                         result.keywords.missing.length > 0
//                           ? "rgba(200,75,47,0.08)"
//                           : "#dcfce7"
//                       }
//                     />
//                     <StatCard
//                       label="Checks"
//                       value={`${passCount}/${totalCheck}`}
//                       sub="passed"
//                       color={passCount === totalCheck ? "#2d7a4f" : "#b7791f"}
//                       bg={passCount === totalCheck ? "#dcfce7" : "#fef9c3"}
//                     />
//                   </div>
//                   {/* High priority suggestions preview */}
//                   {result.suggestions.filter((s) => s.priority === "high")
//                     .length > 0 && (
//                     <div>
//                       <div
//                         style={{
//                           fontSize: "0.65rem",
//                           fontWeight: 700,
//                           color: "var(--rv-muted)",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.06em",
//                           marginBottom: 6,
//                         }}
//                       >
//                         Top Priorities
//                       </div>
//                       {result.suggestions
//                         .filter((s) => s.priority === "high")
//                         .map((s, i) => (
//                           <SuggestionRow key={i} suggestion={s} />
//                         ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ── Tab: Keywords ── */}
//               {tab === "keywords" && (
//                 <div>
//                   {result.keywords.matched.length > 0 && (
//                     <div style={{ marginBottom: "0.85rem" }}>
//                       <div
//                         style={{
//                           fontSize: "0.65rem",
//                           fontWeight: 700,
//                           color: "#2d7a4f",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.06em",
//                           marginBottom: 6,
//                         }}
//                       >
//                         ✓ Found in Resume ({result.keywords.matched.length})
//                       </div>
//                       <div
//                         style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
//                       >
//                         {result.keywords.matched.map((kw, i) => (
//                           <span
//                             key={i}
//                             style={{
//                               fontSize: "0.7rem",
//                               background: "#dcfce7",
//                               color: "#166534",
//                               padding: "2px 8px",
//                               borderRadius: 99,
//                               border: "1px solid #bbf7d0",
//                             }}
//                           >
//                             {kw}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {result.keywords.missing.length > 0 ? (
//                     <div>
//                       <div
//                         style={{
//                           fontSize: "0.65rem",
//                           fontWeight: 700,
//                           color: "#c84b2f",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.06em",
//                           marginBottom: 6,
//                         }}
//                       >
//                         ✗ Missing / Add These ({result.keywords.missing.length})
//                       </div>
//                       <div
//                         style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
//                       >
//                         {result.keywords.missing.map((kw, i) => (
//                           <span
//                             key={i}
//                             style={{
//                               fontSize: "0.7rem",
//                               background: "rgba(200,75,47,0.07)",
//                               color: "#c84b2f",
//                               padding: "2px 8px",
//                               borderRadius: 99,
//                               border: "1px solid rgba(200,75,47,0.2)",
//                             }}
//                           >
//                             {kw}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       style={{
//                         fontSize: "0.75rem",
//                         color: "#2d7a4f",
//                         background: "#dcfce7",
//                         padding: "0.6rem 0.75rem",
//                         borderRadius: 3,
//                       }}
//                     >
//                       {jobDescription.trim()
//                         ? "✓ Great — no missing keywords from the job description!"
//                         : "Paste a job description above to check keyword match."}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ── Tab: Formatting ── */}
//               {tab === "formatting" && (
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 6 }}
//                 >
//                   {result.formatting.map((f, i) => (
//                     <div
//                       key={i}
//                       style={{
//                         display: "flex",
//                         gap: 10,
//                         alignItems: "flex-start",
//                         padding: "0.6rem 0.75rem",
//                         background: f.pass
//                           ? "rgba(45,122,79,0.05)"
//                           : "rgba(200,75,47,0.05)",
//                         border: `1px solid ${f.pass ? "rgba(45,122,79,0.15)" : "rgba(200,75,47,0.15)"}`,
//                         borderRadius: 3,
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: "0.75rem",
//                           marginTop: 1,
//                           flexShrink: 0,
//                         }}
//                       >
//                         {f.pass ? "✅" : "❌"}
//                       </span>
//                       <div>
//                         <div
//                           style={{
//                             fontSize: "0.72rem",
//                             fontWeight: 600,
//                             color: f.pass ? "#166534" : "#c84b2f",
//                             marginBottom: 2,
//                           }}
//                         >
//                           {f.label}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: "0.68rem",
//                             color: "var(--rv-muted)",
//                             lineHeight: 1.5,
//                           }}
//                         >
//                           {f.detail}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* ── Tab: Suggestions ── */}
//               {tab === "suggestions" && (
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 6 }}
//                 >
//                   {result.suggestions.map((s, i) => (
//                     <SuggestionRow key={i} suggestion={s} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Empty state */}
//           {!result && !loading && !error && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "2rem 1rem",
//                 color: "var(--rv-muted)",
//               }}
//             >
//               <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</div>
//               <div
//                 style={{
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   marginBottom: 4,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Check ATS Compatibility
//               </div>
//               <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
//                 Optionally paste a job description for keyword matching, then
//                 click Analyse to get your ATS score.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// // ── Sub-components ────────────────────────────────────────

// function StatCard({
//   label,
//   value,
//   sub,
//   color,
//   bg,
// }: {
//   label: string;
//   value: string;
//   sub: string;
//   color: string;
//   bg: string;
// }) {
//   return (
//     <div
//       style={{
//         background: bg,
//         borderRadius: 3,
//         padding: "0.5rem",
//         textAlign: "center",
//       }}
//     >
//       <div
//         style={{ fontSize: "1.25rem", fontWeight: 800, color, lineHeight: 1 }}
//       >
//         {value}
//       </div>
//       <div
//         style={{ fontSize: "0.58rem", color, fontWeight: 600, marginTop: 1 }}
//       >
//         {sub}
//       </div>
//       <div style={{ fontSize: "0.58rem", color: "#6b6560", marginTop: 1 }}>
//         {label}
//       </div>
//     </div>
//   );
// }

// function SuggestionRow({
//   suggestion,
// }: {
//   suggestion: { priority: string; text: string };
// }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: 8,
//         alignItems: "flex-start",
//         padding: "0.55rem 0.75rem",
//         background: PRIORITY_BG[suggestion.priority] ?? "transparent",
//         border: `1px solid ${PRIORITY_COLOR[suggestion.priority]}22`,
//         borderRadius: 3,
//       }}
//     >
//       <span
//         style={{
//           flexShrink: 0,
//           marginTop: 1,
//           fontSize: "0.58rem",
//           fontWeight: 700,
//           color: PRIORITY_COLOR[suggestion.priority],
//           background: `${PRIORITY_COLOR[suggestion.priority]}18`,
//           padding: "1px 5px",
//           borderRadius: 99,
//           textTransform: "uppercase",
//           letterSpacing: "0.04em",
//         }}
//       >
//         {suggestion.priority}
//       </span>
//       <span
//         style={{
//           fontSize: "0.72rem",
//           color: "var(--rv-ink)",
//           lineHeight: 1.55,
//         }}
//       >
//         {suggestion.text}
//       </span>
//     </div>
//   );
// }

// function ATSIcon({ white = false }: { white?: boolean }) {
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
//       <circle cx="8" cy="8" r="7" />
//       <path d="M5 8l2 2 4-4" />
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

import { useState, useEffect, useRef } from "react";
import type { ResumeData, ResumeSection } from "@/types/resume";

// ── Types ─────────────────────────────────────────────────

interface ATSResult {
  score: number;
  scoreLabel: "Poor" | "Fair" | "Good" | "Excellent";
  summary: string;
  keywords: { matched: string[]; missing: string[] };
  formatting: { pass: boolean; label: string; detail: string }[];
  suggestions: { priority: "high" | "medium" | "low"; text: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}

// ── Helpers ───────────────────────────────────────────────

function buildResumeText(
  resume: ResumeData,
  sections: ResumeSection[],
): string {
  const lines: string[] = [];
  const p = resume.personalInfo;

  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  if (p?.email) lines.push(p.email);
  if (p?.phone) lines.push(p.phone);
  if (p?.linkedin) lines.push(p.linkedin);
  if (p?.github) lines.push(p.github);

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
        if (item.title) parts.push(String(item.title));
        if (item.language) parts.push(String(item.language));
        if (item.issuer) parts.push(String(item.issuer));
        if (parts.length) lines.push(parts.join(" | "));
        if (Array.isArray(item.bullets)) {
          for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
        }
        if (item.description) lines.push(String(item.description));
        if (item.skills && typeof item.skills === "string")
          lines.push(String(item.skills));
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

function scoreColor(score: number): string {
  if (score >= 81) return "#2d7a4f";
  if (score >= 61) return "#b7791f";
  if (score >= 41) return "#c84b2f";
  return "#9b1c1c";
}

function scoreTrack(score: number): string {
  if (score >= 81) return "#dcfce7";
  if (score >= 61) return "#fef9c3";
  if (score >= 41) return "#ffedd5";
  return "#fee2e2";
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "#c84b2f",
  medium: "#b7791f",
  low: "#6b7280",
};
const PRIORITY_BG: Record<string, string> = {
  high: "rgba(200,75,47,0.08)",
  medium: "rgba(183,121,31,0.08)",
  low: "rgba(107,114,128,0.06)",
};

// ── Component ─────────────────────────────────────────────

export default function ATSPanel({ open, onClose, resume, sections }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<
    "score" | "keywords" | "formatting" | "suggestions"
  >("score");
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset when opened fresh
  useEffect(() => {
    if (open) {
      setResult(null);
      setError("");
      setTab("score");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleAnalyse() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const resumeText = buildResumeText(resume, sections);
      const res = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      if (res.status === 402) {
        const data = await res.json();
        throw new Error(
          data.error ??
            "Free plan limit reached. Upgrade to Pro for unlimited AI uses.",
        );
      }
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const data: ATSResult = await res.json();
      setResult(data);
      setTab("score");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const passCount = result?.formatting.filter((f) => f.pass).length ?? 0;
  const totalCheck = result?.formatting.length ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(15,14,13,0.35)",
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 56,
          right: 0,
          bottom: 0,
          width: 400,
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
            <ATSIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                ATS Optimizer
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                Check resume compatibility
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

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
          {/* JD input */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--rv-muted)",
                marginBottom: 6,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Job Description{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional — improves keyword analysis)
              </span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder="Paste the job description here for keyword matching…"
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                background: "var(--rv-white)",
                color: "var(--rv-ink)",
                fontSize: "0.78rem",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Analyse button */}
          <button
            onClick={handleAnalyse}
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
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Analysing…
              </>
            ) : (
              <>
                <ATSIcon white />
                {result ? "Re-analyse" : "Analyse Resume"}
              </>
            )}
          </button>

          {/* Error */}
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
          {result && (
            <div>
              {/* Score ring */}
              <div
                style={{
                  background: scoreTrack(result.score),
                  borderRadius: 4,
                  padding: "1rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: scoreColor(result.score),
                    lineHeight: 1,
                  }}
                >
                  {result.score}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: scoreColor(result.score),
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  {result.scoreLabel}
                </div>
                {/* Score bar */}
                <div
                  style={{
                    height: 6,
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: 99,
                    margin: "0.6rem auto 0",
                    maxWidth: 200,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${result.score}%`,
                      background: scoreColor(result.score),
                      borderRadius: 99,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#4a4540",
                    marginTop: "0.6rem",
                    lineHeight: 1.5,
                  }}
                >
                  {result.summary}
                </p>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  marginBottom: "1rem",
                  background: "var(--rv-cream)",
                  padding: 3,
                  borderRadius: 3,
                }}
              >
                {(
                  ["score", "keywords", "formatting", "suggestions"] as const
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: "0.35rem 0.25rem",
                      background: tab === t ? "var(--rv-white)" : "transparent",
                      border: "none",
                      borderRadius: 2,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: tab === t ? "var(--rv-accent)" : "var(--rv-muted)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textTransform: "capitalize",
                      boxShadow:
                        tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.1s",
                    }}
                  >
                    {t === "score" && "Overview"}
                    {t === "keywords" &&
                      `Keywords ${result.keywords.missing.length > 0 ? `(${result.keywords.missing.length}✗)` : "✓"}`}
                    {t === "formatting" &&
                      `Format (${passCount}/${totalCheck})`}
                    {t === "suggestions" &&
                      `Tips (${result.suggestions.length})`}
                  </button>
                ))}
              </div>

              {/* ── Tab: Overview ── */}
              {tab === "score" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {/* Quick stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 6,
                    }}
                  >
                    <StatCard
                      label="Matched"
                      value={`${result.keywords.matched.length}`}
                      sub="keywords"
                      color="#2d7a4f"
                      bg="#dcfce7"
                    />
                    <StatCard
                      label="Missing"
                      value={`${result.keywords.missing.length}`}
                      sub="keywords"
                      color={
                        result.keywords.missing.length > 0
                          ? "#c84b2f"
                          : "#2d7a4f"
                      }
                      bg={
                        result.keywords.missing.length > 0
                          ? "rgba(200,75,47,0.08)"
                          : "#dcfce7"
                      }
                    />
                    <StatCard
                      label="Checks"
                      value={`${passCount}/${totalCheck}`}
                      sub="passed"
                      color={passCount === totalCheck ? "#2d7a4f" : "#b7791f"}
                      bg={passCount === totalCheck ? "#dcfce7" : "#fef9c3"}
                    />
                  </div>
                  {/* High priority suggestions preview */}
                  {result.suggestions.filter((s) => s.priority === "high")
                    .length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "var(--rv-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 6,
                        }}
                      >
                        Top Priorities
                      </div>
                      {result.suggestions
                        .filter((s) => s.priority === "high")
                        .map((s, i) => (
                          <SuggestionRow key={i} suggestion={s} />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Keywords ── */}
              {tab === "keywords" && (
                <div>
                  {result.keywords.matched.length > 0 && (
                    <div style={{ marginBottom: "0.85rem" }}>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#2d7a4f",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 6,
                        }}
                      >
                        ✓ Found in Resume ({result.keywords.matched.length})
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                      >
                        {result.keywords.matched.map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "0.7rem",
                              background: "#dcfce7",
                              color: "#166534",
                              padding: "2px 8px",
                              borderRadius: 99,
                              border: "1px solid #bbf7d0",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.keywords.missing.length > 0 ? (
                    <div>
                      <div
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#c84b2f",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 6,
                        }}
                      >
                        ✗ Missing / Add These ({result.keywords.missing.length})
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                      >
                        {result.keywords.missing.map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "0.7rem",
                              background: "rgba(200,75,47,0.07)",
                              color: "#c84b2f",
                              padding: "2px 8px",
                              borderRadius: 99,
                              border: "1px solid rgba(200,75,47,0.2)",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#2d7a4f",
                        background: "#dcfce7",
                        padding: "0.6rem 0.75rem",
                        borderRadius: 3,
                      }}
                    >
                      {jobDescription.trim()
                        ? "✓ Great — no missing keywords from the job description!"
                        : "Paste a job description above to check keyword match."}
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Formatting ── */}
              {tab === "formatting" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {result.formatting.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "0.6rem 0.75rem",
                        background: f.pass
                          ? "rgba(45,122,79,0.05)"
                          : "rgba(200,75,47,0.05)",
                        border: `1px solid ${f.pass ? "rgba(45,122,79,0.15)" : "rgba(200,75,47,0.15)"}`,
                        borderRadius: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      >
                        {f.pass ? "✅" : "❌"}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: f.pass ? "#166534" : "#c84b2f",
                            marginBottom: 2,
                          }}
                        >
                          {f.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--rv-muted)",
                            lineHeight: 1.5,
                          }}
                        >
                          {f.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Suggestions ── */}
              {tab === "suggestions" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {result.suggestions.map((s, i) => (
                    <SuggestionRow key={i} suggestion={s} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Check ATS Compatibility
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Optionally paste a job description for keyword matching, then
                click Analyse to get your ATS score.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 3,
        padding: "0.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{ fontSize: "1.25rem", fontWeight: 800, color, lineHeight: 1 }}
      >
        {value}
      </div>
      <div
        style={{ fontSize: "0.58rem", color, fontWeight: 600, marginTop: 1 }}
      >
        {sub}
      </div>
      <div style={{ fontSize: "0.58rem", color: "#6b6560", marginTop: 1 }}>
        {label}
      </div>
    </div>
  );
}

function SuggestionRow({
  suggestion,
}: {
  suggestion: { priority: string; text: string };
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "0.55rem 0.75rem",
        background: PRIORITY_BG[suggestion.priority] ?? "transparent",
        border: `1px solid ${PRIORITY_COLOR[suggestion.priority]}22`,
        borderRadius: 3,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          marginTop: 1,
          fontSize: "0.58rem",
          fontWeight: 700,
          color: PRIORITY_COLOR[suggestion.priority],
          background: `${PRIORITY_COLOR[suggestion.priority]}18`,
          padding: "1px 5px",
          borderRadius: 99,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {suggestion.priority}
      </span>
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--rv-ink)",
          lineHeight: 1.55,
        }}
      >
        {suggestion.text}
      </span>
    </div>
  );
}

function ATSIcon({ white = false }: { white?: boolean }) {
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
      <circle cx="8" cy="8" r="7" />
      <path d="M5 8l2 2 4-4" />
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
