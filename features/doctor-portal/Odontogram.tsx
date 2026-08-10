"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { cycleToothCondition } from "./actions";

const conditionColor: Record<string, string> = {
  Healthy: "bg-white border-slate-200 text-text/70",
  Decayed: "bg-danger/15 border-danger/40 text-danger",
  Filled: "bg-primary/15 border-primary/40 text-primary-dark",
  Crowned: "bg-warning/15 border-warning/50 text-warning",
  Missing: "bg-slate-100 border-slate-200 text-slate-300 line-through",
  Implant: "bg-accent/15 border-accent/40 text-accent",
};

// FDI quadrants: upper-right, upper-left, lower-left, lower-right
const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];

export function Odontogram({
  patientId,
  entries,
}: {
  patientId: string;
  entries: { toothNumber: number; condition: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const conditionByTooth = new Map(entries.map((e) => [e.toothNumber, e.condition]));

  function Tooth({ n }: { n: number }) {
    const condition = conditionByTooth.get(n) ?? "Healthy";
    return (
      <button
        disabled={isPending}
        onClick={() => startTransition(() => cycleToothCondition(patientId, n))}
        title={`Tooth ${n} — ${condition} (click to change)`}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border text-[11px] font-semibold transition-colors disabled:opacity-50",
          conditionColor[condition]
        )}
      >
        {n}
      </button>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        <div className="flex justify-end gap-1">
          {upperRight.map((n) => <Tooth key={n} n={n} />)}
        </div>
        <div className="flex gap-1">
          {upperLeft.map((n) => <Tooth key={n} n={n} />)}
        </div>
        <div className="flex justify-end gap-1">
          {lowerRight.slice().reverse().map((n) => <Tooth key={n} n={n} />)}
        </div>
        <div className="flex gap-1">
          {lowerLeft.slice().reverse().map((n) => <Tooth key={n} n={n} />)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {Object.entries(conditionColor).map(([label, cls]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={cn("h-3 w-3 rounded border", cls)} />
            {label}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        FDI notation · click any tooth to cycle its condition.
      </p>
    </div>
  );
}
