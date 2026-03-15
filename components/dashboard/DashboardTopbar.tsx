// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { signOut, useSession } from "@/lib/auth-client";

// export default function DashboardTopbar() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close on outside click
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   async function handleSignOut() {
//     await signOut();
//     router.push("/login");
//   }

//   const initials = session?.user?.name
//     ? session.user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2)
//     : "?";

//   return (
//     <header
//       className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
//       style={{
//         background: "var(--rv-paper)",
//         borderBottom: "1px solid var(--rv-border)",
//         height: "64px",
//       }}
//     >
//       {/* Logo */}
//       <Link
//         href="/dashboard"
//         className="font-serif text-xl no-underline"
//         style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
//       >
//         Resume
//         <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
//           Verse
//         </span>
//       </Link>

//       {/* Right side */}
//       <div className="flex items-center gap-4">
//         {/* User dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen((o) => !o)}
//             className="flex items-center gap-2.5 transition-opacity duration-150"
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               padding: 0,
//             }}
//           >
//             {/* Avatar */}
//             <div
//               className="flex items-center justify-center font-semibold text-sm"
//               style={{
//                 width: 34,
//                 height: 34,
//                 borderRadius: "50%",
//                 background: "var(--rv-accent)",
//                 color: "var(--rv-white)",
//                 letterSpacing: "0.02em",
//               }}
//             >
//               {initials}
//             </div>

//             {/* Name */}
//             <span
//               className="text-sm font-medium hidden sm:block"
//               style={{ color: "var(--rv-ink)" }}
//             >
//               {session?.user?.name ?? "Account"}
//             </span>

//             {/* Chevron */}
//             <svg
//               viewBox="0 0 16 16"
//               style={{
//                 width: 14,
//                 height: 14,
//                 stroke: "var(--rv-muted)",
//                 fill: "none",
//                 strokeWidth: 1.5,
//                 transform: open ? "rotate(180deg)" : "rotate(0deg)",
//                 transition: "transform 0.15s",
//               }}
//             >
//               <path d="M4 6l4 4 4-4" />
//             </svg>
//           </button>

//           {/* Dropdown menu */}
//           {open && (
//             <div
//               className="absolute right-0 mt-2 py-1"
//               style={{
//                 minWidth: 200,
//                 background: "var(--rv-white)",
//                 border: "1px solid var(--rv-border)",
//                 borderRadius: 2,
//                 boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
//               }}
//             >
//               {/* User info */}
//               <div
//                 className="px-4 py-3"
//                 style={{ borderBottom: "1px solid var(--rv-border)" }}
//               >
//                 <p
//                   className="text-sm font-medium"
//                   style={{ color: "var(--rv-ink)" }}
//                 >
//                   {session?.user?.name}
//                 </p>
//                 <p
//                   className="text-xs mt-0.5"
//                   style={{ color: "var(--rv-muted)" }}
//                 >
//                   {session?.user?.email}
//                 </p>
//               </div>

//               {/* Menu items */}
//               {[
//                 { href: "/dashboard/settings", label: "Account Settings" },
//                 { href: "/pricing", label: "Upgrade to Pro" },
//               ].map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setOpen(false)}
//                   className="block px-4 py-2.5 text-sm transition-colors duration-150"
//                   style={{ color: "var(--rv-muted)", textDecoration: "none" }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = "var(--rv-cream)";
//                     e.currentTarget.style.color = "var(--rv-ink)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = "none";
//                     e.currentTarget.style.color = "var(--rv-muted)";
//                   }}
//                 >
//                   {item.label}
//                 </Link>
//               ))}

//               <div
//                 style={{
//                   borderTop: "1px solid var(--rv-border)",
//                   margin: "4px 0",
//                 }}
//               />

//               <button
//                 onClick={handleSignOut}
//                 className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "var(--rv-muted)",
//                   fontFamily: "inherit",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "var(--rv-cream)";
//                   e.currentTarget.style.color = "var(--rv-ink)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "none";
//                   e.currentTarget.style.color = "var(--rv-muted)";
//                 }}
//               >
//                 Sign out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

interface TopbarProps {
  plan?: string;
  aiUsed?: number;
  aiLimit?: number;
}

export default function DashboardTopbar({
  plan = "free",
  aiUsed = 0,
  aiLimit = 10,
}: TopbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  async function handleManageBilling() {
    setOpen(false);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const isPro = plan === "pro";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{
        background: "var(--rv-paper)",
        borderBottom: "1px solid var(--rv-border)",
        height: "64px",
      }}
    >
      <Link
        href="/dashboard"
        className="font-serif text-xl no-underline"
        style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
      >
        Resume
        <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
          Verse
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Free AI usage pill */}
        {!isPro && (
          <Link
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.7rem",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.3rem 0.7rem",
              borderRadius: 99,
              border: "1px solid var(--rv-border)",
              color: aiUsed >= aiLimit ? "var(--rv-accent)" : "var(--rv-muted)",
              background:
                aiUsed >= aiLimit ? "rgba(200,75,47,0.06)" : "transparent",
            }}
          >
            <svg
              viewBox="0 0 16 16"
              style={{
                width: 10,
                height: 10,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 1.8,
              }}
            >
              <path d="M8 2l1.6 4.9H15l-4.1 3 1.6 4.9L8 12l-4.5 2.8 1.6-4.9L1 7h5.4z" />
            </svg>
            {aiUsed}/{aiLimit} AI uses
            {aiUsed >= aiLimit && (
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  background: "var(--rv-accent)",
                  color: "#fff",
                  borderRadius: 99,
                  padding: "1px 5px",
                }}
              >
                Upgrade
              </span>
            )}
          </Link>
        )}

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              className="flex items-center justify-center font-semibold text-sm"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: isPro ? "var(--rv-ink)" : "var(--rv-accent)",
                color: "var(--rv-white)",
              }}
            >
              {initials}
            </div>

            <div
              className="hidden sm:flex flex-col items-start"
              style={{ gap: 1 }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "var(--rv-ink)", lineHeight: 1 }}
              >
                {session?.user?.name ?? "Account"}
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  color: isPro ? "#2d5a3d" : "var(--rv-muted)",
                }}
              >
                {isPro ? "✦ Pro" : "Free"}
              </span>
            </div>

            <svg
              viewBox="0 0 16 16"
              style={{
                width: 14,
                height: 14,
                stroke: "var(--rv-muted)",
                fill: "none",
                strokeWidth: 1.5,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 py-1"
              style={{
                minWidth: 215,
                background: "var(--rv-white)",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--rv-border)" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--rv-ink)" }}
                  >
                    {session?.user?.name}
                  </p>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 7px",
                      borderRadius: 99,
                      background: isPro
                        ? "rgba(45,90,61,0.1)"
                        : "rgba(138,132,120,0.1)",
                      color: isPro ? "#2d5a3d" : "var(--rv-muted)",
                    }}
                  >
                    {isPro ? "✦ Pro" : "Free"}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--rv-muted)" }}>
                  {session?.user?.email}
                </p>
                {!isPro && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{ fontSize: "0.6rem", color: "var(--rv-muted)" }}
                      >
                        AI uses this month
                      </span>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          color:
                            aiUsed >= aiLimit
                              ? "var(--rv-accent)"
                              : "var(--rv-muted)",
                        }}
                      >
                        {aiUsed}/{aiLimit}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "var(--rv-border)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min((aiUsed / aiLimit) * 100, 100)}%`,
                          background:
                            aiUsed >= aiLimit
                              ? "var(--rv-accent)"
                              : "var(--rv-ink)",
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm"
                style={{ color: "var(--rv-muted)", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--rv-cream)";
                  e.currentTarget.style.color = "var(--rv-ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--rv-muted)";
                }}
              >
                Account Settings
              </Link>

              {isPro ? (
                <button
                  onClick={handleManageBilling}
                  className="w-full text-left px-4 py-2.5 text-sm"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--rv-muted)",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--rv-cream)";
                    e.currentTarget.style.color = "var(--rv-ink)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "var(--rv-muted)";
                  }}
                >
                  Manage Billing
                </button>
              ) : (
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold"
                  style={{ color: "var(--rv-accent)", textDecoration: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(200,75,47,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  ✦ Upgrade to Pro
                </Link>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--rv-border)",
                  margin: "4px 0",
                }}
              />

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-sm"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--rv-muted)",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--rv-cream)";
                  e.currentTarget.style.color = "var(--rv-ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--rv-muted)";
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
