// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function MobileBuilderBlock() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     function check() {
//       setIsMobile(window.innerWidth < 900);
//     }
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   if (!isMobile) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 9999,
//         background: "var(--rv-paper)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "2rem",
//         textAlign: "center",
//       }}
//     >
//       {/* Icon */}
//       <div
//         style={{
//           width: 64,
//           height: 64,
//           borderRadius: "50%",
//           background: "rgba(200,75,47,0.08)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           marginBottom: "1.5rem",
//         }}
//       >
//         <svg
//           viewBox="0 0 24 24"
//           style={{
//             width: 28,
//             height: 28,
//             stroke: "var(--rv-accent)",
//             fill: "none",
//             strokeWidth: 1.5,
//           }}
//         >
//           <rect x="5" y="2" width="14" height="20" rx="2" />
//           <line
//             x1="12"
//             y1="18"
//             x2="12.01"
//             y2="18"
//             strokeWidth="2"
//             strokeLinecap="round"
//           />
//         </svg>
//       </div>

//       <h2
//         className="font-serif"
//         style={{
//           fontSize: "1.5rem",
//           color: "var(--rv-ink)",
//           marginBottom: "0.75rem",
//           lineHeight: 1.2,
//         }}
//       >
//         Resume builder needs
//         <br />a larger screen
//       </h2>
//       <p
//         style={{
//           fontSize: "0.875rem",
//           color: "var(--rv-muted)",
//           lineHeight: 1.65,
//           maxWidth: 300,
//           marginBottom: "2rem",
//         }}
//       >
//         The builder is designed for desktop. Please open ResumeVerse on a laptop
//         or desktop computer to build and edit your resume.
//       </p>
//       <Link
//         href="/dashboard"
//         style={{
//           padding: "0.6rem 1.5rem",
//           background: "var(--rv-ink)",
//           color: "#fff",
//           borderRadius: 2,
//           textDecoration: "none",
//           fontSize: "0.85rem",
//           fontWeight: 600,
//         }}
//       >
//         Back to Dashboard
//       </Link>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MobileBuilderBlock() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 900);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--rv-paper)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(200,75,47,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{
            width: 28,
            height: 28,
            stroke: "var(--rv-accent)",
            fill: "none",
            strokeWidth: 1.5,
          }}
        >
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line
            x1="12"
            y1="18"
            x2="12.01"
            y2="18"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2
        className="font-serif"
        style={{
          fontSize: "1.5rem",
          color: "var(--rv-ink)",
          marginBottom: "0.75rem",
          lineHeight: 1.2,
        }}
      >
        Resume builder needs
        <br />a larger screen
      </h2>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--rv-muted)",
          lineHeight: 1.65,
          maxWidth: 300,
          marginBottom: "2rem",
        }}
      >
        The builder is designed for desktop. Please open ResumeVerse on a laptop
        or desktop computer to build and edit your resume.
      </p>
      <Link
        href="/dashboard"
        style={{
          padding: "0.6rem 1.5rem",
          background: "var(--rv-ink)",
          color: "#fff",
          borderRadius: 2,
          textDecoration: "none",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
