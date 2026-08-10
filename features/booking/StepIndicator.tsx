"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEP_LABELS } from "./types";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto max-w-3xl px-5 lg:px-8">
      <ol className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isDone && "bg-primary text-white",
                    isActive && "bg-primary/10 text-primary ring-2 ring-primary",
                    !isDone && !isActive && "bg-slate-100 text-muted"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : stepNum}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] font-medium sm:block",
                    isActive ? "text-text" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </div>
              {stepNum !== STEP_LABELS.length && (
                <span
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors",
                    isDone ? "bg-primary" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
