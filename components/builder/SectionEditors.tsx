// "use client";

// import { useState } from "react";
// import type {
//   SummaryContent,
//   ExperienceItem,
//   EducationItem,
//   SkillsContent,
//   ProjectItem,
//   CertificationItem,
// } from "@/types/resume";

// // ── Shared input styles ───────────────────────────────────

// const inputCls: React.CSSProperties = {
//   width: "100%",
//   padding: "0.5rem 0.75rem",
//   border: "1px solid var(--rv-border)",
//   borderRadius: 2,
//   background: "var(--rv-white)",
//   color: "var(--rv-ink)",
//   fontSize: "0.875rem",
//   outline: "none",
//   fontFamily: "inherit",
// };

// const labelCls: React.CSSProperties = {
//   fontSize: "0.75rem",
//   fontWeight: 500,
//   color: "var(--rv-muted)",
//   marginBottom: "0.25rem",
//   display: "block",
// };

// function Field({
//   label,
//   children,
// }: {
//   label: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col" style={{ gap: 4 }}>
//       <label style={labelCls}>{label}</label>
//       {children}
//     </div>
//   );
// }

// function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
//   return (
//     <button
//       onClick={onClick}
//       className="text-sm font-medium transition-colors duration-150"
//       style={{
//         background: "none",
//         border: "1px dashed var(--rv-border)",
//         borderRadius: 2,
//         padding: "0.5rem 1rem",
//         cursor: "pointer",
//         color: "var(--rv-muted)",
//         fontFamily: "inherit",
//         width: "100%",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.borderColor = "var(--rv-accent)";
//         e.currentTarget.style.color = "var(--rv-accent)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.borderColor = "var(--rv-border)";
//         e.currentTarget.style.color = "var(--rv-muted)";
//       }}
//     >
//       + {label}
//     </button>
//   );
// }

// function RemoveButton({ onClick }: { onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         background: "none",
//         border: "none",
//         cursor: "pointer",
//         color: "var(--rv-muted)",
//         fontSize: "0.75rem",
//         padding: "0 0.25rem",
//         fontFamily: "inherit",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rv-accent)")}
//       onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rv-muted)")}
//     >
//       Remove
//     </button>
//   );
// }

// // ── Summary ───────────────────────────────────────────────

// export function SummaryEditor({
//   content,
//   onChange,
// }: {
//   content: SummaryContent;
//   onChange: (c: SummaryContent) => void;
// }) {
//   return (
//     <Field label="Professional summary">
//       <textarea
//         value={content.text}
//         onChange={(e) => onChange({ text: e.target.value })}
//         rows={5}
//         placeholder="Write 2–4 sentences about your background, key skills, and what you bring to the role…"
//         style={{ ...inputCls, resize: "vertical", lineHeight: 1.6 }}
//       />
//     </Field>
//   );
// }

// // ── Experience ────────────────────────────────────────────

// function newExp(): ExperienceItem {
//   return {
//     id: crypto.randomUUID(),
//     company: "",
//     role: "",
//     location: "",
//     startDate: "",
//     endDate: "",
//     current: false,
//     bullets: [""],
//   };
// }

// export function ExperienceEditor({
//   content,
//   onChange,
// }: {
//   content: ExperienceItem[];
//   onChange: (c: ExperienceItem[]) => void;
// }) {
//   function update(id: string, patch: Partial<ExperienceItem>) {
//     onChange(content.map((e) => (e.id === id ? { ...e, ...patch } : e)));
//   }

//   function remove(id: string) {
//     onChange(content.filter((e) => e.id !== id));
//   }

//   function addBullet(id: string) {
//     update(id, {
//       bullets: [...(content.find((e) => e.id === id)?.bullets ?? []), ""],
//     });
//   }

//   function updateBullet(id: string, idx: number, val: string) {
//     const exp = content.find((e) => e.id === id);
//     if (!exp) return;
//     const bullets = [...exp.bullets];
//     bullets[idx] = val;
//     update(id, { bullets });
//   }

