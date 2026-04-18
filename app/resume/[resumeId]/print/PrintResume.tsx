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

// interface PrintResumeProps {
//   resume: ResumeData;
//   isPro?: boolean;
// }

// function getName(resume: ResumeData): string {
//   return (
//     resume.personalInfo?.fullName ||
//     (resume.title !== "Untitled Resume" ? resume.title : "") ||
//     "Your Name"
//   );
// }

// function getJobTitle(resume: ResumeData): string {
//   return resume.personalInfo?.jobTitle || resume.jobTitle || "";
// }

// interface ContactItem {
//   icon: string;
//   text: string;
// }

// function getContactItems(info: PersonalInfo | null): ContactItem[] {
//   if (!info) return [];
//   const items: ContactItem[] = [];

//   if (info.email) items.push({ icon: "email", text: info.email });
//   if (info.phone) items.push({ icon: "phone", text: info.phone });
//   if (info.showAddress && info.address)
//     items.push({ icon: "address", text: info.address });
//   if (info.linkedin) items.push({ icon: "linkedin", text: info.linkedin });
//   if (info.github) items.push({ icon: "github", text: info.github });
//   if (info.showWebsite && info.website)
//     items.push({ icon: "website", text: info.website });

//   return items;
// }

// function PrintContactLine({ info }: { info: PersonalInfo | null }) {
//   const items = getContactItems(info);
//   if (!items.length) return null;

//   const iconPath: Record<string, React.ReactNode> = {
//     email: (
//       <>
//         <rect x="1" y="3" width="14" height="10" rx="1.5" />
//         <path d="M1 4l7 5 7-5" />
//       </>
//     ),
//     phone: (
//       <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
//     ),
//     address: (
//       <>
//         <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
//         <circle cx="8" cy="6" r="1.5" />
//       </>
//     ),
//     website: (
//       <>
//         <circle cx="8" cy="8" r="7" />
//         <path d="M1 8h14M8 1a10 10 0 0 0 0 14M8 1a10 10 0 0 1 0 14" />
//       </>
//     ),
//     linkedin: null,
//     github: null,
//   };

//   return (
//     <div className="mt-1 flex flex-wrap gap-x-2.5 gap-y-0.5">
//       {items.map((item, i) => (
//         <span
//           key={i}
//           className="inline-flex items-center gap-1 text-[7px] text-[#8a8478]"
//         >
//           {item.icon === "linkedin" ? (
//             <svg
//               viewBox="0 0 16 16"
//               className="h-2 w-2 shrink-0 fill-[#8a8478]"
//             >
//               <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-.75-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
//             </svg>
//           ) : item.icon === "github" ? (
//             <svg
//               viewBox="0 0 16 16"
//               className="h-2 w-2 shrink-0 fill-[#8a8478]"
//             >
//               <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
//             </svg>
//           ) : (
//             <svg
//               viewBox="0 0 16 16"
//               className="h-2 w-2 shrink-0 fill-none stroke-[#8a8478] stroke-[1.5]"
//             >
//               {iconPath[item.icon]}
//             </svg>
//           )}

//           {item.text}
//         </span>
//       ))}
//     </div>
//   );
// }

// export default function PrintResume({
//   resume,
//   isPro = false,
// }: PrintResumeProps) {
//   const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

//   const accent =
//     COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ?? "#c84b2f";

//   return (
//     <div
//       className="w-[210mm] min-h-[297mm] bg-white text-[#0f0e0d] font-sans"
//       style={{ ["--accent" as string]: accent }}
//     >
//       <div className="px-[16mm] py-[14mm]">
//         {resume.template === "classic" && (
//           <ClassicLayout resume={resume} sections={sorted} />
//         )}
//         {resume.template === "minimal" && (
//           <MinimalLayout resume={resume} sections={sorted} />
//         )}
//         {resume.template === "modern" && (
//           <ModernLayout resume={resume} sections={sorted} />
//         )}
//       </div>

//       {!isPro && (
//         <div className="w-full border-t border-[#e8e4dc] bg-[#f5f3ef] py-1 text-center text-[6.5px] tracking-wide text-[#8a8478]">
//           Created with{" "}
//           <span className="font-serif italic text-[#c84b2f]">ResumeVerse</span>{" "}
//           — Upgrade to Pro to remove watermark
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Section Renderer (Tailwind)
// // ─────────────────────────────────────────────────────────────

