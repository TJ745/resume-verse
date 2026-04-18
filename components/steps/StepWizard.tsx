// "use client";

// import { useState } from "react";
// import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";
// import Step1PersonalInfo from "./Step1PersonalInfo";
// import Step2Profile from "./Step2Profile";
// import Step3Experience from "./Step3Experience";
// import Step4Education from "./Step4Education";

// const STEPS = [
//   { number: 1, label: "Personal" },
//   { number: 2, label: "Profile" },
//   { number: 3, label: "Experience" },
//   { number: 4, label: "Education" },
// ] as const;

// interface StepWizardProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
//   onSectionsChange: (s: ResumeSection[]) => void;
//   onPersonalInfoChange: (p: PersonalInfo) => void;
// }

// export default function StepWizard({
//   resume,
//   sections,
//   onSectionsChange,
//   onPersonalInfoChange,
// }: StepWizardProps) {
//   const [step, setStep] = useState(1);
//   const [finished, setFinished] = useState(false);

//   const isLast = step === STEPS.length;
//   const isFirst = step === 1;

//   function goTo(n: number) {
//     if (n >= 1 && n <= STEPS.length) setStep(n);
//   }

//   function handleNext() {
//     if (isLast) {
//       setFinished(true);
//       setTimeout(() => setFinished(false), 3000);
//     } else {
//       goTo(step + 1);
//     }
//   }

//   return (
//     <div className="flex flex-col h-full overflow-hidden">
//       {/* ── Step indicator ── */}
//       <div className="flex items-stretch shrink-0 h-12 border-b border-rv-border bg-rv-paper overflow-x-auto">
//         {STEPS.map((s) => {
//           const isActive = s.number === step;
//           const isComplete = s.number < step;
//           return (
//             <button
//               key={s.number}
//               type="button"
//               onClick={() => goTo(s.number)}
//               className={[
//                 "flex items-center gap-1.5 shrink-0 bg-transparent border-0 border-b-2 cursor-pointer px-3.5 h-full transition-colors duration-150",
//                 isActive ? "border-rv-accent" : "border-transparent",
//               ].join(" ")}
//             >
//               <span
//                 className={[
//                   "w-4.5 h-4.5 rounded-full text-[0.58rem] font-bold flex items-center justify-center shrink-0 transition-colors duration-150",
//                   isActive
//                     ? "bg-rv-accent text-white"
//                     : isComplete
//                       ? "bg-[#2d8a4e] text-white"
//                       : "bg-rv-border text-rv-muted",
//                 ].join(" ")}
//               >
//                 {isComplete ? "✓" : s.number}
//               </span>
//               <span
//                 className={[
//                   "text-[0.75rem] whitespace-nowrap transition-colors duration-150",
//                   isActive
//                     ? "font-semibold text-rv-ink"
//                     : isComplete
//                       ? "text-[#2d8a4e]"
//                       : "text-rv-muted",
//                 ].join(" ")}
//               >
//                 {s.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Step content ── */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {step === 1 && (
//           <Step1PersonalInfo
//             resumeId={resume.id}
//             personalInfo={resume.personalInfo}
//             onSave={onPersonalInfoChange}
//           />
//         )}
//         {step === 2 && (
//           <Step2Profile
//             resumeId={resume.id}
//             jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""}
//             sections={sections}
//             onSectionsChange={onSectionsChange}
//           />
//         )}
//         {step === 3 && (
//           <Step3Experience
//             resumeId={resume.id}
//             jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""}
//             sections={sections}
//             onSectionsChange={onSectionsChange}
//           />
//         )}
//         {step === 4 && (
//           <Step4Education
//             resumeId={resume.id}
//             sections={sections}
//             onSectionsChange={onSectionsChange}
//           />
//         )}
//       </div>

//       {/* ── Navigation ── */}
//       <div className="flex items-center justify-between shrink-0 px-4 py-2.5 border-t border-rv-border bg-rv-paper gap-3">
//         <button
//           type="button"
//           onClick={() => goTo(step - 1)}
//           disabled={isFirst}
//           className="border border-rv-border rounded-sm px-4 py-1.5 text-[0.78rem] font-medium text-rv-muted bg-transparent cursor-pointer disabled:cursor-not-allowed disabled:text-rv-border hover:border-rv-ink hover:text-rv-ink transition-colors"
//         >
//           ← Back
//         </button>

//         <span className="text-[0.7rem] text-rv-muted">
//           {step} / {STEPS.length}
//         </span>

