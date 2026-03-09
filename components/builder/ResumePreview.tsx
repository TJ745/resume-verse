// "use client";

// import type {
//   ResumeData,
//   ResumeSection,
//   SummaryContent,
//   ExperienceItem,
//   EducationItem,
//   SkillsContent,
//   ProjectItem,
//   CertificationItem,
// } from "@/types/resume";

// interface PreviewProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// export default function ResumePreview({ resume, sections }: PreviewProps) {
//   const sorted = [...sections].sort((a, b) => a.order - b.order);

//   switch (resume.template) {
//     case "classic":
//       return <ClassicTemplate resume={resume} sections={sorted} />;
//     case "minimal":
//       return <MinimalTemplate resume={resume} sections={sorted} />;
//     default:
//       return <ModernTemplate resume={resume} sections={sorted} />;
//   }
// }

// // ── Shared section renderers ──────────────────────────────

// function SectionBlock({ children }: { children: React.ReactNode }) {
//   return <div style={{ marginBottom: "1.25rem" }}>{children}</div>;
// }

// function renderSection(section: ResumeSection, template: string) {
//   const headingStyle: React.CSSProperties =
//     template === "modern"
//       ? {
//           fontSize: "0.6rem",
//           fontWeight: 700,
//           letterSpacing: "0.12em",
//           textTransform: "uppercase",
//           color: "#c84b2f",
//           borderBottom: "1px solid #c84b2f",
//           paddingBottom: "0.2rem",
//           marginBottom: "0.6rem",
//         }
//       : template === "classic"
//         ? {
//             fontSize: "0.65rem",
//             fontWeight: 700,
//             letterSpacing: "0.1em",
//             textTransform: "uppercase",
//             color: "#0f0e0d",
//             borderBottom: "2px solid #0f0e0d",
//             paddingBottom: "0.2rem",
//             marginBottom: "0.6rem",
//           }
//         : {
//             fontSize: "0.6rem",
//             fontWeight: 700,
//             letterSpacing: "0.12em",
//             textTransform: "uppercase",
//             color: "#8a8478",
//             marginBottom: "0.6rem",
//           };

//   switch (section.type) {
//     case "summary": {
//       const c = section.content as SummaryContent;
//       if (!c.text) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           <p style={{ fontSize: "0.7rem", lineHeight: 1.6, color: "#3a3835" }}>
//             {c.text}
//           </p>
//         </SectionBlock>
//       );
//     }

//     case "experience": {
//       const items = section.content as ExperienceItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((exp) => (
//             <div key={exp.id} style={{ marginBottom: "0.75rem" }}>
//               <div className="flex justify-between items-baseline">
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     fontWeight: 600,
//                     color: "#0f0e0d",
//                   }}
//                 >
//                   {exp.role}
//                 </span>
//                 <span style={{ fontSize: "0.62rem", color: "#8a8478" }}>
//                   {exp.startDate}
//                   {exp.startDate &&
//                     (exp.current
//                       ? " – Present"
//                       : exp.endDate
//                         ? ` – ${exp.endDate}`
//                         : "")}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.67rem",
//                   color: "#8a8478",
//                   marginBottom: "0.3rem",
//                 }}
//               >
//                 {exp.company}
//                 {exp.location ? ` · ${exp.location}` : ""}
//               </div>
//               {exp.bullets.filter(Boolean).map((b, i) => (
//                 <div
//                   key={i}
//                   className="flex gap-1.5"
//                   style={{ marginBottom: "0.15rem" }}
//                 >
//                   <span
//                     style={{
//                       color: "#c84b2f",
//                       fontSize: "0.6rem",
//                       flexShrink: 0,
//                       paddingTop: "0.1rem",
//                     }}
//                   >
//                     •
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "0.67rem",
//                       lineHeight: 1.55,
//                       color: "#3a3835",
//                     }}
//                   >
//                     {b}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }

//     case "education": {
//       const items = section.content as EducationItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((edu) => (
//             <div key={edu.id} style={{ marginBottom: "0.6rem" }}>
//               <div className="flex justify-between items-baseline">
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     fontWeight: 600,
//                     color: "#0f0e0d",
//                   }}
//                 >
//                   {edu.institution}
//                 </span>
//                 <span style={{ fontSize: "0.62rem", color: "#8a8478" }}>
//                   {edu.startDate}
//                   {edu.endDate ? ` – ${edu.endDate}` : ""}
//                 </span>
//               </div>
//               <div style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//                 {edu.degree}
//                 {edu.field ? ` in ${edu.field}` : ""}
//                 {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
//               </div>
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }

//     case "skills": {
//       const c = section.content as SkillsContent;
//       if (!c.categories.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {c.categories.map((cat) => (
//             <div key={cat.id} style={{ marginBottom: "0.35rem" }}>
//               {cat.name && (
//                 <span
//                   style={{
//                     fontSize: "0.67rem",
//                     fontWeight: 600,
//                     color: "#0f0e0d",
//                   }}
//                 >
//                   {cat.name}:{" "}
//                 </span>
//               )}
//               <span style={{ fontSize: "0.67rem", color: "#3a3835" }}>
//                 {cat.skills}
//               </span>
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }

