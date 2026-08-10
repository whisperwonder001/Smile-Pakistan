import { Stethoscope } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function TreatmentHistoryPage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const notes = await prisma.clinicalNote.findMany({
    where: { appointment: { patientId } },
    include: {
      doctor: { include: { user: true } },
      appointment: { include: { treatment: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Treatment History</h1>
        <p className="mt-1 text-sm text-muted">A full record of your past treatments and clinical notes.</p>
      </Reveal>

      {notes.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No treatment history yet.</p>
      ) : (
        <div className="relative mt-8 space-y-6 border-l border-slate-200 pl-6">
          {notes.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.08} className="relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <Stethoscope className="h-3 w-3" />
              </span>
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-sm font-bold text-text">
                    {n.appointment.treatment.title}
                  </p>
                  <p className="text-xs text-muted">
                    {n.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <p className="mt-1 text-xs text-primary-dark">{n.doctor.user.fullName}</p>
                <p className="mt-3 text-sm leading-relaxed text-text/80">{n.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