// function SectionHeading({
//   title,
//   template,
// }: {
//   title: string;
//   template: string;
// }) {
//   if (template === "classic") {
//     return (
//       <div className="mb-2 border-b-2 border-[#0f0e0d] pb-1 text-[7px] font-bold uppercase tracking-widest text-[#0f0e0d]">
//         {title}
//       </div>
//     );
//   }

//   if (template === "minimal") {
//     return (
//       <div className="mb-2 text-[7px] font-bold uppercase tracking-[0.12em] text-[#8a8478]">
//         {title}
//       </div>
//     );
//   }

//   return (
//     <div className="mb-2 border-b border-accent pb-1 text-[7px] font-bold uppercase tracking-widest text-accent">
//       {title}
//     </div>
//   );
// }

// function renderSection(section: ResumeSection, template: string) {
//   switch (section.type) {
//     case "summary": {
//       const c = section.content as SummaryContent;
//       if (!c.text) return null;

//       return (
//         <div className="mb-3.5">
//           <SectionHeading title={section.title} template={template} />
//           <p className="text-[8.5px] leading-[1.6] text-[#3a3835]">{c.text}</p>
//         </div>
//       );
//     }

//     case "experience": {
//       const items = section.content as ExperienceItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-3.5">
//           <SectionHeading title={section.title} template={template} />

//           {items.map((exp) => (
//             <div key={exp.id} className="mb-2.5">
//               <div className="flex items-baseline justify-between">
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {exp.role}
//                 </span>

//                 <span className="text-[7.5px] text-[#8a8478]">
//                   {exp.startDate}
//                   {exp.startDate &&
//                     (exp.current
//                       ? " – Present"
//                       : exp.endDate
//                         ? ` – ${exp.endDate}`
//                         : "")}
//                 </span>
//               </div>

//               <div className="mb-0.5 text-[8px] text-[#8a8478]">
//                 {exp.company}
//                 {exp.location ? ` · ${exp.location}` : ""}
//               </div>

//               {exp.bullets.filter(Boolean).map((b, i) => (
//                 <div key={i} className="mb-0.5 flex gap-2">
//                   <span className="shrink-0 pt-1 text-[7px] text-accent">
//                     •
//                   </span>
//                   <span className="text-[8px] leading-[1.55] text-[#3a3835]">
//                     {b}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "education": {
//       const items = section.content as EducationItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           {items.map((edu) => (
//             <div key={edu.id} className="mb-2">
//               <div className="flex items-baseline justify-between">
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {edu.institution}
//                 </span>

//                 <span className="text-[7.5px] text-[#8a8478]">
//                   {edu.startDate}
//                   {edu.endDate ? ` – ${edu.endDate}` : ""}
//                 </span>
//               </div>

//               <div className="text-[8px] text-[#8a8478]">
//                 {edu.degree}
//                 {edu.field ? ` in ${edu.field}` : ""}
//                 {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "skills": {
//       const c = section.content as SkillsContent;
//       if (!c.categories?.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           {c.categories.map((cat) => (
//             <div key={cat.id} className="mb-1">
//               {cat.name && (
//                 <span className="text-[8px] font-semibold text-[#0f0e0d]">
//                   {cat.name}:{" "}
//                 </span>
//               )}

//               <span className="text-[8px] text-[#3a3835]">{cat.skills}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "projects": {
//       const items = section.content as ProjectItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           {items.map((proj) => (
//             <div key={proj.id} className="mb-2">
//               <div className="flex items-baseline justify-between">
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {proj.name}
//                 </span>

//                 {proj.technologies && (
//                   <span className="text-[7.5px] text-[#8a8478]">
//                     {proj.technologies}
//                   </span>
//                 )}
//               </div>

//               {proj.description && (
//                 <p className="mt-1 text-[8px] leading-[1.55] text-[#3a3835]">
//                   {proj.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "certifications": {
//       const items = section.content as CertificationItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           {items.map((cert) => (
//             <div
//               key={cert.id}
//               className="mb-2 flex items-baseline justify-between"
//             >
//               <div>
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {cert.name}
//                 </span>

