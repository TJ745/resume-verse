// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { uploadAndParseResume } from "@/actions/resume.actions";
// import type { ParsedResumeUpload } from "@/types/resume";
// import { DEFAULT_PERSONAL_INFO } from "@/types/resume";

// type UploadStep = "idle" | "parsing" | "done" | "error";

// export default function UploadResumeButton() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [step, setStep] = useState<UploadStep>("idle");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [progress, setProgress] = useState("");
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const titleInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (open) {
//       setTitle("");
//       setFile(null);
//       setStep("idle");
//       setErrorMsg("");
//       setProgress("");
//       setTimeout(() => titleInputRef.current?.focus(), 50);
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape" && step !== "parsing") setOpen(false);
//     }
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [step]);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     // Accept PDF and common doc formats
//     const ok =
//       [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         "text/plain",
//       ].includes(f.type) ||
//       f.name.endsWith(".pdf") ||
//       f.name.endsWith(".docx") ||
//       f.name.endsWith(".doc") ||
//       f.name.endsWith(".txt");
//     if (!ok) {
//       setErrorMsg(
//         "Please upload a PDF, Word (.docx), or plain text (.txt) file.",
//       );
//       return;
//     }
//     setFile(f);
//     setErrorMsg("");
//     // Auto-fill title from filename if empty
//     if (!title) {
//       const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
//       setTitle(name.charAt(0).toUpperCase() + name.slice(1));
//     }
//   }

//   async function handleUpload() {
//     if (!file) {
//       setErrorMsg("Please select a file.");
//       return;
//     }
//     if (!title.trim()) {
//       setErrorMsg("Please enter a resume name.");
//       titleInputRef.current?.focus();
//       return;
//     }

//     setStep("parsing");
//     setErrorMsg("");
//     setProgress("Reading file…");

//     try {
//       // Read file content
//       const text = await extractText(file, (msg) => setProgress(msg));

//       setProgress("Parsing with AI…");

//       // Call AI to parse
//       const parsed = await parseWithAI(text);

//       setProgress("Creating resume…");

//       // Save to database
//       const resumeId = await uploadAndParseResume(title.trim(), parsed);

//       setStep("done");
//       setOpen(false);
//       router.push(`/builder/${resumeId}`);
//     } catch (err) {
//       setStep("error");
//       setErrorMsg(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again.",
//       );
//     }
//   }

//   const isParsing = step === "parsing";

//   return (
//     <>
//       {/* ── Trigger button ── */}
//       <button
//         onClick={() => setOpen(true)}
//         className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-150"
//         style={{
//           background: "none",
//           border: "1px solid var(--rv-border)",
//           borderRadius: 2,
//           padding: "0.55rem 1.1rem",
//           cursor: "pointer",
//           color: "var(--rv-muted)",
//           fontFamily: "inherit",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.borderColor = "var(--rv-accent)";
//           e.currentTarget.style.color = "var(--rv-accent)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.borderColor = "var(--rv-border)";
//           e.currentTarget.style.color = "var(--rv-muted)";
//         }}
//       >
//         <UploadIcon />
//         Upload resume
//       </button>

