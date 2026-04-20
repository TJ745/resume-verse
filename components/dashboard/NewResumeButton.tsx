
// "use client";

// import { useState, useTransition, useEffect, useRef } from "react";
// import { createResume } from "@/actions/resume.actions";

// export default function NewResumeButton() {
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (open) {
//       setTitle("");
//       setTimeout(() => inputRef.current?.focus(), 50);
//     }
//   }, [open]);

//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape" && !isPending) {
//         setOpen(false);
//         setShowUpgrade(false);
//       }
//     }
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [isPending]);

//   async function handleCreate() {
//     startTransition(async () => {
//       const result = await createResume(title.trim() || "Untitled Resume");
//       if (result?.error) {
//         setOpen(false);
//         setShowUpgrade(true);
//       }
//     });
//   }

//   async function handleUpgrade() {
//     const res = await fetch("/api/stripe/checkout", { method: "POST" });
//     const data = await res.json();
//     if (data.url) window.location.href = data.url;
//   }

//   return (
//     <>
//       {/* ── Card trigger ── */}
//       <button
//         onClick={() => setOpen(true)}
//         className="flex flex-col items-center justify-center gap-3 w-full min-h-[240px] p-8 bg-transparent border-2 border-dashed border-rv-border cursor-pointer transition-colors duration-200 hover:border-rv-accent hover:bg-[rgba(200,75,47,0.03)]"
//       >
//         <div className="w-10 h-10 rounded-full bg-rv-accent text-white flex items-center justify-center text-xl leading-none">
//           +
//         </div>
//         <span className="text-sm font-medium text-rv-ink">New resume</span>
//       </button>

//       {/* ── Create modal ── */}
//       {open && (
//         <div
//           className="fixed inset-0 z-[100] bg-[rgba(15,14,13,0.45)] flex items-center justify-center p-4"
//           onClick={(e) => {
//             if (e.target === e.currentTarget && !isPending) setOpen(false);
//           }}
//         >
//           <div className="bg-rv-white border border-rv-border rounded-[4px] p-8 w-full max-w-[440px] shadow-[0_24px_64px_rgba(15,14,13,0.2)]">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-[1.1rem] font-semibold text-rv-ink tracking-[-0.02em]">
//                   New resume
//                 </h2>
//                 <p className="text-[0.8rem] text-rv-muted mt-1">
//                   Give your resume a name to get started.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 disabled={isPending}
//                 className="bg-transparent border-0 cursor-pointer text-rv-muted text-xl leading-none p-1 hover:text-rv-ink transition-colors disabled:opacity-50"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="mb-6">
//               <label className="block text-[0.72rem] font-semibold text-rv-muted tracking-[0.06em] uppercase mb-1.5">
//                 Resume Name
//               </label>
//               <input
//                 ref={inputRef}
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !isPending) handleCreate();
//                 }}
//                 placeholder="e.g. Software Engineer — Google"
//                 disabled={isPending}
//                 className="w-full px-3.5 py-2.5 border border-rv-border rounded-sm bg-rv-paper text-rv-ink text-[0.9rem] outline-none focus:border-rv-accent transition-colors disabled:opacity-60"
//               />
//             </div>

//             <div className="flex gap-2.5 justify-end">
//               <button
//                 onClick={() => setOpen(false)}
//                 disabled={isPending}
//                 className="px-4 py-2 bg-transparent border border-rv-border rounded-sm cursor-pointer text-rv-muted text-[0.85rem] font-medium hover:border-rv-ink hover:text-rv-ink transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreate}
//                 disabled={isPending}
//                 className={`px-5 py-2 border-0 rounded-sm text-white text-[0.85rem] font-semibold min-w-[130px] transition-colors ${isPending ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}
//               >
//                 {isPending ? "Creating…" : "Create resume →"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Upgrade modal ── */}
//       {showUpgrade && (
//         <>
//           <div
//             className="fixed inset-0 bg-[rgba(15,14,13,0.5)] z-[100]"
//             onClick={() => setShowUpgrade(false)}
//           />
//           <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-rv-white rounded-[4px] p-8 max-w-[380px] w-[90%] shadow-[0_20px_60px_rgba(15,14,13,0.2)] text-center">
//             <div className="w-11 h-11 rounded-full bg-[rgba(200,75,47,0.08)] flex items-center justify-center mx-auto mb-4">
//               <svg
//                 viewBox="0 0 24 24"
//                 className="w-[22px] h-[22px] stroke-rv-accent fill-none"
//                 strokeWidth={1.5}
//               >
//                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//               </svg>
//             </div>
//             <h3 className="font-serif text-[1.25rem] text-rv-ink mb-2">
//               Resume limit reached
//             </h3>
//             <p className="text-[0.82rem] text-rv-muted leading-relaxed mb-6">
//               The Free plan includes 1 resume. Upgrade to Pro for unlimited
//               resumes, all 10 templates, DOCX export, and unlimited AI tools.
//             </p>
//             <div className="flex gap-2 justify-center">
//               <button
//                 onClick={handleUpgrade}
//                 className="px-5 py-2 bg-rv-accent text-white border-0 rounded-sm text-[0.82rem] font-bold cursor-pointer hover:bg-rv-ink transition-colors"
//               >
//                 Upgrade to Pro →
//               </button>
//               <button
//                 onClick={() => setShowUpgrade(false)}
//                 className="px-4 py-2 bg-transparent text-rv-muted border border-rv-border rounded-sm text-[0.82rem] cursor-pointer hover:border-rv-ink hover:text-rv-ink transition-colors"
//               >
//                 Maybe later
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }


