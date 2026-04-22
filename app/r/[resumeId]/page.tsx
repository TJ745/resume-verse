// import { prisma } from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import PrintResume from "@/app/resume/[resumeId]/print/PrintResume";
// import Link from "next/link";
// import type {
//   ResumeData,
//   ResumeSection,
//   SectionType,
//   PersonalInfo,
// } from "@/types/resume";
// import type { Metadata } from "next";

// interface Props {
//   params: Promise<{ resumeId: string }>;
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { resumeId } = await params;
//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, isPublic: true },
//   });
//   if (!resume) return { title: "Resume not found" };
//   const name =
//     ((resume.personalInfo as Record<string, unknown> | null)
//       ?.fullName as string) ?? resume.title;
//   return {
//     title: `${name} — Resume`,
//     description: `View ${name}'s resume, created with ResumeVerse.`,
//   };
// }

// export default async function PublicResumePage({ params }: Props) {
//   const { resumeId } = await params;

//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, isPublic: true },
//     include: { sections: { orderBy: { order: "asc" } } },
//   });
//   if (!resume) notFound();

//   const r = resume as typeof resume & { font?: string; fontSize?: string };
//   const resumeData: ResumeData = {
//     id: r.id,
//     title: r.title,
//     template: r.template,
//     colorScheme: r.colorScheme,
//     font: r.font ?? "dm-sans",
//     fontSize: r.fontSize ?? "md",
//     jobTitle: r.jobTitle,
//     personalInfo: (r.personalInfo as unknown as PersonalInfo) ?? null,
//     sections: r.sections.map((s) => ({
//       id: s.id,
//       resumeId: s.resumeId,
//       type: s.type as SectionType,
//       title: s.title,
//       content: s.content as unknown as ResumeSection["content"],
//       order: s.order,
//     })),
//   };

//   const name = resumeData.personalInfo?.fullName ?? resumeData.title;

//   return (
//     <div className="min-h-screen bg-[#f5f3ef]">
//       {/* Topbar */}
//       <div className="sticky top-0 z-10 bg-white border-b border-[#e8e4dc] px-6 py-3 flex items-center justify-between">
//         <p className="text-[0.8rem] text-[#8a8478] m-0">
//           <strong className="text-[#0f0e0d]">{name}</strong>&apos;s Resume
//         </p>
//         <Link
//           href="/"
//           className="text-[0.72rem] font-bold text-[#c84b2f] no-underline tracking-[0.04em] italic"
//           style={{ fontFamily: "Instrument Serif, serif" }}
//         >
//           Made with ResumeVerse
//         </Link>
//       </div>

//       {/* Resume centered */}
//       <div className="flex justify-center px-4 py-8 pb-16">
//         <div className="w-full max-w-200 bg-white shadow-[0_8px_32px_rgba(15,14,13,0.12)]">
//           <PrintResume resume={resumeData} isPro={true} />
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { DEFAULT_FONT, DEFAULT_FONT_SIZE } from "@/lib/resume-constants";

interface Props {
  params: Promise<{ resumeId: string }>;
}

// ── Prisma resume row type with sections relation ─────────
type ResumeRow = Awaited<
  ReturnType<
    typeof prisma.resume.findFirst<{
      include: { sections: { orderBy: { order: "asc" } } };
    }>
  >
>;

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

  const raw = await prisma.resume.findFirst({
    where: { id: resumeId, isPublic: true },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!raw) notFound();
  const r = raw as NonNullable<ResumeRow>;

  const resumeData: ResumeData = {
    id: r.id,
    title: r.title,
    template: r.template,
    colorScheme: r.colorScheme,
    font: r.font ?? DEFAULT_FONT,
    fontSize: r.fontSize ?? DEFAULT_FONT_SIZE,
    styleOverrides: (r.styleOverrides ?? {}) as Record<string, unknown>,
    jobTitle: r.jobTitle,
    personalInfo: (r.personalInfo as unknown as PersonalInfo) ?? null,
    sections: r.sections.map((s) => ({
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
    <div className="min-h-screen bg-[#f0ede8]">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-[#e8e4dc] px-6 py-3 flex items-center justify-between">
        <p className="text-[0.8rem] text-[#8a8478] m-0">
          <strong className="text-[#0f0e0d] font-semibold">{name}</strong>
          <span className="mx-1.5 opacity-40">·</span>
          Resume
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold no-underline"
          style={{
            color: "#c84b2f",
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
          }}
        >
          ✦ Made with ResumeVerse
        </Link>
      </div>

      {/* ── Resume centred on page ── */}
      <div className="flex justify-center px-4 py-10 pb-20">
        <div
          className="w-full bg-white shadow-[0_4px_6px_rgba(15,14,13,0.04),0_12px_40px_rgba(15,14,13,0.10)]"
          style={{ maxWidth: "794px" }}
        >
          <PrintResume resume={resumeData} isPro={true} />
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4dc] px-6 py-3 flex items-center justify-between z-10">
        <p className="text-[0.75rem] text-[#8a8478]">
          Create your own professional resume — free
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold no-underline px-4 py-2 rounded-sm bg-[#0f0e0d] text-white hover:bg-[#c84b2f] transition-colors"
        >
          Build mine →
        </Link>
      </div>
    </div>
  );
}
