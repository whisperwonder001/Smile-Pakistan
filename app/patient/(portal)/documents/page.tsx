import { FileImage, FileText, Upload, Eye } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DocumentsPage() {
  const session = await auth();
  const patientId = session!.user.patientId!;

  const [documents, xrays] = await Promise.all([
    prisma.document.findMany({ where: { patientId }, orderBy: { createdAt: "desc" } }),
    prisma.xray.findMany({ where: { patientId }, orderBy: { takenAt: "desc" } }),
  ]);

  const items = [
    ...xrays.map((x) => ({ id: x.id, name: x.label, type: "X-ray" as const, date: x.takenAt })),
    ...documents.map((d) => ({ id: d.id, name: d.name, type: d.type, date: d.createdAt })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text">
            Documents &amp; X-rays
          </h1>
          <p className="mt-1 text-sm text-muted">
            Everything your doctors have shared with you.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-text hover:border-primary/40">
          <Upload className="h-4 w-4" />
          Upload a report
        </button>
      </Reveal>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No documents yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((doc, i) => {
            const Icon = doc.type === "X-ray" ? FileImage : FileText;
            return (
              <Reveal key={doc.id} delay={i * 0.06}>
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-4 font-display text-sm font-bold text-text">{doc.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {doc.type} · {doc.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
