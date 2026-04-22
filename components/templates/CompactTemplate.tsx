import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function CompactTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.58em] font-bold tracking-[0.1em] uppercase text-accent border-b border-accent pb-[0.15rem] mb-[0.4rem]";
  return (
    <div className="bg-[#fdfcfa] p-6 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="flex justify-between items-end mb-4 pb-[0.6rem] border-b border-rv-border">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.4em] text-rv-ink tracking-[-0.02em]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.65em] text-rv-muted">
            {getJobTitle(resume)}
          </Styleable>
        )}
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, hClass)}</div>
      ))}
    </div>
  );
}
