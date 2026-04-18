import { FONT, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function CreativeTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const hLeft: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#ffffff",
    marginBottom: "0.6rem",
  };
  const hRight: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    marginBottom: "0.6rem",
  };
  const LEFT = ["skills", "certifications", "education"];
  const left = sections.filter((s) => LEFT.includes(s.type));
  const right = sections.filter((s) => !LEFT.includes(s.type));
  return (
    <div
      style={{
        fontFamily: FONT,
        display: "flex",
        minHeight: "100%",
        fontSize: "11px",
      }}
    >
      <div
        style={{
          width: "38%",
          background: accent,
          padding: "2rem 1.25rem",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "1.4rem",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "0.3rem",
            }}
          >
            {getName(resume)}
          </h1>
          {getJobTitle(resume) && (
            <p
              style={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "0.06em",
              }}
            >
              {getJobTitle(resume)}
            </p>
          )}
        </div>
        {left.map((s) => (
          <div key={s.id} style={{ color: "#fff" }}>
            {renderSection(s, hLeft, "#ffffff")}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "2rem 1.5rem", background: "#fdfcfa" }}>
        {right.map((s) => (
          <div key={s.id}>{renderSection(s, hRight, accent)}</div>
        ))}
      </div>
    </div>
  );
}
