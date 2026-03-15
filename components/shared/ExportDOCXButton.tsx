// "use client";

// import { useState } from "react";
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
//   LanguageItem,
//   AwardItem,
//   VolunteerItem,
// } from "@/types/resume";

// interface Props {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// // ── helpers ───────────────────────────────────────────────

// function hex(color: string): string {
//   return color.replace("#", "").toUpperCase();
// }

// function dateRange(start?: string, end?: string, current?: boolean): string {
//   const s = start || "";
//   const e = current ? "Present" : end || "";
//   if (!s && !e) return "";
//   if (!s) return e;
//   if (!e) return s;
//   return `${s} – ${e}`;
// }

// // ── main component ────────────────────────────────────────

// export default function ExportDOCXButton({ resume, sections }: Props) {
//   const [loading, setLoading] = useState(false);

//   async function handleExport() {
//     setLoading(true);
//     try {
//       const {
//         Document,
//         Packer,
//         Paragraph,
//         TextRun,
//         Table,
//         TableRow,
//         TableCell,
//         AlignmentType,
//         BorderStyle,
//         WidthType,
//         ShadingType,
//         LevelFormat,
//         UnderlineType,
//       } = await import("docx");

//       const accent =
//         COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ??
//         "#c84b2f";
//       const accentHex = hex(accent);
//       const sorted = [...sections].sort((a, b) => a.order - b.order);
//       const info = resume.personalInfo;
//       const name = info?.fullName || resume.title || "Resume";
//       const jobTitle = info?.jobTitle || resume.jobTitle || "";

//       // ── Shared style factories ───────────────────────────

//       const noBorder = {
//         style: BorderStyle.NONE,
//         size: 0,
//         color: "FFFFFF",
//       } as const;
//       const noBorders = {
//         top: noBorder,
//         bottom: noBorder,
//         left: noBorder,
//         right: noBorder,
//       };

//       function sectionHeading(text: string) {
//         return new Paragraph({
//           children: [
//             new TextRun({
//               text: text.toUpperCase(),
//               bold: true,
//               size: 20,
//               font: "Calibri",
//               color: accentHex,
//             }),
//           ],
//           spacing: { before: 240, after: 60 },
//           border: {
//             bottom: {
//               style: BorderStyle.SINGLE,
//               size: 4,
//               color: accentHex,
//               space: 2,
//             },
//           },
//         });
//       }

//       function bodyRun(
//         text: string,
//         opts: {
//           bold?: boolean;
//           italic?: boolean;
//           size?: number;
//           color?: string;
//         } = {},
//       ) {
//         return new TextRun({
//           text,
//           bold: opts.bold ?? false,
//           italics: opts.italic ?? false,
//           size: (opts.size ?? 10) * 2,
//           font: "Calibri",
//           color: opts.color ?? "1A1A1A",
//         });
//       }

//       function emptyLine(spaceBefore = 0) {
//         return new Paragraph({
//           children: [new TextRun("")],
//           spacing: { before: spaceBefore, after: 0 },
//         });
//       }

//       function bulletPara(text: string) {
//         return new Paragraph({
//           numbering: { reference: "resume-bullets", level: 0 },
//           children: [bodyRun(text)],
//           spacing: { before: 20, after: 20 },
//         });
//       }

//       // ── Contact line ─────────────────────────────────────

//       function buildContactLine(info: PersonalInfo): Paragraph {
//         const parts: string[] = [];
//         if (info.email) parts.push(info.email);
//         if (info.phone) parts.push(info.phone);
//         if (info.showAddress && info.address) parts.push(info.address);
//         if (info.linkedin) parts.push(info.linkedin);
//         if (info.github) parts.push(info.github);
//         if (info.showWebsite && info.website) parts.push(info.website);

//         const runs: TextRun[] = [];
//         parts.forEach((p, i) => {
//           runs.push(bodyRun(p, { size: 9, color: "555555" }));
//           if (i < parts.length - 1)
//             runs.push(bodyRun("  ·  ", { size: 9, color: "AAAAAA" }));
//         });

//         return new Paragraph({
//           children: runs,
//           alignment: AlignmentType.CENTER,
//           spacing: { before: 40, after: 0 },
//         });
//       }

//       // ── Section renderers ─────────────────────────────────

//       function renderSummary(s: ResumeSection): Paragraph[] {
//         const text = (s.content as SummaryContent)?.text ?? "";
//         if (!text.trim()) return [];
//         return [
//           sectionHeading(s.title),
//           new Paragraph({
//             children: [bodyRun(text)],
//             spacing: { before: 60, after: 60 },
//           }),
//         ];
//       }

//       function renderExperience(s: ResumeSection): Paragraph[] {
//         const items = s.content as ExperienceItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const exp of items) {
//           // Role + Company row with date right-aligned using a 2-cell table
//           const leftText = [exp.role, exp.company].filter(Boolean).join(" · ");
//           const rightText = dateRange(exp.startDate, exp.endDate, exp.current);

//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(leftText, { bold: true }),
//                 ...(exp.location
//                   ? [
//                       bodyRun(`  ${exp.location}`, {
//                         italic: true,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           if (rightText) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   bodyRun(rightText, {
//                     italic: true,
//                     size: 9,
//                     color: "777777",
//                   }),
//                 ],
//                 spacing: { before: 0, after: 40 },
//               }),
//             );
//           }
//           for (const b of exp.bullets ?? []) {
//             if (b.trim()) paras.push(bulletPara(b));
//           }
//         }
//         return paras;
//       }

