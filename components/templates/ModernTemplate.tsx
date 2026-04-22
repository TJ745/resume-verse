import {
  getName, getJobTitle, ContactLine, PhotoCircle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ModernTemplate({ resume, sections, accent }: TplProps) {
  const hClass = "text-[0.6em] font-bold tracking-[0.12em] uppercase text-accent border-b border-accent pb-[0.2rem] mb-[0.6rem]";
  return (
    <div className="bg-[#fdfcfa] p-8 min-h-full" style={{ "--accent": accent } as React.CSSProperties}>
      <div className="h-0.75 bg-accent -mx-8 -mt-8 mb-5" />
      <div className="mb-5">
        {resume.personalInfo?.showPhoto && resume.personalInfo?.photoUrl && (
          <PhotoCircle photoUrl={resume.personalInfo.photoUrl} size={52} />
        )}
        <Styleable instanceId="name" tag="h1" className="font-serif text-[1.6em] text-rv-ink leading-[1.1] tracking-[-0.02em] mb-[0.2rem]">
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable instanceId="jobTitle" tag="p" className="text-[0.65em] uppercase tracking-widest text-accent">
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