//       {/* ── Modal ── */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 100,
//             background: "rgba(15,14,13,0.45)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "1rem",
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget && !isParsing) setOpen(false);
//           }}
//         >
//           <div
//             style={{
//               background: "var(--rv-white)",
//               border: "1px solid var(--rv-border)",
//               borderRadius: 4,
//               padding: "2rem",
//               width: "100%",
//               maxWidth: 480,
//               boxShadow: "0 24px 64px rgba(15,14,13,0.2)",
//             }}
//           >
//             {/* Header */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 marginBottom: "1.5rem",
//               }}
//             >
//               <div>
//                 <h2
//                   style={{
//                     fontSize: "1.1rem",
//                     fontWeight: 600,
//                     color: "var(--rv-ink)",
//                     margin: 0,
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   Upload resume
//                 </h2>
//                 <p
//                   style={{
//                     fontSize: "0.8rem",
//                     color: "var(--rv-muted)",
//                     margin: "0.25rem 0 0",
//                     lineHeight: 1.5,
//                   }}
//                 >
//                   We&apos;ll extract your info and fill the builder
//                   automatically.
//                 </p>
//               </div>
//               {!isParsing && (
//                 <button
//                   onClick={() => setOpen(false)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "var(--rv-muted)",
//                     fontSize: "1.2rem",
//                     lineHeight: 1,
//                     padding: 4,
//                     fontFamily: "inherit",
//                   }}
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             {/* Resume name */}
//             <div style={{ marginBottom: "1.25rem" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "0.72rem",
//                   fontWeight: 600,
//                   color: "var(--rv-muted)",
//                   letterSpacing: "0.06em",
//                   marginBottom: 6,
//                 }}
//               >
//                 RESUME NAME
//               </label>
//               <input
//                 ref={titleInputRef}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="e.g. Software Engineer — Google"
//                 disabled={isParsing}
//                 style={{
//                   width: "100%",
//                   padding: "0.65rem 0.875rem",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   background: isParsing ? "var(--rv-cream)" : "var(--rv-paper)",
//                   color: "var(--rv-ink)",
//                   fontSize: "0.9rem",
//                   outline: "none",
//                   fontFamily: "inherit",
//                   boxSizing: "border-box",
//                 }}
//                 onFocus={(e) =>
//                   (e.currentTarget.style.borderColor = "var(--rv-accent)")
//                 }
//                 onBlur={(e) =>
//                   (e.currentTarget.style.borderColor = "var(--rv-border)")
//                 }
//               />
//             </div>

//             {/* File upload */}
//             <div style={{ marginBottom: "1.5rem" }}>
//               <label
//                 style={{
//                   display: "block",
//                   fontSize: "0.72rem",
//                   fontWeight: 600,
//                   color: "var(--rv-muted)",
//                   letterSpacing: "0.06em",
//                   marginBottom: 6,
//                 }}
//               >
//                 RESUME FILE
//               </label>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".pdf,.doc,.docx,.txt"
//                 onChange={handleFileChange}
//                 disabled={isParsing}
//                 style={{ display: "none" }}
//               />
//               <div
//                 onClick={() => !isParsing && fileInputRef.current?.click()}
//                 style={{
//                   border: `2px dashed ${file ? "var(--rv-accent)" : "var(--rv-border)"}`,
//                   borderRadius: 2,
//                   padding: "1.5rem",
//                   textAlign: "center",
//                   cursor: isParsing ? "not-allowed" : "pointer",
//                   background: file ? "rgba(200,75,47,0.03)" : "var(--rv-paper)",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isParsing && !file) {
//                     (e.currentTarget as HTMLDivElement).style.borderColor =
//                       "var(--rv-accent)";
//                     (e.currentTarget as HTMLDivElement).style.background =
//                       "rgba(200,75,47,0.03)";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!file) {
//                     (e.currentTarget as HTMLDivElement).style.borderColor =
//                       "var(--rv-border)";
//                     (e.currentTarget as HTMLDivElement).style.background =
//                       "var(--rv-paper)";
//                   }
//                 }}
//               >
//                 {file ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 10,
//                     }}
//                   >
//                     <FileIcon />
//                     <div style={{ textAlign: "left" }}>
//                       <p
//                         style={{
//                           fontSize: "0.85rem",
//                           fontWeight: 500,
//                           color: "var(--rv-ink)",
//                           margin: 0,
//                         }}
//                       >
//                         {file.name}
//                       </p>
//                       <p
//                         style={{
//                           fontSize: "0.75rem",
//                           color: "var(--rv-muted)",
//                           margin: "2px 0 0",
//                         }}
//                       >
//                         {(file.size / 1024).toFixed(0)} KB · Click to change
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     <UploadIcon size={24} color="var(--rv-muted)" />
//                     <p
//                       style={{
//                         fontSize: "0.85rem",
//                         color: "var(--rv-ink)",
//                         marginTop: 8,
//                         fontWeight: 500,
//                       }}
//                     >
//                       Click to upload
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "0.75rem",
//                         color: "var(--rv-muted)",
//                         marginTop: 2,
//                       }}
//                     >
//                       PDF, Word (.docx), or plain text (.txt)
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Progress / error */}
//             {isParsing && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "0.75rem 1rem",
//                   background: "var(--rv-cream)",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   marginBottom: "1.25rem",
//                 }}
//               >
//                 <SpinnerIcon />
//                 <span
//                   style={{
//                     fontSize: "0.82rem",
//                     color: "var(--rv-ink)",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {progress}
//                 </span>
//               </div>
//             )}