//     case "projects": {
//       const items = section.content as ProjectItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((proj) => (
//             <div key={proj.id} style={{ marginBottom: "0.6rem" }}>
//               <div className="flex justify-between items-baseline">
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     fontWeight: 600,
//                     color: "#0f0e0d",
//                   }}
//                 >
//                   {proj.name}
//                 </span>
//                 {proj.technologies && (
//                   <span style={{ fontSize: "0.6rem", color: "#8a8478" }}>
//                     {proj.technologies}
//                   </span>
//                 )}
//               </div>
//               {proj.description && (
//                 <p
//                   style={{
//                     fontSize: "0.67rem",
//                     lineHeight: 1.55,
//                     color: "#3a3835",
//                     marginTop: "0.15rem",
//                   }}
//                 >
//                   {proj.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }

//     case "certifications": {
//       const items = section.content as CertificationItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((cert) => (
//             <div
//               key={cert.id}
//               className="flex justify-between items-baseline"
//               style={{ marginBottom: "0.4rem" }}
//             >
//               <div>
//                 <span
//                   style={{
//                     fontSize: "0.72rem",
//                     fontWeight: 600,
//                     color: "#0f0e0d",
//                   }}
//                 >
//                   {cert.name}
//                 </span>
//                 {cert.issuer && (
//                   <span style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//                     {" "}
//                     · {cert.issuer}
//                   </span>
//                 )}
//               </div>
//               {cert.date && (
//                 <span style={{ fontSize: "0.62rem", color: "#8a8478" }}>
//                   {cert.date}
//                 </span>
//               )}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }

//     default:
//       return null;
//   }
// }

// // ── Modern template ───────────────────────────────────────

// function ModernTemplate({ resume, sections }: PreviewProps) {
//   return (
//     <div
//       style={{
//         fontFamily: "'DM Sans', sans-serif",
//         background: "#fdfcfa",
//         padding: "2rem",
//         minHeight: "100%",
//         fontSize: "11px",
//       }}
//     >
//       {/* Header accent */}
//       <div
//         style={{
//           height: 3,
//           background: "#c84b2f",
//           marginBottom: "1.25rem",
//           marginLeft: "-2rem",
//           marginRight: "-2rem",
//           marginTop: "-2rem",
//         }}
//       />

//       {/* Name + title */}
//       <div style={{ marginBottom: "1.25rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.6rem",
//             color: "#0f0e0d",
//             lineHeight: 1.1,
//             letterSpacing: "-0.02em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.65rem",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//               color: "#c84b2f",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>

//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, "modern")}</div>
//       ))}
//     </div>
//   );
// }

// // ── Classic template ──────────────────────────────────────

// function ClassicTemplate({ resume, sections }: PreviewProps) {
//   return (
//     <div
//       style={{
//         fontFamily: "'DM Sans', sans-serif",
//         background: "#fdfcfa",
//         padding: "2rem",
//         minHeight: "100%",
//         fontSize: "11px",
//       }}
//     >
//       {/* Centered header */}
//       <div
//         style={{
//           textAlign: "center",
//           marginBottom: "1.25rem",
//           paddingBottom: "1rem",
//           borderBottom: "2px solid #0f0e0d",
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.7rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.67rem",
//               color: "#8a8478",
//               letterSpacing: "0.06em",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>

//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, "classic")}</div>
//       ))}
//     </div>
//   );
// }

// // ── Minimal template ──────────────────────────────────────

// function MinimalTemplate({ resume, sections }: PreviewProps) {
//   const leftSections = sections.filter((s) =>
//     ["skills", "certifications", "education"].includes(s.type),
//   );
//   const rightSections = sections.filter(
//     (s) => !["skills", "certifications", "education"].includes(s.type),
//   );

//   return (
//     <div
//       style={{
//         fontFamily: "'DM Sans', sans-serif",
//         background: "#fdfcfa",
//         padding: "1.75rem",
//         minHeight: "100%",
//         fontSize: "11px",
//       }}
//     >
//       {/* Header */}
//       <div style={{ marginBottom: "1.25rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.6rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.15rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//             {resume.jobTitle}
//           </p>
//         )}
//         <div
//           style={{ height: 1, background: "#d9d4c7", marginTop: "0.75rem" }}
//         />
//       </div>

//       {/* Two-column layout */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 2fr",
//           gap: "1.5rem",
//         }}
//       >
//         <div>
//           {leftSections.map((s) => (
//             <div key={s.id}>{renderSection(s, "minimal")}</div>
//           ))}
//         </div>
//         <div>
//           {rightSections.map((s) => (
//             <div key={s.id}>{renderSection(s, "minimal")}</div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { COLOR_SCHEMES } from "./BuilderTopbar";
// import type {
//   ResumeData,
//   ResumeSection,
//   SummaryContent,
//   ExperienceItem,
//   EducationItem,
//   SkillsContent,
//   ProjectItem,
//   CertificationItem,
// } from "@/types/resume";

