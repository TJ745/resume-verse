import {
  getName, getJobTitle, ContactLine, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ClassicTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.65em] font-bold tracking-[0.1em] uppercase text-rv-ink border-b-2 border-rv-ink pb-[0.2rem] mb-[0.6rem]";
  return (
    <div className="bg-[#fdfcfa] p-8 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="text-center mb-5 pb-4 border-b-2 border-rv-ink">
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.7em] text-rv-ink tracking-[-0.02em] mb-[0.2rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.67em] text-rv-muted tracking-[0.06em]">
            {getJobTitle(resume)}
          </Styleable>
        )}
        <ContactLine info={resume.personalInfo} />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, hClass)}</div>
      ))}
    </div>
  );
}
