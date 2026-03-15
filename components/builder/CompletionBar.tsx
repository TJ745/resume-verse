// "use client";

// import type { ResumeData, ResumeSection } from "@/types/resume";

// interface Props {
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// interface CheckItem {
//   label: string;
//   done: boolean;
// }

// function computeCompletion(
//   resume: ResumeData,
//   sections: ResumeSection[],
// ): { score: number; checks: CheckItem[] } {
//   const pi = resume.personalInfo;
//   const sec = (type: string) => sections.find((s) => s.type === type);
//   const hasContent = (s: ResumeSection | undefined) => {
//     if (!s) return false;
//     const c = s.content as Record<string, unknown>;
//     if (Array.isArray(c)) return c.length > 0;
//     if (c?.items && Array.isArray(c.items)) return c.items.length > 0;
//     if (c?.text && typeof c.text === "string") return c.text.trim().length > 20;
//     if (c?.skills) return true;
//     return false;
//   };

//   const expSec = sec("experience");
//   const hasBullets = (() => {
//     if (!expSec) return false;
//     const c = expSec.content as Record<string, unknown>;
//     const items = Array.isArray(c) ? c : ((c?.items as unknown[]) ?? []);
//     return items.some((job: unknown) => {
//       const j = job as Record<string, unknown>;
//       const bullets = (j?.bullets as string[]) ?? [];
//       return bullets.some((b) => b.trim().length > 0);
//     });
//   })();

//   const checks: CheckItem[] = [
//     {
//       label: "Full name & job title",
//       done: !!(pi?.fullName?.trim() && pi?.jobTitle?.trim()),
//     },
//     {
//       label: "Contact info (email/phone)",
//       done: !!(pi?.email?.trim() && pi?.phone?.trim()),
//     },
//     { label: "Professional summary", done: hasContent(sec("summary")) },
//     { label: "Work experience added", done: hasContent(sec("experience")) },
//     { label: "Experience has bullets", done: hasBullets },
//     { label: "Education added", done: hasContent(sec("education")) },
//     { label: "Skills added", done: hasContent(sec("skills")) },
//     {
//       label: "LinkedIn or website",
//       done: !!(pi?.linkedin?.trim() || pi?.website?.trim()),
//     },
//   ];

//   const score = Math.round(
//     (checks.filter((c) => c.done).length / checks.length) * 100,
//   );
//   return { score, checks };
// }

// function label(score: number): { text: string; color: string } {
//   if (score < 40) return { text: "Just started", color: "#c84b2f" };
//   if (score < 65) return { text: "In progress", color: "#b7791f" };
//   if (score < 85) return { text: "Looking good", color: "#2d7a4f" };
//   return { text: "Complete", color: "#1e3a5f" };
// }

// export default function CompletionBar({ resume, sections }: Props) {
//   const { score, checks } = computeCompletion(resume, sections);
//   const { text, color } = label(score);
//   const missing = checks.filter((c) => !c.done);

//   return (
//     <div
//       style={{
//         padding: "0.6rem 1rem 0.5rem",
//         borderBottom: "1px solid var(--rv-border)",
//         background: "var(--rv-white)",
//       }}
//     >
//       {/* Row */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           marginBottom: 5,
//         }}
//       >
//         <span
//           style={{
//             fontSize: "0.65rem",
//             fontWeight: 700,
//             letterSpacing: "0.06em",
//             textTransform: "uppercase",
//             color: "var(--rv-muted)",
//             flexShrink: 0,
//           }}
//         >
//           Resume strength
//         </span>
//         <div
//           style={{
//             flex: 1,
//             height: 4,
//             background: "var(--rv-border)",
//             borderRadius: 99,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               height: "100%",
//               width: `${score}%`,
//               background: color,
//               borderRadius: 99,
//               transition: "width 0.4s ease",
//             }}
//           />
//         </div>
//         <span
//           style={{
//             fontSize: "0.65rem",
//             fontWeight: 700,
//             color,
//             flexShrink: 0,
//             minWidth: 28,
//             textAlign: "right",
//           }}
//         >
//           {score}%
//         </span>
//         <span
//           style={{ fontSize: "0.65rem", fontWeight: 600, color, flexShrink: 0 }}
//         >
//           {text}
//         </span>
//       </div>

