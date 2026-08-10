import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { NewDoctorForm } from "@/features/admin/NewDoctorForm";

export default async function AdminDoctorsPage() {
  const [doctors, branches] = await Promise.all([
    prisma.doctor.findMany({
      include: {
        user: true,
        branches: { include: { branch: true } },
        _count: { select: { appointments: true } },
      },
    }),
    prisma.branch.findMany({ select: { id: true, name: true, city: true } }),
  ]);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Doctor Management</h1>
        <p className="mt-1 text-sm text-muted">{doctors.length} doctors on staff.</p>
      </Reveal>

      <div className="mt-4">
        <NewDoctorForm branches={branches} />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d, i) => (
          <Reveal key={d.id} delay={i * 0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary-dark">
              {d.user.fullName.split(" ").slice(1).map((w) => w[0]).join("")}
            </span>
            <p className="mt-3 font-display text-sm font-bold text-text">{d.user.fullName}</p>
            <p className="text-xs text-primary-dark">{d.specialty}</p>
            <p className="mt-2 text-xs text-muted">
              {d.branches.map((b) => b.branch.city).join(", ") || "No branch assigned"}
            </p>
            <p className="mt-1 text-xs text-muted">{d._count.appointments} appointments</p>
          </Reveal>
        ))}
        {doctors.length === 0 && <p className="text-sm text-muted">No doctors yet.</p>}
      </div>
    </div>
  );
}
