import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { services, getService, getRelatedServices, imageForCategory } from "@/lib/services-data";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/BlogsAndCTA";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return {
    title: `${service.title} in Pakistan | Smile Pakistan`,
    description: service.shortDesc,
    openGraph: {
      title: `${service.title} | Smile Pakistan`,
      description: service.shortDesc,
      type: "website",
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getService(params.slug);
  if (!service) notFound();

  const related = getRelatedServices(service);
  const image = imageForCategory(service.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.shortDesc,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    provider: {
      "@type": "Dentist",
      name: "Smile Pakistan",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="mx-auto max-w-7xl px-5 pt-6 text-xs text-muted lg:px-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/services" className="hover:text-primary">Services</Link>
        <span className="mx-1.5">/</span>
        <span className="text-text/70">{service.title}</span>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-2 lg:px-8 lg:py-16">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {service.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-text sm:text-4xl lg:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            {service.overview}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-text/80">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              {service.duration}
            </span>
            <span className="font-semibold text-primary-dark">
              PKR {service.priceFrom.toLocaleString()}–{service.priceTo.toLocaleString()}
            </span>
          </div>

          <Link
            href="/book-appointment"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            <CalendarCheck className="h-4 w-4" />
            Book This Treatment
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <Image
            src={image}
            alt={`Illustrative photography for ${service.title}`}
            width={1400}
            height={900}
            className="h-72 w-full object-cover lg:h-96"
          />
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-text">
              Why patients choose this treatment
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.benefits.map((b, i) => (
              <Reveal key={b} delay={i * 0.06} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-text/85">{b}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-text">
              What to expect
            </h2>
          </Reveal>
          <div className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-4 hidden h-px bg-slate-200 lg:block" />
            {service.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="relative">
                <span className="font-display text-sm font-bold text-primary/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-base font-bold text-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold text-text">
              Frequently asked
            </h2>
          </Reveal>
          <div className="mt-8 space-y-6">
            {service.faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.08}>
                <h3 className="font-display text-sm font-bold text-text">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold text-text">
                Related treatments
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.06}>
                  <Link
                    href={`/services/${r.slug}`}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold text-text">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted">{r.shortDesc}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
