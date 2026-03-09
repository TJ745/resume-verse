// "use client";

// import { useState, useTransition, useRef } from "react";
// import {
//   saveSection,
//   deleteSection,
//   addSection,
//   reorderSections,
// } from "@/actions/builder.actions";
// import {
//   SummaryEditor,
//   ExperienceEditor,
//   EducationEditor,
//   SkillsEditor,
//   ProjectsEditor,
//   CertificationsEditor,
// } from "./SectionEditors";
// import type {
//   ResumeSection,
//   SectionType,
//   SectionContent,
//   SummaryContent,
//   ExperienceItem,
//   EducationItem,
//   SkillsContent,
//   ProjectItem,
//   CertificationItem,
// } from "@/types/resume";

// const SECTION_TYPES: { type: SectionType; label: string }[] = [
//   { type: "summary", label: "Summary" },
//   { type: "experience", label: "Experience" },
//   { type: "education", label: "Education" },
//   { type: "skills", label: "Skills" },
//   { type: "projects", label: "Projects" },
//   { type: "certifications", label: "Certifications" },
// ];

// interface EditorPanelProps {
//   resumeId: string;
//   initialSections: ResumeSection[];
//   onSectionsChange: (sections: ResumeSection[]) => void;
// }

// export default function EditorPanel({
//   resumeId,
//   initialSections,
//   onSectionsChange,
// }: EditorPanelProps) {
//   const [sections, setSections] = useState<ResumeSection[]>(initialSections);
//   const [expanded, setExpanded] = useState<string | null>(
//     initialSections[0]?.id ?? null,
//   );
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const [savingId, setSavingId] = useState<string | null>(null);

//   // Drag state
//   const dragIndex = useRef<number | null>(null);
//   const dragOverIndex = useRef<number | null>(null);

//   function update(updated: ResumeSection[]) {
//     setSections(updated);
//     onSectionsChange(updated);
//   }

//   function handleContentChange(sectionId: string, content: SectionContent) {
//     const updated = sections.map((s) =>
//       s.id === sectionId ? { ...s, content } : s,
//     );
//     update(updated);
//     setSavingId(sectionId);
//     startTransition(async () => {
//       await saveSection(resumeId, sectionId, content);
//       setSavingId(null);
//     });
//   }

//   function handleDelete(sectionId: string) {
//     if (!confirm("Remove this section?")) return;
//     const updated = sections.filter((s) => s.id !== sectionId);
//     update(updated);
//     if (expanded === sectionId) setExpanded(updated[0]?.id ?? null);
//     startTransition(() => deleteSection(resumeId, sectionId));
//   }

//   function handleAdd(type: SectionType) {
//     setShowAddMenu(false);
//     startTransition(async () => {
//       await addSection(resumeId, type);
//       // revalidatePath will refresh — server will send back updated sections
//     });
//   }

//   // ── Drag to reorder ──────────────────────────────────────
//   function handleDragStart(index: number) {
//     dragIndex.current = index;
//   }

//   function handleDragOver(e: React.DragEvent, index: number) {
//     e.preventDefault();
//     dragOverIndex.current = index;
//   }

//   function handleDrop() {
//     const from = dragIndex.current;
//     const to = dragOverIndex.current;
//     if (from === null || to === null || from === to) return;

//     const reordered = [...sections];
//     const [moved] = reordered.splice(from, 1);
//     reordered.splice(to, 0, moved);
//     const withOrder = reordered.map((s, i) => ({ ...s, order: i }));

//     update(withOrder);
//     dragIndex.current = null;
//     dragOverIndex.current = null;

//     startTransition(() =>
//       reorderSections(
//         resumeId,
//         withOrder.map((s) => s.id),
//       ),
//     );
//   }