//                 {cert.issuer && (
//                   <span className="text-[8px] text-[#8a8478]">
//                     {" "}
//                     · {cert.issuer}
//                   </span>
//                 )}
//               </div>

//               {cert.date && (
//                 <span className="text-[7.5px] text-[#8a8478]">{cert.date}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "languages": {
//       const items = section.content as LanguageItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           <div className="flex flex-wrap gap-x-4 gap-y-1">
//             {items.map((lang) => (
//               <span key={lang.id} className="text-[8px] text-[#3a3835]">
//                 <span className="font-semibold text-[#0f0e0d]">
//                   {lang.language}
//                 </span>
//                 {lang.proficiency ? ` · ${lang.proficiency}` : ""}
//               </span>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     case "awards": {
//       const items = section.content as AwardItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-4">
//           <SectionHeading title={section.title} template={template} />
//           {items.map((award) => (
//             <div key={award.id} className="mb-2">
//               <div className="flex items-baseline justify-between">
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {award.title}
//                 </span>
//                 <span className="text-[7.5px] text-[#8a8478]">
//                   {award.date}
//                 </span>
//               </div>

//               {award.issuer && (
//                 <div className="text-[8px] text-[#8a8478]">{award.issuer}</div>
//               )}

//               {award.description && (
//                 <p className="mt-1 text-[8px] leading-[1.55] text-[#3a3835]">
//                   {award.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "volunteer": {
//       const items = section.content as VolunteerItem[];
//       if (!items.length) return null;

//       return (
//         <div className="mb-3.5">
//           <SectionHeading title={section.title} template={template} />
//           {items.map((vol) => (
//             <div key={vol.id} className="mb-2">
//               <div className="flex items-baseline justify-between">
//                 <span className="text-[9px] font-semibold text-[#0f0e0d]">
//                   {vol.role} @ {vol.organization}
//                 </span>

//                 <span className="text-[7.5px] text-[#8a8478]">
//                   {vol.startDate}
//                   {vol.startDate &&
//                     (vol.current
//                       ? " – Present"
//                       : vol.endDate
//                         ? ` – ${vol.endDate}`
//                         : "")}
//                 </span>
//               </div>

//               {vol.description && (
//                 <p className="mt-0.2 text-[8px] leading-[1.55] text-[#3a3835]">
//                   {vol.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     }

//     default:
//       return null;
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // Layout Props
// // ─────────────────────────────────────────────────────────────

// interface LayoutProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// // ─────────────────────────────────────────────────────────────
// // Modern Layout
// // ─────────────────────────────────────────────────────────────

// function ModernLayout({ resume, sections }: LayoutProps) {
//   return (
//     <>
//       <div className="h-1 w-full bg-accent mb-4 " />

//       <div className="mb-4 relative">
//         {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={resume.personalInfo.photoUrl}
//             alt="Profile"
//             className="float-right ml-3 h-12 w-12 rounded-full object-cover"
//           />
//         )}

//         <h1 className="font-serif mb-1 text-3xl leading-tight tracking-tight ">
//           {getName(resume)}
//         </h1>

//         {getJobTitle(resume) && (
//           <p className="text-xs uppercase tracking-widest text-accent">
//             {getJobTitle(resume)}
//           </p>
//         )}

//         <PrintContactLine info={resume.personalInfo} />
//       </div>

//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, "modern")}</div>
//       ))}
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Classic Layout
// // ─────────────────────────────────────────────────────────────

// function ClassicLayout({ resume, sections }: LayoutProps) {
//   return (
//     <>
//       <div className="mb-4 border-b-2 border-accent pb-3 text-center">
//         <h1 className="font-serif mb-1 text-[26px] tracking-tight ">
//           {getName(resume)}
//         </h1>

//         {getJobTitle(resume) && (
//           <p className="text-[8px] tracking-wider text-[#8a8478]">
//             {getJobTitle(resume)}
//           </p>
//         )}

//         <PrintContactLine info={resume.personalInfo} />
//       </div>

//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, "classic")}</div>
//       ))}
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Minimal Layout
// // ─────────────────────────────────────────────────────────────

// function MinimalLayout({ resume, sections }: LayoutProps) {
//   const leftSections = sections.filter((s) =>
//     ["skills", "certifications", "education", "languages"].includes(s.type),
//   );

//   const rightSections = sections.filter(
//     (s) =>
//       !["skills", "certifications", "education", "languages"].includes(s.type),
//   );

