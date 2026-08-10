import Link from "next/link";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DoctorDashboardPage() {
  const session = await auth();
  const doctorId = session!.user.doctorId!;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [todayAppointments, upcomingCount, patientCount] = await Promise.all([
    prisma.appointment.findMany({
      where: { doctorId, startsAt: { gte: startOfDay, lte: endOfDay } },
      include: { patient: { include: { user: true } }, treatment: true, branch: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.appointment.count({
      where: { doctorId, status: { in: ["REQUESTED", "CONFIRMED"] } },
    }),
    prisma.appointment.findMany({
      where: { doctorId },
      distinct: ["patientId"],
      select: { patientId: true },
    }),
  ]);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">
          Today's Schedule
        </h1>
        <p className="mt-1 text-sm text-muted">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today</p>
          <p className="mt-2 font-display text-lg font-bold text-text">
            {todayAppointments.length} appointment{todayAppointments.length !== 1 ? "s" : ""}
          </p>
        </Reveal>
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upcoming</p>
          <p className="mt-2 font-display text-lg font-bold text-text">{upcomingCount} total</p>
        </Reveal>
        <Reveal delay={0.12} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Patients</p>
          <p className="mt-2 font-display text-lg font-bold text-text">{patientCount.length}</p>
        </Reveal>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Schedule</p>
        <div className="mt-3 space-y-3">
          {todayAppointments.length === 0 && (
            <p className="text-sm text-muted">No appointments scheduled for today.</p>
          )}
          {todayAppointments.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <Link
                href={`/doctor/patients/${a.patient.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                    <span className="text-xs font-bold">
                      {a.startsAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-text">
                      {a.patient.user.fullName}
                    </p>
                    <p className="text-xs text-muted">{a.treatment.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {a.branch.name}
                  </span>
                  {a.status === "COMPLETED" ? (
                    <span className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {a.status === "CONFIRMED" ? "Confirmed" : "Requested"}
                    </span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
