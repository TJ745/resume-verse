// "use client";

// import { useState, useEffect, useCallback } from "react";
// import type { ResumeData, ResumeSection } from "@/types/resume";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   resume: ResumeData;
//   sections: ResumeSection[];
// }

// type Tone = "professional" | "friendly" | "confident";

// function buildResumeText(
//   resume: ResumeData,
//   sections: ResumeSection[],
// ): string {
//   const lines: string[] = [];
//   const p = resume.personalInfo;
//   if (p?.fullName) lines.push(p.fullName);
//   if (p?.jobTitle) lines.push(p.jobTitle);
//   if (p?.email) lines.push(p.email);
//   if (p?.phone) lines.push(p.phone);

//   const sorted = [...sections].sort((a, b) => a.order - b.order);
//   for (const s of sorted) {
//     lines.push(`\n${s.title.toUpperCase()}`);
//     const c = s.content;
//     if (
//       s.type === "summary" &&
//       c &&
//       typeof c === "object" &&
//       "text" in (c as object)
//     ) {
//       lines.push((c as { text: string }).text ?? "");
//     } else if (Array.isArray(c)) {
//       for (const item of c as Record<string, unknown>[]) {
//         const parts: string[] = [];
//         if (item.role) parts.push(String(item.role));
//         if (item.company) parts.push(String(item.company));
//         if (item.institution) parts.push(String(item.institution));
//         if (item.degree) parts.push(String(item.degree));
//         if (item.name) parts.push(String(item.name));
//         if (parts.length) lines.push(parts.join(" | "));
//         if (Array.isArray(item.bullets)) {
//           for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
//         }
//         if (item.description) lines.push(String(item.description));
//         if (item.skills && typeof item.skills === "string")
//           lines.push(String(item.skills));
//       }
//     } else if (c && typeof c === "object" && "categories" in (c as object)) {
//       for (const cat of (
//         c as { categories: { name: string; skills: string }[] }
//       ).categories) {
//         lines.push(`${cat.name}: ${cat.skills}`);
//       }
//     }
//   }
//   return lines.filter(Boolean).join("\n");
// }

// const TONES: { id: Tone; label: string; desc: string }[] = [
//   { id: "professional", label: "Professional", desc: "Polished & formal" },
//   { id: "friendly", label: "Friendly", desc: "Warm & approachable" },
//   { id: "confident", label: "Confident", desc: "Bold & assertive" },
// ];

// const inp: React.CSSProperties = {
//   width: "100%",
//   padding: "0.5rem 0.75rem",
//   border: "1px solid var(--rv-border)",
//   borderRadius: 2,
//   background: "var(--rv-white)",
//   color: "var(--rv-ink)",
//   fontSize: "0.78rem",
//   fontFamily: "inherit",
//   outline: "none",
//   boxSizing: "border-box",
// };

