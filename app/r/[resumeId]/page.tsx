import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintResume from "@/app/resume/[resumeId]/print/PrintResume";
import Link from "next/link";
import type {
  ResumeData,
  ResumeSection,
  SectionType,
  PersonalInfo,
} from "@/types/resume";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ resumeId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resumeId } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, isPublic: true },
  });

  if (!resume) return { title: "Resume not found" };

  const name =
    ((resume.personalInfo as Record<string, unknown> | null)
      ?.fullName as string) ?? resume.title;

  return {
    title: `${name} — Resume`,
    description: `View ${name}'s resume, created with ResumeVerse.`,
  };
}

export default async function PublicResumePage({ params }: Props) {
  const { resumeId } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, isPublic: true },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!resume) notFound();

  const resumeData: ResumeData = {
    id: resume.id,
    title: resume.title,
    template: resume.template,
    colorScheme: resume.colorScheme,
    jobTitle: resume.jobTitle,
    personalInfo: (resume.personalInfo as unknown as PersonalInfo) ?? null,
    sections: resume.sections.map((s) => ({
      id: s.id,
      resumeId: s.resumeId,
      type: s.type as SectionType,
      title: s.title,
      content: s.content as unknown as ResumeSection["content"],
      order: s.order,
    })),
  };

  const name = resumeData.personalInfo?.fullName ?? resumeData.title;

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e8e4dc] bg-white px-6 py-3">
        <p className="m-0 text-sm text-[#8a8478]">
          <strong className="text-[#0f0e0d]">{name}</strong>&apos;s Resume
        </p>

        <Link
          href="/"
          className="font-serif text-xs font-bold italic tracking-wider text-rv-accent no-underline"
        >
          Made with ResumeVerse
        </Link>
      </div>

      {/* Resume centered */}
      <div className="flex justify-center px-4 pb-16 pt-8">
        <div className="w-full max-w-198 bg-white shadow-[0_8px_32px_rgba(15,14,13,0.12)]">
          <PrintResume resume={resumeData} isPro={true} />
        </div>
      </div>
    </div>
  );
}