//   function renderEditor(section: ResumeSection) {
//     switch (section.type) {
//       case "summary":
//         return (
//           <SummaryEditor
//             content={section.content as SummaryContent}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//       case "experience":
//         return (
//           <ExperienceEditor
//             content={section.content as ExperienceItem[]}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//       case "education":
//         return (
//           <EducationEditor
//             content={section.content as EducationItem[]}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//       case "skills":
//         return (
//           <SkillsEditor
//             content={section.content as SkillsContent}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//       case "projects":
//         return (
//           <ProjectsEditor
//             content={section.content as ProjectItem[]}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//       case "certifications":
//         return (
//           <CertificationsEditor
//             content={section.content as CertificationItem[]}
//             onChange={(c) => handleContentChange(section.id, c)}
//           />
//         );
//     }
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Section list */}
//       <div className="flex-1 overflow-y-auto" style={{ padding: "1.25rem" }}>
//         <div className="flex flex-col gap-2">
//           {sections.map((section, index) => (
//             <div
//               key={section.id}
//               draggable
//               onDragStart={() => handleDragStart(index)}
//               onDragOver={(e) => handleDragOver(e, index)}
//               onDrop={handleDrop}
//               style={{
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 background: "var(--rv-white)",
//                 opacity: isPending && savingId === section.id ? 0.6 : 1,
//               }}
//             >
//               {/* Section header */}
//               <div
//                 className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
//                 style={{
//                   borderBottom:
//                     expanded === section.id
//                       ? "1px solid var(--rv-border)"
//                       : "none",
//                 }}
//                 onClick={() =>
//                   setExpanded(expanded === section.id ? null : section.id)
//                 }
//               >
//                 <div className="flex items-center gap-2.5">
//                   {/* Drag handle */}
//                   <span
//                     className="cursor-grab"
//                     style={{
//                       color: "var(--rv-border)",
//                       fontSize: "0.875rem",
//                       lineHeight: 1,
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     ⠿
//                   </span>
//                   <span
//                     className="text-sm font-medium"
//                     style={{ color: "var(--rv-ink)" }}
//                   >
//                     {section.title}
//                   </span>
//                   {savingId === section.id && (
//                     <span
//                       style={{ fontSize: "0.7rem", color: "var(--rv-muted)" }}
//                     >
//                       saving…
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(section.id);
//                     }}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       color: "var(--rv-muted)",
//                       fontSize: "0.75rem",
//                       fontFamily: "inherit",
//                       padding: "0 0.25rem",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.color = "var(--rv-accent)")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.color = "var(--rv-muted)")
//                     }
//                   >
//                     ✕
//                   </button>
//                   <span
//                     style={{
//                       color: "var(--rv-muted)",
//                       fontSize: "0.75rem",
//                       transform:
//                         expanded === section.id ? "rotate(180deg)" : "none",
//                       display: "inline-block",
//                       transition: "transform 0.15s",
//                     }}
//                   >
//                     ▾
//                   </span>
//                 </div>
//               </div>

//               {/* Section editor body */}
//               {expanded === section.id && (
//                 <div style={{ padding: "1rem" }}>{renderEditor(section)}</div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Add section */}
//         <div className="relative mt-3">
//           <button
//             onClick={() => setShowAddMenu((o) => !o)}
//             className="w-full text-sm font-medium transition-colors duration-150"
//             style={{
//               background: "none",
//               border: "1px dashed var(--rv-border)",
//               borderRadius: 2,
//               padding: "0.6rem",
//               cursor: "pointer",
//               color: "var(--rv-muted)",
//               fontFamily: "inherit",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = "var(--rv-accent)";
//               e.currentTarget.style.color = "var(--rv-accent)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "var(--rv-border)";
//               e.currentTarget.style.color = "var(--rv-muted)";
//             }}
//           >
//             + Add section
//           </button>

//           {showAddMenu && (
//             <div
//               className="absolute left-0 right-0 mt-1 py-1 z-10"
//               style={{
//                 background: "var(--rv-white)",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
//               }}
//             >
//               {SECTION_TYPES.filter(
//                 (st) => !sections.some((s) => s.type === st.type),
//               ).map((st) => (
//                 <button
//                   key={st.type}
//                   onClick={() => handleAdd(st.type)}
//                   className="w-full text-left px-4 py-2 text-sm transition-colors duration-100"
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "var(--rv-ink)",
//                     fontFamily: "inherit",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "var(--rv-cream)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "none")
//                   }
//                 >
//                   {st.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useTransition, useRef } from "react";
import {
  saveSection,
  deleteSection,
  addSection,
  reorderSections,
} from "@/actions/builder.actions";
import {
  SummaryEditor,
  ExperienceEditor,
  EducationEditor,
  SkillsEditor,
  ProjectsEditor,
  CertificationsEditor,
} from "./SectionEditors";
import type {
  ResumeSection,
  SectionType,
  SectionContent,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillsContent,
  ProjectItem,
  CertificationItem,
} from "@/types/resume";

const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "summary", label: "Summary" },
  { type: "experience", label: "Experience" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "projects", label: "Projects" },
  { type: "certifications", label: "Certifications" },
];

interface EditorPanelProps {
  resumeId: string;
  jobTitle?: string;
  initialSections: ResumeSection[];
  onSectionsChange: (sections: ResumeSection[]) => void;
}

