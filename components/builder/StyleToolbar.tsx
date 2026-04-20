// "use client";

// // Floating mini-toolbar that appears when user clicks a resume element.
// // Shows font family + size pickers for just that element.

// import { useEffect, useRef } from "react";
// import { RESUME_FONTS, FONT_SIZES } from "@/lib/resume-constants";
// import { useStyleCtx } from "./StyleContext";
// import type { ElementKey, ElementStyle } from "./StyleContext";

// const ELEMENT_LABELS: Record<ElementKey, string> = {
//   name: "Name",
//   jobTitle: "Job Title",
//   sectionHeading: "Section Heading",
//   body: "Body Text",
// };

// export default function StyleToolbar() {
//   const ctx = useStyleCtx();
//   const ref = useRef<HTMLDivElement>(null);

//   // Close on outside click
//   useEffect(() => {
//     if (!ctx?.selected) return;
//     function handler(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         ctx!.clearSelected();
//       }
//     }
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [ctx?.selected]);

//   if (!ctx?.selected || !ctx.toolbarRect) return null;

//   const key = ctx.selected;
//   const label = ELEMENT_LABELS[key];
//   const ov = ctx.overrides[key] ?? {};
//   const rect = ctx.toolbarRect;

//   function set(patch: Partial<ElementStyle>) {
//     ctx!.setOverride(key, patch);
//   }

//   // Position: above the element, centred
//   const toolbarWidth = 340;
//   const left = Math.max(
//     8,
//     Math.min(
//       rect.left + rect.width / 2 - toolbarWidth / 2,
//       window.innerWidth - toolbarWidth - 8,
//     ),
//   );
//   const top = rect.top - 8; // will use transform to go above

//   return (
//     <div
//       ref={ref}
//       style={{
//         position: "fixed",
//         top: top,
//         left: left,
//         width: toolbarWidth,
//         zIndex: 9999,
//         transform: "translateY(-100%)",
//       }}
//     >
//       <div
//         style={{
//           background: "#1a1917",
//           border: "1px solid rgba(255,255,255,0.12)",
//           borderRadius: 6,
//           padding: "8px 10px",
//           boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
//           display: "flex",
//           flexDirection: "column",
//           gap: 6,
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "0.6rem",
//               fontWeight: 700,
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "rgba(255,255,255,0.4)",
//             }}
//           >
//             {label}
//           </span>
//           <button
//             onClick={ctx.clearSelected}
//             style={{
//               background: "none",
//               border: "none",
//               color: "rgba(255,255,255,0.4)",
//               cursor: "pointer",
//               fontSize: "0.9rem",
//               lineHeight: 1,
//               padding: 0,
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Font family */}
//         <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
//           {RESUME_FONTS.map((f) => (
//             <button
//               key={f.id}
//               onClick={() => set({ font: f.id })}
//               style={{
//                 background:
//                   ov.font === f.id ? "#c84b2f" : "rgba(255,255,255,0.07)",
//                 border:
//                   ov.font === f.id
//                     ? "1px solid #c84b2f"
//                     : "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 3,
//                 padding: "3px 8px",
//                 cursor: "pointer",
//                 color: ov.font === f.id ? "#fff" : "rgba(255,255,255,0.7)",
//                 fontSize: "0.65rem",
//                 fontFamily: f.stack,
//                 whiteSpace: "nowrap",
//                 transition: "all 0.1s",
//               }}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>

//         {/* Font size + bold/italic */}
//         <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//           {/* Size buttons */}
//           <div style={{ display: "flex", gap: 2, flex: 1 }}>
//             {FONT_SIZES.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => set({ fontSize: s.id })}
//                 style={{
//                   flex: 1,
//                   background:
//                     ov.fontSize === s.id ? "#c84b2f" : "rgba(255,255,255,0.07)",
//                   border:
//                     ov.fontSize === s.id
//                       ? "1px solid #c84b2f"
//                       : "1px solid rgba(255,255,255,0.1)",
//                   borderRadius: 3,
//                   padding: "3px 0",
//                   cursor: "pointer",
//                   color:
//                     ov.fontSize === s.id ? "#fff" : "rgba(255,255,255,0.6)",
//                   fontSize: "0.6rem",
//                   fontWeight: 600,
//                   transition: "all 0.1s",
//                 }}
//               >
//                 {s.label}
//               </button>
//             ))}
//           </div>

