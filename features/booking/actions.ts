"use server";

import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/email";
import { issueActivation } from "@/lib/activation";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface SubmitBookingInput {
  serviceSlug: string;
  branchId: string;
  doctorId: string;
  dateISO: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  notes?: string;
}

function parseSlotToDate(dateISO: string, time: string): Date {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  let hour = match ? parseInt(match[1], 10) : 10;
  const minute = match ? parseInt(match[2], 10) : 0;
  const meridiem = match?.[3]?.toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const d = new Date(dateISO + "T00:00:00");
  d.setHours(hour, minute, 0, 0);
  return d;
}

export async function submitBooking(input: SubmitBookingInput) {
  const treatment = await prisma.treatment.findUnique({
    where: { slug: input.serviceSlug },
  });
  if (!treatment) throw new Error("Unknown treatment");

  let user = await prisma.user.findUnique({ where: { email: input.email } });
  let isNewUser = false;
  if (!user) {
    // New patients booking online don't set a password at this step — a
    // random hash is stored as a placeholder. issueActivation() below
    // emails them a set-password link (app/activate/[token]) so they can
    // actually log in to the Patient Portal.
    const tempHash = await bcrypt.hash(crypto.randomUUID(), 10);
    user = await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        passwordHash: tempHash,
        role: "PATIENT",
      },
    });
    isNewUser = true;
  }

  let patient = await prisma.patient.findUnique({ where: { userId: user.id } });
  if (!patient) {
    patient = await prisma.patient.create({
      data: { userId: user.id, branchId: input.branchId },
    });
  }

  const startsAt = parseSlotToDate(input.dateISO, input.time);

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: input.doctorId,
      branchId: input.branchId,
      treatmentId: treatment.id,
      startsAt,
      status: "REQUESTED",
      notes: input.notes || null,
    },
  });

  await prisma.invoice.create({
    data: {
      patientId: patient.id,
      appointmentId: appointment.id,
      branchId: input.branchId,
      amount: treatment.priceFrom,
      status: "UNPAID",
      description: treatment.title,
    },
  });

  const reference = `SP-${appointment.id.slice(-8).toUpperCase()}`;

  await notifyUser({
    userId: user.id,
    email: user.email,
    title: "Your appointment request is in",
    body: `We've received your request for ${treatment.title} on ${startsAt.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    )} at ${input.time}. Reference: ${reference}. We'll confirm shortly.`,
  });

  if (isNewUser) {
    await issueActivation({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: "PATIENT",
    });
  }

  return { reference };
}
