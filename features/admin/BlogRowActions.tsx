"use client";

import { useTransition } from "react";
import { toggleBlogStatus, deleteBlogPost } from "./actions";

export function BlogRowActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => toggleBlogStatus(id, status))}
        className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-text hover:border-primary/40 disabled:opacity-50"
      >
        {status === "Published" ? "Unpublish" : "Publish"}
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => deleteBlogPost(id))}
        className="rounded-full border border-danger/20 px-3.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
