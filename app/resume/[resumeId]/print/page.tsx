// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { redirect, notFound } from "next/navigation";
// import { DEFAULT_FONT, DEFAULT_FONT_SIZE } from "@/lib/resume-constants";
// import type {
//   ResumeData,
//   ResumeSection,
//   SectionType,
//   PersonalInfo,
// } from "@/types/resume";
// import PrintResume from "./PrintResume";

// interface PrintPageProps {
//   params: Promise<{ resumeId: string }>;
//   searchParams: Promise<{
//     template?: string;
//     colorScheme?: string;
//     font?: string;
//     fontSize?: string;
//   }>;
// }

// export default async function PrintPage({
//   params,
//   searchParams,
// }: PrintPageProps) {
//   const { resumeId } = await params;
//   const {
//     template: qTemplate,
//     colorScheme: qScheme,
//     font: qFont,
//     fontSize: qFontSize,
//   } = await searchParams;

//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) redirect("/login");

//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, userId: session.user.id },
//     include: {
//       sections: { orderBy: { order: "asc" } },
//       user: { select: { plan: true } },
//     },
//   });

//   if (!resume) notFound();

//   const resumeData: ResumeData = {
//     id: resume.id,
//     title: resume.title,
//     // URL params always take priority — they carry the user's live selection
//     template: qTemplate ?? resume.template,
//     colorScheme: qScheme ?? resume.colorScheme,
//     font:
//       qFont ??
//       (resume as typeof resume & { font?: string }).font ??
//       DEFAULT_FONT,
//     fontSize:
//       qFontSize ??
//       (resume as typeof resume & { fontSize?: string }).fontSize ??
//       DEFAULT_FONT_SIZE,
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

//   const isPro = resume.user.plan === "pro";
//   return <PrintResume resume={resumeData} isPro={isPro} />;
// }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { DEFAULT_FONT, DEFAULT_FONT_SIZE } from "@/lib/resume-constants";
import type {
  ResumeData,
  ResumeSection,
  SectionType,
  PersonalInfo,
} from "@/types/resume";
import PrintResume from "./PrintResume";

interface PrintPageProps {
  params: Promise<{ resumeId: string }>;
  searchParams: Promise<{
    template?: string;
    colorScheme?: string;
    font?: string;
    fontSize?: string;
    styleOverrides?: string; // JSON-encoded, takes priority over DB
  }>;
}

export default async function PrintPage({
  params,
  searchParams,
}: PrintPageProps) {
  const { resumeId } = await params;
  const {
    template: qTemplate,
    colorScheme: qScheme,
    font: qFont,
    fontSize: qFontSize,
    styleOverrides: qStyleOverrides,
  } = await searchParams;

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

  const db = resume as typeof resume & {
    font?: string;
    fontSize?: string;
    styleOverrides?: Record<string, unknown>;
  };

  // URL-param styleOverrides always win over DB — they carry the user's
  // live unsaved state from the builder preview at the moment of export.
  let resolvedOverrides: Record<string, unknown> = db.styleOverrides ?? {};
  if (qStyleOverrides) {
    try {
      resolvedOverrides = JSON.parse(qStyleOverrides);
    } catch {
      // malformed JSON — fall back to DB value silently
    }
  }

  const resumeData: ResumeData = {
    id: db.id,
    title: db.title,
    template: qTemplate ?? db.template,
    colorScheme: qScheme ?? db.colorScheme,
    font: qFont ?? db.font ?? DEFAULT_FONT,
    fontSize: qFontSize ?? db.fontSize ?? DEFAULT_FONT_SIZE,
    styleOverrides: resolvedOverrides,
    jobTitle: db.jobTitle,
    personalInfo: (db.personalInfo as unknown as PersonalInfo) ?? null,
    sections: db.sections.map((s) => ({
      id: s.id,
      resumeId: s.resumeId,
      type: s.type as SectionType,
      title: s.title,
      content: s.content as unknown as ResumeSection["content"],
      order: s.order,
    })),
  };

  const isPro = resume.user.plan === "pro";
  return <PrintResume resume={resumeData} isPro={isPro} />;
}
