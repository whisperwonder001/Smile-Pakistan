"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createDoctor } from "./actions";

type BranchOption = { id: string; name: string; city: string };

export function NewDoctorForm({ branches }: { branches: BranchOption[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  function toggleBranch(id: string) {
    setSelectedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const specialty = String(data.get("specialty") || "").trim();
    const bio = String(data.get("bio") || "").trim();

    if (!fullName || !email || !specialty) {
      setError("Name, email, and specialty are required.");
      return;
    }
    if (selectedBranches.length === 0) {
      setError("Select at least one branch.");
      return;
    }

    startTransition(async () => {
      try {
        await createDoctor({
          fullName,
          email,
          phone: phone || undefined,
          specialty,
          bio: bio || undefined,
          branchIds: selectedBranches,
        });
        setOpen(false);
        setSelectedBranches([]);
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
        Add Doctor
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5 sm:max-w-md"
    >
      <input
        name="fullName"
        placeholder="Full name (e.g. Dr. Ahsan Malik)"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="phone"
        placeholder="Phone (optional)"
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="specialty"
        placeholder="Specialty (e.g. Orthodontics)"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <textarea
        name="bio"
        placeholder="Short bio (optional)"
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />

      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted">Assign to branch(es)</p>
        <div className="flex flex-wrap gap-2">
          {branches.map((b) => {
            const active = selectedBranches.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => toggleBranch(b.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary-dark"
                    : "border-slate-200 text-muted hover:border-slate-300"
                }`}
              >
                {b.city} — {b.name}
              </button>
            );
          })}
          {branches.length === 0 && (
            <p className="text-xs text-muted">No branches yet — add a branch first.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted">
        We'll email the doctor a link to set their own password and
        activate their account.
      </p>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Doctor"}
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
