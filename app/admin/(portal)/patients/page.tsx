import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";

export default async function AdminPatientsPage() {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
      branch: true,
      _count: { select: { appointments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Patient Management</h1>
        <p className="mt-1 text-sm text-muted">{patients.length} registered patients.</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-bg text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Branch</th>
              <th className="px-5 py-3">Visits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3.5 font-medium text-text">{p.user.fullName}</td>
                <td className="px-5 py-3.5 text-muted">
                  {p.user.email}
                  {p.user.phone && <span className="block text-xs">{p.user.phone}</span>}
                </td>
                <td className="px-5 py-3.5 text-muted">
                  {p.branch ? `${p.branch.city}` : "—"}
                </td>
                <td className="px-5 py-3.5 text-muted">{p._count.appointments}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-muted">
                  No patients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
