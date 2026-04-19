// "use client";

// import {
//   useState,
//   useRef,
//   useCallback,
//   useEffect,
//   createContext,
//   useContext,
// } from "react";
// import { reorderSections } from "@/actions/builder.actions";
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
// } from "@/components/templates";
// import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// // ── Drag context ──────────────────────────────────────────

// interface DragCtx {
//   overId: string | null;
//   accent: string;
//   onDragStart: (id: string, e: React.DragEvent) => void;
//   onDragOver: (id: string, e: React.DragEvent) => void;
//   onDrop: (id: string) => void;
//   onDragEnd: () => void;
// }

// export const DragContext = createContext<DragCtx | null>(null);

// // ── DraggableSection ──────────────────────────────────────

// export function DraggableSection({
//   id,
//   children,
//   inverted = false,
// }: {
//   id: string;
//   children: React.ReactNode;
//   inverted?: boolean;
// }) {
//   const ctx = useContext(DragContext);
//   const [hover, setHover] = useState(false);
//   if (!ctx) return <>{children}</>;

//   const isOver = ctx.overId === id;

//   return (
//     <div
//       draggable
//       onDragStart={(e) => ctx.onDragStart(id, e)}
//       onDragOver={(e) => ctx.onDragOver(id, e)}
//       onDrop={() => ctx.onDrop(id)}
//       onDragEnd={ctx.onDragEnd}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{
//         position: "relative",
//         cursor: "grab",
//         borderRadius: 2,
//         outline: isOver
//           ? `2px solid ${ctx.accent}`
//           : hover
//             ? `1px dashed ${inverted ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.12)"}`
//             : "2px solid transparent",
//         outlineOffset: 1,
//         transition: "outline 0.1s",
//         background: isOver
//           ? inverted
//             ? "rgba(255,255,255,0.08)"
//             : "rgba(200,75,47,0.04)"
//           : "transparent",
//       }}
//     >
//       {children}
//       {hover && (
//         <div
//           style={{
//             position: "absolute",
//             top: 2,
//             right: 2,
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             background: inverted
//               ? "rgba(0,0,0,0.55)"
//               : "rgba(253,252,250,0.97)",
//             border: `1px solid ${inverted ? "rgba(255,255,255,0.2)" : "#e0d9ce"}`,
//             borderRadius: 3,
//             padding: "2px 6px 2px 4px",
//             pointerEvents: "none",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
//             zIndex: 10,
//           }}
//         >
//           <svg
//             viewBox="0 0 10 14"
//             width={8}
//             height={11}
//             fill={inverted ? "rgba(255,255,255,0.7)" : "#9a9288"}
//           >
//             <circle cx="2.5" cy="2" r="1.1" />
//             <circle cx="2.5" cy="7" r="1.1" />
//             <circle cx="2.5" cy="12" r="1.1" />
//             <circle cx="7.5" cy="2" r="1.1" />
//             <circle cx="7.5" cy="7" r="1.1" />
//             <circle cx="7.5" cy="12" r="1.1" />
//           </svg>
//           <span
//             style={{
//               fontSize: "0.55rem",
//               fontWeight: 600,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//               color: inverted ? "rgba(255,255,255,0.8)" : "#6b6560",
//               whiteSpace: "nowrap",
//             }}
//           >
//             drag to reorder
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main export ───────────────────────────────────────────

// interface PreviewProps {
//   resume: ResumeData;
//   sections: ResumeSection[];
//   onSectionsChange?: (s: ResumeSection[]) => void;
// }

// export default function ResumePreview({
//   resume,
//   sections,
//   onSectionsChange,
// }: PreviewProps) {
//   const sorted = [...(sections ?? [])].sort((a, b) => a.order - b.order);
//   const accent = getAccent(resume.colorScheme);
//   const dragId = useRef<string | null>(null);
//   const sortedRef = useRef<ResumeSection[]>(sorted);
//   sortedRef.current = sorted;

