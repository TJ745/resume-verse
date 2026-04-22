// "use client";

// import { useState, useRef, useCallback, useEffect } from "react";
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
// import { DragContext } from "./DragContext";
// import {
//   StyleContext,
//   StyleOverrides,
//   ElementKey,
//   ElementStyle,
// } from "./StyleContext";
// import StyleToolbar from "./StyleToolbar";
// import type { DragCtx } from "./DragContext";
// import type { ResumeData, ResumeSection } from "@/types/resume";

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

//   // ── Drag state ────────────────────────────────────────
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

//   // ── Per-element style state ───────────────────────────
//   const [overrides, setOverrides] = useState<StyleOverrides>(
//     ((resume as Record<string, unknown>).styleOverrides as StyleOverrides) ??
//       {},
//   );
//   const [selected, setSelected] = useState<ElementKey | null>(null);
//   const [toolbarRect, setToolbarRect] = useState<DOMRect | null>(null);

//   function selectElement(key: ElementKey, rect: DOMRect) {
//     setSelected(key);
//     setToolbarRect(rect);
//   }
//   function clearSelected() {
//     setSelected(null);
//     setToolbarRect(null);
//   }
//   function setOverride(key: ElementKey, patch: Partial<ElementStyle>) {
//     setOverrides((prev) => {
//       const current = prev[key] ?? {};
//       // Empty patch = reset
//       const next =
//         Object.keys(patch).length === 0 ? {} : { ...current, ...patch };
//       const updated = { ...prev, [key]: next };
//       // Persist to DB (fire-and-forget)
//       import("@/actions/builder.actions").then(({ updateResumeMeta }) => {
//         updateResumeMeta(resume.id, { styleOverrides: updated } as Record<
//           string,
//           unknown
//         >);
//       });
//       return updated;
//     });
//   }

//   const styleCtx = {
//     overrides,
//     selected,
//     selectElement,
//     clearSelected,
//     setOverride,
//     toolbarRect,
//   };

//   // ── Font / size ───────────────────────────────────────
//   const fontDef =
//     RESUME_FONTS.find((f) => f.id === resume.font) ?? RESUME_FONTS[0];
//   const sizeDef =
//     FONT_SIZES.find((s) => s.id === resume.fontSize) ?? FONT_SIZES[2];
//   const basePx = Math.round(13 * sizeDef.scale);

//   // ── Template ──────────────────────────────────────────
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

//   return (
//     <DragContext.Provider value={dragCtx}>
//       <StyleContext.Provider value={styleCtx}>
//         <div
//           style={{
//             fontFamily: fontDef.stack,
//             fontSize: `${basePx}px`,
//             position: "relative",
//           }}
//           // Click on the wrapper (outside any Styleable) clears selection
//           onClick={() => clearSelected()}
//         >
//           {Template}
//         </div>
//         <StyleToolbar />
//       </StyleContext.Provider>
//     </DragContext.Provider>
//   );
// }

// ------------------------------------------------------

// "use client";

// import { useState, useRef, useCallback, useEffect } from "react";
// import { reorderSections } from "@/actions/builder.actions";
// import {
//   ModernTemplate, ClassicTemplate, MinimalTemplate, ExecutiveTemplate,
//   CompactTemplate, CreativeTemplate, ElegantTemplate, TechnicalTemplate,
//   ChronologicalTemplate, BoldTemplate, getAccent,
// } from "@/components/templates";
// import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";
// import { DragContext }  from "./DragContext";
// import { StyleContext, StyleOverrides, ElementStyle } from "./StyleContext";
// import type { InstanceId } from "./StyleContext";
// import StyleToolbar     from "./StyleToolbar";
// import type { DragCtx } from "./DragContext";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// // ── Main export ───────────────────────────────────────────

// interface PreviewProps {
//   resume:            ResumeData;
//   sections:          ResumeSection[];
//   onSectionsChange?: (s: ResumeSection[]) => void;
// }

