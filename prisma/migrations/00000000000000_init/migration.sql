-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN');
CREATE TYPE "AppointmentStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'STRIPE', 'PAYPAL', 'JAZZCASH', 'EASYPAISA');

-- CreateTable: users
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
  "emailVerified" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: roles / permissions (admin-configurable RBAC)
CREATE TABLE "roles" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT
);

CREATE TABLE "permissions" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL
);

CREATE TABLE "role_permissions" (
  "roleId" TEXT NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "permissionId" TEXT NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
  PRIMARY KEY ("roleId", "permissionId")
);

-- CreateTable: branches
CREATE TABLE "branches" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "hours" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: patients
CREATE TABLE "patients" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "dob" TIMESTAMP,
  "gender" TEXT,
  "address" TEXT,
  "branchId" TEXT REFERENCES "branches"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: doctors
CREATE TABLE "doctors" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "specialty" TEXT NOT NULL,
  "bio" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: receptionists
CREATE TABLE "receptionists" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "branchId" TEXT NOT NULL REFERENCES "branches"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: doctor_branches (join)
CREATE TABLE "doctor_branches" (
  "doctorId" TEXT NOT NULL REFERENCES "doctors"("id") ON DELETE CASCADE,
  "branchId" TEXT NOT NULL REFERENCES "branches"("id") ON DELETE CASCADE,
  PRIMARY KEY ("doctorId", "branchId")
);

-- CreateTable: treatments
CREATE TABLE "treatments" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "shortDesc" TEXT NOT NULL,
  "priceFrom" INTEGER NOT NULL,
  "priceTo" INTEGER NOT NULL,
  "durationLabel" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: appointments
CREATE TABLE "appointments" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "doctorId" TEXT NOT NULL REFERENCES "doctors"("id"),
  "branchId" TEXT NOT NULL REFERENCES "branches"("id"),
  "treatmentId" TEXT NOT NULL REFERENCES "treatments"("id"),
  "startsAt" TIMESTAMP NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);
CREATE INDEX "appointments_doctorId_startsAt_idx" ON "appointments"("doctorId", "startsAt");
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateTable: treatment_plans
CREATE TABLE "treatment_plans" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "doctorId" TEXT NOT NULL REFERENCES "doctors"("id"),
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Active',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: treatment_plan_items
CREATE TABLE "treatment_plan_items" (
  "id" TEXT PRIMARY KEY,
  "treatmentPlanId" TEXT NOT NULL REFERENCES "treatment_plans"("id") ON DELETE CASCADE,
  "treatmentId" TEXT NOT NULL REFERENCES "treatments"("id"),
  "toothNumbers" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Planned',
  "estimatedCost" INTEGER NOT NULL
);

-- CreateTable: clinical_notes
CREATE TABLE "clinical_notes" (
  "id" TEXT PRIMARY KEY,
  "appointmentId" TEXT NOT NULL REFERENCES "appointments"("id") ON DELETE CASCADE,
  "doctorId" TEXT NOT NULL REFERENCES "doctors"("id"),
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: medical_records
CREATE TABLE "medical_records" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "allergies" TEXT,
  "conditions" TEXT,
  "medications" TEXT,
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: odontogram
CREATE TABLE "odontogram" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "toothNumber" INTEGER NOT NULL,
  "condition" TEXT NOT NULL,
  "notes" TEXT,
  "updatedAt" TIMESTAMP NOT NULL,
  UNIQUE ("patientId", "toothNumber")
);

-- CreateTable: prescriptions
CREATE TABLE "prescriptions" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "doctorId" TEXT NOT NULL REFERENCES "doctors"("id"),
  "medication" TEXT NOT NULL,
  "dosage" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: xrays
CREATE TABLE "xrays" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "fileUrl" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "takenAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: documents
CREATE TABLE "documents" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "fileUrl" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: invoices
CREATE TABLE "invoices" (
  "id" TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES "patients"("id") ON DELETE CASCADE,
  "appointmentId" TEXT UNIQUE REFERENCES "appointments"("id"),
  "branchId" TEXT NOT NULL REFERENCES "branches"("id"),
  "amount" INTEGER NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: payments
CREATE TABLE "payments" (
  "id" TEXT PRIMARY KEY,
  "invoiceId" TEXT NOT NULL REFERENCES "invoices"("id") ON DELETE CASCADE,
  "amount" INTEGER NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "reference" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: categories / blogs
CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE
);

CREATE TABLE "blogs" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "categoryId" TEXT REFERENCES "categories"("id"),
  "coverImage" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Draft',
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL
);

-- CreateTable: testimonials
CREATE TABLE "testimonials" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: faqs
CREATE TABLE "faqs" (
  "id" TEXT PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'General',
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable: media
CREATE TABLE "media" (
  "id" TEXT PRIMARY KEY,
  "url" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "altText" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: notifications
CREATE TABLE "notifications" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: audit_logs
CREATE TABLE "audit_logs" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "users"("id"),
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- CreateTable: settings
CREATE TABLE "settings" (
  "key" TEXT PRIMARY KEY,
  "value" TEXT NOT NULL
);
