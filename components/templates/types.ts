import type { ResumeData, ResumeSection } from "@/types/resume";

export interface TplProps {
  resume:   ResumeData;
  sections: ResumeSection[];
  accent:   string;
}