// function getAccent(schemeId?: string): string {
//   return COLOR_SCHEMES.find((s) => s.id === schemeId)?.accent ?? "#c84b2f";
// }

// interface PreviewProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// export default function ResumePreview({ resume, sections }: PreviewProps) {
//   const sorted = [...sections].sort((a, b) => a.order - b.order);
//   const accent = getAccent(resume.colorScheme);

//   switch (resume.template) {
//     case "classic":
//       return (
//         <ClassicTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "minimal":
//       return (
//         <MinimalTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "executive":
//       return (
//         <ExecutiveTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "compact":
//       return (
//         <CompactTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "creative":
//       return (
//         <CreativeTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "elegant":
//       return (
//         <ElegantTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "technical":
//       return (
//         <TechnicalTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//     case "chronological":
//       return (
//         <ChronologicalTemplate
//           resume={resume}
//           sections={sorted}
//           accent={accent}
//         />
//       );
//     case "bold":
//       return <BoldTemplate resume={resume} sections={sorted} accent={accent} />;
//     default:
//       return (
//         <ModernTemplate resume={resume} sections={sorted} accent={accent} />
//       );
//   }
// }

// // ── Shared types & helpers ────────────────────────────────

// interface TplProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
//   accent: string;
// }

// function SectionBlock({ children }: { children: React.ReactNode }) {
//   return <div style={{ marginBottom: "1.1rem" }}>{children}</div>;
// }

// function renderSection(
//   section: ResumeSection,
//   headingStyle: React.CSSProperties,
//   accent: string,
// ) {
//   const ink = "#0f0e0d";
//   const muted = "#8a8478";
//   const body = "#3a3835";
//   const fs = { label: "0.6rem", body: "0.67rem", title: "0.72rem" };

//   switch (section.type) {
//     case "summary": {
//       const c = section.content as SummaryContent;
//       if (!c.text) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           <p style={{ fontSize: fs.body, lineHeight: 1.6, color: body }}>
//             {c.text}
//           </p>
//         </SectionBlock>
//       );
//     }
//     case "experience": {
//       const items = section.content as ExperienceItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((exp) => (
//             <div key={exp.id} style={{ marginBottom: "0.7rem" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span
//                   style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
//                 >
//                   {exp.role}
//                 </span>
//                 <span style={{ fontSize: fs.label, color: muted }}>
//                   {exp.startDate}
//                   {exp.startDate &&
//                     (exp.current
//                       ? " – Present"
//                       : exp.endDate
//                         ? ` – ${exp.endDate}`
//                         : "")}
//                 </span>
//               </div>
//               <div
//                 style={{
//                   fontSize: fs.body,
//                   color: muted,
//                   marginBottom: "0.25rem",
//                 }}
//               >
//                 {exp.company}
//                 {exp.location ? ` · ${exp.location}` : ""}
//               </div>
//               {exp.bullets.filter(Boolean).map((b, i) => (
//                 <div
//                   key={i}
//                   style={{ display: "flex", gap: 5, marginBottom: "0.1rem" }}
//                 >
//                   <span
//                     style={{
//                       color: accent,
//                       fontSize: fs.label,
//                       flexShrink: 0,
//                       paddingTop: 1,
//                     }}
//                   >
//                     •
//                   </span>
//                   <span
//                     style={{ fontSize: fs.body, lineHeight: 1.55, color: body }}
//                   >
//                     {b}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }
//     case "education": {
//       const items = section.content as EducationItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((edu) => (
//             <div key={edu.id} style={{ marginBottom: "0.55rem" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span
//                   style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
//                 >
//                   {edu.institution}
//                 </span>
//                 <span style={{ fontSize: fs.label, color: muted }}>
//                   {edu.startDate}
//                   {edu.endDate ? ` – ${edu.endDate}` : ""}
//                 </span>
//               </div>
//               <div style={{ fontSize: fs.body, color: muted }}>
//                 {edu.degree}
//                 {edu.field ? ` in ${edu.field}` : ""}
//                 {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
//               </div>
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }
//     case "skills": {
//       const c = section.content as SkillsContent;
//       if (!c.categories.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {c.categories.map((cat) => (
//             <div key={cat.id} style={{ marginBottom: "0.3rem" }}>
//               {cat.name && (
//                 <span
//                   style={{ fontSize: fs.body, fontWeight: 600, color: ink }}
//                 >
//                   {cat.name}:{" "}
//                 </span>
//               )}
//               <span style={{ fontSize: fs.body, color: body }}>
//                 {cat.skills}
//               </span>
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }
//     case "projects": {
//       const items = section.content as ProjectItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((proj) => (
//             <div key={proj.id} style={{ marginBottom: "0.55rem" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span
//                   style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
//                 >
//                   {proj.name}
//                 </span>
//                 {proj.technologies && (
//                   <span style={{ fontSize: fs.label, color: muted }}>
//                     {proj.technologies}
//                   </span>
//                 )}
//               </div>
//               {proj.description && (
//                 <p
//                   style={{
//                     fontSize: fs.body,
//                     lineHeight: 1.55,
//                     color: body,
//                     marginTop: "0.1rem",
//                   }}
//                 >
//                   {proj.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }
//     case "certifications": {
//       const items = section.content as CertificationItem[];
//       if (!items.length) return null;
//       return (
//         <SectionBlock>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((cert) => (
//             <div
//               key={cert.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "baseline",
//                 marginBottom: "0.35rem",
//               }}
//             >
//               <div>
//                 <span
//                   style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
//                 >
//                   {cert.name}
//                 </span>
//                 {cert.issuer && (
//                   <span style={{ fontSize: fs.body, color: muted }}>
//                     {" "}
//                     · {cert.issuer}
//                   </span>
//                 )}
//               </div>
//               {cert.date && (
//                 <span style={{ fontSize: fs.label, color: muted }}>
//                   {cert.date}
//                 </span>
//               )}
//             </div>
//           ))}
//         </SectionBlock>
//       );
//     }
//     default:
//       return null;
//   }
// }

