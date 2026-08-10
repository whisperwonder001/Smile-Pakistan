"use client";

import { nextDays, slotsForDay, Doctor } from "@/lib/booking-data";
import { cn } from "@/lib/utils";

export function DateTimeStep({
  doctor,
  dateISO,
  time,
  onSelectDate,
  onSelectTime,
}: {
  doctor: Doctor | null;
  dateISO: string | null;
  time: string | null;
  onSelectDate: (iso: string) => void;
  onSelectTime: (time: string) => void;
}) {
  const days = nextDays(10);
  const slots = dateISO && doctor ? slotsForDay(dateISO, doctor.id) : [];

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-text">
        Pick a date &amp; time
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        Availability shown for {doctor?.name ?? "your doctor"}.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d.iso}
            onClick={() => onSelectDate(d.iso)}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all",
              dateISO === d.iso
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-slate-200 bg-white hover:border-primary/40"
            )}
          >
            <span className="text-[11px] text-muted">{d.weekday}</span>
            <span className="mt-0.5 font-display text-sm font-bold text-text">
              {d.label}
            </span>
          </button>
        ))}
      </div>

      {dateISO && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Available times
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {slots.map((s) => (
              <button
                key={s.time}
                disabled={!s.available}
                onClick={() => onSelectTime(s.time)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                  !s.available && "cursor-not-allowed border-slate-100 text-slate-300 line-through",
                  s.available &&
                    time === s.time &&
                    "border-primary bg-primary text-white",
                  s.available &&
                    time !== s.time &&
                    "border-slate-200 bg-white text-text hover:border-primary/40"
                )}
              >
                {s.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
