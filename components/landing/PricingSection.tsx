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
        <div className="grid grid-cols-2 gap-6 items-start">
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
                  <div className="absolute top-4 right-4 text-xs font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full bg-rv-accent text-white">
                    {plan.badge}
                  </div>
                )}

                {/* Plan name */}
                <p
                  className={`text-xs font-bold tracking-widest uppercase mb-2 ${isPro ? "text-[rgba(255,255,255,0.5)]" : "text-rv-muted"}`}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`font-serif text-5xl font-bold ${isPro ? "text-white" : "text-rv-ink"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${isPro ? "text-[rgba(255,255,255,0.45)]" : "text-rv-muted"}`}
                  >
                    /{plan.period}
                  </span>
                </div>

                {/* Desc */}
                <p
                  className={`text-sm mb-7 ${isPro ? "text-[rgba(255,255,255,0.65)]" : "text-rv-muted"}`}
                >
                  {plan.desc}
                </p>

                {/* CTA */}
                {isPro ? (
                  <ProCTAButton label={plan.cta} />
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className="block text-center px-4 py-2.5 rounded font-bold text-sm mb-7 bg-transparent border border-rv-border text-rv-ink"
                  >
                    {plan.cta}
                  </Link>
                )}

                {/* Divider */}
                <div
                  className={`mb-5 border-t ${isPro ? "border-[rgba(255,255,255,0.1)]" : "border-rv-border"}`}
                />

                {/* Features */}
                <ul className="flex flex-col gap-2">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm ${isPro ? "text-[rgba(255,255,255,0.8)]" : "text-rv-ink"}`}
                    >
                      <CheckIcon pro={isPro} />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable.map((f, i) => (
                    <li
                      key={`x-${i}`}
                      className="flex items-start gap-2 text-sm text-rv-muted"
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
      className={`w-4 h-4 stroke-2 mt-0.5 fill-none shrink-0 ${pro ? "stroke-rv-accent" : "stroke-rv-accent"} `}
    >
      <path d="M2.5 8l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-4 h-4 stroke-2 stroke-rv-muted mt-0.5 fill-none shrink-0"
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
      className={`block w-full text-center px-4 py-2.5 mb-7 rounded font-bold text-sm text-white border border-rv-accent ${loading ? "bg-[rgba(200,75,47,0.7)] cursor-not-allowed" : "bg-rv-accent cursor-pointer"}`}
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
