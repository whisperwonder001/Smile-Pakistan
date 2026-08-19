"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireDoctor() {
  const session = await auth();
  if (!session?.user?.doctorId) throw new Error("Not authenticated as a doctor");
  return session.user.doctorId;
}

/**
 * Sets (or clears) a doctor's recurring weekly window for one branch +
 * weekday. Simple model: one window per weekday per branch — replaces any
 * existing rows for that slot rather than trying to reconcile multiple
 * split-shift windows, since the doctor portal UI only exposes one window
 * per day. The schema itself supports more; this is a UI-level choice.
 */
export async function setDoctorAvailability(input: {
  branchId: string;
  weekday: number;
  isOff: boolean;
  startTime?: string | null;
  endTime?: string | null;
}) {
  const doctorId = await requireDoctor();
  if (input.weekday < 0 || input.weekday > 6) throw new Error("Invalid weekday");
  if (!input.isOff && (!input.startTime || !input.endTime)) {
    throw new Error("Start and end time are required for a working day");
  }

  await prisma.doctorAvailability.deleteMany({
    where: { doctorId, branchId: input.branchId, weekday: input.weekday },
  });

  if (!input.isOff) {
    await prisma.doctorAvailability.create({
      data: {
        doctorId,
        branchId: input.branchId,
        weekday: input.weekday,
        startTime: input.startTime!,
        endTime: input.endTime!,
      },
    });
  }

  revalidatePath("/doctor/availability");
}

export async function createDoctorTimeOff(input: {
  date: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}) {
  const doctorId = await requireDoctor();
  if (!input.allDay && (!input.startTime || !input.endTime)) {
    throw new Error("Start and end time are required unless it's the whole day");
  }

  await prisma.doctorTimeOff.create({
    data: {
      doctorId,
      date: new Date(input.date + "T00:00:00"),
      startTime: input.allDay ? null : input.startTime,
      endTime: input.allDay ? null : input.endTime,
      reason: input.reason?.trim() || null,
    },
  });

  revalidatePath("/doctor/availability");
}

export async function deleteDoctorTimeOff(id: string) {
  const doctorId = await requireDoctor();
  await prisma.doctorTimeOff.deleteMany({ where: { id, doctorId } });
  revalidatePath("/doctor/availability");
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
