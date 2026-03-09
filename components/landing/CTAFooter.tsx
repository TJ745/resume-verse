"use client";

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
  return (
    <footer
      className="flex items-center justify-between"
      style={{
        padding: "3rem 4rem",
        borderTop: "1px solid var(--rv-border)",
      }}
    >
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
      <p style={{ fontSize: "0.8125rem", color: "var(--rv-muted)" }}>
        Built with Next.js · Tailwind · OpenAI · Prisma
      </p>
    </footer>
  );
}
