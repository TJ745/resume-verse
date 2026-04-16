"use client";

import Link from "next/link";
import { account, legal, nav } from "@/constants/footer";

export function CTASection() {
  return (
    <section className="px-16 py-32 bg-rv-accent items-center flex justify-between ">
      <h2 className="font-serif tracking-tight text-rv-white text-7xl">
        Ready to land your
        <br />
        <em className="italic text-[rgba(255,255,255,0.6)]">next interview?</em>
      </h2>

      <Link
        href="/register"
        className="inline-flex items-center gap-2 font-bold transition-transform duration-150 bg-rv-white text-rv-accent px-9 py-4 rounded text-base hover:-translate-y-0.5"
      >
        Build your resume free →
      </Link>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rv-border px-16 py-12">
      <div className="flex items-start justify-between gap-8 mb-10">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-serif text-4xl no-underline text-rv-ink tracking-tight"
          >
            Resume
            <span className="text-rv-accent italic">Verse</span>
          </Link>
          <p className="text-base text-rv-muted mt-2 max-w-55">
            AI-powered resume builder that helps you land more interviews.
          </p>
        </div>

        {/* Product nav */}
        <div>
          <p className="text-base font-bold tracking-widest uppercase text-rv-muted mb-3">
            Product
          </p>
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-rv-muted text-sm hover:text-rv-ink transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-base font-bold tracking-widest uppercase text-rv-muted mb-3">
            Account
          </p>
          <div className="flex flex-col gap-2">
            {account.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-rv-muted text-sm hover:text-rv-ink transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <p className="text-base font-bold tracking-widest uppercase text-rv-muted mb-3">
            Legal
          </p>
          <div className="flex flex-col gap-2">
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-rv-muted text-sm hover:text-rv-ink transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-rv-border pt-6 flex items-center justify-between text-sm text-rv-muted">
        <p>© {new Date().getFullYear()} ResumeVerse. All rights reserved.</p>
        <p>Built with ❤️ | TJ</p>
      </div>
    </footer>
  );
}
