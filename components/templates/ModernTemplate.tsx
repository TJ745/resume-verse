import {
  WRAP,
  SERIF,
  getName,
  getJobTitle,
  ContactLine,
  PhotoCircle,
  renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ModernTemplate({ resume, sections, accent }: TplProps) {
  const h: React.CSSProperties = {
    fontSize: "0.6em",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
    borderBottom: `1px solid ${accent}`,
    paddingBottom: "0.2rem",
    marginBottom: "0.6rem",
  };
  return (
    <div style={WRAP}>
      <div
        style={{ height: 3, background: accent, margin: "-2rem -2rem 1.25rem" }}
      />
      <div style={{ marginBottom: "1.25rem" }}>
        {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
          <PhotoCircle
            photoUrl={resume.personalInfo.photoUrl}
            accent={accent}
            size={52}
          />
        )}
        <Styleable
          elementKey="name"
          tag="h1"
          style={{
            fontFamily: SERIF,
            fontSize: "1.6em",
            color: "#0f0e0d",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "0.2rem",
          }}
        >
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable
            elementKey="jobTitle"
            tag="p"
            style={{
              fontSize: "0.65em",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: accent,
            }}
          >
            {getJobTitle(resume)}
          </Styleable>
        )}
        <ContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, h, accent)}</div>
      ))}
    </div>
  );
}
