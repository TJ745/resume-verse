"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAIGenerate } from "./useAIGenerate";

type GenerateType =
  | "summary"
  | "experience_bullets"
  | "skills"
  | "project_description";

interface ContextField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface AIGenerateButtonProps {
  type: GenerateType;
  contextFields: ContextField[];
  prefillContext?: Record<string, string>;
  onAccept: (text: string) => void;
  label?: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.8125rem",
  outline: "none",
  fontFamily: "inherit",
  resize: "vertical" as const,
};

export default function AIGenerateButton({
  type,
  contextFields,
  prefillContext = {},
  onAccept,
  label = "Generate with AI",
}: AIGenerateButtonProps) {
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<Record<string, string>>(prefillContext);
  const [result, setResult] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const { generate, streaming, streamedText, error, reset } = useAIGenerate({
    onDone: (text) => setResult(text),
  });

  // Sync prefillContext when it changes
  useEffect(() => {
    setCtx((prev) => ({ ...prefillContext, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    // Prefer opening below; if not enough space open above
    const spaceBelow = window.innerHeight - rect.bottom;
    const popH = 380; // approximate max height
    const top = spaceBelow >= popH ? rect.bottom + 6 : rect.top - popH - 6;
    // Keep within horizontal viewport
    const left = Math.min(rect.left, window.innerWidth - 332);
    setPos({ top, left });
  }, []);

  // Close on outside click + reposition on scroll/resize
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        if (!streaming) setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    if (open) {
      window.addEventListener("scroll", updatePos, true);
      window.addEventListener("resize", updatePos);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [streaming, open, updatePos]);

  function handleOpen() {
    reset();
    setResult("");
    setCtx(prefillContext);
    updatePos();
    setOpen(true);
  }

  function handleGenerate() {
    setResult("");
    generate(type, ctx);
  }

  function handleAccept() {
    onAccept(result || streamedText);
    setOpen(false);
    reset();
    setResult("");
  }

  const displayText = result || streamedText;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-150"
        style={{
          background: "none",
          border: "1px solid var(--rv-border)",
          borderRadius: 2,
          padding: "0.35rem 0.75rem",
          cursor: "pointer",
          color: "var(--rv-muted)",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--rv-accent)";
          e.currentTarget.style.color = "var(--rv-accent)";
          e.currentTarget.style.background = "rgba(200,75,47,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--rv-border)";
          e.currentTarget.style.color = "var(--rv-muted)";
          e.currentTarget.style.background = "none";
        }}
      >
        <SparkleIcon />
        {label}
      </button>

      {/* Popover — rendered as fixed overlay so it escapes overflow:hidden parents */}
      {open && (
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            zIndex: 200,
            top: pos.top,
            left: pos.left,
            width: 320,
            background: "var(--rv-white)",
            border: "1px solid var(--rv-border)",
            borderRadius: 2,
            boxShadow: "0 12px 40px rgba(15,14,13,0.18)",
            padding: "1rem",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <SparkleIcon color="var(--rv-accent)" />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--rv-accent)", letterSpacing: "0.1em" }}
              >
                AI Generate
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--rv-muted)",
                fontSize: "1rem",
                lineHeight: 1,
                fontFamily: "inherit",
              }}
            >
              ×
            </button>
          </div>

          {/* Context fields */}
          {!displayText && (
            <div className="flex flex-col gap-2.5 mb-3">
              {contextFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "var(--rv-muted)",
                    }}
                  >
                    {field.label}
                  </label>
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      value={ctx[field.key] ?? ""}
                      onChange={(e) =>
                        setCtx((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={ctx[field.key] ?? ""}
                      onChange={(e) =>
                        setCtx((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Streaming output */}
          {displayText && (
            <div
              className="mb-3 text-xs leading-relaxed"
              style={{
                background: "var(--rv-cream)",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                padding: "0.75rem",
                color: "var(--rv-ink)",
                whiteSpace: "pre-wrap",
                maxHeight: 160,
                overflowY: "auto",
                lineHeight: 1.65,
              }}
            >
              {displayText}
              {streaming && (
                <span
                  className="inline-block"
                  style={{
                    width: 6,
                    height: 12,
                    background: "var(--rv-accent)",
                    marginLeft: 2,
                    verticalAlign: "middle",
                    animation: "rv-fade-up 0.5s ease infinite alternate",
                  }}
                />
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              className="text-xs mb-3 px-3 py-2"
              style={{
                background: "rgba(200,75,47,0.08)",
                border: "1px solid rgba(200,75,47,0.2)",
                borderRadius: 2,
                color: "var(--rv-accent)",
              }}
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!displayText ? (
              <button
                onClick={handleGenerate}
                disabled={streaming}
                className="flex-1 text-xs font-semibold py-2 transition-colors duration-150"
                style={{
                  background: streaming
                    ? "var(--rv-muted)"
                    : "var(--rv-accent)",
                  color: "var(--rv-white)",
                  border: "none",
                  borderRadius: 2,
                  cursor: streaming ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {streaming ? "Generating…" : "Generate →"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setResult("");
                    reset();
                  }}
                  disabled={streaming}
                  className="text-xs font-medium py-2 px-3 transition-colors duration-150"
                  style={{
                    background: "none",
                    border: "1px solid var(--rv-border)",
                    borderRadius: 2,
                    cursor: "pointer",
                    color: "var(--rv-muted)",
                    fontFamily: "inherit",
                  }}
                >
                  Retry
                </button>
                <button
                  onClick={handleAccept}
                  disabled={streaming}
                  className="flex-1 text-xs font-semibold py-2 transition-colors duration-150"
                  style={{
                    background: streaming
                      ? "var(--rv-muted)"
                      : "var(--rv-accent)",
                    color: "var(--rv-white)",
                    border: "none",
                    borderRadius: 2,
                    cursor: streaming ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {streaming ? "Generating…" : "Use this →"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SparkleIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{ width: 12, height: 12, fill: color, flexShrink: 0 }}
    >
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}
