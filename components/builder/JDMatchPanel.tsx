// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { saveSection } from "@/actions/builder.actions";
// import type {
//   ResumeData,
//   ResumeSection,
//   SummaryContent,
//   ExperienceItem,
//   SkillsContent,
// } from "@/types/resume";

// // ── Types ─────────────────────────────────────────────────

// interface Rewrite {
//   sectionId: string | null;
//   sectionType: "summary" | "skills" | "experience";
//   sectionTitle: string;
//   field: "text" | "bullets" | "categories";
//   itemId: string | null;
//   label: string;
//   original: string;
//   optimized: string;
//   reason: string;
// }

// interface JDResult {
//   matchScore: number;
//   matchLabel: "Poor" | "Fair" | "Good" | "Excellent";
//   topKeywords: string[];
//   missingKeywords: string[];
//   rewrites: Rewrite[];
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   resume: ResumeData;
//   sections: ResumeSection[];
//   onSectionsChange: (s: ResumeSection[]) => void;
// }

// // ── Resume text serializer ────────────────────────────────

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

// // ── Score colours ─────────────────────────────────────────

// function scoreColor(s: number) {
//   if (s >= 81) return "#2d7a4f";
//   if (s >= 61) return "#b7791f";
//   if (s >= 41) return "#c84b2f";
//   return "#9b1c1c";
// }
// function scoreTrack(s: number) {
//   if (s >= 81) return "#dcfce7";
//   if (s >= 61) return "#fef9c3";
//   if (s >= 41) return "#ffedd5";
//   return "#fee2e2";
// }

// // ── Component ─────────────────────────────────────────────

// export default function JDMatchPanel({
//   open,
//   onClose,
//   resume,
//   sections,
//   onSectionsChange,
// }: Props) {
//   const [jobDescription, setJobDescription] = useState("");
//   const [result, setResult] = useState<JDResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [applied, setApplied] = useState<Set<string>>(new Set());
//   const [tab, setTab] = useState<"overview" | "rewrites">("overview");