// export default function ResumePreview({ resume, sections, onSectionsChange }: PreviewProps) {
//   const sorted    = [...(sections ?? [])].sort((a, b) => a.order - b.order);
//   const accent    = getAccent(resume.colorScheme);
//   const dragId    = useRef<string | null>(null);
//   const sortedRef = useRef<ResumeSection[]>(sorted);
//   sortedRef.current = sorted;

//   // ── Drag state ────────────────────────────────────────
//   const [overId,   setOverId]   = useState<string | null>(null);
//   const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

//   const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
//     dragId.current = id;
//     e.dataTransfer.effectAllowed = "move";
//     const ghost = document.createElement("div");
//     ghost.style.cssText = "position:fixed;top:-999px;opacity:0;width:1px;height:1px";
//     document.body.appendChild(ghost);
//     e.dataTransfer.setDragImage(ghost, 0, 0);
//     setTimeout(() => document.body.removeChild(ghost), 0);
//   }, []);

//   const handleDragOver = useCallback((id: string, e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//     if (id !== dragId.current) setOverId(id);
//   }, []);

//   const handleDrop = useCallback((targetId: string) => {
//     const current = sortedRef.current;
//     if (!dragId.current || dragId.current === targetId) {
//       dragId.current = null; setOverId(null); return;
//     }
//     const fromIdx = current.findIndex((s) => s.id === dragId.current);
//     const toIdx   = current.findIndex((s) => s.id === targetId);
//     if (fromIdx === -1 || toIdx === -1) return;
//     const reordered = [...current];
//     const [moved] = reordered.splice(fromIdx, 1);
//     reordered.splice(toIdx, 0, moved);
//     const updated = reordered.map((s, i) => ({ ...s, order: i }));
//     onSectionsChange?.(updated);
//     if (saveTimer.current) clearTimeout(saveTimer.current);
//     saveTimer.current = setTimeout(() => {
//       reorderSections(resume.id, updated.map((s) => s.id)).catch(console.error);
//     }, 600);
//     dragId.current = null; setOverId(null);
//   }, [resume.id, onSectionsChange]);

//   const handleDragEnd = useCallback(() => {
//     dragId.current = null; setOverId(null);
//   }, []);

//   const dragCtx: DragCtx | null = onSectionsChange ? {
//     overId, accent,
//     onDragStart: handleDragStart,
//     onDragOver:  handleDragOver,
//     onDrop:      handleDrop,
//     onDragEnd:   handleDragEnd,
//   } : null;

//   // ── Per-element style state ───────────────────────────
//   const [overrides,   setOverrides]   = useState<StyleOverrides>(
//     (resume as Record<string, unknown>).styleOverrides as StyleOverrides ?? {}
//   );
//   const [selectedId,   setSelectedId]  = useState<InstanceId | null>(null);
//   const [toolbarRect,  setToolbarRect] = useState<DOMRect | null>(null);

//   function selectElement(id: InstanceId, rect: DOMRect) {
//     setSelectedId(id);
//     setToolbarRect(rect);
//   }
//   function clearSelected() {
//     setSelectedId(null);
//     setToolbarRect(null);
//   }
//   function setOverride(id: InstanceId, patch: Partial<ElementStyle>) {
//     setOverrides((prev) => {
//       const current = prev[id] ?? {};
//       const next    = Object.keys(patch).length === 0 ? {} : { ...current, ...patch };
//       const updated = { ...prev, [id]: next };
//       import("@/actions/builder.actions").then(({ updateResumeMeta }) => {
//         updateResumeMeta(resume.id, { styleOverrides: updated } as Record<string, unknown>);
//       });
//       return updated;
//     });
//   }

//   // Load Google Fonts for any fonts used in element overrides
//   const overrideFontIds = [...new Set(
//     Object.values(overrides).map((o) => o?.font).filter(Boolean) as string[]
//   )];

//   const styleCtx = {
//     overrides, selectedId, selectElement, clearSelected, setOverride, toolbarRect,
//   };

//   // ── Font / size ───────────────────────────────────────
//   const fontDef = RESUME_FONTS.find((f) => f.id === resume.font) ?? RESUME_FONTS[0];
//   const sizeDef = FONT_SIZES.find((s) => s.id === resume.fontSize) ?? FONT_SIZES[2];
//   const basePx  = Math.round(13 * sizeDef.scale);

