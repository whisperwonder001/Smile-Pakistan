-- CreateTable: doctor_availabilities
CREATE TABLE "doctor_availabilities" (
  "id" TEXT PRIMARY KEY,
  "doctorId" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "weekday" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  CONSTRAINT "doctor_availabilities_doctorId_fkey" FOREIGN KEY ("doctorId")
    REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "doctor_availabilities_branchId_fkey" FOREIGN KEY ("branchId")
    REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "doctor_availabilities_doctorId_branchId_weekday_startTime_key"
  ON "doctor_availabilities"("doctorId", "branchId", "weekday", "startTime");

CREATE INDEX "doctor_availabilities_doctorId_weekday_idx"
  ON "doctor_availabilities"("doctorId", "weekday");

-- CreateTable: doctor_time_off
CREATE TABLE "doctor_time_off" (
  "id" TEXT PRIMARY KEY,
  "doctorId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "startTime" TEXT,
  "endTime" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "doctor_time_off_doctorId_fkey" FOREIGN KEY ("doctorId")
    REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "doctor_time_off_doctorId_date_idx" ON "doctor_time_off"("doctorId", "date");