// const WRAP = {
//   fontFamily: "'DM Sans', sans-serif",
//   background: "#fdfcfa",
//   padding: "2rem",
//   minHeight: "100%",
//   fontSize: "11px",
// };

// // ── 1. Modern ─────────────────────────────────────────────
// function ModernTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     color: accent,
//     borderBottom: `1px solid ${accent}`,
//     paddingBottom: "0.2rem",
//     marginBottom: "0.6rem",
//   };
//   return (
//     <div style={WRAP}>
//       <div
//         style={{ height: 3, background: accent, margin: "-2rem -2rem 1.25rem" }}
//       />
//       <div style={{ marginBottom: "1.25rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.6rem",
//             color: "#0f0e0d",
//             lineHeight: 1.1,
//             letterSpacing: "-0.02em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.65rem",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//               color: accent,
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 2. Classic ────────────────────────────────────────────
// function ClassicTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.65rem",
//     fontWeight: 700,
//     letterSpacing: "0.1em",
//     textTransform: "uppercase",
//     color: "#0f0e0d",
//     borderBottom: "2px solid #0f0e0d",
//     paddingBottom: "0.2rem",
//     marginBottom: "0.6rem",
//   };
//   return (
//     <div style={WRAP}>
//       <div
//         style={{
//           textAlign: "center",
//           marginBottom: "1.25rem",
//           paddingBottom: "1rem",
//           borderBottom: "2px solid #0f0e0d",
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.7rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.67rem",
//               color: "#8a8478",
//               letterSpacing: "0.06em",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 3. Minimal ────────────────────────────────────────────
// function MinimalTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     color: "#8a8478",
//     marginBottom: "0.6rem",
//   };
//   const left = sections.filter((s) =>
//     ["skills", "certifications", "education"].includes(s.type),
//   );
//   const right = sections.filter(
//     (s) => !["skills", "certifications", "education"].includes(s.type),
//   );
//   return (
//     <div style={{ ...WRAP, padding: "1.75rem" }}>
//       <div style={{ marginBottom: "1.25rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.6rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.15rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//             {resume.jobTitle}
//           </p>
//         )}
//         <div
//           style={{ height: 1, background: "#d9d4c7", marginTop: "0.75rem" }}
//         />
//       </div>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 2fr",
//           gap: "1.5rem",
//         }}
//       >
//         <div>
//           {left.map((s) => (
//             <div key={s.id}>{renderSection(s, heading, accent)}</div>
//           ))}
//         </div>
//         <div>
//           {right.map((s) => (
//             <div key={s.id}>{renderSection(s, heading, accent)}</div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── 4. Executive ──────────────────────────────────────────
// function ExecutiveTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.15em",
//     textTransform: "uppercase",
//     color: "#0f0e0d",
//     marginBottom: "0.5rem",
//     paddingBottom: "0.2rem",
//     borderBottom: `2px solid ${accent}`,
//   };
//   return (
//     <div style={{ ...WRAP, padding: "2.5rem" }}>
//       <div
//         style={{
//           marginBottom: "1.75rem",
//           paddingBottom: "1.25rem",
//           borderBottom: `3px solid ${accent}`,
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.9rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.3rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.72rem",
//               color: accent,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 5. Compact ────────────────────────────────────────────
// function CompactTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.58rem",
//     fontWeight: 700,
//     letterSpacing: "0.1em",
//     textTransform: "uppercase",
//     color: accent,
//     borderBottom: `1px solid ${accent}`,
//     paddingBottom: "0.15rem",
//     marginBottom: "0.4rem",
//   };
//   return (
//     <div style={{ ...WRAP, fontSize: "10px", padding: "1.5rem" }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//           marginBottom: "1rem",
//           paddingBottom: "0.6rem",
//           borderBottom: `1px solid #d9d4c7`,
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.4rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: "0.65rem", color: "#8a8478" }}>
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 6. Creative ───────────────────────────────────────────
// function CreativeTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     color: "#ffffff",
//     marginBottom: "0.6rem",
//   };
//   const headingRight: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     color: accent,
//     marginBottom: "0.6rem",
//   };
//   const left = sections.filter((s) =>
//     ["skills", "certifications", "education"].includes(s.type),
//   );
//   const right = sections.filter(
//     (s) => !["skills", "certifications", "education"].includes(s.type),
//   );
//   return (
//     <div
//       style={{
//         fontFamily: "'DM Sans', sans-serif",
//         display: "flex",
//         minHeight: "100%",
//         fontSize: "11px",
//       }}
//     >
//       {/* Sidebar */}
//       <div
//         style={{
//           width: "38%",
//           background: accent,
//           padding: "2rem 1.25rem",
//           flexShrink: 0,
//         }}
//       >
//         <div style={{ marginBottom: "1.5rem" }}>
//           <h1
//             style={{
//               fontFamily: "'Instrument Serif', serif",
//               fontSize: "1.4rem",
//               color: "#ffffff",
//               lineHeight: 1.1,
//               marginBottom: "0.3rem",
//             }}
//           >
//             {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//           </h1>
//           {resume.jobTitle && (
//             <p
//               style={{
//                 fontSize: "0.65rem",
//                 color: "rgba(255,255,255,0.75)",
//                 letterSpacing: "0.06em",
//               }}
//             >
//               {resume.jobTitle}
//             </p>
//           )}
//         </div>
//         {left.map((s) => (
//           <div key={s.id} style={{ color: "#fff" }}>
//             {renderSection(s, heading, "#ffffff")}
//           </div>
//         ))}
//       </div>
//       {/* Main */}
//       <div style={{ flex: 1, padding: "2rem 1.5rem", background: "#fdfcfa" }}>
//         {right.map((s) => (
//           <div key={s.id}>{renderSection(s, headingRight, accent)}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── 7. Elegant ────────────────────────────────────────────
// function ElegantTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontFamily: "'Instrument Serif', serif",
//     fontSize: "0.85rem",
//     fontStyle: "italic",
//     color: accent,
//     borderBottom: `1px solid #d9d4c7`,
//     paddingBottom: "0.25rem",
//     marginBottom: "0.6rem",
//   };
//   return (
//     <div style={{ ...WRAP, padding: "2.5rem 3rem" }}>
//       <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "2rem",
//             color: "#0f0e0d",
//             letterSpacing: "0.04em",
//             marginBottom: "0.25rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.7rem",
//               color: "#8a8478",
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//         <div
//           style={{
//             width: 48,
//             height: 1,
//             background: accent,
//             margin: "0.75rem auto 0",
//           }}
//         />
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 8. Technical ──────────────────────────────────────────
// function TechnicalTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.14em",
//     textTransform: "uppercase",
//     color: "#0f0e0d",
//     background: "#f5f3ef",
//     padding: "0.2rem 0.5rem",
//     marginBottom: "0.6rem",
//     borderLeft: `3px solid ${accent}`,
//   };
//   return (
//     <div style={{ ...WRAP, padding: "1.75rem" }}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "1rem",
//           marginBottom: "1.25rem",
//           paddingBottom: "0.75rem",
//           borderBottom: "1px solid #d9d4c7",
//         }}
//       >
//         <div
//           style={{ width: 4, height: 42, background: accent, flexShrink: 0 }}
//         />
//         <div>
//           <h1
//             style={{
//               fontFamily: "'Instrument Serif', serif",
//               fontSize: "1.55rem",
//               color: "#0f0e0d",
//               letterSpacing: "-0.02em",
//               marginBottom: "0.1rem",
//             }}
//           >
//             {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//           </h1>
//           {resume.jobTitle && (
//             <p style={{ fontSize: "0.67rem", color: accent, fontWeight: 500 }}>
//               {resume.jobTitle}
//             </p>
//           )}
//         </div>
//       </div>
//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, heading, accent)}</div>
//       ))}
//     </div>
//   );
// }

