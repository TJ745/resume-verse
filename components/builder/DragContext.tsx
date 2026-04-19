"use client";

import { createContext, useContext, useState } from "react";

// ── Context types ─────────────────────────────────────────

export interface DragCtx {
  overId: string | null;
  accent: string;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragOver: (id: string, e: React.DragEvent) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
}

export const DragContext = createContext<DragCtx | null>(null);

// ── DraggableSection ──────────────────────────────────────
// Wrap any resume section to make it draggable.
// If there's no DragContext (e.g. in print/share), renders children as-is.

export function DraggableSection({
  id,
  children,
  inverted = false,
}: {
  id: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  const ctx = useContext(DragContext);
  const [hover, setHover] = useState(false);

  // No context = print/share mode, render plain
  if (!ctx) return <>{children}</>;

  const isOver = ctx.overId === id;

  return (
    <div
      draggable
      onDragStart={(e) => ctx.onDragStart(id, e)}
      onDragOver={(e) => ctx.onDragOver(id, e)}
      onDrop={() => ctx.onDrop(id)}
      onDragEnd={ctx.onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        cursor: "grab",
        borderRadius: 2,
        outline: isOver
          ? `2px solid ${ctx.accent}`
          : hover
            ? `1px dashed ${inverted ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.12)"}`
            : "2px solid transparent",
        outlineOffset: 1,
        transition: "outline 0.1s",
        background: isOver
          ? inverted
            ? "rgba(255,255,255,0.08)"
            : "rgba(200,75,47,0.04)"
          : "transparent",
      }}
    >
      {children}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: inverted
              ? "rgba(0,0,0,0.55)"
              : "rgba(253,252,250,0.97)",
            border: `1px solid ${inverted ? "rgba(255,255,255,0.2)" : "#e0d9ce"}`,
            borderRadius: 3,
            padding: "2px 6px 2px 4px",
            pointerEvents: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            zIndex: 10,
          }}
        >
          <svg
            viewBox="0 0 10 14"
            width={8}
            height={11}
            fill={inverted ? "rgba(255,255,255,0.7)" : "#9a9288"}
          >
            <circle cx="2.5" cy="2" r="1.1" />
            <circle cx="2.5" cy="7" r="1.1" />
            <circle cx="2.5" cy="12" r="1.1" />
            <circle cx="7.5" cy="2" r="1.1" />
            <circle cx="7.5" cy="7" r="1.1" />
            <circle cx="7.5" cy="12" r="1.1" />
          </svg>
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: inverted ? "rgba(255,255,255,0.8)" : "#6b6560",
              whiteSpace: "nowrap",
            }}
          >
            drag to reorder
          </span>
        </div>
      )}
    </div>
  );
}
