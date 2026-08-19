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
 * treatmentCategories has no DB column — it's marketing-matching metadata
 * ("which doctors handle Cosmetic treatments"), not a scheduling concept.
 * Live booking data (features/booking/actions.ts) pulls real
 * branches/doctors from the DB but looks up this tag map by doctor id to
 * fill that field in. The arrays above remain the seed source of truth for
 * branches/doctors themselves.
 */
export const doctorCategoryTags: Record<string, string[]> = Object.fromEntries(
  doctors.map((d) => [d.id, d.treatmentCategories])
);

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
