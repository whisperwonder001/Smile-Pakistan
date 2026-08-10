"use client";

import { MapPin, Clock } from "lucide-react";
import { branches, Branch } from "@/lib/booking-data";
import { cn } from "@/lib/utils";

export function BranchStep({
  selected,
  onSelect,
}: {
  selected: Branch | null;
  onSelect: (branch: Branch) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-text">
        Choose a branch
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        Pick whichever location is most convenient for you.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all",
              selected?.id === b.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-slate-200 bg-white hover:border-primary/40"
            )}
          >
            <p className="font-display text-base font-bold text-text">
              {b.city}
            </p>
            <p className="text-sm text-primary-dark">{b.name}</p>
            <div className="mt-3 flex items-start gap-2 text-xs text-muted">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {b.address}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {b.hours}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
