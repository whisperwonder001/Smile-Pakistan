import { notFound } from "next/navigation";
import { Pill, FileText, FileImage, Calendar } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Odontogram } from "@/features/doctor-portal/Odontogram";
import { ClinicalNoteForm } from "@/features/doctor-portal/ClinicalNoteForm";
import { PrescriptionForm } from "@/features/doctor-portal/PrescriptionForm";
import { AppointmentStatusButtons } from "@/features/doctor-portal/AppointmentStatusButtons";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const doctorId = session!.user.doctorId!;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      user: true,
      branch: true,
      medicalRecords: true,
      odontogram: true,
      prescriptions: { orderBy: { createdAt: "desc" }, include: { doctor: { include: { user: true } } } },
      xrays: { orderBy: { takenAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) notFound();

  // Only show this doctor's own appointment history with the patient —
  // other doctors' notes stay private to their own visits.
  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id, doctorId },
    include: { treatment: true, clinicalNotes: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-lg font-bold text-primary-dark">
            {patient.user.fullName.split(" ").map((w) => w[0]).join("")}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-text">
              {patient.user.fullName}
            </h1>
            <p className="text-sm text-muted">
              {patient.user.email} · {patient.user.phone ?? "No phone on file"}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-6">
          <h2 className="font-display text-base font-bold text-text">Odontogram</h2>
          <div className="mt-4">
            <Odontogram
              patientId={patient.id}
              entries={patient.odontogram.map((o) => ({
                toothNumber: o.toothNumber,
                condition: o.condition,
              }))}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-text">Prescriptions</h2>
            <Pill className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {patient.prescriptions.length === 0 && (
              <p className="text-sm text-muted">No prescriptions yet.</p>
            )}
            {patient.prescriptions.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-100 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">{p.medication}</p>
                  <p className="text-xs text-muted">
                    {p.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {p.dosage} · {p.duration}
                </p>
                {p.notes && <p className="mt-1 text-xs text-text/70">{p.notes}</p>}
              </div>
            ))}
          </div>
          <PrescriptionForm patientId={patient.id} />
        </Reveal>
      </div>

      <Reveal delay={0.14} className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text">
            Appointments with you
          </h2>
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-4 space-y-4">
          {appointments.length === 0 && (
            <p className="text-sm text-muted">No appointments with this patient yet.</p>
          )}
          {appointments.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{a.treatment.title}</p>
                  <p className="text-xs text-muted">
                    {a.startsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
                    {a.startsAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })} ·{" "}
                    {a.status}
                  </p>
                </div>
                <AppointmentStatusButtons appointmentId={a.id} patientId={patient.id} status={a.status} />
              </div>
              {a.clinicalNotes.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                  {a.clinicalNotes.map((n) => (
                    <li key={n.id} className="text-xs text-text/70">
                      • {n.note}
                    </li>
                  ))}
                </ul>
              )}
              <ClinicalNoteForm appointmentId={a.id} patientId={patient.id} />
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-text">X-rays</h2>
            <FileImage className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {patient.xrays.length === 0 && <p className="text-sm text-muted">None on file.</p>}
            {patient.xrays.map((x) => (
              <div key={x.id} className="flex items-center justify-between text-sm">
                <span className="text-text/80">{x.label}</span>
                <span className="text-xs text-muted">
                  {x.takenAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-text">Documents</h2>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {patient.documents.length === 0 && <p className="text-sm text-muted">None on file.</p>}
            {patient.documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-text/80">{d.name}</span>
                <span className="text-xs text-muted">{d.type}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
