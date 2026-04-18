"use client";

import type { ResumeData, ResumeSection } from "@/types/resume";

interface Props {
  resume: ResumeData;
  sections: ResumeSection[];
}

interface CheckItem {
  label: string;
  done: boolean;
}

function computeCompletion(resume: ResumeData, sections: ResumeSection[]) {
  const pi = resume.personalInfo;
  const sec = (type: string) => sections.find((s) => s.type === type);

  const hasContent = (s: ResumeSection | undefined): boolean => {
    if (!s) return false;
    const c = s.content as Record<string, unknown>;
    if (Array.isArray(c)) return c.length > 0;
    if (c?.text && typeof c.text === "string") return c.text.trim().length > 20;
    if (c?.categories && Array.isArray(c.categories)) {
      return (c.categories as Array<{ skills?: string }>).some(
        (cat) => cat.skills && cat.skills.trim().length > 0,
      );
    }
    return false;
  };

  const expSec = sec("experience");
  const hasBullets = (() => {
    if (!expSec) return false;
    const c = expSec.content as Record<string, unknown>;
    const items = Array.isArray(c) ? c : [];
    return items.some((job: unknown) => {
      const bullets =
        ((job as Record<string, unknown>)?.bullets as string[]) ?? [];
      return bullets.some((b) => b.trim().length > 0);
    });
  })();

  const checks: CheckItem[] = [
    {
      label: "Full name & job title",
      done: !!(pi?.fullName?.trim() && pi?.jobTitle?.trim()),
    },
    {
      label: "Contact info (email/phone)",
      done: !!(pi?.email?.trim() && pi?.phone?.trim()),
    },
    { label: "Professional summary", done: hasContent(sec("summary")) },
    { label: "Work experience", done: hasContent(sec("experience")) },
    { label: "Experience bullets", done: hasBullets },
    { label: "Education", done: hasContent(sec("education")) },
    { label: "Skills", done: hasContent(sec("skills")) },
    {
      label: "LinkedIn or website",
      done: !!(pi?.linkedin?.trim() || pi?.website?.trim()),
    },
  ];

  const score = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100,
  );
  return { score, checks };
}

function getLabel(score: number): {
  text: string;
  colorClass: string;
  barColor: string;
} {
  if (score < 40)
    return {
      text: "Just started",
      colorClass: "text-rv-accent",
      barColor: "bg-rv-accent",
    };
  if (score < 65)
    return {
      text: "In progress",
      colorClass: "text-[#b7791f]",
      barColor: "bg-[#b7791f]",
    };
  if (score < 85)
    return {
      text: "Looking good",
      colorClass: "text-[#2d7a4f]",
      barColor: "bg-[#2d7a4f]",
    };
  return {
    text: "Complete",
    colorClass: "text-[#1e3a5f]",
    barColor: "bg-[#1e3a5f]",
  };
}

export default function CompletionBar({ resume, sections }: Props) {
  const { score, checks } = computeCompletion(resume, sections);
  const { text, colorClass, barColor } = getLabel(score);
  const missing = checks.filter((c) => !c.done);

  return (
    <div className="px-4 pt-2.5 pb-2 border-b border-rv-border bg-rv-white">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-[0.6rem] font-bold tracking-[0.06em] uppercase text-rv-muted shrink-0">
          Resume strength
        </span>
        <div className="flex-1 h-1 bg-rv-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span
          className={`text-[0.6rem] font-bold shrink-0 w-7 text-right ${colorClass}`}
        >
          {score}%
        </span>
        <span className={`text-[0.6rem] font-semibold shrink-0 ${colorClass}`}>
          {text}
        </span>
      </div>
      {missing.length > 0 && (
        <p className="text-[0.6rem] text-rv-muted m-0 leading-snug">
          Missing:{" "}
          {missing
            .slice(0, 3)
            .map((c) => c.label)
            .join(" · ")}
          {missing.length > 3 && ` +${missing.length - 3} more`}
        </p>
      )}
    </div>
  );
}
