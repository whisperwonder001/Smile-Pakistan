import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-warning/10 text-warning",
  CONFIRMED: "bg-primary/10 text-primary-dark",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
  NO_SHOW: "bg-danger/10 text-danger",
};

const statusLabels: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

export default async function AppointmentsPage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: { treatment: true, doctor: { include: { user: true } }, branch: true },
    orderBy: { startsAt: "desc" },
  });

  const upcoming = appointments.filter((a) => ["REQUESTED", "CONFIRMED"].includes(a.status));
  const past = appointments.filter((a) => !["REQUESTED", "CONFIRMED"].includes(a.status));

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Appointments</h1>
        <p className="mt-1 text-sm text-muted">Your upcoming and past visits.</p>
      </Reveal>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upcoming</p>
        <div className="mt-3 space-y-3">
          {upcoming.length === 0 && (
            <p className="text-sm text-muted">No upcoming appointments.</p>
          )}
          {upcoming.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <p className="font-display text-sm font-bold text-text">{a.treatment.title}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[a.status])}>
                      {statusLabels[a.status]}
                    </span>
                  </div>
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
                      {a.branch.name}, {a.branch.city}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">with {a.doctor.user.fullName}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text hover:border-primary/40">
                    Reschedule
                  </button>
                  <button className="rounded-full border border-danger/20 px-4 py-2 text-xs font-semibold text-danger hover:bg-danger/5">
                    Cancel
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Past</p>
        <div className="mt-3 space-y-3">
          {past.length === 0 && <p className="text-sm text-muted">No past appointments yet.</p>}
          {past.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted" />
                    <p className="font-display text-sm font-bold text-text">{a.treatment.title}</p>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[a.status])}>
                      {statusLabels[a.status]}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {a.startsAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span>with {a.doctor.user.fullName}</span>
                  </div>
                </div>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text hover:border-primary/40">
                  Book Similar
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
