import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--rv-paper)", color: "var(--rv-ink)" }}
    >
      <DashboardTopbar />
      <main style={{ paddingTop: "64px" }}>{children}</main>
    </div>
  );
}
