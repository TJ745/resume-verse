"use client";

// ── Per-element style override system ─────────────────────
// Allows users to click any resume element (name, heading, body text)
// and change its font family or size independently.

import { createContext, useContext } from "react";
import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";

// ── Types ─────────────────────────────────────────────────

export type ElementKey = "name" | "jobTitle" | "sectionHeading" | "body";

export interface ElementStyle {
  font?: string; // font id from RESUME_FONTS
  fontSize?: string; // size id from FONT_SIZES, but here used as em multiplier label
  bold?: boolean;
  italic?: boolean;
}

export type StyleOverrides = Partial<Record<ElementKey, ElementStyle>>;

export interface StyleCtx {
  overrides: StyleOverrides;
  selected: ElementKey | null;
  selectElement: (key: ElementKey, rect: DOMRect) => void;
  clearSelected: () => void;
  setOverride: (key: ElementKey, style: Partial<ElementStyle>) => void;
  toolbarRect: DOMRect | null;
}

export const StyleContext = createContext<StyleCtx | null>(null);

// ── Hook ──────────────────────────────────────────────────

export function useStyleCtx() {
  return useContext(StyleContext);
}

// ── Helper — resolve CSS style for an element ─────────────
// Returns inline style merging base style with any override.

export function resolveStyle(
  key: ElementKey,
  overrides: StyleOverrides,
  base?: React.CSSProperties,
): React.CSSProperties {
  const ov = overrides[key];
  if (!ov) return base ?? {};

  const result: React.CSSProperties = { ...base };

  if (ov.font) {
    const fontDef = RESUME_FONTS.find((f) => f.id === ov.font);
    if (fontDef) result.fontFamily = fontDef.stack;
  }
  if (ov.fontSize) {
    // fontSize override is a FONT_SIZES scale id — convert to em multiplier
    // relative to the current base. We express it as a numeric em value.
    const sizeMap: Record<string, string> = {
      xs: "0.75em",
      sm: "0.875em",
      md: "1em",
      lg: "1.2em",
      xl: "1.4em",
    };
    result.fontSize = sizeMap[ov.fontSize] ?? "1em";
  }
  if (ov.bold !== undefined) result.fontWeight = ov.bold ? 700 : "inherit";
  if (ov.italic !== undefined)
    result.fontStyle = ov.italic ? "italic" : "normal";

  return result;
}

// ── Clickable wrapper ─────────────────────────────────────
// Wrap any resume element with this to make it selectable for styling.
// In print/share mode (no StyleContext), renders children as-is.

export function Styleable({
  elementKey,
  style,
  children,
  tag = "span",
}: {
  elementKey: ElementKey;
  style?: React.CSSProperties;
  children: React.ReactNode;
  tag?: "span" | "div" | "p" | "h1" | "h2";
}) {
  const ctx = useStyleCtx();

  const resolved = ctx ? resolveStyle(elementKey, ctx.overrides, style) : style;
  const isSelected = ctx?.selected === elementKey;

  const handleClick = (e: React.MouseEvent) => {
    if (!ctx) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ctx.selectElement(elementKey, rect);
  };

  const Tag = tag as React.ElementType;

  return (
    <Tag
      onClick={ctx ? handleClick : undefined}
      style={{
        ...resolved,
        ...(ctx
          ? {
              cursor: "pointer",
              outline: isSelected ? "2px solid #c84b2f" : "none",
              outlineOffset: 2,
              borderRadius: 2,
            }
          : {}),
      }}
    >
      {children}
    </Tag>
  );
}
