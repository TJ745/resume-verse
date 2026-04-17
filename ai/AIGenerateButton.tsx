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

  useEffect(() => {
    setCtx((prev) => ({ ...prefillContext, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const popH = 380;
    const top = spaceBelow >= popH ? rect.bottom + 6 : rect.top - popH - 6;
    const left = Math.min(rect.left, window.innerWidth - 332);
    setPos({ top, left });
  }, []);

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
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-rv-border bg-transparent px-3 py-1.5 text-xs font-medium text-rv-muted transition-all duration-150 hover:border-rv-accent hover:bg-[rgba(200,75,47,0.04)] hover:text-rv-accent"
      >
        <SparkleIcon />
        {label}
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className="fixed z-200 w-[320px] rounded-sm border border-rv-border bg-rv-white p-4 shadow-[0_12px_40px_rgba(15,14,13,0.18)]"
          style={{ top: pos.top, left: pos.left }}
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SparkleIcon color="var(--rv-accent)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-rv-accent">
                AI Generate
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer border-none bg-transparent font-inherit text-xl leading-none text-rv-muted transition-colors duration-150 hover:text-rv-ink"
            >
              ×
            </button>
          </div>

          {/* Context fields */}
          {!displayText && (
            <div className="mb-3 flex flex-col gap-2.5">
              {contextFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-rv-muted">
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
                      className="w-full resize-y rounded-sm border border-rv-border bg-rv-white px-3 py-2 text-sm text-rv-ink outline-none"
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
                      className="w-full rounded-sm border border-rv-border bg-rv-white px-3 py-2 text-sm text-rv-ink outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Streaming output */}
          {displayText && (
            <div className="mb-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-sm border border-rv-border bg-rv-cream p-3 text-xs leading-[1.65] text-rv-ink">
              {displayText}

              {streaming && (
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse align-middle bg-rv-accent" />
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-3 rounded-sm border border-[rgba(200,75,47,0.2)] bg-[rgba(200,75,47,0.08)] px-3 py-2 text-xs text-rv-accent">
              <p>{error}</p>

              {error.includes("limit reached") && (
                <button
                  onClick={async () => {
                    const res = await fetch("/api/lemonsqueezy/checkout", {
                      method: "POST",
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  className="mt-1.5 inline-block cursor-pointer rounded-sm border-none bg-rv-accent px-3 py-1.5 text-[0.7rem] font-bold text-white"
                >
                  Upgrade to Pro →
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!displayText ? (
              <button
                onClick={handleGenerate}
                disabled={streaming}
                className="flex-1 rounded-sm border-none py-2 text-xs font-semibold text-rv-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-rv-muted cursor-pointer bg-rv-accent"
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
                  className="cursor-pointer rounded-sm border border-rv-border bg-transparent px-3 py-2 text-xs font-medium text-rv-muted disabled:cursor-not-allowed"
                >
                  Retry
                </button>

                <button
                  onClick={handleAccept}
                  disabled={streaming}
                  className="flex-1 rounded-sm border-none py-2 text-xs font-semibold text-rv-white transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-rv-muted cursor-pointer bg-rv-accent"
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
      className="h-3 w-3 shrink-0"
      style={{ fill: color }}
    >
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}
