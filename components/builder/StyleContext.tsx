// "use client";

// // ── Per-element style override system ─────────────────────
// // Allows users to click any resume element (name, heading, body text)
// // and change its font family or size independently.

// import { createContext, useContext } from "react";
// import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";

// // ── Types ─────────────────────────────────────────────────

// export type ElementKey = "name" | "jobTitle" | "sectionHeading" | "body";

// export interface ElementStyle {
//   font?: string; // font id from RESUME_FONTS
//   fontSize?: string; // size id from FONT_SIZES, but here used as em multiplier label
//   bold?: boolean;
//   italic?: boolean;
// }

// export type StyleOverrides = Partial<Record<ElementKey, ElementStyle>>;

// export interface StyleCtx {
//   overrides: StyleOverrides;
//   selected: ElementKey | null;
//   selectElement: (key: ElementKey, rect: DOMRect) => void;
//   clearSelected: () => void;
//   setOverride: (key: ElementKey, style: Partial<ElementStyle>) => void;
//   toolbarRect: DOMRect | null;
// }

// export const StyleContext = createContext<StyleCtx | null>(null);

// // ── Hook ──────────────────────────────────────────────────

// export function useStyleCtx() {
//   return useContext(StyleContext);
// }

// // ── Helper — resolve CSS style for an element ─────────────
// // Returns inline style merging base style with any override.

// export function resolveStyle(
//   key: ElementKey,
//   overrides: StyleOverrides,
//   base?: React.CSSProperties,
// ): React.CSSProperties {
//   const ov = overrides[key];
//   if (!ov) return base ?? {};

//   const result: React.CSSProperties = { ...base };

//   if (ov.font) {
//     const fontDef = RESUME_FONTS.find((f) => f.id === ov.font);
//     if (fontDef) result.fontFamily = fontDef.stack;
//   }
//   if (ov.fontSize) {
//     // fontSize override is a FONT_SIZES scale id — convert to em multiplier
//     // relative to the current base. We express it as a numeric em value.
//     const sizeMap: Record<string, string> = {
//       xs: "0.75em",
//       sm: "0.875em",
//       md: "1em",
//       lg: "1.2em",
//       xl: "1.4em",
//     };
//     result.fontSize = sizeMap[ov.fontSize] ?? "1em";
//   }
//   if (ov.bold !== undefined) result.fontWeight = ov.bold ? 700 : "inherit";
//   if (ov.italic !== undefined)
//     result.fontStyle = ov.italic ? "italic" : "normal";

//   return result;
// }

// // ── Clickable wrapper ─────────────────────────────────────
// // Wrap any resume element with this to make it selectable for styling.
// // In print/share mode (no StyleContext), renders children as-is.

// export function Styleable({
//   elementKey,
//   style,
//   children,
//   tag = "span",
// }: {
//   elementKey: ElementKey;
//   style?: React.CSSProperties;
//   children: React.ReactNode;
//   tag?: "span" | "div" | "p" | "h1" | "h2";
// }) {
//   const ctx = useStyleCtx();

//   const resolved = ctx ? resolveStyle(elementKey, ctx.overrides, style) : style;
//   const isSelected = ctx?.selected === elementKey;

//   const handleClick = (e: React.MouseEvent) => {
//     if (!ctx) return;
//     e.stopPropagation();
//     const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
//     ctx.selectElement(elementKey, rect);
//   };

//   const Tag = tag as React.ElementType;

//   return (
//     <Tag
//       onClick={ctx ? handleClick : undefined}
//       style={{
//         ...resolved,
//         ...(ctx
//           ? {
//               cursor: "pointer",
//               outline: isSelected ? "2px solid #c84b2f" : "none",
//               outlineOffset: 2,
//               borderRadius: 2,
//             }
//           : {}),
//       }}
//     >
//       {children}
//     </Tag>
//   );
// }



"use client";

import { createContext, useContext } from "react";
import { ELEMENT_FONTS } from "@/lib/resume-constants";

// ── Types ─────────────────────────────────────────────────

