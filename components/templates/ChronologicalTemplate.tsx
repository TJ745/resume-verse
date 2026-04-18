import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function ChronologicalTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    marginBottom: "0.6rem",
  };
  return (
    <div style={{ ...WRAP, padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "1.65rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: "0.67rem", color: "#8a8478" }}>
            {getJobTitle(resume)}
          </p>
        )}
        <div style={{ display: "flex", gap: 4, marginTop: "0.5rem" }}>
          <div style={{ width: 24, height: 3, background: accent }} />
          <div
            style={{ width: 8, height: 3, background: accent, opacity: 0.4 }}
          />
          <div
            style={{ width: 4, height: 3, background: accent, opacity: 0.2 }}
          />
        </div>
      </div>
      <div style={{ borderLeft: "2px solid #e8e4dc", paddingLeft: "1rem" }}>
        {sections.map((s) => (
          <div key={s.id} style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-1.35rem",
                top: "0.15rem",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accent,
                border: "2px solid #fdfcfa",
              }}
            />
            {renderSection(s, h, accent)}
          </div>
        ))}
      </div>
    </div>
  );
}
