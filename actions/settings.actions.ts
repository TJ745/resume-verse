"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateName(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) {
    return { error: "Name must be at least 2 characters." };
  }
  if (trimmed.length > 60) {
    return { error: "Name must be under 60 characters." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data:  { name: trimmed },
    });
    return { success: true };
  } catch {
    return { error: "Failed to update name. Please try again." };
  }
}

export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  try {
    // Delete all resumes + sections (cascade) then the user
    await prisma.resume.deleteMany({ where: { userId: session.user.id } });
    await prisma.session.deleteMany({ where: { userId: session.user.id } });
    await prisma.account.deleteMany({ where: { userId: session.user.id } });
    await prisma.user.delete({ where: { id: session.user.id } });
    return { success: true };
  } catch {
    return { error: "Failed to delete account. Please try again." };
  }
}