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
import { COLOR_SCHEMES } from "@/lib/resume-constants";

// ── Helpers ───────────────────────────────────────────────

export function getAccent(schemeId?: string): string {
  return COLOR_SCHEMES.find((s) => s.id === schemeId)?.accent ?? "#c84b2f";
}
export function getName(resume: ResumeData): string {
  return resume.personalInfo?.fullName || "Your Name";
}
export function getJobTitle(resume: ResumeData): string {
  return resume.personalInfo?.jobTitle || resume.jobTitle || "";
}

// ── Base font/size constants ──────────────────────────────

export const FONT = "'DM Sans', sans-serif";
export const SERIF = "'Instrument Serif', serif";
export const INK = "#0f0e0d";
export const MUTED = "#8a8478";
export const BODY = "#3a3835";
export const BORDER = "#d9d4c7";
export const PAPER = "#fdfcfa";

export const fs = {
  label: "0.6rem",
  body: "0.67rem",
  title: "0.72rem",
} as const;

// ── Base wrapper ──────────────────────────────────────────

export const WRAP: React.CSSProperties = {
  fontFamily: FONT,
  background: PAPER,
  padding: "2rem",
  minHeight: "100%",
  fontSize: "11px",
};

// ── SectionBlock ──────────────────────────────────────────

export function SectionBlock({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: "1.1rem" }}>{children}</div>;
}

// ── renderSection ─────────────────────────────────────────
// One shared renderer for all section types used by every template.

