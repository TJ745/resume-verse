// "use client";

// import { useState, useTransition } from "react";
// import { togglePublic } from "@/actions/resume.actions";

// interface Props {
//   resumeId: string;
//   isPublic: boolean;
// }

// export default function ShareButton({
//   resumeId,
//   isPublic: initialPublic,
// }: Props) {
//   const [isPublic, setIsPublic] = useState(initialPublic);
//   const [open, setOpen] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${resumeId}`;

//   function handleToggle() {
//     const next = !isPublic;
//     setIsPublic(next);
//     startTransition(() => togglePublic(resumeId, next));
//   }

//   function handleCopy() {
//     navigator.clipboard.writeText(shareUrl).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   }

//   return (
//     <div style={{ position: "relative" }}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
//         style={{
//           background: isPublic ? "rgba(45,90,61,0.07)" : "none",
//           border: `1px solid ${isPublic ? "rgba(45,90,61,0.3)" : "var(--rv-border)"}`,
//           borderRadius: 2,
//           padding: "0.4rem 0.75rem",
//           cursor: "pointer",
//           color: isPublic ? "#2d5a3d" : "var(--rv-muted)",
//           fontFamily: "inherit",
//         }}
//       >
//         <svg
//           viewBox="0 0 16 16"
//           style={{
//             width: 12,
//             height: 12,
//             fill: "none",
//             stroke: "currentColor",
//             strokeWidth: 1.8,
//           }}
//         >
//           <circle cx="12" cy="4" r="1.5" />
//           <circle cx="4" cy="8" r="1.5" />
//           <circle cx="12" cy="12" r="1.5" />
//           <line x1="5.5" y1="7.2" x2="10.5" y2="4.8" />
//           <line x1="5.5" y1="8.8" x2="10.5" y2="11.2" />
//         </svg>
//         Share
//       </button>

//       {open && (
//         <>
//           {/* Backdrop */}
//           <div
//             style={{ position: "fixed", inset: 0, zIndex: 40 }}
//             onClick={() => setOpen(false)}
//           />

//           {/* Dropdown */}
//           <div
//             style={{
//               position: "absolute",
//               top: "calc(100% + 6px)",
//               right: 0,
//               zIndex: 50,
//               background: "var(--rv-white)",
//               border: "1px solid var(--rv-border)",
//               borderRadius: 4,
//               boxShadow: "0 8px 24px rgba(15,14,13,0.12)",
//               padding: "1rem",
//               width: 280,
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "0.72rem",
//                 fontWeight: 700,
//                 color: "var(--rv-ink)",
//                 marginBottom: "0.5rem",
//                 letterSpacing: "0.04em",
//                 textTransform: "uppercase",
//               }}
//             >
//               Share Resume
//             </p>
//             <p
//               style={{
//                 fontSize: "0.75rem",
//                 color: "var(--rv-muted)",
//                 lineHeight: 1.55,
//                 marginBottom: "0.85rem",
//               }}
//             >
//               {isPublic
//                 ? "Anyone with the link can view your resume."
//                 : "Enable public link to share your resume with anyone."}
//             </p>

//             {/* Toggle */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "0.85rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Public link
//               </span>
//               <button
//                 onClick={handleToggle}
//                 disabled={isPending}
//                 style={{
//                   width: 40,
//                   height: 22,
//                   borderRadius: 99,
//                   background: isPublic ? "#2d5a3d" : "var(--rv-border)",
//                   border: "none",
//                   cursor: "pointer",
//                   position: "relative",
//                   transition: "background 0.2s",
//                   flexShrink: 0,
//                 }}
//               >
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: 3,
//                     left: isPublic ? 21 : 3,
//                     width: 16,
//                     height: 16,
//                     borderRadius: "50%",
//                     background: "#fff",
//                     transition: "left 0.2s",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
//                   }}
//                 />
//               </button>
//             </div>

//             {/* Copy link */}
//             {isPublic && (
//               <div style={{ display: "flex", gap: 6 }}>
//                 <input
//                   readOnly
//                   value={shareUrl}
//                   style={{
//                     flex: 1,
//                     fontSize: "0.68rem",
//                     padding: "0.4rem 0.5rem",
//                     border: "1px solid var(--rv-border)",
//                     borderRadius: 2,
//                     background: "var(--rv-cream)",
//                     color: "var(--rv-muted)",
//                     fontFamily: "inherit",
//                     outline: "none",
//                   }}
//                   onClick={(e) => (e.target as HTMLInputElement).select()}
//                 />
//                 <button
//                   onClick={handleCopy}
//                   style={{
//                     padding: "0.4rem 0.65rem",
//                     fontSize: "0.68rem",
//                     fontWeight: 700,
//                     background: copied ? "#2d5a3d" : "var(--rv-ink)",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 2,
//                     cursor: "pointer",
//                     fontFamily: "inherit",
//                     flexShrink: 0,
//                     transition: "background 0.2s",
//                   }}
//                 >
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { togglePublic } from "@/actions/resume.actions";

interface Props {
  resumeId: string;
  isPublic: boolean;
}

export default function ShareButton({
  resumeId,
  isPublic: initialPublic,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${resumeId}`;

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(() => togglePublic(resumeId, next));
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
        style={{
          background: isPublic ? "rgba(45,90,61,0.07)" : "none",
          border: `1px solid ${isPublic ? "rgba(45,90,61,0.3)" : "var(--rv-border)"}`,
          borderRadius: 2,
          padding: "0.4rem 0.75rem",
          cursor: "pointer",
          color: isPublic ? "#2d5a3d" : "var(--rv-muted)",
          fontFamily: "inherit",
        }}
      >
        <svg
          viewBox="0 0 16 16"
          style={{
            width: 12,
            height: 12,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.8,
          }}
        >
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <line x1="5.5" y1="7.2" x2="10.5" y2="4.8" />
          <line x1="5.5" y1="8.8" x2="10.5" y2="11.2" />
        </svg>
        Share
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 50,
              background: "var(--rv-white)",
              border: "1px solid var(--rv-border)",
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(15,14,13,0.12)",
              padding: "1rem",
              width: 280,
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--rv-ink)",
                marginBottom: "0.5rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Share Resume
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--rv-muted)",
                lineHeight: 1.55,
                marginBottom: "0.85rem",
              }}
            >
              {isPublic
                ? "Anyone with the link can view your resume."
                : "Enable public link to share your resume with anyone."}
            </p>

            {/* Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.85rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--rv-ink)",
                }}
              >
                Public link
              </span>
              <button
                onClick={handleToggle}
                disabled={isPending}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 99,
                  background: isPublic ? "#2d5a3d" : "var(--rv-border)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: isPublic ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>

            {/* Copy link */}
            {isPublic && (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  readOnly
                  value={shareUrl}
                  style={{
                    flex: 1,
                    fontSize: "0.68rem",
                    padding: "0.4rem 0.5rem",
                    border: "1px solid var(--rv-border)",
                    borderRadius: 2,
                    background: "var(--rv-cream)",
                    color: "var(--rv-muted)",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: "0.4rem 0.65rem",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    background: copied ? "#2d5a3d" : "var(--rv-ink)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
