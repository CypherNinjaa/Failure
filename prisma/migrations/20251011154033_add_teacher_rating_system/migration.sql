-- CreateTable
CREATE TABLE "TeacherRating" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "testId" TEXT,
    "subjectId" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherLeaderboard" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "fiveStarCount" INTEGER NOT NULL DEFAULT 0,
    "fourStarCount" INTEGER NOT NULL DEFAULT 0,
    "threeStarCount" INTEGER NOT NULL DEFAULT 0,
    "twoStarCount" INTEGER NOT NULL DEFAULT 0,
    "oneStarCount" INTEGER NOT NULL DEFAULT 0,
    "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherLeaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherBadge" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "TeacherBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherRating_teacherId_idx" ON "TeacherRating"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherRating_subjectId_idx" ON "TeacherRating"("subjectId");

-- CreateIndex
CREATE INDEX "TeacherRating_rating_idx" ON "TeacherRating"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherRating_studentId_teacherId_testId_key" ON "TeacherRating"("studentId", "teacherId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherLeaderboard_teacherId_key" ON "TeacherLeaderboard"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherBadge_teacherId_idx" ON "TeacherBadge"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherBadge_badgeId_idx" ON "TeacherBadge"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherBadge_teacherId_badgeId_key" ON "TeacherBadge"("teacherId", "badgeId");

-- AddForeignKey
ALTER TABLE "TeacherRating" ADD CONSTRAINT "TeacherRating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRating" ADD CONSTRAINT "TeacherRating_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRating" ADD CONSTRAINT "TeacherRating_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MCQTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherRating" ADD CONSTRAINT "TeacherRating_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherLeaderboard" ADD CONSTRAINT "TeacherLeaderboard_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherBadge" ADD CONSTRAINT "TeacherBadge_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherBadge" ADD CONSTRAINT "TeacherBadge_leaderboard_fkey" FOREIGN KEY ("teacherId") REFERENCES "TeacherLeaderboard"("teacherId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherBadge" ADD CONSTRAINT "TeacherBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
