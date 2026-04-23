import { getName, getJobTitle, renderSection } from "./Shared";
import { Styleable } from "@/components/builder/StyleContext";
import type { TplProps } from "./types";

export default function TechnicalTemplate({
  resume,
  sections,
  accent,
}: TplProps) {
  const hClass =
    "text-[0.6em] font-bold tracking-[0.14em] uppercase text-rv-ink bg-[#f5f3ef] py-[0.2rem] px-[0.5rem] mb-[0.6rem] border-l-[3px] border-accent";
  return (
    <div
      className="bg-[#fdfcfa] p-7 min-h-full"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="flex items-center gap-4 mb-5 pb-3 border-b border-rv-border">
        <div className="w-1 h-10.5 bg-accent shrink-0" />
        <div>
          <Styleable
            instanceId="name"
            tag="h1"
            className="font-serif text-[1.55em] text-rv-ink tracking-[-0.02em] mb-[0.1rem]"
          >
            {getName(resume)}
          </Styleable>
          {getJobTitle(resume) && (
            <Styleable
              instanceId="jobTitle"
              tag="p"
              className="text-[0.67em] text-accent font-medium"
            >
              {getJobTitle(resume)}
            </Styleable>
          )}
        </div>
      </div>
      {sections.map((s) => (
        <div key={s.id}>{renderSection(s, hClass)}</div>
      ))}
    </div>
  );
}
