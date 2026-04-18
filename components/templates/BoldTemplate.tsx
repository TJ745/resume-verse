import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function BoldTemplate({ resume, sections, accent }: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    marginBottom: "0.55rem",
    paddingBottom: "0.2rem",
    borderBottom: "2px solid #0f0e0d",
  };
  return (
    <div style={{ ...WRAP, padding: "0" }}>
      <div style={{ background: "#0f0e0d", padding: "1.75rem 2rem" }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "2rem",
            color: "#ffffff",
            letterSpacing: "-0.01em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.7rem",
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
      </div>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "1.5rem 2rem" }}>
        {sections.map((s) => (
          <div key={s.id}>{renderSection(s, h, accent)}</div>
        ))}
      </div>
    </div>
  );
}
