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
    <div className="fixed inset-0 z-[9999] bg-rv-paper flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[rgba(200,75,47,0.08)] flex items-center justify-center mb-6">
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          stroke="var(--rv-accent)"
          fill="none"
          strokeWidth={1.5}
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
      <h2 className="font-serif text-[1.5rem] text-rv-ink mb-3 leading-tight">
        Resume builder needs
        <br />a larger screen
      </h2>
      <p className="text-[0.875rem] text-rv-muted leading-relaxed max-w-[300px] mb-8">
        The builder is designed for desktop. Please open ResumeVerse on a laptop
        or desktop to build and edit your resume.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 bg-rv-ink text-white rounded-sm no-underline text-[0.85rem] font-semibold hover:bg-rv-accent transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
