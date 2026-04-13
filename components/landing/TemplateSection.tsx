"use client";

import { useState } from "react";
import { templates } from "@/constants/templates";

export default function TemplatesSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="templates"
      className="px-16 py-32 bg-rv-ink text-rv-paper border-t border-rv-border"
    >
      <div className="uppercase font-semibold tracking-widest mb-4 text-sm text-rv-accent-warm">
        Templates
      </div>
      <h2 className="font-serif tracking-tight text-6xl text-rv-paper">
        Three distinct styles.
        <br />
        <em className="italic text-rv-accent-warm">One great resume.</em>
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
              transform: active === i ? "translateY(-4px)" : "none",
            }}
          >
            {t.popular && (
              <div className="absolute uppercase font-bold tracking-widest -top-2.5 left-5 rounded bg-rv-accent text-rv-white text-xs px-2 py-0.5">
                Popular
              </div>
            )}
            <div className="h-[130px] mb-5">{t.preview}</div>
            <div className="font-medium tracking-wider text-sm text-[#c8c3b8]">
              {t.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
