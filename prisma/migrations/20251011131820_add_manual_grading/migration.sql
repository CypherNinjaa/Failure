-- AlterTable
ALTER TABLE "StudentAnswer" ADD COLUMN     "gradedAt" TIMESTAMP(3),
ADD COLUMN     "gradedBy" TEXT,
ADD COLUMN     "pointsAwarded" DOUBLE PRECISION,
ADD COLUMN     "teacherFeedback" TEXT,
ALTER COLUMN "isCorrect" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "StudentAnswer_gradedBy_idx" ON "StudentAnswer"("gradedBy");

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
