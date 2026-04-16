import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-rv-paper text-rv-ink">
      {/* Minimal nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-rv-border">
        <Link
          href="/"
          className="font-serif text-3xl no-underline text-rv-ink tracking-tight"
        >
          Resume
          <span className="italic text-rv-accent">Verse</span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </main>

      <footer className="text-center py-6 text-sm text-rv-muted">
        © {new Date().getFullYear()} ResumeVerse
      </footer>
    </div>
  );
}
