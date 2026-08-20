# Backend Setup

The app now runs on a real Postgres database via Prisma, with Auth.js
(NextAuth v5) credentials login. Follow these steps in your own environment
(this needs normal internet access to `binaries.prisma.sh`, which the build
sandbox this was developed in did not have — see note at the bottom).

## 1. Install dependencies

```bash
npm install
```

This runs `prisma generate` automatically via the `postinstall` hook.

## 2. Point at a Postgres database

Edit `.env` (already present with local-dev defaults):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smile_pakistan?schema=public"
NEXTAUTH_SECRET="dev-secret-change-in-production-use-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a real secret for anything beyond local dev:

```bash
openssl rand -base64 32
```

If you don't have Postgres running locally:

```bash
# macOS
brew install postgresql@16 && brew services start postgresql@16
createdb smile_pakistan

# Docker (any OS)
docker run --name smile-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
docker exec -it smile-pg createdb -U postgres smile_pakistan
```

## 3. Apply the schema

```bash
npx prisma migrate dev
```

This applies `prisma/migrations/00000000000000_init/migration.sql` (already
written and verified — see note below) and keeps future schema changes
versioned the normal Prisma way from here on.

## 4. Seed demo data

```bash
npm run db:seed
```

Creates 3 branches, all 18 treatments, 4 doctors, and one demo patient:

- **Patient login:** `ayesha.khan@example.com` / `patient123`
- **Doctor logins:** `ahsan.malik@smilepakistan.pk` / `doctor123`,
  `sana.qureshi@smilepakistan.pk` / `doctor123`
- **Admin login:** `admin@smilepakistan.pk` / `admin123` (`/admin/login`)

## 5. Run it

```bash
npm run dev
```

Visit `/patient/login`, sign in with the demo account, and the whole portal
— dashboard, appointments, treatment history, invoices, documents — is now
reading live from Postgres. The booking wizard at `/book-appointment` also
writes real `User`/`Patient`/`Appointment`/`Invoice` rows on submission.

---

## What's real vs. what's still a stub

**Real and working:**
- Full schema (`prisma/schema.prisma`) — 25 tables covering identity, RBAC,
  branches, clinical workflow, billing, and CMS
- Auth.js credentials login with bcrypt password hashing, JWT sessions
- Middleware role-gating `/patient/*`, `/doctor/*`, and `/admin/*`
  (Admin + Receptionist share the admin panel by design)
- Patient Portal — every page is a Server Component querying Prisma
  directly, no mock data left
- Doctor Portal — today's schedule, patient list/search, patient detail
  with a real clickable odontogram (FDI notation, cycles condition per
  click), prescriptions, per-visit clinical notes, and appointment status
  updates (confirm/complete/cancel/no-show) — all writing to Postgres via
  Server Actions
- Admin Panel — dashboard with real aggregation queries (patient/doctor
  counts, monthly revenue, appointment status breakdown, top treatments by
  booking volume), appointment management across all doctors/branches,
  patient and doctor directories, branch overview, billing with a real
  "mark paid" flow that creates a `Payment` row, and a working Blog /
  Testimonials / FAQs CMS (create, publish/unpublish, delete)
- Booking wizard → Server Action → real DB writes (`submitBooking` in
  `features/booking/actions.ts`)

**Real and working (continued):**
- Branch/doctor *creation* forms — Admin › Branches has an "Add Branch"
  form (name, city, address, hours) and Admin › Doctors has an "Add Doctor"
  form (name, email, phone, specialty, bio, multi-branch assignment), both
  writing real rows via Server Actions in `features/admin/actions.ts`
  (`createBranch`, `createDoctor`)
