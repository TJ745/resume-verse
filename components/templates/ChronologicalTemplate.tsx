import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ChronologicalTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.6em] font-bold tracking-[0.12em] uppercase text-accent mb-[0.6rem]";
  return (
    <div className="bg-[#fdfcfa] p-8 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="mb-6">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.65em] text-rv-ink tracking-[-0.02em] mb-[0.2rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.67em] text-rv-muted">
            {getJobTitle(resume)}
          </Styleable>
        )}
        <div className="flex gap-1 mt-2">
          <div className="w-6 h-0.75 bg-accent" />
          <div className="w-2 h-0.75 bg-accent opacity-40" />
          <div className="w-1 h-0.75 bg-accent opacity-20" />
        </div>
      </div>
      {/* Timeline track */}
      <div className="border-l-2 border-[#e8e4dc] pl-4">
        {sections.map((s) => (
          <div key={s.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[1.35rem] top-[0.15rem] size-2 rounded-full bg-accent border-2 border-[#fdfcfa]" />
            {renderSection(s, hClass)}
          </div>
        ))}
      </div>
    </div>
  );
}
