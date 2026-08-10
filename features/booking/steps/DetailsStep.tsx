"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientDetails } from "../types";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .regex(/^(\+92|0)3\d{9}$/, "Enter a valid Pakistani mobile number (e.g. 0300 1234567)"),
  email: z.string().email("Enter a valid email address"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function DetailsStep({
  defaultValues,
  onSubmit,
}: {
  defaultValues: PatientDetails | null;
  onSubmit: (details: PatientDetails) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { fullName: "", phone: "", email: "", notes: "" },
  });

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-text">
        Your details
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        We'll send your confirmation here.
      </p>

      <form
        id="details-form"
        onSubmit={handleSubmit((data) => onSubmit({ ...data, notes: data.notes ?? "" }))}
        className="mt-6 space-y-5"
      >
        <div>
          <label className="text-xs font-semibold text-text/80">Full name</label>
          <input
            {...register("fullName")}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="Ayesha Khan"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-danger">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-text/80">Mobile number</label>
            <input
              {...register("phone")}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="03001234567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text/80">Email</label>
            <input
              {...register("email")}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text/80">
            Notes for your doctor (optional)
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="Anything your doctor should know before your visit"
          />
        </div>
      </form>
    </div>
  );
}
