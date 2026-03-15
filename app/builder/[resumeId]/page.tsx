// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { redirect, notFound } from "next/navigation";
// import BuilderClient from "@/components/builder/BuilderClient";
// import type {
//   ResumeData,
//   ResumeSection,
//   SectionType,
//   PersonalInfo,
// } from "@/types/resume";

// interface BuilderPageProps {
//   params: Promise<{ resumeId: string }>;
// }

// export default async function BuilderPage({ params }: BuilderPageProps) {
//   const { resumeId } = await params;

//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) redirect("/login");

//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, userId: session.user.id },
//     include: {
//       sections: { orderBy: { order: "asc" } },
//     },
//   });

//   if (!resume) notFound();

//   const resumeData: ResumeData = {
//     id: resume.id,
//     title: resume.title,
//     template: resume.template,
//     colorScheme: resume.colorScheme,
//     jobTitle: resume.jobTitle,
//     personalInfo: (resume.personalInfo as unknown as PersonalInfo) ?? null,
//     sections: resume.sections.map((s) => ({
//       id: s.id,
//       resumeId: s.resumeId,
//       type: s.type as SectionType,
//       title: s.title,
//       content: s.content as unknown as ResumeSection["content"],
//       order: s.order,
//     })),
//   };

//   return (
//     <div
//       className="min-h-screen"
//       style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
//     >
//       <BuilderClient resume={resumeData} isPublic={resume.isPublic} />
//     </div>
//   );
// }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import BuilderClient from "@/components/builder/BuilderClient";
import type {
  ResumeData,
  ResumeSection,
  SectionType,
  PersonalInfo,
} from "@/types/resume";

interface BuilderPageProps {
  params: Promise<{ resumeId: string }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { resumeId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
    include: {
      sections: { orderBy: { order: "asc" } },
      user: { select: { plan: true } },
    },
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

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
    >
      <BuilderClient
        resume={resumeData}
        isPublic={resume.isPublic}
        isPro={resume.user.plan === "pro"}
      />
    </div>
  );
}
