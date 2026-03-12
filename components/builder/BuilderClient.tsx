// "use client";

// import { useState } from "react";
// import BuilderTopbar from "./BuilderTopbar";
// import StepWizard from "../steps/StepWizard";
// import ResumePreview from "./ResumePreview";
// import ATSPanel from "./ATSPanel";
// import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";

// interface BuilderClientProps {
//   resume: ResumeData;
// }

// export default function BuilderClient({ resume }: BuilderClientProps) {
//   const [sections, setSections] = useState<ResumeSection[]>(resume.sections);
//   const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
//     resume.personalInfo,
//   );
//   const [atsOpen, setAtsOpen] = useState(false);

//   // Live preview resume — always reflects latest UI state
//   const liveResume: ResumeData = {
//     ...resume,
//     personalInfo,
//     jobTitle: personalInfo?.jobTitle ?? resume.jobTitle,
//     title: resume.title,
//   };

//   return (
//     <>
//       {/* Topbar lives here so it can share atsOpen state */}
//       <BuilderTopbar
//         resumeId={resume.id}
//         title={resume.title}
//         template={resume.template}
//         colorScheme={resume.colorScheme}
//         onATSOpen={() => setAtsOpen(true)}
//       />

//       <div
//         style={{
//           display: "flex",
//           height: "calc(100vh - 56px)",
//           marginTop: 56,
//           overflow: "hidden",
//         }}
//       >
//         {/* ── Left: Step wizard ── */}
//         <div
//           style={{
//             width: 420,
//             flexShrink: 0,
//             borderRight: "1px solid var(--rv-border)",
//             background: "var(--rv-paper)",
//             overflow: "hidden",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <StepWizard
//             resume={liveResume}
//             sections={sections}
//             onSectionsChange={setSections}
//             onPersonalInfoChange={setPersonalInfo}
//           />
//         </div>

//         {/* ── Right: Preview ── */}
//         <div
//           style={{
//             flex: 1,
//             overflow: "auto",
//             background: "var(--rv-cream)",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: "2rem 1.5rem",
//             gap: "0.75rem",
//           }}
//         >
//           {/* Label */}
//           <div
//             style={{
//               fontSize: "0.6rem",
//               fontWeight: 600,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "var(--rv-muted)",
//             }}
//           >
//             Preview · {liveResume.template}
//           </div>

//           {/* A4-ish paper */}
//           <div
//             style={{
//               width: "100%",
//               maxWidth: 640,
//               minHeight: 900,
//               background: "#fdfcfa",
//               boxShadow:
//                 "0 8px 32px rgba(15,14,13,0.15), 0 2px 8px rgba(15,14,13,0.08)",
//             }}
//           >
//             <ResumePreview
//               resume={liveResume}
//               sections={sections}
//               onSectionsChange={setSections}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ATS Panel */}
//       <ATSPanel
//         open={atsOpen}
//         onClose={() => setAtsOpen(false)}
//         resume={liveResume}
//         sections={sections}
//       />
//     </>
//   );
// }

"use client";

import { useState } from "react";
import BuilderTopbar from "./BuilderTopbar";
import StepWizard from "../steps/StepWizard";
import ResumePreview from "./ResumePreview";
import ATSPanel from "./ATSPanel";
import JDMatchPanel from "./JDMatchPanel";
import CoverLetterPanel from "./CoverLetterPanel";
import GrammarPanel from "./GrammarPanel";
import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";

interface BuilderClientProps {
  resume: ResumeData;
}

export default function BuilderClient({ resume }: BuilderClientProps) {
  const [sections, setSections] = useState<ResumeSection[]>(resume.sections);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
    resume.personalInfo,
  );

  // One panel open at a time
  const [panel, setPanel] = useState<"ats" | "jd" | "cover" | "grammar" | null>(
    null,
  );

  const liveResume: ResumeData = {
    ...resume,
    personalInfo,
    jobTitle: personalInfo?.jobTitle ?? resume.jobTitle,
    title: resume.title,
  };

  const closePanel = () => setPanel(null);

  return (
    <>
      <BuilderTopbar
        resumeId={resume.id}
        title={resume.title}
        template={resume.template}
        colorScheme={resume.colorScheme}
        onATSOpen={() => setPanel("ats")}
        onJDMatchOpen={() => setPanel("jd")}
        onCoverLetterOpen={() => setPanel("cover")}
        onGrammarOpen={() => setPanel("grammar")}
      />

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

        {/* ── Right: Preview ── */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "var(--rv-cream)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem 1.5rem",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
            }}
          >
            Preview · {liveResume.template}
          </div>
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
            <ResumePreview
              resume={liveResume}
              sections={sections}
              onSectionsChange={setSections}
            />
          </div>
        </div>
      </div>

      {/* ── Smart Tool Panels — one shown at a time ── */}
      <ATSPanel
        open={panel === "ats"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
      />
      <JDMatchPanel
        open={panel === "jd"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        onSectionsChange={setSections}
      />
      <CoverLetterPanel
        open={panel === "cover"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
      />
      <GrammarPanel
        open={panel === "grammar"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        onSectionsChange={setSections}
      />
    </>
  );
}
