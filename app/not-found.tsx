import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-rv-paper flex flex-col items-center justify-center px-8 text-center">
      <p className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-rv-accent mb-4">
        404
      </p>
      <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-rv-ink leading-[1.1] tracking-[-0.03em] mb-4">
        Page not found.
      </h1>
      <p className="text-base text-rv-muted max-w-100 leading-relaxed mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-rv-ink text-white no-underline rounded-sm font-bold text-[0.875rem] hover:bg-rv-accent transition-colors"
        >
          Go home
        </Link>
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
