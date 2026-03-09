import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ResumeCard from "@/components/dashboard/ResumeCard";
import NewResumeButton from "@/components/dashboard/NewResumeButton";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "there";
  const fullName = session.user.name ?? "there";

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Page header */}
      <div className="flex items-end justify-between mb-10 border-b border-rv-border pb-8">
        <div>
          <p className="uppercase font-semibold tracking-widest mb-2 text-xs text-rv-accent">
            My resumes
          </p>
          <h1 className="font-serif text-4xl leading-tight tracking-tight">
            Welcome back,{" "}
            <em className="text-rv-accent">
              {fullName.length > 15 ? firstName : fullName}
            </em>
          </h1>
        </div>

        <p className="text-sm text-rv-muted">
          {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* New resume card */}
        <NewResumeButton />

        {/* Existing resumes */}
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            id={resume.id}
            title={resume.title}
            template={resume.template}
            updatedAt={resume.updatedAt}
          />
        ))}
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="text-center mt-16">
          <p className="font-serif mb-2 text-rv-ink text-2xl">No resumes yet</p>
          <p className="text-rv-muted text-sm">
            Click &ldquo;New resume&rdquo; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
