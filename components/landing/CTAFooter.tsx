// "use client";

// import Link from "next/link";

// export function CTASection() {
//   return (
//     <section
//       style={{
//         padding: "8rem 4rem",
//         background: "var(--rv-accent)",
//         display: "grid",
//         gridTemplateColumns: "1fr auto",
//         alignItems: "center",
//         gap: "4rem",
//       }}
//     >
//       <h2
//         className="font-serif"
//         style={{
//           fontSize: "clamp(2.5rem, 4vw, 4rem)",
//           color: "var(--rv-white)",
//           lineHeight: 1.1,
//           letterSpacing: "-0.03em",
//         }}
//       >
//         Ready to land your
//         <br />
//         <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>
//           next interview?
//         </em>
//       </h2>

//       <Link
//         href="/register"
//         className="inline-flex items-center gap-2 font-bold no-underline whitespace-nowrap transition-transform duration-150"
//         style={{
//           background: "var(--rv-white)",
//           color: "var(--rv-accent)",
//           padding: "1rem 2.25rem",
//           borderRadius: 2,
//           fontSize: "0.9375rem",
//         }}
//         onMouseEnter={(e) =>
//           (e.currentTarget.style.transform = "translateY(-2px)")
//         }
//         onMouseLeave={(e) =>
//           (e.currentTarget.style.transform = "translateY(0)")
//         }
//       >
//         Build your resume free →
//       </Link>
//     </section>
//   );
// }

// export function Footer() {
//   return (
//     <footer
//       className="flex items-center justify-between"
//       style={{
//         padding: "3rem 4rem",
//         borderTop: "1px solid var(--rv-border)",
//       }}
//     >
//       <Link
//         href="/"
//         className="font-serif text-2xl no-underline"
//         style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
//       >
//         Resume
//         <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
//           Verse
//         </span>
//       </Link>
//       <p style={{ fontSize: "0.8125rem", color: "var(--rv-muted)" }}>
//         Built with Next.js · Tailwind · OpenAI · Prisma
//       </p>
//     </footer>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";

export function CTASection() {
  return (
    <section
      style={{
        padding: "8rem 4rem",
        background: "var(--rv-accent)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "4rem",
      }}
    >
      <h2
        className="font-serif"
        style={{
          fontSize: "clamp(2.5rem, 4vw, 4rem)",
          color: "var(--rv-white)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}
      >
        Ready to land your
        <br />
        <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.6)" }}>
          next interview?
        </em>
      </h2>

      <Link
        href="/register"
        className="inline-flex items-center gap-2 font-bold no-underline whitespace-nowrap transition-transform duration-150"
        style={{
          background: "var(--rv-white)",
          color: "var(--rv-accent)",
          padding: "1rem 2.25rem",
          borderRadius: 2,
          fontSize: "0.9375rem",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-2px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        Build your resume free →
      </Link>
    </section>
  );
}

export function Footer() {
  const nav = [
    { label: "Features", href: "/#features" },
    { label: "Templates", href: "/#templates" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/pricing" },
  ];
  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];
  const linkStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "var(--rv-muted)",
    textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <footer
      style={{ borderTop: "1px solid var(--rv-border)", padding: "3rem 4rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-serif text-2xl no-underline"
            style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
          >
            Resume
            <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
              Verse
            </span>
          </Link>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--rv-muted)",
              marginTop: "0.5rem",
              maxWidth: 220,
              lineHeight: 1.55,
            }}
          >
            AI-powered resume builder that helps you land more interviews.
          </p>
        </div>

        {/* Product nav */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              marginBottom: "0.75rem",
            }}
          >
            Product
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rv-ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rv-muted)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              marginBottom: "0.75rem",
            }}
          >
            Account
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Sign up free", href: "/register" },
              { label: "Sign in", href: "/login" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rv-ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rv-muted)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rv-muted)",
              marginBottom: "0.75rem",
            }}
          >
            Legal
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rv-ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rv-muted)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--rv-border)",
          paddingTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--rv-muted)" }}>
          © {new Date().getFullYear()} ResumeVerse. All rights reserved.
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--rv-muted)" }}>
          Built with Next.js · Tailwind · OpenAI · Prisma
        </p>
      </div>
    </footer>
  );
}
