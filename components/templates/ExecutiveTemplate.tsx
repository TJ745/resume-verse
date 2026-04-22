import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ExecutiveTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.6em] font-bold tracking-[0.15em] uppercase text-rv-ink mb-[0.5rem] pb-[0.2rem] border-b-2 border-accent";
  return (
    <div className="bg-[#fdfcfa] p-10 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="mb-7 pb-5 border-b-[3px] border-accent">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.9em] text-rv-ink tracking-[-0.02em] mb-[0.3rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.72em] text-accent font-semibold tracking-[0.08em] uppercase">
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
