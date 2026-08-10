"use client";

import { useState, useTransition } from "react";
import { addClinicalNote } from "./actions";

export function ClinicalNoteForm({
  appointmentId,
  patientId,
}: {
  appointmentId: string;
  patientId: string;
}) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    startTransition(async () => {
      await addClinicalNote({ appointmentId, patientId, note });
      setNote("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a clinical note for this visit…"
        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={isPending || !note.trim()}
        className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Add"}
      </button>
    </form>
  );
}
