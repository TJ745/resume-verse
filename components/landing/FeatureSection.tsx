"use client";

import { features } from "@/constants/features";

export default function FeaturesSection() {
  return (
    <section id="features" className="border-t border-rv-border px-16 py-32">
      {/* Header */}
      <div className="flex items-end justify-between mb-20">
        <div>
          <div className="uppercase font-semibold tracking-widest mb-4 text-xs text-rv-accent">
            Why ResumeVerse
          </div>
          <h2 className="font-serif tracking-tight text-7xl">
            Built for people who
            <br />
            <em className="italic text-rv-accent">mean business.</em>
          </h2>
        </div>
        <p className="text-right text-base text-rv-muted max-w-[320px]">
          Everything you need to land interviews — nothing you don&apos;t.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 border border-rv-border rounded-lg overflow-hidden">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group transition-colors duration-200 hover:bg-rv-cream px-10 py-12 border-r border-rv-border last:border-none"
          >
            <div className="font-serif mb-6 text-6xl text-rv-border">
              {feature.num}
            </div>
            <div className="flex items-center justify-center mb-6 w-10 h-10 rounded-sm bg-rv-ink">
              {feature.icon}
            </div>
            <h3 className="font-serif mb-3 tracking-tight text-3xl">
              {feature.title}
            </h3>
            <p className="text-base text-rv-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
