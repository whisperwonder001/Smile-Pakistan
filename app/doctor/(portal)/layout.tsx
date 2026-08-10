import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DoctorSidebar } from "@/features/doctor-portal/DoctorSidebar";

export default async function DoctorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "DOCTOR" || !session.user.doctorId) {
    redirect("/doctor/login");
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id: session.user.doctorId },
    include: { user: true },
  });

  if (!doctor) {
    redirect("/doctor/login");
  }

  return (
    <div className="flex min-h-[80vh] flex-col lg:flex-row">
      <DoctorSidebar fullName={doctor.user.fullName} specialty={doctor.specialty} />
      <div className="flex-1 bg-bg p-6 lg:p-10">{children}</div>
    </div>
  );
}
