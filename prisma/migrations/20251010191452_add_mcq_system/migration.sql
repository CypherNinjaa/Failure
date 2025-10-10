-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE', 'FILL_BLANK', 'MATCH_FOLLOWING');

-- CreateTable
CREATE TABLE "MCQTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subjectId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT true,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT true,
    "passingScore" INTEGER,
    "allowReview" BOOLEAN NOT NULL DEFAULT true,
    "showResults" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCQTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQQuestion" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" JSONB NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "negativeMarking" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCQQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQAttempt" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "unanswered" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL,
    "tabSwitches" INTEGER NOT NULL DEFAULT 0,
    "copyPasteAttempts" INTEGER NOT NULL DEFAULT 0,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "percentageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MCQAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WrongAnswer" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "lastAttempted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WrongAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPoints" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "testsCompleted" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MCQTest_classId_idx" ON "MCQTest"("classId");

-- CreateIndex
CREATE INDEX "MCQTest_subjectId_idx" ON "MCQTest"("subjectId");

-- CreateIndex
CREATE INDEX "MCQTest_teacherId_idx" ON "MCQTest"("teacherId");

-- CreateIndex
CREATE INDEX "MCQTest_deadline_idx" ON "MCQTest"("deadline");

-- CreateIndex
CREATE INDEX "MCQQuestion_testId_idx" ON "MCQQuestion"("testId");

-- CreateIndex
CREATE INDEX "MCQAttempt_studentId_idx" ON "MCQAttempt"("studentId");

-- CreateIndex
CREATE INDEX "MCQAttempt_testId_idx" ON "MCQAttempt"("testId");

-- CreateIndex
CREATE INDEX "MCQAttempt_submittedAt_idx" ON "MCQAttempt"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MCQAttempt_testId_studentId_key" ON "MCQAttempt"("testId", "studentId");

-- CreateIndex
CREATE INDEX "WrongAnswer_studentId_idx" ON "WrongAnswer"("studentId");

-- CreateIndex
CREATE INDEX "WrongAnswer_questionId_idx" ON "WrongAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "WrongAnswer_studentId_questionId_key" ON "WrongAnswer"("studentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPoints_studentId_key" ON "StudentPoints"("studentId");

-- CreateIndex
CREATE INDEX "StudentPoints_totalPoints_idx" ON "StudentPoints"("totalPoints");

-- CreateIndex
CREATE INDEX "StudentPoints_rank_idx" ON "StudentPoints"("rank");

-- AddForeignKey
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MCQTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQAttempt" ADD CONSTRAINT "MCQAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MCQTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQAttempt" ADD CONSTRAINT "MCQAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrongAnswer" ADD CONSTRAINT "WrongAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrongAnswer" ADD CONSTRAINT "WrongAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MCQQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPoints" ADD CONSTRAINT "StudentPoints_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