//   useEffect(() => {
//     if (open) {
//       setResult(null);
//       setError("");
//       setApplied(new Set());
//       setTab("overview");
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   const handleAnalyse = useCallback(async () => {
//     if (!jobDescription.trim()) return;
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const resumeText = buildResumeText(resume, sections);
//       // Send sections as simplified payload for AI context
//       const sectionPayload = sections.map((s) => ({
//         id: s.id,
//         type: s.type,
//         title: s.title,
//         content: s.content,
//       }));
//       const res = await fetch("/api/ai/jd-match", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resumeText,
//           jobDescription,
//           sections: sectionPayload,
//         }),
//       });
//       if (!res.ok) throw new Error("Analysis failed");
//       const data: JDResult = await res.json();
//       setResult(data);
//       setTab("overview");
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [resume, sections, jobDescription]);

//   // Apply a single rewrite to the live sections state + save to DB
//   const handleApply = useCallback(
//     (rw: Rewrite, key: string) => {
//       const section = sections.find((s) => s.id === rw.sectionId);
//       if (!section) return;

//       let newContent = section.content;

//       if (rw.field === "text" && rw.sectionType === "summary") {
//         newContent = { text: rw.optimized } as SummaryContent;
//       } else if (
//         rw.field === "bullets" &&
//         rw.sectionType === "experience" &&
//         rw.itemId
//       ) {
//         const items = (section.content as ExperienceItem[]).map((exp) => {
//           if (exp.id !== rw.itemId) return exp;
//           // Replace the bullet that matches original text
//           const bullets = exp.bullets.map((b) =>
//             b.trim() === rw.original.trim() ? rw.optimized : b,
//           );
//           return { ...exp, bullets };
//         });
//         newContent = items;
//       } else if (rw.field === "categories" && rw.sectionType === "skills") {
//         // optimized is "CategoryName: skill1, skill2" — inject as new or replace matching category
//         const [namePart, skillsPart] = rw.optimized
//           .split(":")
//           .map((s) => s.trim());
//         const raw = section.content as SkillsContent;
//         const existing = raw.categories ?? [];
//         const idx = existing.findIndex(
//           (c) => c.name.toLowerCase() === namePart.toLowerCase(),
//         );
//         const updated =
//           idx > -1
//             ? existing.map((c, i) =>
//                 i === idx ? { ...c, skills: skillsPart ?? "" } : c,
//               )
//             : [
//                 ...existing,
//                 {
//                   id: crypto.randomUUID(),
//                   name: namePart,
//                   skills: skillsPart ?? "",
//                 },
//               ];
//         newContent = { categories: updated };
//       }

//       // Update local state
//       const updatedSections = sections.map((s) =>
//         s.id === section.id ? { ...s, content: newContent } : s,
//       );
//       onSectionsChange(updatedSections);

//       // Save to DB
//       saveSection(resume.id, section.id, newContent).catch(console.error);

//       setApplied((prev) => new Set([...prev, key]));
//     },
//     [sections, resume.id, onSectionsChange],
//   );

//   if (!open) return null;

//   const pendingRewrites = result?.rewrites.filter((r) => r.sectionId) ?? [];

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
//             <TargetIcon />
//             <div>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   fontWeight: 700,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 JD Match & Optimize
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
//                 Tailor resume to job description
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
//           {/* JD Input */}
//           <div style={{ marginBottom: "0.85rem" }}>
//             <SLabel>
//               Job Description{" "}
//               <span style={{ fontWeight: 400, fontSize: "0.68rem" }}>
//                 (required)
//               </span>
//             </SLabel>
//             <textarea
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               rows={6}
//               placeholder="Paste the full job description here…"
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
//             disabled={loading || !jobDescription.trim()}
//             style={{
//               width: "100%",
//               padding: "0.6rem",
//               background:
//                 loading || !jobDescription.trim()
//                   ? "var(--rv-muted)"
//                   : "var(--rv-accent)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 2,
//               fontSize: "0.8rem",
//               fontWeight: 600,
//               cursor:
//                 loading || !jobDescription.trim() ? "not-allowed" : "pointer",
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
//                 <TargetIcon white />
//                 {result ? "Re-analyse" : "Analyse & Optimize"}
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

//           {result && (
//             <div>
//               {/* Score */}
//               <div
//                 style={{
//                   background: scoreTrack(result.matchScore),
//                   borderRadius: 4,
//                   padding: "0.85rem 1rem",
//                   marginBottom: "1rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "1rem",
//                 }}
//               >
//                 <div style={{ textAlign: "center", flexShrink: 0 }}>
//                   <div
//                     style={{
//                       fontSize: "2.2rem",
//                       fontWeight: 800,
//                       color: scoreColor(result.matchScore),
//                       lineHeight: 1,
//                     }}
//                   >
//                     {result.matchScore}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       fontWeight: 700,
//                       color: scoreColor(result.matchScore),
//                       letterSpacing: "0.08em",
//                       textTransform: "uppercase",
//                     }}
//                   >
//                     {result.matchLabel}
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div
//                     style={{
//                       height: 5,
//                       background: "rgba(0,0,0,0.1)",
//                       borderRadius: 99,
//                       marginBottom: 8,
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: "100%",
//                         width: `${result.matchScore}%`,
//                         background: scoreColor(result.matchScore),
//                         borderRadius: 99,
//                         transition: "width 0.6s ease",
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.68rem",
//                       color: "#4a4540",
//                       lineHeight: 1.5,
//                     }}
//                   >
//                     {result.missingKeywords.length > 0
//                       ? `${result.missingKeywords.length} missing keywords · ${pendingRewrites.length} optimizations available`
//                       : "Strong match — apply rewrites to push score higher"}
//                   </div>
//                 </div>
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
//                 {(["overview", "rewrites"] as const).map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTab(t)}
//                     style={{
//                       flex: 1,
//                       padding: "0.35rem",
//                       background: tab === t ? "var(--rv-white)" : "transparent",
//                       border: "none",
//                       borderRadius: 2,
//                       fontSize: "0.68rem",
//                       fontWeight: 600,
//                       color: tab === t ? "var(--rv-accent)" : "var(--rv-muted)",
//                       cursor: "pointer",
//                       fontFamily: "inherit",
//                       boxShadow:
//                         tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
//                     }}
//                   >
//                     {t === "overview"
//                       ? "Keywords"
//                       : `Rewrites (${pendingRewrites.length})`}
//                   </button>
//                 ))}
//               </div>

//               {/* Keywords tab */}
//               {tab === "overview" && (
//                 <div>
//                   {result.topKeywords.length > 0 && (
//                     <div style={{ marginBottom: "0.85rem" }}>
//                       <SLabel>Top JD Keywords</SLabel>
//                       <div
//                         style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
//                       >
//                         {result.topKeywords.map((kw, i) => {
//                           const has = !result.missingKeywords.includes(kw);
//                           return (
//                             <span
//                               key={i}
//                               style={{
//                                 fontSize: "0.7rem",
//                                 padding: "2px 8px",
//                                 borderRadius: 99,
//                                 background: has
//                                   ? "#dcfce7"
//                                   : "rgba(200,75,47,0.07)",
//                                 color: has ? "#166534" : "#c84b2f",
//                                 border: `1px solid ${has ? "#bbf7d0" : "rgba(200,75,47,0.2)"}`,
//                               }}
//                             >
//                               {has ? "✓ " : "✗ "}
//                               {kw}
//                             </span>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                   {result.missingKeywords.length > 0 && (
//                     <div>
//                       <SLabel style={{ color: "#c84b2f" }}>
//                         Missing from Resume
//                       </SLabel>
//                       <div
//                         style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
//                       >
//                         {result.missingKeywords.map((kw, i) => (
//                           <span
//                             key={i}
//                             style={{
//                               fontSize: "0.7rem",
//                               padding: "2px 8px",
//                               borderRadius: 99,
//                               background: "rgba(200,75,47,0.07)",
//                               color: "#c84b2f",
//                               border: "1px solid rgba(200,75,47,0.2)",
//                             }}
//                           >
//                             {kw}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Rewrites tab */}
//               {tab === "rewrites" && (
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 10 }}
//                 >
//                   {pendingRewrites.length === 0 && (
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: "1.5rem",
//                         color: "var(--rv-muted)",
//                         fontSize: "0.75rem",
//                       }}
//                     >
//                       No section rewrites needed — your resume already matches
//                       well!
//                     </div>
//                   )}
//                   {pendingRewrites.map((rw, i) => {
//                     const key = `${rw.sectionId}-${i}`;
//                     const isApplied = applied.has(key);
//                     return (
//                       <div
//                         key={key}
//                         style={{
//                           border: `1px solid ${isApplied ? "#bbf7d0" : "var(--rv-border)"}`,
//                           borderRadius: 3,
//                           background: isApplied
//                             ? "rgba(45,122,79,0.04)"
//                             : "var(--rv-white)",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {/* Card header */}
//                         <div
//                           style={{
//                             padding: "0.5rem 0.75rem",
//                             borderBottom: "1px solid var(--rv-border)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             background: "var(--rv-cream)",
//                           }}
//                         >
//                           <div>
//                             <span
//                               style={{
//                                 fontSize: "0.68rem",
//                                 fontWeight: 700,
//                                 color: "var(--rv-ink)",
//                               }}
//                             >
//                               {rw.label}
//                             </span>
//                             <span
//                               style={{
//                                 fontSize: "0.6rem",
//                                 color: "var(--rv-muted)",
//                                 marginLeft: 6,
//                               }}
//                             >
//                               {rw.sectionType === "summary"
//                                 ? "Summary"
//                                 : rw.sectionType === "skills"
//                                   ? "Skills"
//                                   : "Bullet"}
//                             </span>
//                           </div>
//                           {isApplied ? (
//                             <span
//                               style={{
//                                 fontSize: "0.65rem",
//                                 fontWeight: 700,
//                                 color: "#2d7a4f",
//                               }}
//                             >
//                               ✓ Applied
//                             </span>
//                           ) : (
//                             <button
//                               onClick={() => handleApply(rw, key)}
//                               style={{
//                                 fontSize: "0.65rem",
//                                 fontWeight: 700,
//                                 padding: "3px 10px",
//                                 background: "var(--rv-accent)",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: 2,
//                                 cursor: "pointer",
//                                 fontFamily: "inherit",
//                               }}
//                             >
//                               Apply →
//                             </button>
//                           )}
//                         </div>

