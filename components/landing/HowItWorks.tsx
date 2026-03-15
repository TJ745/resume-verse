// "use client";

// const steps = [
//   {
//     num: "1",
//     title: "Create account",
//     description:
//       "Sign up free. No credit card needed. Your resumes are saved securely to your account.",
//   },
//   {
//     num: "2",
//     title: "Pick a template",
//     description:
//       "Choose from Modern, Classic, or Minimal. You can switch anytime without losing content.",
//   },
//   {
//     num: "3",
//     title: "Let AI write it",
//     description:
//       "Fill in your job title and experience. GPT generates polished, ATS-optimized content instantly.",
//   },
//   {
//     num: "4",
//     title: "Export as PDF",
//     description:
//       "One click to download a perfect PDF. Share it anywhere, anytime.",
//   },
// ];

// export default function HowItWorks() {
//   return (
//     <section
//       id="how"
//       style={{
//         padding: "8rem 4rem",
//         borderTop: "1px solid var(--rv-border)",
//       }}
//     >
//       <div
//         className="uppercase font-semibold tracking-widest mb-4"
//         style={{
//           fontSize: "0.7rem",
//           letterSpacing: "0.12em",
//           color: "var(--rv-accent)",
//         }}
//       >
//         How it works
//       </div>
//       <h2
//         className="font-serif"
//         style={{
//           fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
//           lineHeight: 1.1,
//           letterSpacing: "-0.025em",
//         }}
//       >
//         From blank page to
//         <br />
//         <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
//           dream job
//         </em>{" "}
//         in 4 steps.
//       </h2>

//       <div
//         className="grid mt-20"
//         style={{
//           gridTemplateColumns: "repeat(4, 1fr)",
//           border: "1px solid var(--rv-border)",
//         }}
//       >
//         {steps.map((step, i) => (
//           <div
//             key={step.num}
//             className="relative"
//             style={{
//               padding: "3rem 2rem",
//               borderRight:
//                 i < steps.length - 1 ? "1px solid var(--rv-border)" : "none",
//             }}
//           >
//             <div
//               className="font-serif mb-6"
//               style={{
//                 fontSize: "4rem",
//                 color: "var(--rv-cream)",
//                 lineHeight: 1,
//               }}
//             >
//               {step.num}
//             </div>

//             {/* Arrow connector (not on last step) */}
//             {i < steps.length - 1 && (
//               <div
//                 className="absolute flex items-center justify-center"
//                 style={{
//                   top: "3rem",
//                   right: -12,
//                   width: 24,
//                   height: 24,
//                   background: "var(--rv-paper)",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: "50%",
//                   zIndex: 1,
//                   fontSize: "0.7rem",
//                   color: "var(--rv-muted)",
//                 }}
//               >
//                 →
//               </div>
//             )}

//             <h3
//               className="font-serif mb-3"
//               style={{ fontSize: "1.25rem", letterSpacing: "-0.02em" }}
//             >
//               {step.title}
//             </h3>
//             <p
//               style={{
//                 fontSize: "0.875rem",
//                 lineHeight: 1.65,
//                 color: "var(--rv-muted)",
//               }}
//             >
//               {step.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

const steps = [
  {
    num: "1",
    title: "Create free account",
    description:
      "Sign up in seconds. No credit card needed. Your resumes are saved securely and accessible from any device.",
  },
  {
    num: "2",
    title: "Build with AI",
    description:
      "Pick from 10 professional templates, fill in your experience, and let GPT write polished, ATS-optimized bullet points for every role.",
  },
  {
    num: "3",
    title: "Optimize for the job",
    description:
      "Paste any job description. ResumeVerse scores your ATS match, highlights missing keywords, and rewrites your resume to fit — in one click.",
  },
  {
    num: "4",
    title: "Land more interviews",
    description:
      "Export as PDF or DOCX, generate a tailored cover letter, and practice with AI-generated interview questions — all before you hit send.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        padding: "8rem 4rem",
        borderTop: "1px solid var(--rv-border)",
      }}
    >
      <div
        className="uppercase font-semibold tracking-widest mb-4"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          color: "var(--rv-accent)",
        }}
      >
        How it works
      </div>
      <h2
        className="font-serif"
        style={{
          fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
        }}
      >
        From blank page to
        <br />
        <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
          dream job
        </em>{" "}
        in 4 steps.
      </h2>

      <div
        className="grid mt-20"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid var(--rv-border)",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.num}
            className="relative"
            style={{
              padding: "3rem 2rem",
              borderRight:
                i < steps.length - 1 ? "1px solid var(--rv-border)" : "none",
            }}
          >
            <div
              className="font-serif mb-6"
              style={{
                fontSize: "4rem",
                color: "var(--rv-cream)",
                lineHeight: 1,
              }}
            >
              {step.num}
            </div>

            {/* Arrow connector (not on last step) */}
            {i < steps.length - 1 && (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: "3rem",
                  right: -12,
                  width: 24,
                  height: 24,
                  background: "var(--rv-paper)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: "50%",
                  zIndex: 1,
                  fontSize: "0.7rem",
                  color: "var(--rv-muted)",
                }}
              >
                →
              </div>
            )}

            <h3
              className="font-serif mb-3"
              style={{ fontSize: "1.25rem", letterSpacing: "-0.02em" }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "var(--rv-muted)",
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