export default function EditorPanel({
  resumeId,
  jobTitle,
  initialSections,
  onSectionsChange,
}: EditorPanelProps) {
  const [sections, setSections] = useState<ResumeSection[]>(initialSections);
  const [expanded, setExpanded] = useState<string | null>(
    initialSections[0]?.id ?? null,
  );
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState<string | null>(null);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function update(updated: ResumeSection[]) {
    setSections(updated);
    onSectionsChange(updated);
  }

  function handleContentChange(sectionId: string, content: SectionContent) {
    const updated = sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s,
    );
    update(updated);
    setSavingId(sectionId);
    startTransition(async () => {
      await saveSection(resumeId, sectionId, content);
      setSavingId(null);
    });
  }

  function handleDelete(sectionId: string) {
    if (!confirm("Remove this section?")) return;
    const updated = sections.filter((s) => s.id !== sectionId);
    update(updated);
    if (expanded === sectionId) setExpanded(updated[0]?.id ?? null);
    startTransition(() => deleteSection(resumeId, sectionId));
  }

  function handleAdd(type: SectionType) {
    setShowAddMenu(false);
    startTransition(async () => {
      await addSection(resumeId, type);
      // revalidatePath will refresh — server will send back updated sections
    });
  }

  // ── Drag to reorder ──────────────────────────────────────
  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex.current = index;
  }

  function handleDrop() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, order: i }));

    update(withOrder);
    dragIndex.current = null;
    dragOverIndex.current = null;

    startTransition(() =>
      reorderSections(
        resumeId,
        withOrder.map((s) => s.id),
      ),
    );
  }

  function renderEditor(section: ResumeSection) {
    switch (section.type) {
      case "summary":
        return (
          <SummaryEditor
            content={section.content as SummaryContent}
            onChange={(c) => handleContentChange(section.id, c)}
            jobTitle={jobTitle}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            content={section.content as ExperienceItem[]}
            onChange={(c) => handleContentChange(section.id, c)}
          />
        );
      case "education":
        return (
          <EducationEditor
            content={section.content as EducationItem[]}
            onChange={(c) => handleContentChange(section.id, c)}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            content={section.content as SkillsContent}
            onChange={(c) => handleContentChange(section.id, c)}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            content={section.content as ProjectItem[]}
            onChange={(c) => handleContentChange(section.id, c)}
          />
        );
      case "certifications":
        return (
          <CertificationsEditor
            content={section.content as CertificationItem[]}
            onChange={(c) => handleContentChange(section.id, c)}
          />
        );
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "1.25rem" }}>
        <div className="flex flex-col gap-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              style={{
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                background: "var(--rv-white)",
                opacity: isPending && savingId === section.id ? 0.6 : 1,
              }}
            >
              {/* Section header */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                style={{
                  borderBottom:
                    expanded === section.id
                      ? "1px solid var(--rv-border)"
                      : "none",
                }}
                onClick={() =>
                  setExpanded(expanded === section.id ? null : section.id)
                }
              >
                <div className="flex items-center gap-2.5">
                  {/* Drag handle */}
                  <span
                    className="cursor-grab"
                    style={{
                      color: "var(--rv-border)",
                      fontSize: "0.875rem",
                      lineHeight: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⠿
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--rv-ink)" }}
                  >
                    {section.title}
                  </span>
                  {savingId === section.id && (
                    <span
                      style={{ fontSize: "0.7rem", color: "var(--rv-muted)" }}
                    >
                      saving…
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(section.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--rv-muted)",
                      fontSize: "0.75rem",
                      fontFamily: "inherit",
                      padding: "0 0.25rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--rv-accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--rv-muted)")
                    }
                  >
                    ✕
                  </button>
                  <span
                    style={{
                      color: "var(--rv-muted)",
                      fontSize: "0.75rem",
                      transform:
                        expanded === section.id ? "rotate(180deg)" : "none",
                      display: "inline-block",
                      transition: "transform 0.15s",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {/* Section editor body */}
              {expanded === section.id && (
                <div style={{ padding: "1rem" }}>{renderEditor(section)}</div>
              )}
            </div>
          ))}
        </div>

        {/* Add section */}
        <div className="relative mt-3">
          <button
            onClick={() => setShowAddMenu((o) => !o)}
            className="w-full text-sm font-medium transition-colors duration-150"
            style={{
              background: "none",
              border: "1px dashed var(--rv-border)",
              borderRadius: 2,
              padding: "0.6rem",
              cursor: "pointer",
              color: "var(--rv-muted)",
              fontFamily: "inherit",
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
            + Add section
          </button>

          {showAddMenu && (
            <div
              className="absolute left-0 right-0 mt-1 py-1 z-10"
              style={{
                background: "var(--rv-white)",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
              }}
            >
              {SECTION_TYPES.filter(
                (st) => !sections.some((s) => s.type === st.type),
              ).map((st) => (
                <button
                  key={st.type}
                  onClick={() => handleAdd(st.type)}
                  className="w-full text-left px-4 py-2 text-sm transition-colors duration-100"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--rv-ink)",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--rv-cream)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
