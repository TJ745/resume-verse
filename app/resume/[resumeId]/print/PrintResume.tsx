// // PrintResume — renders the resume for Puppeteer PDF and public share.
// // Applies the user's selected font family, font size scale, template and color scheme.

// import {
//   ModernTemplate,
//   ClassicTemplate,
//   MinimalTemplate,
//   ExecutiveTemplate,
//   CompactTemplate,
//   CreativeTemplate,
//   ElegantTemplate,
//   TechnicalTemplate,
//   ChronologicalTemplate,
//   BoldTemplate,
//   getAccent,
//   getName,
// } from "@/components/templates";
// import {
//   RESUME_FONTS,
//   FONT_SIZES,
//   DEFAULT_FONT,
//   DEFAULT_FONT_SIZE,
// } from "@/lib/resume-constants";
// import type {
//   ResumeData,
//   ResumeSection,
//   SectionType,
//   PersonalInfo,
// } from "@/types/resume";

// interface PrintResumeProps {
//   resume: ResumeData;
//   isPro?: boolean;
// }

// function coerce(resume: ResumeData): ResumeData {
//   return {
//     ...resume,
//     sections: (resume.sections ?? []).map((s) => ({
//       id: s.id,
//       resumeId: s.resumeId,
//       type: s.type as SectionType,
//       title: s.title,
//       content: s.content as ResumeSection["content"],
//       order: s.order,
//     })),
//     personalInfo: resume.personalInfo as PersonalInfo | null,
//   };
// }

// export default function PrintResume({
//   resume: raw,
//   isPro = false,
// }: PrintResumeProps) {
//   const resume = coerce(raw);
//   const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
//   const accent = getAccent(resume.colorScheme);
//   const tplProps = {
//     resume: { ...resume, sections: sorted },
//     sections: sorted,
//     accent,
//   };

//   // Resolve font
//   const fontId = resume.font ?? DEFAULT_FONT;
//   const sizeId = resume.fontSize ?? DEFAULT_FONT_SIZE;
//   const fontDef = RESUME_FONTS.find((f) => f.id === fontId) ?? RESUME_FONTS[0];
//   const sizeDef = FONT_SIZES.find((s) => s.id === sizeId) ?? FONT_SIZES[2];
//   const scale = sizeDef.scale;

//   // Build Google Fonts URL — always include Instrument Serif for serif accents in templates
//   const googleFamilies = ["Instrument+Serif:ital@0;1"];
//   if (fontDef.google && !fontDef.google.startsWith("Instrument")) {
//     googleFamilies.push(fontDef.google);
//   }
//   const googleUrl = `https://fonts.googleapis.com/css2?family=${googleFamilies.join("&family=")}&display=swap`;

//   const Template = (() => {
//     switch (resume.template) {
//       case "classic":
//         return <ClassicTemplate {...tplProps} />;
//       case "minimal":
//         return <MinimalTemplate {...tplProps} />;
//       case "executive":
//         return <ExecutiveTemplate {...tplProps} />;
//       case "compact":
//         return <CompactTemplate {...tplProps} />;
//       case "creative":
//         return <CreativeTemplate {...tplProps} />;
//       case "elegant":
//         return <ElegantTemplate {...tplProps} />;
//       case "technical":
//         return <TechnicalTemplate {...tplProps} />;
//       case "chronological":
//         return <ChronologicalTemplate {...tplProps} />;
//       case "bold":
//         return <BoldTemplate {...tplProps} />;
//       default:
//         return <ModernTemplate {...tplProps} />;
//     }
//   })();

//   return (
//     // <html lang="en">
//     //   <head>
//     //     <meta charSet="utf-8" />
//     //     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     //     <title>{getName(resume)}</title>
//     //     <link href={googleUrl} rel="stylesheet" />
//     //     <style>{`
//     //       *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//     //       html, body {
//     //         width: 210mm;
//     //         min-height: 297mm;
//     //         /* Apply selected font family */
//     //         font-family: ${fontDef.stack};
//     //         background: #ffffff;
//     //         color: #0f0e0d;
//     //         -webkit-print-color-adjust: exact;
//     //         print-color-adjust: exact;
//     //       }
//     //       @page { size: A4; margin: 0; }
//     //       @media print { html, body { width: 210mm; min-height: 297mm; } }
//     //       .page {
//     //         width: 210mm;
//     //         min-height: 297mm;
//     //         /* Font size scale — all em-relative sizes in templates scale with this */
//     //         font-size: ${scale}em;
//     //       }
//     //     `}</style>
//     //   </head>
//     //   <body>
//     <>
//       <div className="page">{Template}</div>
//       {!isPro && (
//         <div
//           style={{
//             width: "210mm",
//             padding: "4px 16mm",
//             background: "#f5f3ef",
//             borderTop: "1px solid #e8e4dc",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 5,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 6.5,
//               color: "#8a8478",
//               fontFamily: "DM Sans, sans-serif",
//               letterSpacing: "0.04em",
//             }}
//           >
//             Created with{" "}
//             <strong
//               style={{
//                 color: "#c84b2f",
//                 fontWeight: 700,
//                 fontFamily: "Instrument Serif, serif",
//                 fontStyle: "italic",
//               }}
//             >
//               ResumeVerse
//             </strong>{" "}
//             — resumeverse.com · Upgrade to Pro to remove this watermark
//           </span>
//         </div>
//       )}
//     </>

//     //   </body>
//     // </html>
//   );
// }

// PrintResume — renders the resume for Puppeteer PDF and public share.
// Applies the user's selected font family, font size scale, template and color scheme.

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
import {
  RESUME_FONTS,
  FONT_SIZES,
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
} from "@/lib/resume-constants";
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

  // Resolve font
  const fontId = resume.font ?? DEFAULT_FONT;
  const sizeId = resume.fontSize ?? DEFAULT_FONT_SIZE;
  const fontDef = RESUME_FONTS.find((f) => f.id === fontId) ?? RESUME_FONTS[0];
  const sizeDef = FONT_SIZES.find((s) => s.id === sizeId) ?? FONT_SIZES[2];
  const scale = sizeDef.scale;
  const basePx = Math.round(13 * scale); // same base as ResumePreview

  // Build Google Fonts URL — always include Instrument Serif for serif accents in templates
  const googleFamilies = ["Instrument+Serif:ital@0;1"];
  if (fontDef.google && !fontDef.google.startsWith("Instrument")) {
    googleFamilies.push(fontDef.google);
  }
  const googleUrl = `https://fonts.googleapis.com/css2?family=${googleFamilies.join("&family=")}&display=swap`;

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
    //     <link href={googleUrl} rel="stylesheet" />
    //     <style>{`
    //       *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    //       html, body {
    //         width: 210mm;
    //         min-height: 297mm;
    //         font-family: ${fontDef.stack};
    //         background: #ffffff;
    //         color: #0f0e0d;
    //         -webkit-print-color-adjust: exact;
    //         print-color-adjust: exact;
    //       }
    //       @page { size: A4; margin: 0; }
    //       @media print { html, body { width: 210mm; min-height: 297mm; } }
    //       .page {
    //         width: 210mm;
    //         min-height: 297mm;
    //         /* Base font-size drives all em values in templates — same as ResumePreview */
    //         font-size: ${basePx}px;
    //       }
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
