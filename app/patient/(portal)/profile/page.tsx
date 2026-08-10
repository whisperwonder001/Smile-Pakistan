import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/patient-portal/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const patient = await prisma.patient.findUniqueOrThrow({
    where: { id: patientId },
    include: { user: true, branch: true },
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Profile</h1>
        <p className="mt-1 text-sm text-muted">Your personal details and notification preferences.</p>
      </Reveal>

      <Reveal delay={0.06}>
        <ProfileForm
          fullName={patient.user.fullName}
          email={patient.user.email}
          phone={patient.user.phone ?? ""}
          dob={patient.dob ? patient.dob.toISOString().slice(0, 10) : ""}
          branch={patient.branch ? `${patient.branch.name}, ${patient.branch.city}` : ""}
        />
      </Reveal>
    </div>
  );
}
