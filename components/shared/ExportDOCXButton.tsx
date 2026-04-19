"use client";

import { useState } from "react";
import {
  COLOR_SCHEMES,
  RESUME_FONTS,
  FONT_SIZES,
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
} from "@/lib/resume-constants";
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

interface Props {
  resume: ResumeData;
  sections: ResumeSection[];
  isPro?: boolean;
  template?: string;
  colorScheme?: string;
  font?: string;
  fontSize?: string;
}

function hex(color: string) {
  return color.replace("#", "").toUpperCase();
}
function dateRange(start?: string, end?: string, current?: boolean) {
  const s = start || "";
  const e = current ? "Present" : end || "";
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

export default function ExportDOCXButton({
  resume,
  sections,
  isPro = false,
  template,
  colorScheme,
  font,
  fontSize,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState("");

  async function handleExport() {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        AlignmentType,
        BorderStyle,
        LevelFormat,
      } = await import("docx");

      // Use the live template/colorScheme props, fall back to resume object
      const activeTemplate = template ?? resume.template ?? "modern";
      const activeScheme = colorScheme ?? resume.colorScheme ?? "terracotta";
      const accent =
        COLOR_SCHEMES.find((s) => s.id === activeScheme)?.accent ?? "#c84b2f";
      const accentHex = hex(accent);

      // Font — map our font IDs to their best Word equivalents
      const fontId = font ?? resume.font ?? DEFAULT_FONT;
      const sizeId = fontSize ?? resume.fontSize ?? DEFAULT_FONT_SIZE;
      const fontDef =
        RESUME_FONTS.find((f) => f.id === fontId) ?? RESUME_FONTS[0];
      const sizeDef = FONT_SIZES.find((s) => s.id === sizeId) ?? FONT_SIZES[2];

      // Word-compatible font name (Google Fonts don't work in DOCX — use close equivalents)
      const DOCX_FONT_MAP: Record<string, string> = {
        "dm-sans": "Calibri",
        inter: "Calibri",
        lato: "Lato", // Lato IS available in Word on Windows
        raleway: "Trebuchet MS",
        playfair: "Georgia",
        cormorant: "Garamond",
      };
      const docxFont = DOCX_FONT_MAP[fontId] ?? "Calibri";

      // Scale base font size — DOCX uses half-points (size 20 = 10pt)
      // Base is 10pt body text; scale accordingly
      const baseBodyPt = Math.round(10 * sizeDef.scale); // e.g. 11pt at Large
      const baseBodyHalf = baseBodyPt * 2; // half-points for docx

      const sorted = [...sections].sort((a, b) => a.order - b.order);
      const info = resume.personalInfo;
      const name = info?.fullName || resume.title || "Resume";
      const jobTitle = info?.jobTitle || resume.jobTitle || "";

      // ── Shared helpers ───────────────────────────────────

      function body(
        text: string,
        opts: {
          bold?: boolean;
          italic?: boolean;
          size?: number;
          color?: string;
          font?: string;
        } = {},
      ) {
        return new TextRun({
          text,
          bold: opts.bold ?? false,
          italics: opts.italic ?? false,
          // opts.size overrides in half-points; otherwise use scaled base size
          size: opts.size !== undefined ? opts.size * 2 : baseBodyHalf,
          font: opts.font ?? docxFont,
          color: opts.color ?? "1A1A1A",
        });
      }

      function emptyLine(before = 0) {
        return new Paragraph({
          children: [new TextRun("")],
          spacing: { before, after: 0 },
        });
      }

      function bulletPara(text: string, color = accentHex) {
        return new Paragraph({
          numbering: { reference: "resume-bullets", level: 0 },
          children: [body(text)],
          spacing: { before: 20, after: 20 },
        });
      }

      function contactParts(info: PersonalInfo): string {
        const parts: string[] = [];
        if (info.email) parts.push(info.email);
        if (info.phone) parts.push(info.phone);
        if (info.showAddress && info.address) parts.push(info.address);
        if (info.linkedin) parts.push(info.linkedin);
        if (info.github) parts.push(info.github);
        if (info.showWebsite && info.website) parts.push(info.website);
        return parts.join("  ·  ");
      }

      // ── Section renderers (shared across all templates) ──

      function heading(
        text: string,
        style:
          | "accent-underline"
          | "bold-underline"
          | "plain-upper"
          | "left-bar",
      ) {
        if (style === "accent-underline") {
          return new Paragraph({
            children: [
              body(text.toUpperCase(), {
                bold: true,
                size: 9,
                color: accentHex,
              }),
            ],
            spacing: { before: 220, after: 60 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 4,
                color: accentHex,
                space: 2,
              },
            },
          });
        }
        if (style === "bold-underline") {
          return new Paragraph({
            children: [
              body(text.toUpperCase(), {
                bold: true,
                size: 9,
                color: "0F0E0D",
              }),
            ],
            spacing: { before: 220, after: 60 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: "0F0E0D",
                space: 2,
              },
            },
          });
        }
        if (style === "plain-upper") {
          return new Paragraph({
            children: [
              body(text.toUpperCase(), {
                bold: true,
                size: 9,
                color: "8A8478",
              }),
            ],
            spacing: { before: 220, after: 60 },
          });
        }
        // left-bar
        return new Paragraph({
          children: [
            body(text.toUpperCase(), { bold: true, size: 9, color: "0F0E0D" }),
          ],
          spacing: { before: 220, after: 60 },
          border: {
            left: {
              style: BorderStyle.SINGLE,
              size: 12,
              color: accentHex,
              space: 6,
            },
          },
          indent: { left: 120 },
        });
      }

      function renderSummary(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const text = (s.content as SummaryContent)?.text ?? "";
        if (!text.trim()) return [];
        return [
          heading(s.title, hStyle),
          new Paragraph({
            children: [body(text)],
            spacing: { before: 60, after: 60 },
          }),
        ];
      }

      function renderExperience(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as ExperienceItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: InstanceType<typeof Paragraph>[] = [
          heading(s.title, hStyle),
        ];
        for (const exp of items) {
          const left = [exp.role, exp.company].filter(Boolean).join(" · ");
          const right = dateRange(exp.startDate, exp.endDate, exp.current);
          paras.push(
            new Paragraph({
              children: [
                body(left, { bold: true }),
                ...(exp.location
                  ? [
                      body(`  ${exp.location}`, {
                        italic: true,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          if (right)
            paras.push(
              new Paragraph({
                children: [
                  body(right, { italic: true, size: 9, color: "777777" }),
                ],
                spacing: { before: 0, after: 40 },
              }),
            );
          for (const b of exp.bullets ?? [])
            if (b.trim()) paras.push(bulletPara(b));
        }
        return paras;
      }

      function renderEducation(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as EducationItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: InstanceType<typeof Paragraph>[] = [
          heading(s.title, hStyle),
        ];
        for (const edu of items) {
          const degree = [edu.degree, edu.field].filter(Boolean).join(", ");
          paras.push(
            new Paragraph({
              children: [
                body(edu.institution, { bold: true }),
                ...(degree ? [body(`  –  ${degree}`, { italic: true })] : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          const dr = dateRange(edu.startDate, edu.endDate);
          if (dr || edu.gpa)
            paras.push(
              new Paragraph({
                children: [
                  ...(dr
                    ? [body(dr, { italic: true, size: 9, color: "777777" })]
                    : []),
                  ...(edu.gpa
                    ? [
                        body(`  ·  GPA ${edu.gpa}`, {
                          size: 9,
                          color: "777777",
                        }),
                      ]
                    : []),
                ],
                spacing: { before: 0, after: 60 },
              }),
            );
        }
        return paras;
      }

      function renderSkills(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const cats = (s.content as SkillsContent)?.categories ?? [];
        if (!cats.length) return [];
        return [
          heading(s.title, hStyle),
          ...cats.map(
            (cat) =>
              new Paragraph({
                children: [
                  body(`${cat.name}:  `, { bold: true }),
                  body(cat.skills),
                ],
                spacing: { before: 60, after: 40 },
              }),
          ),
        ];
      }

      function renderProjects(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as ProjectItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: InstanceType<typeof Paragraph>[] = [
          heading(s.title, hStyle),
        ];
        for (const proj of items) {
          paras.push(
            new Paragraph({
              children: [
                body(proj.name || "Project", { bold: true }),
                ...(proj.technologies
                  ? [
                      body(`  ·  ${proj.technologies}`, {
                        italic: true,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          if (proj.description?.trim())
            paras.push(
              new Paragraph({
                children: [body(proj.description)],
                spacing: { before: 40, after: 60 },
              }),
            );
        }
        return paras;
      }

      function renderCertifications(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as CertificationItem[];
        if (!Array.isArray(items) || !items.length) return [];
        return [
          heading(s.title, hStyle),
          ...items.map(
            (cert) =>
              new Paragraph({
                children: [
                  body(cert.name, { bold: true }),
                  ...(cert.issuer
                    ? [body(`  –  ${cert.issuer}`, { color: "555555" })]
                    : []),
                  ...(cert.date
                    ? [
                        body(`  (${cert.date})`, {
                          italic: true,
                          size: 9,
                          color: "777777",
                        }),
                      ]
                    : []),
                ],
                spacing: { before: 80, after: 40 },
              }),
          ),
        ];
      }

      function renderLanguages(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as LanguageItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const runs = items.flatMap((lang, i) => [
          body(lang.language, { bold: true }),
          ...(lang.proficiency
            ? [body(` (${lang.proficiency})`, { color: "777777" })]
            : []),
          ...(i < items.length - 1
            ? [body("   ·   ", { color: "CCCCCC" })]
            : []),
        ]);
        return [
          heading(s.title, hStyle),
          new Paragraph({ children: runs, spacing: { before: 60, after: 60 } }),
        ];
      }

      function renderAwards(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as AwardItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: InstanceType<typeof Paragraph>[] = [
          heading(s.title, hStyle),
        ];
        for (const award of items) {
          paras.push(
            new Paragraph({
              children: [
                body(award.title, { bold: true }),
                ...(award.issuer
                  ? [body(`  –  ${award.issuer}`, { color: "555555" })]
                  : []),
                ...(award.date
                  ? [
                      body(`  (${award.date})`, {
                        italic: true,
                        size: 9,
                        color: "777777",
                      }),
                    ]
                  : []),
              ],
              spacing: { before: 100, after: 0 },
            }),
          );
          if (award.description?.trim())
            paras.push(
              new Paragraph({
                children: [body(award.description)],
                spacing: { before: 30, after: 60 },
              }),
            );
        }
        return paras;
      }

      function renderVolunteer(
        s: ResumeSection,
        hStyle: Parameters<typeof heading>[1],
      ) {
        const items = s.content as VolunteerItem[];
        if (!Array.isArray(items) || !items.length) return [];
        const paras: InstanceType<typeof Paragraph>[] = [
          heading(s.title, hStyle),
        ];
        for (const vol of items) {
          paras.push(
            new Paragraph({
              children: [
                body(vol.role || "Role", { bold: true }),
                ...(vol.organization
                  ? [body(`  ·  ${vol.organization}`, { italic: true })]
                  : []),
              ],
              spacing: { before: 120, after: 0 },
            }),
          );
          const dr = dateRange(vol.startDate, vol.endDate, vol.current);
          if (dr)
            paras.push(
              new Paragraph({
                children: [
                  body(dr, { italic: true, size: 9, color: "777777" }),
                ],
                spacing: { before: 0, after: 30 },
              }),
            );
          if (vol.description?.trim())
            paras.push(
              new Paragraph({
                children: [body(vol.description)],
                spacing: { before: 30, after: 60 },
              }),
            );
        }
        return paras;
      }

      function buildSections(hStyle: Parameters<typeof heading>[1]) {
        const blocks: InstanceType<typeof Paragraph>[] = [];
        for (const s of sorted) {
          let block: InstanceType<typeof Paragraph>[] = [];
          if (s.type === "summary") block = renderSummary(s, hStyle);
          else if (s.type === "experience") block = renderExperience(s, hStyle);
          else if (s.type === "education") block = renderEducation(s, hStyle);
          else if (s.type === "skills") block = renderSkills(s, hStyle);
          else if (s.type === "projects") block = renderProjects(s, hStyle);
          else if (s.type === "certifications")
            block = renderCertifications(s, hStyle);
          else if (s.type === "languages") block = renderLanguages(s, hStyle);
          else if (s.type === "awards") block = renderAwards(s, hStyle);
          else if (s.type === "volunteer") block = renderVolunteer(s, hStyle);
          if (block.length) blocks.push(...block, emptyLine(80));
        }
        return blocks;
      }

      // ── Numbering + styles (shared) ───────────────────────

      const numbering = {
        config: [
          {
            reference: "resume-bullets",
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: "•",
                alignment: AlignmentType.LEFT,
                style: {
                  paragraph: { indent: { left: 360, hanging: 180 } },
                  run: { size: baseBodyHalf, font: docxFont },
                },
              },
            ],
          },
        ],
      };
      const styles = {
        default: { document: { run: { font: docxFont, size: baseBodyHalf } } },
      };
      const pageProps = {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      };

      // ── Build document children based on template ─────────

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let children: any[] = [];

      if (activeTemplate === "classic") {
        // Centered header, bold ruled sections
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(52 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [body(jobTitle, { italic: true, color: "555555" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 40 },
                }),
              ]
            : []),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 40, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("bold-underline"),
        ];
      } else if (activeTemplate === "executive") {
        // Large name, accent job title, thick border
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(64 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            spacing: { before: 0, after: 40 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [
                    body(jobTitle.toUpperCase(), {
                      bold: true,
                      size: 9,
                      color: accentHex,
                    }),
                  ],
                  spacing: { before: 0, after: 60 },
                  border: {
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: 12,
                      color: accentHex,
                      space: 4,
                    },
                  },
                }),
              ]
            : []),
          emptyLine(80),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("accent-underline"),
        ];
      } else if (activeTemplate === "technical") {
        // Left-bar headings, compact
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(48 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            spacing: { before: 0, after: 20 },
            border: {
              left: {
                style: BorderStyle.SINGLE,
                size: 16,
                color: accentHex,
                space: 8,
              },
            },
            indent: { left: 160 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [
                    body(jobTitle, { italic: true, color: accentHex }),
                  ],
                  indent: { left: 160 },
                  spacing: { before: 0, after: 40 },
                }),
              ]
            : []),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  indent: { left: 160 },
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("left-bar"),
        ];
      } else if (activeTemplate === "elegant") {
        // Centered serif-style name, thin divider
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: false,
                size: Math.round(56 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [body(jobTitle, { size: 9, color: "8A8478" })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 60 },
                }),
              ]
            : []),
          new Paragraph({
            children: [],
            spacing: { before: 0, after: 0 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 2,
                color: accentHex,
                space: 2,
              },
            },
          }),
          emptyLine(80),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("plain-upper"),
        ];
      } else if (activeTemplate === "bold") {
        // Dark header: name in large text with accent color stripe below
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(60 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            spacing: { before: 0, after: 20 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [
                    body(jobTitle.toUpperCase(), {
                      bold: true,
                      size: 9,
                      color: accentHex,
                    }),
                  ],
                  spacing: { before: 0, after: 60 },
                }),
              ]
            : []),
          new Paragraph({
            children: [],
            spacing: { before: 0, after: 0 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 16,
                color: accentHex,
                space: 0,
              },
            },
          }),
          emptyLine(120),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(80),
          ...buildSections("bold-underline"),
        ];
      } else if (activeTemplate === "chronological") {
        // Bullet-point timeline style — accent dots before each section
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(52 * sizeDef.scale),
                font: docxFont,
                color: "0F0E0D",
              }),
            ],
            spacing: { before: 0, after: 20 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [body(jobTitle, { color: "8A8478" })],
                  spacing: { before: 0, after: 40 },
                }),
              ]
            : []),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("accent-underline"),
        ];
      } else {
        // modern / minimal / compact / creative — all use standard single-column layout
        // (true 2-column DOCX requires complex table math; single-column is ATS-safe anyway)
        children = [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                bold: true,
                size: Math.round(52 * sizeDef.scale),
                font: docxFont,
                color: accentHex,
              }),
            ],
            spacing: { before: 0, after: 40 },
          }),
          ...(jobTitle
            ? [
                new Paragraph({
                  children: [
                    body(jobTitle.toUpperCase(), { size: 9, color: accentHex }),
                  ],
                  spacing: { before: 0, after: 40 },
                }),
              ]
            : []),
          ...(info
            ? [
                new Paragraph({
                  children: [
                    body(contactParts(info), { size: 9, color: "555555" }),
                  ],
                  spacing: { before: 0, after: 0 },
                }),
              ]
            : []),
          emptyLine(120),
          ...buildSections("accent-underline"),
        ];
      }

      // ── Assemble & download ───────────────────────────────

      const doc = new Document({
        numbering,
        styles,
        sections: [{ properties: pageProps, children }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-resume.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Export failed — please try again.",
      );
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={loading}
        className={[
          "inline-flex items-center gap-1.5 text-xs font-semibold border-0 rounded-sm px-4 py-1.5 whitespace-nowrap transition-colors duration-150",
          error
            ? "bg-rv-accent cursor-pointer text-white"
            : loading
              ? "bg-rv-muted cursor-not-allowed text-white"
              : "bg-rv-ink text-white cursor-pointer hover:bg-[#2d5a3d]",
        ].join(" ")}
      >
        {loading ? (
          <>
            <Spin />
            Exporting…
          </>
        ) : error ? (
          "Failed — retry"
        ) : (
          <>
            <DocxIcon />
            Export DOCX{!isPro && <ProBadge />}
          </>
        )}
      </button>

      {showUpgrade && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(15,14,13,0.5)] z-100"
            onClick={() => setShowUpgrade(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-rv-white rounded-lg p-8 max-w-95 w-[90%] shadow-[0_20px_60px_rgba(15,14,13,0.2)] text-center">
            <div className="w-11 h-11 rounded-full bg-[rgba(200,75,47,0.08)] flex items-center justify-center mx-auto mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-5.5 h-5.5 stroke-rv-accent fill-none"
                strokeWidth={1.5}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-[1.25rem] text-rv-ink mb-2">
              Pro feature
            </h3>
            <p className="text-[0.82rem] text-rv-muted leading-relaxed mb-6">
              DOCX export is available on the Pro plan. Upgrade to download
              fully editable Word documents with no watermark.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={async () => {
                  const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="px-5 py-2 bg-rv-accent text-white border-0 rounded-sm text-[0.82rem] font-bold cursor-pointer hover:bg-rv-ink transition-colors"
              >
                Upgrade to Pro →
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                className="px-4 py-2 bg-transparent text-rv-muted border border-rv-border rounded-sm text-[0.82rem] cursor-pointer hover:border-rv-ink hover:text-rv-ink transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ProBadge() {
  return (
    <span className="ml-1 text-[0.55rem] font-extrabold bg-rv-accent text-white rounded-full px-1.5 py-px tracking-[0.06em] align-middle">
      PRO
    </span>
  );
}
function DocxIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={12}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="shrink-0"
    >
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z" />
      <path d="M9 2v4h4" />
      <path d="M5.5 9.5l1.5 2 1.5-2M10.5 9.5v3" />
    </svg>
  );
}
function Spin() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={12}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="shrink-0 animate-spin"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        strokeDasharray="28"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
