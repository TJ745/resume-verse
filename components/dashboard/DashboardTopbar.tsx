"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

export default function DashboardTopbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-rv-paper border-b border-rv-border h-16">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="font-serif text-2xl no-underline text-rv-ink flex items-center tracking-tight"
      >
        Resume
        <span className="text-rv-accent italic">Verse</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 transition-opacity duration-150 cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex items-center justify-center font-semibold text-sm w-8 h-8 rounded-full bg-rv-accent text-rv-white">
              {initials}
            </div>

            {/* Name */}
            <span className="text-sm font-medium hidden sm:block text-rv-ink">
              {session?.user?.name ?? "Account"}
            </span>

            {/* Chevron */}
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

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 py-1 min-w-52 bg-rv-white rounded-lg shadow-lg border-rv-border">
              {/* User info */}
              <div className="px-4 py-3 border-b border-rv-border">
                <p className="text-sm font-medium text-rv-ink">
                  {session?.user?.name}
                </p>
                <p className="text-xs mt-0.5 text-rv-muted">
                  {session?.user?.email}
                </p>
              </div>

              {/* Menu items */}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-rv-muted hover:bg-rv-cream hover:text-rv-ink"
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