//                         {/* Before / After */}
//                         <div
//                           style={{
//                             padding: "0.65rem 0.75rem",
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 6,
//                           }}
//                         >
//                           <div>
//                             <div
//                               style={{
//                                 fontSize: "0.58rem",
//                                 fontWeight: 700,
//                                 color: "#c84b2f",
//                                 letterSpacing: "0.06em",
//                                 marginBottom: 3,
//                               }}
//                             >
//                               BEFORE
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "0.7rem",
//                                 color: "#6b6560",
//                                 lineHeight: 1.55,
//                                 background: "rgba(200,75,47,0.05)",
//                                 padding: "0.4rem 0.6rem",
//                                 borderRadius: 2,
//                                 borderLeft: "2px solid #c84b2f",
//                               }}
//                             >
//                               {rw.original}
//                             </div>
//                           </div>
//                           <div>
//                             <div
//                               style={{
//                                 fontSize: "0.58rem",
//                                 fontWeight: 700,
//                                 color: "#2d7a4f",
//                                 letterSpacing: "0.06em",
//                                 marginBottom: 3,
//                               }}
//                             >
//                               AFTER
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: "0.7rem",
//                                 color: "var(--rv-ink)",
//                                 lineHeight: 1.55,
//                                 background: "rgba(45,122,79,0.05)",
//                                 padding: "0.4rem 0.6rem",
//                                 borderRadius: 2,
//                                 borderLeft: "2px solid #2d7a4f",
//                               }}
//                             >
//                               {rw.optimized}
//                             </div>
//                           </div>
//                           <div
//                             style={{
//                               fontSize: "0.65rem",
//                               color: "var(--rv-muted)",
//                               fontStyle: "italic",
//                               lineHeight: 1.5,
//                             }}
//                           >
//                             💡 {rw.reason}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
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
//                 Match Resume to Job
//               </div>
//               <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
//                 Paste a job description and get a match score, keyword gap
//                 analysis, and one-click section rewrites.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function SLabel({
//   children,
//   style,
// }: {
//   children: React.ReactNode;
//   style?: React.CSSProperties;
// }) {
//   return (
//     <div
//       style={{
//         fontSize: "0.65rem",
//         fontWeight: 700,
//         color: "var(--rv-muted)",
//         textTransform: "uppercase",
//         letterSpacing: "0.06em",
//         marginBottom: 6,
//         ...style,
//       }}
//     >
//       {children}
//     </div>
//   );
// }
// function TargetIcon({ white = false }: { white?: boolean }) {
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
//       <circle cx="8" cy="8" r="3.5" />
//       <circle cx="8" cy="8" r="1" fill={white ? "#fff" : "var(--rv-accent)"} />
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
  SkillsContent,
} from "@/types/resume";

