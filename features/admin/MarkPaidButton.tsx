"use client";

import { useState, useTransition } from "react";
import { markInvoicePaid } from "./actions";

const methods = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "JAZZCASH", label: "JazzCash" },
  { value: "EASYPAISA", label: "EasyPaisa" },
] as const;

export function MarkPaidButton({ invoiceId }: { invoiceId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (open) {
    return (
      <div className="flex items-center gap-1.5">
        {methods.map((m) => (
          <button
            key={m.value}
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await markInvoicePaid(invoiceId, m.value);
                setOpen(false);
              })
            }
            className="rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-text hover:border-primary/40 disabled:opacity-50"
          >
            {m.label}
          </button>
        ))}
        <button
          onClick={() => setOpen(false)}
          className="text-[11px] text-muted hover:text-text"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white"
    >
      Mark Paid
    </button>
  );
}