"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { createResume } from "@/actions/resume.actions";

export default function NewResumeButton({ isPro = false }: { isPro?: boolean }) {
  const [open,        setOpen]        = useState(false);
  const [title,       setTitle]       = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPending,   startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setTitle(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isPending) { setOpen(false); setShowUpgrade(false); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPending]);

  async function handleCreate() {
    startTransition(async () => {
      const result = await createResume(title.trim() || "Untitled Resume");
      if (result?.error) { setOpen(false); setShowUpgrade(true); }
    });
  }

  async function handleUpgrade() {
    const res  = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      {/* ── Card trigger ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 w-full min-h-[240px] p-8 bg-transparent border-2 border-dashed border-rv-border cursor-pointer transition-colors duration-200 hover:border-rv-accent hover:bg-[rgba(200,75,47,0.03)]"
      >
        <div className="w-10 h-10 rounded-full bg-rv-accent text-white flex items-center justify-center text-xl leading-none">
          +
        </div>
        <span className="text-sm font-medium text-rv-ink">New resume</span>
      </button>

      {/* ── Create modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(15,14,13,0.45)] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !isPending) setOpen(false); }}
        >
          <div className="bg-rv-white border border-rv-border rounded-[4px] p-8 w-full max-w-[440px] shadow-[0_24px_64px_rgba(15,14,13,0.2)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[1.1rem] font-semibold text-rv-ink tracking-[-0.02em]">New resume</h2>
                <p className="text-[0.8rem] text-rv-muted mt-1">Give your resume a name to get started.</p>
              </div>
              <button onClick={() => setOpen(false)} disabled={isPending}
                className="bg-transparent border-0 cursor-pointer text-rv-muted text-xl leading-none p-1 hover:text-rv-ink transition-colors disabled:opacity-50">
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-[0.72rem] font-semibold text-rv-muted tracking-[0.06em] uppercase mb-1.5">
                Resume Name
              </label>
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isPending) handleCreate(); }}
                placeholder="e.g. Software Engineer — Google"
                disabled={isPending}
                className="w-full px-3.5 py-2.5 border border-rv-border rounded-sm bg-rv-paper text-rv-ink text-[0.9rem] outline-none focus:border-rv-accent transition-colors disabled:opacity-60"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setOpen(false)} disabled={isPending}
                className="px-4 py-2 bg-transparent border border-rv-border rounded-sm cursor-pointer text-rv-muted text-[0.85rem] font-medium hover:border-rv-ink hover:text-rv-ink transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={isPending}
                className={`px-5 py-2 border-0 rounded-sm text-white text-[0.85rem] font-semibold min-w-[130px] transition-colors ${isPending ? "bg-rv-muted cursor-not-allowed" : "bg-rv-accent cursor-pointer hover:bg-rv-ink"}`}>
                {isPending ? "Creating…" : "Create resume →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upgrade modal ── */}
      {showUpgrade && (
        <>
          <div className="fixed inset-0 bg-[rgba(15,14,13,0.5)] z-[100]" onClick={() => setShowUpgrade(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-rv-white rounded-[4px] p-8 max-w-[380px] w-[90%] shadow-[0_20px_60px_rgba(15,14,13,0.2)] text-center">
            <div className="w-11 h-11 rounded-full bg-[rgba(200,75,47,0.08)] flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-rv-accent fill-none" strokeWidth={1.5}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-[1.25rem] text-rv-ink mb-2">Resume limit reached</h3>
            <p className="text-[0.82rem] text-rv-muted leading-relaxed mb-6">
              The Free plan includes 1 resume. Upgrade to Pro for unlimited resumes, all 10 templates, DOCX export, and unlimited AI tools.
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={handleUpgrade}
                className="px-5 py-2 bg-rv-accent text-white border-0 rounded-sm text-[0.82rem] font-bold cursor-pointer hover:bg-rv-ink transition-colors">
                Upgrade to Pro →
              </button>
              <button onClick={() => setShowUpgrade(false)}
                className="px-4 py-2 bg-transparent text-rv-muted border border-rv-border rounded-sm text-[0.82rem] cursor-pointer hover:border-rv-ink hover:text-rv-ink transition-colors">
                Maybe later
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}