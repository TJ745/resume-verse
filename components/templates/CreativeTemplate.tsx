import {
  getName, getJobTitle, renderSection,
} from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function CreativeTemplate({ resume, sections, accent }: TplProps) {
  const hLeft  = "text-[0.6em] font-bold tracking-[0.12em] uppercase text-white mb-[0.6rem]";
  const hRight = "text-[0.6em] font-bold tracking-[0.12em] uppercase text-accent mb-[0.6rem]";
  const LEFT = ["skills", "certifications", "education"];
  const left  = sections.filter((s) => LEFT.includes(s.type));
  const right = sections.filter((s) => !LEFT.includes(s.type));
  return (
    <div className="flex min-h-full bg-[#fdfcfa]" style={{ "--accent": accent } as React.CSSProperties}>
      {/* Coloured sidebar */}
      <div className="w-[38%] bg-accent p-8 pr-5 shrink-0">
        <div className="mb-6">
          <Styleable instanceId="name" tag="h1" className="font-serif text-[1.4em] text-white leading-[1.1] mb-[0.3rem]">
            {getName(resume)}
          </Styleable>
          {getJobTitle(resume) && (
            <Styleable instanceId="jobTitle" tag="p" className="text-[0.65em] text-white/75 tracking-[0.06em]">
              {getJobTitle(resume)}
            </Styleable>
          )}
        </div>
        {left.map((s) => (
          <div key={s.id}>{renderSection(s, hLeft, true)}</div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 pl-6 bg-[#fdfcfa]">
        {right.map((s) => (
          <div key={s.id}>{renderSection(s, hRight)}</div>
        ))}
      </div>
    </div>
  );
}
