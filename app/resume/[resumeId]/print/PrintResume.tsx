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

// interface PrintResumeProps {
//   resume: ResumeData;
// }

// export default function PrintResume({ resume }: PrintResumeProps) {
//   const sorted = [...resume.sections].sort((a, b) => a.order - b.order);

//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>{resume.title}</title>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <style>{`
//           *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//           html, body {
//             width: 210mm;
//             min-height: 297mm;
//             font-family: 'DM Sans', sans-serif;
//             background: #ffffff;
//             color: #0f0e0d;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           @page {
//             size: A4;
//             margin: 0;
//           }

//           @media print {
//             html, body { width: 210mm; min-height: 297mm; }
//           }

//           .serif { font-family: 'Instrument Serif', serif; }
//           .page { width: 210mm; min-height: 297mm; padding: 14mm 16mm; }
//         `}</style>
//       </head>
//       <body>
//         <div className="page">
//           {resume.template === "classic" && (
//             <ClassicLayout resume={resume} sections={sorted} />
//           )}
//           {resume.template === "minimal" && (
//             <MinimalLayout resume={resume} sections={sorted} />
//           )}
//           {resume.template !== "classic" && resume.template !== "minimal" && (
//             <ModernLayout resume={resume} sections={sorted} />
//           )}
//         </div>
//       </body>
//     </html>
//   );
// }

// // ── Shared section renderer ───────────────────────────────

// function renderSection(section: ResumeSection, template: string) {
//   const accentColor = "#c84b2f";
//   const inkColor = "#0f0e0d";
//   const mutedColor = "#8a8478";
//   const bodyColor = "#3a3835";

//   const headingStyle: React.CSSProperties =
//     template === "modern"
//       ? {
//           fontSize: 7,
//           fontWeight: 700,
//           letterSpacing: "0.12em",
//           textTransform: "uppercase" as const,
//           color: accentColor,
//           borderBottom: `1px solid ${accentColor}`,
//           paddingBottom: 2,
//           marginBottom: 6,
//         }
//       : template === "classic"
//         ? {
//             fontSize: 7,
//             fontWeight: 700,
//             letterSpacing: "0.1em",
//             textTransform: "uppercase" as const,
//             color: inkColor,
//             borderBottom: `2px solid ${inkColor}`,
//             paddingBottom: 2,
//             marginBottom: 6,
//           }
//         : {
//             fontSize: 7,
//             fontWeight: 700,
//             letterSpacing: "0.12em",
//             textTransform: "uppercase" as const,
//             color: mutedColor,
//             marginBottom: 6,
//           };

//   switch (section.type) {
//     case "summary": {
//       const c = section.content as SummaryContent;
//       if (!c.text) return null;
//       return (
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           <p style={{ fontSize: 8.5, lineHeight: 1.6, color: bodyColor }}>
//             {c.text}
//           </p>
//         </div>
//       );
//     }

