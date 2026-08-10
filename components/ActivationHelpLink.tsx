"use client";

import { useState, useTransition } from "react";
import { requestActivationEmail } from "@/app/activate/actions";

export function ActivationHelpLink() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await requestActivationEmail(email);
      setMessage(res.message);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 block w-full text-center text-xs font-semibold text-primary hover:underline"
      >
        Haven't set a password yet? Activate your account
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-muted">
        Enter the email your account was created with — we'll send a link to set your
        password.
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-primary"
      />
      {message ? (
        <p className="text-xs text-primary-dark">{message}</p>
      ) : (
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary-dark disabled:opacity-50"
        >
          {isPending ? "Sending…" : "Send activation link"}
        </button>
      )}
    </form>
  );
}
