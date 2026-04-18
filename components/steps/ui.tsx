"use client";

import { useState } from "react";

// ── inputStyle kept for Step files that still use it as a CSSProperties spread ──
// Gradually all steps will move to Tailwind classes — this bridges the gap.
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

// ── Shared input className (preferred going forward) ──────
export const inputCls =
  " px-3 py-2 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.8125rem] outline-none leading-snug focus:border-rv-accent transition-colors";

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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[0.7rem] font-semibold text-rv-muted tracking-[0.04em]">
        {label}
        {optional && (
          <span className="font-normal text-rv-muted ml-1">(optional)</span>
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
    <div className="flex items-center justify-between border-b border-rv-border pb-1.5 mb-3">
      <span className="text-[0.62rem] font-bold tracking-widest uppercase text-rv-muted">
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
      className={[
        "inline-flex items-center gap-1.5 bg-transparent border-0 cursor-pointer text-[0.72rem] p-0 shrink-0 transition-colors",
        enabled ? "text-rv-accent" : "text-rv-muted",
      ].join(" ")}
    >
      <span
        className={[
          "w-7 h-4 rounded-full flex items-center px-0.5 shrink-0 transition-colors duration-150",
          enabled ? "bg-rv-accent" : "bg-rv-border",
        ].join(" ")}
      >
        <span
          className={[
            "w-3 h-3 rounded-full bg-white block transition-transform duration-150",
            enabled ? "translate-x-3" : "translate-x-0",
          ].join(" ")}
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
      className="w-full bg-transparent border border-dashed border-rv-border rounded-sm py-2 px-4 cursor-pointer text-rv-muted text-[0.78rem] font-medium transition-colors duration-150 hover:border-rv-accent hover:text-rv-accent"
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
    <div className="border border-rv-border rounded-sm bg-rv-white mb-2">
      <div
        className="flex items-center justify-between px-3 py-2 bg-rv-cream cursor-pointer select-none border-b border-rv-border"
        style={{ borderBottom: open ? undefined : "none" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[0.75rem] font-medium text-rv-ink">
          {open ? "▾" : "▸"} {title ?? "Item"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="bg-transparent border-0 cursor-pointer text-rv-muted text-[0.72rem] p-0 transition-colors hover:text-rv-accent"
        >
          Remove
        </button>
      </div>
      {open && <div className="flex flex-col gap-2.5 p-3">{children}</div>}
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
    <label className="inline-flex items-center gap-1.5 text-[0.78rem] text-rv-muted cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 cursor-pointer accent-rv-accent"
      />
      {label}
    </label>
  );
}

// ── Small icon remove button ──────────────────────────────

export function IconRemove({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent border-0 cursor-pointer text-rv-muted text-[0.75rem] shrink-0 px-0.5 leading-none transition-colors hover:text-rv-accent"
      title="Remove"
    >
      ✕
    </button>
  );
}
