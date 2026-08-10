import Link from "next/link";
import {
  Sparkles,
  Syringe,
  Smile,
  Shield,
  Baby,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const services = [
  {
    icon: Sparkles,
    title: "Teeth Whitening",
    desc: "Safe, clinically supervised whitening for a brighter, natural-looking smile.",
  },
  {
    icon: Syringe,
    title: "Dental Implants",
    desc: "Titanium implants placed with digital precision, restoring full bite strength.",
  },
  {
    icon: Smile,
    title: "Smile Makeover",
    desc: "A tailored combination of veneers, whitening and alignment for your ideal smile.",
  },
  {
    icon: Shield,
    title: "Preventive Dentistry",
    desc: "Routine scaling, polishing and check-ups that catch problems before they start.",
  },
  {
    icon: Baby,
    title: "Pediatric Dentistry",
    desc: "Gentle, patient-first care designed specifically for children's dental needs.",
  },
  {
    icon: Zap,
    title: "Emergency Dentistry",
    desc: "Same-day appointments for pain, trauma, and urgent dental issues.",
  },
];

export function Services() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Treatments
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
          Care for every stage of your smile
        </h2>
        <p className="mt-4 text-muted">
          Eighteen specialties, one connected treatment plan — every doctor
          works from the same digital chart.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <Link
              href={`/services/${s.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group block rounded-2xl border border-slate-100 bg-white p-7 shadow-sm shadow-slate-900/[0.02] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-text">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/services"
          className="text-sm font-semibold text-secondary hover:text-primary"
        >
          View all 18 treatments →
        </Link>
      </div>
    </section>
  );
}
