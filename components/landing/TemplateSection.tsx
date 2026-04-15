"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/resume-constants";
import Link from "next/link";

const FREE_TEMPLATES = ["modern", "classic", "minimal"];

// Unique mini-preview per template
function TemplatePreview({ id }: { id: string }) {
  const accent = "#c84b2f";
  const ink = "#2e2c28";
  const muted = "#4a4845";

  switch (id) {
    case "modern":
      return (
        <div className="flex flex-col gap-1.5">
          <div
            style={{
              height: 4,
              background: accent,
              borderRadius: 1,
              width: "40%",
            }}
          />
          <div
            style={{
              height: 9,
              background: ink,
              borderRadius: 1,
              width: "85%",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "30%",
            }}
          />
          <div style={{ height: 6 }} />
          <div
            style={{
              height: 1,
              background: accent,
              width: "100%",
              marginBottom: 4,
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "75%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "100%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "60%",
            }}
          />
        </div>
      );
    case "classic":
      return (
        <div className="flex flex-col gap-1.5 items-center">
          <div
            style={{
              height: 10,
              background: ink,
              borderRadius: 1,
              width: "70%",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "45%",
            }}
          />
          <div
            style={{
              height: 1,
              background: ink,
              width: "100%",
              margin: "4px 0",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "60%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "80%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "50%",
            }}
          />
          <div
            style={{
              height: 1,
              background: ink,
              width: "100%",
              margin: "4px 0",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "75%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "100%",
            }}
          />
        </div>
      );
    case "minimal":
      return (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 6 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 8, background: ink, borderRadius: 1 }} />
            <div
              style={{
                height: 4,
                background: muted,
                borderRadius: 1,
                width: "80%",
              }}
            />
            <div style={{ height: 1, background: muted, marginTop: 2 }} />
            <div style={{ height: 4, background: muted, borderRadius: 1 }} />
            <div
              style={{
                height: 4,
                background: muted,
                borderRadius: 1,
                width: "70%",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 5, background: ink, borderRadius: 1 }} />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "85%",
              }}
            />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "60%",
              }}
            />
            <div style={{ height: 5, background: ink, borderRadius: 1 }} />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "75%",
              }}
            />
          </div>
        </div>
      );
    case "executive":
      return (
        <div className="flex flex-col gap-1.5">
          <div
            style={{
              height: 12,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "50%",
            }}
          />
          <div
            style={{
              height: 2,
              background: accent,
              width: "100%",
              margin: "4px 0",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "100%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "80%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "95%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "65%",
            }}
          />
        </div>
      );
    case "compact":
      return (
        <div className="flex flex-col gap-1">
          <div
            style={{
              height: 7,
              background: ink,
              borderRadius: 1,
              width: "70%",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "40%",
            }}
          />
          <div style={{ height: 1, background: muted, margin: "3px 0" }} />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "100%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "85%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "70%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "95%",
            }}
          />
          <div style={{ height: 1, background: muted, margin: "3px 0" }} />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "80%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "60%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
        </div>
      );
    case "creative":
      return (
        <div
          style={{ display: "grid", gridTemplateColumns: "0.6fr 1fr", gap: 0 }}
        >
          <div
            style={{
              background: "#1a1917",
              padding: "6px 5px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{ height: 8, background: "#c84b2f", borderRadius: 1 }}
            />
            <div
              style={{ height: 3, background: "#6b6560", borderRadius: 1 }}
            />
            <div
              style={{ height: 1, background: "#3a3835", margin: "2px 0" }}
            />
            <div
              style={{ height: 3, background: "#6b6560", borderRadius: 1 }}
            />
            <div
              style={{
                height: 3,
                background: "#6b6560",
                borderRadius: 1,
                width: "80%",
              }}
            />
          </div>
          <div
            style={{
              padding: "6px 5px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "90%",
              }}
            />
            <div style={{ height: 5, background: ink, borderRadius: 1 }} />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "70%",
              }}
            />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "85%",
              }}
            />
            <div
              style={{
                height: 5,
                background: ink,
                borderRadius: 1,
                width: "55%",
              }}
            />
          </div>
        </div>
      );
    case "elegant":
      return (
        <div className="flex flex-col gap-1.5 items-center">
          <div
            style={{
              height: 11,
              background: ink,
              borderRadius: 1,
              width: "65%",
              fontFamily: "serif",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "40%",
            }}
          />
          <div style={{ display: "flex", gap: 6, margin: "2px 0" }}>
            <div style={{ height: 1, background: accent, width: 20 }} />
            <div
              style={{
                height: 5,
                background: accent,
                borderRadius: "50%",
                width: 5,
              }}
            />
            <div
              style={{ height: 1, background: accent, width: 20, marginTop: 2 }}
            />
          </div>
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "85%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "70%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
        </div>
      );
    case "technical":
      return (
        <div className="flex flex-col gap-1.5">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: 8,
                background: ink,
                borderRadius: 1,
                width: "55%",
              }}
            />
            <div
              style={{
                height: 4,
                background: accent,
                borderRadius: 1,
                width: "25%",
              }}
            />
          </div>
          <div style={{ height: 1, background: "#3a3835", width: "100%" }} />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}
          >
            <div style={{ height: 4, background: ink, borderRadius: 1 }} />
            <div style={{ height: 4, background: ink, borderRadius: 1 }} />
            <div
              style={{
                height: 4,
                background: muted,
                borderRadius: 1,
                width: "80%",
              }}
            />
            <div
              style={{
                height: 4,
                background: muted,
                borderRadius: 1,
                width: "65%",
              }}
            />
          </div>
          <div style={{ height: 1, background: "#3a3835", width: "100%" }} />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
          <div
            style={{
              height: 4,
              background: ink,
              borderRadius: 1,
              width: "75%",
            }}
          />
        </div>
      );
    case "chronological":
      return (
        <div className="flex flex-col gap-1.5">
          <div
            style={{
              height: 9,
              background: ink,
              borderRadius: 1,
              width: "70%",
            }}
          />
          <div
            style={{
              height: 3,
              background: muted,
              borderRadius: 1,
              width: "35%",
            }}
          />
          <div style={{ height: 5 }} />
          {[100, 75, 90, 60].map((w, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === 0 ? accent : "#3a3835",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  height: 4,
                  background: i === 0 ? ink : muted,
                  borderRadius: 1,
                  width: `${w}%`,
                }}
              />
            </div>
          ))}
        </div>
      );
    case "bold":
      return (
        <div className="flex flex-col gap-1.5">
          <div
            style={{
              height: 14,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
          <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
            <div
              style={{
                height: 4,
                background: accent,
                borderRadius: 1,
                width: 30,
              }}
            />
            <div
              style={{
                height: 4,
                background: accent,
                borderRadius: 1,
                width: 24,
              }}
            />
          </div>
          <div
            style={{
              height: 2,
              background: ink,
              width: "100%",
              margin: "4px 0",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "100%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "80%",
            }}
          />
          <div
            style={{
              height: 5,
              background: ink,
              borderRadius: 1,
              width: "90%",
            }}
          />
        </div>
      );
    default:
      return (
        <div style={{ height: 80, background: "#2e2c28", borderRadius: 2 }} />
      );
  }
}

