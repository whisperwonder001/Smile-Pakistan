import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/features/admin/AdminSidebar";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !["ADMIN", "RECEPTIONIST"].includes(session.user.role)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[80vh] flex-col lg:flex-row">
      <AdminSidebar fullName={session.user.name ?? "Staff"} role={session.user.role} />
      <div className="flex-1 bg-bg p-6 lg:p-10">{children}</div>
    </div>
  );
}
