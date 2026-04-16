"use client";

import Link from "next/link";

function ResumeMock() {
  return (
    <div className="rv-float relative w-85 bg-rv-white border border-rv-border shadow-lg p-10">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 bg-rv-accent h-1" />

      {/* AI badge */}
      <div className="absolute text-xs font-bold tracking-widest uppercase -top-3.5 -right-3.5 bg-rv-accent text-rv-white px-2 py-1.5 rounded shadow-md">
        ✦ AI Generated
      </div>

      {/* Name */}
      <div className="font-serif mb-1 text-2xl text-rv-ink">Tee Jay</div>

      {/* Job title */}
      <div className="uppercase tracking-widest mb-6 text-xs text-rv-accent">
        Full Stack Developer
      </div>

      {/* Divider */}
      <div className="mb-5 bg-rv-border h-0.5" />

      {/* Sections */}
      {[
        { label: "Summary", bars: ["w90", "w75", "w60"] },
        { label: "Experience", bars: ["w90", "w45", "w75", "w60"] },
        { label: "Skills", bars: ["w75", "w45"] },
      ].map((section, i) => (
        <div key={section.label} className={i > 0 ? "mt-4" : ""}>
          <div className="uppercase font-semibold mb-3 text-rv-muted text-xs tracking-widest">
            {section.label}
          </div>
          {section.bars.map((w, j) => (
            <div key={j} className={`rv-bar ${w}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="grid min-h-screen pt-20 grid-cols-2">
      {/* Left */}
      <div className="flex flex-col justify-center border-r border-rv-border px-16 py-24">
        {/* Eyebrow */}
        <span className="rv-fade-up rv-eyebrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8 text-rv-accent">
          AI-Powered Resume Builder
        </span>

        {/* Headline */}
        <h1 className="rv-fade-up rv-delay-1 font-serif mb-7 text-rv-ink tracking-tight text-8xl">
          Your next job
          <br />
          starts with a
          <br />
          <em className="italic text-rv-accent">great résumé.</em>
        </h1>

        {/* Subtext */}
        <p className="rv-fade-up rv-delay-2 mb-12 text-rv-muted max-w-105 text-base">
          ResumeVerse uses AI to craft compelling, ATS-optimized resumes in
          minutes. Pick a template, describe your experience, and let AI do the
          heavy lifting.
        </p>

        {/* Actions */}
        <div className="rv-fade-up rv-delay-3 flex items-center gap-5">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-semibold no-underline transition-all duration-200 bg-rv-accent hover:bg-[#a83a20] text-rv-white px-8 py-4 rounded shadow-md text-base hover:-translate-y-0.5"
          >
            Build my resume →
          </Link>
          <Link
            href="#templates"
            className="text-sm font-medium no-underline transition-all duration-200 text-rv-muted border-b border-rv-border pb-0.5 hover:text-rv-ink hover:border-rv-ink"
          >
            See templates
          </Link>
        </div>

        {/* Stats */}
        <div className="rv-fade-up rv-delay-4 flex gap-10 mt-16 pt-8 border-t border-rv-border">
          {[
            { num: "10", label: "Templates" },
            { num: "7", label: "AI Tools" },
            { num: "PDF", label: "+ DOCX Export" },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="font-serif block text-4xl font-bold text-rv-ink">
                {stat.num}
              </span>
              <span className="uppercase tracking-wider text-sm font-medium block text-rv-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Resume Mock */}
      <div className="rv-fade-up rv-delay-5 relative flex items-center justify-center overflow-hidden bg-rv-cream px-12 py-24">
        {/* Glow */}
        <div className="pointer-events-none absolute w-100 h-100 -top-25 -right-25 bg-[radial-gradient(circle,rgba(200,75,47,0.15)_0%,transparent_70%)]" />
        <ResumeMock />
      </div>
    </section>
  );
}
