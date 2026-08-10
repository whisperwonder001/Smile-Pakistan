"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireDoctor() {
  const session = await auth();
  if (!session?.user?.doctorId) throw new Error("Not authenticated as a doctor");
  return session.user.doctorId;
}

const CONDITIONS = ["Healthy", "Decayed", "Filled", "Crowned", "Missing", "Implant"] as const;

export async function cycleToothCondition(patientId: string, toothNumber: number) {
  await requireDoctor();

  const existing = await prisma.odontogramEntry.findUnique({
    where: { patientId_toothNumber: { patientId, toothNumber } },
  });

  const currentIndex = existing ? CONDITIONS.indexOf(existing.condition as (typeof CONDITIONS)[number]) : -1;
  const next = CONDITIONS[(currentIndex + 1) % CONDITIONS.length];

  await prisma.odontogramEntry.upsert({
    where: { patientId_toothNumber: { patientId, toothNumber } },
    update: { condition: next },
    create: { patientId, toothNumber, condition: next },
  });

  revalidatePath(`/doctor/patients/${patientId}`);
}

export async function addClinicalNote(input: {
  appointmentId: string;
  patientId: string;
  note: string;
}) {
  const doctorId = await requireDoctor();
  if (!input.note.trim()) return;

  await prisma.clinicalNote.create({
    data: {
      appointmentId: input.appointmentId,
      doctorId,
      note: input.note.trim(),
    },
  });

  revalidatePath(`/doctor/patients/${input.patientId}`);
}

export async function addPrescription(input: {
  patientId: string;
  medication: string;
  dosage: string;
  duration: string;
  notes?: string;
}) {
  const doctorId = await requireDoctor();

  await prisma.prescription.create({
    data: {
      patientId: input.patientId,
      doctorId,
      medication: input.medication,
      dosage: input.dosage,
      duration: input.duration,
      notes: input.notes || null,
    },
  });

  revalidatePath(`/doctor/patients/${input.patientId}`);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  patientId: string,
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
) {
  await requireDoctor();

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath(`/doctor/patients/${patientId}`);
  revalidatePath("/doctor/appointments");
  revalidatePath("/doctor/dashboard");
}
