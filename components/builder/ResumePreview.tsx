// "use client";

// import { COLOR_SCHEMES } from "@/lib/resume-constants";
// import type {
//   ResumeData,
//   ResumeSection,
//   PersonalInfo,
//   SummaryContent,
//   ExperienceItem,
//   EducationItem,
//   SkillsContent,
//   ProjectItem,
//   CertificationItem,
// } from "@/types/resume";
// import Image from "next/image";

// function getAccent(schemeId?: string): string {
//   return COLOR_SCHEMES.find((s) => s.id === schemeId)?.accent ?? "#c84b2f";
// }
// function getName(resume: ResumeData): string {
//   return resume.personalInfo?.fullName || "Your Name";
// }
// function getJobTitle(resume: ResumeData): string {
//   return resume.personalInfo?.jobTitle || resume.jobTitle || "";
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

// // ── Contact line with icons ──────────────────────────────
// function ContactLine({ info }: { info: PersonalInfo | null }) {
//   if (!info) return null;

//   const items: { icon: React.ReactNode; text: string }[] = [];

//   if (info.email) items.push({ icon: <EmailIcon />, text: info.email });
//   if (info.phone) items.push({ icon: <PhoneIcon />, text: info.phone });
//   if (info.showAddress && info.address)
//     items.push({ icon: <AddressIcon />, text: info.address });
//   if (info.linkedin)
//     items.push({ icon: <LinkedInIcon />, text: info.linkedin });
//   if (info.github) items.push({ icon: <GitHubIcon />, text: info.github });
//   if (info.showWebsite && info.website)
//     items.push({ icon: <WebsiteIcon />, text: info.website });

//   if (!items.length) return null;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: "0.15rem 0.75rem",
//         marginTop: "0.3rem",
//       }}
//     >
//       {items.map((item, i) => (
//         <span
//           key={i}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: "0.25rem",
//             fontSize: "0.58rem",
//             color: "#8a8478",
//             lineHeight: 1.6,
//           }}
//         >
//           {item.icon}
//           {item.text}
//         </span>
//       ))}
//     </div>
//   );
// }

// // ── Contact icons (inline SVG, 8×8 px) ───────────────────

// const iconStyle: React.CSSProperties = {
//   width: 7,
//   height: 7,
//   stroke: "#8a8478",
//   fill: "none",
//   strokeWidth: 1.5,
//   flexShrink: 0,
//   display: "inline-block",
// };

// function EmailIcon() {
//   return (
//     <svg viewBox="0 0 16 16" style={iconStyle}>
//       <rect x="1" y="3" width="14" height="10" rx="1.5" />
//       <path d="M1 4l7 5 7-5" />
//     </svg>
//   );
// }

// function PhoneIcon() {
//   return (
//     <svg viewBox="0 0 16 16" style={iconStyle}>
//       <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
//     </svg>
//   );
// }

// function AddressIcon() {
//   return (
//     <svg viewBox="0 0 16 16" style={iconStyle}>
//       <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
//       <circle cx="8" cy="6" r="1.5" />
//     </svg>
//   );
// }

// function LinkedInIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{ ...iconStyle, stroke: "none", fill: "#8a8478" }}
//     >
//       <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-3/4-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
//     </svg>
//   );
// }

// function GitHubIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{ ...iconStyle, stroke: "none", fill: "#8a8478" }}
//     >
//       <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
//     </svg>
//   );
// }

