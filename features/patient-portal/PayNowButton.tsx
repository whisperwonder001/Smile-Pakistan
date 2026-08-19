"use client";

import { useState, useTransition } from "react";
import { X, CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";
import { payInvoiceDemo } from "./actions";
import { cn } from "@/lib/utils";

type Method = "CARD" | "JAZZCASH" | "EASYPAISA";

export function PayNowButton({
  invoiceId,
  amount,
  description,
}: {
  invoiceId: string;
  amount: number;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<Method>("CARD");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setOpen(false);
    setStep("form");
    setError(null);
    setReference(null);
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStep("processing");
    startTransition(async () => {
      // Small artificial delay so the "processing" state reads as a real
      // charge rather than an instant no-op — this is demo-mode, not a
      // real gateway call (see payInvoiceDemo).
      await new Promise((r) => setTimeout(r, 900));
      try {
        const result = await payInvoiceDemo({ invoiceId, method });
        setReference(result.reference);
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
        setStep("form");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white"
      >
        Pay Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            {step !== "done" && (
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-display text-base font-bold text-text">{description}</p>
                  <p className="text-xs text-muted">PKR {amount.toLocaleString()}</p>
                </div>
                <button onClick={reset} className="text-muted hover:text-text">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-warning/10 px-2.5 py-1.5 text-[11px] font-medium text-warning">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              Demo mode — no real charge is made or card data stored.
            </div>

            {step === "form" && (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["CARD", "JAZZCASH", "EASYPAISA"] as Method[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMethod(m)}
                      className={cn(
                        "rounded-xl border px-2 py-2 text-[11px] font-semibold",
                        method === m
                          ? "border-primary bg-primary/10 text-primary-dark"
                          : "border-slate-200 text-muted"
                      )}
                    >
                      {m === "CARD" ? "Card" : m === "JAZZCASH" ? "JazzCash" : "EasyPaisa"}
                    </button>
                  ))}
                </div>

                {method === "CARD" ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                      <CreditCard className="h-4 w-4 text-muted" />
                      <input
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        required
                        className="w-full text-sm outline-none"
                      />
                    </div>
                    <div className="flex gap-2.5">
                      <input
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-1/2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                      />
                      <input
                        placeholder="CVC"
                        maxLength={3}
                        required
                        className="w-1/2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    placeholder="03XX XXXXXXX"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  />
                )}

                {error && <p className="text-xs text-danger">{error}</p>}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-full bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Pay PKR {amount.toLocaleString()}
                </button>
              </form>
            )}

            {step === "processing" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted">Processing payment…</p>
              </div>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
                <p className="font-display text-base font-bold text-text">Payment successful</p>
                <p className="text-xs text-muted">Reference: {reference}</p>
                <button
                  onClick={reset}
                  className="mt-3 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-text"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
