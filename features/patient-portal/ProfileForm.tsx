"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateProfile } from "./actions";

export function ProfileForm({
  fullName,
  email,
  phone,
  dob,
  branch,
}: {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  branch: string;
}) {
  const [prefs, setPrefs] = useState({ email: true, sms: true, whatsapp: false });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newFullName = String(form.get("fullName") || fullName);
    const newPhone = String(form.get("phone") || phone);

    startTransition(async () => {
      await updateProfile({ fullName: newFullName, phone: newPhone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSave} className="mt-8 max-w-xl space-y-5 rounded-2xl border border-slate-100 bg-white p-6">
      <div>
        <label className="text-xs font-semibold text-text/80">Full name</label>
        <input
          name="fullName"
          defaultValue={fullName}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-text/80">Email</label>
          <input
            defaultValue={email}
            disabled
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text/80">Mobile</label>
          <input
            name="phone"
            defaultValue={phone}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-text/80">Date of birth</label>
          <input
            type="date"
            defaultValue={dob}
            disabled
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text/80">Preferred branch</label>
          <input
            defaultValue={branch}
            disabled
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted outline-none"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Notification preferences
        </p>
        <p className="mt-1 text-xs text-muted">
          Not yet persisted to your account — a `notification_prefs` field
          needs to be added to the schema.
        </p>
        <div className="mt-3 space-y-3">
          {(["email", "sms", "whatsapp"] as const).map((key) => (
            <label key={key} className="flex items-center justify-between text-sm text-text/80">
              <span className="capitalize">{key} reminders</span>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`relative h-6 w-11 rounded-full transition-colors ${prefs[key] ? "bg-primary" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </button>
    </form>
  );
}
