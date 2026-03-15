// import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-rv-paper text-rv-ink">
//       <DashboardTopbar />
//       <main className="pt-16">{children}</main>
//     </div>
//   );
// }

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, aiUsageCount: true },
  });

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
    >
      <DashboardTopbar
        plan={user?.plan ?? "free"}
        aiUsed={user?.aiUsageCount ?? 0}
        aiLimit={10}
      />
      <main style={{ paddingTop: "64px" }}>{children}</main>
    </div>
  );
}
