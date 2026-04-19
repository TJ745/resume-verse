// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import ResumeCard from "@/components/dashboard/ResumeCard";
// import NewResumeButton from "@/components/dashboard/NewResumeButton";
// import UploadResumeButton from "@/components/dashboard/UploadResumeButton";
// import UpgradeSuccessBanner from "@/components/dashboard/UpgradeSuccessBanner";

// export default async function DashboardPage() {
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) redirect("/login");

//   const resumes = await prisma.resume.findMany({
//     where: { userId: session.user.id },
//     orderBy: { updatedAt: "desc" },
//   });

//   const firstName = session.user.name?.split(" ")[0] ?? "there";

//   return (
//     <div className="max-w-6xl mx-auto px-8 py-12">
//       {/* Page header */}
//       <div className="flex items-end justify-between mb-10 pb-8 border-b border-rv-border">
//         <div>
//           <p className="text-[0.7rem] uppercase font-semibold tracking-[0.12em] text-rv-accent mb-2">
//             My resumes
//           </p>
//           <h1 className="font-serif text-[2.25rem] leading-[1.1] tracking-[-0.025em]">
//             Welcome back, <em className="italic text-rv-accent">{firstName}</em>
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <UploadResumeButton />
//           <span className="w-px h-5 bg-rv-border inline-block shrink-0" />
//           <p className="text-sm text-rv-muted whitespace-nowrap">
//             {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
//           </p>
//         </div>
//       </div>

//       {/* Resume grid */}
//       <div
//         className="grid gap-5"
//         style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
//       >
//         <NewResumeButton />
//         <Suspense fallback={null}>
//           {resumes.map((resume) => (
//             <ResumeCard
//               key={resume.id}
//               id={resume.id}
//               title={resume.title}
//               template={resume.template}
//               colorScheme={resume.colorScheme}
//               updatedAt={resume.updatedAt}
//               jobTitle={resume.jobTitle ?? undefined}
//             />
//           ))}
//         </Suspense>
//       </div>

//       {/* Empty state */}
//       {resumes.length === 0 && (
//         <div className="text-center mt-16">
//           <p className="font-serif text-[1.5rem] text-rv-ink mb-2">
//             No resumes yet
//           </p>
//           <p className="text-rv-muted text-[0.9375rem]">
//             Create a new resume or upload an existing one to get started.
//           </p>
//         </div>
//       )}

//       {/* Upgrade success toast */}
//       <Suspense>
//         <UpgradeSuccessBanner />
//       </Suspense>
//     </div>
//   );
// }

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
      <div className="flex items-end justify-between mb-10 pb-8 border-b border-rv-border">
        <div>
          <p className="text-[0.7rem] uppercase font-semibold tracking-[0.12em] text-rv-accent mb-2">
            My resumes
          </p>
          <h1 className="font-serif text-[2.25rem] leading-[1.1] tracking-[-0.025em]">
            Welcome back, <em className="italic text-rv-accent">{firstName}</em>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <UploadResumeButton />
          <span className="w-px h-5 bg-rv-border inline-block shrink-0" />
          <p className="text-sm text-rv-muted whitespace-nowrap">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
          </p>
        </div>
      </div>

      {/* Resume grid */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        <NewResumeButton />
        <Suspense fallback={null}>
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              id={resume.id}
              title={resume.title}
              template={resume.template}
              colorScheme={resume.colorScheme}
              font={
                (resume as typeof resume & { font?: string }).font ?? "dm-sans"
              }
              fontSize={
                (resume as typeof resume & { fontSize?: string }).fontSize ??
                "md"
              }
              updatedAt={resume.updatedAt}
              jobTitle={resume.jobTitle ?? undefined}
            />
          ))}
        </Suspense>
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="text-center mt-16">
          <p className="font-serif text-[1.5rem] text-rv-ink mb-2">
            No resumes yet
          </p>
          <p className="text-rv-muted text-[0.9375rem]">
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
