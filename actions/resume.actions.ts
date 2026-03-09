"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user;
}

// ── Create ────────────────────────────────────────────────
export async function createResume() {
  const user = await requireUser();

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Untitled Resume",
      template: "modern",
    },
  });

  revalidatePath("/dashboard");
  redirect(`/builder/${resume.id}`);
}

// ── Rename ────────────────────────────────────────────────
export async function renameResume(resumeId: string, title: string) {
  const user = await requireUser();

  await prisma.resume.updateMany({
    where: { id: resumeId, userId: user.id },
    data: { title: title.trim() || "Untitled Resume" },
  });

  revalidatePath("/dashboard");
}

// ── Delete ────────────────────────────────────────────────
export async function deleteResume(resumeId: string) {
  const user = await requireUser();

  await prisma.resume.deleteMany({
    where: { id: resumeId, userId: user.id },
  });

  revalidatePath("/dashboard");
}

// ── Duplicate ─────────────────────────────────────────────
export async function duplicateResume(resumeId: string) {
  const user = await requireUser();

  const original = await prisma.resume.findFirst({
    where: { id: resumeId, userId: user.id },
    include: { sections: true },
  });

  if (!original) return;

  await prisma.resume.create({
    data: {
      userId: user.id,
      title: `${original.title} (Copy)`,
      template: original.template,
      jobTitle: original.jobTitle,
      sections: {
        create: original.sections.map((s) => ({
          type: s.type,
          title: s.title,
          content: s.content as object,
          order: s.order,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
}
