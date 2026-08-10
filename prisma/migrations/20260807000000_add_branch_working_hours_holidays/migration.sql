-- CreateTable: branch_working_hours
CREATE TABLE "branch_working_hours" (
  "id" TEXT PRIMARY KEY,
  "branchId" TEXT NOT NULL,
  "weekday" INTEGER NOT NULL,
  "isClosed" BOOLEAN NOT NULL DEFAULT false,
  "openTime" TEXT,
  "closeTime" TEXT,
  CONSTRAINT "branch_working_hours_branchId_fkey" FOREIGN KEY ("branchId")
    REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "branch_working_hours_branchId_weekday_key"
  ON "branch_working_hours"("branchId", "weekday");

-- CreateTable: branch_holidays
CREATE TABLE "branch_holidays" (
  "id" TEXT PRIMARY KEY,
  "branchId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "label" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "branch_holidays_branchId_fkey" FOREIGN KEY ("branchId")
    REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "branch_holidays_branchId_idx" ON "branch_holidays"("branchId");
