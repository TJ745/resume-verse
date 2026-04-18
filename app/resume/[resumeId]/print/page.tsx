import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { ResumeData, ResumeSection, SectionType, PersonalInfo } from "@/types/resume";
import PrintResume from "./PrintResume";

interface PrintPageProps {
  params:      Promise<{ resumeId: string }>;
  searchParams: Promise<{ template?: string; colorScheme?: string }>;
}

export default async function PrintPage({ params, searchParams }: PrintPageProps) {
  const { resumeId }  = await params;
  const { template: qTemplate, colorScheme: qScheme } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const resume = await prisma.resume.findFirst({
    where:   { id: resumeId, userId: session.user.id },
    include: { sections: { orderBy: { order: "asc" } }, user: { select: { plan: true } } },
  });

  if (!resume) notFound();

  const resumeData: ResumeData = {
    id:          resume.id,
    title:       resume.title,
    // URL params take priority — they always reflect the user's live selection
    template:    qTemplate    ?? resume.template,
    colorScheme: qScheme      ?? resume.colorScheme,
    jobTitle:    resume.jobTitle,
    personalInfo: (resume.personalInfo as unknown as PersonalInfo) ?? null,
    sections: resume.sections.map((s) => ({
      id:       s.id,
      resumeId: s.resumeId,
      type:     s.type as SectionType,
      title:    s.title,
      content:  s.content as unknown as ResumeSection["content"],
      order:    s.order,
    })),
  };

  const isPro = resume.user.plan === "pro";

  return <PrintResume resume={resumeData} isPro={isPro} />;
}