"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createFAQ, deleteFAQ } from "./actions";

export function NewFAQForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const question = String(form.get("question") || "");
    const answer = String(form.get("answer") || "");
    const category = String(form.get("category") || "General");
    if (!question || !answer) return;

    startTransition(async () => {
      await createFAQ({ question, answer, category });
      setOpen(false);
      e.currentTarget.reset();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        New FAQ
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
      <input name="question" placeholder="Question" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <textarea name="answer" placeholder="Answer" rows={3} required className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <input name="category" placeholder="Category (e.g. Booking, Billing)" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {isPending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:bg-slate-100">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function DeleteFAQButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteFAQ(id))}
      className="rounded-full border border-danger/20 px-3.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