//   // ── Template ──────────────────────────────────────────
//   const tplProps = { resume, sections: sorted, accent };

//   const Template = (() => {
//     switch (resume.template) {
//       case "classic":        return <ClassicTemplate       {...tplProps} />;
//       case "minimal":        return <MinimalTemplate       {...tplProps} />;
//       case "executive":      return <ExecutiveTemplate     {...tplProps} />;
//       case "compact":        return <CompactTemplate       {...tplProps} />;
//       case "creative":       return <CreativeTemplate      {...tplProps} />;
//       case "elegant":        return <ElegantTemplate       {...tplProps} />;
//       case "technical":      return <TechnicalTemplate     {...tplProps} />;
//       case "chronological":  return <ChronologicalTemplate {...tplProps} />;
//       case "bold":           return <BoldTemplate          {...tplProps} />;
//       default:               return <ModernTemplate        {...tplProps} />;
//     }
//   })();

//   return (
//     <DragContext.Provider value={dragCtx}>
//       <StyleContext.Provider value={styleCtx}>
//         {/* Load Google Fonts for element overrides */}
//         {overrideFontIds.map((fid) => {
//           const { ELEMENT_FONTS } = require("@/lib/resume-constants");
//           const def = ELEMENT_FONTS.find((f: { id: string; google: string | null }) => f.id === fid);
//           if (!def?.google) return null;
//           return (
//             <link key={fid} rel="stylesheet"
//               href={`https://fonts.googleapis.com/css2?family=${def.google}&display=swap`}
//             />
//           );
//         })}
//         <div
//           style={{ fontFamily: fontDef.stack, fontSize: `${basePx}px`, position: "relative" }}
//           onClick={() => clearSelected()}
//         >
//           {Template}
//         </div>
//         <StyleToolbar />
//       </StyleContext.Provider>
//     </DragContext.Provider>
//   );
// }

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { reorderSections, updateResumeMeta } from "@/actions/builder.actions";
import {
  ModernTemplate, ClassicTemplate, MinimalTemplate, ExecutiveTemplate,
  CompactTemplate, CreativeTemplate, ElegantTemplate, TechnicalTemplate,
  ChronologicalTemplate, BoldTemplate, getAccent,
} from "@/components/templates";
import { RESUME_FONTS, FONT_SIZES, ELEMENT_FONTS } from "@/lib/resume-constants";
import { DragContext }  from "./DragContext";
import { StyleContext, StyleOverrides, ElementStyle } from "./StyleContext";
import type { InstanceId } from "./StyleContext";
import StyleToolbar     from "./StyleToolbar";
import type { DragCtx } from "./DragContext";
import type { ResumeData, ResumeSection } from "@/types/resume";

// ── Main export ───────────────────────────────────────────

interface PreviewProps {
  resume:            ResumeData;
  sections:          ResumeSection[];
  onSectionsChange?: (s: ResumeSection[]) => void;
}