//   const [overId, setOverId] = useState<string | null>(null);
//   const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   useEffect(
//     () => () => {
//       if (saveTimer.current) clearTimeout(saveTimer.current);
//     },
//     [],
//   );

//   const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
//     dragId.current = id;
//     e.dataTransfer.effectAllowed = "move";
//     const ghost = document.createElement("div");
//     ghost.style.cssText =
//       "position:fixed;top:-999px;opacity:0;width:1px;height:1px";
//     document.body.appendChild(ghost);
//     e.dataTransfer.setDragImage(ghost, 0, 0);
//     setTimeout(() => document.body.removeChild(ghost), 0);
//   }, []);

//   const handleDragOver = useCallback((id: string, e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//     if (id !== dragId.current) setOverId(id);
//   }, []);

//   const handleDrop = useCallback(
//     (targetId: string) => {
//       const current = sortedRef.current;
//       if (!dragId.current || dragId.current === targetId) {
//         dragId.current = null;
//         setOverId(null);
//         return;
//       }
//       const fromIdx = current.findIndex((s) => s.id === dragId.current);
//       const toIdx = current.findIndex((s) => s.id === targetId);
//       if (fromIdx === -1 || toIdx === -1) return;
//       const reordered = [...current];
//       const [moved] = reordered.splice(fromIdx, 1);
//       reordered.splice(toIdx, 0, moved);
//       const updated = reordered.map((s, i) => ({ ...s, order: i }));
//       onSectionsChange?.(updated);
//       if (saveTimer.current) clearTimeout(saveTimer.current);
//       saveTimer.current = setTimeout(() => {
//         reorderSections(
//           resume.id,
//           updated.map((s) => s.id),
//         ).catch(console.error);
//       }, 600);
//       dragId.current = null;
//       setOverId(null);
//     },
//     [resume.id, onSectionsChange],
//   );

//   const handleDragEnd = useCallback(() => {
//     dragId.current = null;
//     setOverId(null);
//   }, []);

//   const dragCtx: DragCtx | null = onSectionsChange
//     ? {
//         overId,
//         accent,
//         onDragStart: handleDragStart,
//         onDragOver: handleDragOver,
//         onDrop: handleDrop,
//         onDragEnd: handleDragEnd,
//       }
//     : null;

//   const tplProps = { resume, sections: sorted, accent };

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

//   // Resolve font stack and scale from resume settings
//   const fontDef =
//     RESUME_FONTS.find((f) => f.id === resume.font) ?? RESUME_FONTS[0];
//   const sizeDef =
//     FONT_SIZES.find((s) => s.id === resume.fontSize) ?? FONT_SIZES[2];

//   // Base font size for the resume is 13px at "Medium" scale.
//   // The scale factor multiplies this base, giving 10.7px (XS) → 15.6px (XL).
//   // All `em` values in templates are relative to this, so everything scales uniformly.
//   const basePx = Math.round(13 * sizeDef.scale);

//   return (
//     <DragContext.Provider value={dragCtx}>
//       <div style={{ fontFamily: fontDef.stack, fontSize: `${basePx}px` }}>
//         {Template}
//       </div>
//     </DragContext.Provider>
//   );
// }

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { reorderSections } from "@/actions/builder.actions";
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
} from "@/components/templates";
import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";
import { DragContext } from "./DragContext";
import {
  StyleContext,
  StyleOverrides,
  ElementKey,
  ElementStyle,
} from "./StyleContext";
import StyleToolbar from "./StyleToolbar";
import type { DragCtx } from "./DragContext";
import type { ResumeData, ResumeSection } from "@/types/resume";

// ── Main export ───────────────────────────────────────────

interface PreviewProps {
  resume: ResumeData;
  sections: ResumeSection[];
  onSectionsChange?: (s: ResumeSection[]) => void;
}

