"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5"
      style={{
        background: "var(--rv-paper)",
        borderBottom: "1px solid var(--rv-border)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-2xl tracking-tight no-underline"
        style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
      >
        Resume
        <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
          Verse
        </span>
      </Link>

      {/* Nav Links */}
      <ul className="flex gap-10 list-none">
        {[
          { href: "#features", label: "Features" },
          { href: "#templates", label: "Templates" },
          { href: "#how", label: "How it works" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium no-underline transition-colors duration-200"
              style={{ color: "var(--rv-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--rv-ink)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--rv-muted)")
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/register"
        className="text-sm font-medium no-underline px-5 py-2.5 transition-colors duration-200"
        style={{
          background: "var(--rv-ink)",
          color: "var(--rv-paper)",
          borderRadius: "2px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--rv-accent)";
          e.currentTarget.style.color = "var(--rv-white)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--rv-ink)";
          e.currentTarget.style.color = "var(--rv-paper)";
        }}
      >
        Start for free →
      </Link>
    </nav>
  );
}
