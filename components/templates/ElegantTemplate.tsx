import { getName, getJobTitle, renderSection } from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function ElegantTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const hClass =
    "font-serif text-[0.85em] italic text-accent border-b border-rv-border pb-[0.25rem] mb-[0.6rem]";
  return (
    <div
      className="bg-[#fdfcfa] py-10 px-12 min-h-full"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="text-center mb-7">
        <Styleable
          instanceId="name"
          tag="h1"
          className="font-serif text-[2em] text-rv-ink tracking-[0.04em] mb-1"
        >
          {getName(resume)}
        </Styleable>
        {getJobTitle(resume) && (
          <Styleable
            instanceId="jobTitle"
            tag="p"
            className="text-[0.7em] text-rv-muted tracking-[0.12em] uppercase"
          >
            {getJobTitle(resume)}
          </Styleable>
        )}
        <div className="w-12 h-px bg-accent mx-auto mt-3" />
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, hClass)}</div>
      ))}
    </div>
  );
}
