"use client";

import { plans } from "@/constants/plans";
import Link from "next/link";
import { useState } from "react";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="px-16 py-28 bg-rv-paper border-t border-rv-border"
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-rv-accent mb-3">
            Pricing
          </p>
          <h2 className="font-serif text-rv-ink mb-4 text-5xl">
            Simple, honest pricing.
          </h2>
          <p className="text-base text-rv-muted max-w-120 m-auto">
            Start free. Upgrade when you need the full toolkit. No hidden fees,
            cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {plans.map((plan) => {
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                style={{
                  border: isPro
                    ? "2px solid var(--rv-accent)"
                    : "1px solid var(--rv-border)",
                  borderRadius: 4,
                  background: isPro ? "var(--rv-ink)" : "var(--rv-white)",
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      background: "var(--rv-accent)",
                      color: "#fff",
                      borderRadius: 99,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isPro ? "rgba(255,255,255,0.5)" : "var(--rv-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    className="font-serif"
                    style={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: isPro ? "#fff" : "var(--rv-ink)",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: isPro
                        ? "rgba(255,255,255,0.45)"
                        : "var(--rv-muted)",
                    }}
                  >
                    /{plan.period}
                  </span>
                </div>

                {/* Desc */}
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: isPro ? "rgba(255,255,255,0.65)" : "var(--rv-muted)",
                    lineHeight: 1.55,
                    marginBottom: "1.75rem",
                  }}
                >
                  {plan.desc}
                </p>

                {/* CTA */}
                {isPro ? (
                  <ProCTAButton label={plan.cta} />
                ) : (
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "0.65rem 1rem",
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      marginBottom: "1.75rem",
                      background: "transparent",
                      color: "var(--rv-ink)",
                      border: "2px solid var(--rv-border)",
                    }}
                  >
                    {plan.cta}
                  </Link>
                )}

                {/* Divider */}
                <div
                  style={{
                    borderTop: `1px solid ${isPro ? "rgba(255,255,255,0.1)" : "var(--rv-border)"}`,
                    marginBottom: "1.25rem",
                  }}
                />

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.8rem",
                        color: isPro
                          ? "rgba(255,255,255,0.8)"
                          : "var(--rv-ink)",
                      }}
                    >
                      <CheckIcon pro={isPro} />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f, i) => (
                    <li
                      key={`x-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: "0.8rem",
                        color: "var(--rv-muted)",
                        opacity: 0.5,
                      }}
                    >
                      <XIcon />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-rv-muted mt-8">
          All plans include secure cloud storage. Pro billed monthly — cancel
          anytime. No credit card required for Free.
        </p>
      </div>
    </section>
  );
}

function CheckIcon({ pro }: { pro: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3.5 h-3.5 stroke-2 ${pro ? "stroke-rv-accent" : "stroke-rv-accent"} mt-0.5 fill-none shrink-0`}
    >
      <path d="M2.5 8l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-3.5 h-3.5 stroke-2 stroke-rv-muted mt-0.5 fill-none shrink-0"
    >
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function ProCTAButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Not logged in — send to register
        window.location.href = "/register?plan=pro";
      } else {
        setLoading(false);
      }
    } catch {
      window.location.href = "/register?plan=pro";
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`block w-full text-center px-4 py-2.5 mb-7 rounded font-bold text-sm text-white border border-rv-accent ${loading ? "bg-[rgba(200,75,47,0.7)] cursor-not-allowed" : "bg-rv-accent  cursor-pointer"}`}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