//             {errorMsg && (
//               <div
//                 style={{
//                   padding: "0.65rem 0.875rem",
//                   background: "rgba(200,75,47,0.08)",
//                   border: "1px solid rgba(200,75,47,0.25)",
//                   borderRadius: 2,
//                   marginBottom: "1.25rem",
//                   fontSize: "0.82rem",
//                   color: "var(--rv-accent)",
//                 }}
//               >
//                 {errorMsg}
//               </div>
//             )}

//             {/* Actions */}
//             <div
//               style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
//             >
//               <button
//                 onClick={() => setOpen(false)}
//                 disabled={isParsing}
//                 style={{
//                   padding: "0.55rem 1.1rem",
//                   background: "none",
//                   border: "1px solid var(--rv-border)",
//                   borderRadius: 2,
//                   cursor: isParsing ? "not-allowed" : "pointer",
//                   color: "var(--rv-muted)",
//                   fontSize: "0.85rem",
//                   fontFamily: "inherit",
//                   fontWeight: 500,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpload}
//                 disabled={isParsing || !file}
//                 style={{
//                   padding: "0.55rem 1.4rem",
//                   background:
//                     isParsing || !file
//                       ? "var(--rv-border)"
//                       : "var(--rv-accent)",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 2,
//                   cursor: isParsing || !file ? "not-allowed" : "pointer",
//                   fontSize: "0.85rem",
//                   fontFamily: "inherit",
//                   fontWeight: 600,
//                   transition: "background 0.15s",
//                   minWidth: 140,
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isParsing && file)
//                     e.currentTarget.style.background = "var(--rv-ink)";
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isParsing && file)
//                     e.currentTarget.style.background = "var(--rv-accent)";
//                 }}
//               >
//                 {isParsing ? "Parsing…" : "Parse & open →"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // ── File text extractor ───────────────────────────────────

// async function extractText(
//   file: File,
//   onProgress: (s: string) => void,
// ): Promise<string> {
//   const ext = file.name.split(".").pop()?.toLowerCase();

//   if (ext === "txt") {
//     onProgress("Reading text file…");
//     return file.text();
//   }

//   if (ext === "pdf") {
//     onProgress("Reading PDF…");
//     try {
//       // Use pdfjs-dist to extract text from PDF pages
//       const pdfjsLib = await import("pdfjs-dist");
//       // Use the CDN worker to avoid bundling issues
//       pdfjsLib.GlobalWorkerOptions.workerSrc =
//         "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       const pages: string[] = [];

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items
//           .map((item) => ("str" in item ? item.str : ""))
//           .join(" ");
//         pages.push(pageText);
//       }

//       return pages.join("\n\n");
//     } catch {
//       throw new Error(
//         "Could not read PDF. Please try a text (.txt) version instead.",
//       );
//     }
//   }

//   if (ext === "docx" || ext === "doc") {
//     onProgress("Reading Word document…");
//     try {
//       const mammoth = await import("mammoth");
//       const arrayBuffer = await file.arrayBuffer();
//       const result = await mammoth.extractRawText({ arrayBuffer });
//       return result.value;
//     } catch {
//       throw new Error(
//         "Could not read Word document. Please try saving as PDF or .txt first.",
//       );
//     }
//   }

