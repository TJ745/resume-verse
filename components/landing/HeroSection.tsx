"use client";

import Link from "next/link";

function ResumeMock() {
  return (
    <div
      className="animate-float relative"
      style={{
        width: 340,
        background: "var(--rv-white)",
        border: "1px solid var(--rv-border)",
        boxShadow:
          "0 24px 64px rgba(15,14,13,0.12), 0 4px 16px rgba(15,14,13,0.06)",
        padding: "2.5rem",
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 4, background: "var(--rv-accent)" }}
      />

      {/* AI badge */}
      <div
        className="absolute text-xs font-bold tracking-widest uppercase"
        style={{
          top: -14,
          right: -14,
          background: "var(--rv-accent)",
          color: "var(--rv-white)",
          padding: "0.35rem 0.75rem",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(200,75,47,0.3)",
          fontSize: "0.625rem",
        }}
      >
        ✦ AI Generated
      </div>

      {/* Name */}
      <div
        className="font-serif mb-1"
        style={{ fontSize: "1.4rem", color: "var(--rv-ink)" }}
      >
        Alexandra Chen
      </div>

      {/* Job title */}
      <div
        className="uppercase tracking-widest mb-6"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          color: "var(--rv-accent)",
        }}
      >
        Senior Product Designer
      </div>

      {/* Divider */}
      <div
        className="mb-5"
        style={{ height: 1, background: "var(--rv-border)" }}
      />

      {/* Sections */}
      {[
        { label: "Summary", bars: ["w90", "w75", "w60"] },
        { label: "Experience", bars: ["w90", "w45", "w75", "w60"] },
        { label: "Skills", bars: ["w75", "w45"] },
      ].map((section, i) => (
        <div key={section.label} className={i > 0 ? "mt-4" : ""}>
          <div
            className="uppercase font-semibold mb-3"
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              color: "var(--rv-muted)",
            }}
          >
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
    <section
      className="grid min-h-screen"
      style={{
        gridTemplateColumns: "1fr 1fr",
        paddingTop: "5rem",
      }}
    >
      {/* Left */}
      <div
        className="flex flex-col justify-center"
        style={{
          padding: "6rem 4rem",
          borderRight: "1px solid var(--rv-border)",
        }}
      >
        {/* Eyebrow */}
        <span
          className="rv-fade-up rv-eyebrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ color: "var(--rv-accent)", letterSpacing: "0.12em" }}
        >
          AI-Powered Resume Builder
        </span>

        {/* Headline */}
        <h1
          className="rv-fade-up rv-delay-1 font-serif mb-7"
          style={{
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--rv-ink)",
          }}
        >
          Your next job
          <br />
          starts with a
          <br />
          <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
            great résumé.
          </em>
        </h1>

        {/* Subtext */}
        <p
          className="rv-fade-up rv-delay-2 mb-12"
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "var(--rv-muted)",
            maxWidth: 420,
          }}
        >
          ResumeVerse uses GPT to craft compelling, ATS-optimized resumes in
          minutes. Pick a template, describe your experience, and let AI do the
          heavy lifting.
        </p>

        {/* Actions */}
        <div className="rv-fade-up rv-delay-3 flex items-center gap-5">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-semibold no-underline transition-all duration-200"
            style={{
              background: "var(--rv-accent)",
              color: "var(--rv-white)",
              padding: "0.9rem 2rem",
              borderRadius: 2,
              fontSize: "0.9375rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#a83a20";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--rv-accent)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Build my resume →
          </Link>
          <Link
            href="#templates"
            className="text-sm font-medium no-underline transition-all duration-200"
            style={{
              color: "var(--rv-muted)",
              borderBottom: "1px solid var(--rv-border)",
              paddingBottom: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--rv-ink)";
              e.currentTarget.style.borderColor = "var(--rv-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--rv-muted)";
              e.currentTarget.style.borderColor = "var(--rv-border)";
            }}
          >
            See templates
          </Link>
        </div>

        {/* Stats */}
        <div
          className="rv-fade-up rv-delay-4 flex gap-10 mt-16 pt-8"
          style={{ borderTop: "1px solid var(--rv-border)" }}
        >
          {[
            { num: "3", label: "Templates" },
            { num: "AI", label: "Powered" },
            { num: "PDF", label: "Export" },
          ].map((stat) => (
            <div key={stat.label}>
              <span
                className="font-serif block"
                style={{ fontSize: "2rem", color: "var(--rv-ink)" }}
              >
                {stat.num}
              </span>
              <span
                className="uppercase tracking-wider"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  color: "var(--rv-muted)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Resume Mock */}
      <div
        className="rv-fade-up rv-delay-5 relative flex items-center justify-center overflow-hidden"
        style={{ padding: "6rem 3rem", background: "var(--rv-cream)" }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(200,75,47,0.08) 0%, transparent 70%)",
          }}
        />
        <ResumeMock />
      </div>
    </section>
  );
}
