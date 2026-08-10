import Link from "next/link";
import { CalendarPlus, Clock, MapPin, Stethoscope, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const [upcoming, completedCount, invoices] = await Promise.all([
    prisma.appointment.findFirst({
      where: { patientId, status: { in: ["REQUESTED", "CONFIRMED"] } },
      orderBy: { startsAt: "asc" },
      include: { treatment: true, doctor: { include: { user: true } }, branch: true },
    }),
    prisma.appointment.count({ where: { patientId, status: "COMPLETED" } }),
    prisma.invoice.findMany({ where: { patientId, status: { not: "PAID" } } }),
  ]);

  const outstanding = invoices.reduce((sum, i) => sum + i.amount, 0);
  const firstName = session!.user.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-extrabold text-text">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted">Here's what's happening with your care.</p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Next Appointment
          </p>
          <p className="mt-2 font-display text-lg font-bold text-text">
            {upcoming ? upcoming.treatment.title : "None scheduled"}
          </p>
          {upcoming && (
            <p className="mt-1 text-xs text-muted">
              {upcoming.startsAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ·{" "}
              {upcoming.startsAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.06} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Outstanding Balance
          </p>
          <p className="mt-2 font-display text-lg font-bold text-text">
            PKR {outstanding.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted">
            {outstanding > 0 ? "Payment due at your next visit" : "You're all settled up"}
          </p>
        </Reveal>
        <Reveal delay={0.12} className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Total Visits
          </p>
          <p className="mt-2 font-display text-lg font-bold text-text">{completedCount}</p>
          <p className="mt-1 text-xs text-muted">Since you joined Smile Pakistan</p>
        </Reveal>
      </div>

      {upcoming && (
        <Reveal delay={0.15} className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Upcoming Appointment
              </p>
              <p className="mt-1.5 font-display text-lg font-bold text-text">
                {upcoming.treatment.title} with {upcoming.doctor.user.fullName}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text/70">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {upcoming.startsAt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })},{" "}
                  {upcoming.startsAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {upcoming.branch.name}, {upcoming.branch.city}
                </span>
              </div>
            </div>
            <Link
              href="/patient/appointments"
              className="shrink-0 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-primary-dark hover:border-primary"
            >
              Manage
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/book-appointment"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20"
        >
          <CalendarPlus className="h-4 w-4" />
          Book New Appointment
        </Link>
        <Link
          href="/patient/treatment-history"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text hover:border-primary/40"
        >
          <Stethoscope className="h-4 w-4" />
          View Treatment History
        </Link>
        <Link
          href="/patient/invoices"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text hover:border-primary/40"
        >
          <Wallet className="h-4 w-4" />
          View Invoices
        </Link>
      </Reveal>
    </div>
  );
}
