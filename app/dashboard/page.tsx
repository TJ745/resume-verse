// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) redirect("/login");

//   return (
//     <div
//       className="min-h-screen"
//       style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
//     >
//       <div className="max-w-5xl mx-auto px-8 py-16">
//         <p
//           className="uppercase font-semibold tracking-widest mb-3"
//           style={{
//             fontSize: "0.7rem",
//             letterSpacing: "0.12em",
//             color: "var(--rv-accent)",
//           }}
//         >
//           Dashboard
//         </p>
//         <h1
//           className="font-serif mb-2"
//           style={{ fontSize: "2.5rem", letterSpacing: "-0.025em" }}
//         >
//           Welcome back,{" "}
//           <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
//             {session.user.name ?? "there"}
//           </em>
//         </h1>
//         <p style={{ color: "var(--rv-muted)", fontSize: "1rem" }}>
//           Your resumes will appear here. Phase 2 coming soon.
//         </p>
//       </div>
//     </div>
//   );
// }

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
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Page header */}
      <div
        className="flex items-end justify-between mb-10"
        style={{
          borderBottom: "1px solid var(--rv-border)",
          paddingBottom: "2rem",
        }}
      >
        <div>
          <p
            className="uppercase font-semibold tracking-widest mb-2"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              color: "var(--rv-accent)",
            }}
          >
            My resumes
          </p>
          <h1
            className="font-serif"
            style={{
              fontSize: "2.25rem",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Welcome back,{" "}
            <em style={{ fontStyle: "italic", color: "var(--rv-accent)" }}>
              {fullName.length > 15 ? firstName : fullName}
            </em>
          </h1>
        </div>

        <p className="text-sm" style={{ color: "var(--rv-muted)" }}>
          {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
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
          <p
            className="font-serif mb-2"
            style={{ fontSize: "1.5rem", color: "var(--rv-ink)" }}
          >
            No resumes yet
          </p>
          <p style={{ color: "var(--rv-muted)", fontSize: "0.9375rem" }}>
            Click &ldquo;New resume&rdquo; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
