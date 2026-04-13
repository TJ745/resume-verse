"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 bg-rv-paper border-b border-rv-border">
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-4xl tracking-tight no-underline text-rv-ink"
      >
        Resume
        <span className="text-rv-accent italic">Verse</span>
      </Link>

      {/* Nav Links */}
      <ul className="flex gap-10 list-none">
        {[
          { href: "#features", label: "Features" },
          { href: "#templates", label: "Templates" },
          { href: "#how", label: "How it works" },
          { href: "/pricing", label: "Pricing" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-base font-medium no-underline transition-colors duration-200 text-rv-muted hover:text-rv-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="text-sm font-medium no-underline px-5 py-2.5 transition-colors duration-200 border rounded border-rv-ink text-rv-ink hover:border-rv-accent hover:text-rv-accent"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium no-underline px-5 py-2.5 transition-colors duration-200 bg-rv-ink text-rv-paper hover:bg-rv-accent hover:text-rv-white rounded"
        >
          Start for free →
        </Link>
      </div>
    </nav>
  );
}
