"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createBlogPost } from "./actions";

export function NewBlogPostForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function slugify(title: string) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "");
    const excerpt = String(form.get("excerpt") || "");
    const content = String(form.get("content") || "");
    if (!title || !excerpt || !content) return;

    startTransition(async () => {
      await createBlogPost({ title, slug: slugify(title), excerpt, content });
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
        New Post
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
      <input
        name="title"
        placeholder="Post title"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <input
        name="excerpt"
        placeholder="Short excerpt"
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <textarea
        name="content"
        placeholder="Full content"
        rows={5}
        required
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
