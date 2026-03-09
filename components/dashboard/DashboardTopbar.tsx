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
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{
        background: "var(--rv-paper)",
        borderBottom: "1px solid var(--rv-border)",
        height: "64px",
      }}
    >
      {/* Logo */}
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

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 transition-opacity duration-150"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center font-semibold text-sm"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--rv-accent)",
                color: "var(--rv-white)",
                letterSpacing: "0.02em",
              }}
            >
              {initials}
            </div>

            {/* Name */}
            <span
              className="text-sm font-medium hidden sm:block"
              style={{ color: "var(--rv-ink)" }}
            >
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
            <div
              className="absolute right-0 mt-2 py-1"
              style={{
                minWidth: 200,
                background: "var(--rv-white)",
                border: "1px solid var(--rv-border)",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(15,14,13,0.1)",
              }}
            >
              {/* User info */}
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--rv-border)" }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--rv-ink)" }}
                >
                  {session?.user?.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--rv-muted)" }}
                >
                  {session?.user?.email}
                </p>
              </div>

              {/* Menu items */}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
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
