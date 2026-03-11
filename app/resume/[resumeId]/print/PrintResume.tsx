import { COLOR_SCHEMES } from "@/lib/resume-constants";
import type {
  ResumeData,
  ResumeSection,
  PersonalInfo,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillsContent,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AwardItem,
  VolunteerItem,
} from "@/types/resume";

interface PrintResumeProps {
  resume: ResumeData;
}

function getName(resume: ResumeData): string {
  return (
    resume.personalInfo?.fullName ||
    (resume.title !== "Untitled Resume" ? resume.title : "") ||
    "Your Name"
  );
}

function getJobTitle(resume: ResumeData): string {
  return resume.personalInfo?.jobTitle || resume.jobTitle || "";
}

interface ContactItem {
  icon: string;
  text: string;
}

function getContactItems(info: PersonalInfo | null): ContactItem[] {
  if (!info) return [];
  const items: ContactItem[] = [];
  if (info.email) items.push({ icon: "email", text: info.email });
  if (info.phone) items.push({ icon: "phone", text: info.phone });
  if (info.showAddress && info.address)
    items.push({ icon: "address", text: info.address });
  if (info.linkedin) items.push({ icon: "linkedin", text: info.linkedin });
  if (info.github) items.push({ icon: "github", text: info.github });
  if (info.showWebsite && info.website)
    items.push({ icon: "website", text: info.website });
  return items;
}

function PrintContactLine({ info }: { info: PersonalInfo | null }) {
  const items = getContactItems(info);
  if (!items.length) return null;

  const iconPath: Record<string, React.ReactNode> = {
    email: (
      <>
        <rect x="1" y="3" width="14" height="10" rx="1.5" />
        <path d="M1 4l7 5 7-5" />
      </>
    ),
    phone: (
      <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
    ),
    address: (
      <>
        <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
        <circle cx="8" cy="6" r="1.5" />
      </>
    ),
    website: (
      <>
        <circle cx="8" cy="8" r="7" />
        <path d="M1 8h14M8 1a10 10 0 0 0 0 14M8 1a10 10 0 0 1 0 14" />
      </>
    ),
    linkedin: null,
    github: null,
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2px 10px",
        marginTop: 3,
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 7,
            color: "#8a8478",
          }}
        >
          {item.icon === "linkedin" ? (
            <svg
              viewBox="0 0 16 16"
              style={{ width: 7, height: 7, fill: "#8a8478", flexShrink: 0 }}
            >
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-.75-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
            </svg>
          ) : item.icon === "github" ? (
            <svg
              viewBox="0 0 16 16"
              style={{ width: 7, height: 7, fill: "#8a8478", flexShrink: 0 }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              style={{
                width: 7,
                height: 7,
                stroke: "#8a8478",
                fill: "none",
                strokeWidth: 1.5,
                flexShrink: 0,
              }}
            >
              {iconPath[item.icon]}
            </svg>
          )}
          {item.text}
        </span>
      ))}
    </div>
  );
}

