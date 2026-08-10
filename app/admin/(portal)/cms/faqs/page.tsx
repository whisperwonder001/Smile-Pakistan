import { Reveal } from "@/components/ui/Reveal";
import { prisma } from "@/lib/prisma";
import { NewFAQForm, DeleteFAQButton } from "@/features/admin/FAQControls";

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text">FAQs</h1>
          <p className="mt-1 text-sm text-muted">{faqs.length} questions.</p>
        </div>
        <NewFAQForm />
      </Reveal>

      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={f.id} delay={i * 0.05}>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{f.category}</p>
                <p className="mt-1 font-display text-sm font-bold text-text">{f.question}</p>
                <p className="mt-1 text-sm text-muted">{f.answer}</p>
              </div>
              <DeleteFAQButton id={f.id} />
            </div>
          </Reveal>
        ))}
        {faqs.length === 0 && <p className="text-sm text-muted">No FAQs yet.</p>}
      </div>
    </div>
  );
}
