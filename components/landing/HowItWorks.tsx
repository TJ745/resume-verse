"use client";

import { steps } from "@/constants/steps";

export default function HowItWorks() {
  return (
    <section id="how" className="px-16 py-32 border-t border-rv-border">
      <div className="uppercase font-semibold tracking-widest mb-4 text-xs text-rv-accent">
        How it works
      </div>
      <h2 className="font-serif text-6xl tracking-tight">
        From blank page to
        <br />
        <em className="italic text-rv-accent">dream job</em> in 4 steps.
      </h2>

      <div className="grid mt-20 grid-cols-4 border border-rv-border">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`relative px-8 py-12 ${i < steps.length - 1 ? "border-r" : ""} border-rv-border`}
          >
            <div className="font-serif mb-6 text-6xl text-rv-cream">
              {step.num}
            </div>

            {/* Arrow connector (not on last step) */}
            {i < steps.length - 1 && (
              <div className="absolute flex items-center justify-center top-12 -right-3 w-6 h-6 bg-rv-paper border border-rv-border rounded-full z-1 text-xs text-rv-muted">
                →
              </div>
            )}

            <h3 className="font-serif mb-3 text-3xl tracking-tight">
              {step.title}
            </h3>
            <p className="text-sm text-rv-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