//       function renderEducation(s: ResumeSection): Paragraph[] {
//         const items = s.content as EducationItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const edu of items) {
//           const degree = [edu.degree, edu.field].filter(Boolean).join(", ");
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(edu.institution, { bold: true }),
//                 ...(degree
//                   ? [bodyRun(`  –  ${degree}`, { italic: true })]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           const dr = dateRange(edu.startDate, edu.endDate);
//           if (dr || edu.gpa) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   ...(dr
//                     ? [bodyRun(dr, { italic: true, size: 9, color: "777777" })]
//                     : []),
//                   ...(edu.gpa
//                     ? [
//                         bodyRun(`  ·  GPA ${edu.gpa}`, {
//                           size: 9,
//                           color: "777777",
//                         }),
//                       ]
//                     : []),
//                 ],
//                 spacing: { before: 0, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderSkills(s: ResumeSection): Paragraph[] {
//         const c = s.content as SkillsContent;
//         const cats = c?.categories ?? [];
//         if (!cats.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const cat of cats) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(`${cat.name}:  `, { bold: true }),
//                 bodyRun(cat.skills),
//               ],
//               spacing: { before: 60, after: 40 },
//             }),
//           );
//         }
//         return paras;
//       }

//       function renderProjects(s: ResumeSection): Paragraph[] {
//         const items = s.content as ProjectItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const proj of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(proj.name || "Project", { bold: true }),
//                 ...(proj.technologies
//                   ? [
//                       bodyRun(`  ·  ${proj.technologies}`, {
//                         italic: true,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           if (proj.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(proj.description)],
//                 spacing: { before: 40, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderCertifications(s: ResumeSection): Paragraph[] {
//         const items = s.content as CertificationItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const cert of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(cert.name, { bold: true }),
//                 ...(cert.issuer
//                   ? [bodyRun(`  –  ${cert.issuer}`, { color: "555555" })]
//                   : []),
//                 ...(cert.date
//                   ? [
//                       bodyRun(`  (${cert.date})`, {
//                         italic: true,
//                         size: 9,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 80, after: 40 },
//             }),
//           );
//         }
//         return paras;
//       }

//       function renderLanguages(s: ResumeSection): Paragraph[] {
//         const items = s.content as LanguageItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         const runs: TextRun[] = [];
//         items.forEach((lang, i) => {
//           runs.push(bodyRun(lang.language, { bold: true }));
//           if (lang.proficiency)
//             runs.push(bodyRun(` (${lang.proficiency})`, { color: "777777" }));
//           if (i < items.length - 1)
//             runs.push(bodyRun("   ·   ", { color: "CCCCCC" }));
//         });
//         paras.push(
//           new Paragraph({ children: runs, spacing: { before: 60, after: 60 } }),
//         );
//         return paras;
//       }

//       function renderAwards(s: ResumeSection): Paragraph[] {
//         const items = s.content as AwardItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const award of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(award.title, { bold: true }),
//                 ...(award.issuer
//                   ? [bodyRun(`  –  ${award.issuer}`, { color: "555555" })]
//                   : []),
//                 ...(award.date
//                   ? [
//                       bodyRun(`  (${award.date})`, {
//                         italic: true,
//                         size: 9,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 100, after: 0 },
//             }),
//           );
//           if (award.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(award.description)],
//                 spacing: { before: 30, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderVolunteer(s: ResumeSection): Paragraph[] {
//         const items = s.content as VolunteerItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const vol of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(vol.role || "Role", { bold: true }),
//                 ...(vol.organization
//                   ? [bodyRun(`  ·  ${vol.organization}`, { italic: true })]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           const dr = dateRange(vol.startDate, vol.endDate, vol.current);
//           if (dr) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   bodyRun(dr, { italic: true, size: 9, color: "777777" }),
//                 ],
//                 spacing: { before: 0, after: 30 },
//               }),
//             );
//           }
//           if (vol.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(vol.description)],
//                 spacing: { before: 30, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       // ── Build all section paragraphs ──────────────────────

//       const sectionBlocks: Paragraph[] = [];
//       for (const s of sorted) {
//         let block: Paragraph[] = [];
//         if (s.type === "summary") block = renderSummary(s);
//         else if (s.type === "experience") block = renderExperience(s);
//         else if (s.type === "education") block = renderEducation(s);
//         else if (s.type === "skills") block = renderSkills(s);
//         else if (s.type === "projects") block = renderProjects(s);
//         else if (s.type === "certifications") block = renderCertifications(s);
//         else if (s.type === "languages") block = renderLanguages(s);
//         else if (s.type === "awards") block = renderAwards(s);
//         else if (s.type === "volunteer") block = renderVolunteer(s);
//         if (block.length) {
//           sectionBlocks.push(...block, emptyLine(80));
//         }
//       }

//       // ── Assemble document ─────────────────────────────────