export function renderSection(
  section: ResumeSection,
  headingStyle: React.CSSProperties,
  accent: string,
): React.ReactNode {
  switch (section.type) {
    case "summary": {
      const c = section.content as SummaryContent;
      if (!c?.text) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          <p style={{ fontSize: fs.body, lineHeight: 1.6, color: BODY }}>
            {c.text}
          </p>
        </SectionBlock>
      );
    }
    case "experience": {
      const items = section.content as ExperienceItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "0.7rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {exp.role}
                </span>
                <span style={{ fontSize: fs.label, color: MUTED }}>
                  {exp.startDate}
                  {exp.startDate &&
                    (exp.current
                      ? " – Present"
                      : exp.endDate
                        ? ` – ${exp.endDate}`
                        : "")}
                </span>
              </div>
              <div
                style={{
                  fontSize: fs.body,
                  color: MUTED,
                  marginBottom: "0.25rem",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
              {(exp.bullets ?? []).filter(Boolean).map((b, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 5, marginBottom: "0.1rem" }}
                >
                  <span
                    style={{
                      color: accent,
                      fontSize: fs.label,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    •
                  </span>
                  <span
                    style={{ fontSize: fs.body, lineHeight: 1.55, color: BODY }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "education": {
      const items = section.content as EducationItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {edu.institution}
                </span>
                <span style={{ fontSize: fs.label, color: MUTED }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: MUTED }}>
                {edu.degree}
                {edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "skills": {
      const raw = section.content;
      const c: SkillsContent =
        raw &&
        typeof raw === "object" &&
        !Array.isArray(raw) &&
        "categories" in raw
          ? (raw as SkillsContent)
          : { categories: [] };
      if (!c.categories.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {c.categories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "0.3rem" }}>
              {cat.name && (
                <span
                  style={{ fontSize: fs.body, fontWeight: 600, color: INK }}
                >
                  {cat.name}:{" "}
                </span>
              )}
              <span style={{ fontSize: fs.body, color: BODY }}>
                {cat.skills}
              </span>
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "projects": {
      const items = section.content as ProjectItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {proj.name}
                </span>
                {proj.technologies && (
                  <span style={{ fontSize: fs.label, color: MUTED }}>
                    {proj.technologies}
                  </span>
                )}
              </div>
              {proj.description && (
                <p
                  style={{
                    fontSize: fs.body,
                    lineHeight: 1.55,
                    color: BODY,
                    marginTop: "0.1rem",
                  }}
                >
                  {proj.description}
                </p>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "certifications": {
      const items = section.content as CertificationItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "0.35rem",
              }}
            >
              <div>
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span style={{ fontSize: fs.body, color: MUTED }}>
                    {" "}
                    · {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: fs.label, color: MUTED }}>
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "languages": {
      const items = section.content as LanguageItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "0.15rem 1rem" }}
          >
            {items.map((lang) => (
              <span key={lang.id} style={{ fontSize: fs.body, color: BODY }}>
                <span style={{ fontWeight: 600, color: INK }}>
                  {lang.language}
                </span>
                {lang.proficiency && (
                  <span style={{ color: MUTED }}>
                    {" · "}
                    {lang.proficiency}
                  </span>
                )}
              </span>
            ))}
          </div>
        </SectionBlock>
      );
    }
    case "awards": {
      const items = section.content as AwardItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((award) => (
            <div key={award.id} style={{ marginBottom: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {award.title}
                </span>
                {award.date && (
                  <span style={{ fontSize: fs.label, color: MUTED }}>
                    {award.date}
                  </span>
                )}
              </div>
              {award.issuer && (
                <div style={{ fontSize: fs.body, color: MUTED }}>
                  {award.issuer}
                </div>
              )}
              {award.description && (
                <p
                  style={{
                    fontSize: fs.body,
                    lineHeight: 1.55,
                    color: BODY,
                    marginTop: "0.1rem",
                  }}
                >
                  {award.description}
                </p>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    case "volunteer": {
      const items = section.content as VolunteerItem[];
      if (!Array.isArray(items) || !items.length) return null;
      return (
        <SectionBlock>
          <div style={headingStyle}>{section.title}</div>
          {items.map((vol) => (
            <div key={vol.id} style={{ marginBottom: "0.7rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{ fontSize: fs.title, fontWeight: 600, color: INK }}
                >
                  {vol.role}
                  {vol.organization ? ` @ ${vol.organization}` : ""}
                </span>
                <span style={{ fontSize: fs.label, color: MUTED }}>
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
                    fontSize: fs.body,
                    lineHeight: 1.55,
                    color: BODY,
                    marginTop: "0.1rem",
                  }}
                >
                  {vol.description}
                </p>
              )}
            </div>
          ))}
        </SectionBlock>
      );
    }
    default:
      return null;
  }
}

// ── ContactLine ───────────────────────────────────────────

const iconSt: React.CSSProperties = {
  width: 7,
  height: 7,
  stroke: MUTED,
  fill: "none",
  strokeWidth: 1.5,
  flexShrink: 0,
  display: "inline-block",
};

function EmailIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconSt}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconSt}>
      <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function AddressIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconSt}>
      <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" style={{ ...iconSt, stroke: "none", fill: MUTED }}>
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-.75-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" style={{ ...iconSt, stroke: "none", fill: MUTED }}>
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
function WebsiteIcon() {
  return (
    <svg viewBox="0 0 16 16" style={iconSt}>
      <circle cx="8" cy="8" r="7" />
      <path d="M1 8h14M8 1a10 10 0 0 0 0 14M8 1a10 10 0 0 1 0 14" />
    </svg>
  );
}

export function ContactLine({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;
  const items: { icon: React.ReactNode; text: string }[] = [];
  if (info.email) items.push({ icon: <EmailIcon />, text: info.email });
  if (info.phone) items.push({ icon: <PhoneIcon />, text: info.phone });
  if (info.showAddress && info.address)
    items.push({ icon: <AddressIcon />, text: info.address });
  if (info.linkedin)
    items.push({ icon: <LinkedInIcon />, text: info.linkedin });
  if (info.github) items.push({ icon: <GitHubIcon />, text: info.github });
  if (info.showWebsite && info.website)
    items.push({ icon: <WebsiteIcon />, text: info.website });
  if (!items.length) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.15rem 0.75rem",
        marginTop: "0.3rem",
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.58rem",
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          {item.icon}
          {item.text}
        </span>
      ))}
    </div>
  );
}

// ── Photo helper ──────────────────────────────────────────

export function PhotoCircle({
  photoUrl,
  accent,
  size = 52,
}: {
  photoUrl: string;
  accent: string;
  size?: number;
}) {
  return (
    <div
      style={{
        float: "right",
        marginLeft: 12,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: accent,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt="Profile"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
        }}
      />
    </div>
  );
}
