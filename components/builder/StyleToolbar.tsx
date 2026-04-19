"use client";

// Floating mini-toolbar that appears when user clicks a resume element.
// Shows font family + size pickers for just that element.

import { useEffect, useRef } from "react";
import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";
import { useStyleCtx } from "./StyleContext";
import type { ElementKey, ElementStyle } from "./StyleContext";

const ELEMENT_LABELS: Record<ElementKey, string> = {
  name: "Name",
  jobTitle: "Job Title",
  sectionHeading: "Section Heading",
  body: "Body Text",
};

export default function StyleToolbar() {
  const ctx = useStyleCtx();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!ctx?.selected) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx!.clearSelected();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctx?.selected]);

  if (!ctx?.selected || !ctx.toolbarRect) return null;

  const key = ctx.selected;
  const label = ELEMENT_LABELS[key];
  const ov = ctx.overrides[key] ?? {};
  const rect = ctx.toolbarRect;

  function set(patch: Partial<ElementStyle>) {
    ctx!.setOverride(key, patch);
  }

  // Position: above the element, centred
  const toolbarWidth = 340;
  const left = Math.max(
    8,
    Math.min(
      rect.left + rect.width / 2 - toolbarWidth / 2,
      window.innerWidth - toolbarWidth - 8,
    ),
  );
  const top = rect.top - 8; // will use transform to go above

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: top,
        left: left,
        width: toolbarWidth,
        zIndex: 9999,
        transform: "translateY(-100%)",
      }}
    >
      <div
        style={{
          background: "#1a1917",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6,
          padding: "8px 10px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {label}
          </span>
          <button
            onClick={ctx.clearSelected}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "0.9rem",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Font family */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {RESUME_FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => set({ font: f.id })}
              style={{
                background:
                  ov.font === f.id ? "#c84b2f" : "rgba(255,255,255,0.07)",
                border:
                  ov.font === f.id
                    ? "1px solid #c84b2f"
                    : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 3,
                padding: "3px 8px",
                cursor: "pointer",
                color: ov.font === f.id ? "#fff" : "rgba(255,255,255,0.7)",
                fontSize: "0.65rem",
                fontFamily: f.stack,
                whiteSpace: "nowrap",
                transition: "all 0.1s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Font size + bold/italic */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Size buttons */}
          <div style={{ display: "flex", gap: 2, flex: 1 }}>
            {FONT_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => set({ fontSize: s.id })}
                style={{
                  flex: 1,
                  background:
                    ov.fontSize === s.id ? "#c84b2f" : "rgba(255,255,255,0.07)",
                  border:
                    ov.fontSize === s.id
                      ? "1px solid #c84b2f"
                      : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  padding: "3px 0",
                  cursor: "pointer",
                  color:
                    ov.fontSize === s.id ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  transition: "all 0.1s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 20,
              background: "rgba(255,255,255,0.1)",
            }}
          />

          {/* Bold */}
          <button
            onClick={() => set({ bold: !ov.bold })}
            style={{
              background: ov.bold
                ? "rgba(200,75,47,0.3)"
                : "rgba(255,255,255,0.07)",
              border: ov.bold
                ? "1px solid #c84b2f"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
              padding: "3px 8px",
              cursor: "pointer",
              color: ov.bold ? "#c84b2f" : "rgba(255,255,255,0.6)",
              fontSize: "0.7rem",
              fontWeight: 800,
              transition: "all 0.1s",
            }}
          >
            B
          </button>

          {/* Italic */}
          <button
            onClick={() => set({ italic: !ov.italic })}
            style={{
              background: ov.italic
                ? "rgba(200,75,47,0.3)"
                : "rgba(255,255,255,0.07)",
              border: ov.italic
                ? "1px solid #c84b2f"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
              padding: "3px 8px",
              cursor: "pointer",
              color: ov.italic ? "#c84b2f" : "rgba(255,255,255,0.6)",
              fontSize: "0.7rem",
              fontStyle: "italic",
              fontWeight: 600,
              transition: "all 0.1s",
            }}
          >
            I
          </button>

          {/* Reset */}
          {(ov.font || ov.fontSize || ov.bold || ov.italic) && (
            <button
              onClick={() => ctx.setOverride(key, {})}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 3,
                padding: "3px 7px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.55rem",
                transition: "all 0.1s",
              }}
              title="Reset to default"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          width: 0,
          height: 0,
          margin: "0 auto",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}