//       {/* Missing items hint */}
//       {missing.length > 0 && (
//         <p
//           style={{
//             fontSize: "0.62rem",
//             color: "var(--rv-muted)",
//             margin: 0,
//             lineHeight: 1.4,
//           }}
//         >
//           Missing:{" "}
//           {missing
//             .slice(0, 3)
//             .map((c) => c.label)
//             .join(" · ")}
//           {missing.length > 3 && ` +${missing.length - 3} more`}
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import type { ResumeData, ResumeSection } from "@/types/resume";

interface Props {
  resume: ResumeData;
  sections: ResumeSection[];
}

interface CheckItem {
  label: string;
  done: boolean;
}

function computeCompletion(
  resume: ResumeData,
  sections: ResumeSection[],
): { score: number; checks: CheckItem[] } {
  const pi = resume.personalInfo;
  const sec = (type: string) => sections.find((s) => s.type === type);
  const hasContent = (s: ResumeSection | undefined) => {
    if (!s) return false;
    const c = s.content as Record<string, unknown>;
    if (Array.isArray(c)) return c.length > 0;
    if (c?.items && Array.isArray(c.items)) return c.items.length > 0;
    if (c?.text && typeof c.text === "string") return c.text.trim().length > 20;
    if (c?.skills) return true;
    return false;
  };

  const expSec = sec("experience");
  const hasBullets = (() => {
    if (!expSec) return false;
    const c = expSec.content as Record<string, unknown>;
    const items = Array.isArray(c) ? c : ((c?.items as unknown[]) ?? []);
    return items.some((job: unknown) => {
      const j = job as Record<string, unknown>;
      const bullets = (j?.bullets as string[]) ?? [];
      return bullets.some((b) => b.trim().length > 0);
    });
  })();

  const checks: CheckItem[] = [
    {
      label: "Full name & job title",
      done: !!(pi?.fullName?.trim() && pi?.jobTitle?.trim()),
    },
    {
      label: "Contact info (email/phone)",
      done: !!(pi?.email?.trim() && pi?.phone?.trim()),
    },
    { label: "Professional summary", done: hasContent(sec("summary")) },
    { label: "Work experience added", done: hasContent(sec("experience")) },
    { label: "Experience has bullets", done: hasBullets },
    { label: "Education added", done: hasContent(sec("education")) },
    { label: "Skills added", done: hasContent(sec("skills")) },
    {
      label: "LinkedIn or website",
      done: !!(pi?.linkedin?.trim() || pi?.website?.trim()),
    },
  ];

  const score = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100,
  );
  return { score, checks };
}

function label(score: number): { text: string; color: string } {
  if (score < 40) return { text: "Just started", color: "#c84b2f" };
  if (score < 65) return { text: "In progress", color: "#b7791f" };
  if (score < 85) return { text: "Looking good", color: "#2d7a4f" };
  return { text: "Complete", color: "#1e3a5f" };
}

export default function CompletionBar({ resume, sections }: Props) {
  const { score, checks } = computeCompletion(resume, sections);
  const { text, color } = label(score);
  const missing = checks.filter((c) => !c.done);

  return (
    <div
      style={{
        padding: "0.6rem 1rem 0.5rem",
        borderBottom: "1px solid var(--rv-border)",
        background: "var(--rv-white)",
      }}
    >
      {/* Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--rv-muted)",
            flexShrink: 0,
          }}
        >
          Resume strength
        </span>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "var(--rv-border)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${score}%`,
              background: color,
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color,
            flexShrink: 0,
            minWidth: 28,
            textAlign: "right",
          }}
        >
          {score}%
        </span>
        <span
          style={{ fontSize: "0.65rem", fontWeight: 600, color, flexShrink: 0 }}
        >
          {text}
        </span>
      </div>

      {/* Missing items hint */}
      {missing.length > 0 && (
        <p
          style={{
            fontSize: "0.62rem",
            color: "var(--rv-muted)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Missing:{" "}
          {missing
            .slice(0, 3)
            .map((c) => c.label)
            .join(" · ")}
          {missing.length > 3 && ` +${missing.length - 3} more`}
        </p>
      )}
    </div>
  );
}
