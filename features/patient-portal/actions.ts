"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { fullName: string; phone: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { fullName: data.fullName, phone: data.phone },
  });

  revalidatePath("/patient/profile");
}

/**
 * DEMO-MODE checkout. No real gateway is wired up — JazzCash/EasyPaisa need
 * merchant accounts and Stripe needs a live API key, none of which exist
 * yet (see BACKEND_SETUP.md). This simulates a successful charge so the
 * booking → invoice → payment loop is demoable end to end, and records a
 * real Payment row + flips the Invoice to PAID so the rest of the app
 * (dashboards, receipts, admin reports) reflects it. Swap the body of this
 * function for a real gateway call when merchant credentials are ready —
 * everything downstream already expects a Payment row shaped like this.
 */
export async function payInvoiceDemo(input: {
  invoiceId: string;
  method: "CARD" | "JAZZCASH" | "EASYPAISA";
}) {
  const session = await auth();
  if (!session?.user?.patientId) throw new Error("Not authenticated");

  const invoice = await prisma.invoice.findUnique({ where: { id: input.invoiceId } });
  if (!invoice || invoice.patientId !== session.user.patientId) {
    throw new Error("Invoice not found");
  }
  if (invoice.status === "PAID") throw new Error("Invoice is already paid");

  const reference = `DEMO-${Date.now().toString(36).toUpperCase()}`;

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount,
        method: input.method === "CARD" ? "STRIPE" : input.method,
        reference,
      },
    }),
    prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "PAID" },
    }),
  ]);

  revalidatePath("/patient/invoices");
  return { reference };
}
