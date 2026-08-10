import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Book online",
    desc: "Choose your branch, doctor, and treatment — pick a time that works for you, day or night.",
  },
  {
    n: "02",
    title: "Digital diagnosis",
    desc: "We take a digital X-ray and review it with you on-screen before any treatment begins.",
  },
  {
    n: "03",
    title: "Treatment plan",
    desc: "Your dentist explains options and cost in PKR upfront — you decide what's next.",
  },
  {
    n: "04",
    title: "Ongoing care",
    desc: "Your record stays with us, so follow-ups and recalls pick up exactly where you left off.",
  },
];

export function Process() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          How it works
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
          Four steps, start to finish
        </h2>
      </Reveal>
      <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 lg:block" />
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1} className="relative">
            <span className="font-display text-sm font-bold text-primary/50">
              {s.n}
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-text">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
