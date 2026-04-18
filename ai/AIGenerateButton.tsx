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

const iCls =
  "w-full px-3 py-2 border border-rv-border rounded-sm bg-rv-white text-rv-ink text-[0.8125rem] outline-none resize-y focus:border-rv-accent transition-colors";

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
  }, []); // eslint-disable-line

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
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-medium bg-transparent border border-rv-border rounded-sm px-3 py-1.5 cursor-pointer text-rv-muted hover:border-rv-accent hover:text-rv-accent hover:bg-[rgba(200,75,47,0.04)] transition-all duration-150"
      >
        <Sparkle />
        {label}
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="fixed z-[200] w-[320px] bg-rv-white border border-rv-border rounded-sm shadow-[0_12px_40px_rgba(15,14,13,0.18)] p-4"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkle color="var(--rv-accent)" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-rv-accent">
                AI Generate
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="bg-transparent border-0 cursor-pointer text-rv-muted text-base leading-none hover:text-rv-ink transition-colors"
            >
              ×
            </button>
          </div>

          {!displayText && (
            <div className="flex flex-col gap-2.5 mb-3">
              {contextFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-[0.7rem] font-medium text-rv-muted">
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
                      className={iCls}
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
                      className={iCls}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {displayText && (
            <div className="mb-3 text-xs leading-relaxed bg-rv-cream border border-rv-border rounded-sm px-3 py-2.5 text-rv-ink whitespace-pre-wrap max-h-[160px] overflow-y-auto">
              {displayText}
              {streaming && (
                <span className="inline-block w-1.5 h-3 bg-rv-accent ml-0.5 align-middle animate-pulse" />
              )}
            </div>
          )}

          {error && (
            <div className="text-xs mb-3 px-3 py-2 bg-[rgba(200,75,47,0.08)] border border-[rgba(200,75,47,0.2)] rounded-sm text-rv-accent">
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
                  className="inline-block mt-1.5 px-3 py-1 bg-rv-accent text-white border-0 rounded-sm text-[0.7rem] font-bold cursor-pointer"
                >
                  Upgrade to Pro →
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {!displayText ? (
              <button
                onClick={handleGenerate}
                disabled={streaming}
                className={`flex-1 text-xs font-semibold py-2 border-0 rounded-sm text-white transition-colors ${streaming ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
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
                  className="text-xs font-medium py-2 px-3 bg-transparent border border-rv-border rounded-sm cursor-pointer text-rv-muted hover:border-rv-ink hover:text-rv-ink transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={handleAccept}
                  disabled={streaming}
                  className={`flex-1 text-xs font-semibold py-2 border-0 rounded-sm text-white transition-colors ${streaming ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
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

function Sparkle({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={12}
      height={12}
      className="shrink-0"
      style={{ fill: color }}
    >
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}