//   return (
//     <>
//       <div className="mb-4">
//         <h1 className="font-serif text-[24px] tracking-tight ">
//           {getName(resume)}
//         </h1>

//         {getJobTitle(resume) && (
//           <p className="text-[8.5px] text-[#8a8478]">{getJobTitle(resume)}</p>
//         )}

//         <PrintContactLine info={resume.personalInfo} />

//         <div className="mt-2 h-px bg-[#d9d4c7]" />
//       </div>

//       <div className="grid grid-cols-[1fr_2fr] gap-5">
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
//     </>
//   );
// }

// PrintResume — uses the shared templates folder so every template
// renders identically in the builder preview, print, PDF and share page.

import {
  ModernTemplate,
  ClassicTemplate,
  MinimalTemplate,
  ExecutiveTemplate,
  CompactTemplate,
  CreativeTemplate,
  ElegantTemplate,
  TechnicalTemplate,
  ChronologicalTemplate,
  BoldTemplate,
  getAccent,
  getName,
} from "@/components/templates";
import type {
  ResumeData,
  ResumeSection,
  SectionType,
  PersonalInfo,
} from "@/types/resume";

interface PrintResumeProps {
  resume: ResumeData;
  isPro?: boolean;
}

// Coerce DB row into ResumeData (sections may arrive as raw Prisma objects)
function coerce(resume: ResumeData): ResumeData {
  return {
    ...resume,
    sections: (resume.sections ?? []).map((s) => ({
      id: s.id,
      resumeId: s.resumeId,
      type: s.type as SectionType,
      title: s.title,
      content: s.content as ResumeSection["content"],
      order: s.order,
    })),
    personalInfo: resume.personalInfo as PersonalInfo | null,
  };
}

export default function PrintResume({
  resume: raw,
  isPro = false,
}: PrintResumeProps) {
  const resume = coerce(raw);
  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
  const accent = getAccent(resume.colorScheme);
  const tplProps = {
    resume: { ...resume, sections: sorted },
    sections: sorted,
    accent,
  };

  const Template = (() => {
    switch (resume.template) {
      case "classic":
        return <ClassicTemplate {...tplProps} />;
      case "minimal":
        return <MinimalTemplate {...tplProps} />;
      case "executive":
        return <ExecutiveTemplate {...tplProps} />;
      case "compact":
        return <CompactTemplate {...tplProps} />;
      case "creative":
        return <CreativeTemplate {...tplProps} />;
      case "elegant":
        return <ElegantTemplate {...tplProps} />;
      case "technical":
        return <TechnicalTemplate {...tplProps} />;
      case "chronological":
        return <ChronologicalTemplate {...tplProps} />;
      case "bold":
        return <BoldTemplate {...tplProps} />;
      default:
        return <ModernTemplate {...tplProps} />;
    }
  })();

  return (
    // <html lang="en">
    //   <head>
    //     <meta charSet="utf-8" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1" />
    //     <title>{getName(resume)}</title>
    //     <link
    //       href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
    //       rel="stylesheet"
    //     />
    //     <style>{`
    //       *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    //       html, body {
    //         width: 210mm;
    //         min-height: 297mm;
    //         font-family: 'DM Sans', sans-serif;
    //         background: #ffffff;
    //         color: #0f0e0d;
    //         -webkit-print-color-adjust: exact;
    //         print-color-adjust: exact;
    //       }
    //       @page { size: A4; margin: 0; }
    //       @media print { html, body { width: 210mm; min-height: 297mm; } }
    //       .page { width: 210mm; min-height: 297mm; }
    //     `}</style>
    //   </head>
    //   <body>
    <>
      <div className="page">{Template}</div>
      {!isPro && (
        <div
          style={{
            width: "210mm",
            padding: "4px 16mm",
            background: "#f5f3ef",
            borderTop: "1px solid #e8e4dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              fontSize: 6.5,
              color: "#8a8478",
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Created with{" "}
            <strong
              style={{
                color: "#c84b2f",
                fontWeight: 700,
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
              }}
            >
              ResumeVerse
            </strong>{" "}
            — resumeverse.com · Upgrade to Pro to remove this watermark
          </span>
        </div>
      )}
    </>
    //   </body>
    // </html>
  );
}
