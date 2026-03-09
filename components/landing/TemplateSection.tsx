"use client";

import { useState } from "react";

const templates = [
  {
    name: "Modern",
    popular: true,
    preview: (
      <div className="flex flex-col gap-1.5">
        <div
          style={{
            height: 6,
            background: "#c84b2f",
            borderRadius: 1,
            width: "60%",
          }}
        />
        <div
          style={{
            height: 10,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 4,
            background: "#2e2c28",
            borderRadius: 1,
            width: "30%",
          }}
        />
        <div style={{ height: 8 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "45%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
      </div>
    ),
  },
  {
    name: "Classic",
    popular: false,
    preview: (
      <div className="flex flex-col gap-1.5">
        <div
          style={{
            height: 12,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 4,
            background: "#2e2c28",
            borderRadius: 1,
            width: "30%",
          }}
        />
        <div style={{ height: 1, background: "#2e2c28", margin: "4px 0" }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "45%",
          }}
        />
        <div style={{ height: 4 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
      </div>
    ),
  },
  {
    name: "Minimal",
    popular: false,
    preview: (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          alignContent: "start",
        }}
      >
        <div
          style={{
            gridColumn: "1/-1",
            height: 10,
            background: "#2e2c28",
            borderRadius: 1,
          }}
        />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "55%",
          }}
        />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
      </div>
    ),
  },
];

export default function TemplatesSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="templates"
      style={{
        padding: "8rem 4rem",
        background: "var(--rv-ink)",
        color: "var(--rv-paper)",
        borderTop: "1px solid var(--rv-border)",
      }}
    >
      <div
        className="uppercase font-semibold tracking-widest mb-4"
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          color: "var(--rv-accent-warm)",
        }}
      >
        Templates
      </div>
      <h2
        className="font-serif"
        style={{
          fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--rv-paper)",
        }}
      >
        Three distinct styles.
        <br />
        <em style={{ fontStyle: "italic", color: "var(--rv-accent-warm)" }}>
          One great resume.
        </em>
      </h2>

      <div className="flex gap-8 mt-16 overflow-x-auto pb-4">
        {templates.map((t, i) => (
          <div
            key={t.name}
            onClick={() => setActive(i)}
            className="relative cursor-pointer transition-all duration-200"
            style={{
              flex: "0 0 220px",
              background: "#1a1917",
              border: `1px solid ${active === i ? "var(--rv-accent-warm)" : "#2e2c28"}`,
              padding: "1.75rem",
              borderRadius: 0,
              transform: active === i ? "translateY(-4px)" : "none",
            }}
          >
            {t.popular && (
              <div
                className="absolute uppercase font-bold tracking-widest"
                style={{
                  top: -10,
                  left: "1.25rem",
                  background: "var(--rv-accent)",
                  color: "var(--rv-white)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  padding: "0.25rem 0.6rem",
                }}
              >
                Popular
              </div>
            )}
            <div style={{ height: 130, marginBottom: "1.25rem" }}>
              {t.preview}
            </div>
            <div
              className="font-medium tracking-wide"
              style={{
                fontSize: "0.8125rem",
                color: "#c8c3b8",
                letterSpacing: "0.04em",
              }}
            >
              {t.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
