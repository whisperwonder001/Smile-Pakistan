import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { services } from "../lib/services-data";
import { branches, doctors } from "../lib/booking-data";

/**
 * Core seed logic, factored out of the CLI entrypoint (seed.ts) so it can
 * also be called from app/api/setup/route.ts — a one-tap, no-terminal way
 * to seed a freshly-deployed database from a phone. Every write in here is
 * either an upsert or guarded by an existence check, so calling this twice
 * is safe and won't duplicate data.
 */
export async function runSeed(prisma: PrismaClient) {
  console.log("Seeding branches…");
  for (const b of branches) {
    await prisma.branch.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        name: b.name,
        city: b.city,
        address: b.address,
        hours: b.hours,
      },
    });
  }

  console.log("Seeding treatments…");
  for (const s of services) {
    await prisma.treatment.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        category: s.category,
        shortDesc: s.shortDesc,
        priceFrom: s.priceFrom,
        priceTo: s.priceTo,
        durationLabel: s.duration,
      },
    });
  }

  console.log("Seeding doctors…");
  const doctorPassword = await bcrypt.hash("doctor123", 10);
  for (const d of doctors) {
    const [firstEmailPart] = d.name.toLowerCase().replace("dr. ", "").split(" ");
    const email = `${firstEmailPart}.${d.id.split("-").pop()}@smilepakistan.pk`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: doctorPassword,
        fullName: d.name,
        role: "DOCTOR",
        emailVerified: new Date(), // seeded demo accounts are pre-activated
      },
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: d.id,
        userId: user.id,
        specialty: d.role,
      },
    });

    for (const branchId of d.branchIds) {
      await prisma.doctorBranch.upsert({
        where: { doctorId_branchId: { doctorId: doctor.id, branchId } },
        update: {},
        create: { doctorId: doctor.id, branchId },
      });
    }
  }

  console.log("Seeding demo patient…");
  const patientPassword = await bcrypt.hash("patient123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "ayesha.khan@example.com" },
    update: {},
    create: {
      email: "ayesha.khan@example.com",
      passwordHash: patientPassword,
      fullName: "Ayesha Khan",
      phone: "03012345678",
      role: "PATIENT",
      emailVerified: new Date(),
    },
  });

  const demoPatient = await prisma.patient.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      branchId: "lahore-gulberg",
      dob: new Date("1994-03-12"),
    },
  });

  const scaling = await prisma.treatment.findUniqueOrThrow({ where: { slug: "scaling-polishing" } });
  const whitening = await prisma.treatment.findUniqueOrThrow({ where: { slug: "teeth-whitening" } });
  const xray = await prisma.treatment.findUniqueOrThrow({ where: { slug: "digital-x-rays" } });
  const sana = await prisma.doctor.findFirstOrThrow({ where: { id: "dr-sana-qureshi" } });
  const ahsan = await prisma.doctor.findFirstOrThrow({ where: { id: "dr-ahsan-malik" } });

  // The demo appointments/invoices/payments below use plain .create() (no
  // natural unique key to upsert against), so guard the whole block with an
  // existence check — without this, re-running seed (e.g. via the one-tap
  // /api/setup route) would duplicate this demo history every time.
  const alreadySeeded = (await prisma.appointment.count({ where: { patientId: demoPatient.id } })) > 0;
  if (alreadySeeded) {
    console.log("Demo appointment history already seeded, skipping…");
  } else {
    console.log("Seeding demo appointments, invoices, documents…");
    const upcomingAppt = await prisma.appointment.create({
    data: {
      patientId: demoPatient.id,
      doctorId: sana.id,
      branchId: "lahore-gulberg",
      treatmentId: scaling.id,
      startsAt: new Date("2026-08-14T17:00:00Z"),
      status: "CONFIRMED",
    },
  });
  await prisma.invoice.create({
    data: {
      patientId: demoPatient.id,
      appointmentId: upcomingAppt.id,
      branchId: "lahore-gulberg",
      amount: 5000,
      status: "UNPAID",
      description: "Scaling & Polishing",
    },
  });

  const whiteningAppt = await prisma.appointment.create({
    data: {
      patientId: demoPatient.id,
      doctorId: sana.id,
      branchId: "lahore-gulberg",
      treatmentId: whitening.id,
      startsAt: new Date("2026-05-02T15:30:00Z"),
      status: "COMPLETED",
      clinicalNotes: {
        create: {
          doctorId: sana.id,
          note: "In-office whitening, shade improved from A3 to A1. Advised avoiding staining foods for 48 hours.",
        },
      },
    },
  });
  const whiteningInvoice = await prisma.invoice.create({
    data: {
      patientId: demoPatient.id,
      appointmentId: whiteningAppt.id,
      branchId: "lahore-gulberg",
      amount: 22000,
      status: "PAID",
      description: "Teeth Whitening",
    },
  });
  await prisma.payment.create({
    data: { invoiceId: whiteningInvoice.id, amount: 22000, method: "CARD" },
  });

  const xrayAppt = await prisma.appointment.create({
    data: {
      patientId: demoPatient.id,
      doctorId: ahsan.id,
      branchId: "lahore-gulberg",
      treatmentId: xray.id,
      startsAt: new Date("2026-04-18T11:00:00Z"),
      status: "COMPLETED",
      clinicalNotes: {
        create: {
          doctorId: ahsan.id,
          note: "Routine check-up. Minor plaque buildup noted, scaling recommended.",
        },
      },
    },
  });
  const xrayInvoice = await prisma.invoice.create({
    data: {
      patientId: demoPatient.id,
      appointmentId: xrayAppt.id,
      branchId: "lahore-gulberg",
      amount: 3500,
      status: "PAID",
      description: "Digital X-ray & Check-up",
    },
  });
  await prisma.payment.create({
    data: {
      invoiceId: xrayInvoice.id,
      amount: 3500,
      method: "CASH",
    },
  });

  await prisma.xray.create({
    data: {
      patientId: demoPatient.id,
      fileUrl: "https://example.com/xrays/panoramic-apr-2026.jpg",
      label: "Panoramic X-ray — Apr 2026",
    },
  });
  await prisma.document.create({
    data: {
      patientId: demoPatient.id,
      fileUrl: "https://example.com/reports/whitening-aftercare.pdf",
      name: "Whitening aftercare instructions",
      type: "Report",
    },
  });
  } // end alreadySeeded guard

  console.log("Seeding admin user…");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@smilepakistan.pk" },
    update: {},
    create: {
      email: "admin@smilepakistan.pk",
      passwordHash: adminPassword,
      fullName: "Zara Ahmed",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("Seeding CMS content…");
  const techCategory = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: { name: "Technology", slug: "technology" },
  });

  await prisma.blog.upsert({
    where: { slug: "why-digital-xrays-use-less-radiation" },
    update: {},
    create: {
      slug: "why-digital-xrays-use-less-radiation",
      title: "Why digital X-rays use 90% less radiation",
      excerpt: "A look at how digital sensors compare to traditional film X-rays.",
      content: "Digital X-ray sensors require significantly less radiation than film to produce a usable image, while also giving instant results your dentist can review with you immediately.",
      categoryId: techCategory.id,
      status: "Published",
      publishedAt: new Date("2026-06-01"),
    },
  });

  // skipDuplicates only works against a unique constraint, and neither
  // table has one on these fields — guard with a count check instead so
  // re-running seed doesn't pile up duplicate testimonials/FAQs.
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "Fatima R.", city: "Lahore", quote: "I finally understood what was happening with my molar once they showed me the X-ray on screen.", rating: 5 },
        { name: "Usman T.", city: "Karachi", quote: "Booked online at 11pm, got a slot the next morning for an emergency filling.", rating: 5 },
      ],
    });
  }

  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({
      data: [
        { question: "Do I need a referral to book an appointment?", answer: "No — you can book directly online or by phone for any treatment.", category: "Booking", sortOrder: 1 },
        { question: "What payment methods do you accept?", answer: "Cash, card, JazzCash, and EasyPaisa at all branches.", category: "Billing", sortOrder: 2 },
      ],
    });
  }

  console.log("Seeding roles & permissions…");
  const permissionDefs = [
    { key: "appointments.manage", label: "Manage appointments (confirm, cancel, reschedule)" },
    { key: "appointments.view", label: "View appointments" },
    { key: "patients.manage", label: "Create and edit patient records" },
    { key: "patients.view", label: "View patient records" },
    { key: "billing.manage", label: "Create invoices and record payments" },
    { key: "billing.refund", label: "Issue refunds" },
    { key: "doctors.manage", label: "Add and edit doctors" },
    { key: "branches.manage", label: "Add and edit branches" },
    { key: "cms.manage", label: "Publish blog posts, testimonials, and FAQs" },
    { key: "roles.manage", label: "Manage roles and permissions" },
    { key: "settings.manage", label: "Manage clinic settings" },
  ];
  const permissionRecords: Record<string, { id: string }> = {};
  for (const p of permissionDefs) {
    permissionRecords[p.key] = await prisma.permission.upsert({
      where: { key: p.key },
      update: { label: p.label },
      create: p,
    });
  }

  const roleDefs = [
    {
      name: "Administrator",
      description: "Full access to every module, including roles and settings.",
      permissionKeys: permissionDefs.map((p) => p.key),
    },
    {
      name: "Receptionist",
      description: "Front-desk operations: appointments, patients, and billing.",
      permissionKeys: [
        "appointments.manage",
        "appointments.view",
        "patients.manage",
        "patients.view",
        "billing.manage",
      ],
    },
    {
      name: "Doctor",
      description: "Clinical access to their own patients and appointments.",
      permissionKeys: ["appointments.view", "patients.view"],
    },
  ];
  for (const r of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    for (const key of r.permissionKeys) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permissionRecords[key].id } },
        update: {},
        create: { roleId: role.id, permissionId: permissionRecords[key].id },
      });
    }
  }

  console.log("Seeding branch working hours…");
  const allBranches = await prisma.branch.findMany();
  // 0=Sun ... 6=Sat. Default: open 10:00–20:00 Mon–Sat, closed Sunday.
  for (const b of allBranches) {
    for (let weekday = 0; weekday <= 6; weekday++) {
      const isClosed = weekday === 0;
      await prisma.branchWorkingHour.upsert({
        where: { branchId_weekday: { branchId: b.id, weekday } },
        update: {},
        create: {
          branchId: b.id,
          weekday,
          isClosed,
          openTime: isClosed ? null : "10:00",
          closeTime: isClosed ? null : "20:00",
        },
      });
    }
  }

  console.log("Seeding doctor availability…");
  // Default: each doctor works 10:00–18:00 Mon–Sat at every branch they're
  // assigned to (comfortably inside every branch's working hours), so the
  // booking flow has real slots out of the box. Doctors can adjust this
  // from their portal afterwards.
  const allDoctorBranches = await prisma.doctorBranch.findMany();
  for (const db of allDoctorBranches) {
    for (let weekday = 1; weekday <= 6; weekday++) {
      await prisma.doctorAvailability.upsert({
        where: {
          doctorId_branchId_weekday_startTime: {
            doctorId: db.doctorId,
            branchId: db.branchId,
            weekday,
            startTime: "10:00",
          },
        },
        update: {},
        create: {
          doctorId: db.doctorId,
          branchId: db.branchId,
          weekday,
          startTime: "10:00",
          endTime: "18:00",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Demo patient login: ayesha.khan@example.com / patient123");
  console.log("Demo admin login: admin@smilepakistan.pk / admin123");
}
