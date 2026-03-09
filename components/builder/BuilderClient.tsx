// "use client";

// import { useState } from "react";
// import EditorPanel from "./EditorPanel";
// import ResumePreview from "./ResumePreview";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// interface BuilderClientProps {
//   resume: ResumeData;
// }

// export default function BuilderClient({ resume }: BuilderClientProps) {
//   const [sections, setSections] = useState<ResumeSection[]>(resume.sections);

//   return (
//     <div
//       className="flex"
//       style={{
//         height: "calc(100vh - 56px)",
//         marginTop: 56,
//         overflow: "hidden",
//       }}
//     >
//       {/* ── Left: Editor panel ── */}
//       <div
//         className="flex flex-col overflow-hidden flex-shrink-0"
//         style={{
//           width: 380,
//           borderRight: "1px solid var(--rv-border)",
//           background: "var(--rv-paper)",
//         }}
//       >
//         <div
//           className="px-4 py-3 flex-shrink-0"
//           style={{ borderBottom: "1px solid var(--rv-border)" }}
//         >
//           <p
//             className="text-xs font-semibold uppercase tracking-widest"
//             style={{ color: "var(--rv-muted)", letterSpacing: "0.1em" }}
//           >
//             Editor
//           </p>
//         </div>
//         <div className="flex-1 overflow-hidden">
//           <EditorPanel
//             resumeId={resume.id}
//             jobTitle={resume.jobTitle ?? undefined}
//             initialSections={sections}
//             onSectionsChange={setSections}
//           />
//         </div>
//       </div>

//       {/* ── Right: Live preview ── */}
//       <div
//         className="flex-1 overflow-y-auto flex flex-col items-center"
//         style={{ background: "#e8e4dc", padding: "2rem" }}
//       >
//         <div
//           className="text-xs font-semibold uppercase tracking-widest mb-4 self-start"
//           style={{ color: "#a09890", letterSpacing: "0.1em" }}
//         >
//           Preview · {resume.template}
//         </div>

//         {/* A4-ish paper */}
//         <div
//           style={{
//             width: "100%",
//             maxWidth: 640,
//             minHeight: 900,
//             background: "#fdfcfa",
//             boxShadow:
//               "0 8px 32px rgba(15,14,13,0.15), 0 2px 8px rgba(15,14,13,0.08)",
//           }}
//         >
//           <ResumePreview
//             resume={{ ...resume, template: resume.template }}
//             sections={sections}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import StepWizard from "../steps/StepWizard";
// import ResumePreview from "./ResumePreview";
// import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";

// interface BuilderClientProps {
//   resume: ResumeData;
// }

// export default function BuilderClient({ resume }: BuilderClientProps) {
//   const [sections, setSections] = useState<ResumeSection[]>(resume.sections);
//   const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
//     resume.personalInfo,
//   );

//   // Merge personalInfo into resume shape for preview
//   const liveResume: ResumeData = {
//     ...resume,
//     personalInfo,
//     jobTitle: personalInfo?.jobTitle ?? resume.jobTitle,
//     // Use fullName as display title in preview header
//     title: personalInfo?.fullName || resume.title,
//   };

//   return (
//     <div
//       className="flex"
//       style={{
//         height: "calc(100vh - 56px)",
//         marginTop: 56,
//         overflow: "hidden",
//       }}
//     >
//       {/* ── Left: Step wizard ── */}
//       <div
//         className="flex-shrink-0 overflow-hidden"
//         style={{
//           width: 400,
//           borderRight: "1px solid var(--rv-border)",
//           background: "var(--rv-paper)",
//         }}
//       >
//         <StepWizard
//           resume={{ ...resume, personalInfo }}
//           sections={sections}
//           onSectionsChange={setSections}
//           onPersonalInfoChange={setPersonalInfo}
//         />
//       </div>

//       {/* ── Right: Live preview ── */}
//       <div
//         className="flex-1 overflow-y-auto flex flex-col items-center"
//         style={{ background: "#e8e4dc", padding: "2rem" }}
//       >
//         <div
//           className="text-xs font-semibold uppercase tracking-widest mb-4 self-start"
//           style={{ color: "#a09890", letterSpacing: "0.1em" }}
//         >
//           Preview · {resume.template}
//         </div>

//         <div
//           style={{
//             width: "100%",
//             maxWidth: 640,
//             minHeight: 900,
//             background: "#fdfcfa",
//             boxShadow:
//               "0 8px 32px rgba(15,14,13,0.15), 0 2px 8px rgba(15,14,13,0.08)",
//           }}
//         >
//           <ResumePreview resume={liveResume} sections={sections} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import StepWizard from "../steps/StepWizard";
import ResumePreview from "./ResumePreview";
import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";

interface BuilderClientProps {
  resume: ResumeData;
}

export default function BuilderClient({ resume }: BuilderClientProps) {
  const [sections, setSections] = useState<ResumeSection[]>(resume.sections);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
    resume.personalInfo,
  );

  // Build the live preview resume — always reflects latest state
  const liveResume: ResumeData = {
    ...resume,
    personalInfo,
    // jobTitle drives AI context; use personalInfo if available
    jobTitle: personalInfo?.jobTitle ?? resume.jobTitle,
    // title used as fallback name in preview
    title: personalInfo?.fullName || resume.title,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        marginTop: 56,
        overflow: "hidden",
      }}
    >
      {/* ── Left: Step wizard ── */}
      <div
        style={{
          width: 420,
          flexShrink: 0,
          borderRight: "1px solid var(--rv-border)",
          background: "var(--rv-paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StepWizard
          resume={liveResume}
          sections={sections}
          onSectionsChange={setSections}
          onPersonalInfoChange={setPersonalInfo}
        />
      </div>

      {/* ── Right: Live preview ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#e8e4dc",
          padding: "2rem",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#a09890",
            marginBottom: "1rem",
            alignSelf: "flex-start",
          }}
        >
          Preview · {resume.template}
        </div>

        {/* A4-ish paper */}
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            minHeight: 900,
            background: "#fdfcfa",
            boxShadow:
              "0 8px 32px rgba(15,14,13,0.15), 0 2px 8px rgba(15,14,13,0.08)",
          }}
        >
          <ResumePreview resume={liveResume} sections={sections} />
        </div>
      </div>
    </div>
  );
}
