import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function MinimalTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.6em] font-bold tracking-[0.12em] uppercase text-rv-muted mb-[0.6rem]";
  const LEFT = ["skills", "certifications", "education"];
  const left = sections.filter((s) => LEFT.includes(s.type));
  const right = sections.filter((s) => !LEFT.includes(s.type));
  return (
    <div className="bg-[#fdfcfa] p-7 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="mb-5">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.6em] text-rv-ink tracking-[-0.02em] mb-[0.15rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.67em] text-rv-muted">
            {getJobTitle(resume)}
          </Styleable>
        )}
        <div className="h-px bg-rv-border mt-3" />
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div>{left.map((s) => <div key={s.id}>{renderSection(s, hClass)}</div>)}</div>
        <div>{right.map((s) => <div key={s.id}>{renderSection(s, hClass)}</div>)}</div>
      </div>
    </div>
  );
}
