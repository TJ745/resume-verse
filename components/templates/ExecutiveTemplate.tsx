import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function ExecutiveTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    marginBottom: "0.5rem",
    paddingBottom: "0.2rem",
    borderBottom: `2px solid ${accent}`,
  };
  return (
    <div style={{ ...WRAP, padding: "2.5rem" }}>
      <div
        style={{
          marginBottom: "1.75rem",
          paddingBottom: "1.25rem",
          borderBottom: `3px solid ${accent}`,
        }}
      >
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "1.9rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.3rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.72rem",
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, h, accent)}</div>
      ))}
    </div>
  );
}
