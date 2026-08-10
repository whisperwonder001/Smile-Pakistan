import { Reveal } from "@/components/ui/Reveal";

const doctors = [
  { name: "Dr. Ahsan Malik", role: "Prosthodontist & Implantologist", exp: "14 yrs experience" },
  { name: "Dr. Sana Qureshi", role: "Orthodontist", exp: "10 yrs experience" },
  { name: "Dr. Bilal Hashmi", role: "Oral & Maxillofacial Surgeon", exp: "16 yrs experience" },
  { name: "Dr. Mahnoor Siddiqui", role: "Pediatric Dentist", exp: "8 yrs experience" },
];

export function Doctors() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Our Doctors
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
            Specialists, not generalists
          </h2>
          <p className="mt-4 text-muted">
            Every doctor at Smile Pakistan practices within a defined
            specialty and holds current PMDC registration.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.08}>
              <div className="rounded-2xl border border-slate-100 bg-bg p-6 text-center transition-transform hover:-translate-y-1">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 text-2xl font-display font-bold text-primary-dark">
                  {d.name
                    .split(" ")
                    .slice(1)
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-text">
                  {d.name}
                </h3>
                <p className="mt-1 text-sm text-primary-dark">{d.role}</p>
                <p className="mt-1 text-xs text-muted">{d.exp}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Portrait photography intentionally omitted per brand guidelines —
          to be replaced with licensed clinical photography.
        </p>
      </div>
    </section>
  );
}
