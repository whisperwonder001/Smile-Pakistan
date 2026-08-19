import { prisma } from "@/lib/prisma";

const SLOT_MINUTES = 30;

export interface TimeSlot {
  time: string; // "10:00 AM"
  available: boolean;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatLabel(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const meridiem = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m === 0 ? "00" : String(m).padStart(2, "0")} ${meridiem}`;
}

/**
 * Computes real bookable time slots for a doctor at a branch on a given
 * date, from: branch working hours, branch holidays, the doctor's own
 * recurring weekly availability at that branch, one-off doctor time off,
 * and existing (non-cancelled) appointments already on the doctor's books.
 */
export async function getAvailableSlots(
  doctorId: string,
  branchId: string,
  dateISO: string
): Promise<TimeSlot[]> {
  const date = new Date(dateISO + "T00:00:00");
  const weekday = date.getDay();

  const [branchHoliday, branchHours, doctorAvailability, timeOff, appointments] =
    await Promise.all([
      prisma.branchHoliday.findFirst({
        where: {
          branchId,
          date: { gte: date, lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.branchWorkingHour.findUnique({
        where: { branchId_weekday: { branchId, weekday } },
      }),
      prisma.doctorAvailability.findMany({
        where: { doctorId, branchId, weekday },
      }),
      prisma.doctorTimeOff.findFirst({
        where: {
          doctorId,
          date: { gte: date, lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.appointment.findMany({
        where: {
          doctorId,
          startsAt: { gte: date, lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
          status: { notIn: ["CANCELLED"] },
        },
        select: { startsAt: true },
      }),
    ]);

  // Branch closed (holiday or regular closed day) => nothing bookable.
  if (branchHoliday || !branchHours || branchHours.isClosed) return [];

  // Doctor took the whole day off.
  if (timeOff && !timeOff.startTime && !timeOff.endTime) return [];

  // Doctor has no configured availability at this branch on this weekday.
  if (doctorAvailability.length === 0) return [];

  const branchOpen = toMinutes(branchHours.openTime!);
  const branchClose = toMinutes(branchHours.closeTime!);
  const timeOffStart = timeOff?.startTime ? toMinutes(timeOff.startTime) : null;
  const timeOffEnd = timeOff?.endTime ? toMinutes(timeOff.endTime) : null;
  const bookedMinutes = new Set(
    appointments.map((a) => {
      const d = a.startsAt;
      return d.getHours() * 60 + d.getMinutes();
    })
  );

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: TimeSlot[] = [];
  const seen = new Set<number>();

  for (const window of doctorAvailability) {
    const start = Math.max(toMinutes(window.startTime), branchOpen);
    const end = Math.min(toMinutes(window.endTime), branchClose);

    for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
      if (seen.has(t)) continue;
      seen.add(t);

      const inTimeOff =
        timeOffStart !== null && timeOffEnd !== null && t >= timeOffStart && t < timeOffEnd;
      const inPast = isToday && t <= nowMinutes;
      const booked = bookedMinutes.has(t);

      slots.push({
        time: formatLabel(t),
        available: !inTimeOff && !inPast && !booked,
      });
    }
  }

  slots.sort((a, b) => toMinutesFromLabel(a.time) - toMinutesFromLabel(b.time));
  return slots;
}

function toMinutesFromLabel(label: string): number {
  const match = label.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}