//   throw new Error("Unsupported file type.");
// }

// // ── AI parser ─────────────────────────────────────────────

// async function parseWithAI(text: string): Promise<ParsedResumeUpload> {
//   const isPdf = false;

//   const systemPrompt = `You are an expert resume parser. Extract all information from the resume and return ONLY a JSON object with this exact structure. No markdown, no backticks, no explanation — only the raw JSON:

// {
//   "personalInfo": {
//     "fullName": "",
//     "jobTitle": "",
//     "email": "",
//     "phone": "",
//     "address": "",
//     "linkedin": "",
//     "github": "",
//     "website": "",
//     "photoUrl": "",
//     "maritalStatus": "",
//     "showPhoto": false,
//     "showMaritalStatus": false,
//     "showWebsite": false,
//     "showAddress": true
//   },
//   "sections": [
//     {
//       "type": "summary",
//       "title": "Summary",
//       "content": { "text": "" }
//     },
//     {
//       "type": "experience",
//       "title": "Experience",
//       "content": [
//         {
//           "id": "uuid1",
//           "company": "",
//           "role": "",
//           "location": "",
//           "startDate": "",
//           "endDate": "",
//           "current": false,
//           "bullets": ["bullet1", "bullet2"]
//         }
//       ]
//     },
//     {
//       "type": "education",
//       "title": "Education",
//       "content": [
//         {
//           "id": "uuid2",
//           "institution": "",
//           "degree": "",
//           "field": "",
//           "startDate": "",
//           "endDate": "",
//           "gpa": ""
//         }
//       ]
//     },
//     {
//       "type": "skills",
//       "title": "Skills",
//       "content": {
//         "categories": [
//           { "id": "uuid3", "name": "Category Name", "skills": "skill1, skill2" }
//         ]
//       }
//     },
//     {
//       "type": "projects",
//       "title": "Projects",
//       "content": [
//         {
//           "id": "uuid4",
//           "name": "",
//           "description": "",
//           "url": "",
//           "technologies": ""
//         }
//       ]
//     }
//   ]
// }

// Rules:
// - Generate real unique IDs (short random strings) for every id field
// - Only include sections that have actual content
// - Map all work experience, education, skills, projects, certifications, languages exactly
// - For skills: group them by category if possible, otherwise use one category with name ""
// - Keep bullet points concise and as-is from the resume
// - showWebsite: true if website is present, showAddress: true if address is present
// - Return ONLY valid JSON, nothing else`;

//   const userMessage = `Parse this resume text and return the JSON structure:\n\n${text}`;

//   const res = await fetch("/api/ai/parse-resume", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       systemPrompt,
//       userMessage,
//       isPdf,
//     }),
//   });

//   if (!res.ok) {
//     const msg = await res.text();
//     throw new Error(msg || "AI parsing failed. Please try again.");
//   }

//   const raw = await res.text();

//   try {
//     const parsed = JSON.parse(raw) as ParsedResumeUpload;

//     // Merge with defaults so all PersonalInfo fields are present
//     if (parsed.personalInfo) {
//       parsed.personalInfo = {
//         ...DEFAULT_PERSONAL_INFO,
//         ...parsed.personalInfo,
//       };
//       if (parsed.personalInfo.website) parsed.personalInfo.showWebsite = true;
//       if (parsed.personalInfo.address) parsed.personalInfo.showAddress = true;
//     }

//     // Ensure every item has an id
//     parsed.sections = parsed.sections.map((s) => {
//       if (Array.isArray(s.content)) {
//         return {
//           ...s,
//           content: (s.content as Array<Record<string, unknown>>).map(
//             (item) => ({
//               ...item,
//               id: item.id || crypto.randomUUID(),
//             }),
//           ),
//         };
//       }
//       return s;
//     });

//     return parsed;
//   } catch {
//     throw new Error(
//       "Could not parse AI response. Please try again or use a different file format.",
//     );
//   }
// }

// // ── Icons ─────────────────────────────────────────────────

