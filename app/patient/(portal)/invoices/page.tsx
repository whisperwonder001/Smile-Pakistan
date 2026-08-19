import { Download, Receipt } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PayNowButton } from "@/features/patient-portal/PayNowButton";

const statusStyles: Record<string, string> = {
  PAID: "bg-success/10 text-success",
  UNPAID: "bg-danger/10 text-danger",
  PARTIALLY_PAID: "bg-warning/10 text-warning",
  REFUNDED: "bg-slate-200 text-muted",
};

const statusLabels: Record<string, string> = {
  PAID: "Paid",
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  REFUNDED: "Refunded",
};

export default async function InvoicesPage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const invoices = await prisma.invoice.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });

  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const totalDue = invoices.filter((i) => i.status !== "PAID").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Invoices &amp; Payments</h1>
        <p className="mt-1 text-sm text-muted">Your billing history across every visit.</p>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total Paid</p>
          <p className="mt-1.5 font-display text-xl font-bold text-success">
            PKR {totalPaid.toLocaleString()}
          </p>
        </Reveal>
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Outstanding</p>
          <p className="mt-1.5 font-display text-xl font-bold text-danger">
            PKR {totalDue.toLocaleString()}
          </p>
        </Reveal>
      </div>

      <div className="mt-8 space-y-3">
        {invoices.length === 0 && <p className="text-sm text-muted">No invoices yet.</p>}
        {invoices.map((inv, i) => (
          <Reveal key={inv.id} delay={i * 0.06}>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Receipt className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-text">{inv.description}</p>
                  <p className="text-xs text-muted">
                    {inv.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[inv.status])}>
                  {statusLabels[inv.status]}
                </span>
                <p className="font-display text-sm font-bold text-text">
                  PKR {inv.amount.toLocaleString()}
                </p>
                {inv.status === "PAID" ? (
                  <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-text hover:border-primary/40">
                    <Download className="h-3.5 w-3.5" />
                    Receipt
                  </button>
                ) : (
                  <PayNowButton invoiceId={inv.id} amount={inv.amount} description={inv.description} />
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
