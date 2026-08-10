import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { NewTestimonialForm, TestimonialRow } from "@/features/admin/TestimonialControls";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text">Testimonials</h1>
          <p className="mt-1 text-sm text-muted">{testimonials.length} testimonials.</p>
        </div>
        <NewTestimonialForm />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.05}>
            <TestimonialRow
              id={t.id}
              name={t.name}
              city={t.city}
              quote={t.quote}
              rating={t.rating}
              isPublished={t.isPublished}
            />
          </Reveal>
        ))}
        {testimonials.length === 0 && <p className="text-sm text-muted">No testimonials yet.</p>}
      </div>
    </div>
  );
}