export default function TemplatesSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="templates"
      className="bg-rv-ink px-16 py-28 border-t border-[rgba(255,255,255,0.06)]"
    >
      {/* Header */}
      <div className="mb-16">
        <p className="uppercase text-rv-accent mb-4 text-sm tracking-widest font-bold">
          Templates
        </p>
        <h2 className="font-serif text-rv-paper tracking-tight mb-3 text-7xl">
          10 professional designs.
          <br />
          <em className="italic text-rv-accent">Switch anytime.</em>
        </h2>
        <p className="text-base max-w-110 text-[rgba(255,255,255,0.45)]">
          Modern, Classic, and Minimal are free. Unlock all 10 with Pro — switch
          templates without losing your content.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-6">
        {TEMPLATES.map((tmpl, i) => {
          const isLocked = !FREE_TEMPLATES.includes(tmpl.id);
          const isActive = active === i;

          return (
            <div
              key={tmpl.id}
              onClick={() => setActive(i)}
              className={`relative bg-[#141412] border ${isActive ? "border-rv-accent" : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)]"} p-5 rounded cursor-pointer transform ${isActive ? "-translate-y-0.5" : "none"} transition-transform duration-150 ease-in-out shadow ${isActive ? "shadow-lg shadow-[rgba(200,75,47,0.15)]" : "none"} `}
            >
              {/* PRO badge */}
              {isLocked && (
                <div className="absolute -top-2 right-2.5 text-[0.5rem] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-rv-accent text-white rounded-lg">
                  PRO
                </div>
              )}

              {/* Popular badge */}
              {tmpl.id === "modern" && (
                <div className="absolute -top-2 left-2.5 text-[0.5rem] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-[#2d5a3d] text-white rounded-lg">
                  Popular
                </div>
              )}

              {/* Mini preview */}
              <div className="h-32 mb-3.5 overflow-hidden">
                <TemplatePreview id={tmpl.id} />
              </div>

              {/* Label + description */}
              <div>
                <p
                  className={`text-xs font-semibold mb-0.5 ${isActive ? "text-rv-accent" : "text-[rgba(255,255,255,0.85)]"}`}
                >
                  {tmpl.label}
                </p>
                <p className="text-xs text-[rgba(255,255,255,0.35)]">
                  {tmpl.description}
                </p>
              </div>

              {/* Active tick */}
              {isActive && (
                <div className="absolute top-2 right-2.5 text-rv-accent text-xs font-bold">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-6 mt-12">
        <Link
          href="/register"
          className="inline-block px-7 py-3 bg-rv-accent text-white rounded font-bold text-sm"
        >
          Start building free →
        </Link>
        <Link
          href="/pricing"
          className="text-sm text-[rgba(255,255,255,0.45)] border-b border-[rgba(255,255,255,0.15)] pb-0.5"
        >
          See all Pro features
        </Link>
      </div>
    </section>
  );
}
