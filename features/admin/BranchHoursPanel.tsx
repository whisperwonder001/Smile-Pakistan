"use client";

import { useState, useTransition } from "react";
import { Clock, CalendarOff, Trash2, ChevronDown } from "lucide-react";
import {
  updateBranchWorkingHour,
  createBranchHoliday,
  deleteBranchHoliday,
} from "./actions";

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type WorkingHour = {
  weekday: number;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
};
type Holiday = { id: string; date: string; label: string };

export function BranchHoursPanel({
  branchId,
  workingHours,
  holidays,
}: {
  branchId: string;
  workingHours: WorkingHour[];
  holidays: Holiday[];
}) {
  const [open, setOpen] = useState(false);

  // Ensure all 7 weekdays are represented even if unseeded.
  const rows = Array.from({ length: 7 }, (_, weekday) => {
    const existing = workingHours.find((wh) => wh.weekday === weekday);
    return (
      existing || {
        weekday,
        isClosed: weekday === 0,
        openTime: weekday === 0 ? null : "10:00",
        closeTime: weekday === 0 ? null : "20:00",
      }
    );
  });

  return (
    <div className="mt-4 border-t border-slate-100 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary-dark"
      >
        <Clock className="h-3.5 w-3.5" />
        Manage Hours & Holidays
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          <div className="space-y-1.5">
            {rows.map((row) => (
              <WorkingHourRow key={row.weekday} branchId={branchId} row={row} />
            ))}
          </div>

          <HolidaysSection branchId={branchId} holidays={holidays} />
        </div>
      )}
    </div>
  );
}

function WorkingHourRow({ branchId, row }: { branchId: string; row: WorkingHour }) {
  const [isClosed, setIsClosed] = useState(row.isClosed);
  const [openTime, setOpenTime] = useState(row.openTime ?? "10:00");
  const [closeTime, setCloseTime] = useState(row.closeTime ?? "20:00");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateBranchWorkingHour({
          branchId,
          weekday: row.weekday,
          isClosed,
          openTime,
          closeTime,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs">
      <span className="w-20 shrink-0 font-medium text-text">{WEEKDAY_LABELS[row.weekday]}</span>

      <label className="flex items-center gap-1.5 text-muted">
        <input
          type="checkbox"
          checked={isClosed}
          onChange={(e) => setIsClosed(e.target.checked)}
          className="h-3.5 w-3.5 accent-primary"
        />
        Closed
      </label>

      {!isClosed && (
        <>
          <input
            type="time"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1"
          />
          <span className="text-muted">–</span>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1"
          />
        </>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="ml-auto rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark disabled:opacity-50"
      >
        {isPending ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
      {error && <p className="w-full text-red-600">{error}</p>}
    </div>
  );
}

function HolidaysSection({ branchId, holidays }: { branchId: string; holidays: Holiday[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const date = String(data.get("date") || "");
    const label = String(data.get("label") || "").trim();
    if (!date || !label) {
      setError("Date and label are required.");
      return;
    }
    startTransition(async () => {
      try {
        await createBranchHoliday({ branchId, date, label });
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add holiday");
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteBranchHoliday(id);
      setDeletingId(null);
    });
  }

  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text">
        <CalendarOff className="h-3.5 w-3.5" />
        Holidays & closures
      </p>

      {holidays.length > 0 && (
        <div className="mb-2 space-y-1">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs"
            >
              <span>
                <span className="font-medium text-text">
                  {new Date(h.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>{" "}
                — {h.label}
              </span>
              <button
                onClick={() => handleDelete(h.id)}
                disabled={isPending && deletingId === h.id}
                className="text-danger hover:text-danger/70 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-1.5">
        <input
          name="date"
          type="date"
          required
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
        />
        <input
          name="label"
          placeholder="e.g. Eid holiday"
          required
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