//       const doc = new Document({
//         numbering: {
//           config: [
//             {
//               reference: "resume-bullets",
//               levels: [
//                 {
//                   level: 0,
//                   format: LevelFormat.BULLET,
//                   text: "•",
//                   alignment: AlignmentType.LEFT,
//                   style: {
//                     paragraph: { indent: { left: 360, hanging: 180 } },
//                     run: { size: 20, font: "Calibri" },
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//         styles: {
//           default: { document: { run: { font: "Calibri", size: 20 } } },
//         },
//         sections: [
//           {
//             properties: {
//               page: {
//                 size: { width: 12240, height: 15840 },
//                 margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
//               },
//             },
//             children: [
//               // ── Header: Name ──
//               new Paragraph({
//                 children: [
//                   new TextRun({
//                     text: name,
//                     bold: true,
//                     size: 52,
//                     font: "Calibri",
//                     color: accentHex,
//                   }),
//                 ],
//                 alignment: AlignmentType.CENTER,
//                 spacing: { before: 0, after: 40 },
//               }),

//               // ── Header: Job title ──
//               ...(jobTitle
//                 ? [
//                     new Paragraph({
//                       children: [
//                         new TextRun({
//                           text: jobTitle,
//                           size: 24,
//                           font: "Calibri",
//                           color: "555555",
//                           italics: true,
//                         }),
//                       ],
//                       alignment: AlignmentType.CENTER,
//                       spacing: { before: 0, after: 40 },
//                     }),
//                   ]
//                 : []),

//               // ── Header: Contact line ──
//               ...(info ? [buildContactLine(info)] : []),

//               emptyLine(120),

//               // ── All sections ──
//               ...sectionBlocks,
//             ],
//           },
//         ],
//       });

//       const blob = await Packer.toBlob(doc);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-resume.docx`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("DOCX export failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={handleExport}
//       disabled={loading}
//       className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
//       style={{
//         background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
//         color: "var(--rv-white)",
//         border: "none",
//         borderRadius: 2,
//         padding: "0.45rem 1rem",
//         cursor: loading ? "not-allowed" : "pointer",
//         fontFamily: "inherit",
//         whiteSpace: "nowrap",
//       }}
//       onMouseEnter={(e) => {
//         if (!loading) e.currentTarget.style.background = "#2d5a3d";
//       }}
//       onMouseLeave={(e) => {
//         if (!loading) e.currentTarget.style.background = "var(--rv-ink)";
//       }}
//     >
//       {loading ? (
//         <>
//           <SpinnerIcon />
//           Exporting…
//         </>
//       ) : (
//         <>
//           <DocxIcon />
//           Export DOCX
//         </>
//       )}
//     </button>
//   );
// }

// function DocxIcon() {
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
//       <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
//       <path d="M9 2v4h4" />
//       <path d="M5.5 9.5l1.5 2 1.5-2M10.5 9.5v3" />
//     </svg>
//   );
// }

// function SpinnerIcon() {
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
//         animation: "rv-spin 0.7s linear infinite",
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

// "use client";

// import { useState } from "react";
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
//   LanguageItem,
//   AwardItem,
//   VolunteerItem,
// } from "@/types/resume";

// interface Props {
//   resume: ResumeData;
//   sections: ResumeSection[];
//   isPro?: boolean;
// }

// // ── helpers ───────────────────────────────────────────────

// function hex(color: string): string {
//   return color.replace("#", "").toUpperCase();
// }

// function dateRange(start?: string, end?: string, current?: boolean): string {
//   const s = start || "";
//   const e = current ? "Present" : end || "";
//   if (!s && !e) return "";
//   if (!s) return e;
//   if (!e) return s;
//   return `${s} – ${e}`;
// }

// // ── main component ────────────────────────────────────────

// export default function ExportDOCXButton({
//   resume,
//   sections,
//   isPro = false,
// }: Props) {
//   const [loading, setLoading] = useState(false);
//   const [showUpgrade, setShowUpgrade] = useState(false);

//   async function handleExport() {
//     if (!isPro) {
//       setShowUpgrade(true);
//       return;
//     }
//     setLoading(true);
//     try {
//       const {
//         Document,
//         Packer,
//         Paragraph,
//         TextRun,
//         Table,
//         TableRow,
//         TableCell,
//         AlignmentType,
//         BorderStyle,
//         WidthType,
//         ShadingType,
//         LevelFormat,
//         UnderlineType,
//       } = await import("docx");

//       const accent =
//         COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ??
//         "#c84b2f";
//       const accentHex = hex(accent);
//       const sorted = [...sections].sort((a, b) => a.order - b.order);
//       const info = resume.personalInfo;
//       const name = info?.fullName || resume.title || "Resume";
//       const jobTitle = info?.jobTitle || resume.jobTitle || "";

//       // ── Shared style factories ───────────────────────────

//       const noBorder = {
//         style: BorderStyle.NONE,
//         size: 0,
//         color: "FFFFFF",
//       } as const;
//       const noBorders = {
//         top: noBorder,
//         bottom: noBorder,
//         left: noBorder,
//         right: noBorder,
//       };

//       function sectionHeading(text: string) {
//         return new Paragraph({
//           children: [
//             new TextRun({
//               text: text.toUpperCase(),
//               bold: true,
//               size: 20,
//               font: "Calibri",
//               color: accentHex,
//             }),
//           ],
//           spacing: { before: 240, after: 60 },
//           border: {
//             bottom: {
//               style: BorderStyle.SINGLE,
//               size: 4,
//               color: accentHex,
//               space: 2,
//             },
//           },
//         });
//       }

//       function bodyRun(
//         text: string,
//         opts: {
//           bold?: boolean;
//           italic?: boolean;
//           size?: number;
//           color?: string;
//         } = {},
//       ) {
//         return new TextRun({
//           text,
//           bold: opts.bold ?? false,
//           italics: opts.italic ?? false,
//           size: (opts.size ?? 10) * 2,
//           font: "Calibri",
//           color: opts.color ?? "1A1A1A",
//         });
//       }

