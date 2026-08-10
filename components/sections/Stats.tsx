import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const stats = [
  { value: "12+", label: "Years in practice" },
  { value: "40,000+", label: "Treatments completed" },
  { value: "3", label: "Branches nationwide" },
  { value: "98%", label: "Patients who return" },
];

export function Stats() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} y={12} className="text-center">
            <p className="font-display text-3xl font-extrabold text-text lg:text-4xl">
              <AnimatedNumber value={s.value} />
            </p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