export default function PrintResume({ resume }: PrintResumeProps) {
  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
  const accent =
    COLOR_SCHEMES.find((s) => s.id === resume.colorScheme)?.accent ?? "#c84b2f";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{getName(resume)}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            width: 210mm;
            min-height: 297mm;
            font-family: 'DM Sans', sans-serif;
            background: #ffffff;
            color: #0f0e0d;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page { size: A4; margin: 0; }
          @media print { html, body { width: 210mm; min-height: 297mm; } }
          .serif { font-family: 'Instrument Serif', serif; }
          .page { width: 210mm; min-height: 297mm; padding: 14mm 16mm; }
        `}</style>
      </head>
      <body>
        <div className="page">
          {resume.template === "classic" && (
            <ClassicLayout resume={resume} sections={sorted} accent={accent} />
          )}
          {resume.template === "minimal" && (
            <MinimalLayout resume={resume} sections={sorted} accent={accent} />
          )}
          {resume.template !== "classic" && resume.template !== "minimal" && (
            <ModernLayout resume={resume} sections={sorted} accent={accent} />
          )}
        </div>
      </body>
    </html>
  );
}

// ── Shared section renderer ───────────────────────────────

function renderSection(
  section: ResumeSection,
  template: string,
  accent: string,
) {
  const inkColor = "#0f0e0d";
  const mutedColor = "#8a8478";
  const bodyColor = "#3a3835";

  const headingStyle: React.CSSProperties =
    template === "classic"
      ? {
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: inkColor,
          borderBottom: `2px solid ${inkColor}`,
          paddingBottom: 2,
          marginBottom: 6,
        }
      : template === "minimal"
        ? {
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: mutedColor,
            marginBottom: 6,
          }
        : {
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent,
            borderBottom: `1px solid ${accent}`,
            paddingBottom: 2,
            marginBottom: 6,
          };

  const mb = { marginBottom: 14 };

  switch (section.type) {
    case "summary": {
      const c = section.content as SummaryContent;
      if (!c.text) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          <p style={{ fontSize: 8.5, lineHeight: 1.6, color: bodyColor }}>
            {c.text}
          </p>
        </div>
      );
    }

    case "experience": {
      const items = section.content as ExperienceItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 9 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {exp.role}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {exp.startDate}
                  {exp.startDate &&
                    (exp.current
                      ? " – Present"
                      : exp.endDate
                        ? ` – ${exp.endDate}`
                        : "")}
                </span>
              </div>
              <div style={{ fontSize: 8, color: mutedColor, marginBottom: 3 }}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 5, marginBottom: 2 }}
                >
                  <span
                    style={{
                      color: accent,
                      fontSize: 7,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    •
                  </span>
                  <span
                    style={{ fontSize: 8, lineHeight: 1.55, color: bodyColor }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    case "education": {
      const items = section.content as EducationItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {edu.institution}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 8, color: mutedColor }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "skills": {
      const c = section.content as SkillsContent;
      if (!c.categories?.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {c.categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 4 }}>
              {cat.name && (
                <span style={{ fontSize: 8, fontWeight: 600, color: inkColor }}>
                  {cat.name}:{" "}
                </span>
              )}
              <span style={{ fontSize: 8, color: bodyColor }}>
                {cat.skills}
              </span>
            </div>
          ))}
        </div>
      );
    }

    case "projects": {
      const items = section.content as ProjectItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {proj.name}
                </span>
                {proj.technologies && (
                  <span style={{ fontSize: 7.5, color: mutedColor }}>
                    {proj.technologies}
                  </span>
                )}
              </div>
              {proj.description && (
                <p
                  style={{
                    fontSize: 8,
                    lineHeight: 1.55,
                    color: bodyColor,
                    marginTop: 2,
                  }}
                >
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "certifications": {
      const items = section.content as CertificationItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 5,
              }}
            >
              <div>
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span style={{ fontSize: 8, color: mutedColor }}>
                    {" "}
                    · {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "languages": {
      const items = section.content as LanguageItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {items.map((lang) => (
              <span key={lang.id} style={{ fontSize: 8, color: bodyColor }}>
                <span style={{ fontWeight: 600, color: inkColor }}>
                  {lang.language}
                </span>
                {lang.proficiency ? ` · ${lang.proficiency}` : ""}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case "awards": {
      const items = section.content as AwardItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((award) => (
            <div key={award.id} style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {award.title}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {award.date}
                </span>
              </div>
              {award.issuer && (
                <div style={{ fontSize: 8, color: mutedColor }}>
                  {award.issuer}
                </div>
              )}
              {award.description && (
                <p
                  style={{
                    fontSize: 8,
                    lineHeight: 1.55,
                    color: bodyColor,
                    marginTop: 2,
                  }}
                >
                  {award.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    case "volunteer": {
      const items = section.content as VolunteerItem[];
      if (!items.length) return null;
      return (
        <div style={mb}>
          <div style={headingStyle}>{section.title}</div>
          {items.map((vol) => (
            <div key={vol.id} style={{ marginBottom: 7 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 600, color: inkColor }}>
                  {vol.role} @ {vol.organization}
                </span>
                <span style={{ fontSize: 7.5, color: mutedColor }}>
                  {vol.startDate}
                  {vol.startDate &&
                    (vol.current
                      ? " – Present"
                      : vol.endDate
                        ? ` – ${vol.endDate}`
                        : "")}
                </span>
              </div>
              {vol.description && (
                <p
                  style={{
                    fontSize: 8,
                    lineHeight: 1.55,
                    color: bodyColor,
                    marginTop: 2,
                  }}
                >
                  {vol.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Shared layout props ───────────────────────────────────

interface LayoutProps {
  resume: ResumeData;
  sections: ResumeSection[];
  accent: string;
}

// ── Modern layout ─────────────────────────────────────────

function ModernLayout({ resume, sections, accent }: LayoutProps) {
  return (
    <>
      <div
        style={{
          height: 4,
          background: accent,
          margin: "-14mm -16mm 14px",
          width: "calc(100% + 32mm)",
        }}
      />
      <div style={{ marginBottom: 16 }}>
        {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resume.personalInfo.photoUrl}
            alt="Profile"
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              float: "right",
              marginLeft: 10,
            }}
          />
        )}
        <h1
          className="serif"
          style={{
            fontSize: 26,
            color: "#0f0e0d",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 3,
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: accent,
              marginBottom: 2,
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
        <PrintContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, "modern", accent)}</div>
      ))}
    </>
  );
}

// ── Classic layout ────────────────────────────────────────

function ClassicLayout({ resume, sections, accent }: LayoutProps) {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "2px solid #0f0e0d",
        }}
      >
        <h1
          className="serif"
          style={{
            fontSize: 26,
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: 3,
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p
            style={{
              fontSize: 8,
              color: "#8a8478",
              letterSpacing: "0.06em",
              marginBottom: 2,
            }}
          >
            {getJobTitle(resume)}
          </p>
        )}
        <PrintContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, "classic", accent)}</div>
      ))}
    </>
  );
}

// ── Minimal layout ────────────────────────────────────────

function MinimalLayout({ resume, sections, accent }: LayoutProps) {
  const leftSections = sections.filter((s) =>
    ["skills", "certifications", "education", "languages"].includes(s.type),
  );
  const rightSections = sections.filter(
    (s) =>
      !["skills", "certifications", "education", "languages"].includes(s.type),
  );

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <h1
          className="serif"
          style={{
            fontSize: 24,
            color: "#0f0e0d",
            letterSpacing: "-0.02em",
            marginBottom: 2,
          }}
        >
          {getName(resume)}
        </h1>
        {getJobTitle(resume) && (
          <p style={{ fontSize: 8.5, color: "#8a8478", marginBottom: 2 }}>
            {getJobTitle(resume)}
          </p>
        )}
        <PrintContactLine info={resume.personalInfo} />
        <div style={{ height: 1, background: "#d9d4c7" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <div>
          {leftSections.map((s) => (
            <div key={s.id}>{renderSection(s, "minimal", accent)}</div>
          ))}
        </div>
        <div>
          {rightSections.map((s) => (
            <div key={s.id}>{renderSection(s, "minimal", accent)}</div>
          ))}
        </div>
      </div>
    </>
  );
}