//       function emptyLine(spaceBefore = 0) {
//         return new Paragraph({
//           children: [new TextRun("")],
//           spacing: { before: spaceBefore, after: 0 },
//         });
//       }

//       function bulletPara(text: string) {
//         return new Paragraph({
//           numbering: { reference: "resume-bullets", level: 0 },
//           children: [bodyRun(text)],
//           spacing: { before: 20, after: 20 },
//         });
//       }

//       // ── Contact line ─────────────────────────────────────

//       function buildContactLine(info: PersonalInfo): Paragraph {
//         const parts: string[] = [];
//         if (info.email) parts.push(info.email);
//         if (info.phone) parts.push(info.phone);
//         if (info.showAddress && info.address) parts.push(info.address);
//         if (info.linkedin) parts.push(info.linkedin);
//         if (info.github) parts.push(info.github);
//         if (info.showWebsite && info.website) parts.push(info.website);

//         const runs: TextRun[] = [];
//         parts.forEach((p, i) => {
//           runs.push(bodyRun(p, { size: 9, color: "555555" }));
//           if (i < parts.length - 1)
//             runs.push(bodyRun("  ·  ", { size: 9, color: "AAAAAA" }));
//         });

//         return new Paragraph({
//           children: runs,
//           alignment: AlignmentType.CENTER,
//           spacing: { before: 40, after: 0 },
//         });
//       }

//       // ── Section renderers ─────────────────────────────────

//       function renderSummary(s: ResumeSection): Paragraph[] {
//         const text = (s.content as SummaryContent)?.text ?? "";
//         if (!text.trim()) return [];
//         return [
//           sectionHeading(s.title),
//           new Paragraph({
//             children: [bodyRun(text)],
//             spacing: { before: 60, after: 60 },
//           }),
//         ];
//       }

//       function renderExperience(s: ResumeSection): Paragraph[] {
//         const items = s.content as ExperienceItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const exp of items) {
//           // Role + Company row with date right-aligned using a 2-cell table
//           const leftText = [exp.role, exp.company].filter(Boolean).join(" · ");
//           const rightText = dateRange(exp.startDate, exp.endDate, exp.current);

//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(leftText, { bold: true }),
//                 ...(exp.location
//                   ? [
//                       bodyRun(`  ${exp.location}`, {
//                         italic: true,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           if (rightText) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   bodyRun(rightText, {
//                     italic: true,
//                     size: 9,
//                     color: "777777",
//                   }),
//                 ],
//                 spacing: { before: 0, after: 40 },
//               }),
//             );
//           }
//           for (const b of exp.bullets ?? []) {
//             if (b.trim()) paras.push(bulletPara(b));
//           }
//         }
//         return paras;
//       }

//       function renderEducation(s: ResumeSection): Paragraph[] {
//         const items = s.content as EducationItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const edu of items) {
//           const degree = [edu.degree, edu.field].filter(Boolean).join(", ");
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(edu.institution, { bold: true }),
//                 ...(degree
//                   ? [bodyRun(`  –  ${degree}`, { italic: true })]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           const dr = dateRange(edu.startDate, edu.endDate);
//           if (dr || edu.gpa) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   ...(dr
//                     ? [bodyRun(dr, { italic: true, size: 9, color: "777777" })]
//                     : []),
//                   ...(edu.gpa
//                     ? [
//                         bodyRun(`  ·  GPA ${edu.gpa}`, {
//                           size: 9,
//                           color: "777777",
//                         }),
//                       ]
//                     : []),
//                 ],
//                 spacing: { before: 0, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderSkills(s: ResumeSection): Paragraph[] {
//         const c = s.content as SkillsContent;
//         const cats = c?.categories ?? [];
//         if (!cats.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const cat of cats) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(`${cat.name}:  `, { bold: true }),
//                 bodyRun(cat.skills),
//               ],
//               spacing: { before: 60, after: 40 },
//             }),
//           );
//         }
//         return paras;
//       }

//       function renderProjects(s: ResumeSection): Paragraph[] {
//         const items = s.content as ProjectItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const proj of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(proj.name || "Project", { bold: true }),
//                 ...(proj.technologies
//                   ? [
//                       bodyRun(`  ·  ${proj.technologies}`, {
//                         italic: true,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           if (proj.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(proj.description)],
//                 spacing: { before: 40, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderCertifications(s: ResumeSection): Paragraph[] {
//         const items = s.content as CertificationItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const cert of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(cert.name, { bold: true }),
//                 ...(cert.issuer
//                   ? [bodyRun(`  –  ${cert.issuer}`, { color: "555555" })]
//                   : []),
//                 ...(cert.date
//                   ? [
//                       bodyRun(`  (${cert.date})`, {
//                         italic: true,
//                         size: 9,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 80, after: 40 },
//             }),
//           );
//         }
//         return paras;
//       }

//       function renderLanguages(s: ResumeSection): Paragraph[] {
//         const items = s.content as LanguageItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         const runs: TextRun[] = [];
//         items.forEach((lang, i) => {
//           runs.push(bodyRun(lang.language, { bold: true }));
//           if (lang.proficiency)
//             runs.push(bodyRun(` (${lang.proficiency})`, { color: "777777" }));
//           if (i < items.length - 1)
//             runs.push(bodyRun("   ·   ", { color: "CCCCCC" }));
//         });
//         paras.push(
//           new Paragraph({ children: runs, spacing: { before: 60, after: 60 } }),
//         );
//         return paras;
//       }

