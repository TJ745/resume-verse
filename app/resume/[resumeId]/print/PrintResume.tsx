import {
  ModernTemplate,
  ClassicTemplate,
  MinimalTemplate,
  ExecutiveTemplate,
  CompactTemplate,
  CreativeTemplate,
  ElegantTemplate,
  TechnicalTemplate,
  ChronologicalTemplate,
  BoldTemplate,
  getAccent,
  getName,
} from "@/components/templates";
import {
  RESUME_FONTS,
  FONT_SIZES,
  ELEMENT_FONTS,
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
} from "@/lib/resume-constants";
import type {
  ResumeData,
  ResumeSection,
  SectionType,
  PersonalInfo,
} from "@/types/resume";

interface PrintResumeProps {
  resume: ResumeData;
  isPro?: boolean;
}

function coerce(resume: ResumeData): ResumeData {
  return {
    ...resume,
    sections: (resume.sections ?? []).map((s) => ({
      id: s.id,
      resumeId: s.resumeId,
      type: s.type as SectionType,
      title: s.title,
      content: s.content as ResumeSection["content"],
      order: s.order,
    })),
    personalInfo: resume.personalInfo as PersonalInfo | null,
  };
}

export default function PrintResume({
  resume: raw,
  isPro = false,
}: PrintResumeProps) {
  const resume = coerce(raw);
  const sorted = [...resume.sections].sort((a, b) => a.order - b.order);
  const accent = getAccent(resume.colorScheme);
  const tplProps = {
    resume: { ...resume, sections: sorted },
    sections: sorted,
    accent,
  };

  // ── Global font (topbar selection) ───────────────────────
  const fontId = resume.font ?? DEFAULT_FONT;
  const sizeId = resume.fontSize ?? DEFAULT_FONT_SIZE;
  const fontDef = RESUME_FONTS.find((f) => f.id === fontId) ?? RESUME_FONTS[0];
  const sizeDef = FONT_SIZES.find((s) => s.id === sizeId) ?? FONT_SIZES[2];
  const basePx = Math.round(13 * sizeDef.scale);

  // ── Per-element override fonts (StyleToolbar selections) ──
  // Collect every unique font id used in styleOverrides so we can
  // load their Google Fonts in the <head>.
  const overrides = (resume.styleOverrides ?? {}) as Record<
    string,
    { font?: string; fontSize?: string }
  >;
  const overrideFontIds = [
    ...new Set(
      Object.values(overrides)
        .map((o) => o?.font)
        .filter(Boolean) as string[],
    ),
  ];

  // ── Build Google Fonts URL ────────────────────────────────
  // Always load Instrument Serif (used for name/headings in all templates).
  const googleFamilies: string[] = ["Instrument+Serif:ital@0;1"];

  // Global font
  if (fontDef.google && !fontDef.google.includes("Instrument")) {
    googleFamilies.push(fontDef.google);
  }

  // Per-element override fonts
  for (const fid of overrideFontIds) {
    const def = ELEMENT_FONTS.find((f) => f.id === fid);
    if (
      def?.google &&
      !googleFamilies.some((g) => g.startsWith(def.google!.split(":")[0]))
    ) {
      googleFamilies.push(def.google);
    }
  }

  const googleUrl = `https://fonts.googleapis.com/css2?family=${googleFamilies.join("&family=")}&display=swap`;

  // ── Per-element override CSS ──────────────────────────────
  // Generates CSS rules for each override so they apply in the PDF
  // without needing React context (which doesn't exist in print mode).
  // Instance IDs: "name", "jobTitle", "h:{sectionId}", "b:{sectionId}"
  // Map to data attributes set on elements... but since templates use
  // React inline styles, we inject the overrides via a global CSS approach:
  // we generate a <style> block that targets the data-instance attribute.
  const overrideStyles = Object.entries(overrides)
    .map(([id, ov]) => {
      if (!ov || (!ov.font && !ov.fontSize)) return "";
      const rules: string[] = [];
      if (ov.font) {
        const def = ELEMENT_FONTS.find((f) => f.id === ov.font);
        if (def) rules.push(`font-family: ${def.stack} !important`);
      }
      if (ov.fontSize) {
        const pt = parseFloat(ov.fontSize);
        if (!isNaN(pt))
          rules.push(`font-size: ${(pt / 9.75).toFixed(3)}em !important`);
      }
      if ((ov as Record<string, unknown>).bold)
        rules.push("font-weight: 700 !important");
      if ((ov as Record<string, unknown>).italic)
        rules.push("font-style: italic !important");
      if ((ov as Record<string, unknown>).underline)
        rules.push("text-decoration: underline !important");
      if (!rules.length) return "";
      return `[data-sid="${id}"] { ${rules.join("; ")} }`;
    })
    .filter(Boolean)
    .join("\n");

  const Template = (() => {
    switch (resume.template) {
      case "classic":
        return <ClassicTemplate {...tplProps} />;
      case "minimal":
        return <MinimalTemplate {...tplProps} />;
      case "executive":
        return <ExecutiveTemplate {...tplProps} />;
      case "compact":
        return <CompactTemplate {...tplProps} />;
      case "creative":
        return <CreativeTemplate {...tplProps} />;
      case "elegant":
        return <ElegantTemplate {...tplProps} />;
      case "technical":
        return <TechnicalTemplate {...tplProps} />;
      case "chronological":
        return <ChronologicalTemplate {...tplProps} />;
      case "bold":
        return <BoldTemplate {...tplProps} />;
      default:
        return <ModernTemplate {...tplProps} />;
    }
  })();

  // React 19 hoists <title>, <link>, and <style> to <head> automatically
  // when rendered anywhere in the component tree — no <html>/<head>/<body> needed.
  return (
    <>
      <title>{getName(resume)}</title>
      <link href={googleUrl} rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box;  }
        body {
          background: #ffffff;
          color: #0f0e0d;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @page { size: A4; margin: 0; }
        .page {
          width: 210mm;
          min-height: 297mm;
          font-family: ${fontDef.stack};
          font-size: ${basePx}px;
        }
        ${overrideStyles}
      `}</style>
      <div className="page">{Template}</div>
      {!isPro && (
        <div
          style={{
            width: "210mm",
            padding: "4px 16mm",
            background: "#f5f3ef",
            borderTop: "1px solid #e8e4dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              fontSize: 6.5,
              color: "#8a8478",
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Created with{" "}
            <strong
              style={{
                color: "#c84b2f",
                fontWeight: 700,
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
              }}
            >
              ResumeVerse
            </strong>{" "}
            — resumeverse.com · Upgrade to Pro to remove this watermark
          </span>
        </div>
      )}
    </>
  );
}
