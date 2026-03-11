// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";
// import type { SectionType, SectionContent, PersonalInfo } from "@/types/resume";

// async function requireOwner(resumeId: string) {
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) redirect("/login");
//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, userId: session.user.id },
//   });
//   if (!resume) redirect("/dashboard");
//   return { user: session.user, resume };
// }

// // ── Update resume meta ────────────────────────────────────
// export async function updateResumeMeta(
//   resumeId: string,
//   data: {
//     title?: string;
//     jobTitle?: string;
//     template?: string;
//     colorScheme?: string;
//   },
// ) {
//   await requireOwner(resumeId);
//   await prisma.resume.update({ where: { id: resumeId }, data });
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Add section — returns the new section so client can use it ──
// export async function addSection(
//   resumeId: string,
//   type: SectionType,
// ): Promise<{
//   id: string;
//   resumeId: string;
//   type: string;
//   title: string;
//   content: unknown;
//   order: number;
// }> {
//   await requireOwner(resumeId);

//   const existing = await prisma.resumeSection.count({ where: { resumeId } });

//   const DEFAULTS: Record<
//     SectionType,
//     { title: string; content: SectionContent }
//   > = {
//     summary: { title: "Summary", content: { text: "" } },
//     experience: { title: "Experience", content: [] },
//     education: { title: "Education", content: [] },
//     skills: { title: "Skills", content: { categories: [] } },
//     projects: { title: "Projects", content: [] },
//     certifications: { title: "Certifications", content: [] },
//     languages: { title: "Languages", content: [] },
//     awards: { title: "Awards", content: [] },
//     volunteer: { title: "Volunteer", content: [] },
//   };

//   const def = DEFAULTS[type] ?? { title: type, content: [] };

//   const created = await prisma.resumeSection.create({
//     data: {
//       resumeId,
//       type,
//       title: def.title,
//       content: def.content as object,
//       order: existing,
//     },
//   });

//   revalidatePath(`/builder/${resumeId}`);
//   return created;
// }

// // ── Save section content ──────────────────────────────────
// export async function saveSection(
//   resumeId: string,
//   sectionId: string,
//   content: SectionContent,
// ) {
//   await requireOwner(resumeId);
//   await prisma.resumeSection.updateMany({
//     where: { id: sectionId, resumeId },
//     data: { content: content as object },
//   });
//   // no revalidatePath — client manages state, avoid full reload on every keystroke
// }

// // ── Delete section ────────────────────────────────────────
// export async function deleteSection(resumeId: string, sectionId: string) {
//   await requireOwner(resumeId);
//   await prisma.resumeSection.deleteMany({ where: { id: sectionId, resumeId } });
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Reorder sections ──────────────────────────────────────
// export async function reorderSections(resumeId: string, orderedIds: string[]) {
//   await requireOwner(resumeId);
//   await Promise.all(
//     orderedIds.map((id, index) =>
//       prisma.resumeSection.updateMany({
//         where: { id, resumeId },
//         data: { order: index },
//       }),
//     ),
//   );
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Save personal info ────────────────────────────────────
// export async function savePersonalInfo(
//   resumeId: string,
//   personalInfo: PersonalInfo,
// ) {
//   await requireOwner(resumeId);
//   await prisma.resume.update({
//     where: { id: resumeId },
//     data: {
//       personalInfo: personalInfo as object,
//       jobTitle: personalInfo.jobTitle,
//       title: personalInfo.fullName || undefined,
//     },
//   });
//   // no revalidatePath — avoid full reload on keystrokes
// }

// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";
// import type { SectionType, SectionContent, PersonalInfo } from "@/types/resume";

// async function requireOwner(resumeId: string) {
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) redirect("/login");
//   const resume = await prisma.resume.findFirst({
//     where: { id: resumeId, userId: session.user.id },
//   });
//   if (!resume) redirect("/dashboard");
//   return { user: session.user, resume };
// }

// // ── Update resume meta ────────────────────────────────────
// export async function updateResumeMeta(
//   resumeId: string,
//   data: {
//     title?: string;
//     jobTitle?: string;
//     template?: string;
//     colorScheme?: string;
//   },
// ) {
//   await requireOwner(resumeId);
//   await prisma.resume.update({ where: { id: resumeId }, data });
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Add section — returns the new section so client can use it ──
// export async function addSection(
//   resumeId: string,
//   type: SectionType,
// ): Promise<{
//   id: string;
//   resumeId: string;
//   type: string;
//   title: string;
//   content: unknown;
//   order: number;
// }> {
//   await requireOwner(resumeId);

//   const existing = await prisma.resumeSection.count({ where: { resumeId } });

//   const DEFAULTS: Record<
//     SectionType,
//     { title: string; content: SectionContent }
//   > = {
//     summary: { title: "Summary", content: { text: "" } },
//     experience: { title: "Experience", content: [] },
//     education: { title: "Education", content: [] },
//     skills: { title: "Skills", content: { categories: [] } },
//     projects: { title: "Projects", content: [] },
//     certifications: { title: "Certifications", content: [] },
//     languages: { title: "Languages", content: [] },
//     awards: { title: "Awards", content: [] },
//     volunteer: { title: "Volunteer", content: [] },
//   };

