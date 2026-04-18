import {
  WRAP,
  SERIF,
  getName,
  getJobTitle,
  ContactLine,
  renderSection,
} from "./Shared";
import type { TplProps } from "./types";

export default function ClassicTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#0f0e0d",
    borderBottom: "2px solid #0f0e0d",
    paddingBottom: "0.2rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={WRAP}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid #0f0e0d",
        }}
      >
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "1.7rem",
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: "0.67rem",
              color: "#8a8478",
              letterSpacing: "0.06em",
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
        <ContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, h, accent)}</div>
      ))}
    </div>
  );
}
