import { Receipt } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { MarkPaidButton } from "@/features/admin/MarkPaidButton";

const statusStyles: Record<string, string> = {
  PAID: "bg-success/10 text-success",
  UNPAID: "bg-danger/10 text-danger",
  PARTIALLY_PAID: "bg-warning/10 text-warning",
  REFUNDED: "bg-slate-200 text-muted",
};

export default async function AdminBillingPage() {
  const invoices = await prisma.invoice.findMany({
    include: { patient: { include: { user: true } }, branch: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totalRevenue = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = invoices.filter((i) => i.status !== "PAID").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">Billing</h1>
        <p className="mt-1 text-sm text-muted">All invoices across every branch.</p>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total Revenue</p>
          <p className="mt-1.5 font-display text-xl font-bold text-success">
            PKR {totalRevenue.toLocaleString()}
          </p>
        </Reveal>
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Outstanding</p>
          <p className="mt-1.5 font-display text-xl font-bold text-danger">
            PKR {totalOutstanding.toLocaleString()}
          </p>
        </Reveal>
      </div>

      <div className="mt-8 space-y-3">
        {invoices.map((inv, i) => (
          <Reveal key={inv.id} delay={Math.min(i, 10) * 0.03}>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Receipt className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-text">{inv.description}</p>
                  <p className="text-xs text-muted">
                    {inv.patient.user.fullName} · {inv.branch.city} ·{" "}
                    {inv.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[inv.status])}>
                  {inv.status.replace("_", " ")}
                </span>
                <p className="font-display text-sm font-bold text-text">
                  PKR {inv.amount.toLocaleString()}
                </p>
                {inv.status !== "PAID" && <MarkPaidButton invoiceId={inv.id} />}
              </div>
            </div>
          </Reveal>
        ))}
        {invoices.length === 0 && <p className="text-sm text-muted">No invoices yet.</p>}
      </div>
    </div>
  );
}