export default function ResumePreview({
  resume,
  sections,
  onSectionsChange,
}: PreviewProps) {
  const sorted = [...(sections ?? [])].sort((a, b) => a.order - b.order);
  const accent = getAccent(resume.colorScheme);
  const dragId = useRef<string | null>(null);
  const sortedRef = useRef<ResumeSection[]>(sorted);
  sortedRef.current = sorted;

  // ── Drag state ────────────────────────────────────────
  const [overId, setOverId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.style.cssText =
      "position:fixed;top:-999px;opacity:0;width:1px;height:1px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }, []);

  const handleDragOver = useCallback((id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragId.current) setOverId(id);
  }, []);

  const handleDrop = useCallback(
    (targetId: string) => {
      const current = sortedRef.current;
      if (!dragId.current || dragId.current === targetId) {
        dragId.current = null;
        setOverId(null);
        return;
      }
      const fromIdx = current.findIndex((s) => s.id === dragId.current);
      const toIdx = current.findIndex((s) => s.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return;
      const reordered = [...current];
      const [moved] = reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, moved);
      const updated = reordered.map((s, i) => ({ ...s, order: i }));
      onSectionsChange?.(updated);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        reorderSections(
          resume.id,
          updated.map((s) => s.id),
        ).catch(console.error);
      }, 600);
      dragId.current = null;
      setOverId(null);
    },
    [resume.id, onSectionsChange],
  );

  const handleDragEnd = useCallback(() => {
    dragId.current = null;
    setOverId(null);
  }, []);

  const dragCtx: DragCtx | null = onSectionsChange
    ? {
        overId,
        accent,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
        onDragEnd: handleDragEnd,
      }
    : null;

  // ── Per-element style state ───────────────────────────
  const [overrides, setOverrides] = useState<StyleOverrides>(
    ((resume as Record<string, unknown>).styleOverrides as StyleOverrides) ??
      {},
  );
  const [selected, setSelected] = useState<ElementKey | null>(null);
  const [toolbarRect, setToolbarRect] = useState<DOMRect | null>(null);

  function selectElement(key: ElementKey, rect: DOMRect) {
    setSelected(key);
    setToolbarRect(rect);
  }
  function clearSelected() {
    setSelected(null);
    setToolbarRect(null);
  }
  function setOverride(key: ElementKey, patch: Partial<ElementStyle>) {
    setOverrides((prev) => {
      const current = prev[key] ?? {};
      // Empty patch = reset
      const next =
        Object.keys(patch).length === 0 ? {} : { ...current, ...patch };
      const updated = { ...prev, [key]: next };
      // Persist to DB (fire-and-forget)
      import("@/actions/builder.actions").then(({ updateResumeMeta }) => {
        updateResumeMeta(resume.id, { styleOverrides: updated } as Record<
          string,
          unknown
        >);
      });
      return updated;
    });
  }

  const styleCtx = {
    overrides,
    selected,
    selectElement,
    clearSelected,
    setOverride,
    toolbarRect,
  };

  // ── Font / size ───────────────────────────────────────
  const fontDef =
    RESUME_FONTS.find((f) => f.id === resume.font) ?? RESUME_FONTS[0];
  const sizeDef =
    FONT_SIZES.find((s) => s.id === resume.fontSize) ?? FONT_SIZES[2];
  const basePx = Math.round(13 * sizeDef.scale);

  // ── Template ──────────────────────────────────────────
  const tplProps = { resume, sections: sorted, accent };

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
    <DragContext.Provider value={dragCtx}>
      <StyleContext.Provider value={styleCtx}>
        <div
          style={{
            fontFamily: fontDef.stack,
            fontSize: `${basePx}px`,
            position: "relative",
          }}
          // Click on the wrapper (outside any Styleable) clears selection
          onClick={() => clearSelected()}
        >
          {Template}
        </div>
        <StyleToolbar />
      </StyleContext.Provider>
    </DragContext.Provider>
  );
}
