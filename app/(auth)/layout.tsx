import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
    >
      {/* Minimal nav */}
      <header
        className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid var(--rv-border)" }}
      >
        <Link
          href="/"
          className="font-serif text-2xl no-underline"
          style={{ color: "var(--rv-ink)", letterSpacing: "-0.02em" }}
        >
          Resume
          <span style={{ color: "var(--rv-accent)", fontStyle: "italic" }}>
            Verse
          </span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </main>

      <footer
        className="text-center py-6"
        style={{ fontSize: "0.8125rem", color: "var(--rv-muted)" }}
      >
        © {new Date().getFullYear()} ResumeVerse
      </footer>
    </div>
  );
}