//   const def = DEFAULTS[type] ?? { title: type, content: [] };

//   const created = await prisma.resumeSection.create({
//     data: {
//       resumeId,
//       type,
//       title: def.title,
//       content: def.content as object,
//       order: existing,
//     },
//   });

//   // No revalidatePath — client appends the new section to state directly
//   return created;
// }

// // ── Save section content ──────────────────────────────────
// export async function saveSection(
//   resumeId: string,
//   sectionId: string,
//   content: SectionContent,
// ) {
//   await requireOwner(resumeId);
//   await prisma.resumeSection.updateMany({
//     where: { id: sectionId, resumeId },
//     data: { content: content as object },
//   });
//   // no revalidatePath — client manages state, avoid full reload on every keystroke
// }

// // ── Delete section ────────────────────────────────────────
// export async function deleteSection(resumeId: string, sectionId: string) {
//   await requireOwner(resumeId);
//   await prisma.resumeSection.deleteMany({ where: { id: sectionId, resumeId } });
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Reorder sections ──────────────────────────────────────
// export async function reorderSections(resumeId: string, orderedIds: string[]) {
//   await requireOwner(resumeId);
//   await Promise.all(
//     orderedIds.map((id, index) =>
//       prisma.resumeSection.updateMany({
//         where: { id, resumeId },
//         data: { order: index },
//       }),
//     ),
//   );
//   revalidatePath(`/builder/${resumeId}`);
// }

// // ── Save personal info ────────────────────────────────────
// export async function savePersonalInfo(
//   resumeId: string,
//   personalInfo: PersonalInfo,
// ) {
//   await requireOwner(resumeId);
//   await prisma.resume.update({
//     where: { id: resumeId },
//     data: {
//       personalInfo: personalInfo as object,
//       jobTitle: personalInfo.jobTitle,
//       title: personalInfo.fullName || undefined,
//     },
//   });
//   // no revalidatePath — avoid full reload on keystrokes
// }

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SectionType, SectionContent, PersonalInfo } from "@/types/resume";

async function requireOwner(resumeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });
  if (!resume) redirect("/dashboard");
  return { user: session.user, resume };
}

// ── Update resume meta ────────────────────────────────────
export async function updateResumeMeta(
  resumeId: string,
  data: {
    title?: string;
    jobTitle?: string;
    template?: string;
    colorScheme?: string;
  },
) {
  await requireOwner(resumeId);
  await prisma.resume.update({ where: { id: resumeId }, data });
  revalidatePath(`/builder/${resumeId}`);
}

// ── Add section — returns the new section so client can use it ──
export async function addSection(
  resumeId: string,
  type: SectionType,
): Promise<{
  id: string;
  resumeId: string;
  type: string;
  title: string;
  content: unknown;
  order: number;
}> {
  await requireOwner(resumeId);

  const existing = await prisma.resumeSection.count({ where: { resumeId } });

  const DEFAULTS: Record<
    SectionType,
    { title: string; content: SectionContent }
  > = {
    summary: { title: "Summary", content: { text: "" } },
    experience: { title: "Experience", content: [] },
    education: { title: "Education", content: [] },
    skills: { title: "Skills", content: { categories: [] } },
    projects: { title: "Projects", content: [] },
    certifications: { title: "Certifications", content: [] },
    languages: { title: "Languages", content: [] },
    awards: { title: "Awards", content: [] },
    volunteer: { title: "Volunteer", content: [] },
  };

  const def = DEFAULTS[type] ?? { title: type, content: [] };

  const created = await prisma.resumeSection.create({
    data: {
      resumeId,
      type,
      title: def.title,
      content: def.content as object,
      order: existing,
    },
  });

  // No revalidatePath — client appends the new section to state directly
  return created;
}

// ── Save section content ──────────────────────────────────
export async function saveSection(
  resumeId: string,
  sectionId: string,
  content: SectionContent,
) {
  await requireOwner(resumeId);
  await prisma.resumeSection.updateMany({
    where: { id: sectionId, resumeId },
    data: { content: content as object },
  });
  // no revalidatePath — client manages state, avoid full reload on every keystroke
}

// ── Delete section ────────────────────────────────────────
export async function deleteSection(resumeId: string, sectionId: string) {
  await requireOwner(resumeId);
  await prisma.resumeSection.deleteMany({ where: { id: sectionId, resumeId } });
  revalidatePath(`/builder/${resumeId}`);
}

// ── Reorder sections ──────────────────────────────────────
export async function reorderSections(resumeId: string, orderedIds: string[]) {
  await requireOwner(resumeId);
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.resumeSection.updateMany({
        where: { id, resumeId },
        data: { order: index },
      }),
    ),
  );
  revalidatePath(`/builder/${resumeId}`);
}

// ── Save personal info ────────────────────────────────────
export async function savePersonalInfo(
  resumeId: string,
  personalInfo: PersonalInfo,
) {
  await requireOwner(resumeId);
  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      personalInfo: personalInfo as object,
      jobTitle: personalInfo.jobTitle,
      // title is the resume's display name — never overwrite it with fullName
    },
  });
  // no revalidatePath — avoid full reload on keystrokes
}
