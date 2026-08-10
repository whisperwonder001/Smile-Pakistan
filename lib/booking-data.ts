export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  branchIds: string[];
  treatmentCategories: string[];
}

export const branches: Branch[] = [
  {
    id: "lahore-gulberg",
    name: "Gulberg III",
    city: "Lahore",
    address: "12-C, Main Boulevard, Gulberg III, Lahore",
    hours: "Mon–Sat, 10:00 AM – 9:00 PM",
  },
  {
    id: "karachi-clifton",
    name: "Clifton",
    city: "Karachi",
    address: "Block 5, Clifton, Karachi",
    hours: "Mon–Sat, 10:00 AM – 9:00 PM",
  },
  {
    id: "islamabad-f7",
    name: "F-7 Markaz",
    city: "Islamabad",
    address: "F-7 Markaz, Islamabad",
    hours: "Mon–Sat, 10:00 AM – 8:00 PM",
  },
];

export const doctors: Doctor[] = [
  {
    id: "dr-ahsan-malik",
    name: "Dr. Ahsan Malik",
    role: "Prosthodontist & Implantologist",
    branchIds: ["lahore-gulberg", "islamabad-f7"],
    treatmentCategories: ["Restorative", "Surgical & Preventive"],
  },
  {
    id: "dr-sana-qureshi",
    name: "Dr. Sana Qureshi",
    role: "Orthodontist",
    branchIds: ["lahore-gulberg", "karachi-clifton"],
    treatmentCategories: ["Cosmetic", "Family & Diagnostics"],
  },
  {
    id: "dr-bilal-hashmi",
    name: "Dr. Bilal Hashmi",
    role: "Oral & Maxillofacial Surgeon",
    branchIds: ["karachi-clifton", "islamabad-f7"],
    treatmentCategories: ["Surgical & Preventive"],
  },
  {
    id: "dr-mahnoor-siddiqui",
    name: "Dr. Mahnoor Siddiqui",
    role: "Pediatric Dentist",
    branchIds: ["lahore-gulberg", "karachi-clifton", "islamabad-f7"],
    treatmentCategories: ["Family & Diagnostics", "Restorative"],
  },
];

export function doctorsForBranch(branchId: string) {
  return doctors.filter((d) => d.branchIds.includes(branchId));
}

export function doctorsForCategory(category: string) {
  return doctors.filter((d) => d.treatmentCategories.includes(category));
}

/**
 * Deterministically generates a day's slots from a seed (date + doctor id)
 * so the same inputs always produce the same "availability" — avoids a
 * backend for this front-end milestone while still feeling realistic.
 */
export function slotsForDay(dateISO: string, doctorId: string): { time: string; available: boolean }[] {
  const seed = hashString(dateISO + doctorId);
  const slots: { time: string; available: boolean }[] = [];
  let hour = 10;
  let minute = 0;
  let i = 0;
  while (hour < 21) {
    const label = `${hour % 12 === 0 ? 12 : hour % 12}:${minute === 0 ? "00" : "30"} ${hour < 12 ? "AM" : "PM"}`;
    const available = (seed + i * 7) % 5 !== 0; // ~80% available
    slots.push({ time: label, available });
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
    i += 1;
  }
  return slots;
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function nextDays(count: number) {
  const days: { iso: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}
