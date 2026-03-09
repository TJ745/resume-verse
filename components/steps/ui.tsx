"use client";

import { useState } from "react";

// ── Base styles ───────────────────────────────────────────

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.8125rem",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.5,
  boxSizing: "border-box",
};

export const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "var(--rv-muted)",
  display: "block",
  marginBottom: "0.25rem",
  letterSpacing: "0.04em",
};

// ── Field ─────────────────────────────────────────────────

export function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
      }}
    >
      <label style={labelStyle}>
        {label}
        {optional && (
          <span
            style={{ color: "var(--rv-muted)", fontWeight: 400, marginLeft: 4 }}
          >
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────

export function SectionHeading({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--rv-border)",
        paddingBottom: "0.4rem",
        marginBottom: "0.75rem",
      }}
    >
      <span
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "var(--rv-muted)",
        }}
      >
        {label}
      </span>
      {action}
    </div>
  );
}

// ── Visibility toggle ─────────────────────────────────────

export function VisibilityToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: enabled ? "var(--rv-accent)" : "var(--rv-muted)",
        fontFamily: "inherit",
        fontSize: "0.72rem",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 28,
          height: 16,
          borderRadius: 8,
          background: enabled ? "var(--rv-accent)" : "var(--rv-border)",
          display: "inline-flex",
          alignItems: "center",
          padding: "0 2px",
          transition: "background 0.15s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#fff",
            transform: enabled ? "translateX(12px)" : "translateX(0)",
            transition: "transform 0.15s",
            display: "block",
          }}
        />
      </span>
      {label}
    </button>
  );
}

// ── Add button ────────────────────────────────────────────

export function AddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        background: "none",
        border: "1px dashed var(--rv-border)",
        borderRadius: 2,
        padding: "0.45rem 1rem",
        cursor: "pointer",
        color: "var(--rv-muted)",
        fontFamily: "inherit",
        fontSize: "0.78rem",
        fontWeight: 500,
        transition: "color 0.15s, border-color 0.15s",
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

// ── Item card (collapsible) ───────────────────────────────

export function ItemCard({
  title,
  onRemove,
  children,
  defaultOpen = true,
}: {
  title?: string;
  onRemove: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: "1px solid var(--rv-border)",
        borderRadius: 2,
        background: "var(--rv-white)",
        marginBottom: "0.5rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.45rem 0.75rem",
          borderBottom: open ? "1px solid var(--rv-border)" : "none",
          background: "var(--rv-cream)",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "var(--rv-ink)",
          }}
        >
          {open ? "▾" : "▸"} {title ?? "Item"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--rv-muted)",
            fontFamily: "inherit",
            fontSize: "0.72rem",
            padding: 0,
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--rv-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--rv-muted)")
          }
        >
          Remove
        </button>
      </div>
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "0.75rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Checkbox ──────────────────────────────────────────────

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: "0.78rem",
        color: "var(--rv-muted)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          accentColor: "var(--rv-accent)",
          width: 13,
          height: 13,
          cursor: "pointer",
        }}
      />
      {label}
    </label>
  );
}

// ── Small icon button ─────────────────────────────────────

export function IconRemove({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--rv-muted)",
        fontFamily: "inherit",
        fontSize: "0.75rem",
        flexShrink: 0,
        padding: "0 2px",
        lineHeight: 1,
        transition: "color 0.1s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rv-accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rv-muted)")}
      title="Remove"
    >
      ✕
    </button>
  );
}
