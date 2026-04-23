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
  font?: string; // font id from ELEMENT_FONTS
  fontSize?: string; // pt value as string: "8", "9", "10", "11", "12" etc.
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type StyleOverrides = Record<InstanceId, ElementStyle>;

export interface StyleCtx {
  overrides: StyleOverrides;
  selectedId: InstanceId | null;
  selectElement: (id: InstanceId, rect: DOMRect) => void;
  clearSelected: () => void;
  setOverride: (id: InstanceId, patch: Partial<ElementStyle>) => void;
  toolbarRect: DOMRect | null;
}

export const StyleContext = createContext<StyleCtx | null>(null);

export function useStyleCtx() {
  return useContext(StyleContext);
}

// ── Resolve CSS from override ─────────────────────────────
// pt → em conversion: base is 13px = 9.75pt ≈ 10pt
// em = pt / 10  (since 13px ≈ 10pt at 96dpi → 1em = 10pt)

export function resolveStyle(
  id: InstanceId,
  overrides: StyleOverrides,
): React.CSSProperties {
  const ov = overrides[id];
  if (!ov) return {};

  const result: React.CSSProperties = {};

  if (ov.font) {
    const fontDef = ELEMENT_FONTS.find((f) => f.id === ov.font);
    if (fontDef) result.fontFamily = fontDef.stack;
  }
  if (ov.fontSize) {
    const pt = parseFloat(ov.fontSize);
    if (!isNaN(pt)) result.fontSize = `${(pt / 9.75).toFixed(3)}em`;
  }
  if (ov.bold !== undefined) result.fontWeight = ov.bold ? 700 : "inherit";
  if (ov.italic !== undefined)
    result.fontStyle = ov.italic ? "italic" : "normal";
  if (ov.underline !== undefined)
    result.textDecoration = ov.underline ? "underline" : "none";

  return result;
}

// ── Styleable ─────────────────────────────────────────────
// Wraps any resume element to make it individually selectable.
// Each element needs a unique instanceId.
// No-ops in print/share mode (no StyleContext).

export function Styleable({
  instanceId,
  className,
  children,
  tag = "span",
}: {
  instanceId: InstanceId;
  className?: string;
  children: React.ReactNode;
  tag?: "span" | "div" | "p" | "h1" | "h2";
}) {
  const ctx = useStyleCtx();
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
      data-sid={instanceId}
      data-selected={isSelected ? "" : undefined}
      className={[className, ctx ? "style-editable" : ""]
        .filter(Boolean)
        .join(" ")}
      style={ctx ? resolveStyle(instanceId, ctx.overrides) : undefined}
      onClick={ctx ? handleClick : undefined}
    >
      {children}
    </Tag>
  );
}