// // ── 9. Chronological ─────────────────────────────────────
// function ChronologicalTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.6rem",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     color: accent,
//     marginBottom: "0.6rem",
//   };
//   return (
//     <div style={{ ...WRAP, padding: "2rem" }}>
//       <div style={{ marginBottom: "1.5rem" }}>
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "1.65rem",
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//             {resume.jobTitle}
//           </p>
//         )}
//         <div style={{ display: "flex", gap: 4, marginTop: "0.5rem" }}>
//           <div style={{ width: 24, height: 3, background: accent }} />
//           <div
//             style={{ width: 8, height: 3, background: accent, opacity: 0.4 }}
//           />
//           <div
//             style={{ width: 4, height: 3, background: accent, opacity: 0.2 }}
//           />
//         </div>
//       </div>
//       <div style={{ borderLeft: `2px solid #e8e4dc`, paddingLeft: "1rem" }}>
//         {sections.map((s) => (
//           <div key={s.id} style={{ position: "relative" }}>
//             <div
//               style={{
//                 position: "absolute",
//                 left: "-1.35rem",
//                 top: "0.15rem",
//                 width: 8,
//                 height: 8,
//                 borderRadius: "50%",
//                 background: accent,
//                 border: "2px solid #fdfcfa",
//               }}
//             />
//             {renderSection(s, heading, accent)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── 10. Bold ──────────────────────────────────────────────
// function BoldTemplate({ resume, sections, accent }: TplProps) {
//   const heading: React.CSSProperties = {
//     fontSize: "0.62rem",
//     fontWeight: 800,
//     letterSpacing: "0.14em",
//     textTransform: "uppercase",
//     color: "#0f0e0d",
//     marginBottom: "0.55rem",
//     paddingBottom: "0.2rem",
//     borderBottom: `2px solid #0f0e0d`,
//   };
//   return (
//     <div style={{ ...WRAP, padding: "0" }}>
//       {/* Bold header block */}
//       <div
//         style={{
//           background: "#0f0e0d",
//           padding: "1.75rem 2rem",
//           marginBottom: "0",
//         }}
//       >
//         <h1
//           style={{
//             fontFamily: "'Instrument Serif', serif",
//             fontSize: "2rem",
//             color: "#ffffff",
//             letterSpacing: "-0.01em",
//             marginBottom: "0.2rem",
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: "0.7rem",
//               color: accent,
//               fontWeight: 600,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//             }}
//           >
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>
//       {/* Accent strip */}
//       <div style={{ height: 4, background: accent }} />
//       <div style={{ padding: "1.5rem 2rem" }}>
//         {sections.map((s) => (
//           <div key={s.id}>{renderSection(s, heading, accent)}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { COLOR_SCHEMES } from "./BuilderTopbar";
import type {
  ResumeData,
  ResumeSection,
  PersonalInfo,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillsContent,
  ProjectItem,
  CertificationItem,
} from "@/types/resume";

