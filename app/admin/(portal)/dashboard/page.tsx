import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, CalendarCheck, Stethoscope } from "lucide-react";

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalPatients,
    totalDoctors,
    appointmentsThisMonth,
    paidInvoicesThisMonth,
    statusBreakdown,
    topTreatments,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { startsAt: { gte: startOfMonth } } }),
    prisma.invoice.findMany({ where: { status: "PAID", createdAt: { gte: startOfMonth } } }),
    prisma.appointment.groupBy({ by: ["status"], _count: true }),
    prisma.appointment.groupBy({
      by: ["treatmentId"],
      _count: true,
      orderBy: { _count: { treatmentId: "desc" } },
      take: 5,
    }),
  ]);

  const revenueThisMonth = paidInvoicesThisMonth.reduce((s, i) => s + i.amount, 0);

  const treatmentIds = topTreatments.map((t) => t.treatmentId);
  const treatments = await prisma.treatment.findMany({ where: { id: { in: treatmentIds } } });
  const treatmentMap = new Map<string, string>(
    treatments.map((t): [string, string] => [t.id, t.title])
  );

  const stats = [
    { label: "Patients", value: totalPatients, icon: Users },
    { label: "Doctors", value: totalDoctors, icon: Stethoscope },
    { label: "Appointments this month", value: appointmentsThisMonth, icon: CalendarCheck },
    { label: "Revenue this month", value: `PKR ${revenueThisMonth.toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Practice overview across all branches.</p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 font-display text-xl font-bold text-text">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.1} className="rounded-2xl border border-slate-100 bg-white p-6">
          <h2 className="font-display text-base font-bold text-text">
            Appointments by status
          </h2>
          <div className="mt-4 space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <span className="text-text/70">{s.status}</span>
                <span className="font-semibold text-text">{s._count}</span>
              </div>
            ))}
            {statusBreakdown.length === 0 && (
              <p className="text-sm text-muted">No appointment data yet.</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.14} className="rounded-2xl border border-slate-100 bg-white p-6">
          <h2 className="font-display text-base font-bold text-text">
            Most booked treatments
          </h2>
          <div className="mt-4 space-y-3">
            {topTreatments.map((t) => (
              <div key={t.treatmentId} className="flex items-center justify-between text-sm">
                <span className="text-text/70">
                  {treatmentMap.get(t.treatmentId) ?? "Unknown"}
                </span>
                <span className="font-semibold text-text">{t._count}</span>
              </div>
            ))}
            {topTreatments.length === 0 && (
              <p className="text-sm text-muted">No booking data yet.</p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
