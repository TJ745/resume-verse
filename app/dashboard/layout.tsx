import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-rv-paper text-rv-ink">
      <DashboardTopbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
