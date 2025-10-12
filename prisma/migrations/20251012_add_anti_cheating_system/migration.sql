-- AlterTable
ALTER TABLE "MCQAttempt" ADD COLUMN "cheatingViolations" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "violationDetails" JSONB,
ADD COLUMN "isTerminatedForCheating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "finalPenaltyPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CheatingSuspension" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "violationCount" INTEGER NOT NULL,
    "suspendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suspendedUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheatingSuspension_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheatingSuspension_studentId_idx" ON "CheatingSuspension"("studentId");

-- CreateIndex
CREATE INDEX "CheatingSuspension_isActive_idx" ON "CheatingSuspension"("isActive");

-- AddForeignKey
ALTER TABLE "CheatingSuspension" ADD CONSTRAINT "CheatingSuspension_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
