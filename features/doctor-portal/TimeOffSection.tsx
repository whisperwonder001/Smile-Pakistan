"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { createDoctorTimeOff, deleteDoctorTimeOff } from "./actions";

type TimeOff = {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

export function TimeOffSection({ timeOff }: { timeOff: TimeOff[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allDay, setAllDay] = useState(true);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const date = String(data.get("date") || "");
    const startTime = String(data.get("startTime") || "");
    const endTime = String(data.get("endTime") || "");
    const reason = String(data.get("reason") || "");
    if (!date) {
      setError("Date is required.");
      return;
    }
    startTransition(async () => {
      try {
        await createDoctorTimeOff({ date, allDay, startTime, endTime, reason });
        form.reset();
        setAllDay(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add time off");
      }
    });
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteDoctorTimeOff(id);
      setDeletingId(null);
    });
  }

  return (
    <div className="mt-3">
      {timeOff.length > 0 && (
        <div className="mb-3 space-y-1">
          {timeOff.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs"
            >
              <span>
                <span className="font-medium text-text">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>{" "}
                {t.startTime && t.endTime ? `— ${t.startTime}–${t.endTime}` : "— all day"}
                {t.reason ? ` (${t.reason})` : ""}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={isPending && deletingId === t.id}
                className="text-danger hover:text-danger/70 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-1.5 text-xs">
        <input
          name="date"
          type="date"
          required
          className="rounded-lg border border-slate-200 px-2 py-1"
        />
        <label className="flex items-center gap-1.5 text-muted">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-3.5 w-3.5 accent-primary"
          />
          All day
        </label>
        {!allDay && (
          <>
            <input name="startTime" type="time" className="rounded-lg border border-slate-200 px-2 py-1" />
            <span className="text-muted">–</span>
            <input name="endTime" type="time" className="rounded-lg border border-slate-200 px-2 py-1" />
          </>
        )}
        <input
          name="reason"
          placeholder="Reason (optional)"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-1 text-danger">{error}</p>}
    </div>
  );
}
