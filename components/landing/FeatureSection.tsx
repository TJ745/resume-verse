"use client";

const features = [
  {
    num: "01",
    title: "AI Content Generation",
    description:
      "Describe your role and let GPT write polished, ATS-friendly bullet points tailored to the job you're targeting.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        style={{
          width: 20,
          height: 20,
          stroke: "var(--rv-paper)",
          fill: "none",
          strokeWidth: 1.5,
        }}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Multiple Templates",
    description:
      "Modern, Classic, and Minimal layouts. Switch templates without losing your content — every section is portable.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        style={{
          width: 20,
          height: 20,
          stroke: "var(--rv-paper)",
          fill: "none",
          strokeWidth: 1.5,
        }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "One-Click PDF Export",
    description:
      "Download a pixel-perfect PDF ready to attach to any application. No watermarks, no friction.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        style={{
          width: 20,
          height: 20,
          stroke: "var(--rv-paper)",
          fill: "none",
          strokeWidth: 1.5,
        }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: "8rem 4rem",
        borderTop: "1px solid var(--rv-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-20">
        <div>
          <div
            className="uppercase font-semibold tracking-widest mb-4"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              color: "var(--rv-accent)",
            }}
          >
            Why ResumeVerse
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Built for people who
            <br />
            <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
              mean business.
            </em>
          </h2>
        </div>
        <p
          className="text-right"
          style={{
            fontSize: "0.9375rem",
            color: "var(--rv-muted)",
            maxWidth: 320,
            lineHeight: 1.6,
          }}
        >
          Everything you need to land interviews — nothing you don&apos;t.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid var(--rv-border)",
        }}
      >
        {features.map((feature, i) => (
          <div
            key={feature.num}
            className="group transition-colors duration-200"
            style={{
              padding: "3rem 2.5rem",
              borderRight:
                i < features.length - 1 ? "1px solid var(--rv-border)" : "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--rv-cream)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              className="font-serif mb-6"
              style={{
                fontSize: "3.5rem",
                color: "var(--rv-border)",
                lineHeight: 1,
              }}
            >
              {feature.num}
            </div>
            <div
              className="flex items-center justify-center mb-6"
              style={{
                width: 42,
                height: 42,
                background: "var(--rv-ink)",
                borderRadius: 2,
              }}
            >
              {feature.icon}
            </div>
            <h3
              className="font-serif mb-3"
              style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "var(--rv-muted)",
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
