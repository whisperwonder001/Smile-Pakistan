import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  {
    quote:
      "I finally understood what was happening with my molar once they showed me the X-ray on screen. No pressure, no guessing.",
    name: "Fatima R.",
    city: "Lahore",
  },
  {
    quote:
      "Booked online at 11pm, got a slot the next morning for an emergency filling. The reminder on WhatsApp was a nice touch.",
    name: "Usman T.",
    city: "Karachi",
  },
  {
    quote:
      "My son's dentist explained everything to him directly, not just to me. He actually looks forward to check-ups now.",
    name: "Ayesha K.",
    city: "Islamabad",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Patient Stories
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
          What patients tell us
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <figure className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm shadow-slate-900/[0.02] transition-shadow hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-text/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-text">
                {t.name}{" "}
                <span className="font-normal text-muted">· {t.city}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
