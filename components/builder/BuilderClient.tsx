"use client";

import { useState } from "react";
import BuilderTopbar from "./BuilderTopbar";
import StepWizard from "@/components/steps/StepWizard";
import ResumePreview from "./ResumePreview";
import ATSPanel from "./ATSPanel";
import JDMatchPanel from "./JDMatchPanel";
import CoverLetterPanel from "./CoverLetterPanel";
import GrammarPanel from "./GrammarPanel";
import AchievementPanel from "./AchievementPanel";
import CareerGapPanel from "./CareerGapPanel";
import InterviewPrepPanel from "./InterviewPrepPanel";
import MobileBuilderBlock from "./MobileBuilderBlock";
import CompletionBar from "./CompletionBar";
import type { ResumeData, ResumeSection, PersonalInfo } from "@/types/resume";

interface BuilderClientProps {
  resume: ResumeData;
  isPublic?: boolean;
  isPro?: boolean;
}

type PanelId =
  | "ats"
  | "jd"
  | "cover"
  | "grammar"
  | "achievement"
  | "gap"
  | "interview"
  | null;

export default function BuilderClient({
  resume,
  isPublic = false,
  isPro = false,
}: BuilderClientProps) {
  const [sections, setSections] = useState<ResumeSection[]>(resume.sections);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(
    resume.personalInfo,
  );
  const [panel, setPanel] = useState<PanelId>(null);
  const [template, setTemplate] = useState(resume.template);
  const [colorScheme, setColorScheme] = useState(
    resume.colorScheme ?? "terracotta",
  );

  const liveResume: ResumeData = {
    ...resume,
    personalInfo,
    jobTitle: personalInfo?.jobTitle ?? resume.jobTitle,
    title: resume.title,
    template,
    colorScheme,
  };

  const closePanel = () => setPanel(null);

  return (
    <>
      <MobileBuilderBlock />
      <BuilderTopbar
        resumeId={resume.id}
        resume={liveResume}
        sections={sections}
        title={resume.title}
        template={template}
        colorScheme={colorScheme}
        onATSOpen={() => setPanel("ats")}
        onJDMatchOpen={() => setPanel("jd")}
        onCoverLetterOpen={() => setPanel("cover")}
        onGrammarOpen={() => setPanel("grammar")}
        onAchievementOpen={() => setPanel("achievement")}
        onCareerGapOpen={() => setPanel("gap")}
        onInterviewOpen={() => setPanel("interview")}
        isPublic={isPublic}
        isPro={isPro}
        onTemplateChange={setTemplate}
        onSchemeChange={setColorScheme}
      />

      <div
        className="flex overflow-hidden"
        style={{ height: "calc(100vh - 56px)", marginTop: 56 }}
      >
        {/* ── Left: Step wizard ── */}
        <div className="w-105 shrink-0 border-r border-rv-border bg-rv-paper overflow-hidden flex flex-col">
          <CompletionBar resume={liveResume} sections={sections} />
          <StepWizard
            resume={liveResume}
            sections={sections}
            onSectionsChange={setSections}
            onPersonalInfoChange={setPersonalInfo}
          />
        </div>

        {/* ── Right: Preview ── */}
        <div className="flex-1 overflow-auto bg-rv-cream flex flex-col items-center px-6 py-8 gap-3">
          <div className="text-[0.6rem] font-semibold tracking-widest uppercase text-rv-muted">
            Preview · {liveResume.template}
          </div>
          <div className="w-full max-w-160 min-h-225 bg-[#fdfcfa] shadow-[0_8px_32px_rgba(15,14,13,0.15),0_2px_8px_rgba(15,14,13,0.08)]">
            <ResumePreview
              resume={liveResume}
              sections={sections}
              onSectionsChange={setSections}
            />
          </div>
        </div>
      </div>

      {/* ── All Smart Tool Panels — one open at a time ── */}
      <ATSPanel
        open={panel === "ats"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
      />
      <JDMatchPanel
        open={panel === "jd"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        onSectionsChange={setSections}
      />
      <CoverLetterPanel
        open={panel === "cover"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        isPro={isPro}
      />
      <GrammarPanel
        open={panel === "grammar"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        onSectionsChange={setSections}
      />
      <AchievementPanel
        open={panel === "achievement"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
        onSectionsChange={setSections}
      />
      <CareerGapPanel
        open={panel === "gap"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
      />
      <InterviewPrepPanel
        open={panel === "interview"}
        onClose={closePanel}
        resume={liveResume}
        sections={sections}
      />
    </>
  );
}
