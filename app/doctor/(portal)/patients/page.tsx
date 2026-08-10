import Link from "next/link";
import { Search } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DoctorPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const doctorId = session!.user.doctorId!;
  const { q } = await searchParams;

  const patientLinks = await prisma.appointment.findMany({
    where: {
      doctorId,
      ...(q
        ? { patient: { user: { fullName: { contains: q, mode: "insensitive" } } } }
        : {}),
    },
    distinct: ["patientId"],
    include: { patient: { include: { user: true, branch: true } } },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Patients</h1>
        <p className="mt-1 text-sm text-muted">Everyone you've treated or have scheduled.</p>
      </Reveal>

      <Reveal delay={0.06}>
        <form className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search patients by name…"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </form>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patientLinks.length === 0 && (
          <p className="text-sm text-muted">No patients found.</p>
        )}
        {patientLinks.map((a, i) => (
          <Reveal key={a.patient.id} delay={i * 0.05}>
            <Link
              href={`/doctor/patients/${a.patient.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-primary/30"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary-dark">
                {a.patient.user.fullName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-text">
                  {a.patient.user.fullName}
                </p>
                <p className="text-xs text-muted">
                  {a.patient.branch ? `${a.patient.branch.city}` : "No branch on file"}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
