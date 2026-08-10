"use client";

import { useState, useTransition } from "react";
import { Pill } from "lucide-react";
import { addPrescription } from "./actions";

export function PrescriptionForm({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const medication = String(form.get("medication") || "");
    const dosage = String(form.get("dosage") || "");
    const duration = String(form.get("duration") || "");
    const notes = String(form.get("notes") || "");
    if (!medication || !dosage || !duration) return;

    startTransition(async () => {
      await addPrescription({ patientId, medication, dosage, duration, notes });
      setOpen(false);
      e.currentTarget.reset();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-text hover:border-primary/40"
      >
        <Pill className="h-3.5 w-3.5" />
        Issue Prescription
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 rounded-xl border border-slate-100 bg-bg p-4">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <input
          name="medication"
          placeholder="Medication"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="dosage"
          placeholder="Dosage (e.g. 500mg 2x/day)"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          name="duration"
          placeholder="Duration (e.g. 5 days)"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <input
        name="notes"
        placeholder="Notes (optional)"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Prescription"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-4 py-2 text-xs font-semibold text-muted hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