// export default function CoverLetterPanel({
//   open,
//   onClose,
//   resume,
//   sections,
// }: Props) {
//   const [jobDescription, setJobDescription] = useState("");
//   const [hiringManager, setHiringManager] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [tone, setTone] = useState<Tone>("professional");
//   const [letter, setLetter] = useState("");
//   const [streaming, setStreaming] = useState(false);
//   const [error, setError] = useState("");
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setLetter("");
//       setError("");
//       setCopied(false);
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   const handleGenerate = useCallback(async () => {
//     setStreaming(true);
//     setLetter("");
//     setError("");
//     try {
//       const resumeText = buildResumeText(resume, sections);
//       const res = await fetch("/api/ai/cover-letter", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resumeText,
//           jobDescription,
//           tone,
//           hiringManager,
//           companyName,
//         }),
//       });
//       if (!res.ok) throw new Error("Generation failed");
//       const reader = res.body!.getReader();
//       const decoder = new TextDecoder();
//       let acc = "";
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         acc += decoder.decode(value, { stream: true });
//         setLetter(acc);
//       }
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setStreaming(false);
//     }
//   }, [resume, sections, jobDescription, tone, hiringManager, companyName]);

//   function handleCopy() {
//     navigator.clipboard.writeText(letter);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   }

//   function handleDownload() {
//     const blob = new Blob([letter], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `cover-letter-${resume.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   if (!open) return null;

//   return (
//     <>
//       <div
//         onClick={onClose}
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 90,
//           background: "rgba(15,14,13,0.35)",
//         }}
//       />

//       <div
//         style={{
//           position: "fixed",
//           top: 56,
//           right: 0,
//           bottom: 0,
//           width: 440,
//           zIndex: 91,
//           background: "var(--rv-paper)",
//           borderLeft: "1px solid var(--rv-border)",
//           display: "flex",
//           flexDirection: "column",
//           boxShadow: "-8px 0 32px rgba(15,14,13,0.1)",
//           fontFamily: "'DM Sans', sans-serif",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "1rem 1.25rem 0.75rem",
//             borderBottom: "1px solid var(--rv-border)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <LetterIcon />
//             <div>
//               <div
//                 style={{
//                   fontSize: "0.8rem",
//                   fontWeight: 700,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Cover Letter
//               </div>
//               <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
//                 AI-generated, tailored to job
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: "var(--rv-muted)",
//               fontSize: "1.1rem",
//               lineHeight: 1,
//               fontFamily: "inherit",
//               padding: 4,
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {/* Body */}
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: "1rem 1.25rem",
//             display: "flex",
//             flexDirection: "column",
//             gap: "0.85rem",
//           }}
//         >
//           {/* Tone selector */}
//           <div>
//             <Label>Tone</Label>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr 1fr",
//                 gap: 6,
//               }}
//             >
//               {TONES.map((t) => (
//                 <button
//                   key={t.id}
//                   onClick={() => setTone(t.id)}
//                   style={{
//                     padding: "0.45rem 0.5rem",
//                     borderRadius: 2,
//                     cursor: "pointer",
//                     border:
//                       tone === t.id
//                         ? "1.5px solid var(--rv-accent)"
//                         : "1px solid var(--rv-border)",
//                     background:
//                       tone === t.id
//                         ? "rgba(200,75,47,0.06)"
//                         : "var(--rv-white)",
//                     fontFamily: "inherit",
//                     textAlign: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "0.72rem",
//                       fontWeight: 600,
//                       color:
//                         tone === t.id ? "var(--rv-accent)" : "var(--rv-ink)",
//                     }}
//                   >
//                     {t.label}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       color: "var(--rv-muted)",
//                       marginTop: 1,
//                     }}
//                   >
//                     {t.desc}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Fields */}
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
//           >
//             <div>
//               <Label>
//                 Hiring Manager <Opt />
//               </Label>
//               <input
//                 value={hiringManager}
//                 onChange={(e) => setHiringManager(e.target.value)}
//                 placeholder="e.g. Sarah Johnson"
//                 style={inp}
//               />
//             </div>
//             <div>
//               <Label>
//                 Company Name <Opt />
//               </Label>
//               <input
//                 value={companyName}
//                 onChange={(e) => setCompanyName(e.target.value)}
//                 placeholder="e.g. Acme Corp"
//                 style={inp}
//               />
//             </div>
//           </div>

//           <div>
//             <Label>
//               Job Description <Opt />{" "}
//               <span
//                 style={{
//                   fontWeight: 400,
//                   textTransform: "none",
//                   letterSpacing: 0,
//                   fontSize: "0.68rem",
//                 }}
//               >
//                 — improves relevance
//               </span>
//             </Label>
//             <textarea
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               rows={4}
//               placeholder="Paste the job description here…"
//               style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
//             />
//           </div>

//           {/* Generate button */}
//           <button
//             onClick={handleGenerate}
//             disabled={streaming}
//             style={{
//               width: "100%",
//               padding: "0.6rem",
//               background: streaming ? "var(--rv-muted)" : "var(--rv-accent)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 2,
//               fontSize: "0.8rem",
//               fontWeight: 600,
//               cursor: streaming ? "not-allowed" : "pointer",
//               fontFamily: "inherit",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 8,
//             }}
//           >
//             {streaming ? (
//               <>
//                 <Spinner /> Generating…
//               </>
//             ) : (
//               <>
//                 <LetterIcon white />
//                 {letter ? "Regenerate" : "Generate Cover Letter"}
//               </>
//             )}
//           </button>

//           {error && (
//             <div
//               style={{
//                 fontSize: "0.75rem",
//                 color: "var(--rv-accent)",
//                 background: "rgba(200,75,47,0.07)",
//                 border: "1px solid rgba(200,75,47,0.2)",
//                 borderRadius: 2,
//                 padding: "0.6rem 0.75rem",
//               }}
//             >
//               {error}
//             </div>
//           )}

//           {/* Letter output */}
//           {letter && (
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 6,
//                 }}
//               >
//                 <Label>Generated Letter</Label>
//                 <div style={{ display: "flex", gap: 6 }}>
//                   <ActionBtn onClick={handleCopy}>
//                     {copied ? "✓ Copied" : "Copy"}
//                   </ActionBtn>
//                   <ActionBtn onClick={handleDownload}>Download .txt</ActionBtn>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   background: "var(--rv-white)",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   padding: "1rem",
//                   fontSize: "0.75rem",
//                   lineHeight: 1.8,
//                   color: "var(--rv-ink)",
//                   whiteSpace: "pre-wrap",
//                   fontFamily: "'DM Sans', sans-serif",
//                   minHeight: 200,
//                 }}
//               >
//                 {letter}
//                 {streaming && (
//                   <span
//                     style={{
//                       display: "inline-block",
//                       width: 6,
//                       height: 12,
//                       background: "var(--rv-accent)",
//                       marginLeft: 2,
//                       verticalAlign: "middle",
//                       animation: "rv-fade-up 0.5s ease infinite alternate",
//                     }}
//                   />
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Empty state */}
//           {!letter && !streaming && !error && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "1.5rem 1rem",
//                 color: "var(--rv-muted)",
//               }}
//             >
//               <div style={{ fontSize: "2rem", marginBottom: 8 }}>✉️</div>
//               <div
//                 style={{
//                   fontSize: "0.78rem",
//                   fontWeight: 600,
//                   marginBottom: 4,
//                   color: "var(--rv-ink)",
//                 }}
//               >
//                 Generate a Cover Letter
//               </div>
//               <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
//                 Fill in the details above. Pasting a job description produces
//                 the most tailored result.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function Label({ children }: { children: React.ReactNode }) {
//   return (
//     <label
//       style={{
//         display: "block",
//         fontSize: "0.68rem",
//         fontWeight: 600,
//         color: "var(--rv-muted)",
//         marginBottom: 5,
//         letterSpacing: "0.04em",
//         textTransform: "uppercase",
//       }}
//     >
//       {children}
//     </label>
//   );
// }
// function Opt() {
//   return (
//     <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
//       (optional)
//     </span>
//   );
// }
// function ActionBtn({
//   onClick,
//   children,
// }: {
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         fontSize: "0.68rem",
//         fontWeight: 600,
//         padding: "3px 10px",
//         border: "1px solid var(--rv-border)",
//         borderRadius: 2,
//         background: "var(--rv-white)",
//         cursor: "pointer",
//         color: "var(--rv-ink)",
//         fontFamily: "inherit",
//       }}
//     >
//       {children}
//     </button>
//   );
// }
// function LetterIcon({ white = false }: { white?: boolean }) {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: white ? "#fff" : "var(--rv-accent)",
//         strokeWidth: 1.5,
//         flexShrink: 0,
//       }}
//     >
//       <rect x="1" y="3" width="14" height="10" rx="1.5" />
//       <path d="M1 4l7 5 7-5" />
//     </svg>
//   );
// }
// function Spinner() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 14,
//         height: 14,
//         fill: "none",
//         stroke: "#fff",
//         strokeWidth: 1.5,
//         animation: "rv-spin 0.7s linear infinite",
//         flexShrink: 0,
//       }}
//     >
//       <circle
//         cx="8"
//         cy="8"
//         r="6"
//         strokeDasharray="28"
//         strokeDashoffset="10"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import type { ResumeData, ResumeSection } from "@/types/resume";

interface Props {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  sections: ResumeSection[];
}

type Tone = "professional" | "friendly" | "confident";

function buildResumeText(
  resume: ResumeData,
  sections: ResumeSection[],
): string {
  const lines: string[] = [];
  const p = resume.personalInfo;
  if (p?.fullName) lines.push(p.fullName);
  if (p?.jobTitle) lines.push(p.jobTitle);
  if (p?.email) lines.push(p.email);
  if (p?.phone) lines.push(p.phone);

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  for (const s of sorted) {
    lines.push(`\n${s.title.toUpperCase()}`);
    const c = s.content;
    if (
      s.type === "summary" &&
      c &&
      typeof c === "object" &&
      "text" in (c as object)
    ) {
      lines.push((c as { text: string }).text ?? "");
    } else if (Array.isArray(c)) {
      for (const item of c as Record<string, unknown>[]) {
        const parts: string[] = [];
        if (item.role) parts.push(String(item.role));
        if (item.company) parts.push(String(item.company));
        if (item.institution) parts.push(String(item.institution));
        if (item.degree) parts.push(String(item.degree));
        if (item.name) parts.push(String(item.name));
        if (parts.length) lines.push(parts.join(" | "));
        if (Array.isArray(item.bullets)) {
          for (const b of item.bullets as string[]) if (b) lines.push(`• ${b}`);
        }
        if (item.description) lines.push(String(item.description));
        if (item.skills && typeof item.skills === "string")
          lines.push(String(item.skills));
      }
    } else if (c && typeof c === "object" && "categories" in (c as object)) {
      for (const cat of (
        c as { categories: { name: string; skills: string }[] }
      ).categories) {
        lines.push(`${cat.name}: ${cat.skills}`);
      }
    }
  }
  return lines.filter(Boolean).join("\n");
}

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: "professional", label: "Professional", desc: "Polished & formal" },
  { id: "friendly", label: "Friendly", desc: "Warm & approachable" },
  { id: "confident", label: "Confident", desc: "Bold & assertive" },
];

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--rv-border)",
  borderRadius: 2,
  background: "var(--rv-white)",
  color: "var(--rv-ink)",
  fontSize: "0.78rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export default function CoverLetterPanel({
  open,
  onClose,
  resume,
  sections,
}: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [letter, setLetter] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setLetter("");
      setError("");
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleGenerate = useCallback(async () => {
    setStreaming(true);
    setLetter("");
    setError("");
    try {
      const resumeText = buildResumeText(resume, sections);
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          tone,
          hiringManager,
          companyName,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setLetter(acc);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setStreaming(false);
    }
  }, [resume, sections, jobDescription, tone, hiringManager, companyName]);

  function handleCopy() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadDocx() {
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType } =
        await import("docx");
      const slug = resume.title.replace(/\s+/g, "-").toLowerCase();

      // Split letter into paragraphs on blank lines
      const paragraphs = letter.split(/\n\n+/).flatMap((block) => {
        const lines = block.split("\n").filter(Boolean);
        const paras = lines.map(
          (line) =>
            new Paragraph({
              children: [
                new TextRun({ text: line, font: "Calibri", size: 24 }),
              ],
              spacing: { after: 0, line: 276 },
            }),
        );
        // Add blank line after each block
        paras.push(
          new Paragraph({ children: [new TextRun("")], spacing: { after: 0 } }),
        );
        return paras;
      });

      const doc = new Document({
        styles: {
          default: { document: { run: { font: "Calibri", size: 24 } } },
        },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const buffer = await Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover-letter-${slug}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
    }
  }

  function handleDownloadPdf() {
    const slug = resume.title.replace(/\s+/g, "-").toLowerCase();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Lato', Arial, sans-serif; font-size: 12pt; line-height: 1.7;
             color: #1a1a1a; padding: 1.2in 1.1in; max-width: 8.5in; }
      p { margin-bottom: 0.9em; white-space: pre-wrap; }
      @media print { body { padding: 0.9in; } @page { margin: 0; size: letter; } }
    </style></head><body>${letter
      .split(/\n\n+/)
      .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
      .join("")}</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.document.title = `cover-letter-${slug}`;
      win.print();
    };
  }

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(15,14,13,0.35)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 56,
          right: 0,
          bottom: 0,
          width: 440,
          zIndex: 91,
          background: "var(--rv-paper)",
          borderLeft: "1px solid var(--rv-border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(15,14,13,0.1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.25rem 0.75rem",
            borderBottom: "1px solid var(--rv-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LetterIcon />
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--rv-ink)",
                }}
              >
                Cover Letter
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--rv-muted)" }}>
                AI-generated, tailored to job
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--rv-muted)",
              fontSize: "1.1rem",
              lineHeight: 1,
              fontFamily: "inherit",
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          {/* Tone selector */}
          <div>
            <Label>Tone</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 6,
              }}
            >
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  style={{
                    padding: "0.45rem 0.5rem",
                    borderRadius: 2,
                    cursor: "pointer",
                    border:
                      tone === t.id
                        ? "1.5px solid var(--rv-accent)"
                        : "1px solid var(--rv-border)",
                    background:
                      tone === t.id
                        ? "rgba(200,75,47,0.06)"
                        : "var(--rv-white)",
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color:
                        tone === t.id ? "var(--rv-accent)" : "var(--rv-ink)",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--rv-muted)",
                      marginTop: 1,
                    }}
                  >
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div>
              <Label>
                Hiring Manager <Opt />
              </Label>
              <input
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                style={inp}
              />
            </div>
            <div>
              <Label>
                Company Name <Opt />
              </Label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp"
                style={inp}
              />
            </div>
          </div>

          <div>
            <Label>
              Job Description <Opt />{" "}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: "0.68rem",
                }}
              >
                — improves relevance
              </span>
            </Label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job description here…"
              style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={streaming}
            style={{
              width: "100%",
              padding: "0.6rem",
              background: streaming ? "var(--rv-muted)" : "var(--rv-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 2,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: streaming ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {streaming ? (
              <>
                <Spinner /> Generating…
              </>
            ) : (
              <>
                <LetterIcon white />
                {letter ? "Regenerate" : "Generate Cover Letter"}
              </>
            )}
          </button>

          {error && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--rv-accent)",
                background: "rgba(200,75,47,0.07)",
                border: "1px solid rgba(200,75,47,0.2)",
                borderRadius: 2,
                padding: "0.6rem 0.75rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Letter output */}
          {letter && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Label>Generated Letter</Label>
                <div style={{ display: "flex", gap: 6 }}>
                  <ActionBtn onClick={handleCopy}>
                    {copied ? "✓ Copied" : "Copy"}
                  </ActionBtn>
                  <ActionBtn onClick={handleDownloadDocx}>↓ .docx</ActionBtn>
                  <ActionBtn onClick={handleDownloadPdf}>↓ PDF</ActionBtn>
                </div>
              </div>
              <div
                style={{
                  background: "var(--rv-white)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  padding: "1rem",
                  fontSize: "0.75rem",
                  lineHeight: 1.8,
                  color: "var(--rv-ink)",
                  whiteSpace: "pre-wrap",
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: 200,
                }}
              >
                {letter}
                {streaming && (
                  <span
                    style={{
                      display: "inline-block",
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
            </div>
          )}

          {/* Empty state */}
          {!letter && !streaming && !error && (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem 1rem",
                color: "var(--rv-muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>✉️</div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "var(--rv-ink)",
                }}
              >
                Generate a Cover Letter
              </div>
              <div style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                Fill in the details above. Pasting a job description produces
                the most tailored result.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.68rem",
        fontWeight: 600,
        color: "var(--rv-muted)",
        marginBottom: 5,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}
function Opt() {
  return (
    <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
      (optional)
    </span>
  );
}
function ActionBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: "0.68rem",
        fontWeight: 600,
        padding: "3px 10px",
        border: "1px solid var(--rv-border)",
        borderRadius: 2,
        background: "var(--rv-white)",
        cursor: "pointer",
        color: "var(--rv-ink)",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}
function LetterIcon({ white = false }: { white?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: white ? "#fff" : "var(--rv-accent)",
        strokeWidth: 1.5,
        flexShrink: 0,
      }}
    >
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 14,
        height: 14,
        fill: "none",
        stroke: "#fff",
        strokeWidth: 1.5,
        animation: "rv-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        strokeDasharray="28"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
