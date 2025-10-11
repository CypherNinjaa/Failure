/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCQAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCQQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCQTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentPoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WrongAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Achievement" DROP CONSTRAINT "Achievement_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQAttempt" DROP CONSTRAINT "MCQAttempt_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQAttempt" DROP CONSTRAINT "MCQAttempt_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQQuestion" DROP CONSTRAINT "MCQQuestion_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQTest" DROP CONSTRAINT "MCQTest_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQTest" DROP CONSTRAINT "MCQTest_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MCQTest" DROP CONSTRAINT "MCQTest_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentPoints" DROP CONSTRAINT "StudentPoints_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WrongAnswer" DROP CONSTRAINT "WrongAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WrongAnswer" DROP CONSTRAINT "WrongAnswer_studentId_fkey";

-- DropTable
DROP TABLE "public"."Achievement";

-- DropTable
DROP TABLE "public"."MCQAttempt";

-- DropTable
DROP TABLE "public"."MCQQuestion";

-- DropTable
DROP TABLE "public"."MCQTest";

-- DropTable
DROP TABLE "public"."StudentPoints";

-- DropTable
DROP TABLE "public"."WrongAnswer";

-- DropEnum
DROP TYPE "public"."QuestionType";