// ── Types ─────────────────────────────────────────────────

interface Rewrite {
  sectionId: string | null;
  sectionType: "summary" | "skills" | "experience";
  sectionTitle: string;
  field: "text" | "bullets" | "categories";
  itemId: string | null;
  label: string;
  original: string;
  optimized: string;
  reason: string;
}

interface JDResult {
  matchScore: number;
  matchLabel: "Poor" | "Fair" | "Good" | "Excellent";
  topKeywords: string[];
  missingKeywords: string[];
  rewrites: Rewrite[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

// ── Resume text serializer ────────────────────────────────

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

// ── Score colours ─────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 81) return "#2d7a4f";
  if (s >= 61) return "#b7791f";
  if (s >= 41) return "#c84b2f";
  return "#9b1c1c";
}
function scoreTrack(s: number) {
  if (s >= 81) return "#dcfce7";
  if (s >= 61) return "#fef9c3";
  if (s >= 41) return "#ffedd5";
  return "#fee2e2";
}

// ── Component ─────────────────────────────────────────────

export default function JDMatchPanel({
  open,
  onClose,
  resume,
  sections,
  onSectionsChange,
}: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JDResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"overview" | "rewrites">("overview");

  useEffect(() => {
    if (open) {
      setResult(null);
      setError("");
      setApplied(new Set());
      setTab("overview");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAnalyse = useCallback(async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const resumeText = buildResumeText(resume, sections);
      // Send sections as simplified payload for AI context
      const sectionPayload = sections.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        content: s.content,
      }));
      const res = await fetch("/api/ai/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          sections: sectionPayload,
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
      const data: JDResult = await res.json();
      setResult(data);
      setTab("overview");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resume, sections, jobDescription]);

  // Apply a single rewrite to the live sections state + save to DB
  const handleApply = useCallback(
    (rw: Rewrite, key: string) => {
      const section = sections.find((s) => s.id === rw.sectionId);
      if (!section) return;

      let newContent = section.content;

      if (rw.field === "text" && rw.sectionType === "summary") {
        newContent = { text: rw.optimized } as SummaryContent;
      } else if (
        rw.field === "bullets" &&
        rw.sectionType === "experience" &&
        rw.itemId
      ) {
        const items = (section.content as ExperienceItem[]).map((exp) => {
          if (exp.id !== rw.itemId) return exp;
          // Replace the bullet that matches original text
          const bullets = exp.bullets.map((b) =>
            b.trim() === rw.original.trim() ? rw.optimized : b,
          );
          return { ...exp, bullets };
        });
        newContent = items;
      } else if (rw.field === "categories" && rw.sectionType === "skills") {
        // optimized is "CategoryName: skill1, skill2" — inject as new or replace matching category
        const [namePart, skillsPart] = rw.optimized
          .split(":")
          .map((s) => s.trim());
        const raw = section.content as SkillsContent;
        const existing = raw.categories ?? [];
        const idx = existing.findIndex(
          (c) => c.name.toLowerCase() === namePart.toLowerCase(),
        );
        const updated =
          idx > -1
            ? existing.map((c, i) =>
                i === idx ? { ...c, skills: skillsPart ?? "" } : c,
              )
            : [
                ...existing,
                {
                  id: crypto.randomUUID(),
                  name: namePart,
                  skills: skillsPart ?? "",
                },
              ];
        newContent = { categories: updated };
      }

      // Update local state
      const updatedSections = sections.map((s) =>
        s.id === section.id ? { ...s, content: newContent } : s,
      );
      onSectionsChange(updatedSections);

      // Save to DB
      saveSection(resume.id, section.id, newContent).catch(console.error);

      setApplied((prev) => new Set([...prev, key]));
    },
    [sections, resume.id, onSectionsChange],
  );

  if (!open) return null;

  const pendingRewrites = result?.rewrites.filter((r) => r.sectionId) ?? [];

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
            <TargetIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                JD Match & Optimize
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                Tailor resume to job description
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
          {/* JD Input */}
          <div style={{ marginBottom: "0.85rem" }}>
            <SLabel>
              Job Description{" "}
              <span style={{ fontWeight: 400, fontSize: "0.68rem" }}>
                (required)
              </span>
            </SLabel>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here…"
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
            disabled={loading || !jobDescription.trim()}
            style={{
              width: "100%",
              padding: "0.6rem",
              background:
                loading || !jobDescription.trim()
                  ? "var(--rv-muted)"
                  : "var(--rv-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor:
                loading || !jobDescription.trim() ? "not-allowed" : "pointer",
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
                <TargetIcon white />
                {result ? "Re-analyse" : "Analyse & Optimize"}
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

          {result && (
            <div>
              {/* Score */}
              <div
                style={{
                  background: scoreTrack(result.matchScore),
                  borderRadius: 4,
                  padding: "0.85rem 1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      color: scoreColor(result.matchScore),
                      lineHeight: 1,
                    }}
                  >
                    {result.matchScore}
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: scoreColor(result.matchScore),
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {result.matchLabel}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 5,
                      background: "rgba(0,0,0,0.1)",
                      borderRadius: 99,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${result.matchScore}%`,
                        background: scoreColor(result.matchScore),
                        borderRadius: 99,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "#4a4540",
                      lineHeight: 1.5,
                    }}
                  >
                    {result.missingKeywords.length > 0
                      ? `${result.missingKeywords.length} missing keywords · ${pendingRewrites.length} optimizations available`
                      : "Strong match — apply rewrites to push score higher"}
                  </div>
                </div>
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
                {(["overview", "rewrites"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: "0.35rem",
                      background: tab === t ? "var(--rv-white)" : "transparent",
                      border: "none",
                      borderRadius: 2,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      color: tab === t ? "var(--rv-accent)" : "var(--rv-muted)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow:
                        tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {t === "overview"
                      ? "Keywords"
                      : `Rewrites (${pendingRewrites.length})`}
                  </button>
                ))}
              </div>

              {/* Keywords tab */}
              {tab === "overview" && (
                <div>
                  {result.topKeywords.length > 0 && (
                    <div style={{ marginBottom: "0.85rem" }}>
                      <SLabel>Top JD Keywords</SLabel>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                      >
                        {result.topKeywords.map((kw, i) => {
                          const has = !result.missingKeywords.includes(kw);
                          return (
                            <span
                              key={i}
                              style={{
                                fontSize: "0.7rem",
                                padding: "2px 8px",
                                borderRadius: 99,
                                background: has
                                  ? "#dcfce7"
                                  : "rgba(200,75,47,0.07)",
                                color: has ? "#166534" : "#c84b2f",
                                border: `1px solid ${has ? "#bbf7d0" : "rgba(200,75,47,0.2)"}`,
                              }}
                            >
                              {has ? "✓ " : "✗ "}
                              {kw}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {result.missingKeywords.length > 0 && (
                    <div>
                      <SLabel style={{ color: "#c84b2f" }}>
                        Missing from Resume
                      </SLabel>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                      >
                        {result.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 8px",
                              borderRadius: 99,
                              background: "rgba(200,75,47,0.07)",
                              color: "#c84b2f",
                              border: "1px solid rgba(200,75,47,0.2)",
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rewrites tab */}
              {tab === "rewrites" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {pendingRewrites.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1.5rem",
                        color: "var(--rv-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      No section rewrites needed — your resume already matches
                      well!
                    </div>
                  )}
                  {pendingRewrites.map((rw, i) => {
                    const key = `${rw.sectionId}-${i}`;
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
                            padding: "0.5rem 0.75rem",
                            borderBottom: "1px solid var(--rv-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "var(--rv-cream)",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                color: "var(--rv-ink)",
                              }}
                            >
                              {rw.label}
                            </span>
                            <span
                              style={{
                                fontSize: "0.6rem",
                                color: "var(--rv-muted)",
                                marginLeft: 6,
                              }}
                            >
                              {rw.sectionType === "summary"
                                ? "Summary"
                                : rw.sectionType === "skills"
                                  ? "Skills"
                                  : "Bullet"}
                            </span>
                          </div>
                          {isApplied ? (
                            <span
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#2d7a4f",
                              }}
                            >
                              ✓ Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(rw, key)}
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "3px 10px",
                                background: "var(--rv-accent)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 2,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Apply →
                            </button>
                          )}
                        </div>

                        {/* Before / After */}
                        <div
                          style={{
                            padding: "0.65rem 0.75rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: "#c84b2f",
                                letterSpacing: "0.06em",
                                marginBottom: 3,
                              }}
                            >
                              BEFORE
                            </div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                color: "#6b6560",
                                lineHeight: 1.55,
                                background: "rgba(200,75,47,0.05)",
                                padding: "0.4rem 0.6rem",
                                borderRadius: 2,
                                borderLeft: "2px solid #c84b2f",
                              }}
                            >
                              {rw.original}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: "#2d7a4f",
                                letterSpacing: "0.06em",
                                marginBottom: 3,
                              }}
                            >
                              AFTER
                            </div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                color: "var(--rv-ink)",
                                lineHeight: 1.55,
                                background: "rgba(45,122,79,0.05)",
                                padding: "0.4rem 0.6rem",
                                borderRadius: 2,
                                borderLeft: "2px solid #2d7a4f",
                              }}
                            >
                              {rw.optimized}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: "var(--rv-muted)",
                              fontStyle: "italic",
                              lineHeight: 1.5,
                            }}
                          >
                            💡 {rw.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                Match Resume to Job
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Paste a job description and get a match score, keyword gap
                analysis, and one-click section rewrites.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        color: "var(--rv-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function TargetIcon({ white = false }: { white?: boolean }) {
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
      <circle cx="8" cy="8" r="3.5" />
      <circle cx="8" cy="8" r="1" fill={white ? "#fff" : "var(--rv-accent)"} />
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