//   function removeBullet(id: string, idx: number) {
//     const exp = content.find((e) => e.id === id);
//     if (!exp) return;
//     update(id, { bullets: exp.bullets.filter((_, i) => i !== idx) });
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {content.map((exp, i) => (
//         <div
//           key={exp.id}
//           className="flex flex-col gap-3 p-4"
//           style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
//         >
//           <div className="flex items-center justify-between">
//             <span
//               className="text-xs font-semibold uppercase tracking-wider"
//               style={{ color: "var(--rv-muted)" }}
//             >
//               Position {i + 1}
//             </span>
//             <RemoveButton onClick={() => remove(exp.id)} />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Company">
//               <input
//                 style={inputCls}
//                 value={exp.company}
//                 onChange={(e) => update(exp.id, { company: e.target.value })}
//                 placeholder="Acme Inc."
//               />
//             </Field>
//             <Field label="Job title">
//               <input
//                 style={inputCls}
//                 value={exp.role}
//                 onChange={(e) => update(exp.id, { role: e.target.value })}
//                 placeholder="Software Engineer"
//               />
//             </Field>
//             <Field label="Location">
//               <input
//                 style={inputCls}
//                 value={exp.location}
//                 onChange={(e) => update(exp.id, { location: e.target.value })}
//                 placeholder="New York, NY"
//               />
//             </Field>
//             <Field label="Start date">
//               <input
//                 style={inputCls}
//                 value={exp.startDate}
//                 onChange={(e) => update(exp.id, { startDate: e.target.value })}
//                 placeholder="Jan 2022"
//               />
//             </Field>
//             {!exp.current && (
//               <Field label="End date">
//                 <input
//                   style={inputCls}
//                   value={exp.endDate}
//                   onChange={(e) => update(exp.id, { endDate: e.target.value })}
//                   placeholder="Dec 2023"
//                 />
//               </Field>
//             )}
//           </div>

//           <label
//             className="flex items-center gap-2 text-sm cursor-pointer"
//             style={{ color: "var(--rv-ink)" }}
//           >
//             <input
//               type="checkbox"
//               checked={exp.current}
//               onChange={(e) =>
//                 update(exp.id, { current: e.target.checked, endDate: "" })
//               }
//             />
//             Currently working here
//           </label>

//           <div className="flex flex-col gap-2">
//             <span style={labelCls}>Bullet points</span>
//             {exp.bullets.map((b, idx) => (
//               <div key={idx} className="flex gap-2 items-start">
//                 <span
//                   style={{
//                     color: "var(--rv-muted)",
//                     paddingTop: "0.45rem",
//                     fontSize: "0.75rem",
//                   }}
//                 >
//                   •
//                 </span>
//                 <textarea
//                   value={b}
//                   onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
//                   rows={2}
//                   placeholder="Describe an achievement or responsibility…"
//                   style={{ ...inputCls, flex: 1, resize: "vertical" }}
//                 />
//                 {exp.bullets.length > 1 && (
//                   <button
//                     onClick={() => removeBullet(exp.id, idx)}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: "var(--rv-muted)",
//                       paddingTop: "0.45rem",
//                       fontSize: "1rem",
//                       fontFamily: "inherit",
//                     }}
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>
//             ))}
//             <AddButton onClick={() => addBullet(exp.id)} label="Add bullet" />
//           </div>
//         </div>
//       ))}
//       <AddButton
//         onClick={() => onChange([...content, newExp()])}
//         label="Add position"
//       />
//     </div>
//   );
// }

// // ── Education ─────────────────────────────────────────────

// function newEdu(): EducationItem {
//   return {
//     id: crypto.randomUUID(),
//     institution: "",
//     degree: "",
//     field: "",
//     startDate: "",
//     endDate: "",
//     gpa: "",
//   };
// }

// export function EducationEditor({
//   content,
//   onChange,
// }: {
//   content: EducationItem[];
//   onChange: (c: EducationItem[]) => void;
// }) {
//   function update(id: string, patch: Partial<EducationItem>) {
//     onChange(content.map((e) => (e.id === id ? { ...e, ...patch } : e)));
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {content.map((edu, i) => (
//         <div
//           key={edu.id}
//           className="flex flex-col gap-3 p-4"
//           style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
//         >
//           <div className="flex items-center justify-between">
//             <span
//               className="text-xs font-semibold uppercase tracking-wider"
//               style={{ color: "var(--rv-muted)" }}
//             >
//               Entry {i + 1}
//             </span>
//             <RemoveButton
//               onClick={() => onChange(content.filter((e) => e.id !== edu.id))}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Institution">
//               <input
//                 style={inputCls}
//                 value={edu.institution}
//                 onChange={(e) =>
//                   update(edu.id, { institution: e.target.value })
//                 }
//                 placeholder="MIT"
//               />
//             </Field>
//             <Field label="Degree">
//               <input
//                 style={inputCls}
//                 value={edu.degree}
//                 onChange={(e) => update(edu.id, { degree: e.target.value })}
//                 placeholder="Bachelor of Science"
//               />
//             </Field>
//             <Field label="Field of study">
//               <input
//                 style={inputCls}
//                 value={edu.field}
//                 onChange={(e) => update(edu.id, { field: e.target.value })}
//                 placeholder="Computer Science"
//               />
//             </Field>
//             <Field label="GPA (optional)">
//               <input
//                 style={inputCls}
//                 value={edu.gpa ?? ""}
//                 onChange={(e) => update(edu.id, { gpa: e.target.value })}
//                 placeholder="3.8"
//               />
//             </Field>
//             <Field label="Start date">
//               <input
//                 style={inputCls}
//                 value={edu.startDate}
//                 onChange={(e) => update(edu.id, { startDate: e.target.value })}
//                 placeholder="Sep 2018"
//               />
//             </Field>
//             <Field label="End date">
//               <input
//                 style={inputCls}
//                 value={edu.endDate}
//                 onChange={(e) => update(edu.id, { endDate: e.target.value })}
//                 placeholder="May 2022"
//               />
//             </Field>
//           </div>
//         </div>
//       ))}
//       <AddButton
//         onClick={() => onChange([...content, newEdu()])}
//         label="Add education"
//       />
//     </div>
//   );
// }

// // ── Skills ────────────────────────────────────────────────

// export function SkillsEditor({
//   content,
//   onChange,
// }: {
//   content: SkillsContent;
//   onChange: (c: SkillsContent) => void;
// }) {
//   function updateCat(
//     id: string,
//     patch: Partial<{ name: string; skills: string }>,
//   ) {
//     onChange({
//       categories: content.categories.map((c) =>
//         c.id === id ? { ...c, ...patch } : c,
//       ),
//     });
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       {content.categories.map((cat) => (
//         <div
//           key={cat.id}
//           className="flex flex-col gap-2 p-4"
//           style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
//         >
//           <div className="flex items-center justify-between">
//             <Field label="Category name">
//               <input
//                 style={{ ...inputCls, maxWidth: 200 }}
//                 value={cat.name}
//                 onChange={(e) => updateCat(cat.id, { name: e.target.value })}
//                 placeholder="Frontend"
//               />
//             </Field>
//             <RemoveButton
//               onClick={() =>
//                 onChange({
//                   categories: content.categories.filter((c) => c.id !== cat.id),
//                 })
//               }
//             />
//           </div>
//           <Field label="Skills (comma separated)">
//             <input
//               style={inputCls}
//               value={cat.skills}
//               onChange={(e) => updateCat(cat.id, { skills: e.target.value })}
//               placeholder="React, TypeScript, Next.js, Tailwind"
//             />
//           </Field>
//         </div>
//       ))}
//       <AddButton
//         onClick={() =>
//           onChange({
//             categories: [
//               ...content.categories,
//               { id: crypto.randomUUID(), name: "", skills: "" },
//             ],
//           })
//         }
//         label="Add category"
//       />
//     </div>
//   );
// }

// // ── Projects ──────────────────────────────────────────────

// function newProject(): ProjectItem {
//   return {
//     id: crypto.randomUUID(),
//     name: "",
//     description: "",
//     url: "",
//     technologies: "",
//   };
// }

// export function ProjectsEditor({
//   content,
//   onChange,
// }: {
//   content: ProjectItem[];
//   onChange: (c: ProjectItem[]) => void;
// }) {
//   function update(id: string, patch: Partial<ProjectItem>) {
//     onChange(content.map((p) => (p.id === id ? { ...p, ...patch } : p)));
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {content.map((proj, i) => (
//         <div
//           key={proj.id}
//           className="flex flex-col gap-3 p-4"
//           style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
//         >
//           <div className="flex items-center justify-between">
//             <span
//               className="text-xs font-semibold uppercase tracking-wider"
//               style={{ color: "var(--rv-muted)" }}
//             >
//               Project {i + 1}
//             </span>
//             <RemoveButton
//               onClick={() => onChange(content.filter((p) => p.id !== proj.id))}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Project name">
//               <input
//                 style={inputCls}
//                 value={proj.name}
//                 onChange={(e) => update(proj.id, { name: e.target.value })}
//                 placeholder="ResumeVerse"
//               />
//             </Field>
//             <Field label="URL (optional)">
//               <input
//                 style={inputCls}
//                 value={proj.url ?? ""}
//                 onChange={(e) => update(proj.id, { url: e.target.value })}
//                 placeholder="https://github.com/you/project"
//               />
//             </Field>
//           </div>
//           <Field label="Technologies">
//             <input
//               style={inputCls}
//               value={proj.technologies}
//               onChange={(e) =>
//                 update(proj.id, { technologies: e.target.value })
//               }
//               placeholder="Next.js, Prisma, OpenAI"
//             />
//           </Field>
//           <Field label="Description">
//             <textarea
//               rows={3}
//               style={{ ...inputCls, resize: "vertical" }}
//               value={proj.description}
//               onChange={(e) => update(proj.id, { description: e.target.value })}
//               placeholder="What did you build and what impact did it have?"
//             />
//           </Field>
//         </div>
//       ))}
//       <AddButton
//         onClick={() => onChange([...content, newProject()])}
//         label="Add project"
//       />
//     </div>
//   );
// }

// // ── Certifications ────────────────────────────────────────

// function newCert(): CertificationItem {
//   return { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" };
// }

// export function CertificationsEditor({
//   content,
//   onChange,
// }: {
//   content: CertificationItem[];
//   onChange: (c: CertificationItem[]) => void;
// }) {
//   function update(id: string, patch: Partial<CertificationItem>) {
//     onChange(content.map((c) => (c.id === id ? { ...c, ...patch } : c)));
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {content.map((cert, i) => (
//         <div
//           key={cert.id}
//           className="flex flex-col gap-3 p-4"
//           style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
//         >
//           <div className="flex items-center justify-between">
//             <span
//               className="text-xs font-semibold uppercase tracking-wider"
//               style={{ color: "var(--rv-muted)" }}
//             >
//               Cert {i + 1}
//             </span>
//             <RemoveButton
//               onClick={() => onChange(content.filter((c) => c.id !== cert.id))}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Certification name">
//               <input
//                 style={inputCls}
//                 value={cert.name}
//                 onChange={(e) => update(cert.id, { name: e.target.value })}
//                 placeholder="AWS Solutions Architect"
//               />
//             </Field>
//             <Field label="Issuing organization">
//               <input
//                 style={inputCls}
//                 value={cert.issuer}
//                 onChange={(e) => update(cert.id, { issuer: e.target.value })}
//                 placeholder="Amazon Web Services"
//               />
//             </Field>
//             <Field label="Date">
//               <input
//                 style={inputCls}
//                 value={cert.date}
//                 onChange={(e) => update(cert.id, { date: e.target.value })}
//                 placeholder="Mar 2024"
//               />
//             </Field>
//             <Field label="URL (optional)">
//               <input
//                 style={inputCls}
//                 value={cert.url ?? ""}
//                 onChange={(e) => update(cert.id, { url: e.target.value })}
//                 placeholder="https://..."
//               />
//             </Field>
//           </div>
//         </div>
//       ))}
//       <AddButton
//         onClick={() => onChange([...content, newCert()])}
//         label="Add certification"
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import AIGenerateButton from "@/ai/AIGenerateButton";
import type {
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillsContent,
  ProjectItem,
  CertificationItem,
} from "@/types/resume";

// ── Shared input styles ───────────────────────────────────

const inputCls: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "inherit",
};

const labelCls: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "var(--rv-muted)",
  marginBottom: "0.25rem",
  display: "block",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <label style={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium transition-colors duration-150"
      style={{
        background: "none",
        border: "1px dashed var(--rv-border)",
        borderRadius: 2,
        padding: "0.5rem 1rem",
        cursor: "pointer",
        color: "var(--rv-muted)",
        fontFamily: "inherit",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--rv-accent)";
        e.currentTarget.style.color = "var(--rv-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--rv-border)";
        e.currentTarget.style.color = "var(--rv-muted)";
      }}
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--rv-muted)",
        fontSize: "0.75rem",
        padding: "0 0.25rem",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rv-accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rv-muted)")}
    >
      Remove
    </button>
  );
}

// ── Summary ───────────────────────────────────────────────

export function SummaryEditor({
  content,
  onChange,
  jobTitle,
}: {
  content: SummaryContent;
  onChange: (c: SummaryContent) => void;
  jobTitle?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label style={labelCls}>Professional summary</label>
        <AIGenerateButton
          type="summary"
          label="Generate"
          prefillContext={{ jobTitle: jobTitle ?? "" }}
          contextFields={[
            {
              key: "jobTitle",
              label: "Job title",
              placeholder: "Senior Frontend Engineer",
            },
            {
              key: "background",
              label: "Your background",
              placeholder: "5 years building React apps, led teams...",
              multiline: true,
            },
          ]}
          onAccept={(text) => onChange({ text })}
        />
      </div>
      <textarea
        value={content.text}
        onChange={(e) => onChange({ text: e.target.value })}
        rows={5}
        placeholder="Write 2–4 sentences about your background, key skills, and what you bring to the role…"
        style={{ ...inputCls, resize: "vertical", lineHeight: 1.6 }}
      />
    </div>
  );
}

// ── Experience ────────────────────────────────────────────

function newExp(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
  };
}

export function ExperienceEditor({
  content,
  onChange,
}: {
  content: ExperienceItem[];
  onChange: (c: ExperienceItem[]) => void;
}) {
  function update(id: string, patch: Partial<ExperienceItem>) {
    onChange(content.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(content.filter((e) => e.id !== id));
  }

  function addBullet(id: string) {
    update(id, {
      bullets: [...(content.find((e) => e.id === id)?.bullets ?? []), ""],
    });
  }

  function updateBullet(id: string, idx: number, val: string) {
    const exp = content.find((e) => e.id === id);
    if (!exp) return;
    const bullets = [...exp.bullets];
    bullets[idx] = val;
    update(id, { bullets });
  }

  function removeBullet(id: string, idx: number) {
    const exp = content.find((e) => e.id === id);
    if (!exp) return;
    update(id, { bullets: exp.bullets.filter((_, i) => i !== idx) });
  }

  return (
    <div className="flex flex-col gap-6">
      {content.map((exp, i) => (
        <div
          key={exp.id}
          className="flex flex-col gap-3 p-4"
          style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--rv-muted)" }}
            >
              Position {i + 1}
            </span>
            <RemoveButton onClick={() => remove(exp.id)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <input
                style={inputCls}
                value={exp.company}
                onChange={(e) => update(exp.id, { company: e.target.value })}
                placeholder="Acme Inc."
              />
            </Field>
            <Field label="Job title">
              <input
                style={inputCls}
                value={exp.role}
                onChange={(e) => update(exp.id, { role: e.target.value })}
                placeholder="Software Engineer"
              />
            </Field>
            <Field label="Location">
              <input
                style={inputCls}
                value={exp.location}
                onChange={(e) => update(exp.id, { location: e.target.value })}
                placeholder="New York, NY"
              />
            </Field>
            <Field label="Start date">
              <input
                style={inputCls}
                value={exp.startDate}
                onChange={(e) => update(exp.id, { startDate: e.target.value })}
                placeholder="Jan 2022"
              />
            </Field>
            {!exp.current && (
              <Field label="End date">
                <input
                  style={inputCls}
                  value={exp.endDate}
                  onChange={(e) => update(exp.id, { endDate: e.target.value })}
                  placeholder="Dec 2023"
                />
              </Field>
            )}
          </div>

          <label
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: "var(--rv-ink)" }}
          >
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) =>
                update(exp.id, { current: e.target.checked, endDate: "" })
              }
            />
            Currently working here
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span style={labelCls}>Bullet points</span>
              <AIGenerateButton
                type="experience_bullets"
                label="Generate"
                prefillContext={{ role: exp.role, company: exp.company }}
                contextFields={[
                  {
                    key: "role",
                    label: "Job title",
                    placeholder: "Software Engineer",
                  },
                  {
                    key: "company",
                    label: "Company",
                    placeholder: "Acme Inc.",
                  },
                  {
                    key: "context",
                    label: "What did you do?",
                    placeholder:
                      "Built REST APIs, led migrations, improved performance…",
                    multiline: true,
                  },
                ]}
                onAccept={(text) => {
                  const lines = text
                    .split("\n")
                    .map((l) => l.replace(/^[-•]\s*/, "").trim())
                    .filter(Boolean);
                  update(exp.id, { bullets: lines });
                }}
              />
            </div>
            {exp.bullets.map((b, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span
                  style={{
                    color: "var(--rv-muted)",
                    paddingTop: "0.45rem",
                    fontSize: "0.75rem",
                  }}
                >
                  •
                </span>
                <textarea
                  value={b}
                  onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                  rows={2}
                  placeholder="Describe an achievement or responsibility…"
                  style={{ ...inputCls, flex: 1, resize: "vertical" }}
                />
                {exp.bullets.length > 1 && (
                  <button
                    onClick={() => removeBullet(exp.id, idx)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--rv-muted)",
                      paddingTop: "0.45rem",
                      fontSize: "1rem",
                      fontFamily: "inherit",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <AddButton onClick={() => addBullet(exp.id)} label="Add bullet" />
          </div>
        </div>
      ))}
      <AddButton
        onClick={() => onChange([...content, newExp()])}
        label="Add position"
      />
    </div>
  );
}

// ── Education ─────────────────────────────────────────────

function newEdu(): EducationItem {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  };
}

export function EducationEditor({
  content,
  onChange,
}: {
  content: EducationItem[];
  onChange: (c: EducationItem[]) => void;
}) {
  function update(id: string, patch: Partial<EducationItem>) {
    onChange(content.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  return (
    <div className="flex flex-col gap-6">
      {content.map((edu, i) => (
        <div
          key={edu.id}
          className="flex flex-col gap-3 p-4"
          style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--rv-muted)" }}
            >
              Entry {i + 1}
            </span>
            <RemoveButton
              onClick={() => onChange(content.filter((e) => e.id !== edu.id))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Institution">
              <input
                style={inputCls}
                value={edu.institution}
                onChange={(e) =>
                  update(edu.id, { institution: e.target.value })
                }
                placeholder="MIT"
              />
            </Field>
            <Field label="Degree">
              <input
                style={inputCls}
                value={edu.degree}
                onChange={(e) => update(edu.id, { degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </Field>
            <Field label="Field of study">
              <input
                style={inputCls}
                value={edu.field}
                onChange={(e) => update(edu.id, { field: e.target.value })}
                placeholder="Computer Science"
              />
            </Field>
            <Field label="GPA (optional)">
              <input
                style={inputCls}
                value={edu.gpa ?? ""}
                onChange={(e) => update(edu.id, { gpa: e.target.value })}
                placeholder="3.8"
              />
            </Field>
            <Field label="Start date">
              <input
                style={inputCls}
                value={edu.startDate}
                onChange={(e) => update(edu.id, { startDate: e.target.value })}
                placeholder="Sep 2018"
              />
            </Field>
            <Field label="End date">
              <input
                style={inputCls}
                value={edu.endDate}
                onChange={(e) => update(edu.id, { endDate: e.target.value })}
                placeholder="May 2022"
              />
            </Field>
          </div>
        </div>
      ))}
      <AddButton
        onClick={() => onChange([...content, newEdu()])}
        label="Add education"
      />
    </div>
  );
}

// ── Skills ────────────────────────────────────────────────

export function SkillsEditor({
  content,
  onChange,
}: {
  content: SkillsContent;
  onChange: (c: SkillsContent) => void;
}) {
  function updateCat(
    id: string,
    patch: Partial<{ name: string; skills: string }>,
  ) {
    onChange({
      categories: content.categories.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AIGenerateButton
          type="skills"
          label="Generate skills"
          contextFields={[
            {
              key: "jobTitle",
              label: "Job title",
              placeholder: "Full Stack Developer",
            },
            {
              key: "experience",
              label: "Your experience",
              placeholder:
                "Built React apps, Node APIs, worked with PostgreSQL…",
              multiline: true,
            },
          ]}
          onAccept={(text) => {
            const lines = text.split("\n").filter(Boolean);
            const categories = lines.map((line) => {
              const colonIdx = line.indexOf(":");
              if (colonIdx > -1) {
                return {
                  id: crypto.randomUUID(),
                  name: line.slice(0, colonIdx).trim(),
                  skills: line.slice(colonIdx + 1).trim(),
                };
              }
              return { id: crypto.randomUUID(), name: "", skills: line.trim() };
            });
            onChange({ categories });
          }}
        />
      </div>
      {content.categories.map((cat) => (
        <div
          key={cat.id}
          className="flex flex-col gap-2 p-4"
          style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
        >
          <div className="flex items-center justify-between">
            <Field label="Category name">
              <input
                style={{ ...inputCls, maxWidth: 200 }}
                value={cat.name}
                onChange={(e) => updateCat(cat.id, { name: e.target.value })}
                placeholder="Frontend"
              />
            </Field>
            <RemoveButton
              onClick={() =>
                onChange({
                  categories: content.categories.filter((c) => c.id !== cat.id),
                })
              }
            />
          </div>
          <Field label="Skills (comma separated)">
            <input
              style={inputCls}
              value={cat.skills}
              onChange={(e) => updateCat(cat.id, { skills: e.target.value })}
              placeholder="React, TypeScript, Next.js, Tailwind"
            />
          </Field>
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange({
            categories: [
              ...content.categories,
              { id: crypto.randomUUID(), name: "", skills: "" },
            ],
          })
        }
        label="Add category"
      />
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────

function newProject(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    url: "",
    technologies: "",
  };
}

export function ProjectsEditor({
  content,
  onChange,
}: {
  content: ProjectItem[];
  onChange: (c: ProjectItem[]) => void;
}) {
  function update(id: string, patch: Partial<ProjectItem>) {
    onChange(content.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="flex flex-col gap-6">
      {content.map((proj, i) => (
        <div
          key={proj.id}
          className="flex flex-col gap-3 p-4"
          style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--rv-muted)" }}
            >
              Project {i + 1}
            </span>
            <RemoveButton
              onClick={() => onChange(content.filter((p) => p.id !== proj.id))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project name">
              <input
                style={inputCls}
                value={proj.name}
                onChange={(e) => update(proj.id, { name: e.target.value })}
                placeholder="ResumeVerse"
              />
            </Field>
            <Field label="URL (optional)">
              <input
                style={inputCls}
                value={proj.url ?? ""}
                onChange={(e) => update(proj.id, { url: e.target.value })}
                placeholder="https://github.com/you/project"
              />
            </Field>
          </div>
          <Field label="Technologies">
            <input
              style={inputCls}
              value={proj.technologies}
              onChange={(e) =>
                update(proj.id, { technologies: e.target.value })
              }
              placeholder="Next.js, Prisma, OpenAI"
            />
          </Field>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label style={labelCls}>Description</label>
              <AIGenerateButton
                type="project_description"
                label="Generate"
                prefillContext={{
                  name: proj.name,
                  technologies: proj.technologies,
                }}
                contextFields={[
                  {
                    key: "name",
                    label: "Project name",
                    placeholder: "ResumeVerse",
                  },
                  {
                    key: "technologies",
                    label: "Technologies",
                    placeholder: "Next.js, Prisma, OpenAI",
                  },
                  {
                    key: "context",
                    label: "What did you build?",
                    placeholder: "AI-powered resume builder with PDF export…",
                    multiline: true,
                  },
                ]}
                onAccept={(text) => update(proj.id, { description: text })}
              />
            </div>
            <textarea
              rows={3}
              style={{ ...inputCls, resize: "vertical" }}
              value={proj.description}
              onChange={(e) => update(proj.id, { description: e.target.value })}
              placeholder="What did you build and what impact did it have?"
            />
          </div>
        </div>
      ))}
      <AddButton
        onClick={() => onChange([...content, newProject()])}
        label="Add project"
      />
    </div>
  );
}

// ── Certifications ────────────────────────────────────────

function newCert(): CertificationItem {
  return { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" };
}

export function CertificationsEditor({
  content,
  onChange,
}: {
  content: CertificationItem[];
  onChange: (c: CertificationItem[]) => void;
}) {
  function update(id: string, patch: Partial<CertificationItem>) {
    onChange(content.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <div className="flex flex-col gap-6">
      {content.map((cert, i) => (
        <div
          key={cert.id}
          className="flex flex-col gap-3 p-4"
          style={{ border: "1px solid var(--rv-border)", borderRadius: 2 }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--rv-muted)" }}
            >
              Cert {i + 1}
            </span>
            <RemoveButton
              onClick={() => onChange(content.filter((c) => c.id !== cert.id))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Certification name">
              <input
                style={inputCls}
                value={cert.name}
                onChange={(e) => update(cert.id, { name: e.target.value })}
                placeholder="AWS Solutions Architect"
              />
            </Field>
            <Field label="Issuing organization">
              <input
                style={inputCls}
                value={cert.issuer}
                onChange={(e) => update(cert.id, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </Field>
            <Field label="Date">
              <input
                style={inputCls}
                value={cert.date}
                onChange={(e) => update(cert.id, { date: e.target.value })}
                placeholder="Mar 2024"
              />
            </Field>
            <Field label="URL (optional)">
              <input
                style={inputCls}
                value={cert.url ?? ""}
                onChange={(e) => update(cert.id, { url: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </div>
        </div>
      ))}
      <AddButton
        onClick={() => onChange([...content, newCert()])}
        label="Add certification"
      />
    </div>
  );
}