// function UploadIcon({
//   size = 14,
//   color = "currentColor",
// }: {
//   size?: number;
//   color?: string;
// }) {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: size,
//         height: size,
//         stroke: color,
//         fill: "none",
//         strokeWidth: 1.5,
//         display: "inline-block",
//         verticalAlign: "middle",
//       }}
//     >
//       <path d="M8 10V3M5 6l3-3 3 3" />
//       <path d="M3 12h10" />
//     </svg>
//   );
// }

// function FileIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 28,
//         height: 28,
//         stroke: "var(--rv-accent)",
//         fill: "none",
//         strokeWidth: 1.5,
//         flexShrink: 0,
//       }}
//     >
//       <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
//       <path d="M9 2v4h4" />
//     </svg>
//   );
// }

// function SpinnerIcon() {
//   return (
//     <svg
//       viewBox="0 0 16 16"
//       style={{
//         width: 16,
//         height: 16,
//         fill: "none",
//         stroke: "var(--rv-accent)",
//         strokeWidth: 1.5,
//         flexShrink: 0,
//         animation: "spin 0.8s linear infinite",
//       }}
//     >
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       <circle cx="8" cy="8" r="6" strokeOpacity="0.25" />
//       <path d="M8 2a6 6 0 0 1 6 6" />
//     </svg>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadAndParseResume } from "@/actions/resume.actions";
import type { ParsedResumeUpload } from "@/types/resume";
import { DEFAULT_PERSONAL_INFO } from "@/types/resume";

type UploadStep = "idle" | "parsing" | "done" | "error";

