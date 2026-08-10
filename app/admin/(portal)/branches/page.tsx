import { MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { NewBranchForm } from "@/features/admin/NewBranchForm";
import { BranchHoursPanel } from "@/features/admin/BranchHoursPanel";

export default async function AdminBranchesPage() {
  const branches = await prisma.branch.findMany({
    include: {
      _count: { select: { appointments: true, patients: true } },
      workingHours: true,
      holidays: { orderBy: { date: "asc" } },
    },
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Clinic Branches</h1>
        <p className="mt-1 text-sm text-muted">{branches.length} active branches.</p>
      </Reveal>

      <div className="mt-4">
        <NewBranchForm />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {branches.map((b, i) => (
          <Reveal key={b.id} delay={i * 0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
            <p className="font-display text-base font-bold text-text">{b.city}</p>
            <p className="text-sm text-primary-dark">{b.name}</p>
            <div className="mt-3 flex items-start gap-2 text-xs text-muted">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {b.address}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {b.hours}
            </div>
            <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs text-muted">
              <span>{b._count.patients} patients</span>
              <span>{b._count.appointments} appointments</span>
            </div>

            <BranchHoursPanel
              branchId={b.id}
              workingHours={b.workingHours}
              holidays={b.holidays.map((h) => ({ ...h, date: h.date.toISOString() }))}
            />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">
        Editing or deactivating an existing branch isn't wired up yet — only
        adding new branches and managing their hours/holidays is. The
        booking engine doesn't check these hours/holidays against available
        slots yet either — that's the next step to give this data real
        effect.
      </p>
    </div>
  );
}
