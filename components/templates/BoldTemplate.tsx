import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function BoldTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.62em] font-extrabold tracking-[0.14em] uppercase text-rv-ink mb-[0.55rem] pb-[0.2rem] border-b-2 border-rv-ink";
  return (
    <div className="bg-[#fdfcfa] min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      {/* Dark header band */}
      <div className="bg-rv-ink py-7 px-8">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[2em] text-white tracking-[-0.01em] mb-[0.2rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.7em] text-accent font-semibold tracking-[0.1em] uppercase">
            {getJobTitle(resume)}
          </Styleable>
        )}
      </div>
      <div className="h-1 bg-accent" />
      <div className="py-6 px-8">
        {sections.map((s) => (
          <div key={s.id}>{renderSection(s, hClass)}</div>
        ))}
      </div>
    </div>
  );
}