export default function UploadResumeButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<UploadStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setFile(null);
      setStep("idle");
      setErrorMsg("");
      setProgress("");
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && step !== "parsing") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    // Accept PDF and common doc formats
    const ok =
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(f.type) ||
      f.name.endsWith(".pdf") ||
      f.name.endsWith(".docx") ||
      f.name.endsWith(".doc") ||
      f.name.endsWith(".txt");
    if (!ok) {
      setErrorMsg(
        "Please upload a PDF, Word (.docx), or plain text (.txt) file.",
      );
      return;
    }
    setFile(f);
    setErrorMsg("");
    // Auto-fill title from filename if empty
    if (!title) {
      const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setTitle(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }

  async function handleUpload() {
    if (!file) {
      setErrorMsg("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Please enter a resume name.");
      titleInputRef.current?.focus();
      return;
    }

    setStep("parsing");
    setErrorMsg("");
    setProgress("Reading file…");

    try {
      // Read file content
      const text = await extractText(file, (msg) => setProgress(msg));

      setProgress("Parsing with AI…");

      // Call AI to parse
      const parsed = await parseWithAI(text);

      setProgress("Creating resume…");

      // Save to database
      const resumeId = await uploadAndParseResume(title.trim(), parsed);

      setStep("done");
      setOpen(false);
      router.push(`/builder/${resumeId}`);
    } catch (err) {
      setStep("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const isParsing = step === "parsing";

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-150"
        style={{
          background: "none",
          border: "1px solid var(--rv-border)",
          borderRadius: 2,
          padding: "0.55rem 1.1rem",
          cursor: "pointer",
          color: "var(--rv-muted)",
          fontFamily: "inherit",
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
        <UploadIcon />
        Upload resume
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(15,14,13,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isParsing) setOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--rv-white)",
              border: "1px solid var(--rv-border)",
              borderRadius: 4,
              padding: "2rem",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 64px rgba(15,14,13,0.2)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--rv-ink)",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Upload resume
                </h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--rv-muted)",
                    margin: "0.25rem 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  We&apos;ll extract your info and fill the builder
                  automatically.
                </p>
              </div>
              {!isParsing && (
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--rv-muted)",
                    fontSize: "1.2rem",
                    lineHeight: 1,
                    padding: 4,
                    fontFamily: "inherit",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Resume name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--rv-muted)",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                RESUME NAME
              </label>
              <input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer — Google"
                disabled={isParsing}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.875rem",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  background: isParsing ? "var(--rv-cream)" : "var(--rv-paper)",
                  color: "var(--rv-ink)",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rv-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rv-border)")
                }
              />
            </div>

            {/* File upload */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--rv-muted)",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                RESUME FILE
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={isParsing}
                style={{ display: "none" }}
              />
              <div
                onClick={() => !isParsing && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${file ? "var(--rv-accent)" : "var(--rv-border)"}`,
                  borderRadius: 2,
                  padding: "1.5rem",
                  textAlign: "center",
                  cursor: isParsing ? "not-allowed" : "pointer",
                  background: file ? "rgba(200,75,47,0.03)" : "var(--rv-paper)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isParsing && !file) {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--rv-accent)";
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(200,75,47,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!file) {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--rv-border)";
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--rv-paper)";
                  }
                }}
              >
                {file ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <FileIcon />
                    <div style={{ textAlign: "left" }}>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "var(--rv-ink)",
                          margin: 0,
                        }}
                      >
                        {file.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--rv-muted)",
                          margin: "2px 0 0",
                        }}
                      >
                        {(file.size / 1024).toFixed(0)} KB · Click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadIcon size={24} color="var(--rv-muted)" />
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--rv-ink)",
                        marginTop: 8,
                        fontWeight: 500,
                      }}
                    >
                      Click to upload
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--rv-muted)",
                        marginTop: 2,
                      }}
                    >
                      PDF, Word (.docx), or plain text (.txt)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress / error */}
            {isParsing && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.75rem 1rem",
                  background: "var(--rv-cream)",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  marginBottom: "1.25rem",
                }}
              >
                <SpinnerIcon />
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--rv-ink)",
                    fontWeight: 500,
                  }}
                >
                  {progress}
                </span>
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  padding: "0.65rem 0.875rem",
                  background: "rgba(200,75,47,0.08)",
                  border: "1px solid rgba(200,75,47,0.25)",
                  borderRadius: 2,
                  marginBottom: "1.25rem",
                  fontSize: "0.82rem",
                  color: "var(--rv-accent)",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setOpen(false)}
                disabled={isParsing}
                style={{
                  padding: "0.55rem 1.1rem",
                  background: "none",
                  border: "1px solid var(--rv-border)",
                  borderRadius: 2,
                  cursor: isParsing ? "not-allowed" : "pointer",
                  color: "var(--rv-muted)",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isParsing || !file}
                style={{
                  padding: "0.55rem 1.4rem",
                  background:
                    isParsing || !file
                      ? "var(--rv-border)"
                      : "var(--rv-accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 2,
                  cursor: isParsing || !file ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  transition: "background 0.15s",
                  minWidth: 140,
                }}
                onMouseEnter={(e) => {
                  if (!isParsing && file)
                    e.currentTarget.style.background = "var(--rv-ink)";
                }}
                onMouseLeave={(e) => {
                  if (!isParsing && file)
                    e.currentTarget.style.background = "var(--rv-accent)";
                }}
              >
                {isParsing ? "Parsing…" : "Parse & open →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── File text extractor ───────────────────────────────────

async function extractText(
  file: File,
  onProgress: (s: string) => void,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt") {
    onProgress("Reading text file…");
    return file.text();
  }

  if (ext === "pdf") {
    onProgress("Reading PDF…");
    try {
      // Use pdfjs-dist to extract text from PDF pages
      const pdfjsLib = await import("pdfjs-dist");
      // Use the CDN worker to avoid bundling issues
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        pages.push(pageText);
      }

      return pages.join("\n\n");
    } catch {
      throw new Error(
        "Could not read PDF. Please try a text (.txt) version instead.",
      );
    }
  }

  if (ext === "docx" || ext === "doc") {
    onProgress("Reading Word document…");
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch {
      throw new Error(
        "Could not read Word document. Please try saving as PDF or .txt first.",
      );
    }
  }

  throw new Error("Unsupported file type.");
}

// ── AI parser ─────────────────────────────────────────────

async function parseWithAI(text: string): Promise<ParsedResumeUpload> {
  const isPdf = false;

  const systemPrompt = `You are an expert resume parser. Extract all information from the resume and return ONLY a JSON object with this exact structure. No markdown, no backticks, no explanation — only the raw JSON:

{
  "personalInfo": {
    "fullName": "",
    "jobTitle": "",
    "email": "",
    "phone": "",
    "address": "",
    "linkedin": "",
    "github": "",
    "website": "",
    "photoUrl": "",
        "showPhoto": false,
        "showWebsite": false,
    "showAddress": true
  },
  "sections": [
    {
      "type": "summary",
      "title": "Summary",
      "content": { "text": "" }
    },
    {
      "type": "experience",
      "title": "Experience",
      "content": [
        {
          "id": "uuid1",
          "company": "",
          "role": "",
          "location": "",
          "startDate": "",
          "endDate": "",
          "current": false,
          "bullets": ["bullet1", "bullet2"]
        }
      ]
    },
    {
      "type": "education",
      "title": "Education",
      "content": [
        {
          "id": "uuid2",
          "institution": "",
          "degree": "",
          "field": "",
          "startDate": "",
          "endDate": "",
          "gpa": ""
        }
      ]
    },
    {
      "type": "skills",
      "title": "Skills",
      "content": {
        "categories": [
          { "id": "uuid3", "name": "Category Name", "skills": "skill1, skill2" }
        ]
      }
    },
    {
      "type": "projects",
      "title": "Projects",
      "content": [
        {
          "id": "uuid4",
          "name": "",
          "description": "",
          "url": "",
          "technologies": ""
        }
      ]
    }
  ]
}

Rules:
- Generate real unique IDs (short random strings) for every id field
- Only include sections that have actual content
- Map all work experience, education, skills, projects, certifications, languages exactly
- For skills: group them by category if possible, otherwise use one category with name ""
- Keep bullet points concise and as-is from the resume
- showWebsite: true if website is present, showAddress: true if address is present
- Return ONLY valid JSON, nothing else`;

  const userMessage = `Parse this resume text and return the JSON structure:\n\n${text}`;

  const res = await fetch("/api/ai/parse-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt,
      userMessage,
      isPdf,
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "AI parsing failed. Please try again.");
  }

  const raw = await res.text();

  try {
    const parsed = JSON.parse(raw) as ParsedResumeUpload;

    // Merge with defaults so all PersonalInfo fields are present
    if (parsed.personalInfo) {
      parsed.personalInfo = {
        ...DEFAULT_PERSONAL_INFO,
        ...parsed.personalInfo,
      };
      if (parsed.personalInfo.website) parsed.personalInfo.showWebsite = true;
      if (parsed.personalInfo.address) parsed.personalInfo.showAddress = true;
    }

    // Ensure every item has an id
    parsed.sections = parsed.sections.map((s) => {
      if (Array.isArray(s.content)) {
        return {
          ...s,
          content: (s.content as Array<Record<string, unknown>>).map(
            (item) => ({
              ...item,
              id: item.id || crypto.randomUUID(),
            }),
          ),
        };
      }
      return s;
    });

    return parsed;
  } catch {
    throw new Error(
      "Could not parse AI response. Please try again or use a different file format.",
    );
  }
}

// ── Icons ─────────────────────────────────────────────────

function UploadIcon({
  size = 14,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: size,
        height: size,
        stroke: color,
        fill: "none",
        strokeWidth: 1.5,
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      <path d="M8 10V3M5 6l3-3 3 3" />
      <path d="M3 12h10" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 28,
        height: 28,
        stroke: "var(--rv-accent)",
        fill: "none",
        strokeWidth: 1.5,
        flexShrink: 0,
      }}
    >
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <path d="M9 2v4h4" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{
        width: 16,
        height: 16,
        fill: "none",
        stroke: "var(--rv-accent)",
        strokeWidth: 1.5,
        flexShrink: 0,
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
}
