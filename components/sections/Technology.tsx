import Image from "next/image";
import { ScanLine, Cpu, Layers } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    icon: ScanLine,
    title: "Digital panoramic X-rays",
    desc: "90% less radiation than film, reviewed with you on-screen the same visit.",
  },
  {
    icon: Layers,
    title: "3D-planned implants",
    desc: "Implant position mapped digitally before surgery for a precise, predictable fit.",
  },
  {
    icon: Cpu,
    title: "Connected patient records",
    desc: "Your chart, X-rays and treatment plan sync across every branch instantly.",
  },
];

export function Technology() {
  return (
    <section className="bg-bg py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Technology
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl">
            Diagnosis you can actually see
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Every Smile Pakistan branch runs on the same digital imaging and
            records system, so your treatment plan is based on data — not
            memory.
          </p>
          <div className="mt-8 space-y-6">
            {items.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
          <div className="scan-line col-span-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1522849696084-818b29dfe210?auto=format&fit=crop&w=1400&q=70"
              alt="Digital dental panoramic X-ray used for diagnosis"
              width={1400}
              height={800}
              className="h-56 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=800&q=70"
              alt="Dental implant model used for treatment planning"
              width={800}
              height={800}
              className="h-40 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1643660526741-094639fbe53a?auto=format&fit=crop&w=800&q=70"
              alt="Modern dental treatment chair"
              width={800}
              height={800}
              className="h-40 w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