//       function renderAwards(s: ResumeSection): Paragraph[] {
//         const items = s.content as AwardItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const award of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(award.title, { bold: true }),
//                 ...(award.issuer
//                   ? [bodyRun(`  –  ${award.issuer}`, { color: "555555" })]
//                   : []),
//                 ...(award.date
//                   ? [
//                       bodyRun(`  (${award.date})`, {
//                         italic: true,
//                         size: 9,
//                         color: "777777",
//                       }),
//                     ]
//                   : []),
//               ],
//               spacing: { before: 100, after: 0 },
//             }),
//           );
//           if (award.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(award.description)],
//                 spacing: { before: 30, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       function renderVolunteer(s: ResumeSection): Paragraph[] {
//         const items = s.content as VolunteerItem[];
//         if (!Array.isArray(items) || !items.length) return [];
//         const paras: Paragraph[] = [sectionHeading(s.title)];
//         for (const vol of items) {
//           paras.push(
//             new Paragraph({
//               children: [
//                 bodyRun(vol.role || "Role", { bold: true }),
//                 ...(vol.organization
//                   ? [bodyRun(`  ·  ${vol.organization}`, { italic: true })]
//                   : []),
//               ],
//               spacing: { before: 120, after: 0 },
//             }),
//           );
//           const dr = dateRange(vol.startDate, vol.endDate, vol.current);
//           if (dr) {
//             paras.push(
//               new Paragraph({
//                 children: [
//                   bodyRun(dr, { italic: true, size: 9, color: "777777" }),
//                 ],
//                 spacing: { before: 0, after: 30 },
//               }),
//             );
//           }
//           if (vol.description?.trim()) {
//             paras.push(
//               new Paragraph({
//                 children: [bodyRun(vol.description)],
//                 spacing: { before: 30, after: 60 },
//               }),
//             );
//           }
//         }
//         return paras;
//       }

//       // ── Build all section paragraphs ──────────────────────

//       const sectionBlocks: Paragraph[] = [];
//       for (const s of sorted) {
//         let block: Paragraph[] = [];
//         if (s.type === "summary") block = renderSummary(s);
//         else if (s.type === "experience") block = renderExperience(s);
//         else if (s.type === "education") block = renderEducation(s);
//         else if (s.type === "skills") block = renderSkills(s);
//         else if (s.type === "projects") block = renderProjects(s);
//         else if (s.type === "certifications") block = renderCertifications(s);
//         else if (s.type === "languages") block = renderLanguages(s);
//         else if (s.type === "awards") block = renderAwards(s);
//         else if (s.type === "volunteer") block = renderVolunteer(s);
//         if (block.length) {
//           sectionBlocks.push(...block, emptyLine(80));
//         }
//       }

//       // ── Assemble document ─────────────────────────────────

//       const doc = new Document({
//         numbering: {
//           config: [
//             {
//               reference: "resume-bullets",
//               levels: [
//                 {
//                   level: 0,
//                   format: LevelFormat.BULLET,
//                   text: "•",
//                   alignment: AlignmentType.LEFT,
//                   style: {
//                     paragraph: { indent: { left: 360, hanging: 180 } },
//                     run: { size: 20, font: "Calibri" },
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//         styles: {
//           default: { document: { run: { font: "Calibri", size: 20 } } },
//         },
//         sections: [
//           {
//             properties: {
//               page: {
//                 size: { width: 12240, height: 15840 },
//                 margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
//               },
//             },
//             children: [
//               // ── Header: Name ──
//               new Paragraph({
//                 children: [
//                   new TextRun({
//                     text: name,
//                     bold: true,
//                     size: 52,
//                     font: "Calibri",
//                     color: accentHex,
//                   }),
//                 ],
//                 alignment: AlignmentType.CENTER,
//                 spacing: { before: 0, after: 40 },
//               }),

//               // ── Header: Job title ──
//               ...(jobTitle
//                 ? [
//                     new Paragraph({
//                       children: [
//                         new TextRun({
//                           text: jobTitle,
//                           size: 24,
//                           font: "Calibri",
//                           color: "555555",
//                           italics: true,
//                         }),
//                       ],
//                       alignment: AlignmentType.CENTER,
//                       spacing: { before: 0, after: 40 },
//                     }),
//                   ]
//                 : []),

//               // ── Header: Contact line ──
//               ...(info ? [buildContactLine(info)] : []),

//               emptyLine(120),

//               // ── All sections ──
//               ...sectionBlocks,
//             ],
//           },
//         ],
//       });

//       const blob = await Packer.toBlob(doc);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-resume.docx`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("DOCX export failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <button
//         onClick={handleExport}
//         disabled={loading}
//         className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
//         style={{
//           background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
//           color: "var(--rv-white)",
//           border: "none",
//           borderRadius: 2,
//           padding: "0.45rem 1rem",
//           cursor: loading ? "not-allowed" : "pointer",
//           fontFamily: "inherit",
//           whiteSpace: "nowrap",
//           position: "relative",
//         }}
//         onMouseEnter={(e) => {
//           if (!loading) e.currentTarget.style.background = "#2d5a3d";
//         }}
//         onMouseLeave={(e) => {
//           if (!loading) e.currentTarget.style.background = "var(--rv-ink)";
//         }}
//       >
//         {loading ? (
//           <>
//             <SpinnerIcon />
//             Exporting…
//           </>
//         ) : (
//           <>
//             <DocxIcon />
//             Export DOCX{!isPro && <ProBadge />}
//           </>
//         )}
//       </button>

