"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { notifyUser } from "@/lib/email";
import { issueActivation } from "@/lib/activation";

async function requireStaff() {
  const session = await auth();
  if (!session || !["ADMIN", "RECEPTIONIST"].includes(session.user.role)) {
    throw new Error("Not authorized");
  }
  return session.user;
}

// Roles & Permissions is admin-only — receptionists can manage day-to-day
// operations but shouldn't be able to grant themselves or others more
// access.
async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session.user;
}

export async function markInvoicePaid(
  invoiceId: string,
  method: "CASH" | "CARD" | "STRIPE" | "PAYPAL" | "JAZZCASH" | "EASYPAISA"
) {
  await requireStaff();
  const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } });

  await prisma.$transaction([
    prisma.invoice.update({ where: { id: invoiceId }, data: { status: "PAID" } }),
    prisma.payment.create({
      data: { invoiceId, amount: invoice.amount, method },
    }),
  ]);

  revalidatePath("/admin/billing");
  revalidatePath("/admin/dashboard");
}

export async function createBranch(input: {
  name: string;
  city: string;
  address: string;
  hours: string;
}) {
  await requireStaff();
  if (!input.name || !input.city || !input.address || !input.hours) {
    throw new Error("All fields are required");
  }

  await prisma.branch.create({ data: input });

  revalidatePath("/admin/branches");
  revalidatePath("/book-appointment");
}

export async function createDoctor(input: {
  fullName: string;
  email: string;
  phone?: string;
  specialty: string;
  bio?: string;
  branchIds: string[];
}) {
  await requireStaff();
  if (!input.fullName || !input.email || !input.specialty || input.branchIds.length === 0) {
    throw new Error("Name, email, specialty, and at least one branch are required");
  }

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error("A user with that email already exists");
  }

  // Doctors created via this form get a random unusable password hash —
  // issueActivation() below emails them a set-password link so they can
  // actually log in, same flow used for booking-wizard patients.
  const randomPassword = randomUUID() + randomUUID();
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  const newUser = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      phone: input.phone || null,
      passwordHash,
      role: "DOCTOR",
      doctor: {
        create: {
          specialty: input.specialty,
          bio: input.bio || null,
          branches: {
            create: input.branchIds.map((branchId) => ({ branchId })),
          },
        },
      },
    },
  });

  await issueActivation({
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: "DOCTOR",
  });

  revalidatePath("/admin/doctors");
  revalidatePath("/book-appointment");
}

export async function updateAppointmentStatusAdmin(
  appointmentId: string,
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
) {
  await requireStaff();
  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      patient: { include: { user: true } },
      treatment: true,
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");

  const statusMessages: Partial<Record<typeof status, string>> = {
    CONFIRMED: `Your appointment for ${appointment.treatment.title} on ${appointment.startsAt.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    )} is confirmed. See you then!`,
    CANCELLED: `Your appointment for ${appointment.treatment.title} on ${appointment.startsAt.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    )} has been cancelled. Contact us if you'd like to rebook.`,
    COMPLETED: `Thanks for visiting Smile Pakistan for your ${appointment.treatment.title} appointment. We hope it went well!`,
  };
  const message = statusMessages[status];

  if (message) {
    await notifyUser({
      userId: appointment.patient.user.id,
      email: appointment.patient.user.email,
      title: `Appointment ${status.toLowerCase()}`,
      body: message,
    });
  }
}

// ── Blog CMS ──────────────────────────────────────────────────────────

export async function createBlogPost(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}) {
  await requireStaff();
  await prisma.blog.create({
    data: { ...input, status: "Draft" },
  });
  revalidatePath("/admin/cms/blog");
}

export async function toggleBlogStatus(blogId: string, currentStatus: string) {
  await requireStaff();
  const next = currentStatus === "Published" ? "Draft" : "Published";
  await prisma.blog.update({
    where: { id: blogId },
    data: { status: next, publishedAt: next === "Published" ? new Date() : null },
  });
  revalidatePath("/admin/cms/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(blogId: string) {
  await requireStaff();
  await prisma.blog.delete({ where: { id: blogId } });
  revalidatePath("/admin/cms/blog");
}

// ── Testimonials ──────────────────────────────────────────────────────

export async function createTestimonial(input: {
  name: string;
  city: string;
  quote: string;
  rating: number;
}) {
  await requireStaff();
  await prisma.testimonial.create({ data: input });
  revalidatePath("/admin/cms/testimonials");
}

export async function toggleTestimonialPublished(id: string, current: boolean) {
  await requireStaff();
  await prisma.testimonial.update({ where: { id }, data: { isPublished: !current } });
  revalidatePath("/admin/cms/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireStaff();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/cms/testimonials");
}

// ── FAQs ──────────────────────────────────────────────────────────────

export async function createFAQ(input: { question: string; answer: string; category: string }) {
  await requireStaff();
  await prisma.fAQ.create({ data: input });
  revalidatePath("/admin/cms/faqs");
}

export async function deleteFAQ(id: string) {
  await requireStaff();
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/admin/cms/faqs");
}

// ── Roles & Permissions ───────────────────────────────────────────────

export async function createRole(input: { name: string; description?: string }) {
  await requireAdmin();
  const name = input.name.trim();
  if (!name) throw new Error("Role name is required");

  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) throw new Error("A role with that name already exists");

  await prisma.role.create({
    data: { name, description: input.description?.trim() || null },
  });
  revalidatePath("/admin/roles");
}

export async function deleteRole(roleId: string) {
  await requireAdmin();
  await prisma.role.delete({ where: { id: roleId } });
  revalidatePath("/admin/roles");
}

export async function toggleRolePermission(
  roleId: string,
  permissionId: string,
  grant: boolean
) {
  await requireAdmin();

  if (grant) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: {},
      create: { roleId, permissionId },
    });
  } else {
    await prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
  }

  revalidatePath("/admin/roles");
}

// ── Working Hours & Holidays ─────────────────────────────────────────

export async function updateBranchWorkingHour(input: {
  branchId: string;
  weekday: number;
  isClosed: boolean;
  openTime?: string | null;
  closeTime?: string | null;
}) {
  await requireStaff();
  if (input.weekday < 0 || input.weekday > 6) throw new Error("Invalid weekday");
  if (!input.isClosed && (!input.openTime || !input.closeTime)) {
    throw new Error("Open and close time are required for an open day");
  }

  await prisma.branchWorkingHour.upsert({
    where: { branchId_weekday: { branchId: input.branchId, weekday: input.weekday } },
    update: {
      isClosed: input.isClosed,
      openTime: input.isClosed ? null : input.openTime,
      closeTime: input.isClosed ? null : input.closeTime,
    },
    create: {
      branchId: input.branchId,
      weekday: input.weekday,
      isClosed: input.isClosed,
      openTime: input.isClosed ? null : input.openTime,
      closeTime: input.isClosed ? null : input.closeTime,
    },
  });

  revalidatePath("/admin/branches");
}

export async function createBranchHoliday(input: {
  branchId: string;
  date: string; // ISO date, e.g. "2026-12-25"
  label: string;
}) {
  await requireStaff();
  const label = input.label.trim();
  if (!label || !input.date) throw new Error("Date and label are required");

  await prisma.branchHoliday.create({
    data: { branchId: input.branchId, date: new Date(input.date), label },
  });

  revalidatePath("/admin/branches");
}

export async function deleteBranchHoliday(id: string) {
  await requireStaff();
  await prisma.branchHoliday.delete({ where: { id } });
  revalidatePath("/admin/branches");
}