function getAccent(schemeId?: string): string {
  return COLOR_SCHEMES.find((s) => s.id === schemeId)?.accent ?? "#c84b2f";
}
function getName(resume: ResumeData): string {
  return (
    resume.personalInfo?.fullName ||
    (resume.title !== "Untitled Resume" ? resume.title : "") ||
    "Your Name"
  );
}
function getJobTitle(resume: ResumeData): string {
  return resume.personalInfo?.jobTitle || resume.jobTitle || "";
}

interface PreviewProps {
  resume: ResumeData;
  sections: ResumeSection[];
}

export default function ResumePreview({ resume, sections }: PreviewProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const accent = getAccent(resume.colorScheme);

  switch (resume.template) {
    case "classic":
      return (
        <ClassicTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "minimal":
      return (
        <MinimalTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "executive":
      return (
        <ExecutiveTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "compact":
      return (
        <CompactTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "creative":
      return (
        <CreativeTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "elegant":
      return (
        <ElegantTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "technical":
      return (
        <TechnicalTemplate resume={resume} sections={sorted} accent={accent} />
      );
    case "chronological":
      return (
        <ChronologicalTemplate
          resume={resume}
          sections={sorted}
          accent={accent}
        />
      );
    case "bold":
      return <BoldTemplate resume={resume} sections={sorted} accent={accent} />;
    default:
      return (
        <ModernTemplate resume={resume} sections={sorted} accent={accent} />
      );
  }
}

// ── Shared types & helpers ────────────────────────────────

interface TplProps {
  resume: ResumeData;
  sections: ResumeSection[];
  accent: string;
}

function SectionBlock({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: "1.1rem" }}>{children}</div>;
}

function renderSection(
  section: ResumeSection,
  headingStyle: React.CSSProperties,
  accent: string,
) {
  const ink = "#0f0e0d";
  const muted = "#8a8478";
  const body = "#3a3835";
  const fs = { label: "0.6rem", body: "0.67rem", title: "0.72rem" };

  switch (section.type) {
    case "summary": {
      const c = section.content as SummaryContent;
      if (!c.text) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          <p style={{ fontSize: fs.body, lineHeight: 1.6, color: body }}>
            {c.text}
          </p>
        </SectionBlock>
      );
    }
    case "experience": {
      const items = section.content as ExperienceItem[];
      if (!items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "0.7rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
                >
                  {exp.role}
                </span>
                <span style={{ fontSize: fs.label, color: muted }}>
                  {exp.startDate}
                  {exp.startDate &&
                    (exp.current
                      ? " – Present"
                      : exp.endDate
                        ? ` – ${exp.endDate}`
                        : "")}
                </span>
              </div>
              <div
                style={{
                  fontSize: fs.body,
                  color: muted,
                  marginBottom: "0.25rem",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 5, marginBottom: "0.1rem" }}
                >
                  <span
                    style={{
                      color: accent,
                      fontSize: fs.label,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    •
                  </span>
                  <span
                    style={{ fontSize: fs.body, lineHeight: 1.55, color: body }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "education": {
      const items = section.content as EducationItem[];
      if (!items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
                >
                  {edu.institution}
                </span>
                <span style={{ fontSize: fs.label, color: muted }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: muted }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "skills": {
      const c = section.content as SkillsContent;
      if (!c.categories.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {c.categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "0.3rem" }}>
              {cat.name && (
                <span
                  style={{ fontSize: fs.body, fontWeight: 600, color: ink }}
                >
                  {cat.name}:{" "}
                </span>
              )}
              <span style={{ fontSize: fs.body, color: body }}>
                {cat.skills}
              </span>
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "projects": {
      const items = section.content as ProjectItem[];
      if (!items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
                >
                  {proj.name}
                </span>
                {proj.technologies && (
                  <span style={{ fontSize: fs.label, color: muted }}>
                    {proj.technologies}
                  </span>
                )}
              </div>
              {proj.description && (
                <p
                  style={{
                    fontSize: fs.body,
                    lineHeight: 1.55,
                    color: body,
                    marginTop: "0.1rem",
                  }}
                >
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "certifications": {
      const items = section.content as CertificationItem[];
      if (!items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "0.35rem",
              }}
            >
              <div>
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: ink }}
                >
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span style={{ fontSize: fs.body, color: muted }}>
                    {" "}
                    · {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: fs.label, color: muted }}>
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    default:
      return null;
  }
}

// ── Contact line from personalInfo ───────────────────────
function ContactLine({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;
  const parts = [
    info.email,
    info.phone,
    info.showAddress && info.address ? info.address : null,
    info.linkedin,
    info.github,
    info.showWebsite && info.website ? info.website : null,
  ].filter(Boolean);
  if (!parts.length) return null;
  return (
    <p
      style={{
        fontSize: "0.6rem",
        color: "#8a8478",
        marginTop: "0.2rem",
        lineHeight: 1.7,
      }}
    >
      {parts.join("  ·  ")}
    </p>
  );
}

const WRAP = {
  fontFamily: "'DM Sans', sans-serif",
  background: "#fdfcfa",
  padding: "2rem",
  minHeight: "100%",
  fontSize: "11px",
};

// ── 1. Modern ─────────────────────────────────────────────
function ModernTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    borderBottom: `1px solid ${accent}`,
    paddingBottom: "0.2rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={WRAP}>
      <div
        style={{ height: 3, background: accent, margin: "-2rem -2rem 1.25rem" }}
      />
      <div style={{ marginBottom: "1.25rem" }}>
        {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
          <Image
            src={resume.personalInfo.photoUrl}
            alt="Profile"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              objectFit: "cover",
              float: "right",
              marginLeft: 12,
            }}
            width={52}
            height={52}
          />
        )}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.6rem",
            color: "#0f0e0d",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {resume.personalInfo?.fullName ||
            (resume.title !== "Untitled Resume" ? resume.title : "Your Name")}
        </h1>
        {(resume.personalInfo?.jobTitle || resume.jobTitle) && (
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: accent,
            }}
          >
            {resume.personalInfo?.jobTitle || resume.jobTitle}
          </p>
        )}
        <ContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 2. Classic ────────────────────────────────────────────
function ClassicTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    borderBottom: "2px solid #0f0e0d",
    paddingBottom: "0.2rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={WRAP}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid #0f0e0d",
        }}
      >
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.7rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {resume.personalInfo?.fullName ||
            (resume.title !== "Untitled Resume" ? resume.title : "Your Name")}
        </h1>
        {(resume.personalInfo?.jobTitle || resume.jobTitle) && (
          <p
            style={{
              fontSize: "0.67rem",
              color: "#8a8478",
              letterSpacing: "0.06em",
            }}
          >
            {resume.personalInfo?.jobTitle || resume.jobTitle}
          </p>
        )}
        <ContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 3. Minimal ────────────────────────────────────────────
function MinimalTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8a8478",
    marginBottom: "0.6rem",
  };
  const left = sections.filter((s) =>
    ["skills", "certifications", "education"].includes(s.type),
  );
  const right = sections.filter(
    (s) => !["skills", "certifications", "education"].includes(s.type),
  );
  return (
    <div style={{ ...WRAP, padding: "1.75rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.6rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.15rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
            {getJobTitle(resume)}
          </p>
        )}
        <div
          style={{ height: 1, background: "#d9d4c7", marginTop: "0.75rem" }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "1.5rem",
        }}
      >
        <div>
          {left.map((s) => (
            <div key={s.id}>{renderSection(s, heading, accent)}</div>
          ))}
        </div>
        <div>
          {right.map((s) => (
            <div key={s.id}>{renderSection(s, heading, accent)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4. Executive ──────────────────────────────────────────
function ExecutiveTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    marginBottom: "0.5rem",
    paddingBottom: "0.2rem",
    borderBottom: `2px solid ${accent}`,
  };
  return (
    <div style={{ ...WRAP, padding: "2.5rem" }}>
      <div
        style={{
          marginBottom: "1.75rem",
          paddingBottom: "1.25rem",
          borderBottom: `3px solid ${accent}`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.9rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.3rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.72rem",
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 5. Compact ────────────────────────────────────────────
function CompactTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.58rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: accent,
    borderBottom: `1px solid ${accent}`,
    paddingBottom: "0.15rem",
    marginBottom: "0.4rem",
  };
  return (
    <div style={{ ...WRAP, fontSize: "10px", padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1rem",
          paddingBottom: "0.6rem",
          borderBottom: `1px solid #d9d4c7`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.4rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.65rem", color: "#8a8478" }}>
            {getJobTitle(resume)}
          </p>
        )}
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 6. Creative ───────────────────────────────────────────
function CreativeTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#ffffff",
    marginBottom: "0.6rem",
  };
  const headingRight: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    marginBottom: "0.6rem",
  };
  const left = sections.filter((s) =>
    ["skills", "certifications", "education"].includes(s.type),
  );
  const right = sections.filter(
    (s) => !["skills", "certifications", "education"].includes(s.type),
  );
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        minHeight: "100%",
        fontSize: "11px",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "38%",
          background: accent,
          padding: "2rem 1.25rem",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "1.4rem",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "0.3rem",
            }}
          >
            {getName(resume)}
          </h1>
          {getJobTitle(resume) && (
            <p
              style={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.06em",
              }}
            >
              {getJobTitle(resume)}
            </p>
          )}
        </div>
        {left.map((s) => (
          <div key={s.id} style={{ color: "#fff" }}>
            {renderSection(s, heading, "#ffffff")}
          </div>
        ))}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: "2rem 1.5rem", background: "#fdfcfa" }}>
        {right.map((s) => (
          <div key={s.id}>{renderSection(s, headingRight, accent)}</div>
        ))}
      </div>
    </div>
  );
}

// ── 7. Elegant ────────────────────────────────────────────
function ElegantTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "0.85rem",
    fontStyle: "italic",
    color: accent,
    borderBottom: `1px solid #d9d4c7`,
    paddingBottom: "0.25rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={{ ...WRAP, padding: "2.5rem 3rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "2rem",
            color: "#0f0e0d",
            letterSpacing: "0.04em",
            marginBottom: "0.25rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.7rem",
              color: "#8a8478",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
        <div
          style={{
            width: 48,
            height: 1,
            background: accent,
            margin: "0.75rem auto 0",
          }}
        />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 8. Technical ──────────────────────────────────────────
function TechnicalTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    background: "#f5f3ef",
    padding: "0.2rem 0.5rem",
    marginBottom: "0.6rem",
    borderLeft: `3px solid ${accent}`,
  };
  return (
    <div style={{ ...WRAP, padding: "1.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #d9d4c7",
        }}
      >
        <div
          style={{ width: 4, height: 42, background: accent, flexShrink: 0 }}
        />
        <div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "1.55rem",
              color: "#0f0e0d",
              letterSpacing: "-0.02em",
              marginBottom: "0.1rem",
            }}
          >
            {getName(resume)}
          </h1>
          {getJobTitle(resume) && (
            <p style={{ fontSize: "0.67rem", color: accent, fontWeight: 500 }}>
              {getJobTitle(resume)}
            </p>
          )}
        </div>
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, heading, accent)}</div>
      ))}
    </div>
  );
}

