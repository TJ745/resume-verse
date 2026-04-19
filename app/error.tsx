"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-rv-paper flex flex-col items-center justify-center px-8 text-center">
      <p className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-rv-accent mb-4">
        Something went wrong
      </p>
      <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-rv-ink leading-[1.1] tracking-[-0.03em] mb-4">
        An unexpected error occurred.
      </h1>
      <p className="text-[0.9rem] text-rv-muted max-w-100 leading-relaxed mb-10">
        Don&apos;t worry — your resumes are safe. Try refreshing the page or go
        back to your dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-rv-accent text-white border-0 rounded-sm font-bold text-[0.875rem] cursor-pointer hover:bg-rv-ink transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-transparent text-rv-muted no-underline border border-rv-border rounded-sm font-semibold text-[0.875rem] hover:border-rv-ink hover:text-rv-ink transition-colors"
        >
          Dashboard
        </Link>
      </div>

      <Link
        href="/"
        className="font-serif absolute top-6 left-8 text-[1.1rem] text-rv-ink no-underline tracking-[-0.02em]"
      >
        Resume<span className="text-rv-accent italic">Verse</span>
      </Link>
    </div>
  );
}
