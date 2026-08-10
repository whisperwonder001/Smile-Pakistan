import type { Metadata } from "next";
import { BookingWizard } from "@/features/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book an Appointment | Smile Pakistan",
  description:
    "Book your dental appointment online in minutes — choose your treatment, branch, doctor, and preferred time.",
};

export default function BookAppointmentPage() {
  return (
    <section className="enamel-grid min-h-[70vh] bg-gradient-to-b from-white to-bg">
      <div className="mx-auto max-w-3xl px-5 pt-12 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Book Appointment
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-text sm:text-4xl">
          Let's find you a time
        </h1>
        <p className="mt-3 text-muted">
          Six quick steps — no phone call required.
        </p>
      </div>
      <BookingWizard />
    </section>
  );
}
