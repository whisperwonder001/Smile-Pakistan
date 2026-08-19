import { Service } from "@/lib/services-data";
import { BookingBranch as Branch, BookingDoctor as Doctor } from "./actions";

export interface PatientDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingState {
  service: Service | null;
  branch: Branch | null;
  doctor: Doctor | null;
  dateISO: string | null;
  time: string | null;
  details: PatientDetails | null;
}

export const emptyBooking: BookingState = {
  service: null,
  branch: null,
  doctor: null,
  dateISO: null,
  time: null,
  details: null,
};

export const STEP_LABELS = [
  "Treatment",
  "Branch",
  "Doctor",
  "Date & Time",
  "Your Details",
  "Confirm",
] as const;
