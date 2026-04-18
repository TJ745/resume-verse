import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function TechnicalTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    background: "#f5f3ef",
    padding: "0.2rem 0.5rem",
    marginBottom: "0.6rem",
    borderLeft: `3px solid ${accent}`,
  };
  return (
    <div style={{ ...WRAP, padding: "1.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #d9d4c7",
        }}
      >
        <div
          style={{ width: 4, height: 42, background: accent, flexShrink: 0 }}
        />
        <div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "1.55rem",
              color: "#0f0e0d",
              letterSpacing: "-0.02em",
              marginBottom: "0.1rem",
            }}
          >
            {getName(resume)}
          </h1>
          {getJobTitle(resume) && (
            <p style={{ fontSize: "0.67rem", color: accent, fontWeight: 500 }}>
              {getJobTitle(resume)}
            </p>
          )}
        </div>
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, h, accent)}</div>
      ))}
    </div>
  );
}