//           {/* Divider */}
//           <div
//             style={{
//               width: 1,
//               height: 20,
//               background: "rgba(255,255,255,0.1)",
//             }}
//           />

//           {/* Bold */}
//           <button
//             onClick={() => set({ bold: !ov.bold })}
//             style={{
//               background: ov.bold
//                 ? "rgba(200,75,47,0.3)"
//                 : "rgba(255,255,255,0.07)",
//               border: ov.bold
//                 ? "1px solid #c84b2f"
//                 : "1px solid rgba(255,255,255,0.1)",
//               borderRadius: 3,
//               padding: "3px 8px",
//               cursor: "pointer",
//               color: ov.bold ? "#c84b2f" : "rgba(255,255,255,0.6)",
//               fontSize: "0.7rem",
//               fontWeight: 800,
//               transition: "all 0.1s",
//             }}
//           >
//             B
//           </button>

//           {/* Italic */}
//           <button
//             onClick={() => set({ italic: !ov.italic })}
//             style={{
//               background: ov.italic
//                 ? "rgba(200,75,47,0.3)"
//                 : "rgba(255,255,255,0.07)",
//               border: ov.italic
//                 ? "1px solid #c84b2f"
//                 : "1px solid rgba(255,255,255,0.1)",
//               borderRadius: 3,
//               padding: "3px 8px",
//               cursor: "pointer",
//               color: ov.italic ? "#c84b2f" : "rgba(255,255,255,0.6)",
//               fontSize: "0.7rem",
//               fontStyle: "italic",
//               fontWeight: 600,
//               transition: "all 0.1s",
//             }}
//           >
//             I
//           </button>

//           {/* Reset */}
//           {(ov.font || ov.fontSize || ov.bold || ov.italic) && (
//             <button
//               onClick={() => ctx.setOverride(key, {})}
//               style={{
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 3,
//                 padding: "3px 7px",
//                 cursor: "pointer",
//                 color: "rgba(255,255,255,0.35)",
//                 fontSize: "0.55rem",
//                 transition: "all 0.1s",
//               }}
//               title="Reset to default"
//             >
//               Reset
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Arrow */}
//       <div
//         style={{
//           width: 0,
//           height: 0,
//           margin: "0 auto",
//           borderLeft: "6px solid transparent",
//           borderRight: "6px solid transparent",
//           borderTop: "6px solid rgba(255,255,255,0.12)",
//         }}
//       />
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import { ELEMENT_FONTS, ELEMENT_FONT_SIZES } from "@/lib/resume-constants";
import { useStyleCtx } from "./StyleContext";
import type { ElementStyle } from "./StyleContext";

// ── Label mapping ─────────────────────────────────────────
function labelFromId(id: string): string {
  if (id === "name")    return "Name";
  if (id === "jobTitle") return "Job Title";
  if (id.startsWith("h:")) return "Section Heading";
  if (id.startsWith("b:")) return "Body Text";
  return "Element";
}

