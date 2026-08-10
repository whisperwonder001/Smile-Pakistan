"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin, Stethoscope, User } from "lucide-react";
import { BookingState } from "../types";

export function ConfirmationStep({
  booking,
  reference,
}: {
  booking: BookingState;
  reference: string;
}) {
  const { service, branch, doctor, dateISO, time, details } = booking;

  const dateLabel = dateISO
    ? new Date(dateISO).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const rows = [
    { icon: Stethoscope, label: "Treatment", value: service?.title },
    { icon: MapPin, label: "Branch", value: branch ? `${branch.name}, ${branch.city}` : undefined },
    { icon: User, label: "Doctor", value: doctor?.name },
    { icon: Calendar, label: "Date", value: dateLabel },
    { icon: Clock, label: "Time", value: time ?? undefined },
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle2 className="h-9 w-9" />
      </motion.div>
      <h2 className="mt-5 font-display text-2xl font-extrabold text-text">
        Appointment requested
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        We've sent a confirmation to {details?.email}. Our front desk will
        confirm your slot by SMS within the hour.
      </p>

      <div className="mx-auto mt-8 max-w-md space-y-4 rounded-2xl border border-slate-100 bg-bg p-6 text-left">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
              <r.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted">
                {r.label}
              </p>
              <p className="text-sm font-semibold text-text">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-sm text-xs text-muted">
        Reference: {reference}. Save this for your records — reschedule or
        cancel from your Patient Portal once you set a password on your
        account.
      </p>
    </div>
  );
}
