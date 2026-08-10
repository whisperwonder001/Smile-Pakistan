import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppointmentStatusButtons } from "@/features/doctor-portal/AppointmentStatusButtons";

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-warning/10 text-warning",
  CONFIRMED: "bg-primary/10 text-primary-dark",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
  NO_SHOW: "bg-danger/10 text-danger",
};

export default async function DoctorAppointmentsPage() {
  const session = await auth();
  const doctorId = session!.user.doctorId!;

  const appointments = await prisma.appointment.findMany({
    where: { doctorId },
    include: { patient: { include: { user: true } }, treatment: true, branch: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Appointments</h1>
        <p className="mt-1 text-sm text-muted">Your full schedule, past and upcoming.</p>
      </Reveal>

      <div className="mt-8 space-y-3">
        {appointments.length === 0 && (
          <p className="text-sm text-muted">No appointments yet.</p>
        )}
        {appointments.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.04}>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <Link href={`/doctor/patients/${a.patient.id}`} className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-text">
                    {a.patient.user.fullName}
                  </p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[a.status])}>
                    {a.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{a.treatment.title}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {a.startsAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {a.startsAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {a.branch.name}
                  </span>
                </div>
              </Link>
              <AppointmentStatusButtons appointmentId={a.id} patientId={a.patient.id} status={a.status} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