// ── 9. Chronological ─────────────────────────────────────
function ChronologicalTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    marginBottom: "0.6rem",
  };
  return (
    <div style={{ ...WRAP, padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "1.65rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
            {getJobTitle(resume)}
          </p>
        )}
        <div style={{ display: "flex", gap: 4, marginTop: "0.5rem" }}>
          <div style={{ width: 24, height: 3, background: accent }} />
          <div
            style={{ width: 8, height: 3, background: accent, opacity: 0.4 }}
          />
          <div
            style={{ width: 4, height: 3, background: accent, opacity: 0.2 }}
          />
        </div>
      </div>
      <div style={{ borderLeft: `2px solid #e8e4dc`, paddingLeft: "1rem" }}>
        {sections.map((s) => (
          <div key={s.id} style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-1.35rem",
                top: "0.15rem",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accent,
                border: "2px solid #fdfcfa",
              }}
            />
            {renderSection(s, heading, accent)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 10. Bold ──────────────────────────────────────────────
function BoldTemplate({ resume, sections, accent }: TplProps) {
  const heading: React.CSSProperties = {
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    marginBottom: "0.55rem",
    paddingBottom: "0.2rem",
    borderBottom: `2px solid #0f0e0d`,
  };
  return (
    <div style={{ ...WRAP, padding: "0" }}>
      {/* Bold header block */}
      <div
        style={{
          background: "#0f0e0d",
          padding: "1.75rem 2rem",
          marginBottom: "0",
        }}
      >
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "2rem",
            color: "#ffffff",
            letterSpacing: "-0.01em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.7rem",
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
      </div>
      {/* Accent strip */}
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "1.5rem 2rem" }}>
        {sections.map((s) => (
          <div key={s.id}>{renderSection(s, heading, accent)}</div>
        ))}
      </div>
    </div>
  );
}
