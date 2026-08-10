import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services, ServiceCategory } from "@/lib/services-data";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/BlogsAndCTA";

export const metadata: Metadata = {
  title: "All Dental Treatments | Smile Pakistan",
  description:
    "Explore all 18 dental treatments at Smile Pakistan — from routine scaling and fillings to implants, braces, and full smile makeovers, with transparent PKR pricing.",
};

const categories: ServiceCategory[] = [
  "Restorative",
  "Cosmetic",
  "Surgical & Preventive",
  "Family & Diagnostics",
];

export default function ServicesPage() {
  return (
    <>
      <section className="enamel-grid border-b border-slate-100 bg-gradient-to-b from-white to-bg py-16 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Treatments
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-text sm:text-5xl">
            Every treatment, one connected chart
          </h1>
          <p className="mt-4 text-muted">
            Eighteen specialties across restorative, cosmetic, surgical, and
            family dentistry — each with transparent PKR pricing and a
            digital record that follows you branch to branch.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {categories.map((category) => (
          <div key={category} className="mb-16 last:mb-0">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold text-text">
                {category}
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.category === category)
                .map((s, i) => (
                  <Reveal key={s.slug} delay={i * 0.05}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/[0.02] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div>
                        <h3 className="font-display text-lg font-bold text-text">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {s.shortDesc}
                        </p>
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary-dark">
                          From PKR {s.priceFrom.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Details <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
      </div>

      <CTA />
    </>
  );
}
