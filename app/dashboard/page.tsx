import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ResumeCard from "@/components/dashboard/ResumeCard";
import NewResumeButton from "@/components/dashboard/NewResumeButton";
import UploadResumeButton from "@/components/dashboard/UploadResumeButton";
import UpgradeSuccessBanner from "@/components/dashboard/UpgradeSuccessBanner";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Page header */}
      <div className="flex items-end justify-between mb-10 border-b border-rv-border pb-8">
        <div>
          <p className="uppercase font-semibold tracking-widest mb-2 text-rv-accent text-xs">
            My resumes
          </p>
          <h1 className="font-serif tracking-tight text-4xl">
            Welcome back, <em className="italic text-rv-accent">{firstName}</em>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <UploadResumeButton />
          <span className="w-0.5 h-5 bg-rv-border inline-block" />
          <p className="text-sm text-rv-muted">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
          </p>
        </div>
      </div>

      {/* Resume grid */}
      <div
        className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
"
      >
        <NewResumeButton />
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            id={resume.id}
            title={resume.title}
            template={resume.template}
            updatedAt={resume.updatedAt}
            jobTitle={resume.jobTitle ?? undefined}
          />
        ))}
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="text-center mt-16">
          <p className="font-serif mb-2 text-rv-ink text-2xl">No resumes yet</p>
          <p className="text-rv-muted text-base">
            Create a new resume or upload an existing one to get started.
          </p>
        </div>
      )}

      {/* Upgrade success toast */}
      <Suspense>
        <UpgradeSuccessBanner />
      </Suspense>
    </div>
  );
}