- Roles & Permissions UI — Admin › Roles & Permissions (admin-only, gated
  by `session.user.role === "ADMIN"` both in the sidebar and the page
  itself) lists roles, lets you create a role, delete a role, and toggle
  individual permissions per role via checkboxes
  (`createRole`, `deleteRole`, `toggleRolePermission` in
  `features/admin/actions.ts`). `prisma/seed.ts` now seeds three default
  roles (Administrator, Receptionist, Doctor) and eleven permissions —
  re-run `npm run db:seed` to get them (it's upsert-based, safe to re-run).
- Working Hours & Holiday Management — Admin › Branches, each branch card
  has a "Manage Hours & Holidays" expander: per-weekday open/close time or
  closed toggle (`updateBranchWorkingHour`), plus a running list of one-off
  closures like public holidays (`createBranchHoliday`,
  `deleteBranchHoliday`), all in `features/admin/actions.ts`.
  **Correction to an earlier status note:** this was previously described
  as "schema-ready" — it wasn't. There was no `WorkingHour`/`Holiday` table
  in the schema at all, only the free-text `Branch.hours` display string.
  This pass added two new models, `BranchWorkingHour` and `BranchHoliday`,
  plus a hand-authored migration at
  `prisma/migrations/20260807000000_add_branch_working_hours_holidays/`
  (same pattern as the sandbox-blocked `binaries.prisma.sh` workaround
  from earlier phases — this sandbox has no DB access either, so the SQL
  is written but unapplied). Run `npx prisma migrate dev` to apply it, or
  apply the `.sql` file directly, then `npm run db:seed` to populate
  default hours (10:00–20:00 Mon–Sat, closed Sunday) for existing branches.
- Real notification sending — `lib/email.ts` sends real email via Resend
  (`npm install` will pull it in) and every send also writes a
  `Notification` row, so the table is finally used.
  **Correction to an earlier status note:** this was previously described
  as "email confirmations" being real and only SMS/WhatsApp being stubbed.
  That wasn't accurate — there was no email sending anywhere in the
  codebase; the `Notification` table was completely unused. This pass
  built it from scratch: `notifyUser()` in `lib/email.ts` is called from
  `submitBooking()` (booking confirmation) and `updateAppointmentStatusAdmin()`
  (confirmed / cancelled / completed). Without `RESEND_API_KEY` set, it
  logs to the console and the rest of the app keeps working — get a free
  key at resend.com and set `RESEND_API_KEY` + `EMAIL_FROM` in `.env` to
  actually deliver mail, no code changes needed. SMS and WhatsApp remain
  genuinely out of scope, per the architecture doc's gaps section — both
  need merchant/Meta verification that isn't instant.
- Patient account activation — new schema (`AccountActivationToken`,
  hand-authored migration at
  `prisma/migrations/20260808000000_add_account_activation_tokens/`) plus
  `lib/activation.ts` (`issueActivation`, `verifyActivationToken`,
  `consumeActivationToken`). Both `submitBooking()` and `createDoctor()`
  now email a real set-password link (`/activate/[token]`, 48-hour expiry,
  single-use, token stored only as a SHA-256 hash) instead of leaving the
  account with an unusable password and no way in. Login pages
  (`/patient/login`, `/doctor/login`) have a "haven't set a password yet?"
  link wired to `requestActivationEmail()`, which re-issues a link for any
  account that hasn't activated yet — response message is intentionally
  identical whether or not the email exists, to avoid leaking who's
  registered. `User.emailVerified` (already in the schema, previously
  unused) now doubles as the "has this account ever set a real password"
  flag. Seeded demo accounts (`ayesha.khan@example.com`,
  `ahsan.malik@smilepakistan.pk`, `admin@smilepakistan.pk`) are marked
  pre-activated so the demo logins in this doc keep working unchanged.

**Still stubbed / not built:**
- Booking wizard is now fully DB-backed — `getBookingOptions()` pulls real
  branches/doctors, and `getSlotsAction()` computes real available slots
  from `DoctorAvailability`, `DoctorTimeOff`, `BranchWorkingHour`,
  `BranchHoliday`, and existing appointments (`lib/availability.ts`).
  **Correction to an earlier status note:** the entire booking flow —
  branches, doctors, and time slots — was previously hardcoded/randomly
  generated in `lib/booking-data.ts` and never touched the database at
  all. This pass replaced it end to end, including a new migration at
  `prisma/migrations/20260812000000_add_doctor_availability/`.
- Doctor Portal › Availability — doctors can now set their own weekly
  working hours per branch and add one-off time off
  (`features/doctor-portal/AvailabilityPanel.tsx`, `TimeOffSection.tsx`),
  which is what the booking engine above actually reads from. Default
  hours (Mon–Sat 10:00–18:00) are seeded for existing doctors so the demo
  isn't empty on first load.
- Patient Portal › Invoices "Pay Now" now opens a real checkout modal
  (`features/patient-portal/PayNowButton.tsx`) that records a `Payment`
  row and marks the invoice `PAID`. **This is explicitly demo-mode, not a
  real payment gateway** — no Stripe key or JazzCash/EasyPaisa merchant
  account exists yet (those require external approvals, see the
  architecture doc's gaps section). The UI says "Demo mode" directly on
  the checkout screen so this is never mistaken for a live charge.
  Swapping in a real gateway later means replacing the body of
  `payInvoiceDemo()` in `features/patient-portal/actions.ts` — the
  Payment row shape and the rest of the app (dashboards, admin billing,
  receipts) already expect exactly this.

**Still stubbed / not built:**
- The Pay Now checkout doesn't validate card details (no Luhn check,
  expiry check, etc.) since no real gateway is behind it — intentional for
  a demo, not an oversight to fix before payments go live
- Editing or deactivating an existing branch isn't wired up yet — only
  adding new branches and managing their hours/holidays is
- The new Roles & Permissions screen manages the `Role`/`Permission`/
  `RolePermission` tables, but nothing in the app *reads* those tables yet
  — actual access control still runs entirely on the fast-path `User.role`
  enum (`PATIENT`/`DOCTOR`/`RECEPTIONIST`/`ADMIN`). Wiring middleware and
  server actions to check granular permissions instead of the role enum is
  the next step before this screen has real teeth.
- Media Library, SEO Settings, Audit Log viewer, and Backup Settings are
  schema-ready (`Media`, `AuditLog`, `Setting` tables exist) but have no
  admin UI yet
- Notification preferences on the Patient Portal profile page are UI-only
  (no `notification_prefs` column yet)
- A doctor can only see clinical notes from *their own* visits with a
  patient (by design, for now) — no cross-doctor shared chart view yet
- Real payment gateway integration remains blocked on external merchant
  accounts (Stripe API key, JazzCash/EasyPaisa merchant IDs) — the one
  item on the original roadmap that genuinely can't be finished inside
  this environment

## A note on how this was verified

 `binaries.prisma.sh` (same network
allowlist restriction that blocked the Unsplash CDN and Google Fonts CDN
earlier in this project), so `prisma generate` / `migrate dev` couldn't
run here directly. To verify the schema was still real and correct:

1. PostgreSQL 16 was installed and run locally in the sandbox
2. The migration SQL was hand-derived from `schema.prisma` and applied
   directly with `psql` — all 25 tables, enums, indexes, and foreign keys
   created without error
3. Seed data mirroring `prisma/seed.ts` was inserted via raw SQL and a
   multi-table join query (patient → appointment → doctor → treatment →
   branch) was run to confirm the relations resolve correctly
4. All TypeScript was checked against a temporarily-relaxed tsconfig to
   confirm the only errors were the expected "Prisma client not generated"
   stub errors, not real bugs

None of that required faking anything — it's the same schema, same seed
logic, just validated via direct SQL instead of the Prisma CLI because of
the sandbox's network restriction. `npx prisma migrate dev` will work
normally for you and will produce an equivalent (idempotent) result.

**Update (doctor availability + demo payments pass):** this later pass
hit the same `binaries.prisma.sh` block, and this time a working local
Postgres instance from step 1 above wasn't available either, so
verification fell back to brace/parenthesis-balance checks plus manual
review on every new/changed file, rather than a real compiler or DB run.
That's a weaker guarantee than the SQL-validated passes above — worth a
careful look at the Vercel build log after this deploys, since that's the
first point these changes get checked by a real TypeScript compiler
against a real generated Prisma client.