//         <button
//           type="button"
//           onClick={handleNext}
//           className={[
//             "border-0 rounded-sm px-4 py-1.5 text-[0.78rem] font-semibold text-white cursor-pointer transition-colors duration-150",
//             finished
//               ? "bg-[#2d8a4e]"
//               : isLast
//                 ? "bg-[#2d8a4e] hover:bg-rv-ink"
//                 : "bg-rv-ink hover:bg-rv-accent",
//           ].join(" ")}
//         >
//           {finished
//             ? "✓ All saved!"
//             : isLast
//               ? "Save & Finish ✓"
//               : "Save & Next →"}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2Profile      from "./Step2Profile";
import Step3Experience   from "./Step3Experience";
import Step4Education    from "./Step4Education";

const STEPS = [
  { number: 1, label: "Personal"   },
  { number: 2, label: "Profile"    },
  { number: 3, label: "Experience" },
  { number: 4, label: "Education"  },
] as const;

interface StepWizardProps {
  resume:              ResumeData;
  sections:            ResumeSection[];
  onSectionsChange:    (s: ResumeSection[]) => void;
  onPersonalInfoChange:(p: PersonalInfo) => void;
}

export default function StepWizard({ resume, sections, onSectionsChange, onPersonalInfoChange }: StepWizardProps) {
  const [step,     setStep]     = useState(1);
  const [finished, setFinished] = useState(false);

  const isLast  = step === STEPS.length;
  const isFirst = step === 1;

  function goTo(n: number) {
    if (n >= 1 && n <= STEPS.length) setStep(n);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      setTimeout(() => setFinished(false), 3000);
    } else {
      goTo(step + 1);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Step indicator ── */}
      <div className="flex items-stretch shrink-0 h-12 border-b border-rv-border bg-rv-paper overflow-x-auto">
        {STEPS.map((s) => {
          const isActive   = s.number === step;
          const isComplete = s.number < step;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => goTo(s.number)}
              className={[
                "flex items-center gap-1.5 shrink-0 bg-transparent border-0 border-b-2 cursor-pointer px-3.5 h-full transition-colors duration-150",
                isActive ? "border-rv-accent" : "border-transparent",
              ].join(" ")}
            >
              <span className={[
                "w-[18px] h-[18px] rounded-full text-[0.58rem] font-bold flex items-center justify-center shrink-0 transition-colors duration-150",
                isActive   ? "bg-rv-accent text-white" :
                isComplete ? "bg-[#2d8a4e] text-white" :
                             "bg-rv-border text-rv-muted",
              ].join(" ")}>
                {isComplete ? "✓" : s.number}
              </span>
              <span className={[
                "text-[0.75rem] whitespace-nowrap transition-colors duration-150",
                isActive   ? "font-semibold text-rv-ink" :
                isComplete ? "text-[#2d8a4e]" :
                             "text-rv-muted",
              ].join(" ")}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 && (
          <Step1PersonalInfo resumeId={resume.id} personalInfo={resume.personalInfo} onSave={onPersonalInfoChange} colorScheme={resume.colorScheme ?? "terracotta"} />
        )}
        {step === 2 && (
          <Step2Profile resumeId={resume.id} jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""} sections={sections} onSectionsChange={onSectionsChange} />
        )}
        {step === 3 && (
          <Step3Experience resumeId={resume.id} jobTitle={resume.personalInfo?.jobTitle ?? resume.jobTitle ?? ""} sections={sections} onSectionsChange={onSectionsChange} />
        )}
        {step === 4 && (
          <Step4Education resumeId={resume.id} sections={sections} onSectionsChange={onSectionsChange} />
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between shrink-0 px-4 py-2.5 border-t border-rv-border bg-rv-paper gap-3">
        <button
          type="button"
          onClick={() => goTo(step - 1)}
          disabled={isFirst}
          className="border border-rv-border rounded-sm px-4 py-1.5 text-[0.78rem] font-medium text-rv-muted bg-transparent cursor-pointer disabled:cursor-not-allowed disabled:text-rv-border hover:border-rv-ink hover:text-rv-ink transition-colors"
        >
          ← Back
        </button>

        <span className="text-[0.7rem] text-rv-muted">{step} / {STEPS.length}</span>

        <button
          type="button"
          onClick={handleNext}
          className={[
            "border-0 rounded-sm px-4 py-1.5 text-[0.78rem] font-semibold text-white cursor-pointer transition-colors duration-150",
            finished
              ? "bg-[#2d8a4e]"
              : isLast
              ? "bg-[#2d8a4e] hover:bg-rv-ink"
              : "bg-rv-ink hover:bg-rv-accent",
          ].join(" ")}
        >
          {finished ? "✓ All saved!" : isLast ? "Save & Finish ✓" : "Save & Next →"}
        </button>
      </div>
    </div>
  );
}