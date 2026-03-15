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
    <div style={{ minHeight: "100vh", background: "#f5f3ef" }}>
      {/* Topbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e8e4dc",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "#8a8478", margin: 0 }}>
          <strong style={{ color: "#0f0e0d" }}>{name}</strong>&apos;s Resume
        </p>
        <Link
          href="/"
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#c84b2f",
            textDecoration: "none",
            letterSpacing: "0.04em",
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
          }}
        >
          Made with ResumeVerse
        </Link>
      </div>

      {/* Resume centered */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2rem 1rem 4rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 794,
            background: "#fff",
            boxShadow: "0 8px 32px rgba(15,14,13,0.12)",
          }}
        >
          <PrintResume resume={resumeData} isPro={true} />
        </div>
      </div>
    </div>
  );
}
