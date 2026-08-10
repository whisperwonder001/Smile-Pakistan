import { ScanLine, HeartHandshake, BadgeCheck, Wallet } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const points = [
  {
    icon: ScanLine,
    title: "Digital X-rays, every diagnosis",
    desc: "90% less radiation than film X-rays, with instant, magnifiable results your dentist reviews with you.",
  },
  {
    icon: HeartHandshake,
    title: "One chart, every visit",
    desc: "Your history, treatment plan and prescriptions follow you across every branch and every doctor.",
  },
  {
    icon: BadgeCheck,
    title: "PMDC-registered dentists",
    desc: "Every doctor on our team is licensed and continues specialist training each year.",
  },
  {
    icon: Wallet,
    title: "Upfront PKR pricing",
    desc: "See treatment costs before you book — no surprise charges at checkout.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Why Smile Pakistan
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
            Dentistry that treats the record,
            <br className="hidden sm:block" /> not just the appointment
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Most clinics start every visit from scratch. We built our systems
            so your doctor already knows your history before you sit down —
            across implants, orthodontics, and everyday check-ups alike.
          </p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-slate-100 p-6 transition-shadow hover:shadow-md hover:shadow-slate-900/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-text">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
