import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const posts = [
  {
    title: "Why digital X-rays use 90% less radiation",
    tag: "Technology",
    read: "4 min read",
  },
  {
    title: "Clear aligners vs. traditional braces: what to expect",
    tag: "Orthodontics",
    read: "6 min read",
  },
  {
    title: "A parent's guide to your child's first dental visit",
    tag: "Pediatric",
    read: "5 min read",
  },
];

export function LatestBlogs() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              From the Blog
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
              Dental care, explained
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-sm font-semibold text-secondary hover:text-primary sm:block"
          >
            View all posts →
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Link
                href="/blog"
                className="group block rounded-2xl border border-slate-100 p-6 transition-colors hover:border-primary/30"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {p.tag}
                </span>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-text group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 text-xs text-muted">{p.read}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const partners = ["JazzCash", "EasyPaisa", "Stripe", "PayPal", "State Life", "Jubilee"];

export function InsurancePartners() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
          Accepted payment methods &amp; insurance partners
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span key={p} className="font-display text-sm font-bold text-text/40">
              {p}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      <Reveal>
        <div className="scan-line relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-secondary to-primary-dark px-8 py-16 text-center sm:px-16">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Ready to see what a confident smile feels like?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Book your first visit in under two minutes — no phone call required.
          </p>
          <Link
            href="/book-appointment"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary-dark shadow-lg transition-transform hover:scale-[1.02]"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Your Appointment
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
