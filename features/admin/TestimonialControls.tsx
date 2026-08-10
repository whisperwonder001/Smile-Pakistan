"use client";

import { useState, useTransition } from "react";
import { Plus, Star } from "lucide-react";
import { createTestimonial, toggleTestimonialPublished, deleteTestimonial } from "./actions";

export function NewTestimonialForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const city = String(form.get("city") || "");
    const quote = String(form.get("quote") || "");
    const rating = Number(form.get("rating") || 5);
    if (!name || !city || !quote) return;

    startTransition(async () => {
      await createTestimonial({ name, city, quote, rating });
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
        New Testimonial
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Patient name" required className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        <input name="city" placeholder="City" required className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      </div>
      <textarea name="quote" placeholder="Quote" rows={3} required className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <select name="rating" defaultValue="5" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary">
        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
      </select>
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

export function TestimonialRow({
  id,
  name,
  city,
  quote,
  rating,
  isPublished,
}: {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-warning">
          {Array.from({ length: rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isPublished ? "bg-success/10 text-success" : "bg-slate-200 text-muted"}`}>
          {isPublished ? "Published" : "Hidden"}
        </span>
      </div>
      <p className="mt-3 text-sm text-text/80">&ldquo;{quote}&rdquo;</p>
      <p className="mt-2 text-xs font-semibold text-text">{name} <span className="font-normal text-muted">· {city}</span></p>
      <div className="mt-3 flex gap-2">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => toggleTestimonialPublished(id, isPublished))}
          className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-text hover:border-primary/40 disabled:opacity-50"
        >
          {isPublished ? "Hide" : "Publish"}
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => deleteTestimonial(id))}
          className="rounded-full border border-danger/20 px-3.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
