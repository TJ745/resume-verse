"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { updateResumeMeta } from "@/actions/builder.actions";
import ExportPDFButton from "@/components/shared/ExportPDFButton";

// ── Templates & color schemes ─────────────────────────────
// Imported for local use + re-exported so other files can import from here
import { TEMPLATES, COLOR_SCHEMES } from "@/lib/resume-constants";
export { TEMPLATES, COLOR_SCHEMES };

// ── Props ─────────────────────────────────────────────────

interface BuilderTopbarProps {
  resumeId: string;
  title: string;
  template: string;
  colorScheme?: string;
}

// ── Reusable dropdown wrapper ─────────────────────────────

function Dropdown({
  trigger,
  children,
  align = "right",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className="absolute mt-1 z-50 py-1"
          style={{
            top: "100%",
            [align === "right" ? "right" : "left"]: 0,
            background: "var(--rv-white)",
            border: "1px solid var(--rv-border)",
            borderRadius: 2,
            boxShadow: "0 12px 32px rgba(15,14,13,0.12)",
            minWidth: 220,
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Chevron icon ──────────────────────────────────────────

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 12 12"
      style={{
        width: 10,
        height: 10,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: 1.5,
      }}
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────

export default function BuilderTopbar({
  resumeId,
  title,
  template,
  colorScheme = "terracotta",
}: BuilderTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [currentScheme, setCurrentScheme] = useState(colorScheme);
  const [isPending, startTransition] = useTransition();

  const activeTemplate =
    TEMPLATES.find((t) => t.id === currentTemplate) ?? TEMPLATES[0];
  const activeScheme =
    COLOR_SCHEMES.find((s) => s.id === currentScheme) ?? COLOR_SCHEMES[0];

  function handleTitleBlur() {
    setEditingTitle(false);
    if (titleValue.trim() === title) return;
    startTransition(() =>
      updateResumeMeta(resumeId, {
        title: titleValue.trim() || "Untitled Resume",
      }),
    );
  }

  function handleTemplateChange(id: string) {
    setCurrentTemplate(id);
    startTransition(() => updateResumeMeta(resumeId, { template: id }));
  }

  function handleSchemeChange(id: string) {
    setCurrentScheme(id);
    startTransition(() => updateResumeMeta(resumeId, { colorScheme: id }));
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 gap-4"
      style={{
        height: 56,
        background: "var(--rv-paper)",
        borderBottom: "1px solid var(--rv-border)",
      }}
    >
      {/* ── Left: back + title ── */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm no-underline shrink-0 transition-opacity duration-150 hover:opacity-60"
          style={{ color: "var(--rv-muted)" }}
        >
          <span>←</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <span style={{ color: "var(--rv-border)", userSelect: "none" }}>|</span>

        {editingTitle ? (
          <input
            autoFocus
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setTitleValue(title);
                setEditingTitle(false);
              }
            }}
            className="text-sm font-medium"
            style={{
              border: "none",
              borderBottom: "1px solid var(--rv-accent)",
              background: "transparent",
              color: "var(--rv-ink)",
              outline: "none",
              fontFamily: "inherit",
              padding: "0 0 1px",
              maxWidth: 260,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-medium truncate"
            style={{
              background: "none",
              border: "none",
              cursor: "text",
              color: "var(--rv-ink)",
              fontFamily: "inherit",
              padding: 0,
              maxWidth: 260,
            }}
            title="Click to rename"
          >
            {titleValue}
          </button>
        )}

        {isPending && (
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--rv-muted)" }}
          >
            Saving…
          </span>
        )}
      </div>

      {/* ── Right: dropdowns + export ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Color scheme dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
              style={{
                background: "none",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
              }}
            >
              {/* Color swatch */}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: activeScheme.swatch,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="hidden sm:inline">{activeScheme.label}</span>
              <ChevronDown />
            </button>
          }
        >
          <div
            className="px-3 py-1.5"
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              borderBottom: "1px solid var(--rv-border)",
              marginBottom: 4,
            }}
          >
            Color scheme
          </div>
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleSchemeChange(scheme.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-100"
              style={{
                background:
                  currentScheme === scheme.id ? "var(--rv-cream)" : "none",
                border: "none",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rv-cream)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  currentScheme === scheme.id ? "var(--rv-cream)" : "none")
              }
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: scheme.swatch,
                  flexShrink: 0,
                  border:
                    currentScheme === scheme.id
                      ? `2px solid ${scheme.swatch}`
                      : "2px solid transparent",
                  outline:
                    currentScheme === scheme.id
                      ? `1px solid ${scheme.swatch}`
                      : "none",
                  outlineOffset: 1,
                }}
              />
              <span className="font-medium">{scheme.label}</span>
              {currentScheme === scheme.id && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--rv-accent)",
                    fontSize: 10,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </Dropdown>

        {/* Template dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="inline-flex items-center gap-2 text-xs font-medium transition-colors duration-150"
              style={{
                background: "none",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                color: "var(--rv-ink)",
                fontFamily: "inherit",
              }}
            >
              <TemplateIcon />
              <span className="hidden sm:inline">{activeTemplate.label}</span>
              <ChevronDown />
            </button>
          }
        >
          <div
            className="px-3 py-1.5"
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              borderBottom: "1px solid var(--rv-border)",
              marginBottom: 4,
            }}
          >
            Template
          </div>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateChange(tmpl.id)}
              className="w-full flex flex-col px-3 py-2 text-xs transition-colors duration-100"
              style={{
                background:
                  currentTemplate === tmpl.id ? "var(--rv-cream)" : "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rv-cream)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  currentTemplate === tmpl.id ? "var(--rv-cream)" : "none")
              }
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="font-medium"
                  style={{
                    color:
                      currentTemplate === tmpl.id
                        ? "var(--rv-accent)"
                        : "var(--rv-ink)",
                  }}
                >
                  {tmpl.label}
                </span>
                {currentTemplate === tmpl.id && (
                  <span style={{ color: "var(--rv-accent)", fontSize: 10 }}>
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  color: "var(--rv-muted)",
                  marginTop: 1,
                  fontSize: "0.7rem",
                }}
              >
                {tmpl.description}
              </span>
            </button>
          ))}
        </Dropdown>

        {/* Divider */}
        <span
          style={{
            width: 1,
            height: 20,
            background: "var(--rv-border)",
            display: "inline-block",
          }}
        />

        {/* Export */}
        <ExportPDFButton resumeId={resumeId} variant="topbar" />
      </div>
    </header>
  );
}

function TemplateIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      style={{
        width: 12,
        height: 12,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: 1.5,
      }}
    >
      <rect x="1" y="1" width="12" height="12" rx="1" />
      <path d="M1 4h12M5 4v9" />
    </svg>
  );
}
