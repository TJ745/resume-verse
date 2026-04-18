import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function CompactTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.58rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: accent,
    borderBottom: `1px solid ${accent}`,
    paddingBottom: "0.15rem",
    marginBottom: "0.4rem",
  };
  return (
    <div style={{ ...WRAP, fontSize: "10px", padding: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1rem",
          paddingBottom: "0.6rem",
          borderBottom: "1px solid #d9d4c7",
        }}
      >
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "1.4rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.65rem", color: "#8a8478" }}>
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