export default function StyleToolbar() {
  const ctx = useStyleCtx();
  const ref = useRef<HTMLDivElement>(null);

  const [fontDropOpen, setFontDropOpen] = useState(false);
  const [sizeDropOpen, setSizeDropOpen] = useState(false);
  const [sizeInput,    setSizeInput]    = useState("");
  const fontDropRef = useRef<HTMLDivElement>(null);
  const sizeDropRef = useRef<HTMLDivElement>(null);

  // Sync size input when selection changes
  useEffect(() => {
    if (ctx?.selectedId) {
      const ov = ctx.overrides[ctx.selectedId] ?? {};
      setSizeInput(ov.fontSize ?? "");
      setFontDropOpen(false);
      setSizeDropOpen(false);
    }
  }, [ctx?.selectedId]);

  // Close toolbar on outside click
  useEffect(() => {
    if (!ctx?.selectedId) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx!.clearSelected();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctx?.selectedId]);

  if (!ctx?.selectedId || !ctx.toolbarRect) return null;

  const id    = ctx.selectedId;
  const label = labelFromId(id);
  const ov    = ctx.overrides[id] ?? {};
  const rect  = ctx.toolbarRect;

  const activeFont = ELEMENT_FONTS.find((f) => f.id === ov.font) ?? null;

  function set(patch: Partial<ElementStyle>) {
    ctx!.setOverride(id, patch);
  }

  function handleSizeCommit(val: string) {
    const pt = parseFloat(val);
    if (!isNaN(pt) && pt > 0 && pt <= 200) {
      set({ fontSize: String(pt) });
      setSizeInput(String(pt));
    }
    setSizeDropOpen(false);
  }

  // Position toolbar above the clicked element
  const W = 420;
  const left = Math.max(8, Math.min(
    rect.left + rect.width / 2 - W / 2,
    (typeof window !== "undefined" ? window.innerWidth : 800) - W - 8,
  ));

  return (
    <div
      ref={ref}
      style={{
        position:  "fixed",
        top:       rect.top - 10,
        left:      left,
        width:     W,
        zIndex:    9999,
        transform: "translateY(-100%)",
        filter:    "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
      }}
    >
      {/* ── Main bar ─────────────────────────────────────── */}
      <div style={{
        background:    "#1e1c1a",
        border:        "1px solid rgba(255,255,255,0.1)",
        borderRadius:  "6px",
        padding:       "5px 8px",
        display:       "flex",
        alignItems:    "center",
        gap:           4,
      }}>

        {/* Element label badge */}
        <span style={{
          fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#c84b2f",
          background: "rgba(200,75,47,0.1)", border: "1px solid rgba(200,75,47,0.2)",
          borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {label}
        </span>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

        {/* ── Font family picker ── */}
        <div ref={fontDropRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setFontDropOpen((o) => !o); setSizeDropOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: "3px 8px 3px 10px",
              cursor: "pointer",
              color: "#fff",
              fontSize: "0.72rem",
              fontFamily: activeFont?.stack ?? "inherit",
              display: "flex", alignItems: "center", gap: 5,
              minWidth: 130, maxWidth: 150,
              whiteSpace: "nowrap", overflow: "hidden",
            }}
          >
            <span style={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
              {activeFont?.label ?? "Default"}
            </span>
            <svg viewBox="0 0 10 6" width={8} height={8} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}>
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>

          {fontDropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0,
              background: "#1e1c1a", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 5, padding: "4px 0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              zIndex: 10000, width: 200, maxHeight: 280, overflowY: "auto",
            }}>
              {(["sans", "serif", "mono"] as const).map((cat) => {
                const fonts = ELEMENT_FONTS.filter((f) => f.category === cat);
                if (!fonts.length) return null;
                return (
                  <div key={cat}>
                    <div style={{
                      padding: "4px 10px 2px", fontSize: "0.55rem", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                    }}>
                      {cat === "sans" ? "Sans-serif" : cat === "serif" ? "Serif" : "Monospace"}
                    </div>
                    {fonts.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { set({ font: f.id }); setFontDropOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "5px 10px", background: "transparent",
                          border: "none", cursor: "pointer",
                          color: ov.font === f.id ? "#c84b2f" : "rgba(255,255,255,0.8)",
                          fontSize: "0.72rem", fontFamily: f.stack,
                          textAlign: "left",
                          backgroundColor: ov.font === f.id ? "rgba(200,75,47,0.08)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (ov.font !== f.id)
                            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          if (ov.font !== f.id)
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <span>{f.label}</span>
                        {ov.font === f.id && <span style={{ fontSize: "0.6rem" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                );
              })}
              {ov.font && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0" }}>
                  <button
                    onClick={() => { set({ font: undefined }); setFontDropOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "5px 10px",
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", textAlign: "left",
                    }}
                  >
                    ↩ Reset font
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Font size picker ── */}
        <div ref={sizeDropRef} style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSizeCommit(sizeInput);
                if (e.key === "Escape") { setSizeInput(ov.fontSize ?? ""); setSizeDropOpen(false); }
              }}
              onFocus={() => setSizeDropOpen(true)}
              placeholder="pt"
              style={{
                width: 42, padding: "3px 5px", textAlign: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRight: "none",
                borderRadius: "4px 0 0 4px",
                color: "#fff", fontSize: "0.72rem", outline: "none",
              }}
            />
            <button
              onClick={() => setSizeDropOpen((o) => !o)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0 4px 4px 0",
                padding: "3px 5px", cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center",
              }}
            >
              <svg viewBox="0 0 10 6" width={7} height={7} fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
          </div>

          {sizeDropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0,
              background: "#1e1c1a", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 5, padding: "4px 0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              zIndex: 10000, width: 90, maxHeight: 260, overflowY: "auto",
            }}>
              {ELEMENT_FONT_SIZES.map((s) => (
                <button
                  key={s.pt}
                  onClick={() => handleSizeCommit(String(s.pt))}
                  style={{
                    display: "block", width: "100%", padding: "4px 12px",
                    background: ov.fontSize === String(s.pt) ? "rgba(200,75,47,0.12)" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    color: ov.fontSize === String(s.pt) ? "#c84b2f" : "rgba(255,255,255,0.75)",
                    fontSize: "0.72rem", fontWeight: ov.fontSize === String(s.pt) ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (ov.fontSize !== String(s.pt))
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (ov.fontSize !== String(s.pt))
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {s.label}
                </button>
              ))}
              {ov.fontSize && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 0" }}>
                  <button
                    onClick={() => { set({ fontSize: undefined }); setSizeInput(""); setSizeDropOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "4px 12px",
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", textAlign: "left",
                    }}
                  >
                    ↩ Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

        {/* ── B / I / U ── */}
        {[
          { key: "bold",      label: "B", active: !!ov.bold,      style: { fontWeight: 800 as const } },
          { key: "italic",    label: "I", active: !!ov.italic,    style: { fontStyle: "italic" as const } },
          { key: "underline", label: "U", active: !!ov.underline, style: { textDecoration: "underline" as const } },
        ].map(({ key, label: btnLabel, active, style: btnStyle }) => (
          <button
            key={key}
            onClick={() => set({ [key]: !ov[key as keyof ElementStyle] })}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            style={{
              width: 26, height: 26,
              background: active ? "rgba(200,75,47,0.2)" : "transparent",
              border:     active ? "1px solid rgba(200,75,47,0.4)" : "1px solid transparent",
              borderRadius: 4,
              cursor: "pointer",
              color:  active ? "#c84b2f" : "rgba(255,255,255,0.6)",
              fontSize: "0.75rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              ...btnStyle,
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {btnLabel}
          </button>
        ))}

        {/* ── Reset all ── */}
        {(ov.font || ov.fontSize || ov.bold || ov.italic || ov.underline) && (
          <>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
            <button
              onClick={() => { ctx.setOverride(id, {}); setSizeInput(""); }}
              title="Reset all styling"
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4, padding: "3px 8px", cursor: "pointer",
                color: "rgba(255,255,255,0.35)", fontSize: "0.6rem",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              Reset
            </button>
          </>
        )}

        {/* ── Close ── */}
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={ctx.clearSelected}
            style={{
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.3)", cursor: "pointer",
              fontSize: "0.85rem", lineHeight: 1, padding: "2px 4px",
              display: "flex", alignItems: "center",
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Caret arrow ── */}
      <div style={{
        width: 0, height: 0, margin: "0 auto",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "5px solid rgba(255,255,255,0.1)",
      }} />
    </div>
  );
}