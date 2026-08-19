import { CalendarClock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityPanel } from "@/features/doctor-portal/AvailabilityPanel";
import { TimeOffSection } from "@/features/doctor-portal/TimeOffSection";

export default async function DoctorAvailabilityPage() {
  const session = await auth();
  const doctorId = session!.user.doctorId!;

  const [doctorBranches, availability, timeOff] = await Promise.all([
    prisma.doctorBranch.findMany({
      where: { doctorId },
      include: { branch: true },
    }),
    prisma.doctorAvailability.findMany({ where: { doctorId } }),
    prisma.doctorTimeOff.findMany({
      where: { doctorId, date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Availability</h1>
        <p className="mt-1 text-sm text-muted">
          Set your working hours at each branch and block off time when you're out. This
          controls what patients can book on the public site.
        </p>
      </Reveal>

      {doctorBranches.length === 0 ? (
        <div className="mt-8 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-5 text-sm text-muted">
          <CalendarClock className="h-4 w-4 shrink-0" />
          You aren't assigned to any branch yet — ask an admin to add you to one.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {doctorBranches.map(({ branch }) => (
            <Reveal key={branch.id}>
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <p className="font-display text-base font-bold text-text">{branch.name}</p>
                <p className="text-xs text-muted">
                  {branch.city} · {branch.hours}
                </p>
                <AvailabilityPanel
                  branchId={branch.id}
                  availability={availability
                    .filter((a) => a.branchId === branch.id)
                    .map((a) => ({
                      weekday: a.weekday,
                      startTime: a.startTime,
                      endTime: a.endTime,
                    }))}
                />
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="font-display text-base font-bold text-text">Time off</p>
              <p className="text-xs text-muted">
                Block a specific date (or part of a date) across all branches.
              </p>
              <TimeOffSection
                timeOff={timeOff.map((t) => ({
                  id: t.id,
                  date: t.date.toISOString(),
                  startTime: t.startTime,
                  endTime: t.endTime,
                  reason: t.reason,
                }))}
              />
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}
