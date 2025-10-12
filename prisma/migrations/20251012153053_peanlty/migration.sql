-- AlterTable
ALTER TABLE "CheatingSuspension" ADD COLUMN     "reducedAt" TIMESTAMP(3),
ADD COLUMN     "reducedBy" TEXT,
ADD COLUMN     "reductionReason" TEXT,
ADD COLUMN     "wasReduced" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PenaltyReduction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "originalSuspensionId" TEXT,
    "violationsRemoved" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "reducedBy" TEXT NOT NULL,
    "reducedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cleanTestsCompleted" INTEGER NOT NULL DEFAULT 0,
    "daysWithoutViolation" INTEGER NOT NULL DEFAULT 0,
    "goodBehaviorScore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PenaltyReduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PenaltyReduction_studentId_idx" ON "PenaltyReduction"("studentId");

-- CreateIndex
CREATE INDEX "PenaltyReduction_reducedAt_idx" ON "PenaltyReduction"("reducedAt");
