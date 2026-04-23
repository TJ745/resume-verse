"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 bg-rv-paper border-b border-rv-border">
      <Link
        href="/"
        className="font-serif text-4xl no-underline text-rv-ink tracking-[-0.02em]"
      >
        Resume<span className="text-rv-accent italic">Verse</span>
      </Link>

      <ul className="hidden md:flex gap-10 list-none m-0 p-0">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-base font-medium no-underline text-rv-muted hover:text-rv-ink transition-colors duration-150"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden md:inline-block text-sm font-medium no-underline px-5 py-2.5 border hover:border-rv-accent hover:text-rv-accent border-rv-ink text-rv-ink rounded-sm transition-colors duration-150"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="hidden md:inline-block text-sm font-medium no-underline px-5 py-2.5 bg-rv-ink text-rv-paper rounded-sm hover:bg-rv-accent hover:text-white transition-colors duration-150"
        >
          Start for free →
        </Link>
      </div>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="md:hidden bg-transparent border-0 cursor-pointer text-rv-ink text-xl p-1"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-rv-paper border-b border-rv-border flex flex-col gap-0 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-8 py-4 text-sm font-medium no-underline text-rv-muted border-b border-rv-border hover:text-rv-ink hover:bg-rv-cream transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="mx-8 my-4 px-5 py-2.5 bg-rv-accent text-white no-underline rounded-sm font-semibold text-sm text-center hover:bg-rv-ink transition-colors"
          >
            Start for free →
          </Link>
        </div>
      )}
    </nav>
  );
}
