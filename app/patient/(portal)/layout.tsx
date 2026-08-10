import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortalSidebar } from "@/features/patient-portal/PortalSidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "PATIENT" || !session.user.patientId) {
    redirect("/patient/login");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: session.user.patientId },
    include: { user: true, branch: true },
  });

  if (!patient) {
    redirect("/patient/login");
  }

  return (
    <div className="flex min-h-[80vh] flex-col lg:flex-row">
      <PortalSidebar
        fullName={patient.user.fullName}
        branch={patient.branch ? `${patient.branch.name}, ${patient.branch.city}` : ""}
      />
      <div className="flex-1 bg-bg p-6 lg:p-10">{children}</div>
    </div>
  );
}