// instanceId is a unique string per element:
//   "name"           → the resume name (singleton)
//   "jobTitle"       → job title (singleton)
//   "h:{sectionId}"  → heading of that specific section
//   "b:{sectionId}"  → body text of that specific section
export type InstanceId = string;

export interface ElementStyle {
  font?:      string;   // font id from ELEMENT_FONTS
  fontSize?:  string;   // pt value as string: "8", "9", "10", "11", "12" etc.
  bold?:      boolean;
  italic?:    boolean;
  underline?: boolean;
}

export type StyleOverrides = Record<InstanceId, ElementStyle>;

export interface StyleCtx {
  overrides:     StyleOverrides;
  selectedId:    InstanceId | null;
  selectElement: (id: InstanceId, rect: DOMRect) => void;
  clearSelected: () => void;
  setOverride:   (id: InstanceId, patch: Partial<ElementStyle>) => void;
  toolbarRect:   DOMRect | null;
}

export const StyleContext = createContext<StyleCtx | null>(null);

export function useStyleCtx() {
  return useContext(StyleContext);
}

// ── Resolve CSS from override ─────────────────────────────
// pt → em conversion: base is 13px = 9.75pt ≈ 10pt
// em = pt / 10  (since 13px ≈ 10pt at 96dpi → 1em = 10pt)

export function resolveStyle(
  id:        InstanceId,
  overrides: StyleOverrides,
  base?:     React.CSSProperties,
): React.CSSProperties {
  const ov = overrides[id];
  if (!ov) return base ?? {};

  const result: React.CSSProperties = { ...base };

  if (ov.font) {
    const fontDef = ELEMENT_FONTS.find((f) => f.id === ov.font);
    if (fontDef) result.fontFamily = fontDef.stack;
  }
  if (ov.fontSize) {
    // Convert pt to em: 1em = 13px ≈ 9.75pt
    // Use 9.75pt as base so pt values feel right vs Word
    const pt = parseFloat(ov.fontSize);
    if (!isNaN(pt)) result.fontSize = `${(pt / 9.75).toFixed(3)}em`;
  }
  if (ov.bold      !== undefined) result.fontWeight  = ov.bold      ? 700       : "inherit";
  if (ov.italic    !== undefined) result.fontStyle   = ov.italic    ? "italic"  : "normal";
  if (ov.underline !== undefined) result.textDecoration = ov.underline ? "underline" : "none";

  return result;
}

// ── Styleable ─────────────────────────────────────────────
// Wraps any resume element to make it individually selectable.
// Each element needs a unique instanceId.
// No-ops in print/share mode (no StyleContext).

export function Styleable({
  instanceId,
  style,
  children,
  tag = "span",
}: {
  instanceId: InstanceId;
  style?:     React.CSSProperties;
  children:   React.ReactNode;
  tag?:       "span" | "div" | "p" | "h1" | "h2";
}) {
  const ctx = useStyleCtx();

  const resolved   = ctx ? resolveStyle(instanceId, ctx.overrides, style) : style;
  const isSelected = ctx?.selectedId === instanceId;

  const handleClick = (e: React.MouseEvent) => {
    if (!ctx) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ctx.selectElement(instanceId, rect);
  };

  const Tag = tag as React.ElementType;

  return (
    <Tag
      onClick={ctx ? handleClick : undefined}
      style={{
        ...resolved,
        ...(ctx ? {
          cursor:        "pointer",
          borderRadius:  2,
          outline:       isSelected
            ? "2px solid #c84b2f"
            : "1px dashed transparent",
          outlineOffset: 2,
          transition:    "outline 0.1s",
        } : {}),
      }}
      // Show hover hint
      {...(ctx ? {
        onMouseEnter: (e: React.MouseEvent) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.outline =
              "1px dashed rgba(200,75,47,0.4)";
          }
        },
        onMouseLeave: (e: React.MouseEvent) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.outline =
              "1px dashed transparent";
          }
        },
      } : {})}
    >
      {children}
    </Tag>
  );
}