//     case "experience": {
//       const items = section.content as ExperienceItem[];
//       if (!items.length) return null;
//       return (
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((exp) => (
//             <div key={exp.id} style={{ marginBottom: 9 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
//                   {exp.role}
//                 </span>
//                 <span style={{ fontSize: 7.5, color: mutedColor }}>
//                   {exp.startDate}
//                   {exp.startDate &&
//                     (exp.current
//                       ? " – Present"
//                       : exp.endDate
//                         ? ` – ${exp.endDate}`
//                         : "")}
//                 </span>
//               </div>
//               <div style={{ fontSize: 8, color: mutedColor, marginBottom: 3 }}>
//                 {exp.company}
//                 {exp.location ? ` · ${exp.location}` : ""}
//               </div>
//               {exp.bullets.filter(Boolean).map((b, i) => (
//                 <div
//                   key={i}
//                   style={{ display: "flex", gap: 5, marginBottom: 2 }}
//                 >
//                   <span
//                     style={{
//                       color: accentColor,
//                       fontSize: 7,
//                       flexShrink: 0,
//                       paddingTop: 1,
//                     }}
//                   >
//                     •
//                   </span>
//                   <span
//                     style={{ fontSize: 8, lineHeight: 1.55, color: bodyColor }}
//                   >
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
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((edu) => (
//             <div key={edu.id} style={{ marginBottom: 7 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
//                   {edu.institution}
//                 </span>
//                 <span style={{ fontSize: 7.5, color: mutedColor }}>
//                   {edu.startDate}
//                   {edu.endDate ? ` – ${edu.endDate}` : ""}
//                 </span>
//               </div>
//               <div style={{ fontSize: 8, color: mutedColor }}>
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
//       if (!c.categories.length) return null;
//       return (
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           {c.categories.map((cat) => (
//             <div key={cat.id} style={{ marginBottom: 4 }}>
//               {cat.name && (
//                 <span style={{ fontSize: 8, fontWeight: 600, color: inkColor }}>
//                   {cat.name}:{" "}
//                 </span>
//               )}
//               <span style={{ fontSize: 8, color: bodyColor }}>
//                 {cat.skills}
//               </span>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     case "projects": {
//       const items = section.content as ProjectItem[];
//       if (!items.length) return null;
//       return (
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((proj) => (
//             <div key={proj.id} style={{ marginBottom: 7 }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
//                   {proj.name}
//                 </span>
//                 {proj.technologies && (
//                   <span style={{ fontSize: 7.5, color: mutedColor }}>
//                     {proj.technologies}
//                   </span>
//                 )}
//               </div>
//               {proj.description && (
//                 <p
//                   style={{
//                     fontSize: 8,
//                     lineHeight: 1.55,
//                     color: bodyColor,
//                     marginTop: 2,
//                   }}
//                 >
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
//         <div style={{ marginBottom: 14 }}>
//           <div style={headingStyle}>{section.title}</div>
//           {items.map((cert) => (
//             <div
//               key={cert.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "baseline",
//                 marginBottom: 5,
//               }}
//             >
//               <div>
//                 <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
//                   {cert.name}
//                 </span>
//                 {cert.issuer && (
//                   <span style={{ fontSize: 8, color: mutedColor }}>
//                     {" "}
//                     · {cert.issuer}
//                   </span>
//                 )}
//               </div>
//               {cert.date && (
//                 <span style={{ fontSize: 7.5, color: mutedColor }}>
//                   {cert.date}
//                 </span>
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

// // ── Modern layout ─────────────────────────────────────────

// function ModernLayout({
//   resume,
//   sections,
// }: {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }) {
//   return (
//     <>
//       {/* Top accent bar */}
//       <div
//         style={{
//           height: 4,
//           background: "#c84b2f",
//           margin: "-14mm -16mm 14px",
//           width: "calc(100% + 32mm)",
//         }}
//       />

//       {/* Header */}
//       <div style={{ marginBottom: 16 }}>
//         <h1
//           className="serif"
//           style={{
//             fontSize: 26,
//             color: "#0f0e0d",
//             lineHeight: 1.1,
//             letterSpacing: "-0.02em",
//             marginBottom: 3,
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p
//             style={{
//               fontSize: 8,
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
//     </>
//   );
// }

// // ── Classic layout ────────────────────────────────────────

// function ClassicLayout({
//   resume,
//   sections,
// }: {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }) {
//   return (
//     <>
//       {/* Centered header */}
//       <div
//         style={{
//           textAlign: "center",
//           marginBottom: 14,
//           paddingBottom: 10,
//           borderBottom: "2px solid #0f0e0d",
//         }}
//       >
//         <h1
//           className="serif"
//           style={{
//             fontSize: 26,
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: 3,
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: 8, color: "#8a8478", letterSpacing: "0.06em" }}>
//             {resume.jobTitle}
//           </p>
//         )}
//       </div>

//       {sections.map((s) => (
//         <div key={s.id}>{renderSection(s, "classic")}</div>
//       ))}
//     </>
//   );
// }

// // ── Minimal layout ────────────────────────────────────────

// function MinimalLayout({
//   resume,
//   sections,
// }: {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }) {
//   const leftSections = sections.filter((s) =>
//     ["skills", "certifications", "education"].includes(s.type),
//   );
//   const rightSections = sections.filter(
//     (s) => !["skills", "certifications", "education"].includes(s.type),
//   );

//   return (
//     <>
//       {/* Header */}
//       <div style={{ marginBottom: 14 }}>
//         <h1
//           className="serif"
//           style={{
//             fontSize: 24,
//             color: "#0f0e0d",
//             letterSpacing: "-0.02em",
//             marginBottom: 2,
//           }}
//         >
//           {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
//         </h1>
//         {resume.jobTitle && (
//           <p style={{ fontSize: 8.5, color: "#8a8478" }}>{resume.jobTitle}</p>
//         )}
//         <div style={{ height: 1, background: "#d9d4c7", marginTop: 8 }} />
//       </div>

//       {/* Two-column body */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
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

import { COLOR_SCHEMES } from "@/components/builder/BuilderTopbar";
import type {
  ResumeData,
  ResumeSection,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillsContent,
  ProjectItem,
  CertificationItem,
} from "@/types/resume";

interface PrintResumeProps {
  resume: ResumeData;
}

export default function PrintResume({ resume }: PrintResumeProps) {
  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
  const accent =
    COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ?? "#c84b2f";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{resume.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html, body {
            width: 210mm;
            min-height: 297mm;
            font-family: 'DM Sans', sans-serif;
            background: #ffffff;
            color: #0f0e0d;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            html, body { width: 210mm; min-height: 297mm; }
          }

          .serif { font-family: 'Instrument Serif', serif; }
          .page { width: 210mm; min-height: 297mm; padding: 14mm 16mm; }
        `}</style>
      </head>
      <body>
        <div className="page">
          {resume.template === "classic" && (
            <ClassicLayout resume={resume} sections={sorted} accent={accent} />
          )}
          {resume.template === "minimal" && (
            <MinimalLayout resume={resume} sections={sorted} accent={accent} />
          )}
          {resume.template !== "classic" && resume.template !== "minimal" && (
            <ModernLayout resume={resume} sections={sorted} accent={accent} />
          )}
        </div>
      </body>
    </html>
  );
}

// ── Shared section renderer ───────────────────────────────

function renderSection(
  section: ResumeSection,
  template: string,
  accent: string = "#c84b2f",
) {
  const accentColor = accent;
  const inkColor = "#0f0e0d";
  const mutedColor = "#8a8478";
  const bodyColor = "#3a3835";

  const headingStyle: React.CSSProperties =
    template === "modern"
      ? {
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: accentColor,
          borderBottom: `1px solid ${accentColor}`,
          paddingBottom: 2,
          marginBottom: 6,
        }
      : template === "classic"
        ? {
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: inkColor,
            borderBottom: `2px solid ${inkColor}`,
            paddingBottom: 2,
            marginBottom: 6,
          }
        : {
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: mutedColor,
            marginBottom: 6,
          };

  switch (section.type) {
    case "summary": {
      const c = section.content as SummaryContent;
      if (!c.text) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          <p style={{ fontSize: 8.5, lineHeight: 1.6, color: bodyColor }}>
            {c.text}
          </p>
        </div>
      );
    }

    case "experience": {
      const items = section.content as ExperienceItem[];
      if (!items.length) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 9 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {exp.role}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {exp.startDate}
                  {exp.startDate &&
                    (exp.current
                      ? " – Present"
                      : exp.endDate
                        ? ` – ${exp.endDate}`
                        : "")}
                </span>
              </div>
              <div style={{ fontSize: 8, color: mutedColor, marginBottom: 3 }}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 5, marginBottom: 2 }}
                >
                  <span
                    style={{
                      color: accentColor,
                      fontSize: 7,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    •
                  </span>
                  <span
                    style={{ fontSize: 8, lineHeight: 1.55, color: bodyColor }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    case "education": {
      const items = section.content as EducationItem[];
      if (!items.length) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {edu.institution}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 8, color: mutedColor }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "skills": {
      const c = section.content as SkillsContent;
      if (!c.categories.length) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          {c.categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 4 }}>
              {cat.name && (
                <span style={{ fontSize: 8, fontWeight: 600, color: inkColor }}>
                  {cat.name}:{" "}
                </span>
              )}
              <span style={{ fontSize: 8, color: bodyColor }}>
                {cat.skills}
              </span>
            </div>
          ))}
        </div>
      );
    }

    case "projects": {
      const items = section.content as ProjectItem[];
      if (!items.length) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {proj.name}
                </span>
                {proj.technologies && (
                  <span style={{ fontSize: 7.5, color: mutedColor }}>
                    {proj.technologies}
                  </span>
                )}
              </div>
              {proj.description && (
                <p
                  style={{
                    fontSize: 8,
                    lineHeight: 1.55,
                    color: bodyColor,
                    marginTop: 2,
                  }}
                >
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "certifications": {
      const items = section.content as CertificationItem[];
      if (!items.length) return null;
      return (
        <div style={{ marginBottom: 14 }}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 5,
              }}
            >
              <div>
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span style={{ fontSize: 8, color: mutedColor }}>
                    {" "}
                    · {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Modern layout ─────────────────────────────────────────

function ModernLayout({
  resume,
  sections,
  accent = "#c84b2f",
}: {
  resume: ResumeData;
  sections: ResumeSection[];
  accent?: string;
}) {
  return (
    <>
      {/* Top accent bar */}
      <div
        style={{
          height: 4,
          background: accent,
          margin: "-14mm -16mm 14px",
          width: "calc(100% + 32mm)",
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1
          className="serif"
          style={{
            fontSize: 26,
            color: "#0f0e0d",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 3,
          }}
        >
          {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
        </h1>
        {resume.jobTitle && (
          <p
            style={{
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#c84b2f",
            }}
          >
            {resume.jobTitle}
          </p>
        )}
      </div>

      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, "modern", accent)}</div>
      ))}
    </>
  );
}

// ── Classic layout ────────────────────────────────────────

function ClassicLayout({
  resume,
  sections,
  accent = "#c84b2f",
}: {
  resume: ResumeData;
  sections: ResumeSection[];
  accent?: string;
}) {
  return (
    <>
      {/* Centered header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "2px solid #0f0e0d",
        }}
      >
        <h1
          className="serif"
          style={{
            fontSize: 26,
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: 3,
          }}
        >
          {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
        </h1>
        {resume.jobTitle && (
          <p style={{ fontSize: 8, color: "#8a8478", letterSpacing: "0.06em" }}>
            {resume.jobTitle}
          </p>
        )}
      </div>

      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, "classic", accent)}</div>
      ))}
    </>
  );
}

// ── Minimal layout ────────────────────────────────────────

function MinimalLayout({
  resume,
  sections,
  accent = "#c84b2f",
}: {
  resume: ResumeData;
  sections: ResumeSection[];
  accent?: string;
}) {
  const leftSections = sections.filter((s) =>
    ["skills", "certifications", "education"].includes(s.type),
  );
  const rightSections = sections.filter(
    (s) => !["skills", "certifications", "education"].includes(s.type),
  );

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <h1
          className="serif"
          style={{
            fontSize: 24,
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: 2,
          }}
        >
          {resume.title !== "Untitled Resume" ? resume.title : "Your Name"}
        </h1>
        {resume.jobTitle && (
          <p style={{ fontSize: 8.5, color: "#8a8478" }}>{resume.jobTitle}</p>
        )}
        <div style={{ height: 1, background: "#d9d4c7", marginTop: 8 }} />
      </div>

      {/* Two-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <div>
          {leftSections.map((s) => (
            <div key={s.id}>{renderSection(s, "minimal", accent)}</div>
          ))}
        </div>
        <div>
          {rightSections.map((s) => (
            <div key={s.id}>{renderSection(s, "minimal", accent)}</div>
          ))}
        </div>
      </div>
    </>
  );
}
