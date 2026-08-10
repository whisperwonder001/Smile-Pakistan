"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { BookingState, emptyBooking, PatientDetails } from "./types";
import { submitBooking } from "./actions";
import { TreatmentStep } from "./steps/TreatmentStep";
import { BranchStep } from "./steps/BranchStep";
import { DoctorStep } from "./steps/DoctorStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";

const TOTAL_STEPS = 6;

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [booking, setBooking] = useState<BookingState>(emptyBooking);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function handleDetailsSubmit(details: PatientDetails) {
    setSubmitError(null);
    setSubmitting(true);
    setBooking((b) => ({ ...b, details }));
    try {
      const result = await submitBooking({
        serviceSlug: booking.service!.slug,
        branchId: booking.branch!.id,
        doctorId: booking.doctor!.id,
        dateISO: booking.dateISO!,
        time: booking.time!,
        fullName: details.fullName,
        phone: details.phone,
        email: details.email,
        notes: details.notes,
      });
      setReference(result.reference);
      goTo(6);
    } catch {
      setSubmitError(
        "We couldn't confirm your booking — please try again, or call the branch directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const canProceed = (() => {
    switch (step) {
      case 1:
        return !!booking.service;
      case 2:
        return !!booking.branch;
      case 3:
        return !!booking.doctor;
      case 4:
        return !!booking.dateISO && !!booking.time;
      default:
        return true;
    }
  })();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <StepIndicator currentStep={Math.min(step, TOTAL_STEPS)} />

      <div className="relative mt-10 min-h-[420px] overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/[0.03] sm:p-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && (
              <TreatmentStep
                selected={booking.service}
                onSelect={(service) => setBooking((b) => ({ ...b, service }))}
              />
            )}
            {step === 2 && (
              <BranchStep
                selected={booking.branch}
                onSelect={(branch) => setBooking((b) => ({ ...b, branch }))}
              />
            )}
            {step === 3 && (
              <DoctorStep
                branch={booking.branch}
                service={booking.service}
                selected={booking.doctor}
                onSelect={(doctor) => setBooking((b) => ({ ...b, doctor }))}
              />
            )}
            {step === 4 && (
              <DateTimeStep
                doctor={booking.doctor}
                dateISO={booking.dateISO}
                time={booking.time}
                onSelectDate={(dateISO) =>
                  setBooking((b) => ({ ...b, dateISO, time: null }))
                }
                onSelectTime={(time) => setBooking((b) => ({ ...b, time }))}
              />
            )}
            {step === 5 && (
              <DetailsStep
                defaultValues={booking.details}
                onSubmit={handleDetailsSubmit}
              />
            )}
            {step === 6 && reference && (
              <ConfirmationStep booking={booking} reference={reference} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 6 && (
        <div className="mt-6">
          {submitError && (
            <p className="mb-3 rounded-xl bg-danger/5 px-4 py-2.5 text-sm text-danger">
              {submitError}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-text/70 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step === 5 ? (
              <button
                type="submit"
                form="details-form"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting ? "Confirming…" : "Confirm Appointment"}
              </button>
            ) : (
              <button
                onClick={() => goTo(step + 1)}
                disabled={!canProceed}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