export default function ResumePreview({ resume, sections, onSectionsChange }: PreviewProps) {
  const sorted    = [...(sections ?? [])].sort((a, b) => a.order - b.order);
  const accent    = getAccent(resume.colorScheme);
  const dragId    = useRef<string | null>(null);
  const sortedRef = useRef<ResumeSection[]>(sorted);
  sortedRef.current = sorted;

  // ── Drag state ────────────────────────────────────────
  const [overId,   setOverId]   = useState<string | null>(null);
  const saveTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styleSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (saveTimer.current)      clearTimeout(saveTimer.current);
    if (styleSaveTimer.current) clearTimeout(styleSaveTimer.current);
  }, []);

  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
    const ghost = document.createElement("div");
    ghost.style.cssText = "position:fixed;top:-999px;opacity:0;width:1px;height:1px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }, []);

  const handleDragOver = useCallback((id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragId.current) setOverId(id);
  }, []);

  const handleDrop = useCallback((targetId: string) => {
    const current = sortedRef.current;
    if (!dragId.current || dragId.current === targetId) {
      dragId.current = null; setOverId(null); return;
    }
    const fromIdx = current.findIndex((s) => s.id === dragId.current);
    const toIdx   = current.findIndex((s) => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...current];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    onSectionsChange?.(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      reorderSections(resume.id, updated.map((s) => s.id)).catch(console.error);
    }, 600);
    dragId.current = null; setOverId(null);
  }, [resume.id, onSectionsChange]);

  const handleDragEnd = useCallback(() => {
    dragId.current = null; setOverId(null);
  }, []);

  const dragCtx: DragCtx | null = onSectionsChange ? {
    overId, accent,
    onDragStart: handleDragStart,
    onDragOver:  handleDragOver,
    onDrop:      handleDrop,
    onDragEnd:   handleDragEnd,
  } : null;

  // ── Per-element style state ───────────────────────────
  const [overrides,   setOverrides]   = useState<StyleOverrides>(
    (resume.styleOverrides ?? {}) as StyleOverrides
  );
  const [selectedId,   setSelectedId]  = useState<InstanceId | null>(null);
  const [toolbarRect,  setToolbarRect] = useState<DOMRect | null>(null);

  function selectElement(id: InstanceId, rect: DOMRect) {
    setSelectedId(id);
    setToolbarRect(rect);
  }
  function clearSelected() {
    setSelectedId(null);
    setToolbarRect(null);
  }
  function setOverride(id: InstanceId, patch: Partial<ElementStyle>) {
    const current = overrides[id] ?? {};
    const next    = Object.keys(patch).length === 0 ? {} : { ...current, ...patch };
    const updated = { ...overrides, [id]: next };
    setOverrides(updated);
    if (styleSaveTimer.current) clearTimeout(styleSaveTimer.current);
    styleSaveTimer.current = setTimeout(() => {
      updateResumeMeta(resume.id, { styleOverrides: updated });
    }, 600);
  }

  // Load Google Fonts for any fonts used in element overrides
  const overrideFontIds = [...new Set(
    Object.values(overrides).map((o) => o?.font).filter(Boolean) as string[]
  )];

  const styleCtx = {
    overrides, selectedId, selectElement, clearSelected, setOverride, toolbarRect,
  };

  // ── Font / size ───────────────────────────────────────
  const fontDef = RESUME_FONTS.find((f) => f.id === resume.font) ?? RESUME_FONTS[0];
  const sizeDef = FONT_SIZES.find((s) => s.id === resume.fontSize) ?? FONT_SIZES[2];
  const basePx  = Math.round(13 * sizeDef.scale);

  // ── Template ──────────────────────────────────────────
  const tplProps = { resume, sections: sorted, accent };

  const Template = (() => {
    switch (resume.template) {
      case "classic":        return <ClassicTemplate       {...tplProps} />;
      case "minimal":        return <MinimalTemplate       {...tplProps} />;
      case "executive":      return <ExecutiveTemplate     {...tplProps} />;
      case "compact":        return <CompactTemplate       {...tplProps} />;
      case "creative":       return <CreativeTemplate      {...tplProps} />;
      case "elegant":        return <ElegantTemplate       {...tplProps} />;
      case "technical":      return <TechnicalTemplate     {...tplProps} />;
      case "chronological":  return <ChronologicalTemplate {...tplProps} />;
      case "bold":           return <BoldTemplate          {...tplProps} />;
      default:               return <ModernTemplate        {...tplProps} />;
    }
  })();

  return (
    <DragContext.Provider value={dragCtx}>
      <StyleContext.Provider value={styleCtx}>
        {/* Load Google Fonts for element overrides */}
        {overrideFontIds.map((fid) => {
          const def = ELEMENT_FONTS.find((f) => f.id === fid);
          if (!def?.google) return null;
          return (
            <link key={fid} rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${def.google}&display=swap`}
            />
          );
        })}
        <div
          style={{ fontFamily: fontDef.stack, fontSize: `${basePx}px`, position: "relative" }}
          onClick={() => clearSelected()}
        >
          {Template}
        </div>
        <StyleToolbar />
      </StyleContext.Provider>
    </DragContext.Provider>
  );
}