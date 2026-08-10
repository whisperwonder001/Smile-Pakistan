"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createBranch } from "./actions";

export function NewBranchForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const city = String(data.get("city") || "").trim();
    const address = String(data.get("address") || "").trim();
    const hours = String(data.get("hours") || "").trim();
    if (!name || !city || !address || !hours) {
      setError("All fields are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createBranch({ name, city, address, hours });
        setOpen(false);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        Add Branch
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5 sm:max-w-md"
    >
      <input
        name="name"
        placeholder="Branch name (e.g. Smile Pakistan — Gulberg)"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="city"
        placeholder="City"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="address"
        placeholder="Street address"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="hours"
        placeholder="Hours (e.g. Mon–Sat, 10am–8pm)"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Branch"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
