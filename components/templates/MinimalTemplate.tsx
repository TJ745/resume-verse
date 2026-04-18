import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function MinimalTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#8a8478",
    marginBottom: "0.6rem",
  };
  const LEFT = ["skills", "certifications", "education"];
  const left = sections.filter((s) => LEFT.includes(s.type));
  const right = sections.filter((s) => !LEFT.includes(s.type));
  return (
    <div style={{ ...WRAP, padding: "1.75rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "1.6rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.15rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
            {getJobTitle(resume)}
          </p>
        )}
        <div
          style={{ height: 1, background: "#d9d4c7", marginTop: "0.75rem" }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "1.5rem",
        }}
      >
        <div>
          {left.map((s) => (
            <div key={s.id}>{renderSection(s, h, accent)}</div>
          ))}
        </div>
        <div>
          {right.map((s) => (
            <div key={s.id}>{renderSection(s, h, accent)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
