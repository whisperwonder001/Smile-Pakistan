import { Reveal } from "@/components/ui/Reveal";

const cases = [
  { treatment: "Veneers", note: "6-unit porcelain veneers, upper arch" },
  { treatment: "Implants", note: "Single-tooth implant, molar restoration" },
  { treatment: "Clear Aligners", note: "14-month alignment, crowding correction" },
];

function CasePlaceholder({ label }: { label: string }) {
  return (
    <div className="enamel-grid flex aspect-[4/3] items-center justify-center rounded-xl border border-slate-100 bg-bg text-xs font-medium text-muted">
      {label}
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Before &amp; After
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
            Real results, real cases
          </h2>
          <p className="mt-4 text-muted">
            Clinical photography placeholders shown below — final gallery to
            use licensed, consented patient photography only.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.treatment} delay={i * 0.1} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <CasePlaceholder label="Before" />
                <CasePlaceholder label="After" />
              </div>
              <h3 className="font-display text-sm font-bold text-text">
                {c.treatment}
              </h3>
              <p className="text-xs text-muted">{c.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
