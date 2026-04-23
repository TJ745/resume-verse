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
      )
        setOpen(false);
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
  const usagePct = Math.min((aiUsed / aiLimit) * 100, 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-rv-paper border-b border-rv-border">
      <Link
        href="/dashboard"
        className="font-serif text-4xl no-underline text-rv-ink tracking-[-0.02em]"
      >
        Resume<span className="text-rv-accent italic">Verse</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* AI usage pill — free users only */}
        {!isPro && (
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-1.5 text-[0.7rem] font-semibold no-underline px-3 py-1.5 rounded-full border transition-colors ${aiUsed >= aiLimit ? "border-[rgba(200,75,47,0.3)] text-rv-accent bg-[rgba(200,75,47,0.06)]" : "border-rv-border text-rv-muted bg-transparent hover:border-rv-accent hover:text-rv-accent"}`}
          >
            <svg
              viewBox="0 0 16 16"
              width={10}
              height={10}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path d="M8 2l1.6 4.9H15l-4.1 3 1.6 4.9L8 12l-4.5 2.8 1.6-4.9L1 7h5.4z" />
            </svg>
            {aiUsed}/{aiLimit} AI uses
            {aiUsed >= aiLimit && (
              <span className="text-[0.6rem] font-extrabold bg-rv-accent text-white rounded-full px-1.5 py-px">
                Upgrade
              </span>
            )}
          </Link>
        )}

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0"
          >
            <div
              className={`w-8.5 h-8.5 rounded-full flex items-center justify-center text-sm font-semibold text-white ${isPro ? "bg-rv-ink" : "bg-rv-accent"}`}
            >
              {initials}
            </div>
            <div className="hidden sm:flex flex-col items-start gap-px">
              <span className="text-sm font-medium text-rv-ink leading-none">
                {session?.user?.name ?? "Account"}
              </span>
              <span
                className={`text-[0.55rem] font-extrabold tracking-[0.08em] uppercase leading-none ${isPro ? "text-[#2d5a3d]" : "text-rv-muted"}`}
              >
                {isPro ? "✦ Pro" : "Free"}
              </span>
            </div>
            <svg
              viewBox="0 0 16 16"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className={`text-rv-muted transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 py-1 min-w-54 bg-rv-white border border-rv-border rounded-sm shadow-[0_8px_24px_rgba(15,14,13,0.1)] z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-rv-border">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-medium text-rv-ink">
                    {session?.user?.name}
                  </p>
                  <span
                    className={`text-[0.55rem] font-extrabold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full ${isPro ? "bg-[rgba(45,90,61,0.1)] text-[#2d5a3d]" : "bg-[rgba(138,132,120,0.1)] text-rv-muted"}`}
                  >
                    {isPro ? "✦ Pro" : "Free"}
                  </span>
                </div>
                <p className="text-xs text-rv-muted">{session?.user?.email}</p>
                {!isPro && (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-[0.6rem] text-rv-muted">
                        AI uses this month
                      </span>
                      <span
                        className={`text-[0.6rem] font-semibold ${aiUsed >= aiLimit ? "text-rv-accent" : "text-rv-muted"}`}
                      >
                        {aiUsed}/{aiLimit}
                      </span>
                    </div>
                    <div className="h-1 bg-rv-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${aiUsed >= aiLimit ? "bg-rv-accent" : "bg-rv-ink"}`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-rv-muted no-underline hover:bg-rv-cream hover:text-rv-ink transition-colors"
              >
                Account Settings
              </Link>

              {isPro ? (
                <button
                  onClick={handleManageBilling}
                  className="w-full text-left px-4 py-2.5 text-sm text-rv-muted bg-transparent border-0 cursor-pointer hover:bg-rv-cream hover:text-rv-ink transition-colors"
                >
                  Manage Billing
                </button>
              ) : (
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-rv-accent no-underline hover:bg-[rgba(200,75,47,0.05)] transition-colors"
                >
                  ✦ Upgrade to Pro
                </Link>
              )}

              <div className="border-t border-rv-border my-1" />

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 text-sm text-rv-muted bg-transparent border-0 cursor-pointer hover:bg-rv-cream hover:text-rv-ink transition-colors"
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
