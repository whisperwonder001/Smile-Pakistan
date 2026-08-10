"use client";

import { useTransition } from "react";
import { updateAppointmentStatusAdmin } from "./actions";

export function AdminAppointmentActions({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function set(next: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW") {
    startTransition(() => updateAppointmentStatusAdmin(appointmentId, next));
  }

  if (status === "COMPLETED" || status === "CANCELLED") return null;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "REQUESTED" && (
        <button
          disabled={isPending}
          onClick={() => set("CONFIRMED")}
          className="rounded-full border border-primary/30 px-3.5 py-1.5 text-xs font-semibold text-primary-dark hover:bg-primary/5 disabled:opacity-50"
        >
          Confirm
        </button>
      )}
      <button
        disabled={isPending}
        onClick={() => set("COMPLETED")}
        className="rounded-full border border-success/30 px-3.5 py-1.5 text-xs font-semibold text-success hover:bg-success/5 disabled:opacity-50"
      >
        Complete
      </button>
      <button
        disabled={isPending}
        onClick={() => set("CANCELLED")}
        className="rounded-full border border-danger/30 px-3.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