//       {/* Upgrade modal */}
//       {showUpgrade && (
//         <>
//           <div
//             style={{
//               position: "fixed",
//               inset: 0,
//               background: "rgba(15,14,13,0.5)",
//               zIndex: 100,
//             }}
//             onClick={() => setShowUpgrade(false)}
//           />
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: 101,
//               background: "var(--rv-white)",
//               borderRadius: 4,
//               padding: "2rem",
//               maxWidth: 380,
//               width: "90%",
//               boxShadow: "0 20px 60px rgba(15,14,13,0.2)",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "50%",
//                 background: "rgba(200,75,47,0.08)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 1rem",
//               }}
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 style={{
//                   width: 22,
//                   height: 22,
//                   stroke: "var(--rv-accent)",
//                   fill: "none",
//                   strokeWidth: 1.5,
//                 }}
//               >
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//             </div>
//             <h3
//               className="font-serif"
//               style={{
//                 fontSize: "1.25rem",
//                 color: "var(--rv-ink)",
//                 marginBottom: "0.5rem",
//               }}
//             >
//               Pro feature
//             </h3>
//             <p
//               style={{
//                 fontSize: "0.82rem",
//                 color: "var(--rv-muted)",
//                 lineHeight: 1.6,
//                 marginBottom: "1.5rem",
//               }}
//             >
//               DOCX export is available on the Pro plan. Upgrade to download
//               fully editable Word documents with no watermark.
//             </p>
//             <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
//               <button
//                 onClick={async () => {
//                   const res = await fetch("/api/stripe/checkout", {
//                     method: "POST",
//                   });
//                   const data = await res.json();
//                   if (data.url) window.location.href = data.url;
//                 }}
//                 style={{
//                   padding: "0.55rem 1.25rem",
//                   background: "var(--rv-accent)",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 2,
//                   fontSize: "0.82rem",
//                   fontWeight: 700,
//                   cursor: "pointer",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 Upgrade to Pro →
//               </button>
//               <button
//                 onClick={() => setShowUpgrade(false)}
//                 style={{
//                   padding: "0.55rem 1rem",
//                   background: "none",
//                   color: "var(--rv-muted)",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   fontSize: "0.82rem",
//                   cursor: "pointer",
//                   fontFamily: "inherit",
//                 }}
//               >
//                 Maybe later
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// function ProBadge() {
//   return (
//     <span
//       style={{
//         marginLeft: 4,
//         fontSize: "0.55rem",
//         fontWeight: 800,
//         background: "var(--rv-accent)",
//         color: "#fff",
//         borderRadius: 99,
//         padding: "1px 5px",
//         letterSpacing: "0.06em",
//         verticalAlign: "middle",
//       }}
//     >
//       PRO
//     </span>
//   );
// }

// function DocxIcon() {
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
//       <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
//       <path d="M9 2v4h4" />
//       <path d="M5.5 9.5l1.5 2 1.5-2M10.5 9.5v3" />
//     </svg>
//   );
// }

// function SpinnerIcon() {
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
//         animation: "rv-spin 0.7s linear infinite",
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

import { useState } from "react";
import { COLOR_SCHEMES } from "@/lib/resume-constants";
import type { Paragraph, TextRun } from "docx";
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
  AwardItem,
  VolunteerItem,
} from "@/types/resume";

interface Props {
  resume: ResumeData;
  sections: ResumeSection[];
  isPro?: boolean;
}

// ── helpers ───────────────────────────────────────────────

function hex(color: string): string {
  return color.replace("#", "").toUpperCase();
}

function dateRange(start?: string, end?: string, current?: boolean): string {
  const s = start || "";
  const e = current ? "Present" : end || "";
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

// ── main component ────────────────────────────────────────

export default function ExportDOCXButton({
  resume,
  sections,
  isPro = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleExport() {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setLoading(true);
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        AlignmentType,
        BorderStyle,
        LevelFormat,
      } = await import("docx");

      const accent =
        COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ??
        "#c84b2f";
      const accentHex = hex(accent);
      const sorted = [...sections].sort((a, b) => a.order - b.order);
      const info = resume.personalInfo;
      const name = info?.fullName || resume.title || "Resume";
      const jobTitle = info?.jobTitle || resume.jobTitle || "";

      // ── Shared style factories ───────────────────────────

      const noBorder = {
        style: BorderStyle.NONE,
        size: 0,
        color: "FFFFFF",
      } as const;

      function sectionHeading(text: string) {
        return new Paragraph({
          children: [
            new TextRun({
              text: text.toUpperCase(),
              bold: true,
              size: 20,
              font: "Calibri",
              color: accentHex,
            }),
          ],
          spacing: { before: 240, after: 60 },
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 4,
              color: accentHex,
              space: 2,
            },
          },
        });
      }

      function bodyRun(
        text: string,
        opts: {
          bold?: boolean;
          italic?: boolean;
          size?: number;
          color?: string;
        } = {},
      ) {
        return new TextRun({
          text,
          bold: opts.bold ?? false,
          italics: opts.italic ?? false,
          size: (opts.size ?? 10) * 2,
          font: "Calibri",
          color: opts.color ?? "1A1A1A",
        });
      }

      function emptyLine(spaceBefore = 0) {
        return new Paragraph({
          children: [new TextRun("")],
          spacing: { before: spaceBefore, after: 0 },
        });
      }

      function bulletPara(text: string) {
        return new Paragraph({
          numbering: { reference: "resume-bullets", level: 0 },
          children: [bodyRun(text)],
          spacing: { before: 20, after: 20 },
        });
      }

      // ── Contact line ─────────────────────────────────────

      function buildContactLine(info: PersonalInfo): Paragraph {
        const parts: string[] = [];
        if (info.email) parts.push(info.email);
        if (info.phone) parts.push(info.phone);
        if (info.showAddress && info.address) parts.push(info.address);
        if (info.linkedin) parts.push(info.linkedin);
        if (info.github) parts.push(info.github);
        if (info.showWebsite && info.website) parts.push(info.website);

        const runs: TextRun[] = [];
        parts.forEach((p, i) => {
          runs.push(bodyRun(p, { size: 9, color: "555555" }));
          if (i < parts.length - 1)
            runs.push(bodyRun("  ·  ", { size: 9, color: "AAAAAA" }));
        });

        return new Paragraph({
          children: runs,
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 0 },
        });
      }

      // ── Section renderers ─────────────────────────────────

      function renderSummary(s: ResumeSection): Paragraph[] {
        const text = (s.content as SummaryContent)?.text ?? "";
        if (!text.trim()) return [];
        return [
          sectionHeading(s.title),
          new Paragraph({
            children: [bodyRun(text)],
            spacing: { before: 60, after: 60 },
          }),
        ];
      }

      function renderExperience(s: ResumeSection): Paragraph[] {
        const items = s.content as ExperienceItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const exp of items) {
          // Role + Company row with date right-aligned using a 2-cell table
          const leftText = [exp.role, exp.company].filter(Boolean).join(" · ");
          const rightText = dateRange(exp.startDate, exp.endDate, exp.current);

          paras.push(
            new Paragraph({
              children: [
                bodyRun(leftText, { bold: true }),
                ...(exp.location
                  ? [
                      bodyRun(`  ${exp.location}`, {
                        italic: true,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          if (rightText) {
            paras.push(
              new Paragraph({
                children: [
                  bodyRun(rightText, {
                    italic: true,
                    size: 9,
                    color: "777777",
                  }),
                ],
                spacing: { before: 0, after: 40 },
              }),
            );
          }
          for (const b of exp.bullets ?? []) {
            if (b.trim()) paras.push(bulletPara(b));
          }
        }
        return paras;
      }

      function renderEducation(s: ResumeSection): Paragraph[] {
        const items = s.content as EducationItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const edu of items) {
          const degree = [edu.degree, edu.field].filter(Boolean).join(", ");
          paras.push(
            new Paragraph({
              children: [
                bodyRun(edu.institution, { bold: true }),
                ...(degree
                  ? [bodyRun(`  –  ${degree}`, { italic: true })]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          const dr = dateRange(edu.startDate, edu.endDate);
          if (dr || edu.gpa) {
            paras.push(
              new Paragraph({
                children: [
                  ...(dr
                    ? [bodyRun(dr, { italic: true, size: 9, color: "777777" })]
                    : []),
                  ...(edu.gpa
                    ? [
                        bodyRun(`  ·  GPA ${edu.gpa}`, {
                          size: 9,
                          color: "777777",
                        }),
                      ]
                    : []),
                ],
                spacing: { before: 0, after: 60 },
              }),
            );
          }
        }
        return paras;
      }

      function renderSkills(s: ResumeSection): Paragraph[] {
        const c = s.content as SkillsContent;
        const cats = c?.categories ?? [];
        if (!cats.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const cat of cats) {
          paras.push(
            new Paragraph({
              children: [
                bodyRun(`${cat.name}:  `, { bold: true }),
                bodyRun(cat.skills),
              ],
              spacing: { before: 60, after: 40 },
            }),
          );
        }
        return paras;
      }

      function renderProjects(s: ResumeSection): Paragraph[] {
        const items = s.content as ProjectItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const proj of items) {
          paras.push(
            new Paragraph({
              children: [
                bodyRun(proj.name || "Project", { bold: true }),
                ...(proj.technologies
                  ? [
                      bodyRun(`  ·  ${proj.technologies}`, {
                        italic: true,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          if (proj.description?.trim()) {
            paras.push(
              new Paragraph({
                children: [bodyRun(proj.description)],
                spacing: { before: 40, after: 60 },
              }),
            );
          }
        }
        return paras;
      }

      function renderCertifications(s: ResumeSection): Paragraph[] {
        const items = s.content as CertificationItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const cert of items) {
          paras.push(
            new Paragraph({
              children: [
                bodyRun(cert.name, { bold: true }),
                ...(cert.issuer
                  ? [bodyRun(`  –  ${cert.issuer}`, { color: "555555" })]
                  : []),
                ...(cert.date
                  ? [
                      bodyRun(`  (${cert.date})`, {
                        italic: true,
                        size: 9,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 80, after: 40 },
            }),
          );
        }
        return paras;
      }

      function renderLanguages(s: ResumeSection): Paragraph[] {
        const items = s.content as LanguageItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        const runs: TextRun[] = [];
        items.forEach((lang, i) => {
          runs.push(bodyRun(lang.language, { bold: true }));
          if (lang.proficiency)
            runs.push(bodyRun(` (${lang.proficiency})`, { color: "777777" }));
          if (i < items.length - 1)
            runs.push(bodyRun("   ·   ", { color: "CCCCCC" }));
        });
        paras.push(
          new Paragraph({ children: runs, spacing: { before: 60, after: 60 } }),
        );
        return paras;
      }

      function renderAwards(s: ResumeSection): Paragraph[] {
        const items = s.content as AwardItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const award of items) {
          paras.push(
            new Paragraph({
              children: [
                bodyRun(award.title, { bold: true }),
                ...(award.issuer
                  ? [bodyRun(`  –  ${award.issuer}`, { color: "555555" })]
                  : []),
                ...(award.date
                  ? [
                      bodyRun(`  (${award.date})`, {
                        italic: true,
                        size: 9,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 100, after: 0 },
            }),
          );
          if (award.description?.trim()) {
            paras.push(
              new Paragraph({
                children: [bodyRun(award.description)],
                spacing: { before: 30, after: 60 },
              }),
            );
          }
        }
        return paras;
      }

      function renderVolunteer(s: ResumeSection): Paragraph[] {
        const items = s.content as VolunteerItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: Paragraph[] = [sectionHeading(s.title)];
        for (const vol of items) {
          paras.push(
            new Paragraph({
              children: [
                bodyRun(vol.role || "Role", { bold: true }),
                ...(vol.organization
                  ? [bodyRun(`  ·  ${vol.organization}`, { italic: true })]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          const dr = dateRange(vol.startDate, vol.endDate, vol.current);
          if (dr) {
            paras.push(
              new Paragraph({
                children: [
                  bodyRun(dr, { italic: true, size: 9, color: "777777" }),
                ],
                spacing: { before: 0, after: 30 },
              }),
            );
          }
          if (vol.description?.trim()) {
            paras.push(
              new Paragraph({
                children: [bodyRun(vol.description)],
                spacing: { before: 30, after: 60 },
              }),
            );
          }
        }
        return paras;
      }

      // ── Build all section paragraphs ──────────────────────

      const sectionBlocks: Paragraph[] = [];
      for (const s of sorted) {
        let block: Paragraph[] = [];
        if (s.type === "summary") block = renderSummary(s);
        else if (s.type === "experience") block = renderExperience(s);
        else if (s.type === "education") block = renderEducation(s);
        else if (s.type === "skills") block = renderSkills(s);
        else if (s.type === "projects") block = renderProjects(s);
        else if (s.type === "certifications") block = renderCertifications(s);
        else if (s.type === "languages") block = renderLanguages(s);
        else if (s.type === "awards") block = renderAwards(s);
        else if (s.type === "volunteer") block = renderVolunteer(s);
        if (block.length) {
          sectionBlocks.push(...block, emptyLine(80));
        }
      }

      // ── Assemble document ─────────────────────────────────

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "resume-bullets",
              levels: [
                {
                  level: 0,
                  format: LevelFormat.BULLET,
                  text: "•",
                  alignment: AlignmentType.LEFT,
                  style: {
                    paragraph: { indent: { left: 360, hanging: 180 } },
                    run: { size: 20, font: "Calibri" },
                  },
                },
              ],
            },
          ],
        },
        styles: {
          default: { document: { run: { font: "Calibri", size: 20 } } },
        },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
              },
            },
            children: [
              // ── Header: Name ──
              new Paragraph({
                children: [
                  new TextRun({
                    text: name,
                    bold: true,
                    size: 52,
                    font: "Calibri",
                    color: accentHex,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40 },
              }),

              // ── Header: Job title ──
              ...(jobTitle
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: jobTitle,
                          size: 24,
                          font: "Calibri",
                          color: "555555",
                          italics: true,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 40 },
                    }),
                  ]
                : []),

              // ── Header: Contact line ──
              ...(info ? [buildContactLine(info)] : []),

              emptyLine(120),

              // ── All sections ──
              ...sectionBlocks,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-resume.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
        style={{
          background: loading ? "var(--rv-muted)" : "var(--rv-ink)",
          color: "var(--rv-white)",
          border: "none",
          borderRadius: 2,
          padding: "0.45rem 1rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.background = "#2d5a3d";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--rv-ink)";
        }}
      >
        {loading ? (
          <>
            <SpinnerIcon />
            Exporting…
          </>
        ) : (
          <>
            <DocxIcon />
            Export DOCX{!isPro && <ProBadge />}
          </>
        )}
      </button>

      {/* Upgrade modal */}
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
              Pro feature
            </h3>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--rv-muted)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              DOCX export is available on the Pro plan. Upgrade to download
              fully editable Word documents with no watermark.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                onClick={async () => {
                  const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
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

function ProBadge() {
  return (
    <span
      style={{
        marginLeft: 4,
        fontSize: "0.55rem",
        fontWeight: 800,
        background: "var(--rv-accent)",
        color: "#fff",
        borderRadius: 99,
        padding: "1px 5px",
        letterSpacing: "0.06em",
        verticalAlign: "middle",
      }}
    >
      PRO
    </span>
  );
}

function DocxIcon() {
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
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <path d="M9 2v4h4" />
      <path d="M5.5 9.5l1.5 2 1.5-2M10.5 9.5v3" />
    </svg>
  );
}

function SpinnerIcon() {
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
        animation: "rv-spin 0.7s linear infinite",
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
