"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const faqs = [
  {
    q: "Do I need a referral to book an appointment?",
    a: "No — you can book directly online or by phone for any treatment, including specialist procedures like implants or orthodontics.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash, card, JazzCash, and EasyPaisa at all branches, plus online payment via Stripe or PayPal for advance bookings.",
  },
  {
    q: "Can I reschedule or cancel an appointment online?",
    a: "Yes, through your Patient Portal or the link in your confirmation email/SMS, up to 4 hours before your slot.",
  },
  {
    q: "Do you treat dental emergencies same-day?",
    a: "Yes — each branch holds same-day emergency slots for pain, trauma, and urgent issues; call ahead so we can prepare.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <Reveal className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          FAQ
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
          Common questions
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-display text-sm font-semibold text-text">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted" />
                  )}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { height: "auto", opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