// function WebsiteIcon() {
//   return (
//     <svg viewBox="0 0 16 16" style={iconStyle}>
//       <circle cx="8" cy="8" r="7" />
//       <path d="M1 8h14M8 1a10 10 0 0 0 0 14M8 1a10 10 0 0 1 0 14" />
//     </svg>
//   );
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
//         {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
//           <Image
//             src={resume.personalInfo.photoUrl}
//             alt="Profile"
//             style={{
//               width: 52,
//               height: 52,
//               borderRadius: "50%",
//               objectFit: "cover",
//               float: "right",
//               marginLeft: 12,
//             }}
//             width={52}
//             height={52}
//           />
//         )}
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
//           {resume.personalInfo?.fullName || "Your Name"}
//         </h1>
//         {(resume.personalInfo?.jobTitle || resume.jobTitle) && (
//           <p
//             style={{
//               fontSize: "0.65rem",
//               textTransform: "uppercase",
//               letterSpacing: "0.1em",
//               color: accent,
//             }}
//           >
//             {resume.personalInfo?.jobTitle || resume.jobTitle}
//           </p>
//         )}
//         <ContactLine info={resume.personalInfo} />
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
//           {resume.personalInfo?.fullName || "Your Name"}
//         </h1>
//         {(resume.personalInfo?.jobTitle || resume.jobTitle) && (
//           <p
//             style={{
//               fontSize: "0.67rem",
//               color: "#8a8478",
//               letterSpacing: "0.06em",
//             }}
//           >
//             {resume.personalInfo?.jobTitle || resume.jobTitle}
//           </p>
//         )}
//         <ContactLine info={resume.personalInfo} />
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//             {getJobTitle(resume)}
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p
//             style={{
//               fontSize: "0.72rem",
//               color: accent,
//               fontWeight: 600,
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             {getJobTitle(resume)}
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p style={{ fontSize: "0.65rem", color: "#8a8478" }}>
//             {getJobTitle(resume)}
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
//             {getName(resume)}
//           </h1>
//           {getJobTitle(resume) && (
//             <p
//               style={{
//                 fontSize: "0.65rem",
//                 color: "rgba(255,255,255,0.75)",
//                 letterSpacing: "0.06em",
//               }}
//             >
//               {getJobTitle(resume)}
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p
//             style={{
//               fontSize: "0.7rem",
//               color: "#8a8478",
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//             }}
//           >
//             {getJobTitle(resume)}
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
//             {getName(resume)}
//           </h1>
//           {getJobTitle(resume) && (
//             <p style={{ fontSize: "0.67rem", color: accent, fontWeight: 500 }}>
//               {getJobTitle(resume)}
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
//             {getJobTitle(resume)}
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
//           {getName(resume)}
//         </h1>
//         {getJobTitle(resume) && (
//           <p
//             style={{
//               fontSize: "0.7rem",
//               color: accent,
//               fontWeight: 600,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//             }}
//           >
//             {getJobTitle(resume)}
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

import { COLOR_SCHEMES } from "@/lib/resume-constants";
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
  LanguageItem,
} from "@/types/resume";

function getAccent(schemeId?: string): string {
  return COLOR_SCHEMES.find((s) => s.id === schemeId)?.accent ?? "#c84b2f";
}
function getName(resume: ResumeData): string {
  return resume.personalInfo?.fullName || "Your Name";
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
      const raw = section.content;
      const c: SkillsContent =
        raw &&
        typeof raw === "object" &&
        !Array.isArray(raw) &&
        "categories" in raw
          ? (raw as SkillsContent)
          : { categories: [] };
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
    case "languages": {
      const items = section.content as LanguageItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "0.15rem 1rem" }}
          >
            {items.map((lang) => (
              <span key={lang.id} style={{ fontSize: fs.body, color: body }}>
                <span style={{ fontWeight: 600, color: ink }}>
                  {lang.language}
                </span>
                {lang.proficiency && (
                  <span style={{ color: muted }}>
                    {" · "}
                    {lang.proficiency}
                  </span>
                )}
              </span>
            ))}
          </div>
        </SectionBlock>
      );
    }
    default:
      return null;
  }
}

// ── Contact line with icons ──────────────────────────────
function ContactLine({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  const items: { icon: React.ReactNode; text: string }[] = [];

  if (info.email) items.push({ icon: <EmailIcon />, text: info.email });
  if (info.phone) items.push({ icon: <PhoneIcon />, text: info.phone });
  if (info.showAddress && info.address)
    items.push({ icon: <AddressIcon />, text: info.address });
  if (info.linkedin)
    items.push({ icon: <LinkedInIcon />, text: info.linkedin });
  if (info.github) items.push({ icon: <GitHubIcon />, text: info.github });
  if (info.showWebsite && info.website)
    items.push({ icon: <WebsiteIcon />, text: info.website });

  if (!items.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.15rem 0.75rem",
        marginTop: "0.3rem",
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.58rem",
            color: "#8a8478",
            lineHeight: 1.6,
          }}
        >
          {item.icon}
          {item.text}
        </span>
      ))}
    </div>
  );
}

// ── Contact icons (inline SVG, 8×8 px) ───────────────────

const iconStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  stroke: "#8a8478",
  fill: "none",
  strokeWidth: 1.5,
  flexShrink: 0,
  display: "inline-block",
};

function EmailIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconStyle}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconStyle}>
      <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconStyle}>
      <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{ ...iconStyle, stroke: "none", fill: "#8a8478" }}
    >
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-3/4-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{ ...iconStyle, stroke: "none", fill: "#8a8478" }}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconStyle}>
      <circle cx="8" cy="8" r="7" />
      <path d="M1 8h14M8 1a10 10 0 0 0 0 14M8 1a10 10 0 0 1 0 14" />
    </svg>
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
          <img
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
          {resume.personalInfo?.fullName || "Your Name"}
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
          {resume.personalInfo?.fullName || "Your Name"}
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
