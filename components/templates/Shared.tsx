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
import { DraggableSection } from "@/components/builder/DragContext";
import { Styleable } from "@/components/builder/StyleContext";

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
// FONT and SERIF are used for specific accent elements (headers, serif labels).
// The base body font-family and font-size are set by ResumePreview's wrapper div,
// which reads resume.font and resume.fontSize — DO NOT set fontFamily or fontSize
// on WRAP, as that would override the user's selection.

// ── SectionBlock ──────────────────────────────────────────

export function SectionBlock({ children }: { children: React.ReactNode }) {
  return <div className="mb-[1.1rem]">{children}</div>;
}

// ── renderSection ─────────────────────────────────────────
// One shared renderer for all section types used by every template.
// Each section is wrapped in DraggableSection for drag-to-reorder.
// Headings and body text use Styleable for per-element font overrides.
// --accent CSS variable must be set on an ancestor element.

export function renderSection(
  section: ResumeSection,
  headingClass: string,
  inverted = false,
): React.ReactNode {
  const inner = (() => {
    switch (section.type) {
      case "summary": {
        const c = section.content as SummaryContent;
        if (!c?.text) return null;
        return (
          <SectionBlock>
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            <Styleable
              instanceId={`b:${section.id}`}
              className="text-[0.72em] leading-[1.6] text-rv-body"
              tag="p"
            >
              {c.text}
            </Styleable>
          </SectionBlock>
        );
      }
      case "experience": {
        const items = section.content as ExperienceItem[];
        if (!Array.isArray(items) || !items.length) return null;
        return (
          <SectionBlock>
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((exp) => (
              <div key={exp.id} className="mb-[0.7rem]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {exp.role}
                  </span>
                  <span className="text-[0.62em] text-rv-muted">
                    {exp.startDate}
                    {exp.startDate &&
                      (exp.current
                        ? " – Present"
                        : exp.endDate
                          ? ` – ${exp.endDate}`
                          : "")}
                  </span>
                </div>
                <Styleable
                  instanceId={`b:${section.id}`}
                  className="text-[0.72em] text-rv-muted mb-1"
                  tag="div"
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Styleable>
                {(exp.bullets ?? []).filter(Boolean).map((b, i) => (
                  <div key={i} className="flex gap-1.25 mb-[0.1rem]">
                    <span className="text-accent text-[0.62em] shrink-0 pt-px">
                      •
                    </span>
                    <Styleable
                      instanceId={`b:${section.id}`}
                      className="text-[0.72em] leading-[1.55] text-rv-body"
                      tag="span"
                    >
                      {b}
                    </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((edu) => (
              <div key={edu.id} className="mb-[0.55rem]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {edu.institution}
                  </span>
                  <span className="text-[0.62em] text-rv-muted">
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : ""}
                  </span>
                </div>
                <Styleable
                  instanceId={`b:${section.id}`}
                  className="text-[0.72em] text-rv-muted"
                  tag="div"
                >
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {c.categories.map((cat) => (
              <div key={cat.id} className="mb-[0.3rem]">
                {cat.name && (
                  <span className="text-[0.72em] font-semibold text-rv-ink">
                    {cat.name}:{" "}
                  </span>
                )}
                <Styleable
                  instanceId={`b:${section.id}`}
                  className="text-[0.72em] text-rv-body"
                  tag="span"
                >
                  {cat.skills}
                </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((proj) => (
              <div key={proj.id} className="mb-[0.55rem]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {proj.name}
                  </span>
                  {proj.technologies && (
                    <span className="text-[0.62em] text-rv-muted">
                      {proj.technologies}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <Styleable
                    instanceId={`b:${section.id}`}
                    className="text-[0.72em] leading-[1.55] text-rv-body mt-[0.1rem]"
                    tag="p"
                  >
                    {proj.description}
                  </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((cert) => (
              <div
                key={cert.id}
                className="flex justify-between items-baseline mb-[0.35rem]"
              >
                <div>
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <Styleable
                      instanceId={`b:${section.id}`}
                      className="text-[0.72em] text-rv-muted"
                      tag="span"
                    >
                      {" "}
                      · {cert.issuer}
                    </Styleable>
                  )}
                </div>
                {cert.date && (
                  <span className="text-[0.62em] text-rv-muted">
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            <div className="flex flex-wrap gap-y-[0.15rem] gap-x-4">
              {items.map((lang) => (
                <Styleable
                  key={lang.id}
                  instanceId={`b:${section.id}`}
                  className="text-[0.72em] text-rv-body"
                  tag="span"
                >
                  <span className="font-semibold text-rv-ink">
                    {lang.language}
                  </span>
                  {lang.proficiency && (
                    <span className="text-rv-muted">
                      {" · "}
                      {lang.proficiency}
                    </span>
                  )}
                </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((award) => (
              <div key={award.id} className="mb-[0.55rem]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {award.title}
                  </span>
                  {award.date && (
                    <span className="text-[0.62em] text-rv-muted">
                      {award.date}
                    </span>
                  )}
                </div>
                {award.issuer && (
                  <Styleable
                    instanceId={`b:${section.id}`}
                    className="text-[0.72em] text-rv-muted"
                    tag="div"
                  >
                    {award.issuer}
                  </Styleable>
                )}
                {award.description && (
                  <Styleable
                    instanceId={`b:${section.id}`}
                    className="text-[0.72em] leading-[1.55] text-rv-body mt-[0.1rem]"
                    tag="p"
                  >
                    {award.description}
                  </Styleable>
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
            <Styleable
              instanceId={`h:${section.id}`}
              className={headingClass}
              tag="div"
            >
              {section.title}
            </Styleable>
            {items.map((vol) => (
              <div key={vol.id} className="mb-[0.7rem]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.78em] font-semibold text-rv-ink">
                    {vol.role}
                    {vol.organization ? ` @ ${vol.organization}` : ""}
                  </span>
                  <span className="text-[0.62em] text-rv-muted">
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
                  <Styleable
                    instanceId={`b:${section.id}`}
                    className="text-[0.72em] leading-[1.55] text-rv-body mt-[0.1rem]"
                    tag="p"
                  >
                    {vol.description}
                  </Styleable>
                )}
              </div>
            ))}
          </SectionBlock>
        );
      }
      default:
        return null;
    }
  })();

  if (!inner) return null;

  return (
    <DraggableSection id={section.id} inverted={inverted}>
      {inner}
    </DraggableSection>
  );
}

// ── ContactLine ───────────────────────────────────────────

const iconCls =
  "size-[7px] stroke-rv-muted fill-none stroke-[1.5] shrink-0 inline-block";

function EmailIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls}>
      <path d="M3 2h3l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1C5.7 14 2 8.3 2 3a1 1 0 0 1 1-1z" />
    </svg>
  );
}
function AddressIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls}>
      <path d="M8 1a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-1.75 stroke-none fill-rv-muted shrink-0 inline-block"
    >
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM4 6H2.5v7H4V6zm-.75-1.25a.875.875 0 1 0 1.75 0 .875.875 0 0 0-1.75 0zM13.5 13h-1.5v-3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V13H7.5V6H9v.9C9.5 6.3 10.3 6 11 6c1.38 0 2.5 1.12 2.5 2.5V13z" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-1.75 stroke-none fill-rv-muted shrink-0 inline-block"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34C3.73 14.36 3.27 13 3.27 13c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
function WebsiteIcon() {
  return (
    <svg viewBox="0 0 16 16" className={iconCls}>
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
    <div className="flex flex-wrap gap-y-[0.15rem] gap-x-3 mt-[0.3rem]">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 text-[0.58em] text-rv-muted leading-[1.6]"
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
  size = 52,
}: {
  photoUrl: string;
  size?: number;
}) {
  return (
    <div
      className="float-right ml-3 shrink-0 rounded-full overflow-hidden bg-accent"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt="Profile"
        className="w-full h-full block object-cover"
      />
    </div>
  );
}
