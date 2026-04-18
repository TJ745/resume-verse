import { WRAP, SERIF, getName, getJobTitle, renderSection } from "./Shared";
import type { TplProps } from "./types";

export default function ElegantTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontFamily: SERIF,
    fontSize: "0.85rem",
    fontStyle: "italic",
    color: accent,
    borderBottom: "1px solid #d9d4c7",
    paddingBottom: "0.25rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={{ ...WRAP, padding: "2.5rem 3rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "2rem",
            color: "#0f0e0d",
            letterSpacing: "0.04em",
            marginBottom: "0.25rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.7rem",
              color: "#8a8478",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
        <div
          style={{
            width: 48,
            height: 1,
            background: accent,
            margin: "0.75rem auto 0",
          }}
        />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, h, accent)}</div>
      ))}
    </div>
  );
}
