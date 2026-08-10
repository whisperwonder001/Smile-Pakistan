"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { services, Service, ServiceCategory } from "@/lib/services-data";
import { cn } from "@/lib/utils";

const categories: ServiceCategory[] = [
  "Restorative",
  "Cosmetic",
  "Surgical & Preventive",
  "Family & Diagnostics",
];

export function TreatmentStep({
  selected,
  onSelect,
}: {
  selected: Service | null;
  onSelect: (service: Service) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-text">
        What treatment do you need?
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        Not sure? Choose the closest match — your doctor can adjust the plan.
      </p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search treatments…"
          className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="mt-8 space-y-8">
        {categories.map((category) => {
          const items = filtered.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {category}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => onSelect(s)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      selected?.slug === s.slug
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-slate-200 bg-white hover:border-primary/40"
                    )}
                  >
                    <p className="font-display text-sm font-bold text-text">
                      {s.title}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      From PKR {s.priceFrom.toLocaleString()} · {s.duration}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
