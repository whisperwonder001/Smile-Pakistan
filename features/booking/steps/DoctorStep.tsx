"use client";

import { doctors, Doctor, Branch } from "@/lib/booking-data";
import { Service } from "@/lib/services-data";
import { cn } from "@/lib/utils";

export function DoctorStep({
  branch,
  service,
  selected,
  onSelect,
}: {
  branch: Branch | null;
  service: Service | null;
  selected: Doctor | null;
  onSelect: (doctor: Doctor) => void;
}) {
  const available = doctors.filter((d) => {
    const branchMatch = branch ? d.branchIds.includes(branch.id) : true;
    const categoryMatch = service
      ? d.treatmentCategories.includes(service.category)
      : true;
    return branchMatch && categoryMatch;
  });

  const list = available.length > 0 ? available : doctors;

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-text">
        Choose your doctor
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        {available.length > 0
          ? `Matched to ${service?.title ?? "your treatment"} at ${branch?.city ?? "your branch"}.`
          : "No exact match found at this branch — showing all doctors, we'll confirm availability."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
              selected?.id === d.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-slate-200 bg-white hover:border-primary/40"
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary-dark">
              {d.name
                .split(" ")
                .slice(1)
                .map((w) => w[0])
                .join("")}
            </span>
            <div>
              <p className="font-display text-sm font-bold text-text">{d.name}</p>
              <p className="text-xs text-muted">{d.role}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
