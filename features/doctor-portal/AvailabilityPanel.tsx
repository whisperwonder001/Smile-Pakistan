"use client";

import { useState, useTransition } from "react";
import { setDoctorAvailability } from "./actions";

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Window = { weekday: number; startTime: string; endTime: string };

export function AvailabilityPanel({
  branchId,
  availability,
}: {
  branchId: string;
  availability: Window[];
}) {
  const rows = Array.from({ length: 7 }, (_, weekday) => {
    const existing = availability.find((a) => a.weekday === weekday);
    return {
      weekday,
      isOff: !existing,
      startTime: existing?.startTime ?? "10:00",
      endTime: existing?.endTime ?? "18:00",
    };
  });

  return (
    <div className="mt-3 space-y-1.5">
      {rows.map((row) => (
        <AvailabilityRow key={row.weekday} branchId={branchId} row={row} />
      ))}
    </div>
  );
}

function AvailabilityRow({
  branchId,
  row,
}: {
  branchId: string;
  row: { weekday: number; isOff: boolean; startTime: string; endTime: string };
}) {
  const [isOff, setIsOff] = useState(row.isOff);
  const [startTime, setStartTime] = useState(row.startTime);
  const [endTime, setEndTime] = useState(row.endTime);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await setDoctorAvailability({ branchId, weekday: row.weekday, isOff, startTime, endTime });
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
          checked={isOff}
          onChange={(e) => setIsOff(e.target.checked)}
          className="h-3.5 w-3.5 accent-primary"
        />
        Not working
      </label>

      {!isOff && (
        <>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1"
          />
          <span className="text-muted">–</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
      {error && <p className="w-full text-danger">{error}</p>}
    </div>
  );
}
